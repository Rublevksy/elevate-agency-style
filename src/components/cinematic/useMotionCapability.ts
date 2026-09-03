/**
 * One answer, for the whole page, to "how much motion does this machine carry?"
 *
 * Before this hook the question was asked in six places with five different
 * answers: `useReducedMotion()` in each of the five home sections plus
 * `useCinematicViewport()` in the hero. Five answers to one question is how a
 * page ends up half animated — a section that respects the visitor's setting
 * sitting next to one that does not.
 *
 * The three levels are cumulative, and each one is reached for exactly one
 * reason:
 *
 *   still      the approved static frames and nothing else.
 *              Reached ONLY by `prefers-reduced-motion: reduce`.
 *   motion     the rig, the parallax, the wipes — but no video.
 *              Everything that is not `still` and not `cinematic`, INCLUDING
 *              thin machines and `saveData`.
 *   cinematic  all of the above plus the two scroll-scrubbed clips.
 *              Not `still`, AND `isCapableDevice()`, AND a wide screen with a
 *              fine pointer.
 *
 * `still` is reserved for `prefers-reduced-motion` and nothing else — do not
 * "optimise" a device test back into it. Turning the whole page static is a
 * decision only the visitor may make; a phone with 2GB of memory did not ask
 * for a site without motion, and `saveData` is a request about bytes, not about
 * animation. `isCapableDevice()` therefore only gates the promotion to
 * `cinematic`, which is what it was written to answer: whether to ask this
 * machine to decode and scrub two video tracks.
 */
import { useEffect, useState } from "react";

export type MotionCapability = "still" | "motion" | "cinematic";

/**
 * The page's motion capability.
 *
 * It is a pure reading of the environment, so every caller on the page gets the
 * same answer at the same moment — the single decision is the rule, not a
 * shared object. `CinematicStage` takes the same reading and publishes it on
 * its context for code that already holds the stage.
 */
export function useMotionCapability(): MotionCapability {
  return useDetectedCapability();
}

/** `cap === "still"` — the comparison that otherwise appears in every section. */
export function useReducedScene(): boolean {
  return useMotionCapability() === "still";
}

/** `cap === "cinematic"` — whether this viewport should carry the footage. */
export function useCinematicScene(): boolean {
  return useMotionCapability() === "cinematic";
}

/**
 * The measurement itself. `CinematicStage` calls this one directly; a section
 * asks `useMotionCapability()`.
 *
 * It starts at `"still"` and resolves after mount on purpose: the server has no
 * viewport, so committing to motion during SSR would ship markup the client has
 * to throw away, and starting at the quietest level means the frame that
 * renders before the answer arrives is the approved still one.
 */
export function useDetectedCapability(): MotionCapability {
  const [capability, setCapability] = useState<MotionCapability>("still");

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    // A wide screen driven by a real pointer. Phones get the still plate and
    // the live light instead. That is not a degradation — 05_HOME_MOBILE_HERO
    // is its own composition, and a narrow screen has neither the decode budget
    // for a 2.8MB clip nor the room for a camera move to read as anything but a
    // jitter.
    const cinema = window.matchMedia("(min-width: 1024px) and (pointer: fine)");

    const sync = () => {
      // The visitor's explicit setting is the only thing that empties the page
      // of movement.
      if (reduce.matches) {
        setCapability("still");
        return;
      }
      // A thin machine or a data-saving one keeps the rig and loses only the
      // footage — it drops to `motion`, never to `still`.
      setCapability(cinema.matches && isCapableDevice() ? "cinematic" : "motion");
    };

    sync();
    reduce.addEventListener("change", sync);
    cinema.addEventListener("change", sync);
    return () => {
      reduce.removeEventListener("change", sync);
      cinema.removeEventListener("change", sync);
    };
  }, []);

  return capability;
}

/**
 * Whether this machine should be asked to decode and scrub two video tracks.
 *
 * Scroll-scrubbed video is the most expensive thing on the page: every scroll
 * frame is a seek, and a seek is a decode. On a thin machine that turns a
 * cinematic hero into a stuttering one, which is worse than the still it
 * replaced — so the test errs toward the still.
 *
 * All three signals are optional and non-standard in places, hence the guarded
 * reads: when a browser tells us nothing we assume it is capable, because the
 * common case for "no Device Memory API" is Safari on a Mac.
 */
function isCapableDevice(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  // An explicit request to spend less data outranks any aesthetic intent.
  if (nav.connection?.saveData) return false;
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory < 4) return false;
  if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency < 4) return false;
  return true;
}
