/**
 * Admin data contract, tested against the real Builder migration (PGlite):
 *
 *   node --import ./scripts/lib/ts-hooks.mjs scripts/check-admin-contract.ts
 *
 * Applies the Builder migration, then the draft Admin read model
 * (docs/admin/admin-read-model.draft.sql), seeds leads ONLY through the
 * Builder's own database functions, and checks that everything
 * docs/admin/DATA_CONTRACT.md promises can be read — and that nothing of it is
 * reachable by the public roles.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { FIXTURE_DRAFTS, FIXTURE_DRAFTS_B } from "../src/lib/builder/fixtures.dev.ts";
import { parseDraft } from "../src/lib/builder/spec.ts";
import { asRole, createBuilderTestDb, pgliteRpc } from "./lib/builder-pglite.ts";

const db = await createBuilderTestDb();
await db.exec(readFileSync(new URL("../docs/admin/admin-read-model.draft.sql", import.meta.url), "utf8"));
const rpc = pgliteRpc(db);
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

async function rejects(p: Promise<unknown>, pattern: RegExp) {
  await assert.rejects(p, (err: Error) => {
    assert.match(err.message, pattern);
    return true;
  });
}

/* ---- seed through the Builder's own functions ---------------------------- */

const ADMIN = "aaaaaaaa-0000-4000-8000-000000000001";
const FORMER_ADMIN = "aaaaaaaa-0000-4000-8000-000000000002";
const STRANGER = "aaaaaaaa-0000-4000-8000-000000000003";
await db.exec(`
  insert into public.admin_users (user_id, email) values ('${ADMIN}', 'owner@elevateit.cz');
  insert into public.admin_users (user_id, email, revoked_at) values ('${FORMER_ADMIN}', 'former@elevateit.cz', now());
`);

type Snap = { lead: { id: string }; concepts: { id: string }[] };
const hash = (c: string) => c.repeat(64);

const brief = (company: string, email = "") => ({
  projectType: "web",
  project: {
    company,
    industry: "Pražírna kávy",
    offering: "Pražíme výběrovou kávu v malých dávkách a prodáváme ji domácím baristům.",
    audience: "Domácí baristé",
    goal: "Více předplatného",
  },
  visual: { style: "Klidný, řemeslný", mood: "", colors: "", typography: "", notes: email },
  references: { urls: ["https://example.com"], notes: "" },
});
const contact = (name: string, email: string) => ({
  name,
  email,
  company: "Firma s.r.o.",
  budgetIndex: 2,
  deadline: "1-3m",
  message: "Ozvěte se.",
});

async function lead(h: string, company: string) {
  const s = (await rpc("builder_create_lead", { p_token_hash: h, p_lang: "CZ" })) as Snap;
  await rpc("builder_save_brief", { p_lead: s.lead.id, p_token_hash: h, p_brief: brief(company), p_lang: "CZ" });
  return s.lead.id;
}
const store = (id: string, h: string, drafts: unknown[]) =>
  rpc("builder_store_concepts", {
    p_lead: id,
    p_token_hash: h,
    p_specs: drafts,
    p_source: "ai",
    p_max_generations: 6,
  }) as Promise<Snap>;

// A: two generations, refined + restored, submitted, Telegram failed.
const A = await lead(hash("a"), "Horní mlýn");
await store(A, hash("a"), FIXTURE_DRAFTS);
const genA2 = await store(A, hash("a"), FIXTURE_DRAFTS_B);
const chosenA = genA2.concepts[1].id;
await rpc("builder_store_refinement", {
  p_lead: A,
  p_token_hash: hash("a"),
  p_concept: chosenA,
  p_feedback: "tmavší a klidnější",
  p_spec: FIXTURE_DRAFTS[3],
  p_expected_revision: 0,
  p_max_revisions: 80,
});
await rpc("builder_restore_revision", {
  p_lead: A,
  p_token_hash: hash("a"),
  p_concept: chosenA,
  p_target: 0,
  p_max_revisions: 80,
});
await rpc("builder_select_concept", { p_lead: A, p_token_hash: hash("a"), p_concept: chosenA });
await rpc("builder_submit", {
  p_lead: A,
  p_token_hash: hash("a"),
  p_concept: chosenA,
  p_contact: contact("Jana Nováková", "jana@hornimlyn.cz"),
  p_budget_czk: 100000,
});
await rpc("builder_mark_notification", { p_lead: A, p_token_hash: hash("a"), p_delivered: false });

