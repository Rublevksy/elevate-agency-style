import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { PHASE, clamp01, easeFilm, range } from "./film";
import { HeroType } from "./HeroType";
import { ProductLayer } from "./ProductLayer";
import { Atmosphere } from "./Atmosphere";
import { WorkspaceDisplay } from "./WorkspaceDisplay";
import { useFilmProgress } from "./film";

const FilmScene = lazy(() => import("./FilmScene"));

/**
 * ELEVATE — CINEMATIC DEVICE FILM.
 *
 * A short scroll timeline (≈2.5 viewports) with one sticky frame:
 * physical device → cinematic camera → digital products → the workspace itself.
 * Scroll is the film: it stops when the user stops and reverses when they
 * scroll back. Nothing autoplays.
 *
 * The closing beat does not cut: the interface keeps travelling toward the lens
 * while the environment stays, so the next section emerges from the same world.
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
      // fullscreen workspace: takes over exactly where the 3D display switches
      // off — overlapping the two would read as doubled interface
      if (full.current) {
        const v = p >= PHASE.HANDOFF ? 1 : 0;
        const settle = easeFilm(range(PHASE.HANDOFF, PHASE.HANDOFF + 0.04, p));
        // the camera keeps moving through the interface into the next section
        const exit = easeFilm(range(0.955, 1, p));
        full.current.style.opacity = String(v * (1 - exit));
        full.current.style.transform = `perspective(1400px) scale(${1 + (1 - settle) * 0.03 + exit * 0.14}) translate3d(0, ${-exit * 6}vh, 0)`;
        full.current.style.filter = `blur(${(exit * 18).toFixed(2)}px)`;
        full.current.style.visibility = v < 0.01 ? "hidden" : "visible";
      }

      // the atmosphere thins as the display takes the frame, then returns for
      // the handover so the environment is continuous across the section seam
      if (haze.current) {
        const enter = range(PHASE.ENTER, PHASE.HANDOFF, p);
        const back = range(0.95, 1, p);
        haze.current.style.opacity = String(clamp01(1 - enter * 0.75 + back * 0.75));
      }
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
        {/* refined technology environment: near-black navy, graphite, thin light */}
        <div
          ref={haze}
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 52% 40%, oklch(0.28 0.06 258 / 0.28) 0%, transparent 70%), radial-gradient(90% 80% at 50% 110%, oklch(0.18 0.04 258 / 0.5) 0%, transparent 65%), linear-gradient(180deg, #05070c 0%, #05070c 60%, #04060a 100%)",
          }}
        />

        {/* layered digital infrastructure: wireframes, lines, data points */}
        <Atmosphere progress={progress} pointer={pointer} mobile={mobile} />

        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.42]"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.05 0.01 258 / 0.85) 0%, oklch(0.05 0.01 258 / 0.3) 38%, transparent 62%), radial-gradient(120% 100% at 50% 50%, transparent 48%, oklch(0.03 0.01 258 / 0.7) 100%)",
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

        {/* PHASE 04 — inside the workspace, fullscreen */}
        <div
          ref={full}
          className="absolute inset-0 z-40"
          style={{ opacity: 0, visibility: "hidden", willChange: "opacity, transform, filter" }}
        >
          <WorkspaceDisplay progress={progress} chrome={false} />
        </div>

        {/* the seam into the next section: same environment, no colour cut */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 z-50 h-[26vh]"
          style={{ background: "linear-gradient(180deg, transparent 0%, #04060a 92%)" }}
        />
      </div>
    </div>
  );
}

