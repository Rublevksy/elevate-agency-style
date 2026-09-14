/**
 * The Builder migration, tested against a real Postgres (PGlite):
 *
 *   node scripts/check-builder-db.ts
 *
 * Covers: public roles locked out of every table and function (grants AND RLS),
 * token-hash ownership, server-assigned generations and revisions, superseded
 * concepts kept, cross-lead references refused, submission idempotency and
 * lock, controlled status enum with audit trail, the shared rate limiter, and
 * column limits.
 */
import assert from "node:assert/strict";
import { FIXTURE_DRAFTS, FIXTURE_DRAFTS_B } from "../src/lib/builder/fixtures.dev.ts";
import { asRole, createBuilderTestDb, pgliteRpc } from "./lib/builder-pglite.ts";

const db = await createBuilderTestDb();
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

const H1 = "a".repeat(64);
const H2 = "b".repeat(64);
type Snap = {
  lead: {
    id: string;
    lifecycle: string;
    selectedConceptId: string | null;
    generationCount: number;
    brief: { project: { company: string } };
  };
  concepts: {
    id: string;
    revision: number;
    position: number;
    spec: { name: string; palette: { background: string } };
  }[];
  revisions: { revision: number; kind: string; restoredFrom: number | null }[];
};

const brief = {
  projectType: "web",
  project: {
    company: "Studio Test",
    industry: "Architektura",
    offering: "Architektonické studio pro rodinné domy.",
    audience: "Rodiny",
    goal: "Poptávky",
  },
  visual: { style: "Klidný", mood: "", colors: "", typography: "", notes: "" },
  references: { urls: ["https://example.com"], notes: "" },
};

const leadA = (await rpc("builder_create_lead", { p_token_hash: H1, p_lang: "CZ" })) as Snap;
const leadB = (await rpc("builder_create_lead", { p_token_hash: H2, p_lang: "EN" })) as Snap;
const A = leadA.lead.id;
const B = leadB.lead.id;

await test("anon and authenticated cannot read, list or write any builder table", async () => {
  for (const role of ["anon", "authenticated"] as const) {
    for (const table of [
      "builder_leads",
      "builder_concepts",
      "builder_revisions",
      "builder_status_events",
      "builder_rate_limits",
    ]) {
      await asRole(db, role, () =>
        rejects(db.query(`select * from public.${table}`), /permission denied/),
      );
    }
    await asRole(db, role, () =>
      rejects(
        db.query(
          `insert into public.builder_leads (access_token_hash) values ('${"c".repeat(64)}')`,
        ),
        /permission denied/,
      ),
    );
    await asRole(db, role, () =>
      rejects(db.query(`update public.builder_leads set status = 'ARCHIVED'`), /permission denied/),
    );
    await asRole(db, role, () =>
      rejects(db.query(`delete from public.builder_leads`), /permission denied/),
    );
  }
});

await test("anon and authenticated cannot call any builder function", async () => {
  const calls = [
    `select public.builder_get_lead('${A}', '${H1}')`,
    `select public.builder_create_lead('${"d".repeat(64)}', 'CZ')`,
    `select public.builder_set_status('${A}', 'ARCHIVED')`,
    `select public.builder_consume_rate_limit('x:y', 1, 60)`,
    `select public.builder_snapshot('${A}')`,
  ];
  for (const role of ["anon", "authenticated"] as const)
    for (const sql of calls)
      await asRole(db, role, () => rejects(db.query(sql), /permission denied/));
});

await test("RLS is enabled with no policies: even a stray grant returns no rows", async () => {
  const rls = await db.query<{ relname: string; relrowsecurity: boolean }>(
    `select relname, relrowsecurity from pg_class where relname like 'builder\\_%' and relkind = 'r'`,
  );
  assert.equal(rls.rows.length, 5);
  assert.ok(rls.rows.every((r) => r.relrowsecurity));
  const policies = await db.query(`select * from pg_policies where tablename like 'builder\\_%'`);
  assert.equal(policies.rows.length, 0);
  await db.exec(`grant select on public.builder_leads to anon`);
  const rows = await asRole(db, "anon", () => db.query(`select * from public.builder_leads`));
  assert.equal(rows.rows.length, 0);
  await db.exec(`revoke select on public.builder_leads from anon`);
});

