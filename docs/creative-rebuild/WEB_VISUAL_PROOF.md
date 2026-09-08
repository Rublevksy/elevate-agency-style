# WEB VISUAL PROOF — six website-material candidates

**Executed 2026-09-08**, under explicit owner correction: no more abstract
worlds (no light table, no cinematic "matter into signal," no cyberpunk/
industrial/laboratory reinterpretation). This test grounds generation
directly in ELEVATE's actual references (`/references`, `prompt.md`,
`PRODUCT.md`, the real logo, the two existing approved hero masters) and
produces material that looks like it belongs to a real, premium web-
development studio's homepage — not a movie, not an art installation.

**Spend: 12 of the ~30–40cr ceiling** (951.5 → 939.5, 6 stills × 2cr). No
video generated. No full asset library. No homepage changes.

## 0. Reference study (done before generating anything)

- **`references/01_HOME_DESKTOP_HERO.png`** — the real, approved hero
  composition: a matte black MacBook (lid closed, back to camera) on a
  cracked black stone slab, near-total darkness, one luminous white-to-blue
  arc of light sweeping behind it, thin faint vertical guide lines, the real
  ELEVATE wordmark (white letters, blue upward-arrow as the "A") top-left
  and on the lid, restrained Czech headline copy, a "SCROLL" indicator. This
  is genuinely premium and restrained — not cyberpunk, not horror, not an
  abstract tableau.
- **`references/01_HOME_DESKTOP_SCROLL_SERVICES_SHOWCASE.png`** — a vertical
  sequence of phone-mockup cards, each showing a miniature browser/app
  screen plus a mascot character, connected by a numbered vertical line.
  The mascot is not carried into this test (already established as optional
  legacy per project history, `PRODUCT.md`/`ASSET_PLAN.md`), but the
  underlying idea — layered device screens showing real interface content,
  connected in a sequence — is exactly what this brief asked for and is
  reflected in candidates 2 and 4 below.
- **`references/10_SERVICE_WEB_HERO.png`** — confirms the same dark/blue/
  device-forward register on service pages.
- **`references/generated/hero-macbook-master.png` and
  `hero-iphone-master.png`** — the two existing, already-approved,
  logo-free generated hero devices (Higgsfield `nano_banana`, reference-
  guided, per `CLAUDE.md`). **Reused directly as `image_references` inputs**
  for all six candidates below (macbook master) and candidate 4 (both) —
  not regenerated from zero. This is the concrete "identify reusable
  assets" step the brief asked for: the material, light-arc motif, stone
  surface, and device rendering are locked to what's already built and
  approved, not reinvented.
- **`src/assets/elevate-logo.svg`** — the real wordmark: white letters,
  blue gradient upward-arrow standing in for the "A." Not sent to the
  model in any prompt; stays DOM/SVG, per standing project rule and this
  task's explicit instruction.

## 1. Generation record

| # | Candidate | Model | Params | Cost |
|---|---|---|---|---|
| 1 | Large browser/interface composition | `nano_banana_pro` | 16:9, 2k, `image_references`: macbook master | 2cr |
| 2 | Layered websites/screens in depth | `nano_banana_pro` | 16:9, 2k, `image_references`: macbook master | 2cr |
| 3 | Interface assembly/transformation | `nano_banana_pro` | 16:9, 2k, `image_references`: macbook master | 2cr |
| 4 | Website + mobile app ecosystem | `nano_banana_pro` | 16:9, 2k, `image_references`: macbook + iphone masters | 2cr |
| 5 | Digital design system composition | `nano_banana_pro` | 16:9, 2k, `image_references`: macbook master | 2cr |
| 6 | Experimental (browser-portal) | `nano_banana_pro` | 16:9, 2k, `image_references`: macbook master | 2cr |

Job IDs: `98df5689` (1), `62d48d4c` (2), `971e97b1` (3), `d124f713` (4),
`a8f66cf5` (5), `04931797` (6). Model billing shows `nano_banana_2` in
`job_status` — same confirmed benign alias as every prior batch this week.

**Defect audit result: 6 of 6 clean at 1:1 close-crop — the first fully
clean batch this project has produced.** This is a real, useful technical
finding, not luck: every prompt in this batch described screen content
explicitly as "soft-edged colour blocks," "bars," and "pills," and
deliberately avoided any noun that implies text belongs on the object
("card," "label," "proof," "spec sheet" — all present in the prior Light
Table batch, all of which triggered invented text in that batch). Screen
content was also specified as softly defocused. Between the two mitigations,
zero candidates in this batch carry any readable text, invented logo, or
face-like artifact. This should be treated as the standing prompt pattern
for any future UI/screen-content generation on this project.

