import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import deviceAsset from "@/assets/elevate-device.png.asset.json";
import { PortalLight } from "./PortalLight";
import { ServicePanels, HERO_SERVICES } from "./ServicePanels";
import { ScreenFrame } from "./ScreenFrame";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";

const Laptop3D = lazy(() => import("./Laptop3D"));

/**
 * ELEVATE HERO — the reference composition rebuilt as a live scene:
 * black cinematic environment, animated blue light portal + data streaks,
 * the real MacBook GLB with a DOM interface on its display, real typography
 * and real links. Native scroll; motion is transform/opacity only.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const panelsRef = useRef<HTMLDivElement | null>(null);
  const [heavy, setHeavy] = useState(false);

  // only bring in the 3D device after first paint (and never for reduced motion)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setTimeout(() => setHeavy(true), 250);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const p = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      p.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      p.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const stop = startFrameLoop(() => {
      p.x += (p.tx - p.x) * 0.05;
      p.y += (p.ty - p.y) * 0.05;

      const h = window.innerHeight;
      const raw = Math.min(1, Math.max(0, window.scrollY / (h * 0.95)));
      const e = raw * raw * (3 - 2 * raw);

      const device = deviceRef.current;
      if (device) {
        device.style.transform = `perspective(1800px) translate3d(${p.x * 14}px, ${
          p.y * 10 - e * h * 0.16
        }px, 0) rotateX(${p.y * 2.6 - e * 5}deg) rotateY(${p.x * -3.6 + e * 4}deg) scale(${
          1 + e * 0.08
        })`;
        device.style.opacity = `${1 - e * 0.92}`;
      }
      const light = lightRef.current;
      if (light) {
        light.style.transform = `translate3d(${p.x * -18}px, ${-e * h * 0.07}px, 0)`;
        light.style.opacity = `${1 - e * 0.8}`;
      }
      const copy = copyRef.current;
      if (copy) {
        copy.style.transform = `translate3d(0, ${-e * h * 0.11}px, 0)`;
        copy.style.opacity = `${1 - e}`;
      }
      const panels = panelsRef.current;
      if (panels) {
        panels.style.transform = `translate3d(${e * 90 + p.x * -26}px, ${-e * h * 0.05}px, 0)`;
        panels.style.opacity = `${1 - e * 0.95}`;
      }
    }, section);

    return () => {
      stop();
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-label="ELEVATE — digitální studio Praha"
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-[#02040a] pt-24 pb-16 md:pt-28"
    >
      {/* ————— live light field ————— */}
      <div ref={lightRef} className="pointer-events-none absolute inset-0 -z-10 will-change-transform">
        <PortalLight />
      </div>

      {/* core bloom behind the device */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[50%] top-[46%] -z-10 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[120px]"
        style={{ background: "radial-gradient(circle, rgba(28,88,225,0.4), rgba(2,4,10,0) 70%)" }}
      />
      {/* cinematic floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[34vh]"
        style={{
          background:
            "linear-gradient(to top, rgba(7,13,28,0.92) 0%, rgba(4,8,18,0.4) 45%, rgba(2,4,10,0) 100%)",
        }}
      />
      {/* left vignette keeps the type clean */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(110% 90% at 6% 50%, rgba(2,4,10,0.96) 0%, rgba(2,4,10,0.6) 32%, rgba(2,4,10,0) 62%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1560px] px-6 md:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,0.78fr)_minmax(0,1.22fr)]">
          {/* ————— editorial copy ————— */}
          <div ref={copyRef} className="relative z-20 will-change-transform">
            {/* numbered index rail */}
            <ul className="absolute -left-8 top-1/2 hidden -translate-y-1/2 space-y-4 xl:block">
              {HERO_SERVICES.map((s, i) => (
                <li key={s.n}>
                  <Link
                    to={s.to}
                    aria-label={s.label}
                    className={`flex items-center gap-2 text-[10px] tracking-[0.3em] transition-colors ${
                      i === 0 ? "text-foreground" : "text-muted-foreground/45 hover:text-foreground"
                    }`}
                  >
                    <span className={`h-px ${i === 0 ? "w-4 bg-primary" : "w-2.5 bg-white/25"}`} />
                    {s.n}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-primary">
              Digitální studio · Praha
            </p>

            <h1 className="mt-7 text-[clamp(2.1rem,4vw,3.6rem)] font-light leading-[1.1] tracking-[-0.02em] text-foreground">
              <span className="block">Weby, e-shopy</span>
              <span className="block">a aplikace, které</span>
              <span className="block text-primary" style={{ textShadow: "0 0 44px rgba(45,116,255,0.5)" }}>
                prodávají.
              </span>
            </h1>

            <p className="mt-8 text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
              UX / UI · Vývoj · Optimalizace
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-[13px] font-medium text-primary-foreground shadow-[0_22px_60px_-18px_oklch(0.62_0.2_260/0.95)] transition-transform duration-300 hover:scale-[1.03]"
              >
                Chci projekt
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                to="/projects"
                className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground transition-colors duration-300 hover:text-foreground"
              >
                Naše práce
              </Link>
            </div>
          </div>

          {/* ————— device + service windows ————— */}
          <div className="relative">
            <div
              ref={deviceRef}
              className="relative z-10 mx-auto aspect-[16/11] w-[min(100%,900px)] will-change-transform"
            >
              {heavy ? (
                <Suspense
                  fallback={
                    <img
                      src={deviceAsset.url}
                      alt="Ukázka webu ELEVATE na MacBooku"
                      className="h-full w-full object-contain"
                      draggable={false}
                    />
                  }
                >
                  <Laptop3D />
                </Suspense>
              ) : (
                <img
                  src={deviceAsset.url}
                  alt="Ukázka webu ELEVATE na MacBooku"
                  width={900}
                  height={620}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              )}
              {heavy && <ScreenFrame />}

              {/* contact shadow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-[14%] bottom-[3%] h-[8%] rounded-[50%] opacity-80 blur-[26px]"
                style={{ background: "radial-gradient(closest-side, rgba(0,0,0,0.85), transparent)" }}
              />
            </div>

            <div ref={panelsRef} className="absolute inset-0 z-20 will-change-transform">
              <ServicePanels />
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <span className="text-[9px] uppercase tracking-[0.44em] text-muted-foreground/70">Scroll</span>
          <span className="h-9 w-px bg-gradient-to-b from-primary/70 to-transparent" />
        </div>

        {/* bottom strip */}
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.34em] text-muted-foreground/70">
          {["Dobrý design", "Rychlý výkon", "Skvělé výsledky"].map((s, i) => (
            <li key={s} className="flex items-center gap-5">
              {s}
              {i < 2 && <span className="text-primary/70">·</span>}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