await test("a lead is readable and writable only with its own token hash", async () => {
  assert.equal(await rpc("builder_get_lead", { p_lead: A, p_token_hash: H2 }), null);
  await rejects(
    rpc("builder_save_brief", { p_lead: A, p_token_hash: H2, p_brief: brief, p_lang: "CZ" }),
    /BUILDER:LEAD_NOT_FOUND/,
  );
  const saved = (await rpc("builder_save_brief", {
    p_lead: A,
    p_token_hash: H1,
    p_brief: brief,
    p_lang: "CZ",
  })) as Snap;
  assert.equal(saved.lead.brief.project.company, "Studio Test");
  const snap = (await rpc("builder_get_lead", { p_lead: A, p_token_hash: H1 })) as Record<
    string,
    unknown
  >;
  assert.ok(!JSON.stringify(snap).includes(H1), "snapshot must not expose the token hash");
  assert.ok(!("status" in (snap.lead as object)), "snapshot must not expose the Admin status");
});

await test("concept sets: exactly five, server-assigned generations, superseded sets kept", async () => {
  await rejects(
    rpc("builder_store_concepts", {
      p_lead: A,
      p_token_hash: H1,
      p_specs: FIXTURE_DRAFTS.slice(0, 4),
      p_source: "ai",
      p_max_generations: 3,
    }),
    /BUILDER:INVALID_INPUT/,
  );
  const g1 = (await rpc("builder_store_concepts", {
    p_lead: A,
    p_token_hash: H1,
    p_specs: FIXTURE_DRAFTS,
    p_source: "ai",
    p_max_generations: 3,
  })) as Snap;
  assert.equal(g1.lead.generationCount, 1);
  assert.equal(g1.lead.lifecycle, "concepts_ready");
  assert.deepEqual(
    g1.concepts.map((c) => c.position),
    [1, 2, 3, 4, 5],
  );
  const g2 = (await rpc("builder_store_concepts", {
    p_lead: A,
    p_token_hash: H1,
    p_specs: FIXTURE_DRAFTS_B,
    p_source: "ai",
    p_max_generations: 3,
  })) as Snap;
  assert.equal(g2.lead.generationCount, 2);
  assert.equal(g2.concepts[0].spec.name, FIXTURE_DRAFTS_B[0].name);
  const all = await db.query<{ n: number; superseded: number }>(
    `select count(*)::int as n, count(superseded_at)::int as superseded from public.builder_concepts where lead_id = '${A}'`,
  );
  assert.deepEqual(all.rows[0], { n: 10, superseded: 5 });
  await rpc("builder_store_concepts", {
    p_lead: A,
    p_token_hash: H1,
    p_specs: FIXTURE_DRAFTS,
    p_source: "resync",
    p_max_generations: 3,
  });
  await rejects(
    rpc("builder_store_concepts", {
      p_lead: A,
      p_token_hash: H1,
      p_specs: FIXTURE_DRAFTS,
      p_source: "ai",
      p_max_generations: 3,
    }),
    /BUILDER:GENERATION_LIMIT/,
  );
});

await rpc("builder_save_brief", { p_lead: B, p_token_hash: H2, p_brief: brief, p_lang: "EN" });
const snapA = (await rpc("builder_get_lead", { p_lead: A, p_token_hash: H1 })) as Snap;
const snapB = (await rpc("builder_store_concepts", {
  p_lead: B,
  p_token_hash: H2,
  p_specs: FIXTURE_DRAFTS_B,
  p_source: "ai",
  p_max_generations: 3,
})) as Snap;
const conceptA = snapA.concepts[0];
const conceptB = snapB.concepts[0];

await test("a lead cannot select, read or refine another lead's concept", async () => {
  await rejects(
    rpc("builder_select_concept", { p_lead: A, p_token_hash: H1, p_concept: conceptB.id }),
    /BUILDER:CONCEPT_NOT_FOUND/,
  );
  await rejects(
    rpc("builder_get_concept", { p_lead: A, p_token_hash: H1, p_concept: conceptB.id }),
    /BUILDER:CONCEPT_NOT_FOUND/,
  );
  await rejects(
    rpc("builder_store_refinement", {
      p_lead: A,
      p_token_hash: H1,
      p_concept: conceptB.id,
      p_feedback: "tmavší",
      p_spec: FIXTURE_DRAFTS[1],
      p_expected_revision: 0,
      p_max_revisions: 10,
    }),
    /BUILDER:CONCEPT_NOT_FOUND/,
  );
  // Even a direct write cannot point a lead at a foreign concept (composite FK).
  await rejects(
    db.query(
      `update public.builder_leads set selected_concept_id = '${conceptB.id}' where id = '${A}'`,
    ),
    /foreign key/,
  );
});

await test("selection sets lifecycle; clearing it steps back", async () => {
  const s = (await rpc("builder_select_concept", {
    p_lead: A,
    p_token_hash: H1,
    p_concept: conceptA.id,
  })) as Snap;
  assert.equal(s.lead.selectedConceptId, conceptA.id);
  assert.equal(s.lead.lifecycle, "direction_selected");
  const c = (await rpc("builder_select_concept", {
    p_lead: A,
    p_token_hash: H1,
    p_concept: null,
  })) as Snap;
  assert.equal(c.lead.lifecycle, "concepts_ready");
});

