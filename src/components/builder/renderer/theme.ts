/**
 * DesignSpec → the renderer's concrete design tokens.
 *
 * Every enum in the spec resolves here to a value ELEVATE chose: font stacks
 * that are actually available (self-hosted Inter / Montserrat / Fira Sans
 * Condensed, or system stacks — no third-party font request), type sizes as
 * container-relative clamps, spacing, radii, borders and shadows. Nothing in
 * the spec is ever interpolated into a class name, so the model cannot reach
 * Tailwind, CSS or the DOM through it.
 */
import type { CSSProperties } from "react";
import type { DesignSpec } from "@/lib/builder/spec";

const SERIF = '"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif';
const MONO = 'ui-monospace, "SF Mono", "JetBrains Mono", Menlo, Consolas, monospace';
const INTER = '"Inter", ui-sans-serif, system-ui, sans-serif';

const DISPLAY: Record<
  DesignSpec["typography"]["display"],
  { family: string; tracking: number; size: number }
> = {
  "modern-grotesk": { family: INTER, tracking: -0.035, size: 1 },
  geometric: {
    family: '"Montserrat", "Inter", ui-sans-serif, sans-serif',
    tracking: -0.03,
    size: 0.94,
  },
  "editorial-serif": { family: SERIF, tracking: -0.02, size: 1.08 },
  condensed: {
    family: '"Fira Sans Extra Condensed", "Fira Sans Condensed", "Arial Narrow", sans-serif',
    tracking: -0.01,
    size: 1.22,
  },
  "rounded-humanist": {
    family:
      'ui-rounded, "SF Pro Rounded", "Nunito", "Varela Round", "Segoe UI", system-ui, sans-serif',
    tracking: -0.02,
    size: 0.98,
  },
  mono: { family: MONO, tracking: -0.04, size: 0.84 },
};

const BODY: Record<DesignSpec["typography"]["body"], string> = {
  sans: INTER,
  serif: SERIF,
  mono: MONO,
};

const WEIGHT = { light: 300, regular: 400, semibold: 600, black: 800 } as const;
const TRACK = { tight: -0.02, normal: 0, wide: 0.06 } as const;

/** Headline size as [min px, container %, max px] before the face's own correction. */
const HEADLINE = {
  restrained: [30, 5.2, 66],
  confident: [34, 7, 98],
  monumental: [40, 9.6, 148],
} as const;

const SPACE = { airy: 1.35, balanced: 1, compact: 0.72 } as const;
const RADIUS = { none: 0, subtle: 6, rounded: 18, pill: 999 } as const;

export type Theme = ReturnType<typeof resolveTheme>;

const clamp = (min: number, cqi: number, max: number) =>
  `clamp(${min.toFixed(1)}px, ${cqi.toFixed(2)}cqi, ${max.toFixed(1)}px)`;

function alpha(hex: string, a: number) {
  const n = Math.round(Math.max(0, Math.min(1, a)) * 255)
    .toString(16)
    .padStart(2, "0");
  return `${hex}${n}`;
}

export function resolveTheme(spec: DesignSpec) {
  const p = spec.palette;
  const face = DISPLAY[spec.typography.display];
  const upper = spec.typography.displayCase === "uppercase";
  const k = face.size * (upper ? 0.84 : 1);
  const [hMin, hCqi, hMax] = HEADLINE[spec.typography.scale];
  const s = SPACE[spec.layout.density];
  const radius = RADIUS[spec.surface.radius];
  const tracking = face.tracking + TRACK[spec.typography.tracking] * (upper ? 1.4 : 1);

  const border =
    spec.surface.borders === "none"
      ? "0 solid transparent"
      : spec.surface.borders === "hairline"
        ? `1px solid ${alpha(p.text, 0.14)}`
        : `2px solid ${p.text}`;

  const shadow =
    spec.surface.depth === "flat"
      ? "none"
      : spec.surface.depth === "soft-shadow"
        ? `0 24px 60px -30px ${alpha("#000000", spec.mode === "dark" ? 0.7 : 0.28)}`
        : `0 2px 0 ${alpha(p.text, 0.06)}, 0 36px 80px -40px ${alpha("#000000", spec.mode === "dark" ? 0.8 : 0.35)}`;

  const vars = {
    "--c-bg": p.background,
    "--c-surface": p.surface,
    "--c-text": p.text,
    "--c-muted": p.muted,
    "--c-accent": p.accent,
    "--c-on-accent": p.onAccent,
    "--c-line": alpha(p.text, 0.12),
    "--c-accent-soft": alpha(p.accent, spec.mode === "dark" ? 0.22 : 0.14),
  } as CSSProperties;

  const display: CSSProperties = {
    fontFamily: face.family,
    fontWeight:
      spec.typography.display === "condensed" ? 700 : WEIGHT[spec.typography.displayWeight],
    letterSpacing: `${tracking}em`,
    textTransform: upper ? "uppercase" : "none",
    lineHeight: upper ? 0.98 : spec.typography.display === "editorial-serif" ? 1.02 : 1,
  };

  return {
    spec,
    vars,
    fonts: { display: face.family, body: BODY[spec.typography.body] },
    display,
    size: {
      headline: clamp(hMin * k, hCqi * k, hMax * k),
      h2: clamp(24 * k, hCqi * 0.52 * k, hMax * 0.5 * k),
      h3: clamp(17, 1.55 * k, 26),
      body: clamp(14, 1.18, 18),
      lead: clamp(15, 1.45, 22),
      small: clamp(11, 0.9, 13),
      nav: clamp(12, 0.95, 15),
    },
    space: {
      section: clamp(44 * s, 8.5 * s, 136 * s),
      gutter: clamp(20, 4.2, 64),
      gap: clamp(14 * s, 2.2 * s, 36 * s),
      block: 1 * s,
    },
    maxWidth: spec.layout.width === "contained" ? "min(1120px, 100%)" : "100%",
    radius,
    buttonRadius: spec.surface.radius === "pill" ? 999 : Math.min(radius, 14),
    mediaRadius: spec.surface.radius === "pill" ? 28 : radius,
    border,
    shadow,
    alpha,
  };
}

/** A small deterministic PRNG, so a concept's placeholder compositions never reshuffle between renders. */
export function seeded(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) {
    h ^= key.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 10000) / 10000;
  };
}
