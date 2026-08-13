import { Suspense, lazy, useCallback, useEffect, useRef, useState } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { CLOSED_END, HANDOFF_START, ROTATION_END, clamp01, smoothstep, stageProgress } from "./constants";
import { useScrollTimeline } from "./useScrollTimeline";
import { ScreenInterface } from "./ScreenInterface";
import { setCinematicActive } from "@/lib/cinematic-state";
import { AetherField } from "@/components/atmosphere/AetherField";
import { FloatingWindows } from "./FloatingWindows";

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
        {/* 01 — deep cinematic space: a graphite gradient, no floor, no horizon */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 85% at 50% 34%, #0b1220 0%, #070b12 42%, #05070b 78%), radial-gradient(60% 45% at 22% 78%, rgba(28,52,88,0.35), transparent 70%)",
          }}
        />

        {/* 02 — atmospheric light field, truly behind the device (the canvas above is transparent) */}
        <div ref={aetherWrap} className="pointer-events-none absolute inset-0 will-change-transform">
          <AetherField className="h-full w-full" intensityRef={aether} />
        </div>

        {/* 03 — digital product windows suspended in the space behind the MacBook */}
        <FloatingWindows stage={stage} mobile={mobile} />

        {/* 04 — the MacBook itself; the canvas is alpha, so it composites over the space */}
        <ClientOnly fallback={null}>
          <Suspense fallback={null}>
            <Stage progress={progress} stage={stage} mobile={mobile} />
          </Suspense>
        </ClientOnly>

        {/* fullscreen ELEVATE interface — the screen has become the viewport */}
        <div ref={takeoverRef} className="pointer-events-none absolute inset-0 z-20" style={{ opacity: 0 }}>
          <ScreenInterface progress={progress} />
        </div>

        {/* 05 — editorial introduction, offset from centre so the device stays dominant.
            It enters as a sequence: eyebrow → statement → supporting line → hint.
            Opacity, a short lift and a touch of blur only — no bounce, no overshoot. */}
        <div
          ref={introRef}
          className="pointer-events-none absolute inset-x-0 top-[8svh] z-20 px-7 will-change-transform md:top-[13svh] md:px-[7vw]"
        >
          <div className="w-full md:w-[44%] md:max-w-[38rem]">
            <p className="cine-in mb-5 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.52em] text-primary/75 md:mb-8">
              <span aria-hidden className="h-px w-10 bg-primary/45" />
              Digitální studio
            </p>
            <h1 className="text-[clamp(1.85rem,3.9vw,3.15rem)] font-light leading-[1.08] tracking-[-0.035em] text-foreground/92">
              <span className="cine-clip block">
                <span className="cine-clip-in block">Digitální prostor,</span>
              </span>
              <span className="cine-clip block">
                <span className="cine-clip-in block" style={{ animationDelay: "0.32s" }}>
                  který pracuje
                </span>
              </span>
              <span className="cine-clip block">
                <span className="cine-clip-in block text-foreground/38" style={{ animationDelay: "0.46s" }}>
                  pro váš byznys.
                </span>
              </span>
            </h1>
            <div
              className="cine-in mt-8 flex max-w-md items-start gap-4 md:mt-10"
              style={{ animationDelay: "0.68s" }}
            >
              <span aria-hidden className="mt-2 h-8 w-px shrink-0 bg-gradient-to-b from-primary/60 to-transparent" />
              <p className="text-xs leading-relaxed text-muted-foreground md:text-sm">
                Weby, e-shopy a digitální produkty navržené tak, aby měly smysl.
              </p>
            </div>
          </div>
        </div>

        {/* one extremely subtle hint */}
        <div ref={hintRef} className="pointer-events-none absolute inset-x-0 bottom-8 z-20 text-center">
          <span
            className="cine-in inline-flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.55em] text-muted-foreground"
            style={{ animationDelay: "0.55s" }}
          >
            <span aria-hidden className="h-px w-6 bg-muted-foreground/40" />
            Scroll to enter
            <span aria-hidden className="h-px w-6 bg-muted-foreground/40" />
          </span>
        </div>

      </div>
    </div>
  );


}
