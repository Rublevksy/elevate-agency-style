/**
 * Lead → the payload of the EXISTING contact pipeline (`sendContactToTelegram`,
 * a protected contract: name / email / phone / service ≤50 / budget / message
 * ≤2000). Nothing about that function changes; the Builder composes a
 * structured, human-readable summary into `message`, led by the lead id so the
 * team — and later the Admin import — can match it to the full Lead.
 *
 * Internal team-facing text is Czech, like every other message the pipeline
 * sends. Values are truncated from the least important end so the message
 * always fits.
 */
import { BUDGET_VALUES, type Contact, type Lead } from "./brief";
import type { DesignSpec } from "./spec";

const TYPE_LABEL = { web: "Web", eshop: "E-shop", app: "Aplikace", branding: "Branding" } as const;
const DEADLINE_LABEL = {
  asap: "Co nejdříve",
  "1m": "Do měsíce",
  "1-3m": "1–3 měsíce",
  "3m+": "3+ měsíce",
  unsure: "Neví",
} as const;

const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

export function toContactPayload(
  lead: Lead,
  spec: DesignSpec,
  contact: Contact,
  budgetLabel: string,
) {
  const b = lead.brief;
  const type = b.projectType ? TYPE_LABEL[b.projectType] : "—";
  const revisions = lead.revisions.filter((r) => r.conceptId === spec.id).length;
  const visual = [b.visual.style, b.visual.mood, b.visual.colors, b.visual.typography]
    .filter(Boolean)
    .join(" · ");

  const head = [
    `AI Builder · lead ${lead.id}`,
    `Firma: ${contact.company} (${b.project.industry})`,
    `Typ: ${type} · Termín: ${DEADLINE_LABEL[contact.deadline]} · Rozpočet: ${budgetLabel}`,
    `Cíl: ${b.project.goal}`,
    `Publikum: ${b.project.audience}`,
    `Zvolený směr: ${spec.name} (${spec.archetype}, revize ${spec.revision}, úprav ${revisions})`,
    `Systém: ${spec.typography.display} / hero ${spec.layout.hero} / ${spec.mode} ${spec.palette.background} + ${spec.palette.accent}`,
  ].join("\n");

  const tail = [
    contact.message && `Zpráva: ${contact.message}`,
    `Čím se zabývá: ${b.project.offering}`,
    visual && `Výraz: ${visual}`,
    b.visual.notes && `Poznámky: ${b.visual.notes}`,
    b.references.urls.length > 0 && `Reference: ${b.references.urls.join(", ")}`,
    b.references.notes && `Reference slovy: ${b.references.notes}`,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    name: contact.name,
    email: contact.email,
    phone: "",
    service: cut(`AI Builder · ${type}`, 50),
    budget: BUDGET_VALUES[contact.budgetIndex] ?? 0,
    message: cut(`${cut(head, 1100)}\n\n${tail}`, 2000),
  };
}
