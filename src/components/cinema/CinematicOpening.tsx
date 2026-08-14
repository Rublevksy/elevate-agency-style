import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useCinemaProgress } from "./progress";
import { CinemaTypography } from "./CinemaTypography";
import { InterfaceReveal } from "./InterfaceReveal";

const CinemaScene = lazy(() => import("./CinemaScene"));

/**
 * CINEMATIC OPENING — the authoritative ELEVATE homepage introduction.
 *
 * A tall scroll container with one sticky viewport. Scroll is the timeline and
 * feeds a single progress value into the camera, the artifact, the environment,
 * the typography and the final interface reveal. Nothing autoplays; the whole
 * shot reverses perfectly.
 */
export function CinematicOpening() {
  const wrap = useRef<HTMLDivElement>(null);
  const { progress } = useCinemaProgress(wrap);
  const pointer = useRef({ x: 0, y: 0 });
  const [mobile, setMobile] = useState(false);
  const scrim = useRef<HTMLDivElement>(null);
  const cue = useRef<HTMLDivElement>(null);

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
      const p = progress.current;
      if (scrim.current) scrim.current.style.opacity = String(Math.max(0, 1 - p * 2.6));
      if (cue.current) cue.current.style.opacity = String(Math.max(0, 1 - p * 8));
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
    <div ref={wrap} className="relative h-[420vh] md:h-[520vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#04060a]">
        <ClientOnly fallback={<div className="absolute inset-0 bg-[#04060a]" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-[#04060a]" />}>
            <div className="absolute inset-0">
              <CinemaScene progressRef={progress} pointerRef={pointer} mobile={mobile} />
            </div>
          </Suspense>
        </ClientOnly>

        {/* cinematic grade: side scrim for type legibility + edge vignette */}
        <div
          ref={scrim}
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, oklch(0.04 0.01 258 / 0.86) 0%, oklch(0.04 0.01 258 / 0.35) 38%, transparent 62%), radial-gradient(120% 100% at 50% 50%, transparent 45%, oklch(0.03 0.01 258 / 0.7) 100%)",
          }}
        />

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-7 md:px-[6.5vw]">
          <CinemaTypography progressRef={progress} />
        </div>

        <InterfaceReveal progressRef={progress} />

        <div
          ref={cue}
          aria-hidden
          className="pointer-events-none absolute bottom-8 left-1/2 z-20 -translate-x-1/2 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/70"
        >
          Scroll
        </div>
      </div>
    </div>
  );
}
