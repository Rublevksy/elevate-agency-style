import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { PHASE, clamp01, easeFilm, range } from "./film";
import { HeroType } from "./HeroType";
import { ProductLayer } from "./ProductLayer";
import { ScreenSite } from "./ScreenSite";
import { useFilmProgress } from "./film";

const FilmScene = lazy(() => import("./FilmScene"));

/**
 * ELEVATE — CINEMATIC DEVICE FILM.
 *
 * A short scroll timeline (≈1.5 viewports) with one sticky frame:
 *   physical device → cinematic camera → digital products → website.
 * Scroll is the film: it stops when the user stops and reverses when they
 * scroll back. Nothing autoplays.
 */
export function DeviceFilm() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useFilmProgress(wrap);
  const pointer = useRef({ x: 0, y: 0 });
  const [mobile, setMobile] = useState(false);
  const full = useRef<HTMLDivElement>(null);
  const haze = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    const onMove = (e: PointerEvent) => {
      pointer.current.x = e.clientX / window.innerWidth - 0.5;
      pointer.current.y = 0.5 - e.clientY / window.innerHeight;
    };
    window.addEventListener("resize", check);
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      const p = progress.current ?? 0;
      // fullscreen ELEVATE: takes over exactly where the 3D display switches
      // off — overlapping the two would read as doubled text
      if (full.current) {
        const v = p >= PHASE.HANDOFF ? 1 : 0;
        const settle = easeFilm(range(PHASE.HANDOFF, PHASE.HANDOFF + 0.05, p));
        full.current.style.opacity = String(v);
        full.current.style.transform = `scale(${1 + (1 - settle) * 0.03})`;
        full.current.style.visibility = v < 0.01 ? "hidden" : "visible";
      }

      // the atmosphere thins as the display takes the frame
      if (haze.current) haze.current.style.opacity = String(clamp01(1 - range(PHASE.ENTER, PHASE.HANDOFF, p)));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", check);
      window.removeEventListener("pointermove", onMove);
    };
  }, [progress]);

  return (
    <div ref={wrap} className="relative h-[250vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#05070c]">
        {/* refined technology environment: near-black, graphite, thin light */}
        <div
          ref={haze}
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 52% 40%, oklch(0.28 0.06 258 / 0.28) 0%, transparent 70%), radial-gradient(90% 80% at 50% 110%, oklch(0.18 0.04 258 / 0.5) 0%, transparent 65%), linear-gradient(180deg, #05070c 0%, #05070c 60%, #070a11 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.5]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.05 0.01 258 / 0.9) 0%, oklch(0.05 0.01 258 / 0.35) 38%, transparent 62%), radial-gradient(120% 100% at 50% 50%, transparent 48%, oklch(0.03 0.01 258 / 0.75) 100%)",
          }}
        />

        <ClientOnly fallback={<div className="absolute inset-0" />}>
          <Suspense fallback={<div className="absolute inset-0" />}>
            <div className="absolute inset-0 z-10">
              <FilmScene progress={progress} pointer={pointer} mobile={mobile} />
            </div>
          </Suspense>
        </ClientOnly>

        <ProductLayer progress={progress} pointer={pointer} />
        <HeroType progress={progress} />

        {/* PHASE 04 — inside ELEVATE, fullscreen */}
        <div
          ref={full}
          className="absolute inset-0 z-40"
          style={{ opacity: 0, visibility: "hidden", willChange: "opacity, transform" }}
        >
          <ScreenSite />
        </div>
      </div>
    </div>
  );
}
