---
name: ELEVATE Digital Studio
description: Incumbent visual system captured from code before the full visual rebuild — evidence and anti-reference, not a target.
colors:
  background: "oklch(0.16 0.02 260)"
  foreground: "oklch(0.985 0 0)"
  surface: "oklch(0.20 0.02 260)"
  surface-elevated: "oklch(0.235 0.022 260)"
  primary: "oklch(0.65 0.18 255)"
  primary-glow: "oklch(0.72 0.16 250)"
  primary-glow-strong: "oklch(0.78 0.19 253)"
  muted: "oklch(0.24 0.02 260)"
  muted-foreground: "oklch(0.78 0.015 260)"
  destructive: "oklch(0.62 0.22 27)"
  border: "oklch(1 0 0 / 8%)"
  input: "oklch(1 0 0 / 10%)"
  stage-black: "#0A0D13"
typography:
  display:
    fontFamily: "Montserrat, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.9rem, 1.2rem + 2.4vw, 3.25rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Montserrat, Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.6rem, 1.1rem + 1.5vw, 2.4rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.625
  label:
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.6875rem"
    fontWeight: 600
    letterSpacing: "0.22em"
rounded:
  sm: "0.5rem"
  md: "0.625rem"
  lg: "0.75rem"
  xl: "1rem"
spacing:
  container-max: "1200px"
  gutter-sm: "1.5rem"
  gutter-lg: "2.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0.95rem 1.6rem"
    typography: "{typography.body}"
  scene-label:
    textColor: "{colors.muted-foreground}"
    typography: "{typography.label}"
---

# DESIGN.md — ELEVATE, incumbent system

> **Status: historical record, captured 2026-09-05 at commit `cb506da` / tag
> `pre-visual-rebuild`.** The owner ruled that this visual direction does not
> meet the quality bar and commissioned a full visual rebuild. This file exists
> so the rebuild has evidence rather than memory: the tokens below are what the
> code actually contains, and the "Don'ts" section records the specific failures
> the new world must not repeat. Treat it as **anti-reference for composition
> and world, and as a preserved source for palette, type scale and motion
> discipline** — those three survived review.

## Overview

A near-black cinematic stage with a single blue accent, one display family and
one easing curve. The system's real strength is its restraint: one accent, one
curve, one type family for display, and a scroll architecture where a single
`useScroll` feeds every section (ADR 0013).

Its failure is not in the tokens. It is that the page carries **three
incompatible visual registers** stitched together:

1. **photoreal** — the hero: a matte-black laptop on cracked stone in a black
   void, shot as product film (`public/media/*.mp4`, `hero-*` plates);
