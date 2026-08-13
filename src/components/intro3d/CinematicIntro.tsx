import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { CLOSED_END, HANDOFF_START, OPEN_END, ROTATION_END, clamp01, smoothstep } from "./constants";
import { useScrollTimeline } from "./useScrollTimeline";
import { ScreenInterface } from "./ScreenInterface";
import { setCinematicActive } from "@/lib/cinematic-state";
import { NeuralField } from "@/components/atmosphere/NeuralField";
import { stageProgress } from "./constants";

const Stage = lazy(() => import("./Stage"));

/**
 * CinematicIntro — one cinematic scene, one scroll timeline.
 *
 * Composition: the product sits slightly right of centre and stays the subject;
 * the editorial type occupies the left; the WebGL digital environment lives
 * behind both. Nothing else is on stage.
 *
 * CLOSED → CAMERA APPROACH → HINGE OPENS → ELEVATE INTERFACE → CAMERA ENTERS
 * THE DISPLAY → FULLSCREEN ELEVATE → CAMERA EXITS → LID CLOSES.
 */
export function CinematicIntro() {
  const wrap = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const takeoverRef = useRef<HTMLDivElement>(null);
  const stageWrap = useRef<HTMLDivElement>(null);
  const fieldRef = useRef(0.55);
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
      // the camera moves deeper into the world: the type recedes, softens and
      // lifts away rather than simply switching off
      introRef.current.style.opacity = String(1 - fade);
      introRef.current.style.transform = `translate3d(0, ${-fade * 46}px, 0) scale(${1 - fade * 0.06})`;
      introRef.current.style.filter = `blur(${fade * 9}px)`;
    }

    if (hintRef.current) {
      hintRef.current.style.opacity = String(1 - smoothstep(0.01, CLOSED_END * 0.4, s));
    }
    if (takeoverRef.current) {
      takeoverRef.current.style.opacity = s >= HANDOFF_START ? "1" : "0";
    }

    // the product is offset to the right while the whole device is in shot, and
    // returns to dead centre as the camera commits to the display, so the
    // fullscreen handoff still matches the frame 1:1
    if (stageWrap.current) {
      const recentre = smoothstep(OPEN_END, HANDOFF_START - 0.02, s);
      const shift = (mobile ? 0 : 10) * (1 - recentre);
      stageWrap.current.style.transform = `translate3d(${shift}%, 0, 0)`;
    }

    // the environment breathes with the scene: quiet when closed, brighter as
    // the lid opens, then drawn into darkness as the camera enters the display
    const lift = smoothstep(ROTATION_END, 0.72, s);
    const inside = smoothstep(0.8, HANDOFF_START, s);
    fieldRef.current = clamp01(0.5 + lift * 0.5) * (1 - inside * 0.9);

    setCinematicActive(p < 0.985);
  }, [mobile]);

  const progress = useScrollTimeline(wrap, onTick);

  useEffect(() => {
    setCinematicActive(true);
    return () => setCinematicActive(false);
  }, []);

  return (
    <div ref={wrap} className="relative h-[1180vh] md:h-[1420vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#05070b]">
        {/* 01 — the digital environment: WebGL depth layers, behind everything */}
        <NeuralField className="absolute inset-0 h-full w-full" progressRef={progress} intensityRef={fieldRef} />

        {/* 02 — the product; the canvas is alpha, so it composites over the field */}
        <div ref={stageWrap} className="absolute inset-0 will-change-transform">
          <ClientOnly fallback={null}>
            <Suspense fallback={null}>
              <Stage progress={progress} stage={stage} mobile={mobile} />
            </Suspense>
          </ClientOnly>
        </div>

        {/* fullscreen ELEVATE interface — the screen has become the viewport */}
        <div ref={takeoverRef} className="pointer-events-none absolute inset-0 z-20" style={{ opacity: 0 }}>
          <ScreenInterface progress={progress} />
        </div>

        {/* 03 — editorial type on the left; it never competes with the product */}
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-x-0 top-[9svh] z-20 px-7 will-change-transform md:top-[19svh] md:px-[6.5vw]"
        >
          <div className="w-full md:w-[42%] md:max-w-[34rem]">
            <p className="cine-in mb-6 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.4em] text-primary/70 md:mb-9">
              <span aria-hidden className="h-px w-9 bg-primary/40" />
              Digitální studio · Praha
            </p>
            <h1 className="text-[clamp(1.7rem,3.1vw,2.6rem)] font-light leading-[1.22] tracking-[-0.02em] text-foreground/90">
              <span className="cine-clip block">
                <span className="cine-clip-in block">Tvoříme digitální produkty,</span>
              </span>
              <span className="cine-clip block">
                <span className="cine-clip-in block" style={{ animationDelay: "0.3s" }}>
                  které dávají vašemu
                </span>
              </span>
              <span className="cine-clip block">
                <span className="cine-clip-in block" style={{ animationDelay: "0.44s" }}>
                  byznysu <span className="text-primary/90">náskok</span>.
                </span>
              </span>
            </h1>
            <div
              className="cine-in mt-9 flex max-w-sm items-start gap-4 md:mt-11"
              style={{ animationDelay: "0.66s" }}
            >
              <span aria-hidden className="mt-2 h-8 w-px shrink-0 bg-gradient-to-b from-primary/55 to-transparent" />
              <p className="text-[0.8rem] leading-[1.75] text-muted-foreground md:text-sm">
                Weby, e-shopy a digitální produkty navržené pro důvěru, výkon a růst.
              </p>
            </div>
          </div>
        </div>

        {/* 04 — one extremely quiet micro label */}
        <div ref={hintRef} className="pointer-events-none absolute inset-x-0 bottom-8 z-20 text-center">
          <span
            className="cine-in inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.42em] text-muted-foreground/80"
            style={{ animationDelay: "0.55s" }}
          >
            <span aria-hidden className="h-px w-6 bg-muted-foreground/35" />
            Scroll to enter
            <span aria-hidden className="h-px w-6 bg-muted-foreground/35" />
          </span>
        </div>
      </div>
    </div>
  );
}
