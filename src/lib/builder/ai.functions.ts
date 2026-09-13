/**
 * The Builder's two server functions.
 *
 *   generateConcepts({ lang, brief })            → { concepts: DesignSpec[5] }
 *   refineConcept({ lang, brief, spec, feedback }) → { spec: DesignSpec }
 *
 * Both re-validate their input, call the model through one forced tool, and
 * return ONLY objects that passed `spec.ts` (schema → sanitise → contrast
 * repair → distinctness). A failing answer gets exactly one repair turn with
 * the validation issues; if that fails too, the client receives an error and
 * nothing else — a concept is never padded, faked or partially returned.
 *
 * Error codes (the only strings that reach the browser):
 *   INVALID_INPUT, RATE_LIMITED, AI_UNAVAILABLE, AI_BUSY, AI_TIMEOUT, AI_INVALID
 */
import { createServerFn } from "@tanstack/react-start";
import { getRequestHeader } from "@tanstack/react-start/server";
import { z } from "zod";
import { BriefSchema, LANGS } from "./brief";
import { AiError, callTool, rejection } from "./ai-provider";
import { SYSTEM_PROMPT, generationPrompt, refinementPrompt, repairPrompt } from "./prompts";
import {
  ConceptSetSchema,
  DesignSpecDraftSchema,
  DesignSpecSchema,
  assessDistinctness,
  parseDraft,
  parseStoredSpec,
  toSpec,
  type DesignSpecDraft,
  type SpecIssue,
} from "./spec";
import { toJsonSchema } from "./tool-schema";

/* ------------------------------------------------------------------------ */
/* Abuse guard                                                               */
/* ------------------------------------------------------------------------ */

// Best effort, per server instance: a public endpoint that spends model tokens
// must not be free to loop. A shared store (KV / Supabase) replaces this when
// the persistence layer exists — see docs/builder/DATA_CONTRACT.md.
const WINDOW_MS = 10 * 60 * 1000;
const LIMITS = { generate: 6, refine: 30 } as const;
const hits = new Map<string, number[]>();

function throttle(kind: keyof typeof LIMITS) {
  const ip =
    getRequestHeader("cf-connecting-ip") ||
    getRequestHeader("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  const key = `${kind}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= LIMITS[kind]) throw new Error("RATE_LIMITED");
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
}

const newId = () => `c-${crypto.randomUUID().slice(0, 12)}`;

function fail(err: unknown): never {
  if (err instanceof AiError) throw new Error(err.code);
  if (err instanceof Error && err.message === "RATE_LIMITED") throw err;
  console.error("[builder-ai] unexpected", err);
  throw new Error("AI_UNAVAILABLE");
}

/* ------------------------------------------------------------------------ */
/* Generate                                                                  */
/* ------------------------------------------------------------------------ */

const generateInput = z.object({ lang: z.enum(LANGS), brief: BriefSchema });

const CONCEPTS_TOOL = {
  name: "propose_design_directions",
  description:
    "Submit exactly five distinct website design directions for the client's brief, as structured specifications.",
  input_schema: toJsonSchema(ConceptSetSchema),
};

function checkSet(
  raw: unknown,
  rejectClaims: boolean,
): { drafts: DesignSpecDraft[]; issues: SpecIssue[] } {
  const envelope = z.object({ concepts: z.array(z.unknown()) }).safeParse(raw);
  if (!envelope.success)
    return { drafts: [], issues: [{ path: "concepts", message: "missing concepts array" }] };
  if (envelope.data.concepts.length !== 5)
    return {
      drafts: [],
      issues: [{ path: "concepts", message: "exactly five concepts are required" }],
    };
  const drafts: DesignSpecDraft[] = [];
  const issues: SpecIssue[] = [];
  envelope.data.concepts.forEach((c, i) => {
    const parsed = parseDraft(c, { rejectClaims });
    if (parsed.ok) drafts.push(parsed.draft);
    else issues.push(...parsed.issues.map((x) => ({ ...x, path: `concepts[${i}].${x.path}` })));
  });
  if (issues.length === 0) issues.push(...assessDistinctness(drafts));
  return { drafts, issues };
}

export const generateConcepts = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = generateInput.safeParse(input);
    if (!parsed.success) throw new Error("INVALID_INPUT");
    return parsed.data;
  })
  .handler(async ({ data }) => {
    throttle("generate");
    try {
      const request = {
        system: SYSTEM_PROMPT,
        tool: CONCEPTS_TOOL,
        maxTokens: 16000,
        timeoutMs: 150_000,
      };
      let call = await callTool({
        ...request,
        messages: [{ role: "user", content: generationPrompt(data.brief, data.lang) }],
      });
      let result = checkSet(call.input, true);
      if (result.issues.length > 0) {
        call = await callTool({
          ...request,
          messages: rejection(call, repairPrompt(result.issues)),
        });
        result = checkSet(call.input, false);
      }
      if (result.issues.length > 0) {
        console.error("[builder-ai] concepts rejected after repair", result.issues.slice(0, 8));
        throw new AiError("AI_INVALID");
      }
      return { concepts: result.drafts.map((d) => toSpec(d, newId())) };
    } catch (err) {
      fail(err);
    }
  });

/* ------------------------------------------------------------------------ */
/* Refine                                                                    */
/* ------------------------------------------------------------------------ */

const refineInput = z.object({
  lang: z.enum(LANGS),
  brief: BriefSchema,
  spec: DesignSpecSchema,
  feedback: z.string().trim().min(3).max(600),
});

const REFINE_TOOL = {
  name: "revise_design_direction",
  description: "Submit the complete revised design direction as a structured specification.",
  input_schema: toJsonSchema(DesignSpecDraftSchema),
};

export const refineConcept = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    const parsed = refineInput.safeParse(input);
    if (!parsed.success) throw new Error("INVALID_INPUT");
    // The spec came back from the browser: it is re-sanitised like model output.
    const spec = parseStoredSpec(parsed.data.spec);
    if (!spec) throw new Error("INVALID_INPUT");
    return { ...parsed.data, spec };
  })
  .handler(async ({ data }) => {
    throttle("refine");
    try {
      const request = {
        system: SYSTEM_PROMPT,
        tool: REFINE_TOOL,
        maxTokens: 5000,
        timeoutMs: 90_000,
      };
      let call = await callTool({
        ...request,
        messages: [
          {
            role: "user",
            content: refinementPrompt(data.brief, data.spec, data.feedback, data.lang),
          },
        ],
      });
      let parsed = parseDraft(call.input, { rejectClaims: true });
      if (!parsed.ok) {
        call = await callTool({
          ...request,
          messages: rejection(call, repairPrompt(parsed.issues)),
        });
        parsed = parseDraft(call.input);
      }
      if (!parsed.ok) {
        console.error("[builder-ai] refinement rejected after repair", parsed.issues.slice(0, 8));
        throw new AiError("AI_INVALID");
      }
      return { spec: toSpec(parsed.draft, data.spec.id, data.spec.revision + 1) };
    } catch (err) {
      fail(err);
    }
  });
