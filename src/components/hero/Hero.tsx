import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, LayoutTemplate, ShoppingCart, Smartphone, TrendingUp, PenTool } from "lucide-react";
import deviceAsset from "@/assets/elevate-device.png.asset.json";
import { LightWaves } from "./LightWaves";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";

const CARDS = [
  { n: "01", label: "Weby", Icon: LayoutTemplate, to: "/services" },
  { n: "02", label: "E-shopy", Icon: ShoppingCart, to: "/services" },
  { n: "03", label: "Aplikace", Icon: Smartphone, to: "/services" },
  { n: "04", label: "SEO", Icon: TrendingUp, to: "/services" },
  { n: "05", label: "Design", Icon: PenTool, to: "/services" },
] as const;

/**
 * ELEVATE HERO — the approved art direction rebuilt as a live, interactive
 * scene: real HTML type, real links, an animated light-ribbon field and the
 * device as its own parallax layer. Native scrolling only.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const deviceRef = useRef<HTMLDivElement | null>(null);
  const wavesRef = useRef<HTMLDivElement | null>(null);

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

      // scroll progress out of the hero (0 → 1), transform-only handoff
      const h = window.innerHeight;
      const p = Math.min(1, Math.max(0, window.scrollY / (h * 0.9)));
      const ease = p * p * (3 - 2 * p);

      const device = deviceRef.current;
      if (device) {
        device.style.transform = `translate3d(${pointer.x * 14}px, ${
          pointer.y * 10 - ease * h * 0.16
        }px, 0) scale(${1 + ease * 0.06})`;
        device.style.opacity = `${1 - ease * 0.85}`;
      }
      const waves = wavesRef.current;
      if (waves) {
        waves.style.transform = `translate3d(${pointer.x * -22}px, ${-ease * h * 0.1}px, 0) scale(${
          1 + ease * 0.12
        })`;
        waves.style.opacity = `${1 - ease * 0.8}`;
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
      className="relative isolate flex min-h-[100svh] w-full flex-col justify-center overflow-hidden bg-[#03060b] pt-24 pb-16 md:pt-28"
    >
      {/* light-ribbon field — behind everything */}
      <div
        ref={wavesRef}
        className="pointer-events-none absolute inset-y-0 left-[18%] right-[-6%] -z-10 will-change-transform"
      >
        <LightWaves />
      </div>
      {/* soft core bloom behind the device */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-[52%] top-1/2 -z-10 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(35,102,235,0.5), rgba(3,6,11,0) 68%)" }}
      />
      {/* vignette so type stays legible */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(120% 90% at 12% 50%, rgba(3,6,11,0.94) 0%, rgba(3,6,11,0.6) 34%, rgba(3,6,11,0) 62%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1600px] px-6 md:px-12">
        <div className="relative grid items-center gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.35fr)]">
          {/* ————— copy column ————— */}
          <div className="relative z-20">
            <div className="flex items-center gap-6">
              <ol className="hidden shrink-0 flex-col gap-2.5 lg:flex" aria-hidden>
                {CARDS.map((c, i) => (
                  <li
                    key={c.n}
                    className={`flex items-center gap-2 text-[11px] tracking-[0.24em] ${
                      i === 0 ? "text-foreground" : "text-muted-foreground/45"
                    }`}
                  >
                    <span className="h-px w-3 bg-current opacity-60" />
                    {c.n}
                  </li>
                ))}
              </ol>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.34em] text-primary">
                  Digitální studio · Praha
                </p>
                <h1 className="mt-6 text-[clamp(2.4rem,4.6vw,4.3rem)] font-medium leading-[1.06] tracking-[-0.03em] text-foreground">
                  Weby, e-shopy
                  <br />
                  a aplikace, které
                  <br />
                  <span className="text-primary">prodávají.</span>
                </h1>
                <p className="mt-7 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
                  UX / UI · Vývoj · Optimalizace
                </p>
                <Link
                  to="/contact"
                  className="group mt-10 inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_18px_50px_-18px_oklch(0.62_0.2_260/0.9)] transition-transform duration-300 hover:scale-[1.03]"
                >
                  Chci projekt
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>

          {/* ————— device + service field ————— */}
          <div className="relative">
            <div
              ref={deviceRef}
              className="relative z-10 will-change-transform"
              style={{ mixBlendMode: "screen" }}
            >
              <img
                src={deviceAsset.url}
                alt="Ukázka webu ELEVATE na MacBooku"
                width={810}
                height={615}
                fetchPriority="high"
                decoding="async"
                className="mx-auto block h-auto w-[min(105%,860px)] select-none"
                draggable={false}
              />
            </div>

            {/* real, clickable service field */}
            <ul className="pointer-events-none absolute -right-2 top-0 z-20 hidden h-full flex-col justify-center gap-3 xl:flex">
              {CARDS.map(({ n, label, Icon, to }, i) => (
                <li
                  key={n}
                  className="pointer-events-auto"
                  style={{ transform: `translateX(${Math.abs(i - 2) * 10}px)` }}
                >
                  <Link
                    to={to}
                    className="group flex w-[178px] items-center gap-3 rounded-xl border border-primary/25 bg-primary/[0.06] px-4 py-3 backdrop-blur-[2px] transition-all duration-300 hover:border-primary/60 hover:bg-primary/[0.12]"
                    style={{ boxShadow: "0 0 34px -14px oklch(0.62 0.2 260 / 0.7)" }}
                  >
                    <Icon className="h-4 w-4 text-primary" strokeWidth={1.4} />
                    <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground transition-colors group-hover:text-foreground">
                      {n} / {label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* scroll cue + trust strip */}
        <div className="mt-10 flex flex-col items-center gap-6 md:mt-14">
          <div className="flex flex-col items-center gap-3">
            <span className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground/70">Scroll</span>
            <span className="h-10 w-px bg-gradient-to-b from-primary/70 to-transparent" />
          </div>
          <p className="text-[10px] uppercase tracking-[0.34em] text-muted-foreground/70">
            Dobrý design <span className="text-primary">·</span> Rychlý výkon{" "}
            <span className="text-primary">·</span> Skvělé výsledky
          </p>
        </div>
      </div>
    </section>
  );
}