await test("refinements: revision assigned by the database, stale writes refused", async () => {
  await rejects(
    rpc("builder_store_refinement", {
      p_lead: A,
      p_token_hash: H1,
      p_concept: conceptA.id,
      p_feedback: "tmavší",
      p_spec: FIXTURE_DRAFTS[1],
      p_expected_revision: 7,
      p_max_revisions: 10,
    }),
    /BUILDER:REVISION_CONFLICT/,
  );
  const r1 = (await rpc("builder_store_refinement", {
    p_lead: A,
    p_token_hash: H1,
    p_concept: conceptA.id,
    p_feedback: "tmavší",
    p_spec: FIXTURE_DRAFTS[1],
    p_expected_revision: 0,
    p_max_revisions: 10,
  })) as Snap;
  const c1 = r1.concepts.find((c) => c.id === conceptA.id)!;
  assert.equal(c1.revision, 1);
  assert.equal(c1.spec.name, FIXTURE_DRAFTS[1].name);
  assert.equal(r1.revisions.length, 1);
  // The same "revision 0" answer arriving twice (retry, double click) is refused.
  await rejects(
    rpc("builder_store_refinement", {
      p_lead: A,
      p_token_hash: H1,
      p_concept: conceptA.id,
      p_feedback: "tmavší",
      p_spec: FIXTURE_DRAFTS[2],
      p_expected_revision: 0,
      p_max_revisions: 10,
    }),
    /BUILDER:REVISION_CONFLICT/,
  );
});

await test("restore takes the spec from the database, as a new revision", async () => {
  await rejects(
    rpc("builder_restore_revision", {
      p_lead: A,
      p_token_hash: H1,
      p_concept: conceptA.id,
      p_target: 1,
      p_max_revisions: 10,
    }),
    /BUILDER:INVALID_INPUT/,
  );
  const r = (await rpc("builder_restore_revision", {
    p_lead: A,
    p_token_hash: H1,
    p_concept: conceptA.id,
    p_target: 0,
    p_max_revisions: 10,
  })) as Snap;
  const c = r.concepts.find((x) => x.id === conceptA.id)!;
  assert.equal(c.revision, 2);
  assert.equal(c.spec.name, FIXTURE_DRAFTS[0].name);
  assert.deepEqual(
    r.revisions.map((x) => [x.revision, x.kind, x.restoredFrom]),
    [
      [1, "refine", null],
      [2, "restore", 0],
    ],
  );
  await rejects(
    rpc("builder_restore_revision", {
      p_lead: A,
      p_token_hash: H1,
      p_concept: conceptA.id,
      p_target: 0,
      p_max_revisions: 2,
    }),
    /BUILDER:REVISION_LIMIT/,
  );
});

await test("submission: requires a concept of this lead, is idempotent, then locks the lead", async () => {
  const contact = {
    name: "QA",
    email: "qa@example.com",
    company: "Studio Test",
    budgetIndex: 1,
    deadline: "1-3m",
    message: "",
  };
  await rejects(
    rpc("builder_submit", {
      p_lead: A,
      p_token_hash: H1,
      p_concept: conceptB.id,
      p_contact: contact,
      p_budget_czk: 50000,
    }),
    /BUILDER:NO_SELECTION/,
  );
  const first = (await rpc("builder_submit", {
    p_lead: A,
    p_token_hash: H1,
    p_concept: conceptA.id,
    p_contact: contact,
    p_budget_czk: 50000,
  })) as { alreadySubmitted: boolean; snapshot: Snap };
  assert.equal(first.alreadySubmitted, false);
  assert.equal(first.snapshot.lead.lifecycle, "submitted");
  const again = (await rpc("builder_submit", {
    p_lead: A,
    p_token_hash: H1,
    p_concept: conceptA.id,
    p_contact: { ...contact, name: "Changed" },
    p_budget_czk: 1,
  })) as { alreadySubmitted: boolean };
  assert.equal(again.alreadySubmitted, true);
  const row = await db.query<{
    contact_name: string;
    notification_status: string;
    budget_czk: number;
  }>(
    `select contact_name, notification_status, budget_czk from public.builder_leads where id = '${A}'`,
  );
  assert.deepEqual(row.rows[0], {
    contact_name: "QA",
    notification_status: "pending",
    budget_czk: 50000,
  });
  await rejects(
    rpc("builder_save_brief", { p_lead: A, p_token_hash: H1, p_brief: brief, p_lang: "CZ" }),
    /BUILDER:LEAD_LOCKED/,
  );
  await rejects(
    rpc("builder_select_concept", { p_lead: A, p_token_hash: H1, p_concept: null }),
    /BUILDER:LEAD_LOCKED/,
  );
  await rpc("builder_mark_notification", { p_lead: A, p_token_hash: H1, p_delivered: false });
  const n = await db.query<{ notification_status: string; notification_attempts: number }>(
    `select notification_status, notification_attempts from public.builder_leads where id = '${A}'`,
  );
  assert.deepEqual(n.rows[0], { notification_status: "failed", notification_attempts: 1 });
});

