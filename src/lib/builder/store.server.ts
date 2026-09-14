/**
 * The Builder's only way into the database: typed calls to the `builder_*`
 * functions of `supabase/migrations/20260914120000_builder_leads.sql`.
 *
 * Every call goes through one `Rpc` function, so the same store runs against
 * Supabase in production (service role, server-side only) and against PGlite
 * with the real migration in `scripts/check-builder-service.ts`.
 *
 * Failures are reduced to BuilderError codes: 'BUILDER:<CODE>' raised by the
 * database maps to that code; anything else (network, missing credentials,
 * PostgREST down) becomes PERSISTENCE_UNAVAILABLE. Raw database messages are
 * logged server-side only.
 */
import { BuilderError, BUILDER_ERROR_CODES, type BuilderErrorCode } from "./errors";
import type { Contact, BriefDraft } from "./brief";
import type { DesignSpecDraft } from "./spec";

export type Rpc = (fn: string, args: Record<string, unknown>) => Promise<unknown>;

export type RateLimitResult = { allowed: boolean; hits: number; retryAfterSeconds: number };

function toBuilderError(err: unknown): BuilderError {
  if (err instanceof BuilderError) return err;
  const message =
    err instanceof Error ? err.message : String((err as { message?: unknown })?.message ?? err);
  const match = /BUILDER:([A-Z_]+)/.exec(message);
  if (match && (BUILDER_ERROR_CODES as readonly string[]).includes(match[1])) {
    return new BuilderError(match[1] as BuilderErrorCode);
  }
  if (/invalid input value for enum|violates check constraint|invalid input syntax/.test(message)) {
    return new BuilderError("INVALID_INPUT");
  }
  console.error("[builder-store] persistence failure:", message.slice(0, 300));
  return new BuilderError("PERSISTENCE_UNAVAILABLE");
}

export function createStore(rpc: Rpc) {
  const call = async <T>(fn: string, args: Record<string, unknown>): Promise<T> => {
    try {
      return (await rpc(fn, args)) as T;
    } catch (err) {
      throw toBuilderError(err);
    }
  };

  return {
    createLead: (tokenHash: string, lang: string) =>
      call<unknown>("builder_create_lead", { p_token_hash: tokenHash, p_lang: lang }),

    getLead: (leadId: string, tokenHash: string) =>
      call<unknown>("builder_get_lead", { p_lead: leadId, p_token_hash: tokenHash }),

    saveBrief: (leadId: string, tokenHash: string, brief: BriefDraft, lang: string) =>
      call<unknown>("builder_save_brief", {
        p_lead: leadId,
        p_token_hash: tokenHash,
        p_brief: brief,
        p_lang: lang,
      }),

    storeConcepts: (
      leadId: string,
      tokenHash: string,
      drafts: DesignSpecDraft[],
      source: "ai" | "resync",
      maxGenerations: number,
    ) =>
      call<unknown>("builder_store_concepts", {
        p_lead: leadId,
        p_token_hash: tokenHash,
        p_specs: drafts,
        p_source: source,
        p_max_generations: maxGenerations,
      }),

    getConcept: (leadId: string, tokenHash: string, conceptId: string) =>
      call<{ id: string; revision: number; spec: unknown }>("builder_get_concept", {
        p_lead: leadId,
        p_token_hash: tokenHash,
        p_concept: conceptId,
      }),

    storeRefinement: (
      leadId: string,
      tokenHash: string,
      conceptId: string,
      feedback: string,
      draft: DesignSpecDraft,
      expectedRevision: number,
      maxRevisions: number,
    ) =>
      call<unknown>("builder_store_refinement", {
        p_lead: leadId,
        p_token_hash: tokenHash,
        p_concept: conceptId,
        p_feedback: feedback,
        p_spec: draft,
        p_expected_revision: expectedRevision,
        p_max_revisions: maxRevisions,
      }),

    restoreRevision: (
      leadId: string,
      tokenHash: string,
      conceptId: string,
      target: number,
      maxRevisions: number,
    ) =>
      call<unknown>("builder_restore_revision", {
        p_lead: leadId,
        p_token_hash: tokenHash,
        p_concept: conceptId,
        p_target: target,
        p_max_revisions: maxRevisions,
      }),

    selectConcept: (leadId: string, tokenHash: string, conceptId: string | null) =>
      call<unknown>("builder_select_concept", {
        p_lead: leadId,
        p_token_hash: tokenHash,
        p_concept: conceptId,
      }),

    submit: (
      leadId: string,
      tokenHash: string,
      conceptId: string,
      contact: Contact,
      budgetCzk: number,
    ) =>
      call<{ alreadySubmitted: boolean; snapshot: unknown }>("builder_submit", {
        p_lead: leadId,
        p_token_hash: tokenHash,
        p_concept: conceptId,
        p_contact: contact,
        p_budget_czk: budgetCzk,
      }),

    markNotification: (leadId: string, tokenHash: string, delivered: boolean) =>
      call<null>("builder_mark_notification", {
        p_lead: leadId,
        p_token_hash: tokenHash,
        p_delivered: delivered,
      }),

    consumeRateLimit: (bucket: string, limit: number, windowSeconds: number) =>
      call<RateLimitResult>("builder_consume_rate_limit", {
        p_bucket: bucket,
        p_limit: limit,
        p_window_seconds: windowSeconds,
      }),
  };
}

export type BuilderStore = ReturnType<typeof createStore>;
