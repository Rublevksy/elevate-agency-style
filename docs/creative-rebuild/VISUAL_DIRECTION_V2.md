# VISUAL DIRECTION V2 — "MATTER INTO SIGNAL"

**Status: proposal, not approved. Nothing built. No Higgsfield credits spent
against this document.** Written 2026-09-08 in direct response to the owner's
creative reframe: the previous direction ("Производственная лента" / Production
Strip, T1–T6) optimized for restraint, quiet material honesty, and low
generation spend. The owner has now ruled that restraint is the wrong axis
entirely — the target is **maximum visual WOW**, an "impossible for a normal
agency website" reaction, even if that costs materially more of the ~1000-credit
Higgsfield budget. This document treats Production Strip, and the MacBook-hero
concept before it, as **experiments on file, not sacred architecture** — per
direct instruction. Their engineering is salvaged where it is genuinely
world-independent (§9); their visual grammar is not carried forward.

## 0. What stays fixed regardless of visual world

These are not creative decisions — they are `PRODUCT.md`'s permanent, owner-
locked constraints (§02, §22–§25, §33), unaffected by this reframe:

- Real business data only: services (Web / E-shop / App / SEO / Branding),
  real prices from `src/lib/pricing.ts` (od 10 000 Kč web, od 25 000 Kč e-shop,
  od 5 000 Kč branding/logo), four real live projects with real domains
  (biodentclinic.cz, inhomepraha.cz, exclusivebeauty.cz, euromotors.cz), four
  languages (CZ/EN/RU/UA), all DOM — never baked into a raster.
- No fabricated metrics, testimonials, client logos, or awards. The four case
  headline percentages in `projects-i18n.ts` remain **unverified** per
  `PRODUCT.md` §33 — this direction does not surface them as fact anywhere new.
- Protected systems untouched without direct need: routing, Supabase, contact
  pipeline, SEO/structured data, `routeTree.gen.ts`.
- Accessibility and reduced-motion preserved; the site must work, not just
  perform, for every visitor.

One word from `PRODUCT.md` §05 is explicitly overridden by the owner's live
instruction: **"MINIMAL."** Everything else in that section's adjective list
(premium, cinematic, realistic, technical, editorial, confident, expensive)
still holds — "cinematic" and "expensive" simply now dominate over "minimal"
rather than being balanced against it.

## 1. Creative thesis

**ELEVATE turns real material effort into real, live digital products.** That
sentence is the entire business, stated plainly — and it is also, read
differently, a *cinematic mechanism*: matter becoming signal. The homepage is
staged as one continuous camera move through a hyperreal, impossibly deep
studio, in which physical material — paper, ink, cast metal, glass, cut board —
is caught, mid-transformation, by a single traveling signal of light and
becomes a real interface, a real product, a real live website. The four real
client sites are not decoration on top of this metaphor; they are its proof —
the site literally ends on real, working evidence of the exact transformation
it just performed in front of you.

This replaces Production Strip's central metaphor (a factory's paper-and-film
production line, told through restraint and physical marks) with something
built for the opposite brief: spectacle, depth, and a visitor reaction of "what
the fuck is this." Where Production Strip's laws were about subtraction (one
paint color, no glow, no cards, generous emptiness), this direction's laws are
about **controlled excess with one disciplined constant** — see §3.

## 2. Emotional target

Opening the page: disorientation, then recognition — "this is not a website,
this is a machine for making websites, and it's running." By the closing
frame: "I want to be inside that machine." Never: "this is a cool effects
reel" (spectacle in service of nothing) or "this is a generic AI hero"
(spectacle that could belong to any company). Every scene must answer, in one
glance, *why this proves ELEVATE is good at digital work specifically* — not
just "why this looks expensive."

## 3. Visual language

**The one constant, carried over unchanged from the incumbent and from
Production Strip:** exactly one chromatic accent, the ELEVATE brand blue
(`oklch(0.65 0.18 255)`), and never a second hue anywhere in the experience —
not in generated imagery, not in code-drawn graphics. `DESIGN.md`'s own
post-mortem on the incumbent never blamed the palette; it blamed mixed
*registers*, not mixed *color*. This document repeats the palette discipline
and deliberately drops the register discipline in its place — see below.

**What is explicitly reversed from Production Strip, and why:**

- **Glow, bloom, and volumetric light are back in — deliberately.**
  Production Strip's L2 ("blue is paint, not light") existed to keep the world
  flat and non-generic. This direction needs the opposite: the blue signal
  *is* light, is volumetric, has bloom, travels through haze. The discipline
  that keeps this from reading as generic SaaS glow is **exactly one light
  source class, one hue, and a hard rule that it only ever touches things it
  is transforming** (§8, rule 1) — never ambient decoration.
