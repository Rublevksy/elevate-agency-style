# ELEVATE AI Project Builder — architecture

Route: `/builder` (`src/routes/builder.tsx`). Status: flow, renderer and **server persistence**
built and tested; the database migration is written but **not yet applied** to the project's
Supabase, and no model key is configured in this repository. Admin panel: not built — its
contract is in `DATA_CONTRACT.md`.

## 1. The rule the whole design follows

The language model never produces anything the browser executes or renders as markup.

```
USER BRIEF ──▶ server fn ──▶ LLM (one forced tool call) ──▶ untrusted JSON
                                                              │
                         spec.ts: zod schema → claim check → sanitise → contrast repair → distinctness
                                                              │ (one repair turn with the issues, else error)
                                                              ▼
                                              DesignSpec (trusted, closed vocabulary)
                                                              │
                                       ConceptRenderer (ELEVATE's own components) ──▶ website preview
```

- The model chooses from **closed enums** (archetype, hero layout, navigation, grid, density,
  display face, radius, borders, depth, imagery, motion) and writes **short copy**. Colours
  are the only open values (`#RRGGBB`, regex-validated, then repaired to WCAG contrast).
- No spec value becomes a class name, a style string outside a lookup table, a URL, or HTML.
  Copy renders as React text nodes after `cleanText` (no markup characters, URLs, control
  characters, or sentences stating figures).
- Section kinds that would require invented business facts do not exist in the vocabulary:
  no testimonials, statistics, pricing, logos, awards, FAQ answers.
- The client's company name and industry shown in previews come from the **brief**, never
  from the model.

## 2. Flow

| Step | UI | Server (all via `builder.functions.ts`) |
|---|---|---|
| 01 Typ | `BriefSteps` — Web / E-shop / Aplikace / Branding | first answer creates the lead + session cookie (`saveBuilderBrief`) |
| 02 Projekt | `BriefSteps` — company, industry, offering, audience, goal (validated on Continue) | autosave, 1 s debounce |
| 03 Vizuál | `BriefSteps` — style, mood (chips), colours, typography, notes (optional) | autosave |
| 04 Reference | `BriefSteps` — ≤5 URLs, textual references (no image upload: no storage bucket) | autosave |
| 05 Koncepty | `AnalysisStage` → `ConceptGallery` → `ConceptViewer` | `generateBuilderConcepts`, `selectBuilderConcept`, `refineBuilderConcept`, `restoreBuilderRevision`, `resyncBuilderConcepts` |
| 06 Kontakt | `ContactStep` — only with a selected concept | `submitBuilderLead` |
| ✓ | `Success` — rendered only after the database accepted the submission | |

`BuilderApp.tsx` owns UI state, the sync indicator (Saving… / Saved / Not saved · Try again),
the offline cache, and step/focus management. It never decides what is saved — the server does.

## 3. Files

```
supabase/migrations/20260914120000_builder_leads.sql   tables, enums, RLS, builder_* functions (see DATA_CONTRACT.md)
src/routes/builder.tsx                     route + head
src/components/builder/
  BuilderApp.tsx                           flow, state, sync status, cache, server calls
  BriefSteps.tsx                           steps 01–04 + per-step validation
  fields.tsx                               TextField, SuggestionChips, ChoiceGroup (native controls)
  StepRail.tsx  BriefSheet.tsx  AnalysisStage.tsx  ConceptGallery.tsx  ConceptViewer.tsx
  ConfirmDialog.tsx  ContactStep.tsx  SpecSummary.tsx
  renderer/{theme.ts, ConceptRenderer.tsx, Visual.tsx, ScaledPreview.tsx}
src/lib/builder/
  spec.ts                                  DesignSpec schema, sanitising, contrast, distinctness
  brief.ts                                 Brief, BriefDraft, Contact, Lead, Revision, LIFECYCLES, LEAD_STATUSES
  errors.ts                                BuilderError + the public error codes
  snapshot.ts                              database snapshot → Lead (re-validates every spec)
  tool-schema.ts  prompts.ts               tool JSON Schema, prompts
  builder.functions.ts                     server functions: the only browser → server doors
  service.server.ts                        lifecycle operations, validation, limits, recovery (injected deps)
  store.server.ts                          typed builder_* RPC calls; DB errors → codes
  session.server.ts                        cookie parsing, token generation, hashing, client key
  ai.server.ts                             generation / refinement with one repair turn
  ai-provider.server.ts                    Anthropic SDK call, error mapping
  storage.ts                               browser cache (not the record), parseLead
  submission.ts                            Lead → existing Telegram payload
  copy.ts                                  UI copy CZ/EN/RU/UA
  fixtures.dev.ts                          DEV ONLY fixture sets (/builder?fixture=1, ?fixture=b)
scripts/
  check-builder-spec.ts                    trust boundary (node scripts/check-builder-spec.ts)
  check-builder-db.ts                      migration in PGlite: RLS, grants, ownership, lifecycle, limits
  check-builder-service.ts                 service layer end to end against the migration, fake model
  builder-dev-db.ts                        local PostgREST stand-in for browser QA (+ outage drill)
  lib/builder-pglite.ts, lib/ts-hooks.mjs  test database harness; `@/` resolution for node
```

