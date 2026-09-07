# Higgsfield production plan — five service scenes

**Status: EXECUTED, THEN REVERTED. DO NOT RE-APPLY.**

All five scenes were generated and shipped, then rolled back at the user's
explicit instruction: the homepage must use their own reference posters —
`10_SERVICE_WEB_HERO.png`, `20_SERVICE_ESHOP_HERO.png`, `30_SERVICE_APP_HERO.png`,
`40_SERVICE_SEO_HERO.png`, `50_SERVICE_BRANDING_HERO.png` — with the mascot
intact. Production plates are once again crops of those posters, framed to
exclude every baked glyph, the invented percentages and the third-party
trademark. See `docs/adr/0011`.

Keep this file as the record of a rejected direction, not as a backlog item. The
specifications below may only be revisited if the user asks for the photoreal
language again. Two findings worth carrying forward if that ever happens: one
generation per service at `nano_banana_pro` / `2:3` / `2k` was enough, and the
models reliably want to render a blown-out white screen for the SEO scene — the
first take had to be reshot for exactly that.

Locked by user decision: the current V1 homepage is the master design; the hero
stays as-is; the five service visuals move from the Pixar/cartoon mascot to a
photoreal cinematic language. Existing mascot assets and components are kept.

---

## 1. Hard technical constraints

These come from the live pipeline, not from taste. Art that ignores them will
not drop into `SceneImage` without relayout.

| Constraint | Value | Source |
|---|---|---|
| Plate aspect | 900x1342 = **0.6706** | current `src/assets/refs/svc-*.jpg` |
| Generation aspect | **`2:3`** (0.6667) | closest enum; 0.6% off, a ~6px trim |
| Exact-size option | `seedream_v5_pro --width 900 --height 1342` | that model exposes w/h |
| Displayed crop | `object-cover object-[50%_20%]` | `ServicesShowcase.tsx` |
| Left-edge mask | `linear-gradient(to_right, transparent 0%, #000 16%)` | same file |
| Framing rule | five plates share ONE crop box (594x886 src) | `scripts/extract-ref-assets.mjs` |

Two consequences that must shape every prompt:

1. **The subject belongs in the UPPER-MIDDLE of the tall frame.** The display
   crop anchors at 20% from the top, so the bottom third of a 2:3 plate is
   mostly never seen. Do not centre the subject vertically.
2. **The left 16% dissolves to transparent.** It is the blend into the text
   column. It must be quiet, dark and free of any subject edge, or the fade
   will cut through something the eye is holding.

Order is fixed and must match `t.ui.serviceStage`:
**01 Web · 02 SEO · 03 E-shop · 04 Branding · 05 Applications.**

---

## 2. The shared universe

Five chapters of one room, not five stock photographs. Continuity is carried by
holding these constant across all fifteen generations; only the subject on the
desk and the camera's station point change.

- **The room** — one dark contemporary studio interior. Honed black basalt
  surfaces, matte black anodised aluminium, brushed steel, smoked glass. A deep
  window plane camera-left, a soft grey concrete wall behind.
- **The key** — a single hard raking key from upper-back-left, the same
  direction as the hero's key. It skims materials rather than flooding them.
- **The practical** — one continuous luminous arc or light-blade in the
  background, the same motif as the hero's arc. It is the thread that ties the
  five frames to the hero.
- **The atmosphere** — light haze so beams have volume; fine dust in the key.
  Same density every frame.
- **The accent** — ELEVATE electric blue appears **exactly once per frame**, and
  always as a real emissive source (a screen, an edge glow, an engraved mark),
  never as a colour grade, gradient wash or rim-light on everything.
- **The lens family** — 50mm and 85mm full-frame equivalents, f/2.0-f/2.8.
  Shallow but not novelty-shallow.
- **The palette** — near-black #0A0D13 ground, cool neutral greys, one blue.
  No warm amber, no teal-orange, no purple.

## 3. Shared negative prompt

Appended to every one of the fifteen prompts:

