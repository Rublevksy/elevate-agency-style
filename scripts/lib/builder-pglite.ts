/**
 * Test database for the Builder: the real migration, applied to PGlite (Postgres
 * compiled to WASM), inside a Supabase-shaped role setup.
 *
 * Supabase grants every new table and function in `public` to anon,
 * authenticated and service_role by default (`alter default privileges`), and
 * gives service_role BYPASSRLS. The harness reproduces exactly that BEFORE the
 * migration runs, so the migration's own revokes and RLS are what the tests
 * exercise — not a database that was never open in the first place.
 */
import { PGlite } from "@electric-sql/pglite";
import { readFileSync } from "node:fs";

export const MIGRATION = new URL(
  "../../supabase/migrations/20260914120000_builder_leads.sql",
  import.meta.url,
);

export async function createBuilderTestDb() {
  const db = new PGlite();
  await db.exec(`
    create role anon nologin;
    create role authenticated nologin;
    create role service_role nologin bypassrls;
    grant usage on schema public to anon, authenticated, service_role;
    alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
    alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
    alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
  `);
  await db.exec(readFileSync(MIGRATION, "utf8"));
  return db;
}

/** Runs `fn` as a Supabase role, always resetting afterwards. */
export async function asRole<T>(
  db: PGlite,
  role: "anon" | "authenticated" | "service_role",
  fn: () => Promise<T>,
) {
  await db.exec(`set role ${role}`);
  try {
    return await fn();
  } finally {
    await db.exec("reset role");
  }
}

/**
 * The same call shape the server uses against Supabase (`rpc(name, args)`),
 * executed as service_role in PGlite, so the service layer can be tested end to
 * end against the real SQL.
 */
export function pgliteRpc(db: PGlite) {
  return async (fn: string, args: Record<string, unknown>) => {
    if (!/^builder_[a-z_]+$/.test(fn)) throw new Error(`bad function ${fn}`);
    const names = Object.keys(args);
    const sql = `select public.${fn}(${names.map((n, i) => `${n} => $${i + 1}`).join(", ")}) as result`;
    const values = names.map((n) => {
      const v = args[n];
      return v !== null && typeof v === "object" ? JSON.stringify(v) : v;
    });
    await db.exec("set role service_role");
    try {
      const res = await db.query<{ result: unknown }>(sql, values);
      return res.rows[0]?.result ?? null;
    } finally {
      await db.exec("reset role");
    }
  };
}
