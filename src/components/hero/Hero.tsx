import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef } from "react";

import heroStage from "@/assets/elevate-hero-stage.png.asset.json";
import { setCinematicActive } from "@/lib/cinematic-state";

const clamp01 = (value: number) => (value < 0 ? 0 : value > 1 ? 1 : value);

/**
 * Hero = the approved ELEVATE master artwork (device + light ring + service
 * cards) as the exact base graphic layer on the right, with real HTML
 * typography and links on the left. Live enhancement is limited to pointer
 * parallax and a scroll transform — the resting look equals the artwork.
 */
export function Hero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const stage = stageRef.current;
    if (!wrap || !stage) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let px = 0;
    let py = 0;

    const update = () => {
      frame = 0;
      const rect = wrap.getBoundingClientRect();
      const distance = wrap.offsetHeight - window.innerHeight;
      const progress = reducedMotion.matches || distance <= 0 ? 0 : clamp01(-rect.top / distance);
      stage.style.setProperty("--hero-scroll", progress.toFixed(4));
      stage.style.setProperty("--hero-px", px.toFixed(3));
      stage.style.setProperty("--hero-py", py.toFixed(3));
    };

    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    const onPointer = (event: PointerEvent) => {
      if (reducedMotion.matches) return;
      px = (event.clientX / window.innerWidth - 0.5) * 2;
      py = (event.clientY / window.innerHeight - 0.5) * 2;
      schedule();
    };

    update();
    setCinematicActive(false);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    reducedMotion.addEventListener("change", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pointermove", onPointer);
      reducedMotion.removeEventListener("change", schedule);
    };
  }, []);

  return (
    <div ref={wrapRef} className="relative h-[100svh] md:h-[130svh]">
      <section
        ref={stageRef}
        aria-label="ELEVATE — digitální studio"
        className="sticky top-0 h-[100svh] overflow-hidden bg-background"
      >
        {/* exact master artwork — base graphic layer, right side of the composition */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-full md:w-[68%]">
          <img
            src={heroStage.url}
            alt="ELEVATE — MacBook s ukázkou webu, e-shopu a aplikací"
            width={988}
            height={746}
            fetchPriority="high"
            decoding="sync"
            className="hero-master absolute left-1/2 top-[54%] w-[126%] max-w-none -translate-x-1/2 -translate-y-1/2 md:top-1/2 md:w-[104%]"
          />
        </div>

        {/* soft edge blends so the artwork sits in the black space */}
        <div aria-hidden className="hero-scrim-left pointer-events-none absolute inset-y-0 left-0 z-[2] w-full md:w-[46%]" />
        <div aria-hidden className="hero-scrim-bottom pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[14%]" />

        {/* real, clickable content aligned to the master composition */}
        <div className="relative z-10 mx-auto h-full w-full max-w-[1536px]">
          <div className="absolute left-6 top-[21%] w-[90%] max-w-[420px] md:left-[5.6%] md:top-[27%] md:w-[36%] md:max-w-[460px]">
            <p className="text-[10px] uppercase tracking-[0.3em] text-primary">Digitální studio · Praha</p>

            <h1 className="mt-5 text-[2rem] font-medium leading-[1.1] tracking-[-0.02em] text-foreground md:mt-6 md:text-[2.6rem] lg:text-[3.1rem]">
              <span className="block">Weby, e-shopy</span>
              <span className="block">a aplikace, které</span>
              <span className="block text-primary">prodávají.</span>
            </h1>

            <p className="mt-6 text-[10px] uppercase tracking-[0.26em] text-muted-foreground md:mt-7">
              UX <span className="text-primary/70">·</span> UI <span className="text-primary/70">·</span> Vývoj{" "}
              <span className="text-primary/70">·</span> Optimalizace
            </p>

            <Link to="/contact" className="btn-primary group mt-8 inline-flex md:mt-10">
              Chci projekt
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* section index, as in the master */}
          <div
            aria-hidden
            className="absolute left-[1.4%] top-[33%] hidden flex-col gap-4 text-[10px] tracking-[0.24em] md:flex"
          >
            {["01", "02", "03", "04", "05"].map((n, i) => (
              <span key={n} className="flex items-center gap-2">
                <span className={i === 0 ? "h-px w-3 bg-primary" : "h-px w-3 bg-muted-foreground/40"} />
                <span className={i === 0 ? "text-foreground" : "text-muted-foreground/60"}>{n}</span>
              </span>
            ))}
          </div>

          <p
            aria-hidden
            className="absolute inset-x-0 bottom-[6%] hidden text-center text-[10px] uppercase tracking-[0.34em] text-muted-foreground md:block"
            style={{ opacity: "calc(1 - var(--hero-scroll, 0) * 2)" }}
          >
            Dobrý design <span className="text-primary/70">·</span> Rychlý výkon{" "}
            <span className="text-primary/70">·</span> Skvělé výsledky
          </p>
        </div>
      </section>
    </div>
  );
}
