import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { Suspense, lazy, useEffect, useRef, useState } from "react";

import { FiberField } from "@/components/hero/FiberField";
import { FloorGlass } from "@/components/hero/FloorGlass";
import { prefersReducedMotion } from "@/lib/raf";

const LaptopStage = lazy(() => import("@/components/hero/LaptopStage"));

const services: { label: string; to: string }[] = [
  { label: "WEBY", to: "/services/web" },
  { label: "E-SHOPY", to: "/services/eshop" },
  { label: "APLIKACE", to: "/services" },
  { label: "DESIGN", to: "/services/design" },
  { label: "SEO", to: "/services/branding" },
];

/**
 * HERO — one physical light space, built from real layers:
 *   1. FiberField  — broad living light streams (canvas, own time loop)
 *   2. FloorGlass  — glossy wet floor reflecting those streams
 *   3. LaptopStage — the real GLB MacBook, lid opening on scroll (WebGL)
 *   4. real HTML typography, service links and CTA
 *
 * The section is a tall scroll stage with a sticky viewport, so scrolling from
 * the hero into #services drives one continuous, reversible 0 → 1 progress.
 */
export function Hero() {
  const stage = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [mount3d, setMount3d] = useState(false);

  useEffect(() => {
    // WebGL layer only after first paint, so the copy is never blocked
    const id = window.setTimeout(() => setMount3d(true), 120);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const el = section.current;
    const st = stage.current;
    if (!el || !st) return;
    let raf = 0;
    const write = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      progress.current = p;
      st.style.setProperty("--hp", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };
    write();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section
      ref={section}
      aria-label="ELEVATE — digitální studio"
      className="relative h-[220svh] bg-[#01040a]"
    >
      <div
        ref={stage}
        className="sticky top-0 h-[100svh] overflow-hidden bg-[#01040a]"
        style={{ ["--hp" as string]: 0 }}
      >
        {/* atmosphere */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(120% 90% at 74% 40%, rgba(20,58,120,0.34) 0%, rgba(3,8,18,0.2) 46%, #01040a 78%)",
          }}
        />

        {/* 1 — living light streams */}
        <FiberField progress={progress} className="absolute inset-0 h-full w-full" />

        {/* 2 — glossy floor */}
        <div aria-hidden="true" className="absolute bottom-0 left-0 h-[42%] w-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(1,4,10,0) 0%, rgba(1,4,10,0.55) 18%, #01030809 100%)",
            }}
          />
          <FloorGlass progress={progress} className="absolute inset-0 h-full w-full opacity-80" />
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{ background: "linear-gradient(90deg, transparent, rgba(120,170,255,0.22), transparent)" }}
          />
        </div>

        {/* 3 — the device: its own layer, dominant on the right */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-full md:left-[42%] md:w-[58%]"
          style={{
            transform: "translate3d(0, calc(var(--hp) * -3%), 0)",
            willChange: "transform",
          }}
        >
          {mount3d && !prefersReducedMotion() ? (
            <Suspense fallback={null}>
              <LaptopStage progress={progress} />
            </Suspense>
          ) : null}
        </div>

        {/* 4 — real content: editorial column on the left ~38 % of the stage */}
        <div className="relative z-10 h-full">
          <div
            className="absolute bottom-[16vh] left-6 w-[86%] md:left-[6.5%] md:w-[40%]"
            style={{
              transform: "translate3d(0, calc(var(--hp) * -6%), 0)",
              opacity: "calc(1 - var(--hp) * 0.85)",
              willChange: "transform, opacity",
            }}
          >
            <div className="relative pl-6 md:pl-8">

              <span
                aria-hidden="true"
                className="absolute left-0 top-1 h-[calc(100%-0.5rem)] w-px"
                style={{ background: "linear-gradient(180deg, rgba(120,170,255,0.65), rgba(120,170,255,0))" }}
              />
              <h1 className="text-[clamp(1.9rem,4.4vw,3.6rem)] font-medium leading-[1.06] tracking-[-0.035em] text-foreground">
                DIGITÁLNÍ ŘEŠENÍ,
                <br />
                KTERÁ POSOUVAJÍ
                <br />
                <span className="text-primary">VAŠE PODNIKÁNÍ</span>
              </h1>
              <Link to="/contact" className="btn-primary group mt-8 inline-flex">
                Chci projekt
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>

              <nav aria-label="Služby" className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
                {services.map((s, i) => (
                  <span key={s.label} className="flex items-center gap-4">
                    {i > 0 ? <span aria-hidden="true" className="text-[10px] text-primary/60">•</span> : null}
                    <Link
                      to={s.to}
                      className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {s.label}
                    </Link>
                  </span>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
