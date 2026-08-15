import { useEffect, useRef, type RefObject } from "react";
import { registerSection } from "@/lib/scroll-film";

/**
 * ONE scroll timeline for the cinematic homepage.
 * Progress comes from the single shared scroll engine: a normalised 0 → 1 value
 * per section. Nothing autoplays, everything reverses, scroll is never trapped.
 */
export function useFilmProgress(wrapper: RefObject<HTMLElement | null>) {
  const progress = useRef(0);

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;
    return registerSection(el, progress);
  }, [wrapper]);

  return progress;
}

/** film phases on the master timeline — tightened so one gesture moves the story */
export const PHASE = {
  /** product reveal / approach begins */
  APPROACH: 0.14,
  /** the interface layers gain depth */
  PRODUCTS_IN: 0.34,
  PRODUCTS_HOLD: 0.48,
  /** the camera commits to entering the display */
  ENTER: 0.56,
  /** the 3D display hands the frame to the fullscreen interface */
  HANDOFF: 0.72,
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
