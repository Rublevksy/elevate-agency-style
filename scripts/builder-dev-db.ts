/**
 * Local database for developing and QA-ing the Builder without a Supabase
 * project: the real migration in PGlite, behind the one PostgREST endpoint the
 * Builder uses (`POST /rest/v1/rpc/<builder_function>`), executed as
 * service_role.
 *
 *   node scripts/builder-dev-db.ts            # listens on http://localhost:54399
 *
 *   SUPABASE_URL=http://localhost:54399 \
 *   SUPABASE_SERVICE_ROLE_KEY=local-dev-service-role \
 *   node_modules/.bin/vite --port 5184
 *
 * In-memory: data lives as long as this process. Only builder_* functions are
 * served; the service-role key must match (as with real PostgREST, a request
 * without it is refused).
 *
 * Outage drill: `curl -X POST localhost:54399/__outage/on` makes every rpc
 * answer 503 (data kept) until `/__outage/off` — for checking the Builder's
 * recovery paths in the browser.
 */
import http from "node:http";
import { createBuilderTestDb, pgliteRpc } from "./lib/builder-pglite.ts";

const PORT = Number(process.env.BUILDER_DEV_DB_PORT || 54399);
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "local-dev-service-role";

const db = await createBuilderTestDb();
let outage = false;
const rpc = pgliteRpc(db);

http
  .createServer((req, res) => {
    const match = /^\/rest\/v1\/rpc\/(builder_[a-z_]+)$/.exec(req.url ?? "");
    const send = (status: number, body: unknown) => {
      res.writeHead(status, { "content-type": "application/json" });
      res.end(JSON.stringify(body));
    };
    const drill = /^\/__outage\/(on|off)$/.exec(req.url ?? "");
    if (req.method === "POST" && drill) {
      outage = drill[1] === "on";
      return send(200, { outage });
    }
    if (outage) return send(503, { message: "service unavailable (outage drill)" });
    if (req.method !== "POST" || !match) return send(404, { message: "not found" });
    if (req.headers.apikey !== KEY) return send(401, { message: "invalid api key" });
    let raw = "";
    req.on("data", (c) => (raw += c));
    req.on("end", async () => {
      try {
        const args = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
        send(200, await rpc(match[1], args));
      } catch (err) {
        send(400, { code: "P0001", message: (err as Error).message, details: null, hint: null });
      }
    });
  })
  .listen(PORT, () => console.log(`builder dev db on http://localhost:${PORT}`));
