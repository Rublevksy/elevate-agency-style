/**
 * The hero's physical scene — one set, one unbroken camera move.
 *
 * At rest the visitor sees a still plate: a 1400px photoreal frame of the
 * matte-black laptop on its stone, built from the approved reference art
 * direction. It is sharp, cheap, and it is what the page paints first.
 *
 * On scroll the same set keeps playing as footage. Two clips, not one:
 *
 *   SHOT A  public/media/hero-camera.mp4      the orbit — the laptop turns
 *   SHOT B  public/media/hero-transition.mp4  the camera pushes past it and
 *                                             out into the dark, which is the
 *                                             cut into the services room
 *
 * THE JOIN IS NOT A CROSS-FADE. Shot B was generated from shot A's own frame at
 * `CLIP_RANGE` — the exact frame scroll stops A on — so B's first frame and A's
 * last frame are the same photograph. Handing over between them is invisible
 * because there is nothing to dissolve: the camera simply keeps going. That is
 * what makes hero → services one continuous take rather than two sections
 * meeting at a fade.
 *
 * Their timelines are bound to scroll position, so the visitor is the one
 * moving the camera. It is also the only honest way to get a laptop that turns
 * like a real object: no CSS transform on a flat photograph can reveal the far
 * edge of a lid the photograph never recorded.
 *
 * THE ENTRY into shot A is a match cut. The footage is framed tighter than the
 * still, so a plain dissolve between them would read as a jump. Instead the
 * still is pushed in — scaled toward the footage's framing — over exactly the
 * window in which the footage fades up, so the swap happens while the camera is
 * already moving.
 *
 * The footage is an enhancement, never a dependency:
 *
 *   - it mounts only on capable, wide, pointer-driven viewports, and only once
 *     the browser is idle, so it never competes with the first paint;
 *   - shot B is not even requested until shot A can draw, so the two never
 *     contend for bandwidth;
 *   - the still stays underneath at full opacity until the footage is ready, so
 *     a slow or failed load is invisible rather than a black rectangle;
 *   - reduced motion skips both elements and keeps the still.
 */
import { useEffect, useRef, useState } from "react";
import { motion, type MotionValue, useTransform } from "framer-motion";
import { SceneImage } from "@/components/media/SceneImage";

/** Served from public/ rather than bundled: they must not block the JS graph. */
const SHOT_A_SRC = "/media/hero-camera.mp4";
const SHOT_B_SRC = "/media/hero-transition.mp4";

/**
 * The scroll window the entry match cut owns. It starts after the visitor has
 * committed to scrolling (never at rest, where a swap would look like a glitch)
 * and is over well before the camera move proper.
 */
const HANDOFF: [number, number] = [0.05, 0.17];

/** How far the still travels toward the footage's tighter framing during the cut. */
const MATCH_SCALE = 1.085;

/**
 * How much of shot A the scroll plays.
 *
 * The generated orbit keeps pushing in past its halfway point and ends in a
 * close-up so tight the lid fills the frame as a black wall. The scene, not the
 * asset, decides where the shot ends.
 *
 * THIS NUMBER IS LOAD-BEARING: shot B was generated from shot A's frame at
 * exactly this position (0.38 x 5s = 1.9s). Change it and the join stops being
 * the same photograph — shot B must be regenerated from the new frame.
 */
const CLIP_RANGE = 0.38;

/** Where shot A hands over to shot B, in pinned-stage progress. */
const SHOT_SPLIT = 0.55;

/** Overlap of the hand-over. Small: the two frames are identical, not similar. */
const JOIN = 0.02;

export interface HeroCameraPlateProps {
  /** Pinned-stage progress, 0 at rest → 1 at the hand-off to services. */
  progress: MotionValue<number>;
  reduced: boolean;
  /** Whether this viewport should carry the footage at all. */
  cinematic: boolean;
  /** Pointer-parallax offsets, shared with the light layer so they agree. */
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
}

