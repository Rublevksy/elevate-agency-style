import { useEffect, useState } from "react";

/**
 * True when this viewport should carry the hero's scroll-scrubbed camera move:
 * a wide screen driven by a real pointer.
 *
 * Phones get the still plate and the live light instead. That is not a
 * degradation — 05_HOME_MOBILE_HERO.png is its own composition, and a narrow
 * screen has neither the decode budget for a 2.8MB clip nor the room for a
 * camera move to read as anything but a jitter.
 *
 * It starts false and resolves after mount on purpose: the server has no
 * viewport, so committing to the clip during SSR would ship markup the client
 * has to throw away.
 */
export function useCinematicViewport(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!isCapableDevice()) return;
    const mq = window.matchMedia("(min-width: 1024px) and (pointer: fine)");
    const sync = () => setOn(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return on;
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
