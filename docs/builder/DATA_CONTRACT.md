# Builder → Admin data contract

The single source of truth for the shapes is code: `src/lib/builder/brief.ts` (`LeadSchema`,
`BriefSchema`, `BriefDraftSchema`, `ContactSchema`, `RevisionSchema`) and
`src/lib/builder/spec.ts` (`DesignSpecSchema`). This document explains them for the Admin
phase and records what is and is not persisted today.

## 1. Persistence today (Phase 1) — and why

Inspection of the repository found Supabase connected (`src/integrations/supabase/*`) but
**no tables** (`types.ts` has `Tables: never`), **no migrations**, and **no service-role key**
in the local environment; the integration files are generated and protected. There is
therefore no trustworthy server-side place to write a lead yet, and this phase does not
invent one.

| What | Where | Lifetime |
|---|---|---|
| Whole `Lead` (brief, 5 concepts, revisions, selection) + contact draft | browser `localStorage` key `elevate-builder-lead-v1`, re-validated on load | until the visitor starts over or clears storage |
| Submitted lead | existing `sendContactToTelegram` pipeline: structured summary led by `lead <uuid>` | Telegram chat |

The Telegram message carries: lead id, company + industry, project type, deadline, budget
label, goal, audience, chosen direction (name, archetype, revision, refinement count), its
system (display face, hero layout, mode, background + accent), message, offering, visual
preferences, reference URLs and notes (truncated to the pipeline's 2000-character limit).
**The full DesignSpecs and revision history are not sent** — they exceed the protected
contract (`message` ≤ 2000) and are the reason the Admin phase needs a table.

## 2. Lead (schemaVersion 1)

```ts
Lead {
  id: uuid                         // generated in the browser; appears in the Telegram message
  schemaVersion: 1
  status: "draft" | "concepts_ready" | "direction_selected" | "submitted"
  lang: "CZ" | "EN" | "RU" | "UA"  // language of the UI and of generated copy
  createdAt: ISO string
  updatedAt: ISO string
  brief: BriefDraft                // strict Brief at the moment of generation (see below)
  concepts: DesignSpec[]           // 0 or 5
  selectedConceptId: string | null // DesignSpec.id
  revisions: Revision[]            // ≤ 60, oldest first, all concepts
  contact: Contact | null          // set only on successful submission
  submittedAt: ISO string | null   // set only on successful submission
}

Brief {
  projectType: "web" | "eshop" | "app" | "branding"
  project:    { company 1–80, industry 2–80, offering 10–600, audience 3–300, goal 3–300 }
  visual:     { style ≤300, mood ≤200, colors ≤200, typography ≤200, notes ≤800 }   // free text, optional
  references: { urls: http(s) URL[] ≤5, notes ≤800 }
}

Contact {
  name 1–100, email, company 1–80,
  budgetIndex 0–4   // index into t.contact.form.budgets; CZK value via BUDGET_VALUES [20000, 50000, 100000, 150000, 0]
  deadline: "asap" | "1m" | "1-3m" | "3m+" | "unsure"
  message ≤1200
}

Revision {
  id: uuid
  conceptId: string
  feedback: string ≤600            // "" = restore of an earlier version
  before: DesignSpec
  after: DesignSpec                // after.revision = before.revision + 1
  createdAt: ISO string
}
```

## 3. DesignSpec

```ts
DesignSpec {
  id: string /^[a-z0-9-]{4,64}$/   // assigned by the server, stable across revisions
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

Admin can render any stored spec with `ConceptRenderer` exactly as the client saw it — the
renderer is deterministic (placeholder compositions are seeded by `id` + slot).

**Rule for every consumer:** a spec read from storage is untrusted. Pass it through
`parseStoredSpec` before rendering, as the Builder does.

## 4. Proposed table for the Admin phase (not applied)

Applying this requires the owner to decide on Supabase usage, add a migration, regenerate
`types.ts`, and configure `SUPABASE_SERVICE_ROLE_KEY` for server functions. Leads are written
**only** by a server function (service role), never from the browser.

```sql
create table public.builder_leads (
  id                  uuid primary key,
  schema_version      smallint not null default 1,
  status              text not null check (status in ('draft','concepts_ready','direction_selected','submitted')),
  lang                text not null check (lang in ('CZ','EN','RU','UA')),
  project_type        text not null check (project_type in ('web','eshop','app','branding')),
  company             text not null,
  brief               jsonb not null,         -- Brief
  concepts            jsonb not null default '[]',   -- DesignSpec[]
  selected_concept_id text,
  revisions           jsonb not null default '[]',   -- Revision[]
  contact             jsonb,                  -- Contact (PII)
  budget_czk          integer,
  deadline            text,
  admin_status        text not null default 'new'
                      check (admin_status in ('new','contacted','qualified','proposal','won','lost','spam')),
  admin_notes         text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  submitted_at        timestamptz
);
alter table public.builder_leads enable row level security;
-- No policies for anon/authenticated: only the service role (server functions) reads/writes.
create index builder_leads_submitted_at on public.builder_leads (submitted_at desc);
create index builder_leads_admin_status on public.builder_leads (admin_status);
```

Admin needs, in addition to the Builder's own `status`: an `admin_status` pipeline, notes,
and access control (Supabase Auth or equivalent) — none of which the Builder writes.

## 5. What Admin will consume

- List: `id, company, project_type, status, admin_status, budget_czk, deadline, submitted_at`.
- Detail: brief, the selected concept rendered with `ConceptRenderer`, the other four concepts,
  revision timeline (feedback → before/after), contact.
- Matching legacy Telegram leads: the message's first line `AI Builder · lead <uuid>`.
