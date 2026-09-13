/**
 * The client's brief and the Lead that carries it — the data contract the
 * future Admin panel consumes (docs/builder/DATA_CONTRACT.md).
 *
 * Shared by the browser (validation while typing, the stored draft) and the
 * server functions (which re-validate every request: nothing the browser sends
 * is trusted). Imports only zod and `spec.ts`.
 */
import { z } from "zod";
import { DesignSpecSchema, type DesignSpec } from "./spec";

export const PROJECT_TYPES = ["web", "eshop", "app", "branding"] as const;
export type ProjectType = (typeof PROJECT_TYPES)[number];

export const LANGS = ["CZ", "EN", "RU", "UA"] as const;

/** Budget values in CZK, index-aligned with `t.contact.form.budgets` (same as Contact.tsx). */
export const BUDGET_VALUES = [20000, 50000, 100000, 150000, 0] as const;

export const DEADLINES = ["asap", "1m", "1-3m", "3m+", "unsure"] as const;
export type Deadline = (typeof DEADLINES)[number];

const line = (min: number, max: number) => z.string().trim().min(min).max(max);
const optional = (max: number) => z.string().trim().max(max).default("");

export const referenceUrl = z
  .string()
  .trim()
  .max(200)
  .refine((v) => {
    try {
      const u = new URL(v);
      return (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".");
    } catch {
      return false;
    }
  }, "INVALID_URL");

export const BriefSchema = z.object({
  projectType: z.enum(PROJECT_TYPES),
  project: z.object({
    company: line(1, 80),
    industry: line(2, 80),
    offering: line(10, 600),
    audience: line(3, 300),
    goal: line(3, 300),
  }),
  visual: z.object({
    style: optional(300),
    mood: optional(200),
    colors: optional(200),
    typography: optional(200),
    notes: optional(800),
  }),
  references: z.object({
    urls: z.array(referenceUrl).max(5).default([]),
    notes: optional(800),
  }),
});

export type Brief = z.infer<typeof BriefSchema>;

/**
 * A brief while it is being written: every field may still be empty and the
 * type may not be chosen yet. This is what the Lead stores; `BriefSchema` is
 * applied only at the moment the brief is sent for generation.
 */
const draftText = (max: number) => z.string().max(max).default("");
export const BriefDraftSchema = z.object({
  projectType: z.enum(PROJECT_TYPES).nullable(),
  project: z.object({
    company: draftText(80),
    industry: draftText(80),
    offering: draftText(600),
    audience: draftText(300),
    goal: draftText(300),
  }),
  visual: z.object({
    style: draftText(300),
    mood: draftText(200),
    colors: draftText(200),
    typography: draftText(200),
    notes: draftText(800),
  }),
  references: z.object({
    urls: z.array(z.string().max(200)).max(5).default([]),
    notes: draftText(800),
  }),
});
export type BriefDraft = z.infer<typeof BriefDraftSchema>;

export const EMPTY_BRIEF: BriefDraft = {
  projectType: null,
  project: { company: "", industry: "", offering: "", audience: "", goal: "" },
  visual: { style: "", mood: "", colors: "", typography: "", notes: "" },
  references: { urls: [], notes: "" },
};

/* ------------------------------------------------------------------------ */
/* Lead                                                                      */
/* ------------------------------------------------------------------------ */

export const LEAD_STATUSES = [
  "draft", // brief in progress
  "concepts_ready", // five validated concepts exist
  "direction_selected", // one concept chosen
  "submitted", // the real contact pipeline accepted it
] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const RevisionSchema = z.object({
  id: z.string(),
  conceptId: z.string(),
  feedback: z.string().max(600),
  before: DesignSpecSchema,
  after: DesignSpecSchema,
  createdAt: z.string(),
});
export type Revision = z.infer<typeof RevisionSchema> & { before: DesignSpec; after: DesignSpec };

export const ContactSchema = z.object({
  name: line(1, 100),
  email: z.string().trim().email().max(255),
  company: line(1, 80),
  budgetIndex: z
    .number()
    .int()
    .min(0)
    .max(BUDGET_VALUES.length - 1),
  deadline: z.enum(DEADLINES),
  message: optional(1200),
});
export type Contact = z.infer<typeof ContactSchema>;

export const LeadSchema = z.object({
  id: z.string().uuid(),
  schemaVersion: z.literal(1),
  status: z.enum(LEAD_STATUSES),
  lang: z.enum(LANGS),
  createdAt: z.string(),
  updatedAt: z.string(),
  brief: BriefDraftSchema,
  concepts: z.array(DesignSpecSchema).max(5),
  selectedConceptId: z.string().nullable(),
  revisions: z.array(RevisionSchema).max(60),
  contact: ContactSchema.nullable(),
  submittedAt: z.string().nullable(),
});

export type Lead = Omit<z.infer<typeof LeadSchema>, "concepts" | "revisions"> & {
  concepts: DesignSpec[];
  revisions: Revision[];
};
