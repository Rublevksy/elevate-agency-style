# Builder data contract

The authoritative record of every Builder lead lives in Supabase Postgres, in the tables of
`supabase/migrations/20260914120000_builder_leads.sql`. Shapes are defined twice, on purpose:
in code (`src/lib/builder/brief.ts`, `spec.ts` — zod, checked before anything is written) and
in the database (enums, length checks, foreign keys — checked again on write).

**Applying the migration is an owner step** (Lovable Cloud / Supabase migrations), followed by
regenerating `src/integrations/supabase/types.ts`. Until it is applied, every Builder save
fails honestly with `PERSISTENCE_UNAVAILABLE` and the browser keeps the work in its cache.

## 1. Ownership

| Data | Owner (writes) | Readers |
|---|---|---|
| Lead, brief, concepts, revisions, selection, contact | the visitor, **only through server functions** (`builder.functions.ts` → `service.server.ts` → `builder_*` functions, service role) | the visitor's own session; Admin (future, service role) |
| `status` (NEW … ARCHIVED) and its audit trail | Admin (future) via `builder_set_status` | Admin |
| `notification_status` | the server, after trying Telegram | Admin |
| Rate-limit counters | the server | the server |
| Browser cache (`localStorage` `elevate-builder-cache-v2`) | the browser | the browser; never trusted by the server |

The browser never holds a database credential, never sends a lead id, and cannot address a
row. Its only capability is the session cookie (§5).

## 2. Schema

### `builder_leads` — one row per Builder session that saved anything

| Column | Type | Notes |
|---|---|---|
| `id` | uuid pk | `gen_random_uuid()` — assigned by the database |
| `access_token_hash` | text | SHA-256 hex of the session token; the token itself is never stored |
| `lifecycle` | `builder_lifecycle` | `draft` → `concepts_ready` → `direction_selected` → `submitted` (visitor progress) |
| `status` | `builder_lead_status` | `NEW` `REVIEW` `CONTACTED` `PROPOSAL` `IN_PROGRESS` `COMPLETED` `ARCHIVED` (ELEVATE pipeline, default `NEW`) |
| `lang` | `builder_lang` | CZ / EN / RU / UA — language of the UI and generated copy |
| `project_type` | `builder_project_type` | web / eshop / app / branding |
| `company`, `industry`, `offering`, `audience`, `goal` | text | brief, length-checked (80/80/600/300/300) |
| `visual_style`, `visual_mood`, `visual_colors`, `visual_typography`, `visual_notes` | text | visual preferences (300/200/200/200/800) |
| `brief_references` | jsonb | `{ urls: string[≤5], notes ≤800 }` — flexible (image references later) |
| `selected_at` | timestamptz | when the current selection was made; cleared with the selection |
| `selected_concept_id` | uuid | composite FK `(selected_concept_id, id)` → `builder_concepts (id, lead_id)`: can only point at this lead's concept |
| `generation_count` | int | concept sets generated (cap enforced in the function) |
| `contact_name`, `contact_email`, `contact_company` | text | set only by `builder_submit` |
| `budget_index` | smallint 0–4 | index into `t.contact.form.budgets` |
| `budget_czk` | int | `BUDGET_VALUES[budget_index]` (0 = "not sure") |
| `deadline` | `builder_deadline` | asap / 1m / 1-3m / 3m+ / unsure |
| `contact_message` | text ≤1200 | |
| `notification_status` | `builder_notification_status` | null until submitted; `pending` at submission, then `sent` or `failed` — never assumed; `pending` that stays is a stopped send |
| `notification_attempts`, `notified_at`, `notification_last_attempt_at` | | `notified_at` only on delivery; the last attempt is dated either way |
| `created_at`, `updated_at`, `submitted_at` | timestamptz | `updated_at` by trigger |

Check `builder_leads_submitted_is_complete`: a `submitted` row always has selection (and its time), contact,
budget, deadline, project type and `submitted_at`.

### `builder_concepts` — every concept ever generated for a lead

| Column | Notes |
|---|---|
| `id` uuid pk | assigned by the database; this is `DesignSpec.id` |
| `lead_id` | FK, cascade |
| `generation`, `position` 1–5 | unique `(lead_id, generation, position)` — a set is always exactly five |
| `source` | `ai` (stored straight from generation) or `resync` (generated while the database was unreachable, saved later after re-validation) |
| `name`, `archetype` | copied out of the spec for Admin lists |
| `revision` | current revision, assigned by the database |
| `original_spec` jsonb | the spec as generated (revision 0) |
| `spec` jsonb | current DesignSpec draft (without `id`/`revision`, which live in columns) |
| `superseded_at` | set when a newer generation replaced the set — **superseded concepts are kept** |

### `builder_revisions` — refinement history

