/**
 * The browser's copy of the Builder — a CACHE, not the record.
 *
 * The authoritative lead lives on the server (`builder_leads` and friends,
 * reached through `builder.functions.ts`, owned by this browser through an
 * httpOnly session cookie). This cache exists so that:
 *
 *   - typing is never lost between autosaves, or while the network is down
 *     (`briefDirty` marks words the server has not confirmed yet);
 *   - a reload while offline still shows the last known concepts;
 *   - concepts the model produced while the database was unreachable
 *     (`unsavedDrafts`) survive until they can be saved.
 *
 * Everything read back is re-validated — specs through `parseStoredSpec` /
 * `parseDraft`, like any other untrusted input — because localStorage is
 * user-editable. On the next successful server read the server wins.
 */
import { BriefDraftSchema, DEADLINES, LIFECYCLES, type BriefDraft, type Lead } from "./brief";
import { parseDraft, parseStoredSpec, type DesignSpecDraft } from "./spec";

const KEY = "elevate-builder-cache-v2";
const LEGACY_KEY = "elevate-builder-lead-v1";

export type ContactDraftStored = {
  name: string;
  email: string;
  company: string;
  budgetIndex: number | null;
  deadline: (typeof DEADLINES)[number] | null;
  message: string;
};

export type BuilderCache = {
  lead: Lead;
  /** Id of the server lead this cache mirrors; null before the first save. */
  serverLeadId: string | null;
  briefDirty: boolean;
  unsavedDrafts: DesignSpecDraft[] | null;
  step: number;
  contact: ContactDraftStored | null;
};

function readContact(raw: unknown): ContactDraftStored | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
  const budget =
    typeof r.budgetIndex === "number" && r.budgetIndex >= 0 && r.budgetIndex < 5
      ? r.budgetIndex
      : null;
  const deadline = (DEADLINES as readonly string[]).includes(r.deadline as string)
    ? (r.deadline as ContactDraftStored["deadline"])
    : null;
  return {
    name: str(r.name, 100),
    email: str(r.email, 255),
    company: str(r.company, 80),
    budgetIndex: budget,
    deadline,
    message: str(r.message, 1200),
  };
}

/**
 * Validates a Lead from outside this module's control — the cache, or a server
 * response — re-parsing every spec, as at every other boundary.
 */
export function parseLead(raw: unknown): Lead | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Partial<Lead> & Record<string, unknown>;
  const brief = BriefDraftSchema.safeParse(r.brief);
  if (!brief.success || typeof r.id !== "string") return null;
  if (!(LIFECYCLES as readonly string[]).includes(r.lifecycle as string)) return null;
  const concepts = Array.isArray(r.concepts) ? r.concepts.map(parseStoredSpec) : [];
  if (concepts.some((c) => c === null) || concepts.length > 5) return null;
  const revisions = Array.isArray(r.revisions)
    ? r.revisions.flatMap((rev) => {
        const before = parseStoredSpec(rev?.before);
        const after = parseStoredSpec(rev?.after);
        return before && after && typeof rev.revision === "number"
          ? [{ ...rev, before, after }]
          : [];
      })
    : [];
  const ids = new Set(concepts.map((c) => c!.id));
  return {
    id: r.id,
    schemaVersion: 2,
    lifecycle: r.lifecycle as Lead["lifecycle"],
    lang: (["CZ", "EN", "RU", "UA"] as const).includes(r.lang as "CZ")
      ? (r.lang as Lead["lang"])
      : "CZ",
    createdAt: String(r.createdAt ?? ""),
    updatedAt: String(r.updatedAt ?? ""),
    brief: brief.data,
    concepts: concepts as Lead["concepts"],
    selectedConceptId:
      typeof r.selectedConceptId === "string" && ids.has(r.selectedConceptId)
        ? r.selectedConceptId
        : null,
    generationCount: typeof r.generationCount === "number" ? r.generationCount : 0,
    revisions: revisions as Lead["revisions"],
    submittedAt: typeof r.submittedAt === "string" ? r.submittedAt : null,
  };
}

export function loadBuilder(): BuilderCache | null {
  if (typeof window === "undefined") return null;
  try {
    window.localStorage.removeItem(LEGACY_KEY);
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as Record<string, unknown>;
    const lead = parseLead(data.lead);
    if (!lead) return null;
    const drafts = Array.isArray(data.unsavedDrafts)
      ? data.unsavedDrafts.map((d) => parseDraft(d))
      : null;
    const unsavedDrafts =
      drafts && drafts.length === 5 && drafts.every((d) => d.ok)
        ? drafts.map((d) => (d as { ok: true; draft: DesignSpecDraft }).draft)
        : null;
    return {
      lead,
      serverLeadId: typeof data.serverLeadId === "string" ? data.serverLeadId : null,
      briefDirty: data.briefDirty === true,
      unsavedDrafts,
      step: typeof data.step === "number" && data.step >= 0 && data.step <= 6 ? data.step : 0,
      contact: readContact(data.contact),
    };
  } catch {
    return null;
  }
}

export function saveBuilder(cache: BuilderCache) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    /* storage full or blocked: the server still holds the record */
  }
}

export function clearBuilder() {
  try {
    window.localStorage.removeItem(KEY);
    window.localStorage.removeItem(LEGACY_KEY);
  } catch {
    /* ignore */
  }
}

/** Whether a brief has anything worth saving (an empty visit creates no lead). */
export function briefHasContent(brief: BriefDraft): boolean {
  const { project, visual, references } = brief;
  return Boolean(
    brief.projectType ||
    Object.values(project).some((v) => v.trim()) ||
    Object.values(visual).some((v) => v.trim()) ||
    references.urls.some((u) => u.trim()) ||
    references.notes.trim(),
  );
}
