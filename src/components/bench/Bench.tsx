import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, useTransform } from "framer-motion";
import { useAct, useReducedScene } from "@/components/cinematic";
import { useT } from "@/lib/i18n";
import {
  benchColor,
  benchMotion,
  benchRail as benchRailTokens,
  benchType,
} from "@/lib/bench-tokens";
import { BENCH_FRAMES, FRAME_COUNT } from "./frames-data";
import { useBenchPitch } from "./useBenchPitch";
import { useIsDesktopRail } from "./useIsDesktopRail";
import { BenchRail } from "./BenchRail";
import { BenchLatch } from "./BenchLatch";
import { BenchApparatusEdge } from "./BenchApparatusEdge";
import { BenchPerforation } from "./BenchPerforation";
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
 *
 * T5 adds the first two real STORYBOARD.md scenes on top of this unchanged
 * T3 mechanism — no new scroll source, no new pitch/snap/latch math:
 *
 *   SCENE 00 — THE APPARATUS (`BenchApparatusEdge`) — not a scroll position,
 *   a persistent top edge of the rail, present the whole time the stage is
 *   visible (STORYBOARD: "не сцена, а кромка рельса поверх всех шести").
 *
 *   SCENE 01 — THE THREAD-UP — the existing rail's arrival at FRAME 01 (T3
 *   already put content there; nothing about the rail changed), plus the
 *   two pieces STORYBOARD adds to that first arrival: a headline in the
 *   space the reading window leaves empty, and a small locator tag at the
 *   foot of the frame. The headline is the one genuinely new motion in T5 —
 *   `useTransform(act.progress, ...)`, the same MotionValue the rAF loop
 *   already reads, not a second one. STORYBOARD's transition rule ("H1
 *   exits up faster than the tape, the next frame is already in the window
 *   when it clears — no empty beat") falls out of the numbers: the exit
 *   finishes within the FIRST frame's own progress window, well before
 *   FRAME 02 is due, and FRAME 01 was already the first thing in the window
 *   from p=0 — there never was an empty beat to cut around.
 */

const VIEWPORTS_PER_FRAME = 0.6;
const BENCH_VIEWPORTS = FRAME_COUNT * VIEWPORTS_PER_FRAME;
const BENCH_PIN = 0.88;
const SNAP_EPSILON_PX = 0.5;

/**
 * Where the desktop headline finishes exiting — not a tuned-by-eye number.
 * `targetIndex = round(p * (FRAME_COUNT - 1))` (the same rAF loop below)
 * crosses from FRAME 01 to FRAME 02 exactly at `p = 0.5 / (FRAME_COUNT - 1)`
 * (the point `p * 5 = 0.5` rounds up). Ending the headline's exit there,
 * not sooner and not later, is what makes STORYBOARD's transition rule true
 * by construction: the headline is gone by the exact moment the rail would
 * next move, not before (which would leave a beat with neither on screen)
 * and not after (which would have it lingering over FRAME 02's arrival).
 */