`*.server.ts` modules are excluded from client bundles by TanStack Start import protection;
`builder.functions.ts` loads them only inside handlers.

## 4. Persistence

### Server / client boundary

```
browser ──(server fn, httpOnly session cookie)──▶ builder.functions.ts
                                                   │ parse cookie → session; hash client IP → client key
                                                   ▼
                                     service.server.ts  zod-parse input · rate limits · AI · re-validate specs
                                                   │
                                     store.server.ts ──(supabaseAdmin.rpc, service role)──▶ builder_* functions
                                                                                             │ token-hash check, row lock,
                                                                                             │ ids/revisions/lifecycle assigned
                                                                                             ▼
                                                                                   builder_leads / _concepts / _revisions
```

- The body of a request never carries a lead id; any extra field is ignored. The lead is the
  one in the cookie, and the database refuses unless `sha256(token)` matches.
- Concept ids, generation numbers, revision numbers, lifecycle and timestamps are assigned by
  the database. The client's `expectedRevision` is only a conflict check.
- Refinement reads the current spec **from the database** (`builder_get_concept`); the
  browser's copy is never sent to the model or stored.
- Every DesignSpec is validated before it is stored (model output, resync) and again when read
  (`snapshot.ts` on the server, `parseLead` in the browser).

### Lifecycle

| Event | Stored |
|---|---|
| first brief answer | lead row (`draft`) + cookie set in the same response |
| brief edits | brief columns (debounced autosave; retried with backoff 3/8/20/45/60 s, and on `online`) |
| generate | brief saved first → limits → model → five validated specs stored atomically as a new generation (`concepts_ready`); previous set kept as superseded |
| select | `selected_concept_id` (`direction_selected`) |
| refine / restore | `builder_revisions` row + concept `spec`/`revision` |
| submit | contact + `submitted_at`, lead locked; then Telegram → `notification_status` |

### Recovery

| Failure | Behaviour |
|---|---|
| Database down while typing | "Not saved · Try again"; words stay in the cache (`briefDirty`), survive reload, are saved on retry |
| Database down after the model answered | server retries the write (300 ms, 1.2 s), then returns the validated drafts (`saved: false`); UI shows them with "Save concepts"; they survive reload in the cache and are stored via `resyncBuilderConcepts` (re-validated, `source = 'resync'`) |
| Model unavailable / busy / timeout / invalid / refused | honest error; nothing stored; brief kept; on regeneration the existing concepts stay on screen with the error above them |
| Rate limited | `RATE_LIMITED` message; nothing lost; navigation unaffected (autosave has its own generous bucket) |
| Two tabs refine the same concept | `REVISION_CONFLICT`; the UI reloads the record |
| Session lead deleted / cookie invalid | `LEAD_NOT_FOUND` clears the cookie; cached work is saved as a new lead, cached concepts offered for saving |
| Telegram fails | lead saved, `notification_status = 'failed'`; success screen does not claim delivery |
| Storage cleared | record is loaded from the server via the cookie; opens on the concepts step when concepts exist |