- **Cards, frames, and browser chrome remain banned.** This rule survives
  from both the incumbent's lesson (`DESIGN.md`: "a picture of a browser is
  not the work") and Production Strip's L9. WOW does not require cards; it
  requires depth, and cards flatten depth.
- **The device is not the protagonist, but it is not banished either.**
  Where the MacBook-hero concept made a laptop the entire first act and
  Production Strip removed devices almost entirely, this direction treats
  screens as **one of several materials being transformed** (alongside paper,
  metal, glass) — present in most scenes, never the single subject of any of
  them.

**Material world:** near-black grounds, real physical materials rendered
hyperreal — honed basalt, brushed/anodized aluminum, glass, cast concrete,
paper and cut board where a finished deliverable appears. This is not a new
invention: it is the direction already explored, and paid for, in an earlier
generation batch this session predates (`Cinematic Studio 3.0` / `Nano Banana
Pro` jobs from 2026-09-02 — "honed black basalt desk," "one continuous
luminous cyan-blue arc," "exactly one blue"). Those seven stills exist in the
account's generation history and are **candidates for reuse pending visual
inspection** (they have not been opened this session) — inspecting them before
generating anything new is the first concrete step if this direction is
approved, not a re-shoot from zero.

**Depth:** a real multi-plane camera rig, the same *technique* the incumbent's
`DESIGN.md` already validated (CSS `perspective` + `transform-style:
preserve-3d`, Z-plane staging with pre-compensated scale) — reused as a
technique, not as the incumbent's specific rig. For the hero's single most
demanding beat, this direction proposes a contained WebGL/Canvas layer (§9's
flagged decision) rather than stretching CSS 3D past where it can convincingly
go.

## 4. Color / light / material direction

| Role | Value | Where it appears |
|---|---|---|
| Signal (the one accent) | `oklch(0.65 0.18 255)` unchanged from brand | the traveling light/glow itself, active-state UI, the builder's live feedback |
| Ground | near-black, `oklch(0.14–0.18 0.02 260)` range | every scene's base — carried from `DESIGN.md`'s surviving palette |
| Material neutrals | cool greys/blacks, same 260 hue family, no second hue | basalt, aluminum, concrete, glass |
| Warm exception | none by default | if a case's real client screenshot carries its own brand color (a client's own red, green, etc.), it is allowed to appear **only inside that case's own portal frame** (§7, scene 4) — the one place client truth is allowed to break the one-hue rule, same reasoning `CRITIQUE_01` P3 already raised about the incumbent's "no third color" law being unenforceable against real client brands |

Light is always **motivated** — it comes from the signal, from a hard key
implied by the material photography, or from a screen's own glow. No ambient
ungrounded haze without a source in frame.

## 5. Typography behavior

Two open technical questions, flagged rather than silently resolved:

1. **Reuse Fira Sans Condensed (self-hosted, T1/T2) or select a new display
   face?** The Fira pairing was validated hard: full CZ/RU/UA glyph coverage
   measured at zero gaps, self-hosted with a metric-matched fallback (`ascent/
   descent/size-adjust` computed from `@capsizecss/metrics`, not guessed),
   `font-display: swap` measured at 0.0000145 CLS. That validation work is
   genuinely reusable regardless of which world wins — re-running a six-
   candidate type search from zero would waste effort the T1 process already
   paid for. What is *not* reusable is Fira's personality: it was chosen for
   an industrial-stencil, restrained world, and "maximum WOW" may want a
   display face with more raw physical presence (heavier optical weight,
   sharper contrast) than a condensed grotesque gives. **Recommendation:**
   keep Fira as the safe fallback, spend one short pass checking 2-3 higher-
   drama alternatives against the same CZ/RU/UA coverage bar before locking —
   this is cheap (no Higgsfield credits, a few hours of type-setting) and
   avoids re-doing T1's actual hard work.
2. **Kinetic typography, not static.** The brief explicitly asks for it.
   Headlines should feel physically caught in the same transformation as the
   material around them — mass-in-focus/out-of-focus tied to camera depth,
   letters catching the signal's light as it passes, not merely translating or
   fading. This is a genuine step beyond both prior worlds' typography (which
   moved as blocks, not as material) and is one of the concrete, testable
   places §11's WOW bar gets applied.

Type stays fully DOM for all four languages — unchanged, non-negotiable,
same reasoning as both prior worlds (a generation model cannot be trusted to
render correct, translatable text, confirmed hard by T6's defect-audit this
week).

## 6. Six major cinematic moments

