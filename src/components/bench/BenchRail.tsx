import { forwardRef } from "react";
import { BenchFrame, type BenchFrameLabels } from "./BenchFrame";
import { BenchPerforation } from "./BenchPerforation";
import type { BenchFrameState } from "./BenchMarker";
import type { BenchFrameData } from "./frames-data";

export interface BenchRailProps {
  orientation: "horizontal" | "vertical";
  frames: BenchFrameData[];
  frameStates: BenchFrameState[];
  selectedIndex: number | null;
  labels: BenchFrameLabels;
  pitchPx: number;
  onToggleSelect: (index: number) => void;
  frameRefs?: React.MutableRefObject<(HTMLButtonElement | null)[]>;
  /** CSS length for one frame's own box on its travel axis — `--bench-frame`,
   *  NOT `--bench-pitch`: the pitch is frame+gap (CAMERA_SYSTEM §3), so
   *  sizing a frame to the full pitch would leave no room for the gap
   *  perforation sits in between frames. A resolved px string on desktop
   *  (matches the JS latch math exactly), `var(--bench-frame)` on
   *  mobile/reduced-motion. */
  frameSize: string;
  /** The space between consecutive frames — `--bench-gap`, so
   *  `frameSize + gap === pitch`, the same identity bench-foundation.css's
   *  `calc()` already encodes. */
  gap: string;
  /** Snap-scroll children need `scroll-snap-align` on their own box, which
   *  BenchFrame's own markup does not know about — the mobile caller sets
   *  this so BenchRail stays orientation-aware without being scroll-
   *  mechanism-aware. `"center"`, not `"start"`: the reading line sits at
   *  the container's 50% mark (CAMERA_SYSTEM §5, `--bench-window-y-mobile`),
   *  and the IntersectionObserver in Bench.tsx watches a band at that same
   *  50% mark — a `"start"` snap put the active frame at the CONTAINER's
   *  top edge while the observer watched its CENTER, so the two systems
   *  disagreed about where "active" was, and the last frame could never
   *  reach the observer's band at all (critique-found, reproducible: the
   *  counter stuck at "05/06" no matter how far the container scrolled). */
  snapAlign?: "center";
  className?: string;
}

/**
 * The physical strip — perforation plus frames, laid out on one axis. It owns
 * geometry and presentation only. It never touches scroll: the desktop
 * caller mutates its own ref's `transform` from an imperative rAF loop
 * (Bench.tsx), the mobile caller wraps it in a native `scroll-snap-type`
 * container and lets the browser move it — BenchRail is the same component
 * either way because the frames themselves do not know which is happening.
 *
 * Perforation runs on both edges of the tape (VISUAL_LANGUAGE §3.2 —
 * "по краям ленты", plural), as two bands in NORMAL FLOW flanking the frame
 * row — not absolutely positioned over it. An earlier version tried the
 * absolute-overlay approach and most of the strip ended up hidden behind the
 * frames' own opaque background, since both shared the same box; three plain
 * flex children (perf / frames / perf) cannot overlap by construction.
 */
export const BenchRail = forwardRef<HTMLDivElement, BenchRailProps>(function BenchRail(
  {
    orientation,
    frames,
    frameStates,
    selectedIndex,
    labels,
    pitchPx,
    onToggleSelect,
    frameRefs,
    frameSize,
    gap,
    snapAlign,
    className,
  },
  ref,
) {
  const horizontal = orientation === "horizontal";
  const perforationPad = 1; // holes past each visible edge, so the strip never visibly runs out mid-travel
  const perforationCount = frames.length + perforationPad * 2;
  // Breathing room between each perforation band and the frame row — a
  // layout choice for this prototype, not a documented token.
  const bandGap = 6;

  return (
    <div
      ref={ref}
      className={`flex ${horizontal ? "flex-col" : "flex-row"} ${className ?? ""}`}
      style={{ willChange: "auto", gap: bandGap }}
    >
      <div
        style={
          horizontal
            ? { marginLeft: -perforationPad * pitchPx }
            : { marginTop: -perforationPad * pitchPx }
        }
      >
        <BenchPerforation orientation={orientation} pitchPx={pitchPx} count={perforationCount} />
      </div>
      <div className={`flex ${horizontal ? "flex-row items-stretch" : "flex-col"}`} style={{ gap }}>
        {frames.map((frame, i) => (
          <div
            key={frame.index}
            style={{
              flex: `0 0 ${frameSize}`,
              scrollSnapAlign: snapAlign,
              display: "flex",
            }}
          >
            <BenchFrame
              ref={(el) => {
                if (frameRefs) frameRefs.current[i] = el;
              }}
              frame={frame}
              state={frameStates[i]}
              selected={selectedIndex === i}
              labels={labels}
              orientation={orientation}
              onToggleSelect={onToggleSelect}
              size="100%"
            />
          </div>
        ))}
      </div>
      <div
        style={
          horizontal
            ? { marginLeft: -perforationPad * pitchPx }
            : { marginTop: -perforationPad * pitchPx }
        }
      >
        <BenchPerforation orientation={orientation} pitchPx={pitchPx} count={perforationCount} />
      </div>
    </div>
  );
});
