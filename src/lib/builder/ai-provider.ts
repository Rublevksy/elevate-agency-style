/**
 * The model call — server-side only (imported from `ai.functions.ts` handlers).
 *
 * Anthropic Messages API over plain fetch (no SDK dependency), with ONE tool
 * and `tool_choice` forcing it: the model has no channel to answer in except a
 * JSON object shaped by `tool-schema.ts`. The key is read from the server's
 * environment at call time and never reaches the browser.
 *
 *   ANTHROPIC_API_KEY   required; without it every call fails with AI_UNAVAILABLE
 *   ELEVATE_AI_MODEL    optional model override (default below)
 *   ANTHROPIC_BASE_URL  optional API origin (a gateway, or a local mock in QA)
 *
 * Errors are reduced to four codes the UI knows how to explain honestly.
 */
export const DEFAULT_MODEL = "claude-sonnet-5";

export type AiErrorCode = "AI_UNAVAILABLE" | "AI_BUSY" | "AI_INVALID" | "AI_TIMEOUT";

export class AiError extends Error {
  constructor(
    public code: AiErrorCode,
    detail?: string,
  ) {
    super(code);
    if (detail) console.error(`[builder-ai] ${code}: ${detail}`);
  }
}

type ContentBlock =
  | { type: "text"; text: string }
  | { type: "tool_use"; id: string; name: string; input: unknown }
  | { type: "tool_result"; tool_use_id: string; content: string; is_error?: boolean };

export type Message = { role: "user" | "assistant"; content: string | ContentBlock[] };

export type ToolCall = { input: unknown; id: string; transcript: Message[] };

export async function callTool(opts: {
  system: string;
  messages: Message[];
  tool: { name: string; description: string; input_schema: object };
  maxTokens: number;
  timeoutMs: number;
}): Promise<ToolCall> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) throw new AiError("AI_UNAVAILABLE", "ANTHROPIC_API_KEY is not configured");

  let res: Response;
  try {
    const origin = (process.env.ANTHROPIC_BASE_URL || "https://api.anthropic.com").replace(
      /\/+$/,
      "",
    );
    res = await fetch(`${origin}/v1/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: process.env.ELEVATE_AI_MODEL || DEFAULT_MODEL,
        max_tokens: opts.maxTokens,
        system: opts.system,
        messages: opts.messages,
        tools: [opts.tool],
        tool_choice: { type: "tool", name: opts.tool.name },
      }),
      signal: AbortSignal.timeout(opts.timeoutMs),
    });
  } catch (err) {
    const name = (err as Error)?.name;
    if (name === "TimeoutError" || name === "AbortError")
      throw new AiError("AI_TIMEOUT", "request timed out");
    throw new AiError("AI_UNAVAILABLE", `network: ${(err as Error)?.message}`);
  }

  if (res.status === 429 || res.status === 529)
    throw new AiError("AI_BUSY", `status ${res.status}`);
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new AiError("AI_UNAVAILABLE", `status ${res.status} ${body.slice(0, 300)}`);
  }

  const body = (await res.json().catch(() => null)) as {
    content?: ContentBlock[];
    stop_reason?: string;
  } | null;
  if (!body?.content) throw new AiError("AI_INVALID", "response without content");
  if (body.stop_reason === "max_tokens")
    throw new AiError("AI_INVALID", "response truncated at max_tokens");

  const call = body.content.find(
    (b): b is Extract<ContentBlock, { type: "tool_use" }> =>
      b.type === "tool_use" && b.name === opts.tool.name,
  );
  if (!call) throw new AiError("AI_INVALID", "no tool call in response");

  return {
    input: call.input,
    id: call.id,
    transcript: [...opts.messages, { role: "assistant", content: body.content }],
  };
}

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
