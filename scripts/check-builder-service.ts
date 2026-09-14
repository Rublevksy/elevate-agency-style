/**
 * The Builder's server lifecycle, end to end: `service.server.ts` + `store.server.ts`
 * against the real migration (PGlite), with a fake model and a fake notifier.
 *
 *   node --import ./scripts/lib/ts-hooks.mjs scripts/check-builder-service.ts
 *
 * Covers: lead creation and cookie session, brief persistence and reload,
 * invalid input, concept persistence (validated model output only), the
 * resync path when the database fails after the model answered, selection,
 * refinement from the STORED spec with server-assigned revisions, restore,
 * submission and honest notification outcome, ownership (another visitor's
 * session), rate limiting, and failure mapping.
 */
import assert from "node:assert/strict";
import { FIXTURE_DRAFTS, FIXTURE_DRAFTS_B } from "../src/lib/builder/fixtures.dev.ts";
import { createBuilderTestDb, pgliteRpc } from "./lib/builder-pglite.ts";
import { createStore, type Rpc } from "../src/lib/builder/store.server.ts";
import * as svc from "../src/lib/builder/service.server.ts";
import type { ToolCaller } from "../src/lib/builder/ai-provider.server.ts";
import type { BuilderSession } from "../src/lib/builder/session.server.ts";
import { parseSession, serializeSession, hashToken } from "../src/lib/builder/session.server.ts";

const db = await createBuilderTestDb();
const realRpc = pgliteRpc(db);
let passed = 0;

