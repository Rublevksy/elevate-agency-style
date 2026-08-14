import { useEffect, useRef, type RefObject } from "react";

/**
 * ONE scroll timeline for the cinematic device film.
 * Scroll is the film: a single normalised 0 → 1 value. Nothing autoplays,
 * everything reverses.
 */
export function useFilmProgress(wrapper: RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    let raf = 0;
    const read = () => {
      const el = wrapper.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      const raw = total > 0 ? -el.getBoundingClientRect().top / total : 0;
      progress.current = Math.min(1, Math.max(0, raw));
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

  return progress;
}

/** film phases on the master timeline */
export const PHASE = {
  /** product reveal / approach begins */
  APPROACH: 0.18,
  /** digital products start escaping the display */
  PRODUCTS_IN: 0.4,
  PRODUCTS_HOLD: 0.6,
  /** the camera commits to entering the display */
  ENTER: 0.66,
  /** the 3D display hands the frame to the fullscreen interface */
  HANDOFF: 0.9,
} as const;

/** device geometry — 1 world unit = 1 cm */
export const DEVICE = {
  W: 31,
  H: 19.375,
  D: 21.5,
  LID_OPEN_DEG: -100,
} as const;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const range = (a: number, b: number, v: number) => clamp01((v - a) / (b - a));

export function smoothstep(a: number, b: number, v: number) {
  const t = range(a, b, v);
  return t * t * (3 - 2 * t);
}

/** cinematic dolly curve — slow in, long glide, soft settle */
export function easeFilm(t: number) {
  const v = clamp01(t);
  return v < 0.5 ? 4 * v * v * v : 1 - Math.pow(-2 * v + 2, 3) / 2;
}