// B: submitted, Telegram delivered. Company contains a literal % for the search test.
const B = await lead(hash("b"), "Sto%Procent");
const genB = await store(B, hash("b"), FIXTURE_DRAFTS);
await rpc("builder_submit", {
  p_lead: B,
  p_token_hash: hash("b"),
  p_concept: genB.concepts[0].id,
  p_contact: contact("Petr Svoboda", "petr@stoprocent.cz"),
  p_budget_czk: 50000,
});
await rpc("builder_mark_notification", { p_lead: B, p_token_hash: hash("b"), p_delivered: true });

// C: concepts, never submitted (a visitor's draft).
const C = await lead(hash("c"), "Rozpracovaný koncept");
await store(C, hash("c"), FIXTURE_DRAFTS_B);

// D: submitted, but the server stopped before notifying (stays 'pending').
const D = await lead(hash("d"), "Tichá dílna");
const genD = await store(D, hash("d"), FIXTURE_DRAFTS);
await rpc("builder_submit", {
  p_lead: D,
  p_token_hash: hash("d"),
  p_concept: genD.concepts[4].id,
  p_contact: contact("Eva Malá", "eva@dilna.cz"),
  p_budget_czk: 20000,
});
await db.exec(`update public.builder_leads set submitted_at = now() - interval '2 hours' where id = '${D}'`);

// E: an empty draft.
await rpc("builder_create_lead", { p_token_hash: hash("e"), p_lang: "EN" });

await rpc("builder_admin_set_status", { p_actor: ADMIN, p_lead: A, p_status: "REVIEW", p_note: "Zajímavé" });
await rpc("builder_admin_set_status", { p_actor: ADMIN, p_lead: A, p_status: "CONTACTED", p_note: null });

const TOKEN_HASHES = ["a", "b", "c", "d", "e"].map(hash);
const noSecrets = (value: unknown) => {
  const text = JSON.stringify(value);
  for (const h of TOKEN_HASHES) assert.ok(!text.includes(h), "an Admin response must never carry a token hash");
  assert.ok(!text.includes("access_token_hash") && !text.includes("accessTokenHash"));
};

/* ---- checks --------------------------------------------------------------- */

await test("public roles cannot execute any Admin function or read the allowlist", async () => {
  const calls = [
    `select public.builder_admin_dashboard()`,
    `select public.builder_admin_list_leads()`,
    `select public.builder_admin_get_lead('${A}')`,
    `select public.builder_admin_list_concepts()`,
    `select public.builder_admin_activity()`,
    `select public.builder_admin_is_active('${ADMIN}')`,
    `select public.builder_admin_set_status('${ADMIN}', '${A}', 'ARCHIVED')`,
    `select * from public.admin_users`,
  ];
  for (const role of ["anon", "authenticated"] as const) {
    for (const sql of calls) {
      await asRole(db, role, () => rejects(db.query(sql), /permission denied/));
    }
  }
});

await test("dashboard: submitted leads by every status, lifecycle counts, no invented numbers", async () => {
  const d = (await rpc("builder_admin_dashboard", {})) as {
    submittedByStatus: Record<string, number>;
    byLifecycle: Record<string, number>;
  };
  assert.deepEqual(d.submittedByStatus, {
    NEW: 2,
    REVIEW: 0,
    CONTACTED: 1,
    PROPOSAL: 0,
    IN_PROGRESS: 0,
    COMPLETED: 0,
    ARCHIVED: 0,
  });
  assert.deepEqual(d.byLifecycle, {
    draft: 1,
    concepts_ready: 1,
    direction_selected: 0,
    submitted: 3,
  });
  assert.deepEqual(Object.keys(d).sort(), [
    "byLifecycle",
    "notificationProblems",
    "recentActivity",
    "recentConcepts",
    "recentLeads",
    "submittedByStatus",
  ]);
});

