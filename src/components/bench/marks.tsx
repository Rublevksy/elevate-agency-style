import { benchColor, benchMark } from "@/lib/bench-tokens";

/**
 * The five state marks of "THE PRODUCTION STRIP" — VISUAL_LANGUAGE §5, built
 * for real at T4 (T3 used ad-hoc geometry: a checkmark path, two circles).
 * One geometric system, not five separate icons:
 *
 *   - one 16×16 viewBox for all five (`benchMark.viewBox`)
 *   - one stroke width for all of them (`benchMark.strokeWidth`)
 *   - no radius except where VISUAL_LANGUAGE §4 explicitly allows it
 *     (the perforation notches inside STRIP)
 *   - no fill except `ink`, and only where a mark is actively "hot"
 *     (FLAG filled = active) — VISUAL_LANGUAGE §1's "one committed color"
 *     rule applies to marks exactly as it applies to everything else: a
 *     mark that filled itself with color regardless of state would spend
 *     the one accent on five things at once and mean nothing by any of them
 *   - no glow, no gradient, no bevel, no drop shadow — a mark is a stroke on
 *     film stock, not a UI icon with depth
 *
 * SEMANTIC MAPPING (T4, adapting VISUAL_LANGUAGE §5's original five without
 * changing its law — see the file-level note in that section: T4 owns
 * resolving whether the marks read correctly, not whether the law holds):
 *
 *   completed            -> CROSS
 *   flow / in progress   -> STRIP
 *   active AND selected  -> FLAG (filled = active, outline = selected only)
 *   pending / deferred   -> PIN
 *   evidence / artifact  -> PUNCHED CORNER
 *
 * THE CROSS'S OPEN QUESTION (VISUAL_LANGUAGE §5's own words: "проверяется на
 * T4... если не читается — знак заменяется"). A symmetric X reads as
 * cancel/close to thirty years of interface convention, so this is not an X:
 * it is a checkmark, the same shape T3 already used for "completed" before
 * this file existed. A checkmark carries no such ambiguity, it is still a
 * plausible grease-pencil mark on a real work print, and it is never shown
 * without its own visible text caption (BenchMarker) — three independent
 * reasons the reading is not left to the glyph alone.
 */

const VB = benchMark.viewBox;
const SW = benchMark.strokeWidth;

export interface MarkProps {
  className?: string;
  /** Skip the one-shot reveal transition — set for `prefers-reduced-motion`
   *  (item 8: "no decorative animation, meaning fully preserved") and for
   *  the reduced-motion list's already-static frames. */
  instant?: boolean;
  "aria-hidden"?: boolean;
}

/** completed — a checkmark, drawn as two strokes revealed left-to-right with
 *  a 40ms stagger (MOTION_SYSTEM §6's exact spec for this mark: "два штриха,
 *  clip-path слева направо, 180мс, с задержкой 40мс между штрихами" —
 *  `benchMotion.markMs`/`markStaggerMs`, not new numbers). */
export function CrossMark({ className, instant, ...rest }: MarkProps) {
  return (
    <svg
      width={benchMark.renderSize}
      height={benchMark.renderSize}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      className={className}
      aria-hidden={rest["aria-hidden"] ?? true}
    >
      <path
        d="M3.5 8.7L6.6 11.6"
        stroke={benchColor.wax}
        strokeWidth={SW}
        strokeLinecap="square"
        className={instant ? undefined : "bench-mark-stroke"}
      />
      <path
        d="M6.6 11.6L12.5 4.6"
        stroke={benchColor.wax}
        strokeWidth={SW}
        strokeLinecap="square"
        className={instant ? undefined : "bench-mark-stroke bench-mark-stroke-delay"}
      />
    </svg>
  );
}

/** flow / in progress — a short length of tape: an outline with perforation
 *  notches cut into it, same geometry BenchPerforation uses elsewhere (a
 *  rectangular hole, `stock`-filled so it reads as absence, not a second
 *  color). Structural, not a per-frame state — see BenchLatch.tsx for where
 *  this is used and why it is `aria-hidden`.
 *
 *  Critique-found: the first version's two thin notches collapsed to an
 *  unreadable dash at 14px next to the frame counter — the one mark that
 *  didn't execute its own material metaphor (Assessment A). Taller strip
 *  (6px, not 4px), three notches instead of two so the perforation rhythm
 *  reads as a rhythm rather than two stray marks, and each notch is wider
 *  relative to the strip — the same "make it bigger, not a new stroke
 *  weight" fix PinMark got, applied to area instead of a single circle. */
export function StripMark({ className, "aria-hidden": ariaHidden = true }: MarkProps) {
  return (
    <svg
      width={benchMark.renderSize}
      height={benchMark.renderSize}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      className={className}
      aria-hidden={ariaHidden}
    >
      <rect x="1" y="5" width="14" height="6" stroke={benchColor.edge} strokeWidth={SW} />
      <rect x="3" y="6.4" width="2.1" height="3.2" rx="0.5" fill={benchColor.stock} />
      <rect x="6.95" y="6.4" width="2.1" height="3.2" rx="0.5" fill={benchColor.stock} />
      <rect x="10.9" y="6.4" width="2.1" height="3.2" rx="0.5" fill={benchColor.stock} />
    </svg>
  );
}

