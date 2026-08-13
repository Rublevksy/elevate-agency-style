import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { CLOSED_END, HANDOFF_START, smoothstep, stageProgress } from "./constants";
import { useScrollTimeline } from "./useScrollTimeline";
import { ScreenInterface } from "./ScreenInterface";
import { setCinematicActive } from "@/lib/cinematic-state";

const Stage = lazy(() => import("./Stage"));

/**
 * CinematicIntro — the ELEVATE cinematic, one scene and one timeline.
 *
 * CLOSED → CAMERA APPROACH → HINGE OPENS → ELEVATE INTERFACE → CAMERA ENTERS
 * THE DISPLAY → FULLSCREEN ELEVATE (disciplines) → CAMERA EXITS → DEVICE
 * RE-FORMS → LID CLOSES.
 *
 * Scroll is the only driver: nothing autoplays, everything reverses.
 */
export function CinematicIntro() {
  const wrap = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const takeoverRef = useRef<HTMLDivElement>(null);
  const stage = useRef(0);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const read = () => setMobile(window.innerWidth < 768);
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const onTick = useCallback((p: number) => {
    const s = stageProgress(p);
    stage.current = s;

    if (hintRef.current) {
      hintRef.current.style.opacity = String(1 - smoothstep(0.01, CLOSED_END * 0.4, s));
    }
    if (takeoverRef.current) {
      // the 3D display and the fullscreen layer never overlap: at HANDOFF_START
      // the display already covers the frame, so one replaces the other —
      // and the same rule plays in reverse on the way out
      takeoverRef.current.style.opacity = s >= HANDOFF_START ? "1" : "0";
    }
    // site chrome stays hidden while the device owns the frame; it emerges only
    // once the interface itself is the viewport
    setCinematicActive(s < HANDOFF_START);
  }, []);

  const progress = useScrollTimeline(wrap, onTick);

  useEffect(() => {
    setCinematicActive(true);
    return () => setCinematicActive(false);
  }, []);

  return (
    <div ref={wrap} className="relative h-[1180vh] md:h-[1420vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#020407]">
        <ClientOnly fallback={<div className="absolute inset-0 bg-[#020407]" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-[#020407]" />}>
            <Stage progress={progress} stage={stage} mobile={mobile} />
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
