import { benchColor } from "@/lib/bench-tokens";

export interface BenchLatchProps {
  orientation: "horizontal" | "vertical";
  activeIndex: number;
  frameCount: number;
  /** True once the eased head has snapped exactly onto the target — CAMERA_
   *  SYSTEM §4's invariant made visible: the latch only reads as "locked"
   *  while `lenta.x` (or `.y`) truly is a multiple of the pitch, not while
   *  still easing toward it. */
  settled: boolean;
}

/**
 * The latch is fixed, not the frame. CAMERA_SYSTEM §1: "the camera does not
 * move — the ribbon does." So this renders at the reading window (62%
 * desktop / 50% mobile — CAMERA_SYSTEM §5, `--bench-window-x-desktop` /
 * `--bench-window-y-mobile`) and never carries a transform of its own; the
 * ribbon travels past it. It is the one element in the whole prototype that
 * NEVER interpolates — it only toggles between two states (settled / not),
 * both instant, because a moving latch would mean two things are moving and
 * defeat the point of a fixed reading line.
 */
export function BenchLatch({ orientation, activeIndex, frameCount, settled }: BenchLatchProps) {
  const horizontal = orientation === "horizontal";

  return (
    <div
      className="pointer-events-none absolute z-10 flex items-center justify-center"
      style={
        horizontal
          ? {
              left: "var(--bench-window-x-desktop)",
              top: 0,
              bottom: 0,
              width: 2,
              transform: "translateX(-1px)",
            }
          : {
              top: "var(--bench-window-y-mobile)",
              left: 0,
              right: 0,
              height: 2,
              transform: "translateY(-1px)",
            }
      }
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: settled ? benchColor.ink : benchColor.edge,
          transition: `background-color ${settled ? 180 : 60}ms linear`,
        }}
      />
      <div
        className="bench-tick absolute"
        style={{
          ...(horizontal ? { top: 8, left: 8 } : { top: 8, right: 8 }),
          color: benchColor.wax,
          opacity: 0.7,
          background: benchColor.stock,
          padding: "2px 6px",
        }}
        aria-hidden="true"
      >
        {String(activeIndex + 1).padStart(2, "0")} / {String(frameCount).padStart(2, "0")}
      </div>
    </div>
  );
}
