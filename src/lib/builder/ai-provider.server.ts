/**
 * The model call — server-side only. Official Anthropic SDK; one tool per call.
 *
 * Environment (read at call time, server only):
 *   ANTHROPIC_API_KEY    required. Without it every call fails with AI_UNAVAILABLE.
 *   ELEVATE_AI_MODEL     optional model override (default: claude-opus-5).
 *   ANTHROPIC_BASE_URL   optional API origin (a gateway, or a local mock in QA).
 *
 * Production behaviour:
 *   - Streaming with `finalMessage()`: concept sets are large and the model
 *     thinks first, so a single non-streaming response risks HTTP timeouts.
 *   - SDK retries (2) for connection errors, 408/409/429 and 5xx.
 *   - `stop_reason: "refusal"` is checked before content is read. On Claude
 *     Opus 5 / Fable 5 the server-side `fallbacks: "default"` re-runs a declined
 *     request on Anthropic's recommended fallback model inside the same call.
 *   - Forced tool choice where the model supports it; on models that reject
 *     it (Claude Fable 5.1 / Mythos 5.1) `auto` plus the prompt's instruction.
 *   - The key is never logged: logs carry status, error type and request id only.
 */
import Anthropic from "@anthropic-ai/sdk";

export const DEFAULT_MODEL = "claude-opus-5";

export type AiErrorCode = "AI_UNAVAILABLE" | "AI_BUSY" | "AI_INVALID" | "AI_TIMEOUT" | "AI_REFUSED";

export class AiError extends Error {
  code: AiErrorCode;
  constructor(code: AiErrorCode, detail?: string) {
    super(code);
    this.code = code;
    if (detail) console.error(`[builder-ai] ${code}: ${detail}`);
  }
}

export type Message = Anthropic.Beta.Messages.BetaMessageParam;

export type ToolRequest = {
  system: string;
  messages: Message[];
  tool: { name: string; description: string; input_schema: Record<string, unknown> };
  maxTokens: number;
  timeoutMs: number;
};

export type ToolCall = { input: unknown; id: string; transcript: Message[] };

/** The seam tests replace: anything that answers a ToolRequest with a ToolCall. */
export type ToolCaller = (request: ToolRequest) => Promise<ToolCall>;

const REJECTS_FORCED_TOOLS = /^claude-(fable|mythos)-5-1/;
const SUPPORTS_DEFAULT_FALLBACKS = /^claude-(opus-5|fable-5|mythos-5)/;

let client: Anthropic | null = null;
let clientKey: string | undefined;

function getClient(): Anthropic {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new AiError("AI_UNAVAILABLE", "ANTHROPIC_API_KEY is not configured");
  if (!client || clientKey !== apiKey) {
    client = new Anthropic({
      apiKey,
      baseURL: process.env.ANTHROPIC_BASE_URL || undefined,
      maxRetries: 2,
    });
    clientKey = apiKey;
  }
  return client;
}

function describe(err: InstanceType<typeof Anthropic.APIError>) {
  const type = (err.error as { error?: { type?: string } } | undefined)?.error?.type;
  return `status ${err.status ?? "-"} ${type ?? ""} request ${err.requestID ?? "-"}`.trim();
}

export const callTool: ToolCaller = async (request) => {
  const model = process.env.ELEVATE_AI_MODEL || DEFAULT_MODEL;
  const anthropic = getClient();
  const forced = !REJECTS_FORCED_TOOLS.test(model);
  const fallbacks = SUPPORTS_DEFAULT_FALLBACKS.test(model);

  let message: Anthropic.Beta.Messages.BetaMessage;
  try {
    const stream = anthropic.beta.messages.stream(
      {
        model,
        max_tokens: request.maxTokens,
        system: request.system,
        messages: request.messages,
        tools: [request.tool as Anthropic.Beta.Messages.BetaTool],
        tool_choice: forced ? { type: "tool", name: request.tool.name } : { type: "auto" },
        ...(fallbacks
          ? { betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" as const }
          : {}),
      },
      { timeout: request.timeoutMs },
    );
    message = await stream.finalMessage();
  } catch (err) {
    if (err instanceof AiError) throw err;
    if (err instanceof Anthropic.APIConnectionTimeoutError)
      throw new AiError("AI_TIMEOUT", "request timed out");
    if (err instanceof Anthropic.APIConnectionError)
      throw new AiError("AI_UNAVAILABLE", "connection error");
    if (err instanceof Anthropic.RateLimitError) throw new AiError("AI_BUSY", describe(err));
    if (
      err instanceof Anthropic.AuthenticationError ||
      err instanceof Anthropic.PermissionDeniedError
    )
      throw new AiError("AI_UNAVAILABLE", `credentials rejected: ${describe(err)}`);
    if (err instanceof Anthropic.APIError) {
      if (err.status === 529 || (err.status ?? 0) >= 500)
        throw new AiError("AI_BUSY", describe(err));
      throw new AiError("AI_UNAVAILABLE", describe(err));
    }
    const name = (err as Error)?.name;
    if (name === "AbortError" || name === "TimeoutError")
      throw new AiError("AI_TIMEOUT", "aborted");
    throw new AiError("AI_UNAVAILABLE", `unexpected: ${name ?? "error"}`);
  }

  if (message.stop_reason === "refusal")
    throw new AiError("AI_REFUSED", "model declined the request");
  if (message.stop_reason === "max_tokens")
    throw new AiError("AI_INVALID", "response truncated at max_tokens");

  const call = message.content.find(
    (b): b is Anthropic.Beta.Messages.BetaToolUseBlock =>
      b.type === "tool_use" && b.name === request.tool.name,
  );
  if (!call) throw new AiError("AI_INVALID", "no tool call in response");

  return {
    input: call.input,
    id: call.id,
    // The whole assistant content goes back on a repair turn (thinking blocks included, unchanged).
    transcript: [
      ...request.messages,
      {
        role: "assistant",
        content: message.content as Anthropic.Beta.Messages.BetaContentBlockParam[],
      },
    ],
  };
};

/** The follow-up turn that tells the model why its tool call was rejected. */
export function rejection(call: ToolCall, text: string): Message[] {
  return [
    ...call.transcript,
    {
      role: "user",
      content: [{ type: "tool_result", tool_use_id: call.id, content: text, is_error: true }],
    },
  ];
}
