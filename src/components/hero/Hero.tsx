import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import deviceAsset from "@/assets/elevate-device.png.asset.json";
import { RibbonField } from "./RibbonField";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";

const Laptop3D = lazy(() => import("./Laptop3D"));

const SERVICES = [
  { label: "Weby", to: "/services/web" as const },
  { label: "E-shopy", to: "/services/eshop" as const },
  { label: "Aplikace", to: "/services/web" as const },
  { label: "Design", to: "/services/design" as const },
  { label: "SEO", to: "/services/branding" as const },
];

const PAGES = ["01", "02", "03", "04"];

/**
 * ELEVATE HERO — the reference composition as a live scene:
 * near-black cinematic environment, animated blue/white light ribbons, the real
 * MacBook GLB on the right at a 3/4 rear angle, and real HTML typography on the
 * left. Native scroll; motion is transform/opacity only.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);
  const lightRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);
  const [heavy, setHeavy] = useState(false);

  // bring in the 3D device only after first paint (never for reduced motion)
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const id = window.setTimeout(() => setHeavy(true), 220);
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
        device.style.transform = `perspective(1800px) translate3d(${p.x * 8}px, ${
          p.y * 6 - e * h * 0.14
        }px, 0) rotateX(${p.y * 1.6 - e * 4}deg) rotateY(${p.x * -2.2 + e * 4}deg) scale(${1 + e * 0.07})`;
        device.style.opacity = `${1 - e * 0.9}`;
      }
      const light = lightRef.current;
      if (light) {
        light.style.transform = `translate3d(${p.x * -6}px, ${-e * h * 0.05}px, 0)`;
        light.style.opacity = `${1 - e * 0.75}`;
      }
      const copy = copyRef.current;
      if (copy) {
        copy.style.transform = `translate3d(0, ${-e * h * 0.1}px, 0)`;
        copy.style.opacity = `${1 - e}`;
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
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-[#010307]"
    >
      {/* ————— live light ribbons ————— */}
      <div ref={lightRef} className="pointer-events-none absolute inset-0 -z-10 will-change-transform">
        <RibbonField />
      </div>

      {/* atmospheric bloom behind the device */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[68%] top-[48%] -z-10 h-[75vh] w-[75vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[130px]"
        style={{ background: "radial-gradient(circle, rgba(24,84,220,0.38), rgba(1,3,7,0) 70%)" }}
      />
      {/* glossy dark floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[30vh]"
        style={{
          background:
            "linear-gradient(to top, rgba(5,10,22,0.95) 0%, rgba(3,6,14,0.5) 50%, rgba(1,3,7,0) 100%)",
        }}
      />
      {/* left vignette keeps the type clean */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(105% 95% at 4% 50%, rgba(1,3,7,0.97) 0%, rgba(1,3,7,0.66) 34%, rgba(1,3,7,0) 64%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1536px] px-6 md:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]">
          {/* ————— editorial copy ————— */}
          <div ref={copyRef} className="relative z-20 py-20 pl-6 will-change-transform lg:py-28 lg:pl-10">
            {/* thin vertical blue light accent */}
            <span
              aria-hidden
              className="absolute left-0 top-[8%] hidden h-[74%] w-px md:block"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(45,116,255,0) 0%, rgba(120,180,255,0.9) 42%, rgba(45,116,255,0.55) 58%, rgba(45,116,255,0) 100%)",
                boxShadow: "0 0 26px 3px rgba(45,116,255,0.45)",
              }}
            />

            <h1 className="text-[clamp(1.4rem,2.15vw,2.15rem)] font-extralight uppercase leading-[1.4] tracking-[0.07em] whitespace-nowrap text-foreground">
              <span className="block">Digitální řešení,</span>
              <span className="block">která posouvají</span>
              <span className="block text-primary" style={{ textShadow: "0 0 40px rgba(45,116,255,0.55)" }}>
                vaše podnikání
              </span>
            </h1>

            <ul className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {SERVICES.map((s, i) => (
                <li key={s.label} className="flex items-center gap-3">
                  <Link to={s.to} className="transition-colors duration-300 hover:text-foreground">
                    {s.label}
                  </Link>
                  {i < SERVICES.length - 1 && <span className="text-primary/80">·</span>}
                </li>
              ))}
            </ul>

            {/* page indicator */}
            <ol className="mt-16 flex items-center gap-5 text-[10px] tracking-[0.34em]">
              {PAGES.map((n, i) => (
                <li key={n} className={i === 0 ? "text-primary" : "text-muted-foreground/45"}>
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

          {/* ————— device layer ————— */}
          <div className="relative">
            <div
              ref={deviceRef}
              className="relative z-10 ml-auto aspect-[16/10] w-[min(112%,960px)] translate-x-[3%] translate-y-[4%] will-change-transform"
            >
              {heavy ? (
                <Suspense
                  fallback={
                    <img
                      src={deviceAsset.url}
                      alt="MacBook s webem od studia ELEVATE"
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
                  alt="MacBook s webem od studia ELEVATE"
                  width={1000}
                  height={625}
                  fetchPriority="high"
                  decoding="async"
                  className="h-full w-full object-contain"
                  draggable={false}
                />
              )}

              {/* floor reflection: mirrored device, faded into the glossy floor */}
              <img
                aria-hidden
                src={deviceAsset.url}
                alt=""
                className="pointer-events-none absolute inset-x-0 top-[97%] h-[62%] w-full -scale-y-100 object-contain opacity-[0.13] blur-[6px]"
                style={{ maskImage: "linear-gradient(to top, transparent 12%, black 92%)", WebkitMaskImage: "linear-gradient(to top, transparent 12%, black 92%)" }}
                draggable={false}
              />

              {/* rim glow + contact shadow */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-[16%] -bottom-[6%] h-[18%] opacity-45 blur-[22px]"
                style={{
                  background:
                    "radial-gradient(60% 100% at 50% 0%, rgba(48,110,235,0.45), rgba(1,3,7,0) 72%)",
                }}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-[20%] bottom-[2%] h-[7%] rounded-[50%] opacity-90 blur-[26px]"
                style={{ background: "radial-gradient(closest-side, rgba(0,0,0,0.9), transparent)" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
