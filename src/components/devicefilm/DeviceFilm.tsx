import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { startFrameLoop } from "@/lib/raf";

import { PHASE, easeFilm, range, useFilmProgress } from "./film";
import { HeroType } from "./HeroType";
import { Atmosphere } from "./Atmosphere";
import { ElevateScreen } from "./ElevateScreen";

const FilmScene = lazy(() => import("./FilmScene"));

/**
 * ELEVATE — HERO FILM (one system, one timeline).
 *
 * ~200vh of normal page scroll with a single sticky frame: the physical device
 * holds a finished ELEVATE interface, the camera moves into that interface, and
 * the interface itself becomes the frame that the first service scene inherits.
 * No product interstitials, no scroll locking, no second animation system.
 */
export function DeviceFilm() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useFilmProgress(wrap);
  const pointer = useRef({ x: 0, y: 0 });
  const [mobile, setMobile] = useState(false);
  const full = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = 0.5 - e.clientY / window.innerHeight;
    };
    window.addEventListener("resize", check);
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const p = progress.current ?? 0;
      // the interface takes the full frame exactly where the 3D display stops
      if (full.current) {
        const on = p >= PHASE.HANDOFF;
        const settle = easeFilm(range(PHASE.HANDOFF, PHASE.HANDOFF + 0.05, p));
        // it keeps travelling forward, so the service section starts inside it
        const exit = easeFilm(range(0.93, 1, p));
        full.current.style.opacity = String((on ? 1 : 0) * (1 - exit));
        full.current.style.transform = `perspective(1400px) scale(${1 + (1 - settle) * 0.04 + exit * 0.12}) translate3d(0, ${-exit * 5}vh, 0)`;
        full.current.style.visibility = on ? "visible" : "hidden";
      }
    };
    const stop = startFrameLoop(tick, wrap.current);
    return () => {
      stop();
      window.removeEventListener("resize", check);
      window.removeEventListener("pointermove", onMove);
    };
  }, [progress]);

  return (
    <div ref={wrap} className="relative h-[200vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* environment: light only — the page keeps one continuous background */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 52% at 54% 38%, oklch(0.3 0.07 258 / 0.22) 0%, transparent 70%), radial-gradient(90% 80% at 50% 112%, oklch(0.19 0.05 258 / 0.32) 0%, transparent 66%)",
          }}
        />

        {/* thin technical structure — the only background animation on the page */}
        <Atmosphere progress={progress} pointer={pointer} mobile={mobile} />

        <ClientOnly fallback={<div className="absolute inset-0" />}>
          <Suspense fallback={<div className="absolute inset-0" />}>
            <div className="absolute inset-0 z-10">
              <FilmScene progress={progress} pointer={pointer} mobile={mobile} />
            </div>
          </Suspense>
        </ClientOnly>

        <HeroType progress={progress} />

        {/* the interface, fullscreen — the frame the first service inherits */}
        <div
          ref={full}
          className="absolute inset-0 z-40 text-[1.05vw]"
          style={{ opacity: 0, visibility: "hidden", willChange: "opacity, transform" }}
        >
          <ElevateScreen progress={progress} chrome={false} />
        </div>

        {/* the seam into the services: light falloff only, never a colour cut */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-50 h-[26vh]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.115 0.018 258 / 0.16) 55%, oklch(0.115 0.018 258 / 0.38) 100%)",
          }}
        />
      </div>
    </div>
  );
}

