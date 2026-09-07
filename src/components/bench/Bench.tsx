import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAct, useReducedScene } from "@/components/cinematic";
import { benchColor, benchMotion, benchRail as benchRailTokens } from "@/lib/bench-tokens";
import { BENCH_FRAMES, FRAME_COUNT } from "./frames-data";
import { useBenchPitch } from "./useBenchPitch";
import { useIsDesktopRail } from "./useIsDesktopRail";
import { BenchRail } from "./BenchRail";
import { BenchLatch } from "./BenchLatch";
import type { BenchFrameState } from "./BenchMarker";
import type { BenchFrameLabels } from "./BenchFrame";

/**
 * T3 mechanical prototype — "does the ribbon feel like one physical object
 * the visitor pulls through a sequence of states."
 *
 * Three genuinely different mechanics share the same presentational pieces
 * (BenchRail/BenchFrame/BenchPerforation/BenchMarker):
 *
 *   DESKTOP (>=1024px, not reduced motion) — the section pins (CinematicStage
 *   + useAct, ADR 0013 — no second useScroll), and one rAF loop eases the
 *   rail's own `transform` toward the frame nearest `act.progress`
 *   (CAMERA_SYSTEM §4's formula). This is the only branch with continuous
 *   interpolation and the only one `will-change: transform` ever touches.
 *
 *   MOBILE (<1024px, not reduced motion) — T3 §9 asks for the desktop
 *   mechanic NOT to be shrunk down, and for "scrolling остаётся естественным"
 *   (item 5 separately bans scroll-jacking). So mobile does not pin at all:
 *   it is a normal-flow nested list with native CSS `scroll-snap-type`. The
 *   y-invariant (§6/§9) is enforced by the browser's snap algorithm, not by
 *   JS math — there is no floating-point drift to guard against because
 *   nothing here computes a position.
 *
 *   REDUCED MOTION (`still`, from `useReducedScene`) — CAMERA_SYSTEM §7: no
 *   pin, no transform, no scroll-snap, every frame laid out and fully
 *   readable in one pass. This is the ONLY branch keyed strictly off the
 *   visitor's own `prefers-reduced-motion` setting, per MOTION_SYSTEM's rule
 *   that `still` is never reached by a device heuristic.
 */

const VIEWPORTS_PER_FRAME = 0.6;
const BENCH_VIEWPORTS = FRAME_COUNT * VIEWPORTS_PER_FRAME;
const BENCH_PIN = 0.88;
const SNAP_EPSILON_PX = 0.5;

const LABELS: BenchFrameLabels = {
  pending: "PENDING",
  active: "ACTIVE",
  completed: "COMPLETED",
  selected: "SELECTED",
};

/** Static demo distribution for the reduced-motion list — nothing scrubs
 *  there, so there is no scroll-derived "current" frame to compute; this
 *  exists purely so all three scroll-derived states are visible and legible
 *  without motion, per CAMERA_SYSTEM §7. */
const REDUCED_STATES: BenchFrameState[] = [
  "completed",
  "completed",
  "active",
  "pending",
  "pending",
  "pending",
];