async function test(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ok  ${name}`);
  } catch (err) {
    console.error(`  FAIL ${name}`);
    throw err;
  }
}

async function rejectsCode(p: Promise<unknown>, code: string) {
  await assert.rejects(p, (err: Error) => {
    assert.equal(err.message, code);
    return true;
  });
}

const brief = {
  projectType: "web",
  project: {
    company: "Studio Test",
    industry: "Architektura",
    offering: "Architektonické studio pro rodinné domy a interiéry.",
    audience: "Rodiny",
    goal: "Poptávky",
  },
  visual: { style: "Klidný", mood: "", colors: "", typography: "", notes: "" },
  references: { urls: ["https://example.com"], notes: "" },
};

/** A fake model: answers generation with a set, refinement with a draft; counts calls. */
function fakeAi(opts: { set?: unknown; refinement?: unknown; fail?: Error } = {}) {
  const calls: { tool: string; messages: unknown[] }[] = [];
  const ai: ToolCaller = async (req) => {
    calls.push({ tool: req.tool.name, messages: req.messages });
    if (opts.fail) throw opts.fail;
    const input =
      req.tool.name === "propose_design_directions"
        ? (opts.set ?? { concepts: FIXTURE_DRAFTS })
        : (opts.refinement ?? FIXTURE_DRAFTS[3]);
    return { input, id: `tu_${calls.length}`, transcript: req.messages };
  };
  return { ai, calls };
}

function context(overrides: Partial<svc.BuilderContext> & { rpc?: Rpc } = {}) {
  const cookies: BuilderSession[] = [];
  const notified: unknown[] = [];
  const ctx: svc.BuilderContext = {
    store: createStore(overrides.rpc ?? realRpc),
    ai: fakeAi().ai,
    notify: async (p) => {
      notified.push(p);
    },
    client: "client-a",
    session: null,
    onSession: (s) => cookies.push(s),
    budgetLabels: [
      "Do 20 000 Kč",
      "20 000 – 50 000 Kč",
      "50 000 – 100 000 Kč",
      "100 000 Kč+",
      "Nejsem si jistý",
    ],
    retryDelays: [1, 1],
    ...overrides,
  };
  return { ctx, cookies, notified };
}

let session: BuilderSession;

await test("first brief save creates the lead and sets the session immediately", async () => {
  const { ctx, cookies } = context();
  const res = await svc.saveBrief(ctx, { lang: "CZ", brief: { ...brief, projectType: null } });
  assert.equal(cookies.length, 1);
  session = cookies[0];
  assert.equal(res.lead.id, session.leadId);
  assert.equal(res.lead.lifecycle, "draft");
  assert.deepEqual(parseSession(serializeSession(session)), session);
  const row = await db.query<{ access_token_hash: string }>(
    `select access_token_hash from public.builder_leads where id = $1`,
    [session.leadId],
  );
  assert.equal(row.rows[0].access_token_hash, await hashToken(session.token));
  assert.ok(!JSON.stringify(row.rows).includes(session.token), "the token itself is never stored");
});

await test("brief persists across a reload (a new request with the cookie)", async () => {
  const { ctx } = context({ session });
  await svc.saveBrief(ctx, { lang: "CZ", brief });
  const reloaded = await svc.loadSession(context({ session }).ctx);
  assert.equal(reloaded?.brief.project.company, "Studio Test");
  assert.equal(reloaded?.brief.projectType, "web");
});

await test("session parsing rejects malformed or tampered cookies", async () => {
  for (const bad of [
    undefined,
    "",
    "abc",
    `${session.leadId}`,
    `${session.leadId}.short`,
    `not-a-uuid.${session.token}`,
    `${session.leadId}.${session.token}.x`,
  ]) {
    assert.equal(parseSession(bad), null, String(bad));
  }
});

await test("invalid input is refused before it reaches the database", async () => {
  const { ctx } = context({ session });
  await rejectsCode(svc.saveBrief(ctx, { lang: "DE", brief }), "INVALID_INPUT");
  await rejectsCode(
    svc.saveBrief(ctx, {
      lang: "CZ",
      brief: { ...brief, project: { ...brief.project, company: "x".repeat(81) } },
    }),
    "INVALID_INPUT",
  );
  await rejectsCode(
    svc.generate(ctx, {
      lang: "CZ",
      brief: { ...brief, project: { ...brief.project, offering: "short" } },
    }),
    "INVALID_INPUT",
  );
});

await test("another visitor's session cannot read or change this lead", async () => {
  const forged = { leadId: session.leadId, token: "A".repeat(43) };
  assert.equal(await svc.loadSession(context({ session: forged }).ctx), null);
  await rejectsCode(
    svc.select(context({ session: forged }).ctx, { conceptId: null }),
    "LEAD_NOT_FOUND",
  );
  // A forged session on save starts a NEW lead for that browser instead of touching this one.
  const { ctx, cookies } = context({ session: forged, client: "client-b" });
  const res = await svc.saveBrief(ctx, { lang: "EN", brief });
  assert.notEqual(res.lead.id, session.leadId);
  assert.equal(cookies.length, 1);
});

await test("the model's malformed answer is never stored (one repair, then AI_INVALID)", async () => {
  const bad = fakeAi({ set: { concepts: [FIXTURE_DRAFTS[0]] } });
  await rejectsCode(
    svc.generate(context({ session, ai: bad.ai }).ctx, { lang: "CZ", brief }),
    "AI_INVALID",
  );
  assert.equal(bad.calls.length, 2);
  const n = await db.query<{ n: number }>(
    `select count(*)::int as n from public.builder_concepts where lead_id = $1`,
    [session.leadId],
  );
  assert.equal(n.rows[0].n, 0);
});

await test("AI unavailable: honest error, brief kept, nothing generated", async () => {
  const { ai } = fakeAi({
    fail: new (await import("../src/lib/builder/ai-provider.server.ts")).AiError("AI_UNAVAILABLE"),
  });
  await rejectsCode(
    svc.generate(context({ session, ai }).ctx, { lang: "CZ", brief }),
    "AI_UNAVAILABLE",
  );
  const lead = await svc.loadSession(context({ session }).ctx);
  assert.equal(lead?.brief.project.company, "Studio Test");
  assert.equal(lead?.concepts.length, 0);
});

let conceptId = "";

await test("generation stores five validated concepts with database ids", async () => {
  const { ai, calls } = fakeAi();
  const res = await svc.generate(context({ session, ai, client: "client-gen" }).ctx, {
    lang: "CZ",
    brief,
  });
  assert.equal(res.saved, true);
  assert.ok(res.saved);
  assert.equal(res.lead.concepts.length, 5);
  assert.equal(res.lead.lifecycle, "concepts_ready");
  assert.equal(calls.length, 1);
  conceptId = res.lead.concepts[0].id;
  assert.match(conceptId, /^[0-9a-f-]{36}$/);
});

await test("database failure after the model answered: concepts returned for resync, then saved", async () => {
  // Earlier scenarios used this lead's generation budget (failed AI calls count, they cost).
  await db.exec("delete from public.builder_rate_limits");
  let failStore = true;
  const flaky: Rpc = async (fn, args) => {
    if (fn === "builder_store_concepts" && failStore) throw new Error("fetch failed");
    return realRpc(fn, args);
  };
  const { ai } = fakeAi({ set: { concepts: FIXTURE_DRAFTS_B } });
  const res = await svc.generate(context({ session, ai, rpc: flaky, client: "client-flaky" }).ctx, {
    lang: "CZ",
    brief,
  });
  assert.equal(res.saved, false);
  assert.ok(!res.saved && res.drafts.length === 5);
  failStore = false;
  const saved = await svc.resyncConcepts(context({ session, client: "client-flaky" }).ctx, {
    drafts: !res.saved ? res.drafts : [],
  });
  assert.equal(saved.lead.concepts[0].name, FIXTURE_DRAFTS_B[0].name);
  const src = await db.query<{ source: string }>(
    `select source from public.builder_concepts where lead_id = $1 and superseded_at is null limit 1`,
    [session.leadId],
  );
  assert.equal(src.rows[0].source, "resync");
  conceptId = saved.lead.concepts[0].id;
});

await test("resync re-validates: a tampered concept set is refused", async () => {
  const tampered = FIXTURE_DRAFTS.map((d) => ({ ...d, layout: { ...d.layout, hero: "<iframe>" } }));
  await rejectsCode(
    svc.resyncConcepts(context({ session }).ctx, { drafts: tampered }),
    "INVALID_INPUT",
  );
  const recolours = FIXTURE_DRAFTS.map(() => FIXTURE_DRAFTS[0]);
  await rejectsCode(
    svc.resyncConcepts(context({ session }).ctx, { drafts: recolours }),
    "INVALID_INPUT",
  );
});

await test("selection is persisted; a foreign or superseded concept is refused", async () => {
  const res = await svc.select(context({ session }).ctx, { conceptId });
  assert.equal(res.lead.selectedConceptId, conceptId);
  const old = await db.query<{ id: string }>(
    `select id from public.builder_concepts where lead_id = $1 and superseded_at is not null limit 1`,
    [session.leadId],
  );
  await rejectsCode(
    svc.select(context({ session }).ctx, { conceptId: old.rows[0].id }),
    "CONCEPT_NOT_FOUND",
  );
  await rejectsCode(
    svc.select(context({ session }).ctx, { conceptId: "not-a-uuid" }),
    "INVALID_INPUT",
  );
});

await test("refinement revises the STORED spec; revision numbers come from the database", async () => {
  const { ai, calls } = fakeAi({ refinement: FIXTURE_DRAFTS_B[2] });
  const res = await svc.refine(context({ session, ai }).ctx, {
    lang: "CZ",
    conceptId,
    feedback: "tmavší a méně textu",
    expectedRevision: 0,
  });
  assert.equal(res.revision, 1);
  const concept = res.lead.concepts.find((c) => c.id === conceptId)!;
  assert.equal(concept.name, FIXTURE_DRAFTS_B[2].name);
  assert.equal(concept.revision, 1);
  // The prompt the model saw carried the database's spec (generation B, position 1), not client data.
  assert.ok(JSON.stringify(calls[0].messages).includes(FIXTURE_DRAFTS_B[0].name));
  // A client claiming a stale revision is refused before the model is called.
  const again = fakeAi();
  await rejectsCode(
    svc.refine(context({ session, ai: again.ai }).ctx, {
      lang: "CZ",
      conceptId,
      feedback: "větší typografie",
      expectedRevision: 0,
    }),
    "REVISION_CONFLICT",
  );
  assert.equal(again.calls.length, 0);
});

await test("a refinement whose answer claims figures is repaired, and stored without them", async () => {
  const claimy = {
    ...FIXTURE_DRAFTS_B[1],
    copy: { ...FIXTURE_DRAFTS_B[1].copy, subheadline: "Navrhujeme domy. O 40 % levnější stavba." },
  };
  const { ai, calls } = fakeAi({ refinement: claimy });
  const res = await svc.refine(context({ session, ai }).ctx, {
    lang: "CZ",
    conceptId,
    feedback: "více klidu",
    expectedRevision: 1,
  });
  assert.equal(calls.length, 2, "first answer sent back for repair");
  const concept = res.lead.concepts.find((c) => c.id === conceptId)!;
  assert.equal(concept.copy.subheadline, "Navrhujeme domy.");
  assert.equal(concept.revision, 2);
});

await test("restore brings back a stored version as the next revision", async () => {
  const res = await svc.restore(context({ session }).ctx, { conceptId, target: 0 });
  const concept = res.lead.concepts.find((c) => c.id === conceptId)!;
  assert.equal(concept.revision, 3);
  assert.equal(concept.name, FIXTURE_DRAFTS_B[0].name);
  assert.deepEqual(
    res.lead.revisions.map((r) => [r.revision, r.kind]),
    [
      [1, "refine"],
      [2, "refine"],
      [3, "restore"],
    ],
  );
});

await test("submission is saved and locked; notification failure is reported honestly, not as a lost lead", async () => {
  const contact = {
    name: "QA Test",
    email: "qa@example.com",
    company: "Studio Test",
    budgetIndex: 2,
    deadline: "1-3m",
    message: "Díky",
  };
  const failing = context({
    session,
    notify: async () => {
      throw new Error("SEND_FAILED");
    },
  });
  const res = await svc.submit(failing.ctx, { conceptId, contact });
  assert.equal(res.lead.lifecycle, "submitted");
  assert.equal(res.notified, false);
  const row = await db.query<{
    notification_status: string;
    budget_czk: number;
    contact_email: string;
  }>(
    `select notification_status, budget_czk, contact_email from public.builder_leads where id = $1`,
    [session.leadId],
  );
  assert.deepEqual(row.rows[0], {
    notification_status: "failed",
    budget_czk: 100000,
    contact_email: "qa@example.com",
  });
  const again = context({ session });
  const second = await svc.submit(again.ctx, { conceptId, contact });
  assert.equal(second.alreadySubmitted, true);
  assert.equal(again.notified.length, 0, "no duplicate notification");
  await rejectsCode(svc.saveBrief(context({ session }).ctx, { lang: "CZ", brief }), "LEAD_LOCKED");
});

await test("the team message references the lead id and states no success it did not have", async () => {
  const { ctx, notified } = context({ client: "client-msg" });
  await svc.saveBrief(ctx, { lang: "CZ", brief });
  const gen = await svc.generate(ctx, { lang: "CZ", brief });
  assert.ok(gen.saved);
  const id = gen.saved ? gen.lead.concepts[1].id : "";
  const contact = {
    name: "QA",
    email: "qa@example.com",
    company: "Studio Test",
    budgetIndex: 0,
    deadline: "asap",
    message: "",
  };
  const res = await svc.submit(ctx, { conceptId: id, contact });
  assert.equal(res.notified, true);
  const msg = (notified[0] as { message: string; service: string }).message;
  assert.ok(msg.startsWith(`AI Builder · lead ${ctx.session!.leadId}`));
  assert.ok(msg.length <= 2000);
  const row = await db.query<{ notification_status: string }>(
    `select notification_status from public.builder_leads where id = $1`,
    [ctx.session!.leadId],
  );
  assert.equal(row.rows[0].notification_status, "sent");
});

await test("rate limits are shared (database), honest, and do not block normal use", async () => {
  // Normal use: a visitor autosaving 40 times is fine.
  const { ctx } = context({ client: "client-normal" });
  for (let i = 0; i < 40; i++)
    await svc.saveBrief(ctx, {
      lang: "CZ",
      brief: { ...brief, visual: { ...brief.visual, notes: `v${i}` } },
    });
  // Abuse: the sixth generation from one client inside ten minutes is refused before the model runs.
  const { ai, calls } = fakeAi();
  const results: string[] = [];
  for (let i = 0; i < 7; i++) {
    const c = context({ client: "client-abuse", ai }).ctx;
    try {
      await svc.generate(c, { lang: "CZ", brief });
      results.push("ok");
    } catch (err) {
      results.push((err as Error).message);
    }
  }
  assert.deepEqual(results, ["ok", "ok", "ok", "ok", "ok", "RATE_LIMITED", "RATE_LIMITED"]);
  assert.equal(calls.length, 5, "the model is not called once the limit is reached");
  // The limit is in the database, so a second server instance (new store) sees it too.
  const otherInstance = context({ client: "client-abuse", rpc: pgliteRpc(db), ai }).ctx;
  await rejectsCode(svc.generate(otherInstance, { lang: "CZ", brief }), "RATE_LIMITED");
});

await test("per-lead generation cap is enforced before the model is called", async () => {
  const { ctx } = context({ client: "client-cap" });
  await svc.saveBrief(ctx, { lang: "CZ", brief });
  await db.query(`update public.builder_leads set generation_count = $1 where id = $2`, [
    svc.LIMITS.generate.maxGenerationsPerLead,
    ctx.session!.leadId,
  ]);
  const { ai, calls } = fakeAi();
  await rejectsCode(svc.generate({ ...ctx, ai }, { lang: "CZ", brief }), "GENERATION_LIMIT");
  assert.equal(calls.length, 0);
});

await test("database unavailable: honest PERSISTENCE_UNAVAILABLE, no model call, no fake success", async () => {
  const down: Rpc = async () => {
    throw new Error("TypeError: fetch failed");
  };
  const { ai, calls } = fakeAi();
  const { ctx } = context({ rpc: down, ai, session });
  await rejectsCode(svc.saveBrief(ctx, { lang: "CZ", brief }), "PERSISTENCE_UNAVAILABLE");
  await rejectsCode(svc.generate(ctx, { lang: "CZ", brief }), "PERSISTENCE_UNAVAILABLE");
  await rejectsCode(
    svc.submit(ctx, {
      conceptId,
      contact: {
        name: "a",
        email: "a@b.cz",
        company: "c",
        budgetIndex: 0,
        deadline: "asap",
        message: "",
      },
    }),
    "PERSISTENCE_UNAVAILABLE",
  );
  assert.equal(calls.length, 0);
});

console.log(`\n${passed} service checks passed`);