await test("dashboard: recent leads, recent concepts, activity and Telegram problems", async () => {
  const d = (await rpc("builder_admin_dashboard", {})) as {
    recentLeads: { id: string; notificationStatus: string }[];
    recentConcepts: { leadId: string; current: boolean; selected: boolean }[];
    recentActivity: { leadId: string; kind: string }[];
    notificationProblems: { id: string; problem: string; attempts: number; lastAttemptAt: string | null }[];
  };
  assert.deepEqual(
    d.recentLeads.map((l) => l.id),
    [B, A, D],
    "submitted leads only, newest submission first",
  );
  assert.equal(d.recentConcepts.length, 10);
  assert.ok(d.recentConcepts.some((c) => c.leadId === C), "concepts of unsubmitted leads are visible");
  assert.ok(
    d.recentActivity.every((e) => e.leadId !== C),
    "dashboard activity is limited to submitted leads",
  );
  const problems = Object.fromEntries(d.notificationProblems.map((p) => [p.id, p]));
  assert.equal(problems[A]?.problem, "failed");
  assert.equal(problems[A]?.attempts, 1);
  assert.ok(problems[A]?.lastAttemptAt);
  assert.equal(problems[D]?.problem, "stale_pending");
  assert.equal(problems[B], undefined, "a delivered notification is not a problem");
  noSecrets(d);
});

await test("leads list: filters, literal search, keyset pagination without overlap", async () => {
  type Page = {
    items: { id: string; company: string }[];
    total: number;
    nextCursor: { createdAt: string; id: string } | null;
  };
  const all = (await rpc("builder_admin_list_leads", {})) as Page;
  assert.equal(all.total, 5);
  const submitted = (await rpc("builder_admin_list_leads", { p_lifecycle: "submitted" })) as Page;
  assert.deepEqual(submitted.items.map((i) => i.id).sort(), [A, B, D].sort());
  const contacted = (await rpc("builder_admin_list_leads", { p_status: "CONTACTED" })) as Page;
  assert.deepEqual(contacted.items.map((i) => i.id), [A]);
  const failed = (await rpc("builder_admin_list_leads", { p_notification: "failed" })) as Page;
  assert.deepEqual(failed.items.map((i) => i.id), [A]);

  const byEmail = (await rpc("builder_admin_list_leads", { p_search: "JANA@HORNI" })) as Page;
  assert.deepEqual(byEmail.items.map((i) => i.id), [A]);
  const percent = (await rpc("builder_admin_list_leads", { p_search: "%" })) as Page;
  assert.deepEqual(percent.items.map((i) => i.id), [B], "% is matched literally, not as a wildcard");
  await rejects(rpc("builder_admin_list_leads", { p_search: "x".repeat(101) }), /BUILDER:INVALID_INPUT/);
  await rejects(rpc("builder_admin_list_leads", { p_status: "WON" }), /invalid input value for enum/);

  const seen: string[] = [];
  let cursor: Page["nextCursor"] = null;
  let pages = 0;
  do {
    const page = (await rpc("builder_admin_list_leads", {
      p_limit: 2,
      p_cursor_created: cursor?.createdAt ?? null,
      p_cursor_id: cursor?.id ?? null,
    })) as Page;
    seen.push(...page.items.map((i) => i.id));
    cursor = page.nextCursor;
    pages++;
  } while (cursor && pages < 10);
  assert.equal(pages, 3);
  assert.equal(new Set(seen).size, 5, "every lead exactly once across pages");
  noSecrets(all);
});

