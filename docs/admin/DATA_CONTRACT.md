# Admin data contract

What the Admin panel reads and writes, derived **only** from the Builder schema
(`supabase/migrations/20260914120000_builder_leads.sql`, described in
`docs/builder/DATA_CONTRACT.md`). The read model is written as SQL in
`docs/admin/admin-read-model.draft.sql` and executed on top of the Builder migration by
`scripts/check-admin-contract.ts` (9 checks) — so every field below is proven to exist and be
derivable, not assumed.

**Status:** design contract. The draft SQL is not a migration and is not applied. The Builder
migration itself is not applied to the project yet (`docs/builder/PRODUCTION_PREFLIGHT.md`).

## 1. Principles

- **Source of truth:** the Builder tables. Admin adds exactly one table (`admin_users`) and
  writes exactly one thing (pipeline `status`, audited).
- **No invented numbers.** Counts are row counts. There are no conversion rates, trends,
  revenue figures or scores — the data to support them honestly does not exist.
- **Never exposed:** `access_token_hash` (no Admin function returns it; tested), rate-limit
  rows, anything from server environment.
- **Specs are untrusted on read.** Every DesignSpec is passed through `parseDraft` /
  `parseStoredSpec` before `ConceptRenderer`, exactly as the Builder does (the contract check
  re-validates every stored spec).
- **Two status axes, never merged:** `lifecycle` (visitor progress, set by the Builder) and
  `status` (ELEVATE pipeline, set by Admin).

## 2. Database functions (draft)

All `service_role` only; public roles are refused (tested). JSON keys are camelCase.

| Function | Serves |
|---|---|
| `builder_admin_is_active(user)` | authorization: is this Supabase Auth user an active Admin |
| `builder_admin_dashboard(stale_pending = 15 min)` | `/admin` |
| `builder_admin_list_leads(status?, lifecycle?, project_type?, notification?, search?, limit = 25, cursor_created?, cursor_id?)` | `/admin/leads` |
| `builder_admin_get_lead(lead)` | `/admin/leads/$leadId` (null when not found) |
| `builder_admin_list_concepts(current_only = true, selected_only = false, limit = 24, cursor…)` | `/admin/concepts` |
| `builder_admin_activity(lead?, limit = 50, before?, submitted_only = false)` | dashboard + lead timeline |
| `builder_admin_set_status(actor, lead, status, note?)` | the only write; returns the updated lead detail |

## 3. Dashboard — `builder_admin_dashboard`

```ts
{
  submittedByStatus: Record<"NEW"|"REVIEW"|"CONTACTED"|"PROPOSAL"|"IN_PROGRESS"|"COMPLETED"|"ARCHIVED", number>,
                                        // submitted leads only; every status present, zeros included
  byLifecycle: Record<"draft"|"concepts_ready"|"direction_selected"|"submitted", number>,
                                        // all leads — how many visitors are at each step now
  recentLeads: {                        // 10 latest submissions
    id, company, projectType, status, budgetCzk, deadline, submittedAt, notificationStatus
  }[],
  recentConcepts: {                     // 10 latest concept rows, any lead
    id, leadId, company, generation, position, name, archetype, revision, source,
    current: boolean, selected: boolean, createdAt
  }[],
  recentActivity: ActivityEvent[],      // 20 latest, submitted leads only (see §7)
  notificationProblems: {               // up to 50
    id, company, submittedAt, notificationStatus,
    problem: "failed" | "stale_pending",   // stale_pending = still 'pending' after 15 min
    attempts, lastAttemptAt
  }[],
}
```

Why `submittedByStatus` counts only submitted leads: a draft also carries `status = NEW` by
default, but it is a visitor's unfinished work, not a lead in the pipeline.

## 4. Leads list — `builder_admin_list_leads`

Filters (all optional, combinable): `status`, `lifecycle`, `project_type`, `notification`
(`pending|sent|failed`). Invalid enum values are rejected by Postgres, not ignored.

Search: case-insensitive substring over `company`, `industry`, `contact_name`, `contact_email`,
`contact_company`; literal (`%` and `_` match themselves); ≤100 characters.

Pagination: keyset on `(created_at desc, id desc)` using the existing `created_at` index; page
size 1–100 (default 25). `nextCursor` is null on the last page. Walking every page returns
each lead exactly once (tested); because the cursor is a position, not an offset, leads created
while paging do not shift later pages. `total` is an exact count of the filtered set
(fine at the expected volume; revisit above ~100k leads).

```ts
{
  items: {
    id, company, industry, projectType, lifecycle, status, lang,
    contactName, contactEmail,            // null until submitted
    budgetCzk, deadline,                  // null until submitted
    generationCount, hasSelection, notificationStatus,
    createdAt, updatedAt, submittedAt
  }[],
  total: number,
  nextCursor: { createdAt: string, id: string } | null,
}
```

## 5. Lead detail — `builder_admin_get_lead`