## 2. The six candidates

### Candidate 1 — Large browser/interface composition

A single matte black MacBook, screen open, facing camera at a controlled
three-quarter angle, on the cracked stone slab. The screen shows one large,
confident website layout as clean colour blocks (navy hero panel, white nav
bar, one electric-blue accent block, a soft photographic image block) — no
text, no icons. The approved light-arc motif sweeps behind it.

- **Strengths:** the most direct, lowest-risk continuation of the actual
  approved hero reference — same device, same material, same light,
  now with the screen open and showing real interface structure instead of
  a blank lid. Immediately reads as "premium web studio," not an art piece.
  Highest practical value as a literal hero-image candidate.
- **Weaknesses:** the least kinetic/dynamic of the six on its own — a strong
  static frame, not yet a demonstration of "things transform" without added
  motion design.
- **Feels like a website, not an AI image?** Yes, clearly.

### Candidate 2 — Layered websites/screens in depth

Three to four browser-window panels in real depth, offset and gently
defocused toward the back, each showing a different abstract block layout,
unified by the same light arc.

- **Strengths:** directly demonstrates "many things we build, one visual
  language" — the strongest single-frame argument for range (different
  layouts, one consistent world). Good composition for a services or
  portfolio-adjacent section.
- **Weaknesses:** slightly more generic "glass panel" 3D-render feel than
  candidate 1's grounded product photography; less immediately "hero."
- **Feels like a website, not an AI image?** Yes.

### Candidate 3 — Interface assembly/transformation

UI fragments (nav bar, card, button pill, image tile) shown mid-flight with
motion streaks, converging into one browser-window shape.

- **Strengths:** most literal "assembly/transformation" read of the six —
  a genuinely good visual metaphor for "we build interfaces," and the
  clearest candidate for an animated build-in sequence (each fragment is
  already a discrete layer).
- **Weaknesses:** the weakest on "professional/distinctive" — it reads
  closer to a generic 3D icon-pack illustration (the image-block icon in
  particular is a stock placeholder glyph, not photographic) than to the
  grounded product photography of candidates 1, 2, 4, and 6. Risks looking
  like a stock asset rather than something bespoke to ELEVATE.
- **Feels like a website, not an AI image?** Borderline — reads as "web
  development," but closer to a generic icon illustration than a premium
  photograph.

### Candidate 4 — Website + mobile application ecosystem

The exact matte black MacBook (screen now open) beside the exact matte
black iPhone from the two approved masters, both showing matching abstract
block layouts (desktop grid on the laptop, simple vertical app grid on the
phone), same stone surface, same light arc uniting them as one family.

- **Strengths:** the strongest, most direct brand continuity of the six —
  it is visibly the same two devices ELEVATE has already approved and
  generated, now shown together and now doing something (displaying real
  interface structure) rather than sitting closed/dark. Unambiguously
  communicates "we build for web and mobile" in one frame. Highest reuse
  value: built from existing assets, not new invention.
- **Weaknesses:** the most conventional/expected composition of the six —
  "laptop and phone side by side" is a familiar device-hero trope, though
  executed here at real quality with a genuine brand connection, not
  generically.
- **Feels like a website, not an AI image?** Yes, unambiguously — and it
  looks like ELEVATE specifically, not a generic studio.

### Candidate 5 — High-end digital design system composition

An elevated, editorial flat-lay of UI-kit elements — colour-swatch chips,
abstract typography-scale bars, button pills, icon tiles — on the stone
surface with the light arc restrained in the background.

- **Strengths:** genuinely elegant, gallery-quality composition; a real,
  specific "design system" idea, well executed; zero text-defect risk by
  construction (nothing here implies text belongs on it).
- **Weaknesses:** the weakest on "does this feel like a website" of the
  six — it is closer to an abstract material arrangement (echoing the
  exact register this task explicitly asked to move away from) than to a
  website or interface. It would need to be paired with something more
  device/screen-forward to avoid reading as "another abstract art piece."
- **Feels like a website, not an AI image?** No — feels like a premium
  material/design-token composition, not a website. Flagged honestly
  rather than stretched to fit.

### Candidate 6 — Experimental: browser-portal

A single glowing browser-window shape (real, recognisable browser chrome —
back/forward/refresh icons, an empty address bar, no text) opening outward,
its edge dissolving into the light arc, dramatic and kinetic.

- **Strengths:** the most visually dynamic and "WOW" of the six while
  remaining unmistakably a browser window, not abstract art — genuinely
  satisfies "experimental but still clearly web-development-oriented." The
  browser chrome (arrows, refresh icon) is a nice, specific, low-risk detail
  that makes the "this is a website" read instant.
  Excellent candidate for a transition moment (e.g. hero → services) rather
  than a static first-screen hero.