await test("lead detail: brief, contact, budget, deadline, status history with actor, Telegram, timestamps", async () => {
  const l = (await rpc("builder_admin_get_lead", { p_lead: A })) as {
    brief: { company: string; visual: { style: string }; references: { urls: string[] } };
    contact: { name: string; email: string; company: string; message: string };
    projectType: string;
    budget: { index: number; czk: number };
    deadline: string;
    status: string;
    lifecycle: string;
    notification: { status: string; attempts: number; lastAttemptAt: string | null; deliveredAt: string | null };
    timestamps: { createdAt: string; updatedAt: string; selectedAt: string; submittedAt: string };
    statusHistory: { fromStatus: string | null; toStatus: string; note: string | null; changedBy: string | null; changedByEmail: string | null }[];
  };
  assert.equal(l.brief.company, "Horní mlýn");
  assert.equal(l.brief.visual.style, "Klidný, řemeslný");
  assert.deepEqual(l.brief.references.urls, ["https://example.com"]);
  assert.equal(l.projectType, "web");
  assert.deepEqual(l.contact, {
    name: "Jana Nováková",
    email: "jana@hornimlyn.cz",
    company: "Firma s.r.o.",
    message: "Ozvěte se.",
  });
  assert.deepEqual(l.budget, { index: 2, czk: 100000 });
  assert.equal(l.deadline, "1-3m");
  assert.equal(l.status, "CONTACTED");
  assert.equal(l.lifecycle, "submitted");
  assert.equal(l.notification.status, "failed");
  assert.equal(l.notification.deliveredAt, null);
  assert.ok(l.notification.lastAttemptAt);
  for (const t of Object.values(l.timestamps)) assert.ok(t);
  assert.deepEqual(
    l.statusHistory.map((e) => [e.fromStatus, e.toStatus, e.note, e.changedByEmail]),
    [
      [null, "NEW", null, null],
      ["NEW", "REVIEW", "Zajímavé", "owner@elevateit.cz"],
      ["REVIEW", "CONTACTED", null, "owner@elevateit.cz"],
    ],
  );
  assert.equal(await rpc("builder_admin_get_lead", { p_lead: "00000000-0000-4000-8000-000000000000" }), null);
  const draft = (await rpc("builder_admin_get_lead", { p_lead: C })) as { contact: unknown; budget: { czk: unknown } };
  assert.equal(draft.contact, null, "no contact before submission");
  assert.equal(draft.budget.czk, null);
  noSecrets(l);
});

await test("concepts: every generation kept, original vs current spec, revisions, one selected", async () => {
  type Concept = {
    id: string;
    revision: number;
    current: boolean;
    selected: boolean;
    source: string;
    originalSpec: unknown;
    spec: unknown;
    revisions: { revision: number; kind: string; feedback: string; restoredFrom: number | null; specBefore: unknown; specAfter: unknown }[];
  };
  const l = (await rpc("builder_admin_get_lead", { p_lead: A })) as {
    generations: { generation: number; supersededAt: string | null; concepts: Concept[] }[];
  };
  assert.deepEqual(l.generations.map((g) => g.generation), [2, 1], "newest generation first");
  assert.equal(l.generations[0].supersededAt, null);
  assert.ok(l.generations[1].supersededAt, "the older generation is marked, not deleted");
  assert.ok(l.generations.every((g) => g.concepts.length === 5));
  assert.ok(l.generations[1].concepts.every((c) => !c.current && !c.selected));

  const all = l.generations.flatMap((g) => g.concepts);
  assert.deepEqual(all.filter((c) => c.selected).map((c) => c.id), [chosenA]);
  const chosen = all.find((c) => c.id === chosenA)!;
  assert.equal(chosen.revision, 2);
  assert.deepEqual(
    chosen.revisions.map((r) => [r.revision, r.kind, r.restoredFrom]),
    [
      [1, "refine", null],
      [2, "restore", 0],
    ],
  );
  assert.equal(chosen.revisions[0].feedback, "tmavší a klidnější");
  assert.deepEqual(chosen.spec, chosen.originalSpec, "restored to the original");
  assert.notDeepEqual(chosen.revisions[0].specAfter, chosen.originalSpec);

  // Admin renders stored specs with ConceptRenderer after re-validating them.
  for (const c of all) {
    for (const spec of [c.originalSpec, c.spec, ...c.revisions.flatMap((r) => [r.specBefore, r.specAfter])]) {
      assert.equal(parseDraft(spec).ok, true);
    }
  }
});