The browser cache (`elevate-builder-cache-v2`) is re-validated on every read and replaced by the
server record on every successful load.

### Rate limiting

Shared across all server instances, persisted in `builder_rate_limits` (fixed windows, one
atomic upsert per check — no external service). Client key = `sha256("elevate-builder:" + ip)`
(first 32 hex chars), IP from `cf-connecting-ip` / `x-forwarded-for` / `x-real-ip`.

| Bucket | Limit |
|---|---|
| lead creation per client | 12 / hour |
| writes (autosave, select, restore, submit) per client | 300 / 10 min |
| generation per client | 5 / 10 min and 20 / day |
| generation per lead | 3 / 10 min, and at most 6 generations per lead (database cap) |
| refinement per client / per lead | 30 / 10 min, 20 / 10 min; at most 80 revisions per lead |

Limits are checked before the model is called, so a refused request costs nothing.

## 5. AI integration

- Provider: Anthropic Messages API through the official SDK (`@anthropic-ai/sdk`), server only
  (`ai-provider.server.ts`). Streaming with `finalMessage()`; one tool per call, forced with
  `tool_choice` (auto on models that do not accept forcing); the tool's `input_schema` is
  generated from the zod schema.
- Default model `claude-opus-5`, with server-side fallback (`fallbacks: "default"`) where the
  model supports it. SDK retries: 2.
- Generation: `max_tokens` 32000, timeout 240 s. Refinement: 12000 / 150 s.
- Validation failure → exactly one repair turn (issues returned as an error `tool_result`).
  Figures in a first answer are sent back; on the repair answer they are dropped.
- Distinctness gate: five archetypes, ≥4 hero layouts, ≥3 display faces, every pair differing
  on ≥4 of 9 structural dimensions.
- Error codes reaching the browser: `AI_UNAVAILABLE` (no key, auth, connection), `AI_BUSY`
  (429/5xx/overloaded), `AI_TIMEOUT`, `AI_INVALID` (failed validation twice, or truncated),
  `AI_REFUSED`. Logs carry the code, HTTP status, error type and request id — never the key,
  the brief or the prompt.
- Environment (server only): `ANTHROPIC_API_KEY` (required), `ELEVATE_AI_MODEL`,
  `ANTHROPIC_BASE_URL` (optional; a local mock was used for QA). No real-model call has been
  made from this repository: no key is available here.

## 6. Environment

| Variable | Required | Used by |
|---|---|---|
| `SUPABASE_URL` | yes | `client.server.ts` (service-role client) |
| `SUPABASE_SERVICE_ROLE_KEY` | yes | `client.server.ts` — server only |
| `ANTHROPIC_API_KEY` | yes, for generation | `ai-provider.server.ts` |
| `ELEVATE_AI_MODEL` | no (default `claude-opus-5`) | `ai-provider.server.ts` |
| `ANTHROPIC_BASE_URL` | no | `ai-provider.server.ts` |
| `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID` | for team notification | existing `telegram.functions.ts` |

Local QA without Supabase: `node scripts/builder-dev-db.ts`, then run vite with
`SUPABASE_URL=http://localhost:54399 SUPABASE_SERVICE_ROLE_KEY=local-dev-service-role`.

## 7. Renderer

`resolveTheme(spec)` maps enums to concrete values ELEVATE chose: available font stacks
(self-hosted Inter, Montserrat, Fira Sans (Extra) Condensed; system serif, rounded and mono
stacks — no third-party font request), container-relative `clamp()` type sizes, density →
spacing multiplier, radius/border/shadow tiers, CSS custom properties for the palette.

`ConceptRenderer` composes: navigation (bar, centered-logo, minimal-menu, split-cta; all
collapse to brand + menu under 720px of container width), hero (split-media,
full-bleed-media, typographic, centered-statement, offset-collage, product-stage), sections
(features, services, showcase, process, story, products, gallery, cta) and a footer. Layout is
responsive by **container query**, so the same concept renders a real phone layout in a 390px
frame and a desktop layout in a 1280px frame. Motion (`Reveal`) follows the spec's motion
level/signature and is off in thumbnails and under reduced motion.