- **Weaknesses:** as a first-screen hero on its own it might read as
  slightly less "grounded"/product-photography-real than candidates 1 or 4,
  being more purely graphic.
- **Feels like a website, not an AI image?** Yes.

## 3. Scoring

| Candidate | WOW | Beauty | Professional | ELEVATE fit | Web-dev fit | Richness | Homepage usability | Animation potential | Scroll potential | Combines w/ real screenshots | Distinctive | AI-artifact-free |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 Browser | 8 | 9 | 9 | 9 | 9 | 7 | 9 | 7 | 8 | 8 | 7 | 10 |
| 2 Layered | 8 | 8 | 8 | 8 | 9 | 8 | 8 | 8 | 8 | 8 | 7 | 10 |
| 3 Assembly | 7 | 6 | 6 | 7 | 8 | 7 | 6 | 9 | 7 | 6 | 5 | 10 |
| 4 Ecosystem | 8 | 9 | 9 | **10** | 9 | 8 | 9 | 8 | 8 | 8 | 8 | 10 |
| 5 Design system | 7 | 9 | 8 | 6 | 6 | 8 | 6 | 6 | 6 | 5 | 8 | 10 |
| 6 Portal | **9** | 8 | 8 | 8 | 8 | 7 | 7 | **9** | **9** | 7 | **9** | 10 |

## 4. Strongest candidate: **Candidate 4 — Website + mobile application
ecosystem**

Highest ELEVATE-relevance score of the six because it is not just
*consistent* with the brand references — it is *built from* the exact two
assets the brand has already approved. Per the task's real question ("would
this make the owner proud to put ELEVATE's URL in front of a client"): this
is the candidate where the answer is least in doubt, because a client who
has already seen the current homepage's MacBook hero would recognize this
as the same device family, now doing more. It also scores highest on
practical reuse — no new material world to justify, no new device to
approve, direct continuation of what's already shipped-adjacent.

**Close second: Candidate 1 (large browser composition)** — the strongest
pure hero-replacement candidate, marginally more striking as a single
first-screen frame than candidate 4's side-by-side arrangement.

**Best secondary/transition asset: Candidate 6 (portal)** — the highest WOW
and animation-potential scores; recommended as a hero → services transition
moment rather than the first screen itself, where its more graphic (less
product-photography-grounded) quality would read as a strength rather than
a slight risk.

**Not recommended as-is: Candidate 5** — genuinely well-made but fails the
"does this feel like a website" test on its own; would need to be recontext-
ualized (e.g. as a small supporting graphic inside a "design system" service
panel, not a hero-scale image) to avoid reading as abstract art again.

## 5. How each could be animated in the browser

