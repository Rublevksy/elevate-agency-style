# HOMEPAGE BUILD — the production rebuild

**Date:** 2026-09-11/12 · **From:** `b964a0d` (tagged `checkpoint/pre-homepage-rebuild`)
→ `332c04d` (assets) → `4d6b148` (homepage) · **Higgsfield:** 939.5 → **931.5**
(8 credits, one targeted edit).

This is the build that followed `PROTO_GATE.md`'s conditional GO. It records
what was decided, what was measured, and — importantly — the business-data
discrepancies found along the way that are **not** this build's to fix.

---

## 1. The three mandatory conditions

### Condition 1 — real client work — **met**

The four real projects in `src/lib/projects.tsx` are now on the homepage as
static captures of their live sites, taken once in a real browser:

| Project | URL captured | In the page |
|---|---|---|
| Biodent Clinic | `biodentclinic.cz` | hero cycle, SEO service stop, case 01 |
| Exclusive Beauty | `exclusivebeauty.cz/cs/` | hero cycle, e-shop service stop, case 02 |
| N Home Praha | `inhomepraha.cz/hlavnistranka` | hero cycle, Web service stop, case 03 |
| EuroMotors | `euromotors.cz` | hero cycle, Web service stop, case 04 |

`scripts/capture-client-work.mjs` captures and processes them: desktop fold
(1600×1000), a 2.5-viewport "page" for the window to scroll (1200×1875), and a
phone fold (480×960), each webp + jpg, ~1.1 MB of webp in total, all lazy
except the first. Czech editions were used where the site offers one; consent
banners were accepted **through their own buttons**, and the only DOM change
was hiding the fixed settings button a consent plugin leaves behind. Biodent's
mobile header renders as an empty white band in headless Chrome, so that band
is cropped from its phone capture.

The runtime WordPress **mshots dependency is gone**. It had no fallback and
returned whatever state the page was in (one capture arrived under the clinic's
own cookie banner, another as an empty white field). Nothing on the homepage
now depends on a third-party image service.

### Condition 2 — one-window handoff — **met, structurally**

The prototype joined two pinned sections with a negative-margin overlap, and
however it was tuned a paused scroll at the seam showed two windows. The fix is
not a better tuning: **the hero and all five services are now one act with one
sticky stage**, so the window is one DOM element for the whole sequence and
there is no seam to hide (`home-tokens.ts`, `HeroScene.tsx`). The transition is
a real navigation — address cut, load bar, old page blanked to the *new* page's
background colour, new page painted top-down.

### Condition 3 — candidate 6 without its drawn browser — **met (8 credits)**

A **free removal was attempted first** and rejected on the evidence: a
row-wise inpaint over the browser quad left a dark slab with a hard rim, cut
both light arcs in half (the portal became a quarter arc), and left the wet
floor reflecting a window that no longer existed. Two of those three defects
cannot be fixed by masking — the arcs and reflections pass through the removed
region.

So one targeted `nano_banana_pro` edit was run against the original job as
reference: 4 variants × 2 credits = **8 credits** (cap was ~12). Variant
`dc417349-58b3-4768-92fb-d2d6297bcef7` is the one kept — the only one that
preserved the original's *two* arcs (including the comet-tail fade at upper
right), the fog, the wet cracked floor and the framing, while removing the
browser and completing both arcs to the floor. The other three invented extra
arcs. The plate enters through the project's existing pipeline:
`references/generated/portal-master.png` → `scripts/extract-ref-assets.mjs` →
`src/assets/refs/portal{,-sm}.{webp,jpg}` → `SceneImage` (which now supports a
`srcset`, so phones fetch the 1200px cut).

---

## 2. The page

One object carries the page: a real DOM browser window (`BrowserWindow.tsx`).

