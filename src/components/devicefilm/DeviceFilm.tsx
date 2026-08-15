import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { startFrameLoop } from "@/lib/raf";

import { PHASE, easeFilm, range } from "./film";
import { HeroType } from "./HeroType";
import { Atmosphere } from "./Atmosphere";

const FilmScene = lazy(() => import("./FilmScene"));

/**
 * ELEVATE — HERO FILM (one system, one timeline).
 *
 * ~200vh of normal page scroll with a single sticky frame: the device holds a
 * finished ELEVATE interface and the camera travels into that display. At the
 * end of the shot the display light takes over the frame and the whole stage
 * lifts away, handing the page straight to the services film — no interface
 * duplicate, no card sequence, no hard cut.
 */
export function DeviceFilm() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useFilmProgressLocal(wrap);
  const pointer = useRef({ x: 0, y: 0 });
  const [mobile, setMobile] = useState(false);
  const stage = useRef<HTMLDivElement>(null);
  const light = useRef<HTMLDivElement>(null);

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
      // the display light expands into the frame, then releases into the services
      const bloom = easeFilm(range(PHASE.HANDOFF, 0.94, p));
      const release = easeFilm(range(0.86, 0.99, p));
      if (light.current) {
        light.current.style.opacity = (bloom * (1 - release)).toFixed(3);
        light.current.style.transform = `scale(${(0.6 + bloom * 1.9).toFixed(3)})`;
      }
      if (stage.current) {
        stage.current.style.opacity = (1 - release).toFixed(3);
        stage.current.style.visibility = release >= 0.995 ? "hidden" : "visible";
        stage.current.style.transform = `translate3d(0, ${(-release * 5).toFixed(2)}vh, 0) scale(${(1 + release * 0.05).toFixed(4)})`;
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
        <div
          ref={stage}
          className="absolute inset-0"
          style={{ willChange: "opacity, transform" }}
        >
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

          {/* the display light: the only transition out of the hero */}
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 z-40 h-[130vh] w-[130vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
            ref={light}
            style={{
              opacity: 0,
              background:
                "radial-gradient(circle, oklch(0.78 0.09 250 / 0.55) 0%, oklch(0.45 0.14 255 / 0.28) 38%, transparent 72%)",
              willChange: "opacity, transform",
            }}
          />
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

// keep the shared engine as the single source of progress
import { useFilmProgress as useFilmProgressLocal } from "./film";