```
cartoon, 3d render, pixar style, illustration, anime, stylised character,
mascot, text, letters, words, logos, watermark, signature, ui mockup,
fake charts, numbers, percentages, statistics, brand names, trademarks,
purple, magenta, teal and orange grade, rainbow gradient, neon cyberpunk,
lens flare, heavy bloom, glassmorphism, stock photo smiling people,
cluttered desk, warped geometry, distorted hands, extra fingers,
oversaturated, HDR halo, vignette burn
```

Rationale for the strict text/number bans: `PRODUCT.md` principle 5 forbids
fabricated metrics, and the previous renders carried invented figures
(+220% / +180% / +150%, "+2 482 users") and a third-party trademark. No glyphs
in the raster also keeps CZ/EN/RU/UA parity — all type stays DOM.

---

## 4. Per-service specifications

### 01 — WEB

- **Concept** — the moment a site is being shaped: a designer's station seen as
  a place of craft, not a product shot of a monitor.
- **Composition** — desk running from lower-left to mid-right; a matte black
  display standing right-of-centre, turned ~15 deg off-axis so its face catches
  the key as a sheen rather than a glare. Upper-middle weight.
- **Camera** — eye-level, slightly above the desk plane, ~1.2m back, three-quarter.
- **Lens** — 50mm, f/2.2. Desk edge sharp, back wall soft.
- **Lighting** — hard key upper-back-left raking the desk; soft window fill
  camera-left; the arc practical crossing behind the display.
- **Materials** — honed basalt desktop, anodised aluminium, brushed steel arm.
- **Negative space** — left 20% dark and empty for the mask; upper-left quiet.
- **Blue accent** — the display's own emitted glow, spilling onto the desk. One source.
- **Universe** — the establishing shot; the room the other four are cut from.
- **Aspect/crop** — `2:3`, subject centred ~35% from top.

Variants: **A** wider, more room and arc visible · **B** tighter on the desk,
display dominant · **C** low three-quarter, display against the window plane.

### 02 — SEO

- **Concept** — discovery and measurement as an analytical, quiet space. The
  hardest to keep honest: it must read as analysis **without a single number**.
- **Composition** — a dark desk with a display turned nearly edge-on to camera,
  so its content is a wash of light rather than legible data. Abstract luminous
  line-form rising left-to-right, rendered as a light artefact in the haze.
- **Camera** — slightly below eye-level, looking gently up; ~1.5m back.
- **Lens** — 85mm, f/2.0. Strong background separation.
- **Lighting** — low ambient, key confined to a narrow band across the desk;
  the arc practical is the brightest thing after the screen.
- **Materials** — smoked glass, matte black, a single steel edge.
- **Negative space** — left third genuinely empty; the rising form must not
  cross into it.
- **Blue accent** — the rising line-form itself, emissive. Nothing else blue.
- **Universe** — the same desk as 01, one seat further along, lights lowered.
- **Aspect/crop** — `2:3`, form apex near 30% from top.
- **Extra negatives** — `charts with axis labels, dashboards, graphs with
  numbers, arrows, percentage signs, KPI cards`.

Variants: **A** the light-form as pure atmosphere · **B** screen edge-on with
glow spill only · **C** overhead-ish three-quarter, form reflected in the desk.

### 03 — E-SHOP

- **Concept** — commerce as considered presentation: an unbranded object lit
  like a product, on the same studio surface.
- **Composition** — a plain, unlabelled matte carton or neutral product form on
  a low basalt plinth right-of-centre — deliberately echoing the hero's plinth.
  Shallow depth behind.
- **Camera** — near object-level, slight downward tilt; ~0.8m back.
- **Lens** — 85mm, f/2.5. Product sharp, room dissolving.
- **Lighting** — hard key upper-back-left giving a bright top edge; a soft
  bounce camera-right so the shadow side keeps detail; contact shadow crisp.
- **Materials** — uncoated board, matte black stone, faint surface reflection.
- **Negative space** — left 25% empty falloff; nothing above the object.
- **Blue accent** — a thin blue edge-light on the object's far side only.
- **Universe** — the hero's stone plinth, moved into the services room. The
  most direct visual rhyme with the hero.
- **Aspect/crop** — `2:3`, object centred ~40% from top.
- **Extra negatives** — `brand names, product labels, barcodes, price tags,
  Nike, logos on packaging, shopping cart icons`.

Variants: **A** single object, maximum air · **B** two forms, one behind and
defocused · **C** object with its reflection in a wet-look stone surface.

