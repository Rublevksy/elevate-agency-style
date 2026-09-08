import { benchColor } from "@/lib/bench-tokens";

export interface BenchLatchProps {
  orientation: "horizontal" | "vertical";
  activeIndex: number;
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
 * ribbon travels past it.
 *
 * T5: no longer carries its own position counter. `BenchApparatusEdge`
 * (Scene 00) is now the one canonical position readout — a second "0X/06"
 * text box sitting right at the reading line duplicated it and, once Scene
 * 00's edge bar existed above it, visually collided with it (found by
 * screenshot: the two overlapped at the top of the stage). The latch's own
 * job was always narrower than the box it was carrying: BE the reading
 * line, not report a number too. Level 2 (physical marks) staying quiet so
 * Level 3 (typography) doesn't have two competing sources is T5 §9's own
 * hierarchy rule, applied to this component specifically.
 *
 * It still gets exactly one motion: T4 item 8's "active: минимальное
 * физическое подтверждение" — a one-shot, non-looping scale tick
 * (`.bench-latch-confirm`, now on the line itself, not a removed counter)
 * that fires the instant `settled` flips true onto a NEW frame, never while
 * still easing and never on a re-render that lands on the same frame it was
 * already on.
 *
 * z-index is 1 for `vertical` (mobile), 10 for `horizontal` (desktop) — not
 * the same number for both. Mobile's window sits at the container's CENTER
 * (T3's fix ties the scroll-snap invariant to that point), so at rest the
 * line necessarily crosses the middle of the active frame's own box, not an
 * edge. At z-10 it painted over the frame's content — a line visibly
 * slicing through "not A1"/"ACTIVE" (Assessment A, T5, confirmed by
 * screenshot). BenchFrame.tsx now paints vertical-orientation frames at
 * z-2, above this z-1 line, so the frame's opaque body covers it wherever
 * they overlap and it only shows in the gaps between frames — which is
 * where a physical line crossing a strip actually would be visible.
 * Desktop's window sits at a frame's LEFT EDGE, never inside one, so it
 * keeps its original z-10 and was never part of this problem.
 */
export function BenchLatch({ orientation, activeIndex, settled }: BenchLatchProps) {
  const horizontal = orientation === "horizontal";

  return (
    <div
      className={`pointer-events-none absolute flex items-center justify-center ${horizontal ? "z-10" : "z-[1]"}`}
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
        key={settled ? `settled-${activeIndex}` : "moving"}
        className={settled ? "bench-latch-confirm" : undefined}
        style={{
          position: "absolute",
          inset: 0,
          background: settled ? benchColor.ink : benchColor.edge,
          transition: `background-color ${settled ? 180 : 60}ms linear`,
        }}
      />
    </div>
  );
}
