import { benchColor } from "@/lib/bench-tokens";

export interface BenchPerforationProps {
  orientation: "horizontal" | "vertical";
  /** Resolved px pitch (from useBenchPitch) — the same number the rail's
   *  frames and the latch use, so a hole always sits between two frames,
   *  never drifts against them. */
  pitchPx: number;
  /** How many holes to draw. Padded a few past the frame count on each side
   *  so the strip still shows perforation at the viewport edges while the
   *  ribbon is mid-travel, rather than visibly running out. */
  count: number;
}

/**
 * The perforation — VISUAL_LANGUAGE §3.2: "rectangular holes, 1px corner
 * rounding … an SVG pattern, not a picture, because it must be crisp at any
 * DPR." A real vector pattern rather than a CSS gradient trick for exactly
 * that reason: gradients approximate rectangles with blurred stops at high
 * zoom, an SVG `<rect>` does not.
 *
 * It lives INSIDE the same transformed strip as the frames (BenchRail passes
 * it through untransformed itself — the parent moves both together): the
 * holes belong to the film stock, so they travel with it, the way sprocket
 * holes are part of a physical reel rather than a fixed backdrop the film
 * passes in front of.
 */
export function BenchPerforation({ orientation, pitchPx, count }: BenchPerforationProps) {
  if (pitchPx <= 0) return null;

  const holeMinor = orientation === "horizontal" ? pitchPx * 0.14 : pitchPx * 0.08;
  const holeMajor = orientation === "horizontal" ? pitchPx * 0.08 : pitchPx * 0.14;
  const trackLength = pitchPx * count;

  const holes = Array.from({ length: count }, (_, i) => {
    const center = i * pitchPx + pitchPx / 2;
    return orientation === "horizontal" ? (
      <rect
        key={i}
        x={center - holeMajor / 2}
        y={0}
        width={holeMajor}
        height={holeMinor}
        rx={1}
        fill={benchColor.stock}
        stroke={benchColor.edge}
        strokeWidth={1}
      />
    ) : (
      <rect
        key={i}
        x={0}
        y={center - holeMajor / 2}
        width={holeMinor}
        height={holeMajor}
        rx={1}
        fill={benchColor.stock}
        stroke={benchColor.edge}
        strokeWidth={1}
      />
    );
  });

  const width = orientation === "horizontal" ? trackLength : holeMinor;
  const height = orientation === "horizontal" ? holeMinor : trackLength;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
      className="pointer-events-none shrink-0"
      style={{ display: "block" }}
    >
      {holes}
    </svg>
  );
}
