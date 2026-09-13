/**
 * DesignSpec — the ONLY thing the language model is allowed to produce.
 *
 *   brief → model → DesignSpecDraft (untrusted JSON)
 *         → parseDesignSpec(): schema validation, sanitising, contrast repair
 *         → DesignSpec (trusted) → ConceptRenderer
 *
 * The model never writes markup, class names, CSS or URLs. Everything that
 * decides how a concept LOOKS is a closed enum the renderer maps to its own
 * components; the only free text is short copy, rendered as React text nodes
 * (never as HTML) after `cleanText`. Colours are the one open value and are
 * re-derived here until they meet WCAG contrast, so a model that proposes
 * grey-on-grey cannot ship an unreadable preview.
 *
 * This module imports nothing but zod, so it runs in the browser, in the
 * server function, and in `scripts/check-builder-spec.ts`.
 */
import { z } from "zod";

/* ------------------------------------------------------------------------ */
/* Vocabulary — every value the renderer knows how to draw                   */
/* ------------------------------------------------------------------------ */

export const ARCHETYPES = [
  "editorial",
  "luxury-minimal",
  "bold-statement",
  "conversion",
  "immersive-visual",
  "technical-precise",
  "warm-human",
  "playful-vivid",
] as const;

export const DISPLAY_FACES = [
  "modern-grotesk",
  "geometric",
  "editorial-serif",
  "condensed",
  "rounded-humanist",
  "mono",
] as const;
export const BODY_FACES = ["sans", "serif", "mono"] as const;
export const TYPE_SCALES = ["restrained", "confident", "monumental"] as const;
export const DISPLAY_WEIGHTS = ["light", "regular", "semibold", "black"] as const;
export const DISPLAY_CASES = ["sentence", "uppercase"] as const;
export const TRACKING = ["tight", "normal", "wide"] as const;

export const NAVIGATIONS = ["bar", "centered-logo", "minimal-menu", "split-cta"] as const;
export const HEROES = [
  "split-media",
  "full-bleed-media",
  "typographic",
  "centered-statement",
  "offset-collage",
  "product-stage",
] as const;
export const GRIDS = ["structured", "asymmetric", "centered"] as const;
export const DENSITIES = ["airy", "balanced", "compact"] as const;
export const WIDTHS = ["contained", "wide"] as const;

export const RADII = ["none", "subtle", "rounded", "pill"] as const;
export const BORDERS = ["none", "hairline", "strong"] as const;
export const DEPTHS = ["flat", "soft-shadow", "layered"] as const;

export const IMAGERY_STYLES = [
  "photography",
  "illustration",
  "abstract-shapes",
  "product-cutout",
  "texture",
  "type-only",
] as const;
export const IMAGERY_TREATMENTS = ["natural", "duotone", "monochrome", "high-contrast"] as const;

export const MOTION_LEVELS = ["calm", "moderate", "expressive"] as const;
export const MOTION_SIGNATURES = [
  "fade-rise",
  "slide-reveal",
  "scale-in",
  "parallax-layers",
] as const;

/**
 * Section kinds. Deliberately absent: testimonials, statistics, pricing, logos,
 * awards, FAQ answers — every one of them would ask the model to invent a
 * business fact (PRODUCT.md §33).
 */
export const SECTION_KINDS = [
  "features",
  "services",
  "showcase",
  "process",
  "story",
  "products",
  "gallery",
  "cta",
] as const;

/* ------------------------------------------------------------------------ */
/* Schema                                                                    */
/* ------------------------------------------------------------------------ */

