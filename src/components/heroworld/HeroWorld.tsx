import { useCallback, useEffect, useRef } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { DigitalEnvironment } from "./DigitalEnvironment";
import { DigitalPortal } from "./DigitalPortal";
import { HeroTypography } from "./HeroTypography";
import { HeroInteractionLayer } from "./HeroInteractionLayer";

/**
 * HeroWorld — the ELEVATE digital world.
 *
 * A single sticky cinematic viewport: the digital environment (WebGL depth
 * layers) behind, the interface core in the middle of the frame, editorial type
 * on the left and one quiet interaction prompt. Everything moves from cursor and
 * scroll only. The visitor arrives, discovers depth, then is invited in.
 */
export function HeroWorld() {
  const wrap = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const intensity = useRef(1);

  const onScroll = useCallback(() => {
    const el = wrap.current;
    if (!el) return;
    const total = el.offsetHeight - window.innerHeight;
    const p = total > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)) : 0;
    progress.current = p;
    intensity.current = 1 - p * 0.55;
    if (content.current) {
      const fade = Math.min(1, p * 1.9);
      content.current.style.opacity = String(1 - fade);
      content.current.style.transform = `translate3d(0, ${-fade * 40}px, 0)`;
      content.current.style.filter = `blur(${fade * 7}px)`;
    }
  }, []);

  useEffect(() => {
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [onScroll]);

  return (
    <div ref={wrap} className="relative h-[190vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#04060a]">
        <ClientOnly fallback={<div className="absolute inset-0 bg-[#04060a]" />}>
          <DigitalEnvironment
            className="absolute inset-0 h-full w-full"
            progressRef={progress}
            intensityRef={intensity}
          />
          <DigitalPortal className="absolute inset-0 md:left-[16%]" progressRef={progress} />
        </ClientOnly>

        {/* vignette keeps the frame cinematic and the type legible */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 45%, transparent 40%, oklch(0.04 0.01 258 / 0.68) 100%), linear-gradient(90deg, oklch(0.04 0.01 258 / 0.6) 0%, transparent 46%)",
          }}
        />

        <div
          ref={content}
          className="absolute inset-0 z-10 flex items-center px-7 will-change-transform md:px-[6.5vw]"
        >
          <div>
            <HeroTypography />
            <div className="pointer-events-auto">
              <HeroInteractionLayer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
