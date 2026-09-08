# VISUAL DIRECTION V3 — "THE LIGHT TABLE"

**Status: proposal, not approved. Nothing built. No Higgsfield credits spent
against this document.** Written 2026-09-08, in direct response to the
independent critique of `VISUAL_DIRECTION_V2.md` (§20 there) and the owner's
confirmation that maximum visual WOW is the correct, permanent goal — this is
not a retreat from that goal, it is a structural fix to how V2 tried to
deliver it. V2's six-scene shape, its "matter becomes signal" thesis, and its
credit discipline are kept. What changes is the physical object the whole
world is built around, because the critique correctly found that V2's object
— a dark void with one traveling glow — is close to the exact cluster this
project already rejected once (`REJECTED_DIRECTIONS.md`'s "Vitrine": *"dark
scene, hot light sources, glass, reflections… is exactly the cluster every
AI generation collapses into."*) V3 does not patch that finding with a
stronger warning label. It replaces the object.

## 1. Final creative thesis

**ELEVATE turns real material into real, live digital products — and the
homepage is built around the one physical object where that transformation is
actually watched: a light table.** A light table (an illuminated glass or
acrylic surface, backlit, used across real print, film, and design production
to inspect and register physical material — transparencies, film strips,
proofing sheets, layout boards) is a genuine, specific, ownable object with a
distinct visual logic: light comes from *underneath and behind* what's on it,
not from a raking key light in a dark void. Material laid on it becomes
legible by being lit through, not lit across — which is a precise, literal
restaging of "matter into signal" as an actual optical fact, not a metaphor
bolted onto generic dark-studio photography.

Every one of the six scenes is the same table, at a different point in one
continuous session at it — powering on, loaded with five services' worth of
material, held still, showing real client film, receiving the visitor's own
material, and finally at rest. One object carries the entire homepage. This
is the structural fix the critique demanded: not "avoid genericness" as a
rule, but a specific enough physical premise that a generic prompt would not
arrive at it by default.

## 2. Visual identity system

### 2.1 The object

A long, backlit table — its glowing surface is the ELEVATE blue
(`oklch(0.65 0.18 255)`) itself, always. Everything placed on it is lit by
that glow from below/behind, never by an external key light. This single
constraint is what keeps "glow is back" (V2 §3) from reading as decorative
ambient bloom: the light in this world always has one, and only one, source
— the table — and it never appears anywhere the table isn't. This is a
stronger, checkable version of V2's rule ("light only touches what it
transforms"), because it is now enforceable by asking one question of any
frame: *is the glow coming from the table, or from somewhere else?* If
somewhere else, the frame is wrong.

### 2.2 The code-drawn grammar (the anti-generic signature)

Every scene carries the same recurring, precisely-drawn overlay, always in
the ELEVATE blue, always code-drawn (SVG, not generated — sharp at any DPR,
recolorable, animatable, zero defect risk because nothing about it is
photographic): **registration crosses, crop marks, a running measurement
scale along the table's edge, and punch/register holes** — the real graphic
vocabulary of print and film production, not an invented sci-fi HUD. This is
not a new invention from zero: it is a direct continuation of the one part of
Production Strip that survived its own critique cleanly — the rail's
perforation, tick marks, and state-mark vocabulary (`VISUAL_LANGUAGE.md` §5,
`CAMERA_SYSTEM.md` §5). Where Production Strip built an entire minimalist
world around that grammar, V3 keeps the grammar and gives it a richer, more
cinematic object to sit on top of.

This is the concrete answer to the brief's "recognizable as ELEVATE even
without the logo": no other agency site, and no generic AI-generated hero,
carries a consistent, precise registration-mark system tied to a literal
light table. It is specific enough to be a signature, not decorative enough
to be arbitrary — crop marks and registration crosses exist because a real
print table has them, not because they look technical.

### 2.3 Material (the second anti-generic safeguard)

V2's material world — basalt, anodized aluminum, glass, concrete — is a
"moody premium tech" cluster used everywhere in generated hero content. V3
replaces it with **print- and film-production materials specifically**: cut
acetate, exposed and unexposed film leader, litho proofing plates, cast
resin blocks, backlit vellum, foil-blocked proof cards. These are unusual in
generated marketing imagery precisely because they are specific to a real
craft most generation prompts never reference — which is the actual
mechanism the brief asked for ("unusual material combinations"), not a
restatement of the same materials with a warning attached.

### 2.4 Typography as exposure, not overlay

Kinetic headlines are staged as if photographically exposed onto the same
vellum/film material sitting on the table — catching the table's backlight
as it passes under them, sharpening into focus as the camera nears, never
floating as a UI layer above the scene. This ties typography into the object
grammar itself (§2.2/§2.3), directly answering the brief's "typography
integrated into the environment," and is a further structural anti-generic
measure: floating kinetic headline text over a dark backdrop is itself a
generic-AI-hero trope; type behaving as a physical, lit material is not.

### 2.5 What is unchanged from V2/DESIGN.md

Exactly one chromatic accent, ever (§2.1 makes this stricter, not looser: the
accent is now specifically the table's own light, not a free-floating hue).
No cards, no browser chrome, no rounded panels. Logo and all copy stay DOM,
never generated, in all four languages.

## 3. Visual density strategy

The owner's explicit correction — WOW is not emptiness — is answered
structurally by the object choice itself: a table is built to hold many
things at once. Density is not an effect layered onto a sparse scene; it is
the default state of the object.

- **Dense, by default:** Scenes 1, 2, 4, and 5 — the table is visibly loaded
  with multiple real, distinct pieces of material, overlapping, at different
  depths, catching light differently. This is the visually rich, layered,
  "meaningful graphics" register the brief asks for, and it is achievable
  because a table full of material is inherently a busier, richer composition
  than a void with one glowing arc.
- **Contrast without emptying the frame:** Scene 3 (the Quiet Room) does
  **not** clear the table. It holds the exact material density Scene 2 built
  up, and simply stops moving and dims the glow to a resting level. The
  brief's own instruction is explicit here — *do not turn the pause into a
  generic minimalist section* — and the fix is structural: contrast in this
  direction is achieved by holding motion still, never by removing content.
  A viewer who pauses their scroll mid–Scene 3 sees a fully loaded table at
  rest, not an empty frame with a caption.
- **Scene 6 is the one deliberately spare frame** — the table cleared back to
  its own glow, everything the visitor and the studio built together now
  gone quiet — and it earns that emptiness precisely because it is the only
  scene that has one, after five scenes that did not.

## 4. Distinctive anti-generic safeguards (structural, not rules-as-prose)

Each safeguard below is checkable against a specific frame, not a general
instruction to "avoid genericness":

1. **Single motivated light source, always the table.** Any glow not
   originating from the table's own surface is a defect, checkable per frame
   (§2.1).
2. **Print/film material vocabulary only** — acetate, film, litho plate,
   resin, vellum, foil-blocked card. No basalt, no anodized aluminum-as-
   default-luxury-material, no smoked glass — the exact cluster the critique
   flagged as generic is excluded by naming its replacement, not by warning
   against the original.
3. **Registration-mark grammar present in every generated and code-drawn
   frame**, at a consistent scale and position logic (running off the
   table's own edge, not decorative center placement) — this is the
   single fastest test of whether a candidate frame belongs to this world:
   if the registration marks were removed, would the frame still look
   unmistakably like ELEVATE's table, or could it be any studio's hero
   image? If the latter, the frame fails regardless of how polished it looks.
4. **No floating disconnected UI/dashboard/chart imagery anywhere** —
   inherited from V2 §16 and T6's own lesson, still binding.
5. **Kinetic type behaves as exposed material** (§2.4), never as a UI layer
   — a headline that merely translates/fades over the backdrop, uncoupled
   from the table's light, fails this safeguard even if the backdrop itself
   passes.
6. **A same-brief, same-prompt-family test — a hard gate, not a flag:**
   before any candidate is accepted, generate the equivalent frame with the
   registration-mark overlay and material naming stripped out, and compare.
   If the stripped version is indistinguishable from generic dark-tech
   marketing imagery, **the candidate fails, full stop** — it is not
   accepted on the strength of the code-drawn overlay alone. Distinctiveness
   must come from the photography itself; the overlay is confirmation, not
   compensation. (This was originally written as a softer "flag, don't
   reject" — corrected after the independent critique in §17 named it as
   the one place this document let its own stated safeguard collapse into
   the exact thing it was supposed to prevent: genericness papered over by
   code.)

## 5. Six-scene narrative — matter/signal audit

Every scene answers, explicitly, what the "matter" is, what the "signal" is,
what transforms, and how it connects to ELEVATE's real business — the audit
the critique demanded, run against the redesigned scenes rather than the
original ones.

### Scene 1 — IGNITION

- **Matter:** an inert sheet of unexposed film/vellum, lying dark on a table
  that has not yet powered on.
- **Signal:** the table itself lighting up from beneath for the first time.
- **Transformation:** the sheet, lit from below, resolves from blank material
  into the first legible shape of a digital product — the same "camera
  enters the display" beat V2/`PRODUCT.md` §06 already specified, now staged
  as backlighting rather than a camera flying into a screen.
- **Story function:** the whole homepage's mechanism, demonstrated once,
  before any copy has to argue for it.
- **Business connection:** literal restaging of "we turn raw material into
  real digital products" as an optical event, not a claim.

### Scene 2 — THE FIVE STATIONS (Services + pricing tail)

- **Matter:** five distinct print/film materials, one per service — a litho
  proof sheet (Web), an exposed film strip with a visible signal trace (SEO —
  the "path lighting up," restaged as film exposure rather than an abstract
  map), a foil-blocked product card (E-shop), cast resin catching a color
  bar (Branding), cut acetate layered over a device silhouette (Applications).
- **Signal:** the same table light, now organized into five distinct pools
  along its length, one per station.
- **Transformation:** each material mid-exposure, caught at the instant it
  becomes legible as its service's actual deliverable — never fully "finished"
  in frame, keeping five stops from reading as five separate ads.
- **Story function:** one integrated studio, five disciplines, one table —
  not five departments.
- **Business connection:** real services, real pricing tail (unchanged
  decision, `IMPLEMENTATION_PLAN` T12), no fabricated results.

### Scene 3 — THE QUIET ROOM

- **Matter:** the same five materials from Scene 2, undisturbed, still on
  the table.
- **Signal:** dimmed to a resting glow, no longer traveling.
- **Transformation:** none — the one scene explicitly about held, not
  advancing, material (§3).
- **Story function:** the breath that makes Scene 4 land harder by contrast.
- **Business connection:** short, real copy on how ELEVATE actually works —
  not a platitude wall.

### Scene 4 — FOUR REELS (Cases) — redesigned, not rationalized

The critique correctly found V2's Scene 4 broke the metaphor: real
screenshots behind an unrelated "portal" device, no material transformation,
V2's own document admitting "none required" for generated assets there. V3
does not defend that design; it replaces it.

- **Matter:** four real strips of exposed film, physically laid on the same
  table, each one representing one real client project — not an abstract
  portal, the *same object* every other scene uses.
- **Signal:** the table's light now passing directly through each film strip,
  the way a real light table is actually used to inspect film.
- **Transformation:** each strip resolves, under the table's light, from a
  dim frame into the real, live client site at full clarity — using the
  existing `mshots` screenshot pipeline unchanged; the real screenshot *is*
  what the film resolves into, not a separate frame layered over it.
- **Story function:** the studio's own table, now showing what it actually
  produced — real proof, staged with the same grammar as everything claiming
  to lead to it, instead of a disconnected screenshot grid (the exact
  register break `DESIGN.md` names as the incumbent's central defect).
- **Business connection:** real domains, real problem/transformation/process/
  result copy from `projects-i18n.ts`, unchanged. A client's own brand color
  is permitted only inside its own film strip — the one named exception to
  the one-hue rule, carried from V2 §4, now with a more concrete physical
  justification (it's that client's own material, not the studio's).

### Scene 5 — YOUR TABLE (Builder) — redesigned, not rationalized

V2's Scene 5 was the critique's named weakest scene: no visual precedent, an
"object" that meant nothing concrete. V3 fixes this the same way it fixed
Scene 4 — by putting the visitor's inputs into the *same* physical grammar
instead of an invented abstraction.

- **Matter:** blank strips of the same film/vellum material used everywhere
  else, now being laid onto the table one at a time as the visitor answers
  each step (business type → project type → goals).
- **Signal:** the table's light catching each new strip the visitor adds,
  exactly as it caught Scene 1's first sheet.
- **Transformation:** the visitor's own answers become visible material on
  the studio's own table — the same transformation the visitor has now
  watched happen five times, now happening to their own project.
- **Story function:** control genuinely transfers here (unchanged from V2 —
  pointer/keyboard-directed, not scroll-directed), but now the visitor is
  demonstrably building on the *same object*, not a separate interactive
  widget dropped into a cinematic page.
- **Business connection:** existing `sendContactToTelegram` payload, existing
  `t.contact.form.*` strings, unchanged. `PRODUCT.md` §15's optional
  AI-generated visual-direction step remains explicitly out of scope here,
  same as V2 — a separate, later, approval-gated feature.

### Scene 6 — COMMIT (Closing / CTA)

- **Matter:** the table, cleared of everything built during the session —
  the one deliberately spare frame (§3).
- **Signal:** resting glow, unchanged from Scene 3's level, now alone in
  frame.
- **Transformation:** none — direct bookend to Scene 1's ignition, inverse
  motion (pull-back vs. push-in).
- **Story function:** invitation, not fade-out — `PRODUCT.md` §17.
- **Business connection:** existing CTA, contact details, unchanged logic.

## 6. Desktop / mobile / reduced-motion signal system

The critique's sharpest technical finding: V2 claimed one continuous
mechanism "present in every scene" while silently swapping it for something
else below the `cinematic` tier. V3's object choice makes an honest answer
possible, because the table's core glow is achievable in plain CSS/SVG and
was never actually dependent on WebGL:

| Tier | What's present | What's not |
|---|---|---|
| **Desktop, `cinematic`** (capable GPU, fine pointer, ≥1024px, no reduced-motion) | Full table: generated material photography, CSS depth staging, registration-mark SVG grammar, table glow — **plus** one optional WebGL/Canvas enhancement layer: fine dust/grain motion in the light beam | Nothing withheld |
| **Desktop/tablet, `motion`** (same content, weaker device/pointer) | Full table: same photography, same CSS depth staging, same registration grammar, same glow | WebGL dust layer only — a pure atmospheric enhancement, never load-bearing for meaning |
| **Mobile** | Same photography (responsively cropped), same registration grammar, same table glow, simplified single-plane staging (no CSS 3D rig — scenes un-pin below `lg`, proven pattern, `DESIGN.md` confirms this split is clean) | CSS 3D depth rig, WebGL layer |
| **Reduced motion** | Full table, fully lit, at a single resting frame per scene — the object and its meaning are completely present, nothing hidden, matching Production Strip's own proven rule that reduced motion is a complete page, not an amputated one (`CAMERA_SYSTEM.md` §7) | All scrubbing/travel motion; the ignition, exposure, and travel *become* held states rather than animations |

The one honest sentence this table lets V3 state, that V2 could not: **the
table itself — its material, its light, its registration grammar — is
present and semantically complete on every tier. Only atmospheric enhancement
(the WebGL dust layer) and camera travel degrade.** Nothing swaps mechanism;
things are subtracted from one mechanism, in order, by tier.

**A second, more honest sentence, added after critique (§17):** "semantically
complete" is true and is not the same claim as "equally spectacular."
Volumetric dust moving through a real light beam is exactly the kind of
cheap, high-yield spectacle the owner's brief is asking for, and a visitor
on the `motion` tier genuinely gets a smaller WOW hit than one on
`cinematic`, not merely a scene that "means" the same thing with less
atmosphere. That gap is accepted, not hidden — the alternative (forcing
WebGL onto weaker devices) trades a real accessibility/performance harm for
a marginal visual gain on exactly the visitors least able to afford it.

## 7. Motion grammar

1. **Light only ever originates from the table** (§2.1, §4.1) — replaces
   V2's looser "signal only touches what it transforms."
2. **Camera-first, not element-first** — unchanged from V2/`PRODUCT.md` §08.
3. **Scroll drives continuously**, except Scene 5 where control explicitly
   transfers — unchanged from V2, reuses `useAct`/`CinematicStage`.
4. **Typography moves as exposed material** (§2.4), never as an independent
   UI block.
5. **New: objects on the table have real physical logic when they move** —
   they lie flat, they're placed and lifted, they never float, spin
   freely, or defy the table's own plane. This is a stricter version of
   "one camera, one world" (`PRODUCT.md` §08) tuned specifically to this
   object: a light table's contents behave like real objects on a real
   surface, not like generic UI elements drifting in 3D space.

## 8. Asset generation matrix

| Asset | Scene(s) | Subject risk (per T6) | Candidates budgeted | Notes |
|---|---|---|---|---|
| Table backdrop, powered off → on | 1 | Low — no screens, no UI, pure material/light | 4 raw → 1 master | Reused (regraded) for Scene 6's resting frame — no separate generation |
| Table backdrop, five-station loaded | 2 | Low-medium — five materials in one frame raises compositional complexity, still no legible UI | 4 raw → 1 master | Reused (regraded, dimmed) for Scene 3 — no separate generation |
| Web station material (litho proof sheet) | 2 | Low | 4 raw → 1 master | |
| SEO station material (exposed film w/ signal trace) | 2 | Low-medium — a "trace" risks reading as an attempted chart/graph if not carefully prompted; audited specifically for this | 4 raw → 1 master | |
| E-shop station material (foil-blocked card) | 2 | Low | 4 raw → 1 master | |
| Branding station material (resin + color bar) | 2 | Low — color bars are a real print artifact, not UI; still audited for stray text | 4 raw → 1 master | |
| Applications station material (acetate over device silhouette) | 2 | Medium — device silhouette is the closest thing to a "screen" in this matrix | 4 raw → 1 master | Silhouette only, never an active/lit screen face — the specific defect zone T6 confirmed |
| Case film-strip holder | 4 | None — procedural (SVG sprocket/strip frame), no generation | 0 | Real screenshots via existing `mshots`, unchanged |
| Builder film strips | 5 | None — procedural, reuses Scene 4's strip grammar | 0 | |
| Ignition video clip (optional) | 1 | Medium — motion adds a new failure surface (T6 only audited stills) | 1 clip, tested in Proof A before any further commitment | `seedance_2_0` — see `PROOF_PLAN.md` |

Six generated stills total (down from V2's seven-plus-portal-treatment line
items), each on a lower-risk subject than V2's "active glowing UI screens" —
this is the direct, named fix to the critique's credit-realism finding: the
subject matter itself now carries less defect risk, not just a larger
buffer against the same risk.

## 9. Higgsfield skill/model strategy

- `mcp__higgsfield__generate_image_batch` with `nano_banana_pro`, 2k, 4
  candidates per still (§8) — primary tool, proven in T6.
- `higgsfield-product-photoshoot` — worth one small comparison batch (2-3
  frames) against hand-authored `nano_banana_pro` prompts for the five
  station materials specifically, before committing the full batch; not
  assumed superior without that test (unchanged reasoning from V2 §11).
- Master upscale: `nano_banana_pro` 4k on winners only, after the defect
  audit, not before.
- **Targeted fix over full regeneration, where possible.** T6 found defects
  were often localized (one screen, one swatch strip) rather than whole-
  frame failures. Before discarding a candidate with a small, isolated
  defect, attempt an inpaint/outpaint pass on just that region — cheaper
  than a full regeneration and directly answers the brief's "targeted
  editing where possible."
- `mcp__higgsfield__generate_video` with `seedance_2_0` — Scene 1's clip
  only, gated behind Proof A's result (`PROOF_PLAN.md`), not committed here.
- Not used: `higgsfield-soul-id`, `higgsfield-marketplace-cards`,
  `higgsfield-video-explainer`, `higgsfield-youtube-thumbnail` — unchanged
  reasoning from V2 §11. `higgsfield-brandkit` remains optional/later, only
  if the registration-mark system benefits from being locked as a formal
  brand asset — not required to ship this direction.

## 10. Realistic ~1000-credit budget

| Line item | Basis | Credits |
|---|---|---|
| 6 stills × 4 raw candidates × 2cr (`nano_banana_pro` 2k) | §8 matrix | 48 |
| Small comparison batch, `higgsfield-product-photoshoot` vs. hand-authored | §9 | ~6 |
| 6 master upscales × 4cr (`nano_banana_pro` 4k) | winners only | 24 |
| Targeted inpaint/outpaint fixes, budgeted for up to 3 stills needing it | §9, learned from T6's localized-defect pattern | ~12 |
| **Subtotal, still images** | | **≈ 90** |
| Proof A: hero ignition test (see `PROOF_PLAN.md`) — stills + 1 video clip test | gated, tested before further spend | ≈ 45 (2 image candidates ~4cr + 1 `seedance_2_0` clip ~25cr + contingency) |
| Proof B: hero → services transition test | gated | ≈ 10 (reuses Proof A / Scene 2 assets, mostly code) |
| **Subtotal, proof plan** | | **≈ 55** |
| **Committed total, this phase** | | **≈ 145** |
| Named reserve: full regeneration if a station fails even after inpaint | explicit, not padding | 60 |
| Named reserve: mobile-specific replate if a backdrop doesn't crop cleanly | explicit | 40 |
| Named reserve: second Ignition video take if Proof A's first clip doesn't clear the WOW bar | explicit | 25 |
| **Named reserve total** | | **125** |
| **Total allocated** | | **≈ 270** |
| **Unallocated, held** | not committed to any line item; available for `PRODUCT.md` §15's separately-gated builder feature or further iteration, decided later | **≈ 730 of ~994** |

Every reserve line now has a number and a named trigger condition, unlike
V2's "purpose list" the critique flagged. The unallocated remainder is stated
as genuinely unallocated, not implicitly spent.

## 11. Reusable asset strategy

- Scene 1's backdrop is reused, regraded (glow dimmed/settled), for Scene 6
  — one generation, two scenes.
- Scene 2's backdrop is reused, regraded (motion stopped, glow dimmed), for
  Scene 3 — one generation, two scenes.
- The registration-mark SVG grammar, the film-strip holder, and the table's
  base glow gradient are each built once in code and reused across all six
  scenes — this is the majority of the visual system by surface area, and
  none of it is generated (§12).
- The existing basalt-desk generation lineage from the pre-V2 exploration
  (`Cinematic Studio 3.0`/`Nano Banana Pro` jobs, 2026-09-02) is **not**
  proposed for reuse in V3 — it belongs to the material cluster this
  direction specifically replaces (§2.3). Flagging this explicitly since V2
  had proposed inspecting it for reuse; V3 supersedes that with a different
  material direction, so those stills are no longer a live candidate.

## 12. Procedural vs. generated split

**Generated (photographic, six items, §8):** the table's own material
photography at each of its two loaded states, and the five station
materials. Nothing else.

**Procedural (code, everything else):** the table's base glow (CSS gradient,
motivated by §2.1), the registration-mark/crop-mark/measurement-scale SVG
grammar (every scene, all six), the film-strip holder for cases and builder,
kinetic typography-as-exposure, the CSS depth staging, the optional WebGL
dust-in-light-beam layer, all camera/scroll choreography via `useAct`/
`CinematicStage`, all copy in all four languages.

This split is the same selection principle `ASSET_PLAN.md` §"Правило отбора"
already established for Production Strip — generate only what code cannot
match or beat — applied to a much richer visual target, not abandoned for it.

## 13. Performance strategy

- One WebGL canvas, maximum, ever — gated to `cinematic` tier, a pure
  atmospheric enhancement (§6), never required for the scene to read
  correctly.
- Video: `requestIdleCallback`-loaded, static frame stands in until ready —
  proven `HeroCameraPlate` pattern, reused verbatim, gated behind Proof A.
- Images: existing `SceneImage` webp+jpg pipeline, `ASSET_PLAN.md` §6-style
  size ceiling (≤220KB/frame) reused unchanged.
- Registration-mark grammar as SVG, not raster — sharp at any DPR, near-zero
  weight, the same reasoning `ASSET_PLAN.md` already used for Production
  Strip's perforation pattern.
- The reject-and-retry budget (§10) is itself a performance decision: paying
  for 4 raw candidates up front is cheaper than shipping a defective or
  oversized master that needs mid-flight rework after integration.

## 14. Visual QA criteria

1. **1:1 close-crop defect audit, mandatory, on every candidate before
   acceptance** — not the downscaled preview. Standing process rule since
   T6, unchanged.
2. **§4's registration-mark-removal test** on every backdrop candidate — if
   it reads as generic with the grammar stripped, flag it even if otherwise
   accepted.
3. **§2.1's single-source-light check** — any glow not originating from the
   table's own surface fails, regardless of how the frame otherwise looks.
4. Exact 4:3 ratio, grain visible at 100%, ≤220KB webp — unchanged from
   `ASSET_PLAN.md` §6.
5. Zero readable glyphs, zero trademarks, zero faces — unchanged, still
   audited at 1:1 given T6's evidence that prompt exclusion alone is
   insufficient.
6. Reversible, glitch-free scroll in both directions on the assembled scene
   — unchanged bar from `PRODUCT.md` §28.

## 15. WOW acceptance checklist

A scene **fails** if it:

- Could be mistaken for generic AI-generated "creative technology" hero
  imagery with the registration-mark grammar removed (§4.6's test).
- Uses the basalt/aluminum/glass/smoked-glass material cluster this
  direction specifically replaced (§2.3).
- Has any glow not sourced from the table (§2.1).
- Presents a screen showing active, legible-looking UI content (the
  confirmed T6 defect zone — this direction avoids the subject entirely
  rather than re-attempting the same mitigation that already failed once).
- Reduces the Quiet Room to an empty frame with a caption (§3).
- Leaves any scene's mobile or reduced-motion version silently missing the
  table object itself, not just its enhancement layer (§6).

A scene **passes** when:

- The table, its light, and its registration grammar are all clearly
  present and load-bearing — not decorative.
- The material on the table is specific enough to name (litho proof, exposed
  film, resin, vellum — not "abstract tech material").
- The motion has a stated narrative purpose traceable to §5's matter/signal
  audit for that scene.
- It communicates something true and specific about ELEVATE's actual work —
  not just "this looks expensive."
- A viewer shown the frame with no logo and no copy can plausibly say "that's
  ELEVATE" rather than "that's some studio."

## 16. What this document does not decide

- The final display typeface (V2 §5's open question, unresolved, carried
  forward unchanged — a short comparison pass, zero credits, before locking).
- `PRODUCT.md` §15's AI-generated visual-direction builder feature — still
  separately gated, still unbudgeted here.
- Any specific prompt text for §8's six stills — written at generation time,
  inside the proof plan and beyond, not locked in this document (same
  lesson T6 taught: a documented prompt drifts from the live goal by the
  time it's used).

Nothing beyond this document, its critique (§17), and the two-test proof plan
(`PROOF_PLAN.md`) is authorized. No full asset set, no homepage build, no
credit spend beyond what `PROOF_PLAN.md` explicitly gates, until the owner
authorizes paid visual generation.

## 17. Independent critique (run against this document, 2026-09-08)

Run as an isolated pass by a reviewer with no stake in this proposal, not
shown the reasoning above, specifically instructed to check whether V3
genuinely fixed V2's four named findings or just re-dressed them. Reproduced
close to verbatim.

**Verdict on the four V2 findings:**

1. **Genericness / Vitrine-cluster proximity — PARTIALLY FIXED.** The
   single-source-light rule is a real, checkable structural test, a genuine
   improvement over V2's prose rule. But renaming basalt/aluminum/glass to
   acetate/litho/vellum doesn't change the optical setup a generation model
   defaults to — dark surface, one hot backlight, material catching it —
   which is the same photographic skeleton Vitrine and V2 both wore. §4.6's
   own strip-test half-admitted this by downgrading a failure to a flag
   rather than a rejection — corrected in this revision (§4.6 above).
2. **Credit budget vs. T6 — PARTIALLY FIXED.** Named reserve lines with
   numbers and trigger conditions genuinely answer "purpose list, not a
   budget." Dropping active/lit screens from every subject but one flagged
   silhouette is a real, structural risk reduction. What's unproven: T6
   tested Production Strip's abstract-screen/face-down subjects, not
   light-table material — "lower risk" for this specific subject matter is
   a credible inference, not new evidence. The gap is real; nothing in this
   document re-runs a T6-style probe before committing the full still-image
   budget, and none is proposed here beyond what `PROOF_PLAN.md` gates.
3. **Silent mechanism swap on mobile/reduced-motion — GENUINELY FIXED.**
   §6's tier table is structurally different, not relabeled: the table,
   light, and registration grammar are CSS/SVG by construction and were
   never dependent on WebGL, so nothing needs to swap. Only atmosphere and
   camera travel degrade.
4. **Metaphor thinning at scenes 4–5 — PARTIALLY FIXED.** Scene 4 is a real
   fix: the literal same photographed object, reusing the existing `mshots`
   pipeline, motivated by actual light-table practice. Scene 5 is thinner —
   "blank vellum strips" for form answers is a better-dressed metaphor
   stretch, not a resolved one; form answers still aren't material being
   inspected under light the way real film is.

**Fresh findings:**

5. **Material distinctiveness is a lateral move, not a fix, and should be
   named as such rather than implied otherwise.** Backlit-surface-plus-
   material is still a findable AI-generation attractor; swapping material
   vocabulary changes what's named in the prompt, not the optical
   composition a model tends to produce by default.
6. **The strip-test was not a meaningful bar as originally written** —
   downgraded to "flag, don't reject," which relocates the genericness
   problem from photography to code overlay rather than solving it.
   **Fixed in this revision** (§4.6 is now a hard gate).
7. **Credit realism: better bookkeeping, same order of magnitude** — 270
   committed/reserved of ~1000 is not smaller than V2's comparable total,
   it is better justified. The risk-reduction claim is credible on its face
   but asserted, not tested, ahead of the proof plan.
8. **Scene 5's fix is closer to a synonym swap than Scene 4's.** "Film
   strip" replaces "abstract object" as the noun; the underlying question
   — what does a form answer look like as physical material? — isn't
   actually resolved, just given better props.
9. **A real, previously unnamed honesty gap:** the "optional" WebGL dust
   layer was framed as non-load-bearing "for meaning," which sidesteps that
   it likely *is* load-bearing for the visceral WOW reaction on the tier
   that gets it. **Addressed in this revision** (§2.1's closing note above).
10. **The genericness fix risks pulling the direction toward "quieter" —
    exactly the register the owner already rejected once**, and this
    document did not name that risk anywhere before this critique. A table
    being inspected is inherently a calmer verb than V2's signal tearing
    through a void, even with §3's density strategy as a counter-argument
    on paper. This is not fully resolved by this revision — see response
    below.

**Reviewer's overall verdict: not ready for go/no-go as originally written.**
One named revision: make §4.6 a hard gate, not a flag.

### Response

Finding 6 (§4.6) is fixed directly, above — the softened language is gone;
a candidate that only reads as distinctive because of its overlay now fails
outright. Finding 9 (the dust layer's honesty) is fixed directly, above.
Findings 1, 2, 4, 5, 7, and 8 are conceded as accurate and are not resolved
further by editing prose — they describe real, structural uncertainty that
only the proof plan (not another documentation pass) can actually answer:
whether the photography itself clears the strip-test, whether the lower-risk
subject-matter claim holds under real generation, and whether Scene 5's
metaphor is strong enough in practice. That is exactly what `PROOF_PLAN.md`'s
two tests are built to find out before any further credits commit past them.

**Finding 10 is the one this document owes the owner a direct, unresolved
flag on, not a confident fix:** there is a real tension between "distinctive,
not generic" and "maximum WOW, not restrained," and this revision narrows
that tension (§3's density strategy, §2's dense-by-default staging) without
proving it's fully resolved. Proof A is deliberately the test of exactly
this — whether the light table, built and staged for real, actually produces
the "what the fuck is this" reaction, or whether it has quietly become the
tasteful, editorial thing the owner already turned down once. If Proof A
doesn't clear that bar, the fix is not more polish on this direction — it is
telling the owner the light table itself is too calm an object for the brief,
plainly, per `PRODUCT.md` §20's rule that a fundamentally different visual
direction is exactly the kind of decision that gets escalated, not quietly
patched.
