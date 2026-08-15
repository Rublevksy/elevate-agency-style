import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import deviceAsset from "@/assets/elevate-device.png.asset.json";
import { LightWaves } from "./LightWaves";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";

const SERVICES = [
  { label: "Weby", hash: "weby" },
  { label: "E-shopy", hash: "e-shopy" },
  { label: "Aplikace", hash: "aplikace" },
  { label: "Design", hash: "design" },
  { label: "SEO", hash: "seo" },
] as const;

/**
 * ELEVATE HERO — one clean, live scene: CSS/gradient cinematic environment,
 * animated canvas light ribbons, real HTML typography and links, and the device
 * as its own parallax layer with reflection and blue rim light. Native scroll.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);
  const wavesRef = useRef<HTMLDivElement | null>(null);
  const copyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || prefersReducedMotion()) return;

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });

    const stop = startFrameLoop(() => {
      pointer.x += (pointer.tx - pointer.x) * 0.05;
      pointer.y += (pointer.ty - pointer.y) * 0.05;

      const h = window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.95)));
      const ease = p * p * (3 - 2 * p);

      const device = deviceRef.current;
      if (device) {
        const rx = pointer.y * 3.2 - ease * 6;
        const ry = pointer.x * -4.5 + ease * 5;
        device.style.transform = `perspective(1600px) translate3d(${pointer.x * 16}px, ${
          pointer.y * 11 - ease * h * 0.14
        }px, 0) rotateX(${rx}deg) rotateY(${ry}deg) scale(${1 + ease * 0.07})`;
        device.style.opacity = `${1 - ease * 0.9}`;
      }
      const waves = wavesRef.current;
      if (waves) {
        waves.style.transform = `translate3d(${pointer.x * -24}px, ${-ease * h * 0.08}px, 0) scale(${
          1 + ease * 0.14
        })`;
        waves.style.opacity = `${1 - ease * 0.85}`;
      }
      const copy = copyRef.current;
      if (copy) {
        copy.style.transform = `translate3d(0, ${-ease * h * 0.1}px, 0)`;
        copy.style.opacity = `${1 - ease}`;
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
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-[#02040a] pt-28 pb-20 md:pt-32"
    >
      {/* ————— environment ————— */}
      <div
        ref={wavesRef}
        className="pointer-events-none absolute inset-y-[-6%] left-[30%] right-[-10%] -z-10 will-change-transform"
      >
        <LightWaves />
      </div>

      {/* core bloom behind the device */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[62%] top-[46%] -z-10 h-[74vh] w-[74vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[110px]"
        style={{ background: "radial-gradient(circle, rgba(30,94,235,0.45), rgba(2,4,10,0) 70%)" }}
      />
      {/* cinematic floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38vh]"
        style={{
          background:
            "linear-gradient(to top, rgba(8,16,34,0.9) 0%, rgba(4,8,18,0.45) 42%, rgba(2,4,10,0) 100%)",
        }}
      />
      {/* left vignette keeps the type clean */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(115% 90% at 10% 50%, rgba(2,4,10,0.95) 0%, rgba(2,4,10,0.62) 34%, rgba(2,4,10,0) 64%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1640px] px-6 md:px-12">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          {/* ————— editorial copy ————— */}
          <div ref={copyRef} className="relative z-20 will-change-transform">
            {/* thin vertical blue light accent */}
            <span
              aria-hidden
              className="absolute -left-6 top-1 hidden h-[78%] w-px md:block"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(58,130,255,0) 0%, rgba(88,155,255,0.9) 28%, rgba(58,130,255,0.35) 72%, rgba(58,130,255,0) 100%)",
                boxShadow: "0 0 18px rgba(58,130,255,0.55)",
              }}
            />

            <p className="text-[10px] font-medium uppercase tracking-[0.42em] text-primary">
              Digitální studio · Praha
            </p>

            <h1 className="mt-8 text-[clamp(1.9rem,3.5vw,3.4rem)] font-extralight uppercase leading-[1.18] tracking-[0.06em] text-foreground/95">
              <span className="block">Tvoříme weby,</span>
              <span className="block">e-shopy a aplikace,</span>
              <span className="block text-primary" style={{ textShadow: "0 0 42px rgba(45,116,255,0.45)" }}>
                které prodávají.
              </span>
            </h1>

            <ul className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {SERVICES.map((s, i) => (
                <li key={s.label} className="flex items-center gap-4">
                  <a
                    href={`/services#${s.hash}`}
                    className="transition-colors duration-300 hover:text-foreground"
                  >
                    {s.label}
                  </a>
                  {i < SERVICES.length - 1 && <span className="text-primary/60">·</span>}
                </li>
              ))}
            </ul>

            <div className="mt-11 flex flex-wrap items-center gap-6">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.22em] text-primary-foreground shadow-[0_20px_60px_-20px_oklch(0.62_0.2_260/0.95)] transition-transform duration-300 hover:scale-[1.03]"
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

          {/* ————— device layer ————— */}
          <div className="relative">
            <div ref={deviceRef} className="relative z-10 will-change-transform">
              {/* blue rim light behind the lid */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-[38%] h-[58%] w-[86%] -translate-x-1/2 -translate-y-1/2 rounded-[40%] opacity-80 blur-[52px]"
                style={{ background: "radial-gradient(closest-side, rgba(60,132,255,0.5), rgba(2,4,10,0) 72%)" }}
              />
              <img
                src={deviceAsset.url}
                alt="Ukázka webu ELEVATE na MacBooku"
                width={810}
                height={615}
                fetchPriority="high"
                decoding="async"
                className="relative mx-auto block h-auto w-[min(100%,740px)] select-none"
                style={{
                  maskImage:
                    "linear-gradient(to right, transparent 0, #000 3%, #000 96.5%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 3%, #000 96%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to right, transparent 0, #000 3%, #000 96.5%, transparent 100%), linear-gradient(to bottom, transparent 0, #000 3%, #000 96%, transparent 100%)",
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                }}
                draggable={false}
              />

              {/* floor reflection */}
              <img
                src={deviceAsset.url}
                alt=""
                aria-hidden
                className="mx-auto -mt-[3%] block h-auto w-[min(100%,740px)] select-none opacity-[0.16] blur-[3px]"
                style={{
                  transform: "scaleY(-0.42)",
                  transformOrigin: "top",
                  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0))",
                  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0))",
                }}
                draggable={false}
              />
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="mt-12 flex flex-col items-center gap-3 md:mt-16">
          <span className="text-[9px] uppercase tracking-[0.44em] text-muted-foreground/70">Scroll</span>
          <span className="h-10 w-px bg-gradient-to-b from-primary/70 to-transparent" />
        </div>
      </div>
    </section>
  );
}