const HEADLINE_EXIT_END = 0.5 / (FRAME_COUNT - 1);

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
  const { t } = useT();

  const railRef = useRef<HTMLDivElement>(null);
  const desktopFrameRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const mobileScrollRef = useRef<HTMLDivElement>(null);
  const mobileFrameRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [settled, setSettled] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // TEST B (T5 §13), dev/QA only: hides every text label — frame title/body,
  // marker captions, latch counter, headline, apparatus edge — while leaving
  // the rail, perforation, marks, and punched corner fully visible, so the
  // question "does this still read as one physical object without the
  // words" can actually be asked of the running page, not just imagined.
  const [hideLabels, setHideLabels] = useState(false);

  const onToggleSelect = useCallback((i: number) => {
    setSelectedIndex((prev) => (prev === i ? null : i));
  }, []);

  // SCENE 01's headline exit — a second `useTransform` of the SAME
  // `act.progress` MotionValue the rAF loop below reads with `.get()`, not a
  // second scroll source (ADR 0013's rule is "one reading of scroll
  // position," not "one consumer of it" — HeroScene's rig already reads the
  // same MotionValue through several `useTransform`s for exactly this
  // reason).
  //
  // `-100svh`, not a percentage of the headline's own box: an earlier
  // version used "-140%" (140% of the wrapper's own height) on the theory
  // that it would scale safely to any headline length. Measured in the
  // browser, it didn't — the wrapper is vertically CENTERED in the stage
  // (`top-1/2 -translate-y-1/2`), so 140% of its own ~310px height (≈434px)
  // moved it nowhere near clear of a 900px-tall viewport; about 170px of
  // the Ukrainian headline was still on screen at the point the exit was
  // supposed to be finished. A percentage-of-self answers "how far relative
  // to the element", never "is it actually gone from the screen" — those
  // are different questions once the element doesn't start at the top edge.
  // `-100svh` moves it a full stage height regardless of the headline's own
  // size or the visitor's language, which is what "gone" actually requires.
  const headlineY = useTransform(act.progress, [0, HEADLINE_EXIT_END], ["0svh", "-100svh"]);

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

  // TEST B's toggle — a real control on the page, not a devtools hack, so
  // this exact check survives past this one QA pass. `z-30`: above Scene
  // 00's edge (`z-20`) and the latch (`z-10`), the two highest layers
  // already in play, so it is never hidden behind either of them.
  const hideLabelsToggle = (
    <button
      type="button"
      onClick={() => setHideLabels((v) => !v)}
      className="bench-tick fixed bottom-3 right-3 z-30 lg:bottom-auto lg:top-3"
      style={{
        color: benchColor.wax,
        background: benchColor.stockLift,
        border: `1px solid ${benchColor.edge}`,
        padding: "4px 8px",
      }}
    >
      {hideLabels ? "SHOW LABELS" : "TEST B — HIDE LABELS"}
    </button>
  );

  // ---- REDUCED MOTION: plain vertical list, no rail mechanics -------------
  if (reducedScene) {
    return (
      <>
        {hideLabelsToggle}
        <section
          ref={act.ref}
          aria-label="Production strip prototype — reduced motion, full sequence"
          className={`relative w-full px-4 pb-12 pt-14 sm:px-8 ${hideLabels ? "bench-hide-labels" : ""}`}
          style={{ background: benchColor.stock }}
        >
          {probe}
          <div className="bench-grain" aria-hidden="true" />
          {/* Scene 00 — same persistent edge, no motion of its own either way
            (STORYBOARD: "Reduced motion. Идентично"). */}
          <BenchApparatusEdge activeIndex={activeIndex} frameCount={FRAME_COUNT} pitchPx={pitch} />
          {/* Scene 01's headline, shown whole and static — STORYBOARD:
            "Лента стоит, H1 целиком, окно на месте." No exit: there is
            nothing here for it to exit before, since every frame is already
            laid out at once. */}
          <h1
            className="bench-label-text relative mb-8 mt-2"
            style={{
              fontFamily: benchType.frameTitle.fontFamily,
              fontWeight: benchType.frameTitle.fontWeight,
              fontSize: benchType.frameTitle.fontSize,
              letterSpacing: benchType.frameTitle.letterSpacing,
              lineHeight: benchType.frameTitle.lineHeight,
              color: benchColor.wax,
              margin: 0,
            }}
          >
            {t.hero.title1}
            <br />
            {t.hero.title2}
          </h1>
          <p className="bench-slate relative mb-6" style={{ color: benchColor.wax, opacity: 0.6 }}>
            T3/T4 prototype — reduced motion — no interpolation, full sequence below
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
      </>
    );
  }

  return (
    <>
      {hideLabelsToggle}
      <section
        ref={act.ref}
        aria-label="Production strip prototype"
        style={
          { "--bench-track": `${(BENCH_VIEWPORTS * 100).toFixed(2)}svh` } as React.CSSProperties
        }
        className={`relative w-full lg:h-[var(--bench-track)] ${hideLabels ? "bench-hide-labels" : ""}`}
      >
        {probe}

        {/* Desktop: pinned stage, JS-eased horizontal ribbon. */}
        <div
          className="relative hidden overflow-hidden lg:sticky lg:top-0 lg:block lg:h-[100svh]"
          style={{ background: benchColor.stock }}
        >
          <div className="bench-grain" aria-hidden="true" />
          {/* Critique-found (Assessment A, T5): with labels hidden, Scene
              00's own perforation row (top edge) and the rail's perforation
              (vertically centered on the frames) sat ~350px of unbroken
              black apart — two disconnected fragments, not one strip, which
              is exactly the claim this whole rebuild rests on. Real 35mm
              stock carries perforation continuously along BOTH edges for
              the full length of the reel, not only where a frame happens to
              be — so this is that, literally: two static vertical
              perforation columns spanning the full stage height, framing
              the apparatus rather than living inside the moving ribbon.
              Static (no transform): they belong to the gate/apparatus
              Scene 00 already is, not to the tape sliding through it — the
              part of the machine that does not move is what visually
              proves the part that does move is threaded through something
              real. */}
          {pitch > 0 && (
            <>
              <div
                className="pointer-events-none absolute bottom-0 left-2 top-0 overflow-hidden"
                aria-hidden="true"
              >
                <BenchPerforation orientation="vertical" pitchPx={pitch} count={12} />
              </div>
              <div
                className="pointer-events-none absolute bottom-0 right-2 top-0 overflow-hidden"
                aria-hidden="true"
              >
                <BenchPerforation orientation="vertical" pitchPx={pitch} count={12} />
              </div>
            </>
          )}
          {/* Scene 00 — the persistent edge, on top of everything below it. */}
          <BenchApparatusEdge activeIndex={activeIndex} frameCount={FRAME_COUNT} pitchPx={pitch} />
          <BenchLatch orientation="horizontal" activeIndex={activeIndex} settled={settled} />
          {/* Scene 01's headline — the space the reading window (62%) leaves
            empty on the left, STORYBOARD's "H1 в двенадцать ячеек." Wrapper
            handles the static vertical centering; the `motion.div` inside
            carries only the scroll-driven exit, so the two transforms don't
            fight over the same style property. */}
          <div className="pointer-events-none absolute left-8 top-1/2 max-w-[34%] -translate-y-1/2 sm:left-16">
            <motion.div style={{ y: headlineY }}>
              <h1
                className="bench-label-text"
                style={{
                  fontFamily: benchType.frameTitle.fontFamily,
                  fontWeight: benchType.frameTitle.fontWeight,
                  fontSize: benchType.frameTitle.fontSize,
                  letterSpacing: benchType.frameTitle.letterSpacing,
                  lineHeight: benchType.frameTitle.lineHeight,
                  color: benchColor.wax,
                  margin: 0,
                }}
              >
                {t.hero.title1}
                <br />
                {t.hero.title2}
              </h1>
            </motion.div>
          </div>
          {/* Bottom locator slate — STORYBOARD: "Внизу — ELEVATE · PRAHA." A
            production slate mark inside the shot, not the nav chrome
            (Scene 00's logo already covers that role). Brand name + city,
            not user-facing prose — no i18n key needed for it. */}
          <span
            className="bench-tick pointer-events-none absolute bottom-6 left-8 sm:left-16"
            style={{ color: benchColor.wax, opacity: 0.55 }}
          >
            ELEVATE · PRAHA
          </span>
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
          {/* Scene 00 — mobile keeps logo/language/position, per STORYBOARD's
            mobile note; not `position: sticky` here (T3's mobile branch
            never pins anything, and duplicating that decision for one bar
            is not worth a second layout mode for T5). */}
          <div className="relative">
            <BenchApparatusEdge
              activeIndex={activeIndex}
              frameCount={FRAME_COUNT}
              pitchPx={pitch}
            />
          </div>
          {/* Scene 01's headline — STORYBOARD's desktop spec puts it beside a
            horizontal tape ("left two-thirds"); mobile's tape is vertical,
            so there is no equivalent "beside" — stacked above the rail
            instead, static (mobile never pins, so there is no progress
            window to exit against the way the desktop headline has). */}
          <h1
            className="bench-label-text relative px-4 pt-10"
            style={{
              fontFamily: benchType.frameTitle.fontFamily,
              fontWeight: benchType.frameTitle.fontWeight,
              fontSize: benchType.frameTitle.fontSize,
              letterSpacing: benchType.frameTitle.letterSpacing,
              lineHeight: benchType.frameTitle.lineHeight,
              color: benchColor.wax,
              margin: 0,
            }}
          >
            {t.hero.title1}
            <br />
            {t.hero.title2}
          </h1>
          <p
            className="bench-slate relative px-4 pt-4"
            style={{ color: benchColor.wax, opacity: 0.6 }}
          >
            Scroll the strip below — it snaps natively, no page scroll-jacking.
          </p>
          <div className="relative px-4 py-6">
            <BenchLatch orientation="vertical" activeIndex={activeIndex} settled />
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
    </>
  );
}