export function Bench() {
  const act = useAct("bench", { viewports: BENCH_VIEWPORTS, pin: BENCH_PIN });
  const reducedScene = useReducedScene();
  const isDesktop = useIsDesktopRail();
  const { probeRef, pitch } = useBenchPitch();

  const railRef = useRef<HTMLDivElement>(null);
  const desktopFrameRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileFrameRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [settled, setSettled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const onToggleSelect = useCallback((i: number) => {
    setSelectedIndex((prev) => (prev === i ? null : i));
  }, []);

  // ---- DESKTOP: rAF-eased latch --------------------------------------------
  const headRef = useRef(0);
  const lastIndexRef = useRef(0);
  const lastSettledRef = useRef(true);

  useEffect(() => {
    if (!isDesktop || reducedScene || pitch <= 0) return;
    const rail = railRef.current;
    if (!rail) return;

    let raf = 0;
    const tick = () => {
      const p = Math.min(Math.max(act.progress.get(), 0), 1);
      const targetIndex = Math.min(Math.max(Math.round(p * (FRAME_COUNT - 1)), 0), FRAME_COUNT - 1);
      const targetPx = -targetIndex * pitch;

      const eased = headRef.current + (targetPx - headRef.current) * benchMotion.latchSmoothing;
      const isSettled = Math.abs(targetPx - eased) < SNAP_EPSILON_PX;
      // Snap exactly on settle — this is the invariant (CAMERA_SYSTEM §4):
      // repeated exponential smoothing approaches the target but never
      // floating-point-equals it on its own, so the last step is an explicit
      // assignment, not a hope that addition converges exactly.
      headRef.current = isSettled ? targetPx : eased;

      rail.style.transform = `translate3d(${headRef.current}px, 0, 0)`;
      // will-change only while actually easing (MOTION_SYSTEM §7) — removed
      // at rest, not left on for the section's whole lifetime.
      rail.style.willChange = isSettled ? "auto" : "transform";

      if (targetIndex !== lastIndexRef.current) {
        lastIndexRef.current = targetIndex;
        setActiveIndex(targetIndex);
      }
      if (isSettled !== lastSettledRef.current) {
        lastSettledRef.current = isSettled;
        setSettled(isSettled);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isDesktop, reducedScene, pitch, act.progress]);

  // ---- MOBILE: native scroll-snap + IntersectionObserver ------------------
  useEffect(() => {
    if (isDesktop || reducedScene) return;
    const root = mobileScrollRef.current;
    if (!root) return;
    // A single observer, not a scroll listener (T3 §11): the browser tells
    // us which frame crosses the reading line instead of us polling
    // scrollTop on every frame.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const idx = mobileFrameRefs.current.indexOf(entry.target as HTMLButtonElement);
          if (idx !== -1 && idx !== lastIndexRef.current) {
            lastIndexRef.current = idx;
            setActiveIndex(idx);
          }
        }
      },
      // A thin band at the reading line (--bench-window-y-mobile = 50%):
      // shrinking top+bottom margins to -49% leaves a ~2%-tall detection
      // strip at the container's vertical center.
      { root, rootMargin: "-49% 0px -49% 0px", threshold: 0 },
    );
    for (const el of mobileFrameRefs.current) if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [isDesktop, reducedScene, pitch]);

  const frameStates: BenchFrameState[] = useMemo(
    () =>
      BENCH_FRAMES.map((f) =>
        f.index < activeIndex ? "completed" : f.index === activeIndex ? "active" : "pending",
      ),
    [activeIndex],
  );

  const framePx = pitch / (1 + benchRailTokens.gapRatio);
  const gapPx = pitch - framePx;

  const probe = (
    <div
      ref={probeRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        width: "var(--bench-pitch)",
        height: 0,
        visibility: "hidden",
        pointerEvents: "none",
      }}
    />
  );

  // ---- REDUCED MOTION: plain vertical list, no rail mechanics -------------
  if (reducedScene) {
    return (
      <section
        ref={act.ref}
        aria-label="Production strip prototype — reduced motion, full sequence"
        className="relative w-full px-4 py-12 sm:px-8"
        style={{ background: benchColor.stock }}
      >
        {probe}
        <div className="bench-grain" aria-hidden="true" />
        <p className="bench-slate relative mb-6" style={{ color: benchColor.wax, opacity: 0.6 }}>
          T3 prototype — reduced motion — no interpolation, full sequence below
        </p>
        <div className="relative">
          <BenchRail
            orientation="vertical"
            frames={BENCH_FRAMES}
            frameStates={REDUCED_STATES}
            selectedIndex={selectedIndex}
            labels={LABELS}
            pitchPx={pitch}
            onToggleSelect={onToggleSelect}
            frameSize="var(--bench-frame)"
            gap="var(--bench-gap)"
          />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={act.ref}
      aria-label="Production strip prototype"
      style={{ "--bench-track": `${(BENCH_VIEWPORTS * 100).toFixed(2)}svh` } as React.CSSProperties}
      className="relative w-full lg:h-[var(--bench-track)]"
    >
      {probe}

      {/* Desktop: pinned stage, JS-eased horizontal ribbon. */}
      <div
        className="relative hidden overflow-hidden lg:sticky lg:top-0 lg:block lg:h-[100svh]"
        style={{ background: benchColor.stock }}
      >
        <div className="bench-grain" aria-hidden="true" />
        <BenchLatch
          orientation="horizontal"
          activeIndex={activeIndex}
          frameCount={FRAME_COUNT}
          settled={settled}
        />
        <div
          className="absolute top-1/2"
          style={{ left: "var(--bench-window-x-desktop)", transform: "translateY(-50%)" }}
        >
          <BenchRail
            ref={railRef}
            orientation="horizontal"
            frames={BENCH_FRAMES}
            frameStates={frameStates}
            selectedIndex={selectedIndex}
            labels={LABELS}
            pitchPx={pitch}
            onToggleSelect={onToggleSelect}
            frameRefs={desktopFrameRefs}
            frameSize={`${framePx}px`}
            gap={`${gapPx}px`}
          />
        </div>
      </div>

      {/* Mobile: normal document flow, native scroll-snap, no pin. */}
      <div className="relative lg:hidden" style={{ background: benchColor.stock }}>
        <div className="bench-grain" aria-hidden="true" />
        <p
          className="bench-slate relative px-4 pt-8"
          style={{ color: benchColor.wax, opacity: 0.6 }}
        >
          Scroll the strip below — it snaps natively, no page scroll-jacking.
        </p>
        <div className="relative px-4 py-6">
          <BenchLatch
            orientation="vertical"
            activeIndex={activeIndex}
            frameCount={FRAME_COUNT}
            settled
          />
          <div
            ref={mobileScrollRef}
            className="relative overflow-y-auto overscroll-contain"
            style={{ height: "min(70dvh, 560px)", scrollSnapType: "y mandatory" }}
          >
            {/* Leading spacer, sized to (container height − frame height) / 2:
                with `scroll-snap-align: center`, frame 1's own center cannot
                reach the container's center — where the reading line and the
                IntersectionObserver's detection band both sit — unless there
                is this much empty room to scroll UP from the rest position.
                Symmetric with the trailing spacer below; `aria-hidden`, no
                `scroll-snap-align`: it is not a frame. */}
            <div
              aria-hidden="true"
              style={{ height: "calc((min(70dvh, 560px) - var(--bench-frame)) / 2)" }}
            />
            <BenchRail
              orientation="vertical"
              frames={BENCH_FRAMES}
              frameStates={frameStates}
              selectedIndex={selectedIndex}
              labels={LABELS}
              pitchPx={pitch}
              onToggleSelect={onToggleSelect}
              frameRefs={mobileFrameRefs}
              frameSize="var(--bench-frame)"
              gap="var(--bench-gap)"
              snapAlign="center"
            />
            {/* Trailing spacer — same formula as the leading one, for the
                LAST frame's center to reach the container's center.
                CRITIQUE-FOUND BUG this replaces: the previous version used
                `scroll-snap-align: start` with a trailing spacer sized for
                THAT alignment (container height − one pitch), while the
                IntersectionObserver watched the container's CENTER — the two
                systems disagreed about where "active" was, so the last frame
                could never cross the observer's band no matter how far the
                container scrolled (the counter stuck at "05/06" forever).
                Switching both the snap alignment and this spacer to "center"
                makes the thing that settles and the thing that gets observed
                the same point. */}
            <div
              aria-hidden="true"
              style={{ height: "calc((min(70dvh, 560px) - var(--bench-frame)) / 2)" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
