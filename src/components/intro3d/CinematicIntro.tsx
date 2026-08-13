import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { CLOSED_END, HANDOFF_END, HANDOFF_START, clamp01, smoothstep } from "./constants";
import { useScrollTimeline } from "./useScrollTimeline";
import { ScreenInterface } from "./ScreenInterface";
import { setCinematicActive } from "@/lib/cinematic-state";

const Stage = lazy(() => import("./Stage"));

/**
 * CinematicIntro — the entrance to ELEVATE.
 *
 * CLOSED → CAMERA MOVE → HINGE OPENS → FULLY OPEN → CAMERA ENTERS THE SCREEN →
 * DEVICE DISAPPEARS → FULLSCREEN ELEVATE INTERFACE → normal website.
 *
 * Scroll is the only driver: nothing autoplays, everything reverses.
 */
export function CinematicIntro() {
  const wrap = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const takeoverRef = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const read = () => setMobile(window.innerWidth < 768);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const onTick = useCallback((p: number) => {
    if (hintRef.current) hintRef.current.style.opacity = String(1 - smoothstep(0.01, CLOSED_END * 0.4, p));
    if (takeoverRef.current) {
      // the 3D display hands over to the fullscreen layer while both are the
      // same size and the same content — no swap, no cut, no scale jump
      const inn = p >= HANDOFF_START ? 1 : 0;
      takeoverRef.current.style.opacity = String(clamp01(inn));
    }
    setCinematicActive(p < 0.995);
  }, []);

  const progress = useScrollTimeline(wrap, onTick);


  useEffect(() => {
    setCinematicActive(true);
    return () => setCinematicActive(false);
  }, []);

  return (
    <div ref={wrap} className="relative h-[760vh] md:h-[980vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#04060a]">
        <ClientOnly fallback={<div className="absolute inset-0 bg-[#04060a]" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-[#04060a]" />}>
            <Stage progress={progress} mobile={mobile} />
          </Suspense>
        </ClientOnly>

        {/* fullscreen ELEVATE interface — the screen has become the viewport */}
        <div ref={takeoverRef} className="pointer-events-none absolute inset-0" style={{ opacity: 0 }}>
          <ScreenInterface progress={progress} />
        </div>


        {/* one extremely subtle hint */}
        <div ref={hintRef} className="pointer-events-none absolute inset-x-0 bottom-8 text-center">
          <span className="text-[9px] uppercase tracking-[0.55em] text-white/30">Scroll to enter</span>
        </div>
      </div>
    </div>
  );
}