`concept_id` + `lead_id` (composite FK: a revision cannot reference another lead's concept),
`revision` ≥1 (unique per concept, assigned by the database), `kind` `refine` | `restore`,
`feedback` (≥3 chars for refine), `restored_from` (for restore: target revision, 0 = original),
`spec_before`, `spec_after` jsonb, `created_at`.

### `builder_status_events` — pipeline audit

Written by trigger on insert and on every `status` change: `from_status`, `to_status`, `note`
and `changed_by` (the Admin user id, both from `builder_set_status`), `created_at`.

### `builder_rate_limits`

`(bucket, window_start)` pk, `hits`. Buckets contain hashed client keys and lead ids, never
raw IP addresses. Old windows are removed opportunistically.

### JSONB vs columns

Columns for everything Admin filters, sorts or searches on (status, lifecycle, project type,
company, dates, budget, deadline, selection). JSONB only where the shape is genuinely a
document: DesignSpecs (validated by `spec.ts`, rendered as a whole) and references.

### Indexes

`builder_leads`: `status`, `lifecycle`, `created_at desc`, `project_type`,
`selected_concept_id`, `submitted_at desc` (partial). `builder_concepts`: `(lead_id, position)`
where current, `lead_id`. `builder_revisions`: `(concept_id, revision)`, `(lead_id, created_at)`.
`builder_status_events`: `(lead_id, created_at)`. `builder_rate_limits`: `window_start`.

## 3. Database functions (the only write path)

All are `plpgsql`, `search_path = public, pg_temp`, executable by `service_role` only, and
raise `BUILDER:<CODE>` errors that the server maps to UI codes.

| Function | Does |
|---|---|
| `builder_create_lead(token_hash, lang)` | new draft lead → snapshot |
| `builder_get_lead(lead, token_hash)` | snapshot, or null on mismatch (no oracle) |
| `builder_save_brief(lead, token_hash, brief, lang)` | brief columns; `LEAD_LOCKED` once submitted |
| `builder_store_concepts(lead, token_hash, specs[5], source, max_generations)` | new generation, previous set superseded, selection cleared; `GENERATION_LIMIT` |
| `builder_get_concept(lead, token_hash, concept)` | current spec + revision (the server refines from this, not from the browser) |
| `builder_store_refinement(lead, token_hash, concept, feedback, spec, expected_revision, max_revisions)` | next revision; `REVISION_CONFLICT` if the concept moved on; `REVISION_LIMIT` |
| `builder_restore_revision(lead, token_hash, concept, target, max_revisions)` | earlier version (0 = original) as the next revision |
| `builder_select_concept(lead, token_hash, concept \| null)` | selection + lifecycle |
| `builder_submit(lead, token_hash, concept, contact, budget_czk)` | contact, lifecycle `submitted`, lock; idempotent (`alreadySubmitted`); `NO_SELECTION` |
| `builder_mark_notification(lead, token_hash, delivered)` | `sent` / `failed` + attempt count |
| `builder_set_status(lead, status, actor, note)` | Admin only — not reachable from any Builder server function; actor recorded in the audit trail |
| `builder_consume_rate_limit(bucket, limit, window_seconds)` | `{ allowed, hits, retryAfterSeconds }` |
| `builder_purge_stale_drafts(older_than)` | deletes never-generated drafts (not scheduled) |

Every lead-scoped function first calls `builder_lead_for_update(lead, token_hash)`, which locks
the row and raises `LEAD_NOT_FOUND` when the id/hash pair does not match — so concurrent
requests for one lead serialise, and a wrong token looks exactly like a missing lead.

### Snapshot (`builder_snapshot`) — what the visitor's session may see

```ts
{
  lead: { id, lifecycle, lang, brief: BriefDraft, selectedConceptId, generationCount,
          createdAt, updatedAt, submittedAt },
  concepts:  [{ id, position, revision, source, spec, createdAt }],   // current set only
  revisions: [{ id, conceptId, revision, kind, feedback, restoredFrom, before, after, createdAt }],
}
```

Excluded on purpose: `access_token_hash`, `status`, contact fields, notification fields,
superseded concepts. The server converts it to the Builder's `Lead` (`snapshot.ts`), and the
browser validates that again (`parseLead`).

## 4. Application shapes

```ts
Lead {                               // browser view of the record (brief.ts)
  id: uuid; schemaVersion: 2; lifecycle; lang; createdAt; updatedAt
  brief: BriefDraft; concepts: DesignSpec[] (0 or 5); selectedConceptId: uuid | null
  generationCount: number; revisions: Revision[]; submittedAt: string | null
}
Brief     { projectType; project { company 1–80, industry 2–80, offering 10–600, audience 3–300, goal 3–300 };
            visual { style ≤300, mood ≤200, colors ≤200, typography ≤200, notes ≤800 };
            references { urls http(s)[≤5], notes ≤800 } }
Contact   { name 1–100, email, company 1–80, budgetIndex 0–4, deadline, message ≤1200 }
Revision  { id, conceptId, revision ≥1, kind: "refine"|"restore", feedback, restoredFrom, before, after, createdAt }
```

### DesignSpec (unchanged)

```ts
DesignSpec {
  id: string                       // database uuid (fixtures: c-fixture-…)
  revision: int ≥0                 // 0 = as generated
  mode: "light" | "dark"           // derived from background, not taken from the model
  name ≤40, archetype, positioning ≤200, rationale ≤360, keywords[2–4] ≤22
  palette:    { background, surface, text, muted, accent, onAccent }  // #RRGGBB, contrast-repaired
  typography: { display: modern-grotesk|geometric|editorial-serif|condensed|rounded-humanist|mono,
                body: sans|serif|mono, scale: restrained|confident|monumental,
                displayWeight: light|regular|semibold|black, displayCase: sentence|uppercase,
                tracking: tight|normal|wide }
  layout:     { navigation: bar|centered-logo|minimal-menu|split-cta,
                hero: split-media|full-bleed-media|typographic|centered-statement|offset-collage|product-stage,
                grid: structured|asymmetric|centered, density: airy|balanced|compact, width: contained|wide }
  surface:    { radius: none|subtle|rounded|pill, borders: none|hairline|strong, depth: flat|soft-shadow|layered }
  imagery:    { style: photography|illustration|abstract-shapes|product-cutout|texture|type-only,
                treatment: natural|duotone|monochrome|high-contrast, subject ≤120 }
  motion:     { level: calm|moderate|expressive, signature: fade-rise|slide-reveal|scale-in|parallax-layers }
  copy:       { headline ≤90, subheadline ≤220, primaryCta ≤28, secondaryCta? ≤28, nav[3–5] ≤18 }
  sections[3–6]: { kind: features|services|showcase|process|story|products|gallery|cta,
                   eyebrow? ≤32, title ≤80, body? ≤240, items?[≤4]: { title ≤56, text ≤160 } }
}
```

**Rule for every consumer, Admin included:** a spec read from the database is untrusted. Pass
it through `parseStoredSpec` / `parseDraft` before rendering with `ConceptRenderer`, as the
Builder does. The renderer is deterministic (placeholders are seeded by `id` + slot), so Admin
sees exactly what the client saw.

## 5. Session and security

- **Session cookie** `elevate_builder_session` = `<leadId>.<token>`; token = 32 random bytes
  (base64url). `httpOnly`, `SameSite=Lax`, `Secure` on https, `Path=/`, 180 days. JavaScript
  cannot read it; it is the only thing that ties a browser to a lead.
- The database stores `sha256(token)` only. A stolen database row does not grant a session.
- RLS is enabled on all five tables with **no policies**, and all table and function
  privileges are revoked from `public`, `anon` and `authenticated`. The publishable key in the
  client bundle can read nothing and call nothing. Verified in `scripts/check-builder-db.ts`,
  including after a deliberately stray grant.
- The public Builder cannot: list leads (no such function), read another lead (hash check),
  modify another lead or concept (hash check + composite FKs), change `status`
  (`builder_set_status` is not exposed by any server function), or see contact/status fields
  (not in the snapshot).
- Secrets (`SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, Telegram) exist only in server
  environment variables; none is written to a record, a spec, or a log line.

## 6. Status model

Two separate axes — they answer different questions and must not be merged:

| Axis | Values | Set by |
|---|---|---|
| `lifecycle` | `draft` `concepts_ready` `direction_selected` `submitted` | database functions, as the visitor progresses |
| `status` | `NEW` `REVIEW` `CONTACTED` `PROPOSAL` `IN_PROGRESS` `COMPLETED` `ARCHIVED` | Admin only (`builder_set_status`), audited with actor in `builder_status_events` |

Postgres enums reject any other string (`INVALID_INPUT`).

## 7. Team notification (Telegram)

After `builder_submit` succeeds, the server sends the existing `sendContactToTelegram` payload
(unchanged contract; first line `AI Builder · lead <uuid>`) and records the outcome with
`builder_mark_notification`. A failed send leaves `notification_status = 'failed'` — the lead
is still saved and the visitor sees success, because the submission *was* received; the UI
never says the message was delivered. Admin should list `failed` notifications.

## 8. What Admin will consume

Specified and tested in `docs/admin/DATA_CONTRACT.md` (read model draft
`docs/admin/admin-read-model.draft.sql`, checks in `scripts/check-admin-contract.ts`).
Application state and verification steps for the real project:
`docs/builder/PRODUCTION_PREFLIGHT.md`.
