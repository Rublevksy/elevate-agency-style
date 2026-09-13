/**
 * The Lead's persistence in this phase: the visitor's own browser.
 *
 * Supabase is connected to the project but has no tables, no migrations and
 * no server credentials in this repository, so there is nowhere trustworthy to
 * write a lead server-side yet (docs/builder/DATA_CONTRACT.md specifies the
 * table the Admin phase will add). Until then:
 *
 *   - the whole Lead (brief, concepts, revisions, selection) lives in
 *     localStorage, so a refresh, a failed generation or a failed send never
 *     loses the visitor's work — including concepts that cost a model call;
 *   - on submission, the lead travels through the existing contact pipeline
 *     (`sendContactToTelegram`) as a structured summary with the lead id.
 *
 * Everything read back is re-validated: stored specs go through
 * `parseStoredSpec` exactly like fresh model output, because localStorage is
 * user-editable.
 */
import { DEADLINES, LeadSchema, type Lead } from "./brief";
import { parseStoredSpec } from "./spec";

const KEY = "elevate-builder-lead-v1";

/** The contact form while it is being filled in — not part of the Lead until it is sent. */
export type ContactDraftStored = {
  name: string;
  email: string;
  company: string;
  budgetIndex: number | null;
  deadline: (typeof DEADLINES)[number] | null;
  message: string;
};

export type StoredBuilder = { lead: Lead; step: number; contact: ContactDraftStored | null };

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

export function loadBuilder(): StoredBuilder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as { lead?: unknown; step?: unknown; contact?: unknown };
    const parsed = LeadSchema.safeParse(data.lead);
    if (!parsed.success) return null;
    const concepts = parsed.data.concepts.map(parseStoredSpec);
    if (concepts.some((c) => c === null)) return null;
    const revisions = parsed.data.revisions.flatMap((r) => {
      const before = parseStoredSpec(r.before);
      const after = parseStoredSpec(r.after);
      return before && after ? [{ ...r, before, after }] : [];
    });
    const step = typeof data.step === "number" && data.step >= 0 && data.step <= 6 ? data.step : 0;
    return {
      lead: {
        ...parsed.data,
        concepts: concepts as NonNullable<(typeof concepts)[number]>[],
        revisions,
      },
      step,
      contact: readContact(data.contact),
    };
  } catch {
    return null;
  }
}

export function saveBuilder(state: StoredBuilder) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or blocked: the session still works, it just won't survive a reload */
  }
}

export function clearBuilder() {
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
