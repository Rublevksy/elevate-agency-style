import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import laptopLarge from "@/assets/elevate-laptop-1120.webp.asset.json";
import laptopSmall from "@/assets/elevate-laptop-520.webp.asset.json";
import markAsset from "@/assets/elevate-a-mark.png.asset.json";
import { Logo } from "@/components/Logo";
import { HeroLight } from "@/components/hero/HeroLight";
import { ProductScreen } from "@/components/hero/ProductScreen";
import { setCinematicActive } from "@/lib/cinematic-state";

/**
 * ELEVATE HERO — one continuous product film, built entirely from DOM.
 *
 * A tall wrapper provides the scroll length, a single sticky stage holds the
 * frame. One passive scroll listener, throttled through requestAnimationFrame,
 * writes three CSS custom properties (`--film`, `--film-light`, `--film-reveal`)
 * on the stage. Every moving layer reads those variables, so progress is fully
 * deterministic and scrolling back reverses the film exactly — including closing
 * the machine back to its opening state. There is no idle animation loop, no
 * WebGL, and no filter stack.
 */

const SERVICES = [
  { label: "Weby", to: "/services/web" as const },
  { label: "E-shopy", to: "/services/eshop" as const },
  { label: "Aplikace", to: "/services/web" as const },
  { label: "Design", to: "/services/design" as const },
  { label: "SEO", to: "/services/branding" as const },
];

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);
const range = (from: number, to: number, value: number) => clamp01((value - from) / (to - from));
const ease = (value: number) => value * value * (3 - 2 * value);

export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let cinematic = false;

    const apply = (film: number) => {
      stage.style.setProperty("--film", film.toFixed(4));
      stage.style.setProperty("--film-light", ease(range(0, 0.85, film)).toFixed(4));
      stage.style.setProperty("--film-reveal", ease(range(0.34, 0.78, film)).toFixed(4));
      const next = film < 0.9;
      if (next !== cinematic) {
        cinematic = next;
        setCinematicActive(next);
      }
    };

    const update = () => {
      frame = 0;
      if (reduceQuery.matches) {
        apply(0);
        return;
      }
      const distance = wrap.offsetHeight - window.innerHeight;
      const film = distance > 0 ? clamp01(-wrap.getBoundingClientRect().top / distance) : 0;
      apply(ease(film));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reduceQuery.addEventListener("change", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduceQuery.removeEventListener("change", schedule);
      setCinematicActive(false);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[100svh] md:h-[260vh]">
      <section
        ref={stageRef}
        aria-label="ELEVATE — digitální studio"
        className="sticky top-0 h-[100svh] overflow-hidden bg-background"
      >
        <HeroLight className="opacity-90" />

        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-full md:w-[56%]"
          style={{
            background:
              "linear-gradient(180deg, var(--background) 0%, oklch(0.115 0.018 258 / 0.72) 46%, var(--background) 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[2] hidden w-[58%] md:block"
          style={{
            background:
              "linear-gradient(90deg, var(--background) 0%, oklch(0.115 0.018 258 / 0.96) 38%, oklch(0.115 0.018 258 / 0.55) 74%, transparent 100%)",
          }}
        />

        {/* the product — first paint shows it immediately, scroll moves it */}
        <div
          className="pointer-events-none absolute bottom-[16vh] left-1/2 z-[3] w-[104vw] max-w-[560px] -translate-x-1/2 md:bottom-[7vh] md:left-auto md:right-[2%] md:w-[54vw] md:max-w-[900px] md:translate-x-0"
          style={{
            transform:
              "translate3d(calc(var(--film, 0) * -6%), calc(var(--film, 0) * 7vh), 0) scale(calc(1 + var(--film, 0) * 0.12))",
          }}
        >
          <div className="relative">
            <img
              src={laptopLarge.url}
              srcSet={`${laptopSmall.url} 520w, ${laptopLarge.url} 1120w`}
              sizes="(max-width: 767px) 100vw, 54vw"
              alt="Notebook s digitálním produktem od studia ELEVATE"
              width={1120}
              height={738}
              fetchPriority="high"
              decoding="async"
              className="block h-auto w-full"
              style={{ aspectRatio: "1120 / 738" }}
            />

            {/* brand emblem milled into the lid */}
            <img
              src={markAsset.url}
              alt=""
              aria-hidden
              width={64}
              height={64}
              loading="lazy"
              decoding="async"
              className="absolute right-[28%] top-[42%] h-auto w-[4%] opacity-80"
            />

            {/* the interfaces rising out of the display */}
            <div className="absolute left-[46%] top-[16%] h-[42%] w-[46%]">
              <ProductScreen />
            </div>
          </div>

          {/* contact shadow + restrained floor reflection, no blur stack */}
          <div
            aria-hidden
            className="mx-auto h-[6vh] w-[74%] rounded-[50%]"
            style={{ background: "radial-gradient(ellipse at center, oklch(0 0 0 / 0.85) 0%, transparent 72%)" }}
          />
          <div
            aria-hidden
            className="mx-auto -mt-[5vh] hidden h-[12vh] w-[66%] scale-y-[-1] md:block"
            style={{
              background: "linear-gradient(to bottom, oklch(0.65 0.18 255 / 0.14), transparent 76%)",
              opacity: "calc(0.7 - var(--film, 0) * 0.7)",
            }}
          />
        </div>

        {/* minimal opening frame: brand + restrained copy only */}
        <div
          className="relative z-10 mx-auto flex h-full w-full max-w-[1536px] flex-col justify-between px-7 pb-[10vh] pt-8 md:px-12 md:pb-[9vh] lg:px-[6.4vw]"
          style={{ opacity: "calc(1 - var(--film-reveal, 0) * 0.92)" }}
        >
          <Link to="/" aria-label="ELEVATE" className="w-fit transition-opacity hover:opacity-70">
            <Logo className="h-5 w-auto md:h-6" />
          </Link>

          <div className="relative max-w-[590px] pl-6 md:pl-8">
            <span
              aria-hidden
              className="absolute bottom-[4%] left-0 top-[3%] hidden w-px md:block"
              style={{
                background:
                  "linear-gradient(to bottom, transparent, oklch(0.85 0.1 250) 34%, oklch(0.65 0.18 255) 64%, transparent)",
              }}
            />

            <h1 className="text-[clamp(1.15rem,1.85vw,1.78rem)] font-extralight uppercase leading-[1.5] tracking-[0.09em] text-foreground">
              <span className="block">Digitální řešení,</span>
              <span className="block">která posouvají</span>
              <span className="block text-primary">vaše podnikání</span>
            </h1>

            <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              {SERVICES.map((service, index) => (
                <li key={service.label} className="flex items-center gap-3">
                  <Link to={service.to} className="transition-colors hover:text-foreground">
                    {service.label}
                  </Link>
                  {index < SERVICES.length - 1 && <span className="text-primary">·</span>}
                </li>
              ))}
            </ul>

            <a
              href="#services"
              className="mt-11 inline-block text-[9px] uppercase tracking-[0.3em] text-muted-foreground/70 transition-colors hover:text-primary"
            >
              01 — služby
            </a>
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-24"
          style={{
            background: "linear-gradient(to top, var(--background), transparent)",
            opacity: "var(--film-reveal, 0)",
          }}
        />
      </section>
    </div>
  );
}
