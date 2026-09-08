# VISUAL PROOF PLAN — two tests before any further spend

**Status: proposal, not authorized.** This plan gates the *next* command, not
this one — writing it does not spend credits. Its purpose is to answer, with
two small, cheap, real tests, the question `VISUAL_DIRECTION_V3.md`'s own
critique (§17) left explicitly open: does "The Light Table" actually deliver
the owner's "what the fuck is this" reaction, or has fixing V2's genericness
problem quietly pulled the direction toward the calmer, more editorial
register the owner already rejected once? Building the full six-scene asset
set before answering that would risk repeating T6's lesson at ten times the
cost. These two tests are deliberately small enough to fail cheaply and
specific enough to answer that question honestly, one way or the other.

Total budget for both tests: **≈55 credits** (Proof A ≈45, Proof B ≈10), per
`VISUAL_DIRECTION_V3.md` §10. Nothing beyond this is authorized by this
document. If either proof fails, the next step is reporting the failure and
what it implies for the direction — not silently retrying with a bigger
budget.

---

## PROOF A — the hero / first 5–8 seconds

### Visual objective

Prove that Scene 1 (Ignition) — a dark, inert light table powering on for
the first time and resolving a piece of material into a legible digital
product — actually produces a shock reaction, not a tasteful one. This is
the single highest-stakes test in the whole direction: `VISUAL_DIRECTION_V3.md`
§17's critique named a real, unresolved risk that the genericness fix pulled
the world toward "calm and editorial" rather than "insane." Proof A is where
that gets settled with a real build, not more argument.

### Required Higgsfield assets

- **2 backdrop stills**, same table, two states: powered-off/dark (material
  present but unlit) and powered-on/resolved (material fully legible under
  the table's light). These double as the Scene 6 (Commit) regrade per
  `VISUAL_DIRECTION_V3.md` §11 — no separate generation for that scene.
- **1 video clip** (optional, tested here specifically before any further
  commitment per V3 §8/§9): the power-on transition itself, scroll-scrubbed,
  matching the existing `HeroCameraPlate` engineering pattern (a still frame
  underneath at full opacity until the clip is ready, so a slow load is
  invisible rather than a black rectangle).

### Generation model

- Stills: `nano_banana_pro`, `aspect_ratio: "4:3"`, `resolution: "2k"`.
- Video: `seedance_2_0`, matching the existing hero-camera-plate clip spec
  (short duration, scroll-scrubbed, not autoplaying).

### Number of candidate generations

- 4 raw candidates per still state × 2 states = **8 still candidates**.
- 1 video clip (single take — video's per-unit cost doesn't support a
  4-candidate batch at this budget; if the single take fails the audit, the
  video line is dropped from this proof, not re-rolled blind).

### Expected credit cost

- 8 stills × 2cr = 16cr.
- 1 video clip ≈ 22.5cr (observed rate this session for `seedance_2_0`/
  comparable video generation).
- Contingency (a targeted inpaint pass on one candidate, per V3 §9) ≈ 6-7cr.
- **Total ≈ 45cr**, matching `VISUAL_DIRECTION_V3.md` §10's allocation.

### What is built in code (not generated)

- The registration-mark/crop-mark/measurement-scale SVG grammar (§2.2).
- The table's base glow gradient — the light source itself, motivated,
  single-origin (§2.1).
- CSS depth staging around the backdrop plate.
- Kinetic headline exposure (§2.4) — type behaving as lit material, not a
  UI overlay.
- Scroll-tied camera push-in via the existing `useAct`/`CinematicStage`
  timeline (no new scroll source).
- `useMotionCapability` gating for the optional WebGL dust layer and the
  video clip (§6's tier table).
- Reduced-motion fallback: the resolved, powered-on frame, static, complete.

### Animation choreography

1. Rest: dark table, inert material, locked camera, no motion until scroll
   begins.
2. Scroll begins: light rises from beneath at a rate tied to scroll
   velocity — slow scroll holds the beat, fast scroll snaps it, matching
   the causal "my hand is doing this" mechanism named as the strongest
   available WOW device in `VISUAL_DIRECTION_V2.md` §6, unchanged here.
3. Material resolves into a legible product-shape at roughly 60–80% of the
   scene's viewport budget.
4. Headline exposure completes as the table reaches full clarity.
5. Hold at completion — the frame Proof B picks up from.

### Acceptance criteria

- Passes `VISUAL_DIRECTION_V3.md` §15's WOW checklist in full, specifically
  including the now-hardened §4.6 strip-test (registration marks removed —
  must still not read as generic dark-tech stock imagery).
- Passes §14's QA criteria (1:1 glyph audit, single-source-light check, 4:3
  ratio, grain visible at 100%, ≤220KB webp).
- **Cold reaction test:** shown to 3–5 people with no context beyond "this is
  a homepage opening," the dominant unprompted reaction must include
  surprise/intensity language ("whoa," "what is this," "that's a lot") —
  not exclusively calm/positive-but-mild language ("nice," "clean,"
  "elegant"). This is the direct, real-world test of §17 finding 10, not a
  restatement of it.
- Reversible: scrolling back through the ignition beat retraces cleanly, no
  jump, no frozen frame — `PRODUCT.md` §28's bar, checked here first since
  it's the first scene a regression would show up in.

### Failure criteria

- Any candidate fails the glyph/logo audit at 1:1 (T6's confirmed failure
  mode) → that candidate is discarded, not shipped with a caveat.
- The strip-test fails on every surviving candidate → the photography itself
  hasn't cleared its own bar; per V3 §4.6 this is an outright rejection, not
  a "ship it with more registration marks" outcome.
- The cold reaction test converges on "tasteful/calm/nice" with no
  surprise-register language from any of the 3–5 viewers → **report this as
  a named finding to the owner**: the light table, as built, is likely too
  controlled an object for the brief, and the direction needs owner input
  before any further scenes are built on it — not a quiet retry with
  different lighting.
- The video clip doesn't clear its own audit (defects, or the transition
  reads as a cut rather than continuous) → drop the video line from Scene 1
  entirely; the scroll-driven still-to-still resolve (already proven
  achievable via CSS/backdrop staging alone) carries the scene instead. This
  is an acceptable, budgeted outcome, not a blocker.

