/**
 * Builder session: how an anonymous visitor proves a lead is theirs.
 *
 * On the first save the server creates the lead and a random 256-bit token,
 * sends `<leadId>.<token>` back in an httpOnly, SameSite=Lax cookie, and stores
 * only SHA-256(token) in `builder_leads.access_token_hash`. The browser's
 * JavaScript never sees the token (httpOnly), so an injected script cannot
 * lift it, and a cross-site form cannot send it (SameSite=Lax + POST).
 *
 * The lead id is never read from a request body: every operation takes it from
 * this cookie, and the database refuses the operation unless the token hash
 * matches that lead. The cookie is strictly necessary for a service the visitor
 * explicitly uses, so it is not gated by the analytics consent banner.
 */
export const SESSION_COOKIE = "elevate_builder_session";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 180; // 180 days — survives browser restarts

export type BuilderSession = { leadId: string; token: string };

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const TOKEN = /^[A-Za-z0-9_-]{43}$/;

export function parseSession(value: string | undefined | null): BuilderSession | null {
  if (!value || value.length > 100) return null;
  const [leadId, token, extra] = value.split(".");
  if (extra !== undefined || !leadId || !token) return null;
  if (!UUID.test(leadId) || !TOKEN.test(token)) return null;
  return { leadId, token };
}

export function serializeSession(session: BuilderSession): string {
  return `${session.leadId}.${session.token}`;
}

export function newToken(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function sha256Hex(input: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const hashToken = (token: string) => sha256Hex(token);

/** A privacy-preserving rate-limit key for a client address (no raw IP is ever stored). */
export async function clientKey(ip: string | undefined): Promise<string> {
  return (await sha256Hex(`elevate-builder:${ip || "unknown"}`)).slice(0, 32);
}
