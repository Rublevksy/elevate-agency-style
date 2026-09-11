# PROTO GATE — final verification before full homepage implementation

**Date:** 2026-09-11 · **Prototype:** `/proto` (isolated route; the production
homepage was not modified) · **Higgsfield:** 0 credits this round, balance
**939.5** (unchanged since `WEB_VISUAL_PROOF.md`).

The question this gate answers is not whether the prototype works — it does
— but whether it looks like a **genuinely excellent ELEVATE website**. The
verdict is at §11.

---

## 1. Prototype status

`/proto` = hero → hero-to-service handoff → first service (Web), built on
candidate 6 plus real DOM interface, using the project's existing
`CinematicStage` / `useAct` / `useMotionCapability` / `EASE` / `depth()`
architecture. Every string is real (`t.hero.*`, `t.nav.*`, `t.ui.*`,
`usePages(lang).servicesWeb`, `pricingPages.web`), including the real price
**od 5 000 Kč**. There are no invented metrics, clients, or UI strings.

Commits: `e01ab5a` (prototype) → `39d26fb` (real interface inside the windows)
→ this commit (fixes from the independent review).

## 2. Independent Impeccable review — result

**Method: dual-agent.** Assessment A (design review) and Assessment B
(detector + browser evidence) ran as isolated sub-agents in parallel and
couldn't see each other. The previous round was degraded by a rate limit; this
one wasn't. Both drove real headless Chrome over CDP: 1440×900 and 1440×1080
across the full scroll, 1024×768, 390×844, 360×740, reduced motion, RU and UA.

- **Deterministic detector:** exit 0, `[]`. `ProtoSiteMock.tsx` is excluded by
  design: it's depicted UI at ~30% scale, so its type sits below the page ramp.