await test("concepts gallery: current/selected filters and pagination", async () => {
  type Page = { items: { id: string; current: boolean; selected: boolean; spec: unknown }[]; nextCursor: { createdAt: string; id: string } | null };
  const current = (await rpc("builder_admin_list_concepts", { p_limit: 60 })) as Page;
  assert.equal(current.items.length, 20, "four leads with a current set of five");
  assert.ok(current.items.every((c) => c.current && c.spec));
  const everything = (await rpc("builder_admin_list_concepts", { p_current_only: false, p_limit: 60 })) as Page;
  assert.equal(everything.items.length, 25);
  const selected = (await rpc("builder_admin_list_concepts", { p_selected_only: true })) as Page;
  assert.equal(selected.items.length, 3);
  assert.ok(selected.items.every((c) => c.selected));

  const ids = new Set<string>();
  let cursor: Page["nextCursor"] = null;
  do {
    const page = (await rpc("builder_admin_list_concepts", {
      p_current_only: false,
      p_limit: 7,
      p_cursor_created: cursor?.createdAt ?? null,
      p_cursor_id: cursor?.id ?? null,
    })) as Page;
    page.items.forEach((c) => ids.add(c.id));
    cursor = page.nextCursor;
  } while (cursor);
  assert.equal(ids.size, 25);
});

await test("activity: derived from recorded timestamps only, newest first", async () => {
  const events = (await rpc("builder_admin_activity", { p_lead: A, p_limit: 100 })) as {
    kind: string;
    at: string;
    detail: Record<string, unknown>;
  }[];
  const kinds = events.map((e) => e.kind);
  for (const kind of [
    "lead_created",
    "concepts_generated",
    "concept_refined",
    "concept_restored",
    "direction_selected",
    "lead_submitted",
    "notification_failed",
    "status_changed",
  ]) {
    assert.ok(kinds.includes(kind), `activity has ${kind}`);
  }
  assert.equal(kinds.filter((k) => k === "concepts_generated").length, 2);
  assert.equal(kinds.filter((k) => k === "status_changed").length, 2);
  assert.ok(!kinds.includes("notification_sent"));
  const times = events.map((e) => Date.parse(e.at));
  assert.deepEqual(times, [...times].sort((x, y) => y - x));
  const sent = (await rpc("builder_admin_activity", { p_lead: B })) as { kind: string }[];
  assert.ok(sent.some((e) => e.kind === "notification_sent"));
  noSecrets(events);
});

await test("pipeline status: active admins only, submitted leads only, audited", async () => {
  for (const actor of [STRANGER, FORMER_ADMIN, null]) {
    await rejects(
      rpc("builder_admin_set_status", { p_actor: actor, p_lead: B, p_status: "PROPOSAL", p_note: null }),
      /BUILDER:FORBIDDEN/,
    );
  }
  await rejects(
    rpc("builder_admin_set_status", { p_actor: ADMIN, p_lead: C, p_status: "REVIEW", p_note: null }),
    /BUILDER:LEAD_NOT_FOUND/,
  );
  await rejects(
    rpc("builder_admin_set_status", { p_actor: ADMIN, p_lead: B, p_status: "LOST", p_note: null }),
    /invalid input value for enum/,
  );
  const updated = (await rpc("builder_admin_set_status", {
    p_actor: ADMIN,
    p_lead: B,
    p_status: "PROPOSAL",
    p_note: "Nabídka odeslána",
  })) as { status: string; statusHistory: { changedBy: string }[] };
  assert.equal(updated.status, "PROPOSAL");
  assert.equal(updated.statusHistory.at(-1)?.changedBy, ADMIN);
  // The visitor's snapshot is unaffected and still carries no status.
  const snap = (await rpc("builder_get_lead", { p_lead: B, p_token_hash: hash("b") })) as { lead: object };
  assert.ok(!("status" in snap.lead));
});

console.log(`\n${passed} admin contract checks passed`);