2. **3D-cartoon illustration** — the five service plates: a stylised mascot at a
   desk in a lit office (`svc-*` crops from the user's posters);
3. **flat UI screenshot** — the cases: live captures of client websites.

No camera move can bridge register 1 → register 2. It is a genre cut, not a
scene change, and it is the reason the page reads as "a strong hero followed by
sections" no matter how precisely the joins are engineered. Every other symptom
the owner reacted to descends from this.

## Colors

Near-black ground (`background`, and the sections' own `stage-black` `#0A0D13`),
white text, and exactly one chromatic accent at three strengths: `primary` for
interface, `primary-glow` for ambient light, `primary-glow-strong` reserved for
the hero's arc alone. Everything else is a neutral step of the same hue family
(260), so the page has no second colour to argue with the accent.

`destructive` is the only other hue and appears in form errors only.

**This palette survives the rebuild.** It is disciplined, it is the ELEVATE
brand blue, and it carries the premium-dark read the brief asks for.

## Typography

Two families: **Montserrat** for display (weight 800, tight `-0.02em`, leading
`0.98`), **Inter** for everything else. Three roles in practice:

- `.heading-scene` / `.heading-display` — fluid `clamp()` display, used for
  every section heading and every scene title.
- body — `0.9375rem`–`1rem`, `line-height: 1.625`, at `white/55`–`white/70`.
- `.label-micro` — `0.6875rem`, weight 600, `letter-spacing: 0.22em`, uppercase.
  This is the system's signature: it marks scenes, numbers, rails and captions.

The scale works and is worth keeping. What does not work is that display type
is almost always *beside* the image rather than *in* the frame — the type and
the world occupy separate columns, which is a poster habit, not a film habit.

## Layout

`.container-luxe` — `max-width: 1200px`, gutters `1.5rem` → `2.5rem` at `sm`.
One breakpoint carries the whole design: `lg` (1024px) separates the pinned
cinematic stages from the stacked mobile compositions. Below `lg` every act
un-pins and becomes a vertical sequence; that split is clean and worth keeping.

Sections declare their scroll length in viewports through `useAct(id, {
viewports, pin })` and the page's only `useScroll` lives in `CinematicStage`.
Neighbours size their overlap by asking the register, never by a hand-tuned
`vh` number.

## Elevation & Depth

Depth is **not** shadow-based. It is a four-plane camera rig inside one
`perspective: 1400px`: atmosphere (Z −900), light behind (−560), scene (−250),
light in front (−60), with `depth(z)` pre-compensating the projection so the
frame at rest renders exactly as approved.

Two shadow tiers exist for flat UI (`.shadow-ambient`, `.shadow-contact`) and
one glass surface (`.surface-glass`, restricted to nav and overlays).

**Load-bearing constraint:** grouping properties (`opacity`, `filter`, `mask`)
may only be applied to the rig's outer container. On the rig itself any of them
collapses `preserve-3d` and the camera silently stops being a camera.

## Shapes

Radius scale `0.5` → `1rem`, built off `--radius: 0.75rem`. In the rebuilt
sections radius was progressively removed: the services room, the case reels and
the closing frame carry no radius, no border and no fill at all. Edges dissolve
with **one** radial mask — never two, because Chrome aliases
`-webkit-mask-composite` onto `mask-composite` and an intersection silently
resolves to the wrong operator.

## Components

- **`.btn-primary`** — solid `primary`, `0.625rem` radius, inset ring plus a
  blue-tinted drop shadow, and a sheen that translates across on hover.
- **Scene rail** — a hairline with a `scaleX`/`scaleY` fill bound to act
  progress, dots per beat, each dot a real control that scrolls to its beat.
  This is the system's best invention: a progress indicator that is also
  navigation.
- **Title gate** — a fixed-height masked window through which titles roll, one
  full gate per step, so outgoing and incoming exactly complement. Cross-fade
  was tried here and rejected on screenshot evidence.
- **Scene plate** — `<picture>` webp+jpg with natural dimensions, `priority`
  toggling eager/lazy, mounted only through `SceneImage`.

## Do's and Don'ts

**Do — carried forward into the rebuild**

- One accent colour, three strengths, no second hue.
- One easing curve, `cubic-bezier(0.22, 1, 0.36, 1)`, imported as `EASE`.
- One scroll reading per page; sections take clocks, never their own `useScroll`.
- Motion capability as one decision (`still` / `motion` / `cinematic`), where
  `still` means only `prefers-reduced-motion`.
- `.label-micro` as the scene-marking voice.
- Type stays DOM. Никогда не запекать копию в растр — сайт четырёхъязычный.

**Don't — the failures this file exists to record**

- **Don't mix visual registers.** Photoreal void, cartoon office and flat
  screenshot in one scroll is the incumbent's central defect.
- **Don't put the world in one column and the type in the other.** Beside each
  other they are a poster; the type belongs inside the frame.
- **Don't make a device the protagonist.** The laptop is a prop the studio
  works with, not the thing being sold.
- **Don't frame content in browser chrome, borders or rounded panes.** A picture
  of a browser is not the work.
- **Don't rely on a crop to hide a defect that the asset actually contains.**
  The shared 594x886 service crop carries a third-party mark and baked Czech
  marketing copy; no `top` offset excludes it at that height.
- **Don't show unverified figures as fact** (PRODUCT.md §33).
