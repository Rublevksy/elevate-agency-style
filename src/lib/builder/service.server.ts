/**
 * Builder lifecycle — the server's authoritative operations.
 *
 *   loadSession      the visitor's saved lead (from their cookie), or null
 *   saveBrief        creates the lead on first save, then stores the brief
 *   generate         brief → rate limits → AI → five validated concepts stored atomically
 *   resyncConcepts   stores concepts that were generated but could not be saved
 *   refine           concept spec read FROM THE DATABASE → AI → stored as the next revision
 *   restore          an earlier version (from the database) as the next revision
 *   select           the chosen direction
 *   submit           contact stored and lead locked; then the team is notified
 *
 * Nothing here trusts the browser for identity or ordering: the lead comes from
 * the session cookie, concept ownership and revision numbers are checked and
 * assigned by the database functions, every DesignSpec is re-validated before
 * it is stored, and every input is parsed with the shared zod schemas.
 *
 * Dependencies are injected (store, AI caller, notifier), so the whole module
 * is tested against the real migration in PGlite with a fake model
 * (`scripts/check-builder-service.ts`).
 */
import { z } from "zod";
import {
  BUDGET_VALUES,
  BriefDraftSchema,
  BriefSchema,
  ContactSchema,
  LANGS,
  type Brief,
} from "./brief";
import { AiError, type ToolCaller } from "./ai-provider.server";
import { generateConceptDrafts, refineConceptDraft } from "./ai.server";
import { BuilderError } from "./errors";
import { hashToken, newToken, type BuilderSession } from "./session.server";
import { snapshotToLead } from "./snapshot";
import type { BuilderStore } from "./store.server";
import { assessDistinctness, parseDraft, toSpec, type DesignSpecDraft } from "./spec";
import { toContactPayload } from "./submission";
import type { Lead } from "./brief";

/* ------------------------------------------------------------------------ */
/* Limits                                                                    */
/* ------------------------------------------------------------------------ */

/**
 * Shared, persistent limits (`builder_consume_rate_limit`). Sized so a real
 * visitor never meets them in normal use — typing autosaves are debounced and
 * a brief rarely needs more than a couple of generations — while a script
 * cannot turn the model or the database into a free resource.
 */
export const LIMITS = {
  createLead: { perClient: { limit: 12, windowSeconds: 3600 } },
  write: { perClient: { limit: 300, windowSeconds: 600 } },
  generate: {
    perClient: { limit: 5, windowSeconds: 600 },
    perClientDaily: { limit: 20, windowSeconds: 86_400 },
    perLead: { limit: 3, windowSeconds: 600 },
    maxGenerationsPerLead: 6,
  },
  refine: {
    perClient: { limit: 30, windowSeconds: 600 },
    perLead: { limit: 20, windowSeconds: 600 },
    maxRevisionsPerLead: 80,
  },
} as const;

/* ------------------------------------------------------------------------ */
/* Context                                                                   */
/* ------------------------------------------------------------------------ */

export type Notifier = (payload: ReturnType<typeof toContactPayload>) => Promise<void>;

export type BuilderContext = {
  store: BuilderStore;
  ai: ToolCaller;
  notify: Notifier;
  /** Hashed client address (`clientKey`). */
  client: string;
  session: BuilderSession | null;
  /**
   * Called the moment a lead is created, before anything else can fail, so the
   * session cookie is set even if a later step (the model, say) errors — the
   * saved brief must never be orphaned from the visitor's browser.
   */
  onSession: (session: BuilderSession) => void;
  /** Budget labels for the team message (the site's CZ strings, injected by the caller). */
  budgetLabels: readonly string[];
  /** Retry delays for transient persistence failures after an AI answer (ms). */
  retryDelays?: number[];
};

export type Result = { lead: Lead };

const Lang = z.enum(LANGS);

function leadOf(raw: unknown): Lead {
  const lead = snapshotToLead(raw);
  if (!lead) {
    console.error("[builder-service] database returned a snapshot that failed validation");
    throw new BuilderError("PERSISTENCE_UNAVAILABLE");
  }
  return lead;
}

function parse<S extends z.ZodTypeAny>(schema: S, input: unknown): z.infer<S> {
  const parsed = schema.safeParse(input);
  if (!parsed.success) throw new BuilderError("INVALID_INPUT");
  return parsed.data;
}

async function limit(
  ctx: BuilderContext,
  bucket: string,
  rule: { limit: number; windowSeconds: number },
) {
  const result = await ctx.store.consumeRateLimit(bucket, rule.limit, rule.windowSeconds);
  if (!result?.allowed) throw new BuilderError("RATE_LIMITED");
}

