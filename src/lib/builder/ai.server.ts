/**
 * Five concepts and refinements — the model's answer, validated.
 *
 * Unchanged from the foundation in substance (one forced tool call, schema →
 * claim check → sanitise → contrast repair → distinctness, one repair turn,
 * otherwise an honest error). Moved out of the server-function file so the
 * service can be tested with a fake `ToolCaller`.
 */
import { z } from "zod";
import type { Brief } from "./brief";
import { AiError, rejection, type ToolCaller } from "./ai-provider.server";
import { SYSTEM_PROMPT, generationPrompt, refinementPrompt, repairPrompt } from "./prompts";
import {
  ConceptSetSchema,
  DesignSpecDraftSchema,
  assessDistinctness,
  parseDraft,
  type DesignSpec,
  type DesignSpecDraft,
  type SpecIssue,
} from "./spec";
import { toJsonSchema } from "./tool-schema";

export const CONCEPTS_TOOL = {
  name: "propose_design_directions",
  description:
    "Submit exactly five distinct website design directions for the client's brief, as structured specifications. Always answer by calling this tool.",
  input_schema: toJsonSchema(ConceptSetSchema),
};

export const REFINE_TOOL = {
  name: "revise_design_direction",
  description:
    "Submit the complete revised design direction as a structured specification. Always answer by calling this tool.",
  input_schema: toJsonSchema(DesignSpecDraftSchema),
};

/** Validates a set of five: each draft individually, then the set's distinctness. */
export function checkConceptSet(
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

export async function generateConceptDrafts(
  ai: ToolCaller,
  brief: Brief,
  lang: string,
): Promise<DesignSpecDraft[]> {
  const request = {
    system: SYSTEM_PROMPT,
    tool: CONCEPTS_TOOL,
    maxTokens: 32000,
    timeoutMs: 240_000,
  };
  let call = await ai({
    ...request,
    messages: [{ role: "user", content: generationPrompt(brief, lang) }],
  });
  let result = checkConceptSet(call.input, true);
  if (result.issues.length > 0) {
    call = await ai({ ...request, messages: rejection(call, repairPrompt(result.issues)) });
    result = checkConceptSet(call.input, false);
  }
  if (result.issues.length > 0) {
    console.error("[builder-ai] concepts rejected after repair", result.issues.slice(0, 8));
    throw new AiError("AI_INVALID");
  }
  return result.drafts;
}

export async function refineConceptDraft(
  ai: ToolCaller,
  brief: Brief,
  current: DesignSpec,
  feedback: string,
  lang: string,
): Promise<DesignSpecDraft> {
  const request = {
    system: SYSTEM_PROMPT,
    tool: REFINE_TOOL,
    maxTokens: 12000,
    timeoutMs: 150_000,
  };
  let call = await ai({
    ...request,
    messages: [{ role: "user", content: refinementPrompt(brief, current, feedback, lang) }],
  });
  let parsed = parseDraft(call.input, { rejectClaims: true });
  if (!parsed.ok) {
    call = await ai({ ...request, messages: rejection(call, repairPrompt(parsed.issues)) });
    parsed = parseDraft(call.input);
  }
  if (!parsed.ok) {
    console.error("[builder-ai] refinement rejected after repair", parsed.issues.slice(0, 8));
    throw new AiError("AI_INVALID");
  }
  return parsed.draft;
}