```ts
{
  id, lifecycle, status, lang, projectType,
  brief: {
    company, industry, offering, audience, goal,
    visual: { style, mood, colors, typography, notes },    // free text, may be null
    references: { urls: string[], notes: string },
  },
  contact: { name, email, company, message } | null,      // null before submission
  budget: { index: 0..4 | null, czk: number | null },     // label = t.contact.form.budgets[index]
  deadline: "asap" | "1m" | "1-3m" | "3m+" | "unsure" | null,
  selectedConceptId: uuid | null,
  generationCount,
  notification: { status: "pending"|"sent"|"failed"|null, attempts, lastAttemptAt, deliveredAt },
  timestamps: { createdAt, updatedAt, selectedAt, submittedAt },
  generations: {                                          // newest first; all kept
    generation, createdAt, supersededAt | null,
    concepts: Concept[],                                  // exactly 5, by position
  }[],
  statusHistory: {                                        // oldest first
    fromStatus | null, toStatus, note | null,
    changedBy: uuid | null, changedByEmail: string | null, createdAt
  }[],
}

Concept {
  id, position: 1..5, source: "ai" | "resync",
  name, archetype, revision,
  current: boolean,          // false = a later generation replaced this set
  selected: boolean,         // at most one per lead
  originalSpec: DesignSpecDraft,   // as generated (revision 0)
  spec: DesignSpecDraft,           // current
  createdAt, updatedAt,
  revisions: { id, revision, kind: "refine"|"restore", feedback, restoredFrom | null,
               specBefore, specAfter, createdAt }[],  // by revision
}
```

`DesignSpecDraft` has no `id`/`revision` (they are columns); build a renderable spec with
`toSpec(parseDraft(spec).draft, concept.id, concept.revision)`.

`updatedAt` also moves when Admin changes the status — use `timestamps.submittedAt` for "when
the client sent it".

## 6. Concepts gallery — `builder_admin_list_concepts`

Current concepts across all leads by default (`current_only`), optionally only selected
directions; keyset pagination on `(created_at desc, id desc)`, 1–60 per page.

```ts
{ items: { id, leadId, company, leadLifecycle, generation, position, source, name, archetype,
           revision, current, selected, spec, createdAt, updatedAt }[],
  nextCursor: { createdAt, id } | null }
```

**Generation metadata available to Admin:** generation number, position, source (`ai` or
`resync` — generated while the database was down and saved later, re-validated), revision
count, created/updated, superseded time, selected flag.
**Not recorded, therefore not shown:** the model id, token usage, prompt, latency, repair-turn
count. Adding any of these is a Builder schema change, not an Admin display decision.

## 7. Activity — `builder_admin_activity`

Derived from timestamps the Builder already stores; there is no separate event log.

| `kind` | From | `detail` |
|---|---|---|
| `lead_created` | `builder_leads.created_at` | — |
| `concepts_generated` | first `created_at` per (lead, generation) | `generation`, `source` |
| `concept_refined` / `concept_restored` | `builder_revisions` | `revision`, `feedback`, `restoredFrom` |
| `direction_selected` | `builder_leads.selected_at` (current selection) | — |
| `lead_submitted` | `submitted_at` | `budgetCzk`, `deadline` |
| `notification_sent` | `notified_at` | `attempts` |
| `notification_failed` | `notification_last_attempt_at` when status is `failed` | `attempts` |
| `status_changed` | `builder_status_events` (excluding the initial NEW) | `from`, `to`, `note`, `changedBy` |

```ts
ActivityEvent { kind, at, leadId, company, conceptId | null, detail }
```

Newest first; `before` pages backwards; limit 1–200. **Not available** (not recorded): brief
edit history, earlier selections that were changed, earlier failed notification attempts
(only the latest attempt time and the count), who viewed a lead.

## 8. Write — `builder_admin_set_status`

- `p_actor` is the verified Supabase Auth user id from the server session — never from the
  request body. The function re-checks `admin_users` (active, not revoked) → `BUILDER:FORBIDDEN`.
- Only submitted leads can move through the pipeline → otherwise `BUILDER:LEAD_NOT_FOUND`.
- `status` must be one of the seven enum values (Postgres rejects anything else).
- Every change writes `builder_status_events` with `from_status`, `to_status`, `note` (≤500),
  `changed_by`. Any status may move to any other (no enforced order — the pipeline is ELEVATE's,
  and reopening an archived lead is legitimate). Two Admins changing the same lead: last write
  wins, both changes are in the history.
- The visitor's Builder view is unaffected (the snapshot never includes `status`; tested).

## 9. `admin_users`

```sql
admin_users (user_id uuid pk,        -- auth.users.id
             email text not null,
             added_at timestamptz,
             revoked_at timestamptz)  -- revoke, don't delete: history keeps the email
```

Rows are inserted by the owner (SQL editor) after the person has a Supabase Auth account.
Signing up never grants access. RLS on, no policies, service role only.

## 10. Error codes for Admin server functions

| Code | Meaning | UI |
|---|---|---|
| `UNAUTHENTICATED` | no or invalid Supabase session | redirect to `/admin/login` |
| `FORBIDDEN` | signed in, not an active Admin | explicit "no access" page with sign-out |
| `LEAD_NOT_FOUND` | unknown id, or status change on an unsubmitted lead | not-found state inside Admin |
| `INVALID_INPUT` | bad filter, cursor, search, status | inline message; filters reset offered |
| `PERSISTENCE_UNAVAILABLE` | database unreachable | error state with retry; never stale data shown as current |
