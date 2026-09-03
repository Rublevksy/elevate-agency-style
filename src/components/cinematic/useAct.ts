/**
 * An act — one section's clock, cut from the page's single scroll reading.
 *
 * Every section used to call `useScroll` itself, which is how five sections
 * ended up with five different ideas of where the page was. The two readings
 * below are exactly the two the hero and the services room were already taking
 * by hand; the only change is that they are now written once and a section
 * never writes them again.
 *
 * REVERSIBILITY (R21). Everything an act hands out is a `useTransform` of one
 * `MotionValue`, i.e. a pure function of scroll position. Scrolling back up
 * therefore replays the timeline backwards by construction rather than by
 * arrangement — which is why this file must never grow a `useState`, a
 * `useMotionValueEvent` or a `useSpring` on the progress: each of those adds
 * state, and state is what makes a timeline play differently in reverse.
 */
import { useEffect, useRef } from "react";
import { useScroll, useTransform, type MotionValue } from "framer-motion";
import { useStage } from "./CinematicStage";

export interface ActOptions {
  /** How many viewports of scroll the act occupies in total. */
  viewports: number;
  /** Fraction of the act's length for which its scene is pinned (sticky). */
  pin: number;
}

export interface Act {
  /** Attach to the act's own section element. */
  ref: React.RefObject<HTMLElement | null>;
  /** The shot list's clock: 0 at the start of the pinned window → 1 at its end. */
  progress: MotionValue<number>;
  /** Arrival: 0 with the act's top at the bottom edge → 1 once it is pinned. */
  enter: MotionValue<number>;
  /** Departure: 0 while the scene holds → 1 once the act has travelled away. */
  exit: MotionValue<number>;
  /** Raw progress across the section, for the cases that want exactly that. */
  raw: MotionValue<number>;
  viewports: number;
  pin: number;
}

export function useAct(id: string, options: ActOptions): Act {
  const { viewports, pin } = options;
  const stage = useStage();
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // A second read of the same section, taken while it is still arriving. This
  // is what lets one act pick up the move the previous one was making, so two
  // sections read as one camera move rather than as two pages meeting at a seam.
  const { scrollYProgress: enter } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  /**
   * Progress across the pinned window — the clock every shot is cut against.
   *
   * This is load-bearing: the stage is pinned for exactly the first `pin` of the
   * track, so timing the beats against this rather than against the section
   * means the choreography cannot drift when the section's height changes.
   */
  const progress = useTransform(raw, [0, pin], [0, 1]);
  const exit = useTransform(raw, [pin, 1], [0, 1]);

  const { registerAct } = stage;
  useEffect(() => registerAct(id, { viewports, pin }), [registerAct, id, viewports, pin]);

  return { ref, progress, enter, exit, raw, viewports, pin };
}