await test("a lead cannot be marked submitted without its contact and selection", async () => {
  await rejects(
    db.query(`update public.builder_leads set lifecycle = 'submitted' where id = '${B}'`),
    /builder_leads_submitted_is_complete/,
  );
});

await test("status: controlled enum, Admin-only function, audit trail", async () => {
  await rejects(
    rpc("builder_set_status", { p_lead: A, p_status: "WON", p_note: null }),
    /invalid input value for enum/,
  );
  await rpc("builder_set_status", { p_lead: A, p_status: "REVIEW", p_note: "first look" });
  await rpc("builder_set_status", { p_lead: A, p_status: "CONTACTED", p_note: null });
  const ev = await db.query<{ from_status: string | null; to_status: string; note: string | null }>(
    `select from_status, to_status, note from public.builder_status_events where lead_id = '${A}' order by id`,
  );
  assert.deepEqual(ev.rows, [
    { from_status: null, to_status: "NEW", note: null },
    { from_status: "NEW", to_status: "REVIEW", note: "first look" },
    { from_status: "REVIEW", to_status: "CONTACTED", note: null },
  ]);
  await rejects(
    rpc("builder_set_status", {
      p_lead: "00000000-0000-4000-8000-000000000000",
      p_status: "REVIEW",
      p_note: null,
    }),
    /BUILDER:LEAD_NOT_FOUND/,
  );
});

await test("shared rate limiter: counts per bucket and window, refuses over the limit", async () => {
  const hit = () =>
    rpc("builder_consume_rate_limit", {
      p_bucket: "generate:ip:test",
      p_limit: 3,
      p_window_seconds: 600,
    }) as Promise<{ allowed: boolean; hits: number; retryAfterSeconds: number }>;
  const results = [await hit(), await hit(), await hit(), await hit()];
  assert.deepEqual(
    results.map((r) => r.allowed),
    [true, true, true, false],
  );
  assert.ok(results[3].retryAfterSeconds >= 1 && results[3].retryAfterSeconds <= 600);
  const other = (await rpc("builder_consume_rate_limit", {
    p_bucket: "generate:ip:other",
    p_limit: 3,
    p_window_seconds: 600,
  })) as { allowed: boolean };
  assert.equal(other.allowed, true);
});

await test("column limits hold even for direct writes", async () => {
  await rejects(
    db.query(`update public.builder_leads set company = repeat('x', 81) where id = '${B}'`),
    /check constraint/,
  );
  await rejects(
    db.query(
      `update public.builder_leads set brief_references = '{"urls": [1,2,3,4,5,6], "notes": ""}' where id = '${B}'`,
    ),
    /check constraint/,
  );
  await rejects(
    db.query(`insert into public.builder_leads (access_token_hash) values ('not-a-hash')`),
    /check constraint/,
  );
});

await test("stale empty drafts can be purged; leads with concepts are kept", async () => {
  const empty = (await rpc("builder_create_lead", {
    p_token_hash: "e".repeat(64),
    p_lang: "CZ",
  })) as Snap;
  await db.query(
    `update public.builder_leads set updated_at = now() - interval '40 days' where id in ('${empty.lead.id}', '${B}')`,
  );
  // updated_at trigger re-stamps on update; set it with the trigger disabled.
  await db.exec(`alter table public.builder_leads disable trigger builder_leads_touch`);
  await db.query(
    `update public.builder_leads set updated_at = now() - interval '40 days' where id in ('${empty.lead.id}', '${B}')`,
  );
  await db.exec(`alter table public.builder_leads enable trigger builder_leads_touch`);
  const n = (await rpc("builder_purge_stale_drafts", { p_older_than: "30 days" })) as number;
  assert.equal(n, 1);
  assert.equal(
    await rpc("builder_get_lead", { p_lead: empty.lead.id, p_token_hash: "e".repeat(64) }),
    null,
  );
  assert.ok(await rpc("builder_get_lead", { p_lead: B, p_token_hash: H2 }));
});

console.log(`\n${passed} database checks passed`);