| Section | What the window does | Where the words come from |
|---|---|---|
| Hero | stands in the portal, cycling the 4 real client sites (address, tab title, load bar per site), phone alongside | `t.hero.scene*`, real domains |
| Services ×5 | same window navigates: `/services/web` → `biodentclinic.cz` (SEO inspector) → `exclusivebeauty.cz` (scrolling) → `/services/branding` (ELEVATE brand board) → `/services` (drawn app schematic) | `t.ui.serviceStage`, `t.ui.showcaseBullets`, `usePages().services*`, `pricingPages` |
| Pricing | all three real prices visible at once; the selected plan's scope loads in place (no window here — see §6) | `pages.pricingPages`, `servicesDesign.finalPrice` |
| Cases | scrolls each real client site, navigating between them | project names/categories/domains only |
| Builder | draws a live blueprint of the visitor's project from their own choices | `t.contact.form.*` |
| Closing | returns to the portal showing ELEVATE's own contact page, depicted | `t.about.*`, `t.contact.*` |

**Services stops and prices** (SEO and Apps have no price in the application
data, so none is shown — a price is never inferred):

| # | Service | Price | CTA route |
|---|---|---|---|
| 01 | Weby, které prodávají | od 5 000 Kč | `/services/web` |
| 02 | SEO, které přináší výsledky | — | `/audit` |
| 03 | E-shopy, které vydělávají | od 15 000 Kč | `/services/eshop` |
| 04 | Značka, která zaujme | 2 000 Kč | `/services/branding` |
| 05 | Aplikace, které lidé používají | — | `/contact` |

**No metrics anywhere on the page.** The `results[]` arrays in
`pricingPages` (+45 %, +120 %, …) and in `projects-i18n.ts` (+180 % …) are not
rendered (PRODUCT.md §33).

---

## 3. Business-data discrepancies found — reported, NOT changed

These are the owner's to decide. Nothing here was edited.

1. **Case copy does not match two of the four live sites.**
   `projects-i18n.ts` describes **N Home Praha** as a luxury real-estate site
   with a property catalogue, filters and a "detail nemovitosti"; the live
   `inhomepraha.cz` is a cleaning, dry-cleaning, moving and handyman company.
   It describes **EuroMotors** as a premium car dealer with a financing
   calculator and test-drive booking; the live `euromotors.cz` is a car repair
   shop. Putting that copy beside the real screenshots would state something
   the screenshot visibly contradicts, so **the homepage shows only verifiable
   facts** for cases: name, category, real domain, the real capture, the live
   link and the case-study link. `/projects/$slug` still renders the old copy —
   out of scope for this build.
2. **Two pricing sources disagree.** `t.pricing.plans` still carries an older
   table (START 10 000 Kč / BUSINESS 25 000 Kč); `pages-i18n.ts`
   `pricingPages` carries od 5 000 / od 15 000 / 2 000 Kč. `/pricing` renders
   the latter, so the homepage does too. The legacy table was left untouched.
3. **The live elevateit.cz deployment is older than HEAD** and still publishes
   the unverified metrics (+180 % objednávek online, +140 % obrat e-shopu,
   +95 % poptávek). Deploying this build removes them from the homepage.
4. Two site-wide defects recorded in `PROTO_GATE.md` §3 were **fixed** in the
   critique round rather than left standing, because both are on every page
   this homepage links to: `html lang` now emits BCP 47 (`cs`/`en`/`ru`/`uk`),
   and the `btn-primary` CTA surface now passes AA (§6, items 2 and 12).

---

## 4. What was kept, and what is now unmounted

