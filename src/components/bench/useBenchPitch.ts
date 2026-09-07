import { useEffect, useRef, useState } from "react";

export interface BenchPitch {
  /** Attach to a hidden 0-content probe element sized `width: var(--bench-pitch)`. */
  probeRef: React.RefObject<HTMLDivElement | null>;
  /** The resolved pixel value, 0 until the probe's first measurement. */
  pitch: number;
}

/**
 * Resolves `--bench-pitch` (a `clamp()` off `--bench-rail-height`, itself
 * `vh`-based — see bench-foundation.css) to an actual pixel number.
 *
 * CSS custom properties do not hand a resolved length to JS on their own; the
 * standard way to get one is a hidden probe element sized with the property
 * and measured. A `ResizeObserver` on the probe keeps the number live across
 * viewport-height changes (mobile browser chrome show/hide, window resize) —
 * this is the only thing in the whole rail that reads layout; the rAF latch
 * in Bench.tsx never touches layout itself, it only reads the last number
 * this hook measured.
 */
export function useBenchPitch(): BenchPitch {
  const probeRef = useRef<HTMLDivElement | null>(null);
  const [pitch, setPitch] = useState(0);

  useEffect(() => {
    const el = probeRef.current;
    if (!el) return;
    const measure = () => setPitch(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { probeRef, pitch };
}
