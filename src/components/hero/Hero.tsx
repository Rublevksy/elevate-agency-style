import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import laptopLarge from "@/assets/elevate-laptop-1120.webp.asset.json";
import laptopSmall from "@/assets/elevate-laptop-520.webp.asset.json";
import markAsset from "@/assets/elevate-mark-small.webp.asset.json";
import { Logo } from "@/components/Logo";
import { FiberField } from "@/components/hero/FiberField";
import { setCinematicActive } from "@/lib/cinematic-state";

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

const SERVICES = ["Weby", "E-shopy", "Aplikace", "Design", "SEO"];

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
        {/* cool atmospheric pool behind the device */}
        <div aria-hidden className="hero-device-light pointer-events-none absolute inset-0 z-[1]" />

        {/* live fiber-optic light field */}
        <FiberField className="hero-fiber pointer-events-none absolute inset-x-0 top-[8%] z-[2] h-[74%] w-full" />

        {/* the device — dominant object on the right */}
        <div className="hero-device pointer-events-none absolute left-1/2 top-[54%] z-[3] w-[136vw] max-w-[720px] md:left-auto md:right-[-2vw] md:top-[54%] md:w-[60vw] md:max-w-[1120px]">
          <div className="relative">
            <img
              src={laptopLarge.url}
              srcSet={`${laptopSmall.url} 520w, ${laptopLarge.url} 1120w`}
              sizes="(max-width: 767px) 132vw, 62vw"
              alt="MacBook s identitou digitálního studia ELEVATE"
              width={1120}
              height={738}
              fetchPriority="high"
              decoding="sync"
              className="hero-device-img block h-auto w-full"
            />
            <img
              src={markAsset.url}
              alt=""
              aria-hidden
              width={128}
              height={128}
              decoding="async"
              className="absolute right-[26.5%] top-[40%] h-auto w-[6.5%] opacity-70"
            />
            {/* glossy floor reflection */}
            <img
              src={laptopLarge.url}
              alt=""
              aria-hidden
              width={1120}
              height={738}
              decoding="async"
              className="hero-device-reflection absolute inset-x-0 top-full block h-auto w-full"
            />
          </div>
          <div aria-hidden className="hero-device-shadow mx-auto -mt-[6%] h-[9vh] w-[68%]" />
        </div>

        {/* editorial left column */}
        <div
          className="relative z-10 mx-auto h-full w-full max-w-[1600px] px-6 pt-7 md:px-12 md:pt-10 lg:px-[5.2vw]"
          style={{
            opacity: "calc(1 - var(--hero-scroll, 0) * 0.32)",
            transform: "translate3d(0, calc(var(--hero-scroll, 0) * -2vh), 0)",
          }}
        >
          <Link to="/" aria-label="ELEVATE" className="inline-block transition-opacity hover:opacity-70">
            <Logo className="h-7 w-auto md:h-9 lg:h-10" />
          </Link>

          {/* thin vertical light accent */}
          <div aria-hidden className="hero-accent-line absolute left-4 top-[28%] hidden h-[48%] w-px md:block lg:left-[3.2vw]" />

          <div className="absolute left-6 top-[19%] w-[88%] max-w-[360px] md:left-12 md:top-[34%] md:w-[36%] md:max-w-[460px] lg:left-[5.2vw]">
            <h1 className="text-[1.75rem] font-light uppercase leading-[1.18] tracking-[0.06em] text-foreground md:text-[2.1rem] lg:text-[2.6rem]">
              <span className="block">Digitální řešení,</span>
              <span className="block">která posouvají</span>
              <span className="block text-primary">vaše podnikání</span>
            </h1>

            <ul className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground md:mt-14">
              {SERVICES.map((service, i) => (
                <li key={service} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden className="h-1 w-1 rounded-full bg-primary/80" />}
                  <span>{service}</span>
                </li>
              ))}
            </ul>
          </div>

          <div
            aria-hidden
            className="absolute bottom-[8%] left-6 hidden gap-6 text-[11px] tracking-[0.3em] md:flex lg:left-[5.2vw]"
          >
            <span className="text-primary">01</span>
            <span className="text-muted-foreground/60">02</span>
            <span className="text-muted-foreground/60">03</span>
            <span className="text-muted-foreground/60">04</span>
          </div>
        </div>
      </section>
    </div>
  );
}
