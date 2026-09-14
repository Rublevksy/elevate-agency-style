/**
 * The only failure vocabulary that crosses the server/client boundary. Every
 * server function throws `Error(code)` with one of these; the UI maps each to
 * an honest, translated message (`copy.errors`). Anything else is reported as
 * UNKNOWN — internal messages, stack traces and provider errors never reach
 * the browser.
 */
export const BUILDER_ERROR_CODES = [
  "INVALID_INPUT",
  "RATE_LIMITED",
  "AI_UNAVAILABLE",
  "AI_BUSY",
  "AI_TIMEOUT",
  "AI_INVALID",
  "AI_REFUSED",
  "PERSISTENCE_UNAVAILABLE",
  "LEAD_NOT_FOUND",
  "LEAD_LOCKED",
  "CONCEPT_NOT_FOUND",
  "GENERATION_LIMIT",
  "REVISION_LIMIT",
  "REVISION_CONFLICT",
  "NO_SELECTION",
] as const;

export type BuilderErrorCode = (typeof BUILDER_ERROR_CODES)[number];

export class BuilderError extends Error {
  code: BuilderErrorCode;
  constructor(code: BuilderErrorCode) {
    super(code);
    this.code = code;
    this.name = "BuilderError";
  }
}

export function errorCodeOf(err: unknown): BuilderErrorCode | "UNKNOWN" {
  const message = err instanceof Error ? err.message : typeof err === "string" ? err : "";
  return (BUILDER_ERROR_CODES as readonly string[]).includes(message)
    ? (message as BuilderErrorCode)
    : "UNKNOWN";
}