Preserved exactly: routing, Supabase, the Telegram contact pipeline (the
builder's payload is byte-for-byte what `Contact.tsx` sends), SEO/JSON-LD,
translations, navigation, forms, case data, `pricing.ts`.

Unmounted but kept and recoverable (ADR 0003 practice): `StudioManifesto`,
`HeroCameraPlate`, `HeroLightField`, `useCinematicViewport`, and the camera
clips in `public/media/` — the previous "camera into a lit screen" hero. The
tag `checkpoint/pre-homepage-rebuild` marks the last commit that mounted them.
`/proto` is left in place as the prototype `PROTO_GATE.md` refers to.

Motion architecture is the existing one: `CinematicStage` / `useAct` / `EASE` /
`depth()` / `PERSPECTIVE` / `useMotionCapability`. Two pinned acts (`hero`,
`cases`), each with **pin = (V−1)/V**; everything else is arrival-only or
pointer-driven. No second animation system was introduced, and no WebGL.

---

## 5. Browser QA (the acceptance criterion)

Measured on the real dev server, headless Chrome over CDP:

- **1440×900** — full scroll: hero rest, handoff, all five service stops,
  pricing, all four cases, builder, closing. No console errors. No horizontal
  overflow at any position.
- **1440×1080**, **1024×768** — same sweep, no overflow, copy and window clear
  each other at every stop.
- **390×844 mobile** — its own composition (portal framing a smaller window,
  stacked services/cases). Hero CTA fully above the fold. No overflow.
- **Reduced motion** — document height drops 14 040 → 9 673 px: tracks and pins
  are dropped in CSS, and all five services, pricing, four cases, the builder
  and the closing are present and readable with no frozen scroll.
- **Reverse scroll** — ten scroll positions captured going down and again
  coming back up: worst case 2 151 of 3 888 000 bytes differ (0.055 %), max
  channel delta 35 — antialiasing on scaled type. The timeline is reversible by
  construction (`useAct` is pure `useTransform`).
- **Builder interaction** — clicking E-shop, five features and a budget drives
  the blueprint (product grid, docked modules, phone, budget tag); submit stays
  disabled until the required fields validate; no console errors.
- `tsc --noEmit`, `eslint` (0 errors), `vite build`, and the Impeccable
  detector (`[]`) all clean.

Detector exclusions (disclosed in `.impeccable/config.json`): `BrowserWindow.tsx`,
`window-pages.tsx`, `ProjectBlueprint.tsx` — depicted UI drawn at 30–60 % scale
in container-query units, so its type sits below the page's own ramp by design.
Real page type follows the DESIGN.md ramp.

---

## 6. Independent critique round (2026-09-12) and what it changed

`/impeccable critique` was run against the rendered homepage with the proper
**dual-agent protocol**: Assessment A (design review) and Assessment B
(detector + measured browser evidence) ran as two isolated sub-agents that
could not see each other's output. Both drove real headless Chrome at
1440×900, 1440×1080, 1024×768, 390×844 and under reduced motion. (An earlier
attempt was killed mid-run by a session limit and was re-run from scratch.)

**A's verdict:** design specificity "authored for ELEVATE — decisively";
heuristics **21/32** (66%). **B confirmed structurally:** the hero→services
handoff never shows two windows at any sampled frame, both pinned acts release
exactly at `progress === 1`, zero horizontal overflow, one visible H1 per
viewport, no duplicate IDs, no missing `alt`, correct lazy-loading, hero
diacritics intact, reduced motion complete.

### Fixed in this round

| # | Finding (source) | Fix | Verified |
|---|---|---|---|
| 1 | **P1** every service navigation left the window blank/painting for 26% of each stop and the copy under 50% opacity for ~40% — read as a failed page load (A) | `NAV` shortened to lead 0.06 / swap 0.02 / paint 0.07; the old page now blanks to the NEW page's own background (white for client sites); service copy fades in 0.06vp and out 0.06vp; the hero headline holds until the address actually changes | frames 600–1215 all carry copy or a painted page |
| 2 | **P1** `.btn-primary` measured **2.98:1** white-on-blue, every CTA on the page (B) | new `--primary-strong` token darkens only the CTA *surface*; the brand blue is untouched as light, accent and rule | **4.74:1** measured from rendered pixels |
| 3 | **P1** disabled "Pokračovat" at **1.90:1** via `opacity-40` (B) | disabled state is now its own surface (`bg-white/[0.07]`, `text-white/65`), not a faded primary | — |
| 4 | **P1** both scroll rails 3.36–4.15:1 — the most persistent text on the page (B) | rail numbers to full `primary`, labels to `white/70`, counters to `white/65`, builder's "no spam" line to `white/65` | rail number **5.97:1** |
| 5 | **P1** hero client-selector taps **16×24px**; secondary links 17–23px tall (B) | selector buttons are 44×44 hit areas around the same 3px bar; every secondary link in the rebuilt sections gets `min-h-11` | — |
| 6 | **P1** two windows visible at the four seams the single-act fix did not cover (B) | the cases window fades with its own act's `exit`; **pricing no longer uses a window at all** | **0 frames** with two windows at 1440×900 and 1280×800 |
| 7 | **P1** cases heading promised results the section does not show (A) | heading is now "Vybrané projekty" (`homeWorkEyebrow`), eyebrow `t.nav.work` — no claim without evidence | — |
| 8 | **P1** the Apps chapter contained no app, and its tab contradicted its address (A) | drawn app schematic in the builder's blueprint register (explicitly a design, not a claimed product); address and tab are both `/services` | — |
| 9 | **P2** the pricing window was "a card with chrome on it" — the one shape DESIGN.md bans, and the object's meaning flipped mid-page (A) | pricing is a plain region on the page ground; the window stays a depiction of a website everywhere it appears | — |
| 10 | **P2** 1024×768 got the most demanding layout in the least space (A) | the pinned stage now starts at `xl` (1280); 1024–1279 uses the stacked rendering, and the hero is two columns from `md` | H1 + CTA above the fold at 1024 and 820 |
| 11 | **P2** the ending restated the hero and duplicated the footer's contacts (A) | closing headline is now `t.about.title`/`body`; the window shows ELEVATE's own contact page, depicted; the real channels live once, in the footer | — |
| 12 | **P2** `<html lang="cz">` / `"ua"` are not valid language tags (B) | `HTML_LANG` map emits `cs` / `en` / `ru` / `uk` | — |
| 13 | **P2** mobile fetched MORE image bytes than desktop (709 KB), pulling four 1600px desktop plates (B) | 800px cut of every client fold, offered through `srcset` | mobile **315 KB**, desktop **339 KB** |
| 14 | **P2** `elevate-logo.png` (262 KB) was the single heaviest asset, eager, every page (B) | webp cut of the same artwork through `<picture>`; `PageLoader` (the first asset the site fetches) switched to it | 262 KB → **18 KB**, 0 png fetches |
| 15 | **P3** depicted `h3` outranked the real service `h2`s (skipped heading); the window repeated the intro word-for-word; the phone overlapped the mock's own type; blueprint tag clipped; `role="radiogroup"` on a `<ul>`; tablist without arrow keys; invisible focus ring on the builder's options (A + B) | all fixed in place | detector `[]` |

### Not fixed, and why

- **`BrowserWindow.tsx` was excluded from the detector as "depicted UI"** — B
  correctly pointed out it also wraps real interactive content. The exclusion
  was **removed**; the file's chrome type moved onto the documented label step
  and it now passes unexcluded. `window-pages.tsx` and `ProjectBlueprint.tsx`
  remain excluded (genuinely `aria-hidden` depiction at 30–60% scale).
- **"N Home Praha" over a site branded INHOME** — a data question, not a design
  one. §3.1 above. Changing a client's name in `projects.tsx` is the owner's
  call, not this build's.
- **Mobile sticky CTA bar + chat bubble occupy the thumb zone**, six mobile-menu
  links are focusable while the menu is closed, and the header consumes ~20 tab
  stops. All three live in global components (`FloatingCta`, `ContactWidget`,
  `Nav`) shared by every route — out of scope for a homepage rebuild, and
  reported here instead.
- **`dark-glow` ×31 / `kicker-above-heading` ×13 / `numbered-section-labels`**
  from the live-page detector: these are the design system's own decisions
  (the CTA glow, the `01 / 05` construction). The case list dropped its
  "/ 04" counter to reduce the repetition; the rest is kept deliberately.
- The heuristic score was not re-run after these fixes (the skill's ceiling is
  one confirmation round), so **21/32 describes the page before them**.

### Re-verified after the fixes

`tsc`, `eslint` (0 errors), `vite build`, detector (`[]` on everything the page
renders; the only 2 findings are in unmounted `StudioManifesto.tsx`). Browser:
no console errors and no horizontal overflow at 1440×900, 1280×800, 1024×768,
820×900, 390×844 or under reduced motion; reverse scroll worst case **0.020%**
of bytes; two-window frames **0**; first-load image weight 315 KB mobile /
339 KB desktop.