---

## PROOF B — Hero → Services transition (the join)

### Visual objective

Prove the structural claim the entire direction depends on: that the light
table reads as **one continuous object** across a scene boundary, not two
different generated images stitched together. This is the one place V3's
core premise ("one object carries the whole page") gets tested against real
photography rather than argued in prose.

### Required Higgsfield assets

- **2 candidates of one representative station material** (Web — the litho
  proof sheet, chosen as the least visually complex of the five stations)
  — deliberately *not* the full five-station backdrop. Testing the join
  mechanism needs one clean seam, not five; generating all five before the
  join itself is proven would risk the same premature-commitment mistake
  this whole proof plan exists to avoid.

### Generation model

`nano_banana_pro`, `aspect_ratio: "4:3"`, `resolution: "2k"`, using Proof A's
accepted backdrop still as an `image_references` input — testing the same
consistency mechanism `ASSET_PLAN.md` §2 already validated for Production
Strip (a master frame fed back into subsequent generations, not just
repeated prompt language).

### Number of candidate generations

**2 candidates.**

### Expected credit cost

2 × 2cr = **4cr**, well under the ≈10cr allocation in
`VISUAL_DIRECTION_V3.md` §10 — the remainder stays unspent, not reallocated.

### What is built in code

- The join itself: lateral camera travel from Scene 1's resolved frame into
  Scene 2's first station, continuous, not a cut or fade — reusing the
  computed-overlap discipline `HeroCameraPlate`/`HERO_TAIL_MASK_START`
  already proved out (a value computed from the scenes' own registered
  budgets, never a hand-tuned literal).
- The registration-mark grammar continuing unbroken across the join —
  this is the actual mechanism under test: does the code-drawn grammar
  successfully bridge two separately-generated photographic plates.
  convincingly, or does the seam show anyway.
- A lightweight version of the hover/focus station-pull interaction (§6,
  Scene 2's original spec) — enough to confirm the mechanism works, not the
  full five-station build.

### Animation choreography

1. Proof A's held, resolved frame.
2. Camera begins lateral travel along the table (not a cut).
3. Registration marks, table edge, and glow continue unbroken through the
   transition.
4. The Web station's litho-proof material enters frame from the side, lit
   by the same table glow already established in Proof A.
5. Hold on the station, confirming the join is complete and stable.

### Acceptance criteria

- No visible seam: light direction, grain, and color grade match between
  Proof A's backdrop and Proof B's station material at the join point,
  checked at 1:1 the same way the glyph audit is checked.
- The registration-mark grammar reads as one continuous system across the
  join, not two separate overlays that happen to look similar.
- Reversible: scrolling backward through the join retraces cleanly — no
  jump, no flash, no frozen intermediate state (`PRODUCT.md` §28).
- **Blind test:** a viewer shown the assembled, scrolling join, with no
  foreknowledge of how many source images were used, cannot correctly guess
  that two separate generations are involved.

### Failure criteria

- A visible seam (light/grain/color mismatch) at the join → the
  `image_references` consistency mechanism didn't hold for this material
  pairing; report this specifically, since it implies the same risk exists
  for all five stations, not just this one representative test.
- The registration grammar visibly breaks or resets at the join → the
  code-side bridging mechanism needs rework before any further scenes are
  built on it.
- The blind test viewer correctly identifies the seam → treat as a soft
  failure: usable but not yet at the "one continuous take" bar the whole
  direction's credibility depends on; report and let the owner decide
  whether to iterate or accept a visible-but-minor seam.

---

## What happens after these two proofs

This document authorizes exactly the two tests above — **≈55 credits total,
combined** — and nothing else. Both proofs passing is a necessary but not
sufficient condition for proceeding to the full six-scene asset set; it
confirms the mechanism works, not that every station/scene will. Both
proofs, their actual results (not projected ones), and an updated go/no-go
recommendation are due back to the owner before `VISUAL_DIRECTION_V3.md`
§8's full asset matrix is generated. If either proof fails outright (per the
failure criteria above), the correct next step is reporting that finding
plainly — including whether it indicts the light-table object itself, the
generation pipeline, or just this specific test's execution — not a silent
retry at increasing cost.
