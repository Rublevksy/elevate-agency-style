/**
 * Read-only verification of the Builder schema on the configured Supabase
 * project, through the same PostgREST API the app uses.
 *
 *   node scripts/verify-builder-remote.ts
 *
 * Reads SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY and (optionally)
 * SUPABASE_SERVICE_ROLE_KEY from the environment or `.env`. Key values are
 * never printed. Nothing is written: table reads use `limit=0`, and the only
 * RPC called is `builder_get_lead` (a STABLE function) with a random id.
 *
 * What it cannot see through PostgREST — indexes, RLS flags, policies, grants,
 * enum values — is checked by scripts/sql/builder-preflight.sql in the SQL
 * editor. Write-path behaviour (ownership, server-assigned revisions,
 * superseded generations) is proven against the identical migration in
 * scripts/check-builder-db.ts and check-builder-service.ts; this script does
 * not create test data on a real project.
 */
import { existsSync, readFileSync } from "node:fs";

const TABLES = [
  "builder_leads",
  "builder_concepts",
  "builder_revisions",
  "builder_status_events",
  "builder_rate_limits",
];

function loadEnv() {
  const env: Record<string, string | undefined> = { ...process.env };
  const file = new URL("../.env", import.meta.url);
  if (existsSync(file)) {
    for (const line of readFileSync(file, "utf8").split("\n")) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/.exec(line);
      if (m && env[m[1]] === undefined) env[m[1]] = m[2];
    }
  }
  return env;
}

const env = loadEnv();
const url = env.SUPABASE_URL;
const anonKey = env.SUPABASE_PUBLISHABLE_KEY;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;

type Outcome = "pass" | "fail" | "skip";
const results: { outcome: Outcome; name: string; detail: string }[] = [];
const record = (outcome: Outcome, name: string, detail: string) => {
  results.push({ outcome, name, detail });
  console.log(`  ${outcome.padEnd(4)}  ${name}${detail ? ` — ${detail}` : ""}`);
};

async function call(key: string, path: string, init?: RequestInit) {
  const res = await fetch(`${url}${path}`, {
    ...init,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "content-type": "application/json",
      ...(init?.headers ?? {}),
    },
    signal: AbortSignal.timeout(20_000),
  });
  const text = await res.text();
  let body: { code?: string; message?: string } | unknown = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text.slice(0, 120);
  }
  const code = (body as { code?: string } | null)?.code;
  return { status: res.status, code, body };
}

const hex = (n: number) =>
  Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => b.toString(16).padStart(2, "0")).join("");

console.log("Builder remote verification (read-only)");
console.log(`  SUPABASE_URL: ${url ? "set" : "MISSING"}`);
console.log(`  SUPABASE_PUBLISHABLE_KEY: ${anonKey ? "set" : "MISSING"}`);
console.log(`  SUPABASE_SERVICE_ROLE_KEY: ${serviceKey ? "set" : "not set"}\n`);

if (!url || !anonKey) {
  console.log("Cannot run: SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY are required.");
  process.exit(2);
}

let schemaMissing = false;

// 1. The public key must not reach any Builder table.
for (const table of TABLES) {
  const r = await call(anonKey, `/rest/v1/${table}?select=*&limit=0`);
  if (r.code === "PGRST205") {
    schemaMissing = true;
    record("fail", `${table} exists`, "not in the API schema: migration not applied");
  } else if (r.code === "42501" || r.status === 401 || r.status === 403) {
    record("pass", `publishable key cannot read ${table}`, `HTTP ${r.status} ${r.code ?? ""}`.trim());
  } else {
    record("fail", `publishable key cannot read ${table}`, `unexpected HTTP ${r.status} ${r.code ?? ""}`);
  }
}

// 2. The public key must not execute Builder functions.
{
  const r = await call(anonKey, "/rest/v1/rpc/builder_get_lead", {
    method: "POST",
    body: JSON.stringify({ p_lead: crypto.randomUUID(), p_token_hash: hex(32) }),
  });
  if (r.code === "42501" || r.status === 401 || r.status === 403) {
    record("pass", "publishable key cannot execute builder_get_lead", `HTTP ${r.status} ${r.code ?? ""}`.trim());
  } else if (r.code === "PGRST202") {
    record(
      schemaMissing ? "fail" : "pass",
      "publishable key cannot execute builder_get_lead",
      schemaMissing ? "function not found: migration not applied" : "function not exposed to this role",
    );
  } else {
    record("fail", "publishable key cannot execute builder_get_lead", `unexpected HTTP ${r.status}`);
  }
}

// 3. The server (service role) can reach them.
if (!serviceKey) {
  record("skip", "service role can read builder tables and call builder_get_lead", "SUPABASE_SERVICE_ROLE_KEY not set");
} else {
  for (const table of TABLES) {
    const r = await call(serviceKey, `/rest/v1/${table}?select=*&limit=0`);
    record(r.status === 200 ? "pass" : "fail", `service role can read ${table}`, `HTTP ${r.status} ${r.code ?? ""}`.trim());
  }
  const r = await call(serviceKey, "/rest/v1/rpc/builder_get_lead", {
    method: "POST",
    body: JSON.stringify({ p_lead: crypto.randomUUID(), p_token_hash: hex(32) }),
  });
  record(
    r.status === 200 && r.body === null ? "pass" : "fail",
    "service role: unknown lead/token returns null (no oracle)",
    `HTTP ${r.status}`,
  );
}

const failed = results.filter((r) => r.outcome === "fail").length;
const skipped = results.filter((r) => r.outcome === "skip").length;
console.log(
  `\n${results.length - failed - skipped} passed, ${failed} failed, ${skipped} skipped` +
    (schemaMissing ? "\nThe Builder migration is NOT applied on this project." : ""),
);
process.exit(failed ? 1 : 0);
