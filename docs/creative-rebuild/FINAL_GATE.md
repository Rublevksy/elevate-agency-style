# FINAL GATE — pre-deployment review of the ELEVATE homepage

**Date:** 2026-09-13 · **Reviewed:** `7f047ae` (fresh critique) → fixes →
`77a62d4` (confirmation re-score) → `617db52` (last fix, browser-verified) ·
**Deployment:** not performed (not authorised) · **Higgsfield:** 0 credits
spent in this gate.

This gate answers one question: is the rebuilt homepage good enough to deploy?
The browser was the acceptance criterion throughout. Source was read only to
explain what the pixels showed.

---

## 1. Final Impeccable score

### **23 / 32 (72%) — "Good"**, measured on the post-fix page (`77a62d4`)

**How it was produced.** A fresh `/impeccable critique` ran against `7f047ae`
with the proper **dual-agent protocol**:
- **Assessment A** (design review) and **Assessment B** (detector + measured
  browser evidence) ran as two isolated sub-agents that could not see each
  other's output.
- Both drove real headless Chrome at 1440×900, 1440×1080, 1280×800, 1024×768,
  820×900, 390×844 and under reduced motion. A also checked Russian.
- A deliberately **was not told** the earlier score.

A's findings were fixed, and a separate isolated reviewer then **re-scored the
page at `77a62d4`**, verifying each fix in screenshots. That confirmation score
is the one reported here. One partial fix from that round (the portal's right
edge at 768–1279px) was completed in `617db52` and browser-verified; it was
not re-scored.

| # | Heuristic | Score | Key issue at `77a62d4` |
|---|---|---|---|
| 1 | Visibility of system status | 3 | Rails, step counter, load bars all report state; builder step 4 disables submit without saying why |
| 2 | Match system / real world | 3 | Plain Czech, real client sites; "Insights" untranslated in CZ nav |
| 3 | User control and freedom | 3 | Builder "Zpět", clickable rails, menu closes; the pinned acts make the page long |
| 4 | Consistency and standards | 3 | One window system throughout; "Aplikace" points to `/services` (no page of its own) |
| 5 | Error prevention | 3 | Builder won't advance without a choice; the depicted form in the closing window has a bright button that does nothing |
| 6 | Recognition rather than recall | 3 | All options always visible in rails, builder and blueprint |
| 7 | Flexibility and efficiency | n/a | Persuade surface |
| 8 | Aesthetic and minimalist design | 3 | Rich and controlled; brief blank moments at navigation cuts; pricing is plain |
| 9 | Error recovery | 2 | Builder step 4 uses placeholders as labels and a silently disabled submit |
| 10 | Help and documentation | n/a | Persuade surface |
| **Total** | | **23/32** | **Good (72%)** |

## 2. Comparison with the previous 21/32

| Round | Commit | Score | Verdict |
|---|---|---|---|
| First critique | `4d6b148` | **21/32** (66%) | "roughly two focused passes away"; blank navigations, empty Apps chapter |
| Fresh final critique | `7f047ae` | **22/32** (69%) | NO-GO pending one P0 and two design P1s |
| Confirmation re-score | `77a62d4` | **23/32** (72%) | **GO — no P0 or P1 remains** |

Read the trend with care. Each score came from a **different** independent
reviewer, so these are three honest readings rather than one instrument
measured three times. The movement is +2 across two fix rounds, and the band
moved from Acceptable to Good. What changed materially is **severity**, not the
number: the P0/P1 count went from 4 (first round) to 3 (`7f047ae`) to **0**.

**Fixed in this gate** (all verified in the browser):
- **Reduced motion:** the hero window no longer swaps to service pages under a
  client caption.
- **Cases:** client changes no longer hold a blank white window and an empty
  column for ~0.3 viewport; the phone now swaps with its window.
- **Keyboard:**
  - service-rail focus is visible (was focus on opacity 0, tab stops 27–31);
  - collapsed mobile-menu links are no longer tab stops (`inert`).
- **Exit-intent modal:** no longer rendered on `/`. It displayed "Děkujeme,
  brzy se ozveme" while sending nothing.
- **Address bar:** no longer draws two addresses at a navigation cut.
- **Collisions and crops:**
  - hero caption/phone collision gone (0 px²);
  - portal plate dissolves on all edges at 768–1279px;
  - EuroMotors capture no longer cropped mid-word.