export function HeroCameraPlate({
  progress,
  reduced,
  cinematic,
  pointerX,
  pointerY,
}: HeroCameraPlateProps) {
  const shotA = useRef<HTMLVideoElement>(null);
  const shotB = useRef<HTMLVideoElement>(null);
  const [mounted, setMounted] = useState(false);
  const [readyA, setReadyA] = useState(false);
  const [readyB, setReadyB] = useState(false);

  // Mount the footage only when the browser has nothing better to do. This is
  // what keeps several MB of video from competing with the hero's first paint.
  useEffect(() => {
    if (!cinematic || reduced) return;
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
    };
    if (typeof w.requestIdleCallback === "function") {
      const id = w.requestIdleCallback(() => setMounted(true), { timeout: 2500 });
      return () => window.cancelIdleCallback?.(id);
    }
    const t = window.setTimeout(() => setMounted(true), 1200);
    return () => window.clearTimeout(t);
  }, [cinematic, reduced]);

  /**
   * Scrubbing runs on one rAF loop for both shots. It eases each playhead
   * toward the scroll position rather than slamming it there: a decoder asked
   * to seek on every wheel event stutters, and an eased playhead gives the move
   * its own weight — the camera keeps drifting for a beat after the wheel
   * stops, which is what a real dolly does.
   *
   * Only the shot that is on screen is driven. Seeking the other one would burn
   * decode budget on frames nobody is looking at.
   */
  const active = mounted && readyA && !reduced;
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    let headA = 0;
    let headB = 0;
    const ease = (current: number, target: number) => {
      const next = current + (target - current) * 0.14;
      return Math.abs(target - next) < 0.004 ? target : next;
    };
    const seek = (el: HTMLVideoElement | null, time: number) => {
      if (!el || !(el.duration > 0) || el.seeking) return;
      try {
        el.currentTime = time;
      } catch {
        /* a seek during a decoder reset throws; the next frame retries */
      }
    };
    const tick = () => {
      const p = progress.get();
      const a = shotA.current;
      const b = shotB.current;
      if (p < SHOT_SPLIT + JOIN && a && a.duration > 0) {
        const local = Math.min(p / SHOT_SPLIT, 1);
        headA = ease(headA, local * a.duration * CLIP_RANGE);
        seek(a, headA);
      }
      if (p > SHOT_SPLIT - JOIN && b && b.duration > 0) {
        const local = Math.min(Math.max((p - SHOT_SPLIT) / (1 - SHOT_SPLIT), 0), 0.999);
        headB = ease(headB, local * b.duration);
        seek(b, headB);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, progress]);

  // The still owns the frame until the footage can actually draw; after that it
  // hands over inside the match cut.
  const stillFade = useTransform(progress, HANDOFF, [1, 0]);
  const clipFade = useTransform(progress, HANDOFF, [0, 1]);
  const matchScale = useTransform(progress, HANDOFF, [1, MATCH_SCALE]);

  // The join. Shot B covers shot A rather than dissolving with it — same frame,
  // so the only thing this window hides is the moment the element swaps.
  const shotBFade = useTransform(progress, [SHOT_SPLIT - JOIN, SHOT_SPLIT + JOIN], [0, 1]);

  // The luminance matte lifts the arc, the lid rim and the speckle on the stone
  // without ever darkening anything — it is screened, so its floor is "no
  // change". It belongs to the still only; the footage carries its own light.
  const lightLift = useTransform(progress, [0, 0.4], [0.1, 0.34]);

  const clipClass =
    "absolute inset-0 h-full w-full object-cover object-[62%_58%] [mask-image:linear-gradient(to_right,transparent_0%,#000_22%)]";

  return (
    <div className="absolute inset-0">
      <motion.div
        style={{ x: pointerX, y: pointerY }}
        className="absolute inset-0 origin-bottom-right"
      >
        {/* The still. Scaled toward the footage's framing during the cut, so the
            two never meet as different pictures of the same thing. */}
        <motion.div
          style={{ opacity: active ? stillFade : 1, scale: active ? matchScale : 1 }}
          className="absolute inset-0 origin-[70%_65%]"
        >
          <SceneImage
            name="hero-macbook"
            priority
            sizes="(min-width: 1280px) 58vw, 62vw"
            alt=""
            className="block h-full w-full"
            imgClassName="h-full w-full object-cover object-right-bottom [mask-image:linear-gradient(to_right,transparent_0%,#000_22%)]"
          />
          <motion.div style={{ opacity: lightLift }} className="absolute inset-0 mix-blend-screen">
            <SceneImage
              name="hero-light"
              alt=""
              sizes="(min-width: 1280px) 58vw, 62vw"
              className="block h-full w-full"
              imgClassName="h-full w-full object-cover object-right-bottom [mask-image:linear-gradient(to_right,transparent_0%,#000_22%)]"
            />
          </motion.div>
        </motion.div>

        {/* SHOT A — the orbit. Same box, same mask, so it lands registered to
            the still rather than beside it. */}
        {mounted && !reduced && (
          <motion.video
            ref={shotA}
            src={SHOT_A_SRC}
            muted
            playsInline
            preload="auto"
            aria-hidden
            tabIndex={-1}
            onLoadedData={() => setReadyA(true)}
            style={{ opacity: active ? clipFade : 0 }}
            className={clipClass}
          />
        )}

        {/* SHOT B — the move past the device and out into the dark. Requested
            only once shot A can draw, so the two never contend for bandwidth. */}
        {readyA && !reduced && (
          <motion.video
            ref={shotB}
            src={SHOT_B_SRC}
            muted
            playsInline
            preload="auto"
            aria-hidden
            tabIndex={-1}
            onLoadedData={() => setReadyB(true)}
            style={{ opacity: readyB ? shotBFade : 0 }}
            className={clipClass}
          />
        )}
      </motion.div>
    </div>
  );
}
