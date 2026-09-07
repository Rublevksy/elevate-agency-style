/**
 * Token layer for "THE PRODUCTION STRIP" — the JS/TS mirror of
 * src/styles/bench-foundation.css and src/styles/bench-fonts.css, for the
 * handful of values a component needs as data (inline style objects, rAF
 * math) rather than as a CSS custom property.
 *
 * Nothing here is a new decision: every value traces to one line in
 * docs/creative-rebuild/VISUAL_LANGUAGE.md, CAMERA_SYSTEM.md, MOTION_SYSTEM.md
 * or TYPOGRAPHY.md — see the comment above each group. Where the CSS file and
 * this file both hold a value (paint, rail geometry, motion timings), the CSS
 * custom properties in bench-foundation.css are the ones actually painted;
 * this file exists so a component reading them for JS math (the latch's rAF
 * loop, a computed aria-label) does not re-derive or re-declare the number.
 *
 * `EASE` is imported, not redeclared — CAMERA_SYSTEM §1 / MOTION_SYSTEM §2:
 * one curve in the whole project, and it already lives in
 * @/components/cinematic. No scenes are built on any of this yet (T5+); T2
 * only lays the token layer down.
 */
import { EASE } from "@/components/cinematic";

/** VISUAL_LANGUAGE §1 — Committed color strategy, one paint role per name. */
export const benchColor = {
  /** The one saturated paint: fills, rail, ribbon, flags, marks. */
  ink: "oklch(0.65 0.18 255)",
  /** Second roll of the same paint — the fold's shadow, and the only place
   *  text may sit on ink (contrast ~6.0:1 vs ~2.8:1 on `ink` — CRITIQUE_01 P5). */
  inkDeep: "oklch(0.52 0.16 255)",
  /** True-black film stock, the ground of the whole page. */
  stock: "#07090D",
  /** Raised stock — the box beneath the rail. */
  stockLift: "oklch(0.20 0.012 260)",
  /** The punched window — the only place a foreign photograph may sit. */
  window: "oklch(0.97 0.004 260)",
  /** Wax pencil: crosses, markup, service strokes. */
  wax: "oklch(0.96 0 0)",
  /** Hairline perforation and tick-mark strokes. */
  edge: "oklch(1 0 0 / 14%)",
  /** Text set on `inkDeep` only — never on plain `ink`. */
  onInk: "oklch(0.99 0 0)",
  /** Form errors only. */
  destructive: "oklch(0.62 0.22 27)",
} as const;

/**
 * TYPOGRAPHY.md §2/§7 — one superfamily, two widths, self-hosted from
 * public/fonts/ (see bench-fonts.css). The metric-fallback faces sit between
 * the real family and "Arial Narrow" so `font-display: swap` does not reflow
 * the page (bench-fonts.css §"Metric-fallback faces").
 */
export const benchFont = {
  display:
    '"Fira Sans Extra Condensed", "Fira Sans Extra Condensed Fallback", "Fira Sans Condensed", "Arial Narrow", system-ui, sans-serif',
  text: '"Fira Sans Condensed", "Fira Sans Condensed Fallback", "Arial Narrow", system-ui, sans-serif',
} as const;

/**
 * TYPOGRAPHY.md §4 — rank is carried by role (four of them), not by a size
 * scale. `frameTitle`/`frameBody` are the display/body pair; `slate` and
 * `tick` are the two label roles a "label scale" request maps to (state
 * captions vs. tabular readouts — see TYPOGRAPHY.md §4 for why they differ:
 * `tick` is what sets a client's domain, so it does not go to caps-at-11px the
 * way `slate` does).
 */
export const benchType = {
  frameTitle: {
    fontFamily: benchFont.display,
    fontWeight: 700,
    fontSize: "clamp(2.2rem, 1.2rem + 4.2vw, 5.5rem)",
    letterSpacing: "-0.01em",
    lineHeight: 0.98,
  },
  frameBody: {
    fontFamily: benchFont.text,
    fontWeight: 400,
    fontSize: "1rem",
    letterSpacing: "0",
    lineHeight: 1.55,
  },
  slate: {
    fontFamily: benchFont.text,
    fontWeight: 600,
    fontSize: "0.6875rem",
    letterSpacing: "0.22em",
    /** Below 480px, 0.22em tracking wraps to two lines — found by render,
     *  not assumption (TYPOGRAPHY.md §6). */
    letterSpacingCompact: "0.16em",
    letterSpacingCompactBreakpoint: 480,
    lineHeight: 1,
    textTransform: "uppercase",
  },
  tick: {
    fontFamily: benchFont.text,
    fontWeight: 500,
    fontSize: "0.75rem",
    letterSpacing: "0.14em",
    lineHeight: 1,
    textTransform: "uppercase",
    fontVariantNumeric: "tabular-nums",
  },
} as const;

