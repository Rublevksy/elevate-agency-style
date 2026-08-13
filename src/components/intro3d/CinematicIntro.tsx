import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { CLOSED_END, HANDOFF_START, ROTATION_END, clamp01, smoothstep, stageProgress } from "./constants";
import { useScrollTimeline } from "./useScrollTimeline";
import { ScreenInterface } from "./ScreenInterface";
import { setCinematicActive } from "@/lib/cinematic-state";
import { AetherField } from "@/components/atmosphere/AetherField";

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
  const introRef = useRef<HTMLDivElement>(null);
  const takeoverRef = useRef<HTMLDivElement>(null);
  const aetherWrap = useRef<HTMLDivElement>(null);
  const aether = useRef(0.55);
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

    const fade = smoothstep(0.005, CLOSED_END * 0.5, s);
    if (introRef.current) {
      introRef.current.style.opacity = String(1 - fade);
      introRef.current.style.transform = `translate3d(0, ${-fade * 34}px, 0)`;
      introRef.current.style.filter = `blur(${fade * 7}px)`;
    }
    if (hintRef.current) {
      hintRef.current.style.opacity = String(1 - smoothstep(0.01, CLOSED_END * 0.4, s));
    }
    if (takeoverRef.current) {
      // the 3D display and the fullscreen layer never overlap: at HANDOFF_START
      // the display already covers the frame, so one replaces the other —
      // and the same rule plays in reverse on the way out
      takeoverRef.current.style.opacity = s >= HANDOFF_START ? "1" : "0";
    }

    // the atmosphere breathes with the scene: quiet when closed, brighter as
    // the lid opens, then drawn toward the display as the camera enters it
    const lift = smoothstep(ROTATION_END, 0.72, s);
    const inside = smoothstep(0.8, HANDOFF_START, s);
    aether.current = clamp01(0.5 + lift * 0.5) * (1 - inside * 0.85);
    if (aetherWrap.current) {
      const pull = 1 + lift * 0.1 + inside * 0.28;
      aetherWrap.current.style.transform = `scale(${pull})`;
    }

    // site chrome stays hidden for the whole cinematic — inside the display the
    // interface carries its own header, so the real one would read as a double.
    // It emerges only once the sequence has fully played back out.
    setCinematicActive(p < 0.985);
  }, []);

  const progress = useScrollTimeline(wrap, onTick);

  useEffect(() => {
    setCinematicActive(true);
    return () => setCinematicActive(false);
  }, []);

  return (
    <div ref={wrap} className="relative h-[1180vh] md:h-[1420vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#05070b]">
        {/* atmosphere — lives in the space behind the device: the centre of the
            frame, where the MacBook stands, is masked out entirely */}
        <div
          ref={aetherWrap}
          className="pointer-events-none absolute inset-0 z-10 will-change-transform"
          style={{
            maskImage:
              "radial-gradient(58% 52% at 50% 54%, transparent 0%, transparent 34%, rgba(0,0,0,0.55) 62%, #000 100%)",
            WebkitMaskImage:
              "radial-gradient(58% 52% at 50% 54%, transparent 0%, transparent 34%, rgba(0,0,0,0.55) 62%, #000 100%)",
            mixBlendMode: "screen",
          }}
        >
          <AetherField className="h-full w-full" intensityRef={aether} />
        </div>

        <ClientOnly fallback={<div className="absolute inset-0 bg-[#05070b]" />}>
          <Suspense fallback={<div className="absolute inset-0 bg-[#05070b]" />}>
            <Stage progress={progress} stage={stage} mobile={mobile} />
          </Suspense>
        </ClientOnly>

        {/* fullscreen ELEVATE interface — the screen has become the viewport */}
        <div ref={takeoverRef} className="pointer-events-none absolute inset-0 z-20" style={{ opacity: 0 }}>
          <ScreenInterface progress={progress} />
        </div>

        {/* restrained introduction — reads before the first scroll, then leaves */}
        <div
          ref={introRef}
          className="pointer-events-none absolute z-20 inset-x-0 top-[13svh] px-6 text-center will-change-transform md:top-[11svh]"
        >
          <h1 className="text-[clamp(2.4rem,7vw,5.25rem)] font-light leading-[0.95] tracking-[0.24em] text-white/90">
            ELEVATE
          </h1>
          <p className="mx-auto mt-5 max-w-md text-[11px] uppercase leading-relaxed tracking-[0.22em] text-white/45 md:text-xs">
            Digitální studio pro weby, e-shopy a digitální produkty.
          </p>
        </div>

        {/* one extremely subtle hint */}
        <div ref={hintRef} className="pointer-events-none absolute inset-x-0 bottom-8 text-center">
          <span className="text-[9px] uppercase tracking-[0.55em] text-white/30">Scroll to enter</span>
        </div>
      </div>
    </div>
  );

}
