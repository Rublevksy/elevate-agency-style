import { forwardRef } from "react";
import { benchColor, benchType } from "@/lib/bench-tokens";
import { BenchMarker, type BenchFrameState } from "./BenchMarker";
import type { BenchFrameData } from "./frames-data";

export interface BenchFrameLabels {
  pending: string;
  active: string;
  completed: string;
  selected: string;
}

export interface BenchFrameProps {
  frame: BenchFrameData;
  state: BenchFrameState;
  selected: boolean;
  labels: BenchFrameLabels;
  orientation: "horizontal" | "vertical";
  onToggleSelect: (index: number) => void;
  /** CSS length string, e.g. "var(--bench-pitch)" or a resolved px value —
   *  the frame's own box is sized off it, not off a separate literal. */
  size: string;
}

/**
 * One physical frame. A real `<button>`, not a decorative card: T3 §8 asks
 * for a `selected` state distinct from the scroll-derived `active` one, and
 * the only honest way to make that distinction real (not just four colors no
 * interaction ever changes) is to let the visitor actually pick a frame —
 * independent of where the ribbon happens to be. Clicking (or Enter/Space via
 * native button semantics) toggles this frame as the visitor's manual choice;
 * it does not move the ribbon. `aria-pressed` carries that toggle state
 * natively, so no extra `aria-label` bookkeeping is needed on top of it.
 *
 * No radius, no shadow, no filled panel (VISUAL_LANGUAGE §4: "no radius
 * anywhere except perforation", "no elevation"): the frame is a hairline box
 * on the film stock (`stock-lift`), never a card floating above it.
 */
export const BenchFrame = forwardRef<HTMLButtonElement, BenchFrameProps>(function BenchFrame(
  { frame, state, selected, labels, orientation, onToggleSelect, size },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      onClick={() => onToggleSelect(frame.index)}
      className="bench-focus-ring relative flex shrink-0 flex-col justify-between overflow-hidden border text-left"
      style={{
        width: orientation === "horizontal" ? size : "100%",
        height: orientation === "horizontal" ? "100%" : size,
        aspectRatio: orientation === "horizontal" ? "4 / 3" : undefined,
        borderColor: benchColor.edge,
        background: benchColor.stockLift,
        padding: "0.5rem",
        borderRadius: 0,
        boxShadow: "none",
      }}
    >
      {/* Frame index/title uses the `slate` role, not an invented heading
          size: L7 ("rank through cell count") reserves `frameTitle` for the
          scene's own headline — a placeholder frame is not one.
          Pending opacity is 0.55, not an arbitrary dimmer 0.4/0.35: measured
          against `stockLift` via exact OKLCH→sRGB contrast, 0.4 gives 3.55:1
          and 0.35 gives 3.01:1 — both fail WCAG AA's 4.5:1 for normal text.
          0.55 gives 5.60:1, found by computing the curve, not guessing a
          value that "reads as dim". */}
      <span
        className="bench-slate"
        style={{ color: benchColor.wax, opacity: state === "pending" ? 0.55 : 1 }}
      >
        {frame.title}
      </span>
      {/* `lineHeight: 1.3`, not `benchType.frameBody.lineHeight` (1.55): that
          token is tuned for a multi-line paragraph, and at a real frame's
          88-132px height (VISUAL_LANGUAGE §6's rail clamp) a full-height line
          box for one short caption pushed the marker row below the frame's
          own border — confirmed by measurement (critique found it on every
          frame, every state), not a one-off. `overflow`/`textOverflow`/
          `whiteSpace` clip to one line regardless of content length: T3 §2's
          own foundation list asked for "frame clipping" and this is it, not
          an afterthought — the button's `overflow-hidden` is the second half
          of the same fix. */}
      <span
        style={{
          fontFamily: benchType.frameBody.fontFamily,
          fontWeight: benchType.frameBody.fontWeight,
          fontSize: benchType.frameBody.fontSize,
          lineHeight: 1.3,
          color: benchColor.wax,
          opacity: state === "pending" ? 0.55 : 0.7,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {frame.body}
      </span>
      <BenchMarker state={state} selected={selected} labels={labels} />
    </button>
  );
});