`Visual` is the only "imagery": palette-derived compositions per imagery style with a caption
("Obrazová plocha · <what the image would show>") — clearly a placeholder, never a photo.

## 8. Security summary

| Threat | Control |
|---|---|
| Model emits HTML/JS/CSS | Closed enums; text rendered as React text; no `dangerouslySetInnerHTML`; markup stripped |
| CSS injection via colours | `#RRGGBB` regex; values only reach CSS custom properties |
| Unreadable output | Contrast repair: ground ≥8:1 to a pole, text ≥7:1, muted ≥4.5:1, on-accent ≥4.5:1 |
| Invented facts | No fact-bearing section kinds; figures rejected then dropped; brand/industry from brief |
| Prompt injection in brief | Brief wrapped as data; only channel back is the validated tool call |
| Reading / listing / modifying other leads | No lead id accepted from the browser; token-hash check in every function; composite FKs; no list function |
| Direct database access with the publishable key | RLS on, no policies, all grants revoked from anon/authenticated (tested) |
| Tampered cache or request body | zod on every input; specs re-validated; refinement uses the stored spec |
| Forged revision numbers | Assigned by the database; client value only a conflict check |
| Status tampering | `status` changeable only by `builder_set_status`, exposed to no Builder function |
| Key leakage | Keys read server-side only; production client bundle scanned: no service-role or model key name, SDK, endpoint, tool name, prompt or RPC name |
| Session theft from the database | Only token hashes stored; cookie httpOnly |
| Cost abuse | Input limits; shared persistent rate limits checked before any model call; per-lead caps |
| Fake success | Concepts shown as saved only after the database stored them; success only after the database accepted the submission; Telegram outcome recorded, never assumed |

## 9. Tests

```
node scripts/check-builder-spec.ts                                         # 11 checks
node --import ./scripts/lib/ts-hooks.mjs scripts/check-builder-db.ts       # 16 checks (incl. preflight SQL)
node --import ./scripts/lib/ts-hooks.mjs scripts/check-builder-service.ts  # 19 checks
node --import ./scripts/lib/ts-hooks.mjs scripts/check-admin-contract.ts   # 9 checks (Admin read model draft)
node scripts/verify-builder-remote.ts          # read-only check of the real project (uses .env / env keys)
```

On the real project, after applying the migration, run `scripts/sql/builder-preflight.sql` in
the SQL editor (read-only catalog checks). Current state: `PRODUCTION_PREFLIGHT.md`.

The database and service checks run the real migration in PGlite (Postgres 17, WASM) inside a
Supabase-shaped role setup, so RLS and grants are exercised as they would be in the project.

## 10. Verification pass (Phase 1.1)

The foundation commit had only ever rendered the variants its one fixture used. A second
fixture set (B) now covers every renderer path, and both sets pass the same pipeline as model
output (`scripts/check-builder-spec.ts`). Rendering all ten concepts full-page at desktop
(1280 layout) and phone (390 layout) found and fixed:

| Defect (never rendered before) | Fix |
|---|---|
| A near-limit headline in a `split-media` hero set 7 lines deep in a 15ch column | headline size and measure adapt to length (>44 / >64 characters) in every hero |
| `story` without items left the image alone beside an empty column | title/body and image form a two-column split |
| `full-bleed-media` put the placeholder's subject behind the headline | media owns the right 66% on wide containers with a left scrim; phones keep the bottom scrim |
| `type-only` repeated one identical letter per tile | three seeded compositions per slot |
| phone galleries stacked five large squares | three tiles below 720px container width |

Flow changes in the same pass: native `window.confirm` replaced by `ConfirmDialog`; the
refinement live region announces the actual new revision; when the interface language differs
from the language the concepts were generated in, the gallery says so and offers regeneration;
the viewer's scrollable preview is a named, focusable region; phone header no longer wraps.

Mock-API regression (local stand-in for the Messages API): rejected first set → repair turn →
five concepts; regenerate through the dialog; refinement rejected by schema → honest error with
the concept unchanged; valid refinement → revision 1 persisted and announced.