The functional backbone (hero → services → cases → builder → pricing → CTA)
comes from `PRODUCT.md` §12–§17 and is not reopened by this reframe — the
owner's instruction concerns *how it looks and moves*, not which sections
exist. Pricing stays folded into the tail of Services rather than a standalone
scene, per the owner's earlier documented decision (`IMPLEMENTATION_PLAN.md`
T12) — that was a conversion/narrative call, not a visual-world call, and
nothing in the new brief reopens it. A short pause scene is kept between the
two densest moments (Services, Cases) for the same reason it worked before:
a page at 100% intensity throughout has no peaks, and peaks are what "WOW"
actually measures against.

### Scene 1 — IGNITION (Hero)

1. **Sees:** total darkness holding one inert object — a blank sheet, a cast
   block, an unlit panel — at extreme macro. Nothing is happening yet.
2. **Camera:** locked, then a single slow push-in as the first motion begins.
3. **Moves:** a thread of the signal enters frame from off-screen and finds
   the object.
4. **Transforms:** the instant the signal touches the material, it lights
   from within — the "blank sheet" reveals itself to have been a screen, the
   "cast block" reveals an edge that was always a device. Material becomes
   product in one continuous take, not a cut.
5. **Generated asset:** 1 hero backdrop still (candidate: reuse the existing
   basalt-desk generation lineage after inspection) + 1 short scroll-scrubbed
   video clip of the ignition moment itself (Seedance 2.0) — the single
   highest-value clip in the whole budget, proposed as the only "must-have"
   video spend.
6. **Procedural:** the signal thread itself (WebGL/Canvas, flagged decision,
   §9), kinetic headline reveal, the depth rig staging the object in space.
7. **Interaction/WOW:** the visitor's own scroll speed controls how fast the
   ignition happens — scroll slowly and the transformation is a held, tense
   beat; scroll fast and it snaps almost instantly. This direct causal read
   (my scrolling hand is doing this) is the single strongest WOW mechanism
   available in a scroll-driven site and was under-used in both prior worlds.
8. **Transitions out:** the now-lit product/screen becomes the doorway the
   camera flies through into Scene 2's studio space — a real spatial cut, not
   a fade (reusing the "camera enters the display" logic `PRODUCT.md` §06
   already specified, minus the MacBook-specific staging around it).
9. **Why it sells ELEVATE:** it *is* the studio's actual value proposition,
   staged as spectacle rather than stated as copy — the visitor watches raw
   effort become a real digital product before a single word of marketing
   copy has to argue the point.

### Scene 2 — THE FIVE INSTRUMENTS (Services + pricing tail)

1. **Sees:** one continuous impossible studio room, five distinct material-
   transformation stations, one per service, all visible at different points
   along a single camera path (not five identical cards).
2. **Camera:** lateral travel through the room, past each station in turn.
3. **Moves:** each station's own material for its service: Web — a pencil
   sketch's ink lifts and becomes a glowing site frame; E-shop — a
   photographed product is caught mid-frame becoming a lit product page;
   App — a physical prototype shell gains an active screen; SEO — a dark
   surface (map/grid, abstract, not a fake chart) lights up with the signal
   finding paths through it; Branding — foil/ink becomes a mark (never the
   real ELEVATE wordmark rendered by the model — that stays DOM, per §5/§8).
4. **Transforms:** each station's material mid-transformation, held at the
   exact instant it becomes digital — the station never fully "finishes,"
   which keeps five stops from feeling like five separate finished
   commercials.
5. **Generated asset:** 5 service-instrument stills (one per station),
   budgeted with reject buffer (§10) given T6's confirmed defect rate on
   this exact family of prompts (screens/illegible-UI content).
6. **Procedural:** the connecting lateral camera move and the signal thread
   continuing through all five stations as one visible line (ties them
   together as one machine, not five separate rooms) — this connective
   thread reuses the same WebGL/Canvas layer from Scene 1 rather than
   rebuilding a second system.
7. **Interaction/WOW:** hovering/focusing a station pulls the camera in and
   raises that station's own motion to full intensity while the other four
   dim to standby — an actually-live parallel to Production Strip's
   auto-listing `ServiceStage`, but staged in-world rather than as a UI list.
8. **Transitions out:** the last station's light drains into the pricing
   reveal — pricing appears as the studio's own instrument readout (real
   numbers, no chart, no fake graph), then the whole room goes dark for
   Scene 3.
9. **Why it sells ELEVATE:** five real disciplines shown as five real material
   processes with a shared mechanism, not five stock icons — the room's
   unity argues "we do all five as one integrated studio," not "we have five
   separate departments."

### Scene 3 — THE QUIET ROOM (Pause)

1. **Sees:** the darkened room from Scene 2, now still, one held frame.
2. **Camera:** locked. No move at all — the contrast is the point.
3. **Moves:** nothing but the signal thread, now barely breathing at low
   intensity, not driving toward anything.
4. **Transforms:** nothing transforms here — the one scene explicitly *about*
   the absence of transformation.
