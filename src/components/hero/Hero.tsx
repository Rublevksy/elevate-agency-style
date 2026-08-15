import { lazy, Suspense, useEffect, useRef, useState } from "react";

import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";
import { useFilmProgress, clamp01, easeFilm, range } from "@/lib/film";
import { HeroCopy, HeroIndex } from "./HeroCopy";

/** the real GLB product render + light ribbons — mounted only after hydration */
const HeroScene = lazy(() => import("./HeroScene"));

/**
 * ELEVATE HERO — ONE scene, exactly one viewport tall.
 *
 * Light ribbons live in the 3D volume behind the device, the MacBook floats in
 * front of them, the editorial copy owns the left. Normal browser scroll: the
 * hero only drifts and fades out over its own height, then the next section
 * follows immediately with no empty gap.
 */
export function Hero() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useFilmProgress(wrap);

  const stage = useRef<HTMLDivElement>(null);
  const type = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    if (reduced) return;

    const tick = () => {
      const p = clamp01(progress.current ?? 0);
      const out = easeFilm(range(0.15, 0.95, p));

      if (stage.current) {
        stage.current.style.opacity = (1 - out * 0.85).toFixed(3);
        stage.current.style.transform = `translate3d(0, ${(-out * 5).toFixed(2)}vh, 0) scale(${(1 - out * 0.05).toFixed(4)})`;
      }
      if (type.current) {
        const t = easeFilm(range(0.05, 0.6, p));
        type.current.style.opacity = (1 - t).toFixed(3);
        type.current.style.transform = `translate3d(0, ${(-t * 4).toFixed(2)}vh, 0)`;
      }
    };

    const stop = startFrameLoop(tick, wrap.current);
    return stop;
  }, [progress]);

  return (
    <section ref={wrap} className="relative h-[100svh] min-h-[36rem] overflow-hidden" aria-label="ELEVATE">
      {/* the volume: deep navy, one soft cinematic falloff, nothing decorative */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(58% 52% at 62% 34%, oklch(0.3 0.07 258 / 0.24) 0%, transparent 70%), radial-gradient(90% 80% at 46% 112%, oklch(0.17 0.04 258 / 0.36) 0%, transparent 66%)",
        }}
      />

      {/* ribbons + device — one WebGL stage */}
      <div ref={stage} className="absolute inset-0 z-10" style={{ willChange: "opacity, transform" }}>
        {mounted ? (
          <Suspense fallback={null}>
            <HeroScene progress={progress} />
          </Suspense>
        ) : null}
      </div>

      {/* editorial copy */}
      <div
        ref={type}
        className="pointer-events-none absolute inset-x-0 top-[19vh] z-30 px-7 md:top-[26vh] md:px-[6vw]"
        style={{ willChange: "opacity, transform" }}
      >
        <HeroCopy />
      </div>

      <HeroIndex active={0} />

      {/* the seam onward: light falloff only, never a colour cut */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[16vh]"
        style={{
          background:
            "linear-gradient(180deg, transparent 0%, oklch(0.115 0.018 258 / 0.18) 60%, oklch(0.115 0.018 258 / 0.4) 100%)",
        }}
      />
    </section>
  );
}