const hex = z.string().regex(/^#[0-9a-fA-F]{6}$/, "hex colour #RRGGBB");
const text = (min: number, max: number) => z.string().min(min).max(max);

export const SectionSchema = z.object({
  kind: z.enum(SECTION_KINDS),
  eyebrow: text(0, 32).optional(),
  title: text(2, 80),
  body: text(0, 240).optional(),
  items: z
    .array(z.object({ title: text(1, 56), text: text(0, 160) }))
    .max(4)
    .optional(),
});

/** What the model returns for one concept. */
export const DesignSpecDraftSchema = z.object({
  name: text(2, 40),
  archetype: z.enum(ARCHETYPES),
  positioning: text(10, 200),
  rationale: text(20, 360),
  keywords: z.array(text(2, 22)).min(2).max(4),
  palette: z.object({
    background: hex,
    surface: hex,
    text: hex,
    muted: hex,
    accent: hex,
    onAccent: hex,
  }),
  typography: z.object({
    display: z.enum(DISPLAY_FACES),
    body: z.enum(BODY_FACES),
    scale: z.enum(TYPE_SCALES),
    displayWeight: z.enum(DISPLAY_WEIGHTS),
    displayCase: z.enum(DISPLAY_CASES),
    tracking: z.enum(TRACKING),
  }),
  layout: z.object({
    navigation: z.enum(NAVIGATIONS),
    hero: z.enum(HEROES),
    grid: z.enum(GRIDS),
    density: z.enum(DENSITIES),
    width: z.enum(WIDTHS),
  }),
  surface: z.object({
    radius: z.enum(RADII),
    borders: z.enum(BORDERS),
    depth: z.enum(DEPTHS),
  }),
  imagery: z.object({
    style: z.enum(IMAGERY_STYLES),
    treatment: z.enum(IMAGERY_TREATMENTS),
    subject: text(3, 120),
  }),
  motion: z.object({
    level: z.enum(MOTION_LEVELS),
    signature: z.enum(MOTION_SIGNATURES),
  }),
  copy: z.object({
    headline: text(3, 90),
    subheadline: text(0, 220),
    primaryCta: text(2, 28),
    secondaryCta: text(0, 28).optional(),
    nav: z.array(text(1, 18)).min(3).max(5),
  }),
  sections: z.array(SectionSchema).min(3).max(6),
});

export type DesignSpecDraft = z.infer<typeof DesignSpecDraftSchema>;
export type DesignSection = z.infer<typeof SectionSchema>;

/** A trusted concept: a sanitised draft plus identity assigned by ELEVATE, never by the model. */
export type DesignSpec = DesignSpecDraft & {
  id: string;
  /** Increments on every accepted refinement. */
  revision: number;
  /** Derived from the background, not taken from the model. */
  mode: "light" | "dark";
};

export const DesignSpecSchema = DesignSpecDraftSchema.extend({
  id: z.string().regex(/^[a-z0-9-]{4,64}$/),
  revision: z.number().int().min(0).max(999),
  mode: z.enum(["light", "dark"]),
});

/** The tool payload for a first generation: exactly five concepts. */
export const ConceptSetSchema = z.object({
  concepts: z.array(DesignSpecDraftSchema).length(5),
});

/* ------------------------------------------------------------------------ */
/* Sanitising                                                                */
/* ------------------------------------------------------------------------ */

// Numeric performance claims the model may slip into copy: "+180 %", "3x",
// "500+ klientů", "15 let zkušeností". Concepts depict a direction; they must
// not state facts about a business that nobody has verified.
const CLAIM =
  /[+−-]?\d[\d.,]*\s?(?:%|×|x(?!\p{L})|\+)|\d[\d.,]*\s?\+?\s?(?:let|roků|rok|year|лет|год|рок|клиент|клієнт|klient|client|customer|zákazník|projekt|project|проект|проєкт)\p{L}*/giu;

export const hasClaim = (text: string) => {
  CLAIM.lastIndex = 0;
  return CLAIM.test(text);
};

/**
 * Plain, single-line text: no markup characters, no URLs, no control
 * characters, no claims. React escapes on render anyway — this is about what a
 * concept is allowed to SAY, not only about injection.
 */
export function cleanText(input: string, max: number): string {
  return (
    input
      .normalize("NFC")
      // Control characters are exactly what this line exists to remove.
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u001f\u007f\u200b-\u200f\u2028\u2029]/g, " ")
      .replace(/https?:\/\/\S+|www\.\S+/gi, "")
      .replace(/[<>{}`\\]/g, "")
      .replace(/[*_#]{2,}/g, "")
      .split(/(?<=[.!?…])\s+/)
      // A sentence that states a figure goes whole: removing only the number
      // leaves "lepší chuť a zkušeností", which is worse than no sentence.
      .filter((sentence) => !hasClaim(sentence))
      .join(" ")
      .replace(/\s+([,.;:!?])/g, "$1")
      .replace(/\s{2,}/g, " ")
      .replace(/^[\s,.;:–—-]+/, "")
      .trim()
      .slice(0, max)
      .trim()
  );
}

/* ------------------------------------------------------------------------ */
/* Colour                                                                    */
/* ------------------------------------------------------------------------ */

type Rgb = [number, number, number];

const toRgb = (h: string): Rgb => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as Rgb;
const toHex = (c: Rgb) =>
  "#" +
  c
    .map((v) =>
      Math.round(Math.max(0, Math.min(255, v)))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");

export function luminance(h: string): number {
  const [r, g, b] = toRgb(h).map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const mix = (a: string, b: string, t: number) => {
  const [x, y] = [toRgb(a), toRgb(b)];
  return toHex([0, 1, 2].map((i) => x[i] + (y[i] - x[i]) * t) as Rgb);
};

/** Whether dark text reads better than light text on this ground. */
export const isLightGround = (bg: string) => contrast(bg, "#000000") > contrast(bg, "#ffffff");

/** Move `fg` toward black or white (whichever the background needs) until it reads. */
function ensureContrast(fg: string, bg: string, min: number): string {
  if (contrast(fg, bg) >= min) return fg;
  const pole = isLightGround(bg) ? "#000000" : "#ffffff";
  for (let t = 0.1; t <= 1.0001; t += 0.1) {
    const c = mix(fg, pole, t);
    if (contrast(c, bg) >= min) return c;
  }
  return pole;
}

/**
 * A mid-grey ground has no text colour that reaches 7:1 (white and black both
 * stop near 4.5:1), so the ground itself moves toward the nearer extreme first.
 */
function readableGround(bg: string): string {
  const best = (c: string) => Math.max(contrast(c, "#ffffff"), contrast(c, "#000000"));
  if (best(bg) >= 8) return bg;
  const pole = isLightGround(bg) ? "#ffffff" : "#000000";
  for (let t = 0.1; t <= 1.0001; t += 0.1) {
    const c = mix(bg, pole, t);
    if (best(c) >= 8) return c;
  }
  return pole;
}

function repairPalette(p: DesignSpecDraft["palette"]): DesignSpecDraft["palette"] {
  const background = readableGround(p.background.toLowerCase());
  const text = ensureContrast(p.text.toLowerCase(), background, 7);
  const muted = ensureContrast(p.muted.toLowerCase(), background, 4.5);
  // A surface that is indistinguishable from the ground draws no cards at all.
  let surface = p.surface.toLowerCase();
  if (contrast(surface, background) < 1.06) surface = mix(background, text, 0.06);
  const accent = p.accent.toLowerCase();
  const onAccent =
    contrast(p.onAccent, accent) >= 4.5
      ? p.onAccent.toLowerCase()
      : contrast("#ffffff", accent) >= contrast("#0b0b0f", accent)
        ? "#ffffff"
        : "#0b0b0f";
  return { background, surface, text, muted, accent, onAccent };
}

/* ------------------------------------------------------------------------ */
/* Parse                                                                     */
/* ------------------------------------------------------------------------ */

export type SpecIssue = { path: string; message: string };

function sanitizeDraft(d: DesignSpecDraft): DesignSpecDraft {
  const t = cleanText;
  const sections = d.sections
    .map((s) => ({
      kind: s.kind,
      eyebrow: s.eyebrow ? t(s.eyebrow, 32) || undefined : undefined,
      title: t(s.title, 80),
      body: s.body ? t(s.body, 240) || undefined : undefined,
      items: s.items
        ?.map((it) => ({ title: t(it.title, 56), text: t(it.text, 160) }))
        .filter((it) => it.title.length > 0),
    }))
    .filter((s) => s.title.length >= 2);
  return {
    ...d,
    name: t(d.name, 40),
    positioning: t(d.positioning, 200),
    rationale: t(d.rationale, 360),
    keywords: d.keywords.map((k) => t(k, 22)).filter(Boolean),
    palette: repairPalette(d.palette),
    imagery: { ...d.imagery, subject: t(d.imagery.subject, 120) },
    copy: {
      headline: t(d.copy.headline, 90),
      subheadline: t(d.copy.subheadline, 220),
      primaryCta: t(d.copy.primaryCta, 28),
      secondaryCta: d.copy.secondaryCta ? t(d.copy.secondaryCta, 28) || undefined : undefined,
      nav: d.copy.nav.map((n) => t(n, 18)).filter(Boolean),
    },
    sections,
  };
}

/**
 * Untrusted model output → trusted draft, or the list of reasons it was
 * rejected (fed back to the model on the single repair attempt).
 */
export function parseDraft(
  raw: unknown,
  { rejectClaims = false }: { rejectClaims?: boolean } = {},
): { ok: true; draft: DesignSpecDraft } | { ok: false; issues: SpecIssue[] } {
  const first = DesignSpecDraftSchema.safeParse(raw);
  if (!first.success) return { ok: false, issues: zodIssues(first.error) };
  // On a first answer, a figure in the copy is sent back to be rewritten; on the
  // repair answer (or stored data) the claiming sentences are dropped instead.
  if (rejectClaims) {
    const claims = findClaims(first.data);
    if (claims.length > 0) return { ok: false, issues: claims };
  }
  // Sanitising can empty a field (a headline that was only a claim); validate again.
  const second = DesignSpecDraftSchema.safeParse(sanitizeDraft(first.data));
  if (!second.success) return { ok: false, issues: zodIssues(second.error) };
  return { ok: true, draft: second.data };
}

/** Every copy field that states a figure (percentages, "15 let", "500+ klientů"). */
export function findClaims(d: DesignSpecDraft): SpecIssue[] {
  const fields: [string, string | undefined][] = [
    ["positioning", d.positioning],
    ["rationale", d.rationale],
    ["copy.headline", d.copy.headline],
    ["copy.subheadline", d.copy.subheadline],
    ...d.sections.flatMap((sec, i): [string, string | undefined][] => [
      [`sections[${i}].title`, sec.title],
      [`sections[${i}].body`, sec.body],
      ...(sec.items ?? []).flatMap((it, k): [string, string | undefined][] => [
        [`sections[${i}].items[${k}].title`, it.title],
        [`sections[${i}].items[${k}].text`, it.text],
      ]),
    ]),
  ];
  return fields
    .filter(([, v]) => v && hasClaim(v))
    .map(([path]) => ({
      path,
      message:
        "states a figure (percentage, years, counts); the business has not verified it — rewrite without numbers",
    }));
}

export function toSpec(draft: DesignSpecDraft, id: string, revision = 0): DesignSpec {
  return {
    ...draft,
    id,
    revision,
    mode: isLightGround(draft.palette.background) ? "light" : "dark",
  };
}

/** Re-validate a spec that has been stored in the browser before rendering it again. */
export function parseStoredSpec(raw: unknown): DesignSpec | null {
  const parsed = DesignSpecSchema.safeParse(raw);
  if (!parsed.success) return null;
  const again = parseDraft(parsed.data);
  if (!again.ok) return null;
  return toSpec(again.draft, parsed.data.id, parsed.data.revision);
}

function zodIssues(error: z.ZodError): SpecIssue[] {
  return error.issues.slice(0, 20).map((i) => ({ path: i.path.join("."), message: i.message }));
}

/* ------------------------------------------------------------------------ */
/* Distinctness                                                              */
/* ------------------------------------------------------------------------ */

/** The structural dimensions two concepts are compared on. Colour alone never counts. */
const signature = (d: DesignSpecDraft) => [
  d.archetype,
  d.layout.hero,
  d.layout.navigation,
  d.layout.grid,
  d.layout.density,
  d.typography.display,
  d.surface.radius,
  d.imagery.style,
  isLightGround(d.palette.background) ? "light" : "dark",
];

export const MIN_PAIR_DIFFERENCES = 4;

/**
 * Five concepts are accepted only if they are five directions, not one layout
 * recoloured: unique archetypes, at least four hero layouts and three display
 * faces between them, and every pair differing on at least four of nine
 * structural dimensions.
 */
export function assessDistinctness(drafts: DesignSpecDraft[]): SpecIssue[] {
  const issues: SpecIssue[] = [];
  const archetypes = new Set(drafts.map((d) => d.archetype));
  if (archetypes.size !== drafts.length)
    issues.push({
      path: "concepts.archetype",
      message: "every concept needs a different archetype",
    });
  if (new Set(drafts.map((d) => d.layout.hero)).size < Math.min(4, drafts.length))
    issues.push({
      path: "concepts.layout.hero",
      message: "use at least four different hero layouts",
    });
  if (new Set(drafts.map((d) => d.typography.display)).size < Math.min(3, drafts.length))
    issues.push({
      path: "concepts.typography.display",
      message: "use at least three different display faces",
    });
  const sigs = drafts.map(signature);
  for (let a = 0; a < sigs.length; a++)
    for (let b = a + 1; b < sigs.length; b++) {
      const diff = sigs[a].filter((v, i) => v !== sigs[b][i]).length;
      if (diff < MIN_PAIR_DIFFERENCES)
        issues.push({
          path: `concepts[${a}]~concepts[${b}]`,
          message: `concepts ${a + 1} and ${b + 1} differ on only ${diff} structural dimensions; make them different directions, not variations`,
        });
    }
  return issues;
}
