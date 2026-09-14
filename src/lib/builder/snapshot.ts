/**
 * The database's record of a lead (`builder_snapshot` in the migration) and
 * its conversion to the Builder's `Lead` shape, server-side. The browser
 * receives the converted Lead and validates it again (`parseLead` in
 * `storage.ts`) — a DesignSpec is re-parsed through `spec.ts` every time it
 * crosses a boundary, whether it came from the model, the database, or storage.
 */
import { z } from "zod";
import { BriefDraftSchema, LANGS, LIFECYCLES, type Lead, type Revision } from "./brief";
import { parseDraft, toSpec, type DesignSpec } from "./spec";

const uuid = z.string().uuid();

export const SnapshotSchema = z.object({
  lead: z.object({
    id: uuid,
    lifecycle: z.enum(LIFECYCLES),
    lang: z.enum(LANGS),
    brief: BriefDraftSchema,
    selectedConceptId: uuid.nullable(),
    generationCount: z.number().int().min(0),
    createdAt: z.string(),
    updatedAt: z.string(),
    submittedAt: z.string().nullable(),
  }),
  concepts: z
    .array(
      z.object({
        id: uuid,
        position: z.number().int().min(1).max(5),
        revision: z.number().int().min(0),
        source: z.enum(["ai", "resync"]),
        spec: z.unknown(),
        createdAt: z.string(),
      }),
    )
    .max(5),
  revisions: z
    .array(
      z.object({
        id: uuid,
        conceptId: uuid,
        revision: z.number().int().min(1),
        kind: z.enum(["refine", "restore"]),
        feedback: z.string().max(600),
        restoredFrom: z.number().int().min(0).nullable(),
        before: z.unknown(),
        after: z.unknown(),
        createdAt: z.string(),
      }),
    )
    .max(400),
});

export type Snapshot = z.infer<typeof SnapshotSchema>;

function specOf(raw: unknown, id: string, revision: number): DesignSpec | null {
  const parsed = parseDraft(raw);
  return parsed.ok ? toSpec(parsed.draft, id, revision) : null;
}

/**
 * Validates a snapshot and converts it. Returns null if anything in it fails
 * validation — a partially valid record is never rendered.
 */
export function snapshotToLead(raw: unknown): Lead | null {
  const parsed = SnapshotSchema.safeParse(raw);
  if (!parsed.success) return null;
  const { lead, concepts, revisions } = parsed.data;

  const specs = concepts.map((c) => specOf(c.spec, c.id, c.revision));
  if (specs.some((s) => s === null)) return null;

  const revs: Revision[] = [];
  for (const r of revisions) {
    const before = specOf(r.before, r.conceptId, r.revision - 1);
    const after = specOf(r.after, r.conceptId, r.revision);
    if (!before || !after) return null;
    revs.push({
      id: r.id,
      conceptId: r.conceptId,
      revision: r.revision,
      kind: r.kind,
      feedback: r.feedback,
      restoredFrom: r.restoredFrom,
      before,
      after,
      createdAt: r.createdAt,
    });
  }

  return {
    id: lead.id,
    schemaVersion: 2,
    lifecycle: lead.lifecycle,
    lang: lead.lang,
    createdAt: lead.createdAt,
    updatedAt: lead.updatedAt,
    brief: lead.brief,
    concepts: specs as DesignSpec[],
    selectedConceptId: lead.selectedConceptId,
    generationCount: lead.generationCount,
    revisions: revs,
    submittedAt: lead.submittedAt,
  };
}