### 04 — BRANDING

- **Concept** — identity as physical craft: material, ink, weight, impression.
  Not a logo presentation.
- **Composition** — overhead-ish three-quarter of a dark surface carrying
  unprinted materials — uncoated paper stock, a blank foil-blocked card catching
  the key, a folded neutral swatch. Arranged, not scattered.
- **Camera** — high three-quarter, ~50 deg down; ~0.9m back.
- **Lens** — 50mm, f/2.8. Enough depth to hold the whole arrangement.
- **Lighting** — single hard raking key almost parallel to the surface, so the
  paper's tooth and the foil's blocking read as relief. Minimal fill.
- **Materials** — uncoated cotton stock, blind-deboss, brushed foil, black stone.
- **Negative space** — the arrangement occupies the right two-thirds; the left
  is bare lit surface.
- **Blue accent** — one small foil-blocked element catching blue from the arc.
- **Universe** — the same stone surface as 03, seen from above.
- **Aspect/crop** — `2:3`, arrangement centred ~35% from top.
- **Extra negatives** — `printed logos, wordmarks, legible typography,
  mockup templates, business card mockup grid, colour swatch charts`.

Variants: **A** three pieces, very sparse · **B** foil card as hero with stock
beneath · **C** raking light hardened for maximum relief.

### 05 — APPLICATIONS

- **Concept** — a handheld device as a real object in the room, matching how
  the hero treats the laptop: physically present, not a floating mockup.
- **Composition** — a matte black phone standing on the basalt surface,
  right-of-centre, screen turned ~25 deg from camera so it reads as emitted
  light rather than legible UI.
- **Camera** — just below device-top height, level; ~0.6m back.
- **Lens** — 85mm, f/2.0. Device sharp, room heavily soft.
- **Lighting** — key raking the device's edge to define its chamfer; the screen
  is the second source; arc practical far behind, well defocused.
- **Materials** — anodised aluminium, oleophobic glass, black stone.
- **Negative space** — left 30% dark falloff; generous headroom.
- **Blue accent** — the screen's emitted glow only.
- **Universe** — closes the loop with the hero's device treatment: same
  materials, same key direction, smaller object, tighter lens.
- **Aspect/crop** — `2:3`, device top near 25% from top.
- **Extra negatives** — `app icons, home screen grid, legible ui, notification
  badges, apple logo, android logo, hands holding phone`.

Variants: **A** device alone, maximum air · **B** device with soft reflection
in the stone · **C** slightly wider, window plane visible behind.

---

## 5. Execution plan and budget

15 exploratory frames (5 services x 3 variants), then finishing passes.

| Stage | Model | Aspect | Count | Credits |
|---|---|---|---|---|
| Service exploration | `nano_banana_pro` (2 cr) | `2:3` | 15 | 30 |
| Selected finalists, exact size | `seedream_v5_pro --width 900 --height 1342` (3 cr) | — | 5 | 15 |
| **Subtotal** | | | | **45 / 110** |

Leaves 65 credits for hero-video work later (Seedance 2.0 5s 720p = 22.5,
5s 1080p = 45). Prices verified from the CLI, not estimated.

Output layout (per brief section 8):

```
public/generated/elevate/services/
  service-web-01..03  service-seo-01..03  service-eshop-01..03
  service-branding-01..03  service-app-01..03
public/generated/elevate/selected/
```

Candidates stay out of `src/assets/refs/` until chosen. Promotion into the
production plates goes through `scripts/extract-ref-assets.mjs` so the shared
crop box keeps the five frames registered to each other.

## 6. Command shape (DO NOT RUN YET)

```bash
higgsfield generate create nano_banana_pro \
  --prompt "<per-service prompt + shared universe block>" \
  --aspect_ratio 2:3 --resolution 2k --wait
```

## 7. Open questions for the user

1. **Mascot retirement scope** — this plan replaces the mascot on the homepage
   services only. The five source references in `references/` also feed the
   per-service subpages. Should those move too, or stay mascot for now?
2. **Human presence** — all five scenes above are unpeopled, which is the
   safest reading of "no generic stock people". Confirm, or nominate one scene
   where a person genuinely helps.