- **Heuristic score (A, before this round's fixes): 18/32**, with heuristics 7
  and 10 n/a for a Persuade surface. That's 56%, the Acceptable band.
- **A's headline verdict:** *"the first screen now clears the bar the last
  round set — polished, credible, unmistakably a web studio, and the window
  holds a real designed website. The scrolled experience does not."*
- **Design specificity (A):** about 55% specific to ELEVATE (real copy,
  domain, price, photography) and about 45% archetype (a SaaS-style hero
  layout, AI-looking portal art).

### What the review found, and what was fixed this round

| # | Finding (source) | Fix | Verified |
|---|---|---|---|
| 1 | **P0** — the handoff and the last frame showed candidate 6's own drawn browser, full of blurred placeholder blocks. This was the exact "chrome around emptiness" flaw the previous commit was meant to remove (A). | The backdrop now fades to 0 by p 0.78; the panel only starts fading at 0.82. | 1150 / 1584 frames: no blocks |
| 2 | **Root cause of several faults** — the declared pin was 1.8 viewports, but the stage is physically pinned for only 1.4. It released at scroll 1260 while `progress` didn't reach 1 until 1620 (B, measured). | `PROTO_HERO_PIN = (V−1)/V`, the same formula as `ServicesShowcase`'s `SERVICES_PIN`. | Stage releases at 1260 and panel opacity reaches 0 at 1260 — they now match exactly |
| 3 | **P1** — hero → service showed two *different* windows, one fading while an unrelated one rose (A). | The hero window now **navigates**: the address changes to `/services/web`, a load bar runs, the old page blanks and the service page paints in top-down. The section that rises shows the same page. | 900 / 1150 frames |
| 4 | Czech accents clipped: the H1's reveal wrapper cut a 3px band off the tops of Á / Í / Ř / Š (B, pixel diff). | Top padding plus a matching negative margin on the wrapper. | visual |
| 5 | Address-bar contrast was **2.55:1** because the plate showed through the glass chrome (B). | Chrome made opaque. | — |
| 6 | Title roll left debris mid-transit: clipped glyphs, orphan tag lines, one card's tag over the next card's title (A + B). | Sequential opacity: the outgoing card is gone before the incoming one appears. This is not the rejected crossfade. | 900 frame |
| 7 | Layout collisions: at 1024 the window sat on the H1; in RU at 1440 the H1 touched the window (A). | Copy and panel widths paired per breakpoint; phone limited to `xl` and up. | 1024 frame clean |
| 8 | Reduced motion: **1260px of frozen sticky scroll** (A + B). | `motion-reduce:` CSS variants drop the track and the join. This is pure CSS, so there's no layout shift after hydration. | Hero is 900px tall; total scroll 684 instead of 1584 |
| 9 | The service section's arrival never finished: it topped out at 0.76 at 900 and 0.63 at 1080, so the content was left 15–24px low (B). | The intro now completes by `enter` 0.5. | `transform: none`, opacity 1 at page bottom |
| 10 | The phone covered 100% of the strip's "01" and 39% of the mock's CTA (B); later it sat over the service heading during the handoff (this round's verification). | The phone hangs from the window's lower edge and fades out by p 0.78. | 0 / 1150 frames |
| 11 | Mock headline paraphrased the page H1 ("Цифровые продукты" / "Цифровые решения"); "Domluvit konzultaci" appeared 3×; "WEB DESIGN & SEO" appeared 2×; phone had skeleton bars (A). | Mock shows the real services landing (`homeServicesEyebrow/Title`); mock CTAs use the real Pricing / Work labels; price label is "Ceník"; phone shows the real tag. | mobile frame shows no duplicate headline |
| 12 | The lone "DESIGN" chip read as a stray button (A). | Removed. | — |
| 13 | Roll tags 3.97–4.53:1, disciplines row 3.39:1, mobile kicker 3.42:1 (B). | Raised to white/60–75. | — |
| 14 | A third copy of the 2400px plate was decoding on mobile; the blur-2xl atmosphere layer was running on phones (B). | Mobile image copy removed; atmosphere layer limited to `lg`. | — |
| 15 | **Introduced by this round and caught by it:** `motion-reduce:lg:static` stripped the stage's containing block, so its absolute children escaped `overflow-hidden` (≈460px horizontal overflow). | `motion-reduce:lg:relative` | `scrollWidth` 1429 = `clientWidth` |

**Verification after the fixes:** no console errors; no horizontal overflow at
1440×900, 1440×1080, 1024×768 or 390×844 (motion and reduced); mobile CTA
fully visible with the hit-test landing on the CTA itself. Reverse scroll
returns to the first frame within sub-pixel noise: 884 of 3,888,000 bytes
differ (max channel delta 37), which is antialiasing on scaled mock text.
`tsc`, `eslint` and `vite build` are clean.

The heuristic score was not re-run after these fixes. Per the skill's own
ceiling, the confirmation round was browser verification, not a second
critique. So 18/32 describes the prototype *before* this round.

## 3. Remaining visual issues (not fixed, with reasons)

1. **The handoff is still, briefly, two windows.** They now show the same
   page, which reads as one window having navigated and docked rather than two
   unrelated screens. But a paused scroll around 1150 shows a fading window at
   upper right and a rising one at lower left, and that is the sparsest frame
   in the sequence: the plate has faded, the roll has ended, and the panel is
   dissolving. The real fix is a **shared-element flight**: drive the hero
   panel from `act.exit` into the service window's slot and hide the
   section's own window until it docks. That's an engineering task and belongs
   in the build, not in another prototype pass.
2. **Template and genericness risk is structural and remains.** A: *"remove
   the logo and the hero could belong to any dark-mode agency template"* —
   text left, product-in-browser right, phone overlapping, plus a
   textbook-generated neon portal. The fixes this round removed the defects
   that made it look *unfinished*. They didn't make it *distinctive*. §6
   explains what would.
3. **The window shows ELEVATE's own page, not ELEVATE's work.** A, as Jordan:
   *"where is your work?"* This is the most valuable area on the page, and it
   shows a picture of the site the visitor is already on.
4. **Payoff per pixel of scroll is moderate.** On the right, the approach is a
   16% scale plus a 3° square-up spread over 1260px. It's polished, but A
   called it *"polished rather than impressive."*
5. **Mock text is 6.4–8px.** It's legible on retina and reads as texture at
   1×. That's acceptable for a depiction of a page, but it's why the window
   impresses more in a 2× screenshot than on a standard office monitor.

**Site-wide findings outside `/proto`**, recorded here and not fixed because
they're out of scope:
- `document.documentElement.lang` resolves to `"cz"`, which isn't valid
  BCP 47. Czech should be `"cs"` and Ukrainian `"uk"` (`LangProvider.tsx`).
- White text on `--primary` measures 3.68:1, which fails AA for 16px
  `btn-primary` labels. This is the site-wide token.
- Production `HeroScene` uses the same `overflow-hidden pb-[0.08em]` reveal
  wrapper that clipped the Czech accents here. Not verified in production,
  but very likely affected in the same way.

## 4. Production `CaseShowcase` status — **working**

The earlier 403 was **an artefact of testing with curl, not a production
fault.** WordPress mshots rejects non-browser clients. From a real browser it
returns **HTTP 200 `image/jpeg`** for all four projects. I checked this in two
places:

- **Local production homepage (HEAD):** `CaseShowcase` uses remote
  `screenshotUrl()` only; there are no local project assets. All four images
  load (natural size 1280×960) and render the real client sites.
- **Live elevateit.cz:** this is **an older deployment than HEAD**. It serves
  the previous three-card `ProjectVisual` grid (`w=1400&h=900`), and all three
  images load 200.

**The 403 concern does not affect production rendering.** Three real issues
found along the way, none fixed (all out of scope):

1. **The live site still publishes unverified metrics** — `+180% objednávek
   online`, `+140% obrat e-shopu`, `+95% poptávek na nemovitosti`.
   `PRODUCT.md` §33 lists these as having no source; HEAD already removed
   them from the homepage. The deployment is behind the code.
2. **Third-party dependency with no fallback.** If mshots rate-limits, changes
   or blocks, the case images disappear, and nothing catches it.
3. **Capture quality varies.** mshots screenshots the live page in whatever
   state it's in: Biodent's capture includes the clinic's own cookie-consent
   banner, and Exclusive Beauty's reads as a mostly empty white field.

**Smallest safe fix, for the build rather than now:** commit clean static
screenshots of the four real client sites as local webp (cookie banner
dismissed, above-the-fold captured) and serve them through `SceneImage`. This
costs 0 Higgsfield credits, removes the dependency, fixes the capture quality,
and unlocks §6.1.

## 5. Candidate 6 verdict

**Keep it as the atmosphere, not as the object.** Its arc light, wet floor and
portal glow give the first viewport depth and colour that plain DOM wouldn't.
Its own drawn browser is the weakest part of the frame. That window, full of
blurred placeholder blocks, is what caused this round's P0, it competes with
the real DOM window at rest, and it's the element A called *"textbook
generated imagery."* The DOM window *is* the window; the plate doesn't need
one.

## 6. Is the visual system strong enough to scale?

**Yes, as a system. No, as the current hero reproduced verbatim.**

What the system has proven: an interface-as-hero that visibly says *web
studio*; real content everywhere; web-grammar transitions (navigate, load,
dock) that only a web studio can own; a motion architecture that's
reversible, reduced-motion-safe and correct at 900, 1080, 1024 and on mobile.
That scales cleanly: every service can be a page this same window navigates
to, and every case can be a real client site loading into it.

What it has not proven: that it's *distinctive*. Three changes turn the
system from a very good SaaS-style hero into an ELEVATE one, and all three cost
0 credits:

1. **Put real client work in the window.** Biodent, Exclusive Beauty, N Home
   Praha and EuroMotors, as committed static screenshots with their real
   domains in the address bar. A template can't have ELEVATE's clients. This
   answers "where is your work?" and makes the most valuable area on the page
   evidence rather than decoration.
2. **Make the handoff a single-window flight** (§3.1). The one-window story is
   what makes the page feel like one experience.
3. **Take the drawn browser out of candidate 6.** Mask the plate to its arc
   and floor, or replace it with a windowless variant (§9), so the only window
   on screen is the real one.

## 7. What must be preserved when scaling

- **Real content only:** `t.*`, `usePages`, real domains, real prices. No
  invented metrics, clients or UI strings. Copy inside a window must never
  paraphrase the copy beside it.
- **The window holds a real, composed page:** never colour blocks, skeleton
  bars or placeholders. The chrome is opaque, the dots are inert and
  `aria-hidden`, and the address bar shows a real URL.
- **Web grammar over film grammar:** transitions navigate and load; they don't
  dissolve.
- **The architecture:** `useAct` / `CinematicStage` with **`pin = (V−1)/V`**
  for any sticky stage; joins expressed as fractions of the neighbour's
  declared departure; `motion-reduce:` CSS variants for anything that
  changes layout; one accent colour; `EASE`; `depth()`.
- **Timing rules:** sequential, never overlapping, title rolls; any
  background carrying a drawn interface is gone before the foreground panel
  fades.
- **Mobile is its own composition:** compact cuts drop content deliberately
  rather than letting it clip.

## 8. What must NOT be repeated

- A declared pin that differs from the physical pin (this round's root cause).
- Glass chrome over a busy plate (2.55:1 contrast).
- Chrome around placeholders or skeleton bars.
- A mascot plate next to an abstract hero (the incompatible-register defect).
- Two near-identical headlines on one screen, or the same CTA 3–4 times.
- A reveal wrapper that clips Czech accents.
- A join applied unconditionally, which breaks mobile.
- `position: static` under reduced motion, which breaks containment.
- **Treating a curl result as the state of a third-party image service.**
- Showing unverified figures as fact (the live site still does).

## 9. Higgsfield assets still required

The system deliberately relies on DOM interfaces and real client screenshots,
so generation needs are small.

| Asset | Why | Required? |
|---|---|---|
| Windowless variant of candidate 6 (same arc, floor, light; no drawn browser) | Removes the source of the P0 and the "AI art" read (§5) | **Only if** masking the existing plate to arc + floor isn't enough — try the free mask first |
| 1–2 atmosphere plates in candidate 6's palette for later sections (cases, builder, closing) | Keeps one lit world across the page instead of flat black | Recommended |
| Client-site screenshots | — | **No generation.** Real captures of real sites, 0 credits |
| Video | — | **Not needed.** Nothing in this system requires scrubbed footage |

## 10. Estimated additional Higgsfield budget

| Item | Estimate |
|---|---|
| Windowless hero plate: 4 candidates × 2 cr, plus one 4k master | ~12 cr (0 if the mask works) |
| Atmosphere plates: 2 × 4 candidates × 2 cr, plus 4k masters | ~24 cr |
| Defect / re-roll reserve (history: T6 had 0/3 clean, Light Table 0/8, web proof 6/6 with the colour-block prompt pattern) | ~15 cr |
| **Total** | **≈ 30–50 credits of 939.5** |

The prompt pattern that produced the only fully clean batch this project has
had must be kept: screen content described as colour blocks, bars and pills,
never as cards, labels or proof sheets (`WEB_VISUAL_PROOF.md` §1).

## 11. GO / NO-GO

### **GO for full homepage implementation — conditional.**

**Why GO:** at rest the first viewport now clears the owner's bar. It's rich,
polished and dense, unmistakably a web studio, the window holds a real
designed page, and every word is real. Independent review confirmed this, and
it was not self-assessed. The system underneath is sound and has been
measured: timing correct, reversible, reduced-motion and mobile clean. It
extends naturally to every section. The remaining gaps are execution, not
concept.

**Why conditional:** judged strictly against *"does this look like a
genuinely excellent ELEVATE website"*, the honest answer today is **"the
first screen, yes; the whole scroll, not yet."** The independent reviewer's
template-risk finding is structural, and polish won't remove it. The build
should not ship the current hero verbatim. These three conditions come first
in the build, cost no credits, and are not a new creative round:

1. **Real client work in the window** (static screenshots of the four real
   sites, real domains in the address bar).
2. **Single-window handoff** (a shared-element flight from the hero into the
   service slot).
3. **Candidate 6 without its drawn browser** (mask first; regenerate only if
   needed, ~12 cr).

**What would turn this into a NO-GO:** if condition 1 can't be met reliably,
for example because clean captures of the client sites aren't possible, the
window goes back to depicting ELEVATE's own page. In that case A's *"any
dark-mode agency template"* stands, and the hero concept should be revisited
before it's scaled across the page.

Not done in this round: the full homepage build, new Higgsfield generation,
changes to the production homepage or `CaseShowcase`, and the `.grid-bg`
finding.