5. **Generated asset:** none — reuses a resting-state grade of Scene 2's own
   backdrop plate.
6. **Procedural:** short, real copy (how ELEVATE actually works — not a
   platitude wall, per `PRODUCT.md` §18's "avoid oversized walls of text").
7. **Interaction/WOW:** the WOW here is negative space after two dense
   scenes, not a new effect — this scene's job is to make Scene 4 land harder
   by contrast, exactly the pacing argument `IMPLEMENTATION_PLAN.md` already
   made for the equivalent Production Strip scene.
8. **Transitions out:** the signal thread, still low, begins pulling toward
   frame-left as if sensing something — into Scene 4.
9. **Why it sells ELEVATE:** restraint used once, at the right moment, reads
   as confidence rather than as the whole personality — this is the one place
   the old direction's discipline is worth a cameo.

### Scene 4 — FOUR SIGNALS (Cases)

1. **Sees:** the signal thread arrives at four real "captured" panels in
   sequence — the four real client sites, shown as live screenshots (existing
   `mshots` pipeline, unchanged) staged inside a generated/procedural portal,
   never a card or browser-chrome frame.
2. **Camera:** travel between the four portals, each entered rather than
   scrolled past.
3. **Moves:** the portal itself — an aperture that dilates open around each
   real screenshot, matching the "camera enters the display" language already
   established in Scene 1/2, applied here to real evidence instead of
   generated material.
4. **Transforms:** problem → transformation → process → result, staged as the
   portal progressively widening and sharpening, from a dim early state to
   the full, real, live site at full clarity — data-driven from
   `projects-i18n.ts`'s existing `problem`/`solution`/`work[]` fields, no new
   copy invented.
5. **Generated asset:** none required for the screenshots themselves (real,
   dynamic, unchanged); optionally a small procedural/generated portal-edge
   treatment shared across all four, not per-project.
6. **Procedural:** the aperture/portal mask morph, the real client's own
   brand color permitted only inside its own portal (§4's named exception).
7. **Interaction/WOW:** each portal is enterable — click/tap to push the
   camera fully into that one real site at full scale, an actual "go look at
   the real thing" moment rather than a static screenshot next to marketing
   copy.
8. **Transitions out:** the fourth portal's light becomes the doorway to
   Scene 5 — the visitor is now inside the machine that made all four.
9. **Why it sells ELEVATE:** this is the strongest, cheapest, most honest WOW
   asset the studio already owns — four real, live, working products — staged
   with the same cinematic grammar as the generated material instead of
   dropped in as a plain screenshot grid, which is what made the incumbent's
   case section read as "flat UI screenshot," `DESIGN.md`'s third incompatible
   register.

### Scene 5 — YOUR TURN (Interactive project builder)

1. **Sees:** the visitor's own choices start appearing as new material in the
   world, not as form fields floating over it.
2. **Camera:** now visitor-directed rather than scroll-directed — the one
   scene in the experience where control genuinely transfers, matching
   Production Strip's own established rule ("does not scroll; the visitor's
   pointer and keyboard direct it").
3. **Moves:** each answered step (business type → project type → goals)
   deposits a new object into the scene, building a small, visible
   representation of *this visitor's own future project* out of the same
   material language as everything before it.
4. **Transforms:** the accumulating objects catch the signal exactly like
   Scene 1's ignition did — the visitor is now causing the same
   transformation they just watched happen to ELEVATE's own work.
5. **Generated asset:** none required to ship the core flow. `PRODUCT.md`
   §15's optional AI-generated visual-direction step (e.g. "Automotive" →
   several real visual directions to choose from) is a genuinely separate,
   already-flagged decision requiring its own options-and-approval pass
   before any generation — this document does not resolve it and does not
   budget credits against it.
6. **Procedural:** the entire object-accumulation staging, live and code-
   driven — this is the most code-heavy, least generation-dependent scene by
   design, matching its role as the interaction center of the page.
7. **Interaction/WOW:** watching your own inputs physically join the same
   world you were just a spectator in — turns the strongest generic-WOW
   cliché (particles reacting to your cursor) into something that actually
   means something here (you are now material the studio will transform).
8. **Transitions out:** submission collapses the accumulated objects into one
   signal burst — into Scene 6.
9. **Why it sells ELEVATE:** most agency contact forms are the point where a
   cinematic site reverts to boring UI; this is the one place PRODUCT.md
   explicitly asks for the opposite, and this scene is built to actually
   deliver that rather than degrade into a form with a nice backdrop.

### Scene 6 — COMMIT (Closing / CTA)

1. **Sees:** the resolved signal from Scene 5's burst, now settled and calm —
   a direct visual bookend to Scene 1's ignition.
2. **Camera:** slow pull-back to a wide, calm frame — the inverse of Scene
   1's push-in.
3. **Moves:** almost nothing — deliberately the second-quietest scene in the
   sequence.
4. **Transforms:** the signal, having traveled through the entire page,
   now simply waits.
5. **Generated asset:** none — reuses Scene 1's backdrop at a resolved grade.
6. **Procedural:** final CTA, contact details, unchanged business logic.
7. **Interaction/WOW:** none new — earned quiet after five WOW moments,
   the mirror of Scene 3's pause.
8. **Transitions out:** end of page.
9. **Why it sells ELEVATE:** ends on invitation rather than on a fade-out
   — matches `PRODUCT.md` §17's "I want to build this," not "here's another
   contact form."

## 7. Transition system

Every scene-to-scene join is a **spatial continuation of the same camera and
the same signal**, never a cut-and-fade between unrelated images — this is the
one rule carried forward unchanged from both prior worlds (`PRODUCT.md` §13,
`IMPLEMENTATION_PLAN`'s computed-overlap discipline). The signal thread itself
is the connective tissue: it is present, in some intensity, in every scene,
and every scene transition is staged as the thread moving from one state to
the next, not as one scene ending and another beginning independently.

## 8. Motion language

1. **The signal only touches what it is transforming.** This is the single
   rule that keeps "glow is back" from collapsing into generic ambient
   bloom — light without a subject is decoration; light with one is
   narrative.
2. **Camera-first, not element-first.** Individual elements rarely animate
   independently of the camera's own move — matches `PRODUCT.md` §08's "one
   camera" principle, still true regardless of which world the camera moves
   through.
3. **Scroll drives continuously, never discretely**, except in Scene 5 where
   control explicitly transfers to the visitor — carried forward from
   `PRODUCT.md` §07/§28 (works scrolling slow, fast, backward, stopped
   halfway) and from the proven `useAct`/`CinematicStage` architecture (§9).
4. **Kinetic typography moves as material**, not as a UI block — see §5.

## 9. What survives from prior work, unchanged

Genuinely world-independent engineering, kept as-is:

- `CinematicStage` + `useAct(id, { viewports, pin })` — the single master
  scroll timeline (ADR 0013). This is a solved, hard problem (reversible,
  frame-safe, single `useScroll` per page) with zero coupling to Production
  Strip's specific visual grammar.
- `useMotionCapability()` three-tier gate (`still`/`motion`/`cinematic`) —
  directly reused for gating the WebGL layer and video clips in this
  direction exactly as it gated Production Strip's clips.
- `EASE` curve, `SceneImage` webp+jpg asset pipeline, `ASSET_PLAN.md` §6-style
  acceptance criteria (ratio, size ceiling, glyph audit) — all reused as
  process, independent of content.
- Self-hosted Fira Sans infrastructure — reused as a technical asset pending
  the display-face decision in §5.
- The T6 defect-audit discipline (close-crop, 1:1, before any candidate is
  accepted) — codified as a permanent step for every future generation batch,
  not a one-off born from this week's incident.

Explicitly **not** carried forward: Production Strip's five state-marks
(CROSS/STRIP/FLAG/PIN/PUNCHED CORNER), its rail/perforation/latch mechanics,
its L1–L9 material laws, the MacBook-hero shot list from `PRODUCT.md` §06–§10
as a literal staging plan (its *principle* — camera enters the display — is
kept; its specific device-centric staging is not).

## 10. Flagged technical decision: WebGL/Canvas

`CLAUDE.md`'s current "Соглашения кода" section states this project uses pure
CSS for all 3D/visual effects and explicitly bans Three.js/WebGL/canvas — a
description of what Production Strip and the incumbent actually built, not an
independent standing prohibition; `PRODUCT.md` §07 itself lists WebGL/Canvas/
Three.js as legitimate options for the scroll-driven system. This direction
proposes **one** contained WebGL/Canvas layer — the signal-thread particle/
light system — reused across scenes rather than rebuilt per scene, gated
strictly to the `cinematic` motion tier, with a static/CSS fallback everywhere
else. This is flagged explicitly because it changes a documented project
convention; it is not blocked on this document, but `CLAUDE.md` should be
updated to reflect the decision once implementation begins, not silently
left contradicting the shipped code.

## 11. Generated asset plan (Higgsfield)

| Item | Model | Est. count | Est. credits |
|---|---|---|---|
| Hero backdrop still(s) | `nano_banana_pro`, 2k | 0–3 (inspect existing basalt lineage first) | 0–6 |
| Hero ignition video clip | `seedance_2_0` | 1 | ~20–25 (observed rate from prior session spend) |
| 5 service-instrument stills, with reject buffer | `nano_banana_pro`, 2k | ~15 (3 per station, learned reject rate from T6) | ~30 |
| Master upscales (winners only, 4k) | `nano_banana_pro` 4k or upscale | 6 | ~24 |
| Case portal treatment (shared, not per-project) | `nano_banana_pro`, 2k | 2–3 | ~6 |
| **Total, this phase** | | | **≈ 90–110 credits** |

This leaves roughly 850–900 credits in reserve against the ~1000-credit
balance for: iteration on any station that fails the defect audit, the
builder's separately-gated visual-direction feature (§6, Scene 5), a second
signature video clip if Scene 1 alone proves it earns one, and mobile-specific
replates if the desktop stills do not adapt cleanly.

**Skill routing:**
- `mcp__higgsfield__generate_image(_batch)` with `nano_banana_pro` — primary
  tool for every still, proven this week (T6).
- `higgsfield-product-photoshoot` — worth a small A/B test (a handful of
  frames) against hand-authored `nano_banana_pro` prompts for the service-
  instrument stills specifically, since its backend prompt-enhancement is
  tuned for exactly "hero/banner"-class brand product photography; not
  committed to without that comparison.
- `mcp__higgsfield__generate_video` with `seedance_2_0` — Scene 1's clip only,
  reusing the scroll-scrubbed `<video>` engineering pattern already proven in
  `HeroCameraPlate`.
- `higgsfield-brandkit` — optional, later: only if the signal-thread motif
  benefits from being locked as a reusable brand system rather than staying
  ad-hoc code: not required to ship this direction.
- Not used: `higgsfield-soul-id` (no people/faces in this brief),
  `higgsfield-marketplace-cards` (not e-commerce listings),
  `higgsfield-video-explainer` (not a narrated-explainer format),
  `higgsfield-youtube-thumbnail` (n/a). `higgsfield-websites` consulted only
  for methodology, per the owner's explicit instruction, never to replace the
  existing TanStack Start application.

## 12. Procedural asset plan

- Signal-thread WebGL/Canvas layer: one implementation, reused/recolored/
  repositioned across all six scenes rather than built per scene.
- CSS 3D depth rig: reused technique from the incumbent's validated approach,
  restaged around this direction's material photography.
- Kinetic typography: Framer Motion, driven off the same `act.progress`
  MotionValue as everything else — no new scroll source.
- Case portal mask/aperture: procedural clip-path/mask morph, shared
  component across all four cases, only the screenshot and brand-color
  exception differ per case.
- Scene 5's live object-accumulation staging: fully code-driven, no
  generated assets.

## 13. Desktop strategy

Pinned scroll stages via `CinematicStage`/`useAct`, unchanged mechanism from
Production Strip — this architecture was never the thing under review. Each
scene claims a viewport budget the same disciplined way `HeroCameraPlate`
computed `SHOT_SPLIT`/`OPEN_LOCK` from named beat budgets rather than literal
fractions — that discipline is reused regardless of what the beats now contain.

## 14. Mobile strategy

`PRODUCT.md` §10's rule stands unchanged: mobile is a separate composition,
not a scaled desktop. Concretely:

- Generated stills carry over directly (they are just responsive images).
- The scroll-scrubbed video clip and the WebGL signal layer are **not**
  required on mobile — `useMotionCapability`'s existing three-tier gate
  already demotes exactly this class of asset to `motion` tier (parallax and
  rig stay, video/WebGL scrub is dropped) and lower to `still` under reduced-
  motion, unchanged from how it already governs Production Strip's clips.
  Mobile's signal-thread equivalent is a lighter CSS/SVG animated glow, not a
  second WebGL implementation.
- Scenes un-pin below `lg` (1024px) into vertical sequences — proven pattern,
  `DESIGN.md` explicitly confirms this split is clean and worth keeping.
- Scene 5 (builder) needs its own mobile interaction pass regardless of
  visual world — it was already flagged as the one non-scroll-driven scene
  and stays that way here.

## 15. Performance strategy

- One WebGL canvas maximum, ever, gated to `cinematic` tier only — never
  required for functional correctness, always a graceful CSS/static fallback.
- Video: `requestIdleCallback`-loaded, static frame stands in until ready —
  proven pattern from `HeroCameraPlate`, reused verbatim.
- Images: existing `SceneImage` dual-format (webp+jpg) pipeline,
  `ASSET_PLAN.md` §6-style size ceiling reused.
- Reject-and-retry budget for generation (§11) is itself a performance
  decision: paying for more candidates up front is cheaper than shipping an
  oversized or defective master that needs mid-flight rework.

## 16. Rules for avoiding generic AI-looking imagery

Learned directly from this week's T6 defect audit, plus standing lessons from
`DESIGN.md`'s critique of the incumbent:

1. **One hue, always** — no purple/magenta/teal-orange grading, ever, in any
   generated frame. Already present as an explicit negative-prompt clause in
   the existing basalt-lineage prompts; keep it as a hard rule, not a
   suggestion.
2. **No generic floating dashboard/chart/KPI-card imagery.** Every screen
   shown must abstract into structure (grid, block, light), never into
   something that reads as an attempted UI mockup with fake numbers.
3. **No bokeh-heavy "generic tech" filler.** Every generated frame must carry
   ELEVATE-specific structural information (a real service's real material
   logic) — never decorative sci-fi wallpaper standing in for content.
4. **Mandatory 1:1 close-crop defect audit before any candidate is accepted**
   — not optional, not satisfied by the downscaled preview. This is now a
   standing process rule, not a one-off born from T6's screen/wordmark defect.
5. **No readable text, logos, or UI chrome, ever**, enforced by prose
   exclusion in every prompt *and* by rule 4's audit — T6 proved the prompt
   exclusion alone is necessary but not sufficient.
6. **Every generated frame is traceable to one specific scene's specific
   narrative beat.** Reject anything that reads as generic mood-board filler
   that could belong to any AI-generated hero anywhere.

## 17. Rules for maintaining ELEVATE brand identity

1. Exactly one chromatic accent — the brand blue — across every generated and
   procedural layer, no exceptions except the named per-case exception (§4).
2. Real business data only, unchanged from `PRODUCT.md` §02/§33 — no new
   metrics, testimonials, or claims introduced by this reframe.
3. Logo/wordmark stays DOM, never generated — a generation model cannot be
   trusted to render it correctly (confirmed again, hard, by T6 this week).
4. Typography stays DOM for all four languages — a technical requirement, not
   a style choice.
5. The four real client sites are shown as themselves, at full clarity, by
   the end of their scene — the studio's proof, never obscured by the
   spectacle staged around them.

## 18. Acceptance criteria for WOW

Concrete and testable, not vibes:

1. The first 2 seconds of a fresh load must produce a visually unexpected
   first frame — not "headline over hero image."
2. At least one moment in the sequence must be genuinely impossible to
   reproduce with a single afternoon of generic template work — real
   generated cinematography or genuine layered 3D, not a fancy CSS fade.
3. Full reversibility: scrolling backward at any point retraces every
   transformation with no jump, no frozen state, no forced reload —
   unchanged bar from `PRODUCT.md` §28.
4. A blind reaction test (3–5 people, "what kind of company is this / how
   does it feel") should converge on "premium, technical, serious digital
   studio" — not "gaming," "crypto," or "generic SaaS." This is the direct
   mitigation against the real risk that "glow + particles + morphing"
   drifts toward crypto-startup aesthetics if not held to §16's discipline.
5. No section, screenshotted in isolation, looks unintentional or generic —
   visitors do land mid-scroll via back-button and shared links, and this
   project's own QA method is literal screenshots.
6. No fresh visitor can point at any section and say "this looks like every
   other agency site" — the anti-generic bar carried unchanged from
   `PRODUCT.md` §30.

## 19. What is explicitly NOT decided by this document

- Whether to reuse or re-shoot the existing basalt-lineage stills (§3) —
  requires visual inspection first, zero credits.
- The final display typeface (§5) — requires a short comparison pass, zero
  credits.
- `PRODUCT.md` §15's AI-generated visual-direction step inside the builder —
  a separate, already-flagged feature requiring its own options-and-approval
  pass, not bundled into this direction's budget.
- Any specific prompt text for any of §11's generation line items — prompts
  are written at generation time, not locked in a planning document, per the
  same lesson T6 just taught (the documented A1 prompt had drifted from the
  actual goal by the time it was used).

Nothing beyond this document and its critique (§20) is authorized. No A2–A6-
equivalent generation, no homepage build, no credit spend beyond the section
comparison passes noted in §19, until the owner confirms this direction.

## 20. Independent critique (run against this document, 2026-09-08)

Run as an isolated pass by a reviewer with no stake in this proposal being
good, deliberately not shown the reasoning above — the same dual-assessment
discipline used for T3–T5's browser QA, applied here to the proposal itself.
Reproduced close to verbatim because softening it would defeat the point of
running it.

1. **Delivers the "what the fuck is this" reaction? Risky.** Scene 1 opens on
   "total darkness holding one inert object… nothing is happening yet,"
   locked camera — a slow, held first beat for a brief that demands shock in
   the first 2 seconds (§18.1). Nothing else in the six scenes is more
   aggressive than Scene 1; if that beat doesn't land, nothing downstream
   compensates.
2. **Metaphor strain by scene 4–5. Weak.** Scenes 1–2 genuinely enact
   "matter becomes signal." Scene 4 breaks it — real screenshots behind a
   portal, no material transformation, §6 itself says "none required" for
   generated assets there. Scene 5's "objects" are abstract form-inputs,
   several removes from scenes 1–2's physical vocabulary. The metaphor
   covers scenes 1–3 solidly and thins into a wrapper for 4–6.
3. **Genericness risk. Risky, and in tension with this project's own
   history.** `REJECTED_DIRECTIONS.md` rejected the "Vitrine" concept
   specifically because "dark scene, hot light sources, glass, reflections…
   is exactly the cluster every AI generation collapses into." §3's "glow is
   back in" resurrects close to that cluster as the load-bearing device of
   every scene. §16's mitigation (one hue, motivated light only) is a rule,
   not evidence; the only proposed validation (§18.4, a 3–5-person reaction
   test) is post-hoc, not a design-time safeguard.
4. **Credit budget. Optimistic on both ends.** T6, this same session, on a
   simpler subject (screens mostly face-down or abstract) got zero of three
   candidates through the glyph audit clean — one outright fail, two
   conditional. §11's Scene 2 stations require *active glowing UI content*
   ("a lit product page," "a glowing site frame") — strictly more
   defect-prone than T6's subject — yet budget the same 3-per-station reject
   ratio T6 already proved insufficient. The ~850-credit reserve names real
   purposes but attaches no estimate to any of them — a purpose list, not a
   budget.
5. **Feasibility honesty. Mixed.** Flagging the WebGL layer as a
   `CLAUDE.md`-contradicting decision (§10) is honest. But two of the
   hardest pieces get no technical detail: how one WebGL canvas composites
   with a CSS `preserve-3d` rig that `DESIGN.md` itself says collapses if
   `opacity`/`filter`/`mask` land anywhere but the outer container, and how
   Scene 5's live, visitor-driven staging actually gets built. "Most
   code-heavy scene by design" is an assertion, not a plan.
6. **Business-data discipline. Strong**, one soft flag: Scene 4's "portal
   dilates open… full scale" staging risks visually overselling modest real
   client sites (a clinic, a car dealer) with more drama than the sites
   themselves carry. No fabricated numbers found anywhere.
7. **Internal contradiction, found.** §7 states the signal thread is
   "present, in some intensity, in every scene" and is the literal
   connective tissue of every transition. §14 then drops the WebGL layer
   below `cinematic` tier, substituting "a lighter CSS/SVG animated glow" —
   a *different* mechanism, not the same thread continued. §7's "one
   continuous signal" claim is true only for desktop/cinematic-tier
   visitors and silently false for everyone else.
8. **Weakest scene: Scene 5 (Builder).** The interaction center of the page
   has the least concrete grounding — no generated asset, no visual
   precedent, no description of what an "object" looks like. It survives on
   assertion rather than a storyboarded image, unlike every other scene.
9. **Missing vs. the brief.** No numeric performance targets in §15 despite
   §5's measured 0.0000145 CLS setting the document's own evidentiary bar
   elsewhere. No scene is explicitly nominated as satisfying §18.2's
   "genuinely impossible to reproduce" test. "Morphing," explicitly named in
   the brief, never appears as a concrete effect anywhere. No rejected
   alternative credit allocation is shown, unlike this project's own
   `REJECTED_DIRECTIONS.md` practice elsewhere.

**Reviewer's overall verdict: not ready for go/no-go as written.** Three
named revisions before it should be: (a) harden §16's genericness mitigation
structurally, or explicitly argue why this direction's "hot light in the
dark" reads differently from the already-rejected Vitrine cluster; (b)
re-cost §11's Scene 2 line against T6's actual observed defect rate, not an
assumed one; (c) resolve the §7/§14 contradiction by stating plainly that the
continuous-signal promise is desktop-cinematic-tier only.

### Response

All nine findings stand as written — this section is not softened. Findings
3, 4, and 7 are the load-bearing ones and are conceded in full: the
genericness risk is real and under-defended, the Scene 2 credit line should
be re-cost against T6's actual 0-for-3 clean rate (not the assumed rate used
in §11), and §7's "present in every scene" claim needs the tier caveat §14
already implies but does not state. Finding 1 (Scene 1's quiet opening) is a
deliberate choice worth defending rather than conceding outright — a locked,
held first frame that then ignites can read as *more* shocking than an
already-loud opening, precisely because it withholds before it delivers; but
the critique is right that the document currently only argues this in prose
and does not storyboard the ignition's actual intensity, so the concern is
fair as written. Finding 2 (metaphor strain in scenes 4–5) is accurate and
is the deepest structural question in this document — it should be treated
as a real open question for the owner, not resolved unilaterally here.

**This is the state the direction is in: a genuine proposal with three
specific, named weaknesses, not a finished pitch.** Per the owner's own
instruction, nothing further is generated or built. The next decision is the
owner's: revise before deciding, or decide with these three gaps named and
accepted as-is.
