import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";

import { RibbonField } from "@/components/hero/RibbonField";
import { prefersReducedMotion } from "@/lib/raf";

const Laptop3D = lazy(() => import("@/components/hero/Laptop3D"));

const SERVICES = [
  { label: "Weby", to: "/services/web" as const },
  { label: "E-shopy", to: "/services/eshop" as const },
  { label: "Aplikace", to: "/services/web" as const },
  { label: "Design", to: "/services/design" as const },
  { label: "SEO", to: "/services/branding" as const },
];

const PAGES = ["01", "02", "03", "04"];

/**
 * ELEVATE HERO — a real, interactive cinematic scene.
 *
 * Layers, back to front: near-black void → procedural light ribbons →
 * the real MacBook GLB on a glossy reflective floor → foreground ribbons at low
 * opacity → live HTML typography on the left. Pointer drives parallax, scroll
 * drives a slow cinematic exit of the machine. Nothing here is a screenshot.
 */
export function Hero() {
  const [heavy, setHeavy] = useState(false);
  const copy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768 || prefersReducedMotion()) return;
    const id = window.setTimeout(() => setHeavy(true), 220);
    return () => window.clearTimeout(id);
  }, []);

  // gentle scroll fade of the copy — no scroll-jacking, purely opacity/translate
  useEffect(() => {
    if (typeof window === "undefined") return;
    const el = copy.current;
    if (!el) return;
    const on = () => {
      const p = Math.min(1, Math.max(0, window.scrollY / 700));
      el.style.opacity = String(1 - p * 0.95);
      el.style.transform = `translate3d(0, ${(-p * 60).toFixed(1)}px, 0)`;
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <section
      aria-label="ELEVATE — digitální studio Praha"
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-[#000103]"
    >
      {/* ————— background ribbons (far + mid) ————— */}
      <RibbonField layer="back" className="-z-20 opacity-90" />

      {/* ————— the machine, right side of the frame ————— */}
      <div className="pointer-events-none absolute inset-y-0 right-[-6%] -z-10 w-[74%] md:w-[62%] lg:w-[58%]">
        {heavy && (
          <Suspense fallback={null}>
            <Laptop3D />
          </Suspense>
        )}
      </div>

      {/* ————— foreground ribbons crossing in front, very low depth ————— */}
      <RibbonField layer="front" className="z-10 opacity-[0.38] mix-blend-screen" />

      {/* left vignette preserves the black negative space behind the type */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            "radial-gradient(120% 100% at -4% 46%, rgba(0,1,3,0.98) 0%, rgba(0,1,3,0.86) 26%, rgba(0,1,3,0.35) 52%, rgba(0,1,3,0) 70%)",
        }}
      />
      {/* top + bottom cinematic falloff */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[26vh]"
        style={{ background: "linear-gradient(to bottom, rgba(0,1,3,0.92), rgba(0,1,3,0))" }}
      />

      <div className="relative z-20 mx-auto flex w-full max-w-[1536px] items-end px-6 pb-[12vh] pt-[46vh] md:px-12 md:pb-[14vh] md:pt-[42vh]">
        <div ref={copy} className="relative max-w-[40rem] pl-5 md:pl-8 will-change-transform">
          {/* thin vertical blue light accent */}
          <span
            aria-hidden
            className="absolute left-0 top-[4%] hidden h-[74%] w-px md:block"
            style={{
              background:
                "linear-gradient(to bottom, rgba(45,116,255,0) 0%, rgba(150,199,255,0.95) 40%, rgba(45,116,255,0.5) 62%, rgba(45,116,255,0) 100%)",
              boxShadow: "0 0 28px 3px rgba(45,116,255,0.5)",
            }}
          />

          <h1 className="text-[clamp(1.2rem,1.95vw,2rem)] font-extralight uppercase leading-[1.45] tracking-[0.09em] text-foreground md:whitespace-nowrap">
            <span className="block">Digitální řešení,</span>
            <span className="block">která posouvají</span>
            <span className="block text-primary" style={{ textShadow: "0 0 42px rgba(45,116,255,0.6)" }}>
              vaše podnikání
            </span>
          </h1>

          <ul className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.32em] text-muted-foreground">
            {SERVICES.map((s, i) => (
              <li key={s.label} className="flex items-center gap-3">
                <Link to={s.to} className="transition-colors duration-300 hover:text-foreground">
                  {s.label}
                </Link>
                {i < SERVICES.length - 1 && <span className="text-primary/70">·</span>}
              </li>
            ))}
          </ul>

          <ol className="mt-14 flex items-center gap-5 text-[10px] tracking-[0.34em]">
            {PAGES.map((n, i) => (
              <li key={n} className={i === 0 ? "text-primary" : "text-muted-foreground/40"}>
                {i === 0 ? (
                  <a href="#services" className="transition-colors hover:text-primary">
                    {n}
                  </a>
                ) : (
                  n
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