export interface FlagMarkProps extends MarkProps {
  /** true = active (the ribbon is physically here — filled with `ink`,
   *  VISUAL_LANGUAGE §5's "ты здесь"). false = selected-only (the visitor's
   *  manual pick, independent of scroll position — outline, `wax` only, no
   *  `ink` anywhere in it). Per VISUAL_LANGUAGE §5, the flag never animates
   *  its own entrance: "он едет вместе с лентой, потому что он и есть
   *  позиция" — it is a position, not an event, so it only ever appears or
   *  disappears instantly.
   *
   *  Critique-found: an earlier version kept `ink` on the selected pennant's
   *  outline, so active (solid ink) and selected (ink-outlined) converged to
   *  "a blue flag" either way at 14px — confirmed by Assessment A's zoomed
   *  screenshots. `ink` now means exactly one thing, "the ribbon is
   *  physically here," and nothing else — the distinction is a full color
   *  family (blue vs. neutral), not a fill/outline nuance of the same one. */
  filled: boolean;
}

/** active / selected — a pole and a pennant. */
export function FlagMark({ filled, className, "aria-hidden": ariaHidden }: FlagMarkProps) {
  const color = filled ? benchColor.ink : benchColor.wax;
  return (
    <svg
      width={benchMark.renderSize}
      height={benchMark.renderSize}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      className={className}
      aria-hidden={ariaHidden ?? true}
    >
      <path d="M4 2.5V14" stroke={color} strokeWidth={SW} strokeLinecap="square" />
      <path
        d="M4 3L12 5L4 7Z"
        fill={filled ? color : "none"}
        stroke={filled ? "none" : color}
        strokeWidth={filled ? 0 : SW}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** pending / deferred — a shaft and a rounded head, cut at the tip. Fixed;
 *  no motion (VISUAL_LANGUAGE §5: "обязателен на каждом обрезке, иначе
 *  половинная плотность прочитается как «недоступно»" — a pin is a promise
 *  the item is reachable, not a fainter version of nothing). */
export function PinMark({ className, "aria-hidden": ariaHidden = true }: MarkProps) {
  return (
    <svg
      width={benchMark.renderSize}
      height={benchMark.renderSize}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      className={className}
      aria-hidden={ariaHidden}
    >
      {/* Head fill is white at 40% alpha, not `benchColor.edge` (14%): 14%
          gives ~1.51:1 against `stockLift`, under WCAG 1.4.11's 3:1 for a
          meaningful graphical mark. An earlier pass used 33%, the exact
          minimum (3.005:1) — Assessment B's critique recomputed that
          independently and flagged it as too thin a margin to survive
          rounding or a different renderer's color math. 40% gives 3.825:1,
          the same kind of safety margin already used for the pending-text
          opacity fix in BenchFrame.tsx (0.48 minimum, shipped at 0.55).
          Radius is 2.9, not the original 2.4: Assessment A separately flagged
          this as the visually weakest mark for the statistically most common
          state (a young strip is mostly PENDING). More head area, not a
          thicker stroke — thickening would break the one-stroke-weight rule
          every mark in this file otherwise holds to. */}
      <circle cx="8" cy="4.2" r="2.9" fill="oklch(1 0 0 / 40%)" />
      <path
        d="M8 6.6V12.5L6.3 14.5"
        stroke={benchColor.wax}
        strokeWidth={SW}
        strokeLinecap="square"
      />
    </svg>
  );
}

/** evidence / client artifact — a corner bracket with its own corner
 *  chamfered off. Structural (VISUAL_LANGUAGE's "window" material, §1/§3.4),
 *  not a per-frame state: every frame carries it identically, marking "this
 *  box is where outside evidence is allowed to sit" rather than
 *  distinguishing one frame from another — see BenchFrame.tsx. */
export function PunchedCornerMark({ className, "aria-hidden": ariaHidden = true }: MarkProps) {
  return (
    <svg
      width={benchMark.renderSize}
      height={benchMark.renderSize}
      viewBox={`0 0 ${VB} ${VB}`}
      fill="none"
      className={className}
      aria-hidden={ariaHidden}
    >
      <path
        d="M2 6V3.2L4.8 2H14V11.2L12.8 14H2V6Z"
        stroke={benchColor.edge}
        strokeWidth={SW}
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * The reusable primitive item 4 asks for — not the small glyph above, the
 * actual clip-path a future window/screenshot wrapper chamfers its corner
 * with. No client screenshot is wired to this yet (ASSET_PLAN.md gates real
 * imagery behind owner approval); this only proves the shape is a real,
 * reusable value rather than geometry copy-pasted wherever it is next
 * needed.
 */
export function punchedCornerClipPath(
  cutPx: number,
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right" = "top-right",
): string {
  switch (corner) {
    case "top-right":
      return `polygon(0 0, calc(100% - ${cutPx}px) 0, 100% ${cutPx}px, 100% 100%, 0 100%)`;
    case "top-left":
      return `polygon(${cutPx}px 0, 100% 0, 100% 100%, 0 100%, 0 ${cutPx}px)`;
    case "bottom-right":
      return `polygon(0 0, 100% 0, 100% calc(100% - ${cutPx}px), calc(100% - ${cutPx}px) 100%, 0 100%)`;
    case "bottom-left":
      return `polygon(0 0, 100% 0, 100% 100%, ${cutPx}px 100%, 0 calc(100% - ${cutPx}px))`;
  }
}
