import { useEffect, useRef, type RefObject } from "react";

/**
 * ONE scroll progress controller for the whole cinematic opening.
 *
 * Scroll IS the timeline: a single normalised 0 → 1 value derived from the
 * position of the tall wrapper. Nothing autoplays, everything reverses.
 */
export function useCinemaProgress(wrapper: RefObject<HTMLElement | null>) {
  const progress = useRef(0);
  const velocity = useRef(0);

  useEffect(() => {
    let raf = 0;
    let last = 0;

    const read = () => {
      const el = wrapper.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const raw = total > 0 ? -el.getBoundingClientRect().top / total : 0;
      const p = Math.min(1, Math.max(0, raw));
      velocity.current = p - last;
      last = p;
      progress.current = p;
    };

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [wrapper]);

  return { progress, velocity };
}

/** clamp + normalise a sub-range of the master timeline */
export function stage(p: number, from: number, to: number) {
  return Math.min(1, Math.max(0, (p - from) / (to - from)));
}

/** cinematic ease — slow in, long glide, soft settle */
export function easeCine(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