- **Builder:**
  - "Pokračovat" is inside 900px on step 1;
  - the "Vícejazyčnost" tag no longer truncates.
- **Hero auto-cycle** stops once the visitor picks a site (WCAG 2.2.2).
- **Tap targets:** two small links now 44px.

## 3. Remaining issues

### P0 — **none on the homepage**

### P1 — **none**

### P2 (can ship; next polish pass)
1. **Closing window.** The depicted contact form has a bright
   "Odeslat poptávku" button that looks clickable but is decoration. The real
   CTAs sit directly above it.
2. **Builder step 4.** Placeholders stand in for labels ("Jan Novák",
   "jan@firma.cz"), and submit is disabled without saying which field is
   missing. This is the builder's pre-existing form design; its logic and
   Telegram payload were deliberately left untouched.
3. **Builder step 2.** "Pokračovat" sits at the fold at 1440×900.
4. **Pacing after the cases** (design, not defect). Pricing is a calm
   typographic section, and the cases act reuses the services composition, so
   an attentive visitor sees the window-left/copy-right grammar twice.
   Changing that is a design cycle, which this gate was not authorised to start.

### P3
- **Navigation cuts:** a blank white page shows for ~30–90px of scroll. It
  reads as a page loading, which is the idea.
- **Hero → services handoff:** the phone lingers semi-transparent for a moment.
- **1440×1080 services act:** ~40–80px of scroll where the left column is
  empty while the window still shows the previous page.
- **Mobile menu CTA:** carries a rocket emoji.
- **Stacked layouts** (<1280px and reduced motion) show one window per list
  item, so two windows are partly in frame while scrolling between items
  (20–44 sampled frames). This is how a stacked list works; the one-window
  guarantee (condition 2) applies to the pinned hero→services handoff, where
  it measures **0**.

### Site-wide, outside this homepage — reported for an owner decision
- **Exit-intent modal (P0 on every other route).** `ExitIntentModal.tsx` only
  sets local state: it shows a success message and sends nothing, and it
  promises "Nabídka zdarma za 24 hodin" — a claim PRODUCT.md §33 lists as
  unverified.
  - It is suppressed on `/` in this gate, but still mounted on every other
    route, and it is **already live in production today**.
  - The fix is either to remove it or to wire it to the Telegram pipeline.
  - The pipeline is protected, so rewiring needs owner authorisation.
- **Mobile sticky CTA bar and chat bubble** (`FloatingCta`, `ContactWidget`)
  overlap content on phones.
- **Header** takes ~20 tab stops with no skip link; "Insights" is untranslated.

## 4. Visual WOW assessment

Measured against the owner's bar — *a visitor enters and immediately thinks
"damn, this website is seriously well made."*

**Where it clears the bar (≥1280px):** the first screen and the first two acts.
- **Hero:** the neon portal over a wet, cracked floor with a real client site
  loading inside a real browser window, the phone alongside. It looks
  expensive, unmistakably like a web studio, and neither like a template nor
  like AI art.
- **Services:**
  - the same window navigates — address, load bar, paint — through ELEVATE's
    own service pages on real domains;
  - the SEO chapter shows a client's served `<title>`, meta description and
    `<h1>` in an inspector;
  - it is the most specific, most "made by people who build websites" moment
    on the page.
- **Cases:** real sites scrolling in the window with their phone views read as
  genuine proof.
- **Closing:** the portal returns with ELEVATE's own page in the window. It is
  a strong ending, so the peak-end is good.

**Where it drops:**
- **After the cases** the energy dips. Pricing and the builder are calmer and
  more conventional. They are never empty, but they are less striking than
  what came before.
- **The builder preview** is honest but reads as a wireframe.
- **Below 1280px** the composition is a competent, well-made stacked site
  rather than a wow experience.

**Verdicts, verbatim:**
- **Confirmation reviewer:** *"It clears the owner's bar, mainly on the
  strength of the first two acts … a visitor would think 'this studio builds
  serious websites.'"*
- **Assessment A** at `7f047ae`: *"an impressive opening and ending around a
  middle that reads template."*

Both are fair. The page is **clearly the best homepage this project has had,
and it earns the reaction on desktop in its opening**; its middle is the next
thing to lift.

## 5. Desktop QA

Full-scroll sweeps, every 90px, fresh headless Chrome over CDP:

| Viewport | Doc height | Overflow frames | Two-window frames (pinned) | Console errors |
|---|---|---|---|---|
| 1440×900 | 14 094 | **0** | **0** | **0** |
| 1440×1080 | 16 254 | **0** | **0** | **0** |
| 1280×800 | 12 901 | **0** | **0** | **0** |
| 1024×768 (stacked) | 8 816 | **0** | n/a | **0** |
| 820×900 (stacked) | 13 724 | **0** | n/a | **0** |

- **Pins:** both pinned acts release **exactly** at `progress === 1`
  (Assessment B: hero at 4500 / 5400 / 4000, cases at 10 712 / 12 566 /
  9 632).
- **Every section checked:**
  - hero → services handoff;
  - all 5 services;
  - pricing;
  - all 4 cases;
  - builder, clicked through all four steps;
  - closing;
  - top navigation.
- **Contrast** (from rendered pixels):
  - CTA **4.71–4.74:1**;
  - service rail 5–18:1;
  - builder options 7.1–7.3:1;
  - pricing and cases ≥ 5.2:1.
- **Production build:** `vite build` clean.
- **Static checks:** `tsc` clean, eslint 0 errors, detector `[]` on everything
  rendered.

## 6. Mobile QA (390×844)

- 13 009px document, **0** overflow frames, **0** console errors.
- **Own composition:** the portal frames a smaller window, the H1 and CTA sit
  above the fold, and the client caption comes after ELEVATE's headline.
- **Mobile menu:**
  - the toggle flips `aria-expanded`;
  - links are 51–56px tall;
  - tapping navigates and closes the menu;
  - collapsed links are no longer tab stops.
- **Contact CTA:** hero → `/contact`, closing → `#builder` and `/contact`, and
  both anchors exist.
- **First-load images:** 331 KB (the largest is a 48 KB client phone capture).
- **Open (global):** the sticky CTA bar and chat bubble cover some content.

## 7. Reduced-motion QA (1440×900, `prefers-reduced-motion: reduce`)

- 9 485px document (tracks and pins dropped in CSS), **0** overflow frames,
  **0** console errors, scroll reaches the exact bottom.
- **Content:** all 5 services, pricing, all 4 cases, the builder and the
  closing are present and readable.
- **Hero window:** stays on the client capture at every scroll position (0,
  250, 516 and 800 all show `biodentclinic.cz`). Before this gate it swapped
  to service pages.

## 8. Reverse-scroll QA

- **Method:** at 1440×900, 11 positions spanning the hero act, the services,
  the cases and the builder were captured going down, the page was scrolled to
  the bottom, and the same positions were captured coming back up. Each pair
  was pixel-diffed.
- **Result:** worst case **0.019%** of bytes differ by more than 24 levels.
  Nine positions are 0.000%.
- The timeline is reversible by construction (`useAct` is pure
  `useTransform`).
- The confirmation reviewer independently confirmed that reverse scroll
  returns to a clean hero.

## 9. Business-data QA

### Rendered on the homepage — every item traced to application data

| Shown | Source |
|---|---|
| od 5 000 Kč | `PRICE_WEB.CZ` (`pages-i18n.ts:137`) |
| od 15 000 Kč | `PRICE_ESHOP.CZ` (`:138`) |
| 2 000 Kč | `PRICE_BRANDING.CZ` (`:139`) |
| Grafika & design · od 3 000 Kč | `PRICE_DESIGN.CZ` (`:140`) |
| 5 services | exactly `t.ui.serviceStage`, same order |
| 4 projects + domains | exactly `PROJECTS_BASE` |

- **Live check:** the production `/pricing/web`, `/pricing/eshop`,
  `/pricing/branding` and `/services/web` publish **od 5 000 / od 15 000 /
  2 000 Kč**, identical to the homepage.
- **No fabricated metrics.** No `%`, `×`, `+N` or "více než" renders anywhere;
  none of the `results[]` figures from `pricingPages` or `projects-i18n.ts`
  appear.
- **Numbers that do appear are real:** "30 dní podpory" is a service term, and
  "15 lety zkušeností" is Biodent's own live meta description, shown verbatim
  in the depicted SEO inspector.

### Known unresolved data issues — for the owner, NOT changed

