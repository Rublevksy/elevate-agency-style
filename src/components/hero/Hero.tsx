import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import laptopLarge from "@/assets/elevate-laptop-1120.webp.asset.json";
import laptopSmall from "@/assets/elevate-laptop-520.webp.asset.json";
import markAsset from "@/assets/elevate-mark-small.webp.asset.json";
import { Logo } from "@/components/Logo";
import { setCinematicActive } from "@/lib/cinematic-state";

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const distance = wrap.offsetHeight - window.innerHeight;
      const progress = reducedMotion.matches || distance <= 0 ? 0 : clamp01(-rect.top / distance);
      stage.style.setProperty("--hero-scroll", progress.toFixed(4));
      setCinematicActive(rect.top <= 0 && rect.bottom > window.innerHeight * 0.3);
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reducedMotion.addEventListener("change", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reducedMotion.removeEventListener("change", schedule);
      setCinematicActive(false);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[100svh] md:h-[138svh]">
      <section
        ref={stageRef}
        aria-label="ELEVATE — digitální studio"
        className="sticky top-0 h-[100svh] overflow-hidden bg-background"
      >
        <div aria-hidden className="hero-device-light pointer-events-none absolute inset-0" />

        <div
          className="hero-device pointer-events-none absolute left-1/2 top-[56%] z-[3] w-[132vw] max-w-[700px] md:left-auto md:right-[-10vw] md:top-1/2 md:w-[75vw] md:max-w-[1200px]"
        >
          <div className="relative">
            <img
              src={laptopLarge.url}
              srcSet={`${laptopSmall.url} 520w, ${laptopLarge.url} 1120w`}
              sizes="(max-width: 767px) 128vw, 76vw"
              alt="MacBook s identitou digitálního studia ELEVATE"
              width={1120}
              height={738}
              fetchPriority="high"
              decoding="sync"
              className="block h-auto w-full"
            />
            <img
              src={markAsset.url}
              alt=""
              aria-hidden
              width={128}
              height={128}
              decoding="async"
              className="absolute right-[26.5%] top-[40%] h-auto w-[6%] opacity-70"
            />
          </div>
          <div aria-hidden className="hero-device-shadow mx-auto -mt-[4%] h-[8vh] w-[72%]" />
        </div>

        <div
          className="relative z-10 mx-auto h-full w-full max-w-[1600px] px-6 pt-7 md:px-12 md:pt-10 lg:px-[5.5vw]"
          style={{
            opacity: "calc(1 - var(--hero-scroll, 0) * 0.32)",
            transform: "translate3d(0, calc(var(--hero-scroll, 0) * -2vh), 0)",
          }}
        >
          <Link to="/" aria-label="ELEVATE" className="inline-block transition-opacity hover:opacity-70">
            <Logo className="h-6 w-auto md:h-8" />
          </Link>

          <div className="absolute left-6 top-[17%] w-[88%] max-w-[340px] md:left-12 md:top-[38%] md:w-[34%] md:max-w-[500px] lg:left-[5.5vw]">
            <h1 className="text-4xl font-normal leading-[1.08] text-foreground md:text-5xl lg:text-6xl">
              <span className="block">Tvoříme digitální</span>
              <span className="block">produkty, které</span>
              <span className="block text-primary">posouvají značky.</span>
            </h1>
            <p className="mt-6 max-w-[370px] text-sm leading-6 text-muted-foreground md:mt-8 md:text-base md:leading-7">
              Design a vývoj pro firmy, které nechtějí splynout s průměrem.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}