function requireSession(ctx: BuilderContext): BuilderSession {
  if (!ctx.session) throw new BuilderError("LEAD_NOT_FOUND");
  return ctx.session;
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Retries only transient persistence failures; ownership/limit errors are final. */
async function withPersistenceRetry<T>(ctx: BuilderContext, op: () => Promise<T>): Promise<T> {
  const delays = ctx.retryDelays ?? [300, 1200];
  for (let attempt = 0; ; attempt++) {
    try {
      return await op();
    } catch (err) {
      const transient = err instanceof BuilderError && err.code === "PERSISTENCE_UNAVAILABLE";
      if (!transient || attempt >= delays.length) throw err;
      await sleep(delays[attempt]);
    }
  }
}

function aiFailure(err: unknown): never {
  if (err instanceof AiError) throw new BuilderError(err.code);
  if (err instanceof BuilderError) throw err;
  console.error("[builder-service] unexpected AI failure", (err as Error)?.name);
  throw new BuilderError("AI_UNAVAILABLE");
}

/* ------------------------------------------------------------------------ */
/* Operations                                                                */
/* ------------------------------------------------------------------------ */

export async function loadSession(ctx: BuilderContext): Promise<Lead | null> {
  if (!ctx.session) return null;
  const raw = await ctx.store.getLead(ctx.session.leadId, await hashToken(ctx.session.token));
  return raw ? leadOf(raw) : null;
}

/** Creates a lead and its session. The token leaves this function only in the cookie. */
async function createLead(ctx: BuilderContext, lang: string): Promise<BuilderSession> {
  await limit(ctx, `create:client:${ctx.client}`, LIMITS.createLead.perClient);
  const token = newToken();
  const lead = leadOf(await ctx.store.createLead(await hashToken(token), lang));
  const session = { leadId: lead.id, token };
  ctx.session = session;
  ctx.onSession(session);
  return session;
}

/** Resolves the visitor's lead, creating one if the cookie is missing or stale. */
async function ensureLead(ctx: BuilderContext, lang: string): Promise<BuilderSession> {
  if (ctx.session) {
    const existing = await ctx.store.getLead(
      ctx.session.leadId,
      await hashToken(ctx.session.token),
    );
    if (existing) return ctx.session;
  }
  return createLead(ctx, lang);
}

const SaveBriefInput = z.object({ lang: Lang, brief: BriefDraftSchema });

export async function saveBrief(ctx: BuilderContext, input: unknown): Promise<Result> {
  const { lang, brief } = parse(SaveBriefInput, input);
  const session = await ensureLead(ctx, lang);
  await limit(ctx, `write:client:${ctx.client}`, LIMITS.write.perClient);
  const lead = leadOf(
    await ctx.store.saveBrief(session.leadId, await hashToken(session.token), brief, lang),
  );
  return { lead };
}

const GenerateInput = z.object({ lang: Lang, brief: BriefSchema });

export type GenerateResult =
  | (Result & { saved: true })
  /** The model answered but the database could not take it: the concepts are returned for resync. */
  | { saved: false; drafts: DesignSpecDraft[] };

export async function generate(ctx: BuilderContext, input: unknown): Promise<GenerateResult> {
  const { lang, brief } = parse(GenerateInput, input);
  const session = await ensureLead(ctx, lang);
  const hash = await hashToken(session.token);

  // The brief is saved first: whatever happens next, the visitor's words are on record.
  const before = leadOf(await ctx.store.saveBrief(session.leadId, hash, brief, lang));
  if (before.generationCount >= LIMITS.generate.maxGenerationsPerLead) {
    throw new BuilderError("GENERATION_LIMIT");
  }
  await limit(ctx, `generate:client:${ctx.client}`, LIMITS.generate.perClient);
  await limit(ctx, `generate:client-day:${ctx.client}`, LIMITS.generate.perClientDaily);
  await limit(ctx, `generate:lead:${session.leadId}`, LIMITS.generate.perLead);

  let drafts: DesignSpecDraft[];
  try {
    drafts = await generateConceptDrafts(ctx.ai, brief as Brief, lang);
  } catch (err) {
    aiFailure(err);
  }

  try {
    const stored = await withPersistenceRetry(ctx, () =>
      ctx.store.storeConcepts(
        session.leadId,
        hash,
        drafts,
        "ai",
        LIMITS.generate.maxGenerationsPerLead,
      ),
    );
    return { saved: true, lead: leadOf(stored) };
  } catch (err) {
    if (err instanceof BuilderError && err.code === "PERSISTENCE_UNAVAILABLE") {
      return { saved: false, drafts };
    }
    throw err;
  }
}

const ResyncInput = z.object({ drafts: z.array(z.unknown()).length(5) });

/**
 * Saves concepts the model produced while the database was unavailable. They
 * come back from the browser, so they are validated exactly like model output
 * (schema, sanitising, claims, distinctness) and recorded with source 'resync'.
 */
export async function resyncConcepts(ctx: BuilderContext, input: unknown): Promise<Result> {
  const { drafts: raw } = parse(ResyncInput, input);
  const session = requireSession(ctx);
  await limit(ctx, `write:client:${ctx.client}`, LIMITS.write.perClient);
  const drafts: DesignSpecDraft[] = [];
  for (const d of raw) {
    const parsed = parseDraft(d, { rejectClaims: true });
    if (!parsed.ok) throw new BuilderError("INVALID_INPUT");
    drafts.push(parsed.draft);
  }
  if (assessDistinctness(drafts).length > 0) throw new BuilderError("INVALID_INPUT");
  const lead = leadOf(
    await ctx.store.storeConcepts(
      session.leadId,
      await hashToken(session.token),
      drafts,
      "resync",
      LIMITS.generate.maxGenerationsPerLead,
    ),
  );
  return { lead };
}

const RefineInput = z.object({
  lang: Lang,
  conceptId: z.string().uuid(),
  feedback: z.string().trim().min(3).max(600),
  /** The revision the visitor was looking at. Compared, never used as the new number. */
  expectedRevision: z.number().int().min(0),
});

export async function refine(
  ctx: BuilderContext,
  input: unknown,
): Promise<Result & { revision: number }> {
  const { lang, conceptId, feedback, expectedRevision } = parse(RefineInput, input);
  const session = requireSession(ctx);
  const hash = await hashToken(session.token);

  // The spec the model revises is the stored one, not whatever the browser holds.
  const current = await ctx.store.getConcept(session.leadId, hash, conceptId);
  if (current.revision !== expectedRevision) throw new BuilderError("REVISION_CONFLICT");
  const currentDraft = parseDraft(current.spec);
  if (!currentDraft.ok) throw new BuilderError("PERSISTENCE_UNAVAILABLE");
  const snapshot = leadOf(await ctx.store.getLead(session.leadId, hash));
  const brief = BriefSchema.safeParse(snapshot.brief);
  if (!brief.success) throw new BuilderError("INVALID_INPUT");
  if (snapshot.revisions.length >= LIMITS.refine.maxRevisionsPerLead)
    throw new BuilderError("REVISION_LIMIT");

  await limit(ctx, `refine:client:${ctx.client}`, LIMITS.refine.perClient);
  await limit(ctx, `refine:lead:${session.leadId}`, LIMITS.refine.perLead);

  let draft: DesignSpecDraft;
  try {
    draft = await refineConceptDraft(
      ctx.ai,
      brief.data,
      toSpec(currentDraft.draft, conceptId, current.revision),
      feedback,
      lang,
    );
  } catch (err) {
    aiFailure(err);
  }

  const lead = leadOf(
    await withPersistenceRetry(ctx, () =>
      ctx.store.storeRefinement(
        session.leadId,
        hash,
        conceptId,
        feedback,
        draft,
        current.revision,
        LIMITS.refine.maxRevisionsPerLead,
      ),
    ),
  );
  const revision = lead.concepts.find((c) => c.id === conceptId)?.revision ?? current.revision + 1;
  return { lead, revision };
}

const RestoreInput = z.object({ conceptId: z.string().uuid(), target: z.number().int().min(0) });

export async function restore(ctx: BuilderContext, input: unknown): Promise<Result> {
  const { conceptId, target } = parse(RestoreInput, input);
  const session = requireSession(ctx);
  await limit(ctx, `write:client:${ctx.client}`, LIMITS.write.perClient);
  const lead = leadOf(
    await ctx.store.restoreRevision(
      session.leadId,
      await hashToken(session.token),
      conceptId,
      target,
      LIMITS.refine.maxRevisionsPerLead,
    ),
  );
  return { lead };
}

const SelectInput = z.object({ conceptId: z.string().uuid().nullable() });

export async function select(ctx: BuilderContext, input: unknown): Promise<Result> {
  const { conceptId } = parse(SelectInput, input);
  const session = requireSession(ctx);
  await limit(ctx, `write:client:${ctx.client}`, LIMITS.write.perClient);
  const lead = leadOf(
    await ctx.store.selectConcept(session.leadId, await hashToken(session.token), conceptId),
  );
  return { lead };
}

const SubmitInput = z.object({ conceptId: z.string().uuid(), contact: ContactSchema });

export type SubmitResult = Result & { alreadySubmitted: boolean; notified: boolean };

export async function submit(ctx: BuilderContext, input: unknown): Promise<SubmitResult> {
  const { conceptId, contact } = parse(SubmitInput, input);
  const session = requireSession(ctx);
  const hash = await hashToken(session.token);
  await limit(ctx, `write:client:${ctx.client}`, LIMITS.write.perClient);

  const result = await ctx.store.submit(
    session.leadId,
    hash,
    conceptId,
    contact,
    BUDGET_VALUES[contact.budgetIndex] ?? 0,
  );
  const lead = leadOf(result.snapshot);
  if (result.alreadySubmitted) return { lead, alreadySubmitted: true, notified: false };

  // The record is saved; the team notification is a separate, honest outcome.
  const spec = lead.concepts.find((c) => c.id === conceptId);
  let notified = false;
  if (spec) {
    try {
      await ctx.notify(
        toContactPayload(lead, spec, contact, ctx.budgetLabels[contact.budgetIndex] ?? ""),
      );
      notified = true;
    } catch (err) {
      console.error(
        "[builder-service] team notification failed for lead",
        lead.id,
        (err as Error)?.message,
      );
    }
  }
  try {
    await ctx.store.markNotification(session.leadId, hash, notified);
  } catch {
    // The lead is saved and locked; a failed status write only leaves notification_status 'pending'.
  }
  return { lead, alreadySubmitted: false, notified };
}