- **Candidate 1:** screen content cross-fades/reveals as color blocks
  build in on scroll-in (matches `prompt.md` §8's "UI panel reveals");
  laptop could carry a subtle parallax tilt tied to scroll, echoing the
  existing `HeroCameraPlate` pattern without needing new video.
- **Candidate 2:** the three panels are a natural match for a depth-based
  scroll transition — front panel could scale/fade back as a new one comes
  forward, i.e. an actual services-carousel mechanic, not just a still.
  Could be built as layered `<picture>` elements with CSS 3D depth, no
  video needed.
- **Candidate 4:** laptop and phone screens could update their colour-block
  content in sync as the visitor moves through service sections — "the
  ecosystem responds" — a strong hero-to-services throughline. Also a
  natural home for a real device frame with a genuine (cropped, legible)
  client screenshot composited into the screen area at full scale, later.
- **Candidate 6:** the portal shape is a strong candidate for the literal
  scene transition itself — the browser window "opens" as the visitor
  scrolls from hero into the next section, camera pushing through it,
  reusing the "camera enters the display" idea `prompt.md` §6 already asks
  for, without needing a generated video clip (a CSS/mask-based expand
  could carry most of the effect).

## 6. What should be generated vs. built in HTML/CSS/JS

**Generate (photographic/material, where code can't match it):** the device
+ stone + light-arc backdrop plates themselves (already done, reused from
the approved masters), and — if this direction is approved — a small number
of additional angle/state variants of the same devices (e.g. the ecosystem
shot from a slightly different angle for a second section) using the same
`image_references` consistency mechanism proven in this batch.

**Build in code (cheaper, sharper, brand-token-controlled, zero defect
risk):** all actual screen content — every colour block, bar, and pill seen
in these six images should become real DOM/CSS elements composited onto
the device screen in the browser, not baked into the photograph. This
serves two purposes at once: it lets the "interface" shown genuinely be
ELEVATE's real interface language (exact brand blue, real type, eventually
real cropped client screenshots) rather than a generic placeholder block,
and it sidesteps the defect-risk entirely for anything screen-related going
forward — the photograph only needs to supply the device, material, and
light, never the screen's actual content.

## 7. Independent critique

Run against the actual images, not a description of them, by a reviewer
without the context above — the same discipline used for every prior
generation batch this week. **This critique found a real problem in §4's
own reasoning that is corrected below, not smoothed over.**

1. **Candidate 4 shares a palette with the real reference, not its
   composition or photographic logic — and the write-up's §2 called that
   consistency.** Direct finding: the real hero (`01_HOME_DESKTOP_HERO.png`)
   is asymmetric, cinematic, a low dramatic angle with an irregular arc and
   photographic imperfection; candidate 4 is dead-center symmetric, both
   devices squared to camera, a perfectly clean half-circle arc — *"the
   classic 'laptop + phone side by side' SaaS-template composition that
   every Webflow/Framer agency theme uses, now recolored in ELEVATE's
   palette."* That is a materially harder claim than §2's original framing
   allowed.
2. **§4's own scoring table already contained the evidence of a trade-off
   the prose never named.** Candidate 6 scores higher than candidate 4 on
   WOW (9 vs. 8) and animation potential (9 vs. 8) in this document's own
   table — yet §4 recommended candidate 4 as *the* strongest candidate
   without stating plainly that this is a brand-fit pick, not a WOW pick.
   Direct quote: *"this batch optimized for on-brand relevance, and the
   strongest-recommended candidate is not the WOW leader — it's the
   safest one... the write-up picks brand-fit and calls it done without
   saying so."* This is accepted as accurate and corrected in §4 below.
3. **Candidate 5's rejection is independently confirmed, not too harsh** —
   agreed as "structurally identical in kind" to the abstract tableau
   register the owner explicitly banned this round, palette match
   notwithstanding.
4. **Candidate 6's browser chrome is an approximation, not an accurate
   browser reproduction** — no tab strip, an oversized edge-to-edge address
   pill no real browser uses, one ambiguous glyph. It reads as "a browser"
   symbolically and succeeds at that job, but a design-literate visitor
   would clock it as stylized, not faithful. Noted as a real, fixable
   craft detail for any future pass using this candidate, not a
   disqualifying flaw.
5. **The zero-artifact claim independently confirmed** on C1, C4, C5, C6 at
   the resolution inspected — no garbled text, no fake logos, no face-like
   marks found beyond what §1's own audit already reported.
6. **The genericness risk was relocated, not eliminated, and this document
   under-named that.** Direct finding: *"it swapped 'abstract and generic'
   for 'on-brand and generic'... the palette match is doing more work in
   making it feel bespoke than the composition actually is."* Device-
   mockup-pair, browser-opening, and UI-kit-flatlay are each, independent
   of ELEVATE's palette, industry-standard web-agency stock compositions.
   Real relevance was gained; genuine distinctiveness was not yet
   demonstrated by any of these six frames on their own.

**Reviewer's verdict:** a real improvement over the Light Table batch on
brand-relevance, and should still inform the next step for that reason —
but the owner should be told explicitly that candidate 4 is the safe,
brand-consistent choice, not the WOW choice, before it gets greenlit as a
hero image on the strength of this document's original framing alone.

### Correction to §4, made after this critique

§4 is not retracted — candidate 4 remains the strongest candidate **for
direct brand continuity and lowest-risk reuse**, and that is a real,
legitimate criterion. What is corrected: **it should not have been
presented as simply "the strongest candidate" without naming that this is
explicitly a brand-fit-over-WOW choice**, given this document's own scoring
table shows candidate 6 leading on WOW and animation potential. If the
owner's priority this round is "on-brand, ready to build on, lowest risk" —
candidate 4 is the right pick. If the priority is still "maximum WOW,"
candidate 6 (or a version of candidate 4 recomposed with the real
reference's asymmetric, photographic, imperfect camera logic rather than
its current centered product-render logic) is the more honest answer. This
document does not resolve that priority call unilaterally — it names the
trade-off plainly instead, which its first draft did not do.

## 8. What this document does not decide

No candidate has been chosen as final. No further generation — video,
additional angles, service-specific variants, case-specific variants — is
authorized by this document. No homepage code has been touched. The next
step is the owner's: which candidate(s) to carry forward, and whether to
proceed into an implementation-focused pass (Impeccable-led, per
`prompt.md`'s own priority hierarchy) rather than another generation round.