/**
 * CAMERA_SYSTEM §3/§5, VISUAL_LANGUAGE §6 — the rail's coordinate system.
 * Mirrors the custom properties in bench-foundation.css; kept here too
 * because a future BenchRail's rAF latch (CAMERA_SYSTEM §4) computes
 * `lenta.x` in JS and needs the pitch as a number it can read via
 * `getComputedStyle`, not just as a CSS length no script sees.
 */
export const benchRail = {
  /** clamp(88px, 9vh, 132px) — read the live value via getComputedStyle;
   *  this string is for anywhere a CSS length (not a resolved px number) is
   *  the right shape, e.g. an inline style object. */
  height: "clamp(88px, 9vh, 132px)",
  frameAspect: 4 / 3,
  gapRatio: 0.12, // --bench-gap = --bench-frame * 0.12, bench-foundation.css
  readingWindowDesktop: "62%",
  readingWindowMobile: "50%",
} as const;

/** VISUAL_LANGUAGE §3.2 — perforation geometry, as fractions of the rail so
 *  it scales with --bench-rail-height's clamp() instead of pinning a px value
 *  that goes wrong at either end of it. */
export const benchPerforation = {
  widthRatioOfPitch: 0.08,
  heightRatioOfRail: 0.14,
  radius: "1px",
  insetRatioOfRail: 0.1,
} as const;

/**
 * MOTION_SYSTEM §2-3, CAMERA_SYSTEM §4 — the six-word motion vocabulary's
 * timing constants. `ease` is a re-export, not a new curve (see file header).
 * `latchSmoothing` is explicitly not a curve either — MOTION_SYSTEM §2 calls
 * it "a position filter", the exponential-smoothing factor already proven on
 * the hero's video scrub in HeroCameraPlate.
 */
export const benchMotion = {
  ease: EASE,
  latchSmoothing: 0.18,
  latchSettleMs: 250,
  markMs: 180,
  markStaggerMs: 40,
  liftMs: 420,
} as const;

/**
 * MOTION_SYSTEM §5 — the single cross-page dramaturgy value, `--density`,
 * reproduced here as a lookup table so a future act can read its own number
 * instead of a magic literal living in a component. Not wired to anything
 * yet (no scenes exist before T5); this is the documented source an act will
 * set `--density` from.
 */
export const benchDensity = {
  apparatus: 0.5,
  threadUp: 0.55,
  lineStart: 0.55,
  lineEnd: 0.85,
  lineJointDip: 0.62,
  linePriceFrame: 1.0,
  deliveredRaised: 1.0,
  deliveredHanging: 0.5,
  pause: 0.25,
  assemblyStart: 0.25,
  assemblyEnd: 1.0,
  tailStart: 1.0,
  tailEnd: 0,
} as const;

/**
 * VISUAL_LANGUAGE §3.1 — the one grain layer. `tileSize`/`opacity` mirror
 * bench-foundation.css's `.bench-grain`; `seed` documents the generator's
 * determinism contract (scripts/generate-bench-grain.mjs) rather than
 * controlling anything at runtime.
 */
export const benchGrain = {
  tileSize1x: 256,
  tileSize2x: 512,
  opacity: 0.1,
  seedHex: "0xe1e5a7e",
} as const;

/**
 * VISUAL_LANGUAGE §4 — form has exactly two rules in this world: no radius
 * anywhere except the perforation, and no elevation. `shadow.none` exists so
 * a component reaching for `benchShadow.something` fails loudly in review
 * rather than reaching for `.shadow-ambient`/`.shadow-contact` out of habit
 * (those are legacy tokens, scheduled for removal at the last
 * IMPLEMENTATION_PLAN.md phase, not a resource this world draws from).
 */
export const benchShadow = {
  none: "none",
} as const;

/** VISUAL_LANGUAGE §6 — reuses `container-luxe` (1200px); not redefined. */
export const benchSpacing = {
  containerMaxWidth: 1200,
} as const;
