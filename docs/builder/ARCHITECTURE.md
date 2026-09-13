# ELEVATE AI Project Builder — Phase 1 architecture

Route: `/builder` (`src/routes/builder.tsx`). Status: foundation and UX flow built;
generation wired to a real model API but **not configured** in this repository (no key).
Admin panel: not built — see `DATA_CONTRACT.md`.

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

| Step | UI | Notes |
|---|---|---|
| 01 Typ | `BriefSteps` | Web / E-shop / Aplikace / Branding — native radio group |
| 02 Projekt | `BriefSteps` | company, industry, offering, audience, goal (required, validated on Continue) |
| 03 Vizuál | `BriefSteps` | style, mood (with suggestion chips), colours, typography, notes — all optional, free text |
| 04 Reference | `BriefSteps` | up to 5 URLs (http/https validated), textual references; image upload not offered (no storage bucket exists) — said so in the UI |
| 05 Koncepty | `AnalysisStage` → `ConceptGallery` → `ConceptViewer` | indeterminate analysis state (no percentages, nothing "completes" early); honest failure with retry / edit brief / contact; five rows with scaled real-layout previews; Open, Select, Refine with AI; viewer with desktop (1280 scaled) and phone (true 390px, container-query layout); revision history with restore |
| 06 Kontakt | `ContactStep` | only reachable with a selected concept; name, email, company, budget (existing `t.contact.form.budgets`), deadline, message |
| ✓ | `Success` | rendered only after `sendContactToTelegram` resolves |

`BuilderApp.tsx` owns the state (one `Lead`), persistence, server calls and step/focus management.

## 3. Files

```
src/routes/builder.tsx                     route + head
src/components/builder/
  BuilderApp.tsx                           flow, state, persistence, server calls
  BriefSteps.tsx                           steps 01–04 + per-step validation
  fields.tsx                               TextField, SuggestionChips, ChoiceGroup (native controls)
  StepRail.tsx                             progress that is also navigation
  BriefSheet.tsx                           live brief document
  AnalysisStage.tsx                        working / failure state
  ConceptGallery.tsx                       five directions
  ConceptViewer.tsx                        Radix dialog: preview, system, refine, revisions, select
  ConfirmDialog.tsx                        Radix alert dialog for start over / replace concepts
  ContactStep.tsx                          contact after selection
  SpecSummary.tsx                          swatches, type sample, hero schematic
  renderer/theme.ts                        DesignSpec enums → tokens (fonts, clamps, spacing, radii…)
  renderer/ConceptRenderer.tsx             nav ×4, hero ×6, sections ×8, footer; @container responsive
  renderer/Visual.tsx                      art-directed image placeholders (never photos)
  renderer/ScaledPreview.tsx               lay out at 1280, scale to fit
src/lib/builder/
  spec.ts                                  DesignSpec schema, sanitising, contrast, distinctness (zod only)
  brief.ts                                 Brief, BriefDraft, Contact, Lead, Revision schemas
  tool-schema.ts                           zod → JSON Schema for the tool definition
  prompts.ts                               system / generation / refinement / repair prompts
  ai-provider.ts                           Messages API call (fetch), error codes
  ai.functions.ts                          generateConcepts, refineConcept (server functions)
  storage.ts                               localStorage persistence with re-validation
  submission.ts                            Lead → existing contact pipeline payload
  copy.ts                                  UI copy CZ/EN/RU/UA
  fixtures.dev.ts                          DEV ONLY sample concepts: set A (/builder?fixture=1, Czech) and
                                           set B (/builder?fixture=b, Ukrainian); absent from prod bundles
scripts/check-builder-spec.ts              trust-boundary checks (node scripts/check-builder-spec.ts)
```

## 4. AI integration

- Provider: Anthropic Messages API via `fetch` (no SDK dependency). One tool per call with
  `tool_choice` forcing it; the tool's `input_schema` is generated from the zod schema.
- Environment (server only; never exposed to the client — verified by bundle scan):
  - `ANTHROPIC_API_KEY` — required. Without it every call returns `AI_UNAVAILABLE`.
  - `ELEVATE_AI_MODEL` — optional, default `claude-sonnet-5`.
  - `ANTHROPIC_BASE_URL` — optional (gateway; used with a local mock in QA).
- Generation: `max_tokens` 16000, timeout 150 s. Refinement: 5000 / 90 s.
- Validation failure → exactly one repair turn (the rejection is returned as a `tool_result`
  with `is_error`, listing the issues). First answers containing figures are sent back to be
  rewritten; on the repair answer, sentences stating figures are dropped instead.
- Distinctness gate: five different archetypes, ≥4 hero layouts, ≥3 display faces, and every
  pair differing on ≥4 of 9 structural dimensions (colour alone never counts).
- Errors reaching the browser are codes only: `INVALID_INPUT`, `RATE_LIMITED`,
  `AI_UNAVAILABLE`, `AI_BUSY`, `AI_TIMEOUT`, `AI_INVALID`. The UI maps each to an honest
  message in four languages; the brief is preserved; retry is offered.
- Abuse guard: in-memory per-IP limit (6 generations / 30 refinements per 10 min per server
  instance). Best effort only — see Remaining work.

## 5. Renderer

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

## 6. Security summary

| Threat | Control |
|---|---|
| Model emits HTML/JS/CSS | Closed enums; text rendered as React text; no `dangerouslySetInnerHTML`; markup characters stripped |
| CSS injection via colours | `#RRGGBB` regex; values only reach CSS custom properties |
| Unreadable output | Contrast repair: ground ≥8:1 to a pole, text ≥7:1, muted ≥4.5:1, on-accent ≥4.5:1 |
| Invented facts | No fact-bearing section kinds; figures rejected then dropped; brand/industry from brief |
| Prompt injection in brief | Brief wrapped as data; only channel back is the validated tool call |
| Tampered localStorage / request body | `parseStoredSpec` on load and in `refineConcept` input |
| Key leakage | Key read server-side at call time; client bundle scanned: no key name, URL, tool or prompt |
| Cost abuse | Input limits, per-IP throttle (best effort) |
| Fake success | Concepts shown only after server + client validation; success only after the send resolves |

## 7. Verification pass (Phase 1.1)

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