1. **"N Home Praha" vs live INHOME branding.** The homepage names the project
   "N Home Praha" (case heading, case rail, hero selector), from
   `PROJECTS_BASE`. In the same frame the live site's own tab title and capture
   read **INHOME** ("Úklidové služby … - INHOME").
2. **`projects-i18n.ts` describes two clients as different businesses**, in all
   four languages:
   - **N Home Praha** is written up as a luxury real-estate web; the live site
     is cleaning, moving and handyman services.
   - **EuroMotors** is written up as a premium car dealer with test-drive
     booking; the live site is a Prague 10 repair garage.
   - The homepage shows none of this copy, but `/projects/$slug`, which the
     homepage links to, still renders it.
   - *Also noted:* Exclusive Beauty is categorised "E-shop"; the live site
     presents as a salon network.
3. **Legacy `t.pricing.plans`** (START 10 000 Kč / BUSINESS 25 000 Kč, all four
   languages) contradicts `pricingPages`. It is rendered nowhere.
   - A fourth, unused table also exists: `SERVICE_DETAILS_DATA`, with web
     od 10 000 / e-shop od 35 000 / branding od 15 000 / design od 5 000.
   - `PRODUCT.md` §33 still lists 10 000 / 25 000 / 5 000, citing `pricing.ts`.
     `pricing.ts` now re-exports `pricingPages`, and production publishes
     5 000 / 15 000 / 2 000.
   - The stale source is therefore the document, not the homepage.

## 10. Live deployment status

**The deployed elevateit.cz is older than local HEAD.** It was not deployed,
and no production infrastructure was touched.

| | Live elevateit.cz (2026-09-13, Cloudflare) | Local HEAD `617db52` |
|---|---|---|
| Homepage structure | 10 sections: "Digitální produkty…", "Studio, ne template továrna", "Jak probíhá spolupráce", "Důvody, proč nám klienti svěřují projekty za 100 000+ Kč", "Výsledky, které mluví za nás", "Práce, která přináší výsledky", Instagram, "Máš projekt?" | Hero+services act, pricing, cases, builder, closing |
| Unverified metrics | **+128 %, +140 %, +180 %, +95 %**, some beside the wrong client domain (e.g. "+140 % obrat e-shopu" next to inhomepraha.cz) | **none** |
| Unverified claim | "projekty za 100 000+ Kč" | none |
| Client images | runtime WordPress mshots | static captures, no third-party request |
| Real prices on homepage | no | yes, all visible |
| Rebuild assets (portal plate, client captures, webp logo) | absent | present |

**Relevant difference:** deploying HEAD removes every unverified figure and
claim from the homepage and ends the mshots dependency. Every item in §9
already ships live today, so deploying makes nothing in §9 worse.

## 11. Higgsfield credits remaining

**931.5.**
- Balance at the start of the build: 939.5.
- Spent: 8 credits, on the single targeted edit that removed candidate 6's
  drawn browser.
- This gate: **0** — no generation.

## 12. FINAL GO / NO-GO

# **GO for deployment** of `617db52`.

**Why GO.**
- **Severity:** the independent confirmation round found **no P0 and no P1**
  on the homepage and scored the page at **23/32 (Good)**.
- **Stability:** every desktop, mobile and reduced-motion configuration is
  clean on overflow and the console.
- **The one-window guarantee holds:** 0 frames with two windows in every
  pinned layout.
- **Reverse scroll is exact.**
- **Business data:** every rendered price, service and project traces to
  application data that production already publishes.
- **The opening clears the owner's visual bar.**
- **Net effect of deploying:** it replaces a live homepage that publishes four
  unverified metrics with one that publishes none.

**Owner decisions that should accompany or follow deployment** (they do not
block it — each already exists in production today):
1. **Exit-intent modal on all other routes:** remove it or authorise wiring it
   to the Telegram pipeline (§3).
2. **Client data:** decide the "N Home Praha" / INHOME naming, and correct the
   two wrong client descriptions in `projects-i18n.ts` (§9.1–2).
3. **Pricing sources:** retire the legacy `t.pricing.plans` and
   `SERVICE_DETAILS_DATA` tables and correct `PRODUCT.md` §33 (§9.3).

**Next polish pass** (not required to ship):
- builder step-2 CTA and step-4 labels;
- the closing window's decorative button;
- lifting the pricing/builder stretch so the middle of the page matches its
  opening.
