import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import webAsset from "@/assets/campaign-web.png.asset.json";
import eshopAsset from "@/assets/campaign-eshop.png.asset.json";
import appsAsset from "@/assets/campaign-apps.png.asset.json";
import seoAsset from "@/assets/campaign-seo.png.asset.json";
import designAsset from "@/assets/campaign-design.png.asset.json";

/**
 * Cinematic service sequence — five ELEVATE campaign visuals presented as
 * chapters of one continuous scroll-driven scene. Progress is read from the
 * section's own scroll position inside a rAF loop and written to CSS variables,
 * so scrolling backwards reverses the film naturally.
 */

type Service = {
  id: string;
  index: string;
  label: string;
  title: string;
  desc: string;
  to: string;
  src: string;
  /** object-position tuned per visual so faces / devices / logo stay in frame */
  position: string;
};

const SERVICES: Service[] = [
  {
    id: "web",
    index: "01",
    label: "Weby",
    title: "Weby",
    desc: "Firemní weby, landing pages a digitální prezentace navržené tak, aby přiváděly zákazníky.",
    to: "/services/web",
    src: webAsset.url,
    position: "50% 45%",
  },
  {
    id: "eshop",
    index: "02",
    label: "E-shopy",
    title: "E-shopy",
    desc: "Moderní e-shopy postavené pro důvěru, pohodlný nákup a růst prodejů.",
    to: "/services/eshop",
    src: eshopAsset.url,
    position: "55% 50%",
  },
  {
    id: "apps",
    index: "03",
    label: "Aplikace",
    title: "Aplikace",
    desc: "Vývoj aplikací pro iOS a Android včetně přípravy a publikace v App Store a Google Play.",
    to: "/contact",
    src: appsAsset.url,
    position: "58% 45%",
  },
  {
    id: "seo",
    index: "04",
    label: "SEO & optimalizace",
    title: "SEO & optimalizace",
    desc: "Technické SEO, rychlost, Core Web Vitals a optimalizace webu pro lepší viditelnost a výkon.",
    to: "/audit",
    src: seoAsset.url,
    position: "55% 42%",
  },
  {
    id: "design",
    index: "05",
    label: "Logo & design",
    title: "Logo & design",
    desc: "Logo, vizuální identita, UX/UI a kompletní digitální design.",
    to: "/services/design",
    src: designAsset.url,
    position: "52% 46%",
  },
];

const CTA = "Detail služby";

function Depth({ progress }: { progress: React.RefObject<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = ref.current;
      if (el) el.style.setProperty("--p", String(progress.current ?? 0));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* soft blue light field, drifts with the sequence */}
      <div
        className="absolute -top-[20%] left-[42%] h-[70vh] w-[70vh] rounded-full blur-[120px]"
        style={{
          background: "oklch(0.55 0.15 258 / 0.16)",
          transform: "translate3d(calc(var(--p, 0) * -6vw), calc(var(--p, 0) * 12vh), 0)",
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[-8%] h-[50vh] w-[50vh] rounded-full blur-[130px]"
        style={{
          background: "oklch(0.45 0.11 258 / 0.14)",
          transform: "translate3d(calc(var(--p, 0) * 5vw), calc(var(--p, 0) * -8vh), 0)",
        }}
      />
      {/* very subtle technical grid */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.65 0.18 255 / 0.16) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.65 0.18 255 / 0.1) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage: "radial-gradient(70% 60% at 50% 45%, #000 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(70% 60% at 50% 45%, #000 0%, transparent 100%)",
          transform: "translate3d(0, calc(var(--p, 0) * -6vh), 0)",
        }}
      />
      {/* thin technical lines */}
      <div
        className="absolute inset-y-0 left-[18%] w-px"
        style={{
          background: "linear-gradient(to bottom, transparent, oklch(0.65 0.18 255 / 0.18), transparent)",
          transform: "translate3d(0, calc(var(--p, 0) * 10vh), 0)",
        }}
      />
      <div
        className="absolute inset-x-0 top-[38%] h-px"
        style={{
          background: "linear-gradient(to right, transparent, oklch(0.65 0.18 255 / 0.12), transparent)",
          transform: "translate3d(calc(var(--p, 0) * -4vw), 0, 0)",
        }}
      />
    </div>
  );
}

export function CinematicServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progress = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    let raf = 0;

    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const section = sectionRef.current;
      const stage = stageRef.current;
      if (section && stage) {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        progress.current = p;

        smooth.x += (pointer.x - smooth.x) * 0.08;
        smooth.y += (pointer.y - smooth.y) * 0.08;

        const scene = p * (SERVICES.length - 1);
        stage.style.setProperty("--scene", scene.toFixed(4));
        stage.style.setProperty("--mx", smooth.x.toFixed(4));
        stage.style.setProperty("--my", smooth.y.toFixed(4));

        const next = Math.min(SERVICES.length - 1, Math.round(scene));
        setActive((prev) => (prev === next ? prev : next));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative" style={{ height: `${SERVICES.length * 100}vh` }}>
      <div ref={stageRef} className="sticky top-0 h-screen overflow-hidden">
        <Depth progress={progress} />

        {/* vertical chapter indicator */}
        <div className="pointer-events-none absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 md:flex lg:left-8">
          {SERVICES.map((s, i) => {
            const on = i === active;
            return (
              <span key={s.id} className="flex items-center gap-2">
                <span
                  className="h-px transition-all duration-500"
                  style={{
                    width: on ? 22 : 8,
                    background: on ? "oklch(0.65 0.18 255)" : "oklch(0.65 0.18 255 / 0.25)",
                  }}
                />
                <span
                  className={`font-mono text-[10px] tracking-[0.24em] transition-colors duration-500 ${
                    on ? "text-primary" : "text-muted-foreground/45"
                  }`}
                >
                  {s.index}
                </span>
              </span>
            );
          })}
        </div>

        <div className="relative h-full">
          {SERVICES.map((s, i) => (
            <Chapter key={s.id} service={s} i={i} eager={i === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Chapter({ service, i, eager }: { service: Service; i: number; eager: boolean }) {
  // distance from the active scene, expressed purely in CSS so the whole
  // sequence is driven by a single scroll-written variable.
  const d = `calc(var(--scene, 0) - ${i})`;
  const near = `clamp(0, calc(1 - ${d} * ${d}), 1)`;

  return (
    <div
      className="absolute inset-0 flex items-center"
      style={{
        opacity: `clamp(0, calc(1.15 - (${d} * ${d}) * 1.5), 1)` as unknown as number,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <div className="container-luxe grid w-full items-center gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
        {/* text — moves less than the image */}
        <div
          className="relative z-10 order-1"
          style={{
            transform: `translate3d(calc(var(--mx, 0) * 3px), calc((${d}) * -5vh + var(--my, 0) * 2px), 0)`,
            opacity: `clamp(0, calc(1.25 - (${d} * ${d}) * 1.4), 1)` as unknown as number,
          }}
        >
          <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
            {service.index} / {service.label}
          </p>
          <h3 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.035em] text-foreground md:text-[4vw]">
            {service.title}
          </h3>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">{service.desc}</p>
          <Link
            to={service.to}
            className="group mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80 transition-colors hover:text-primary"
            style={{ pointerEvents: "auto" }}
          >
            {CTA}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {/* campaign visual — a floating cinematic panel, not a card */}
        <div
          className="order-2 relative"
          style={{
            transform: `translate3d(calc(var(--mx, 0) * 6px), calc((${d}) * -9vh + var(--my, 0) * 5px), 0) scale(calc(0.94 + ${near} * 0.06))`,
            filter: `blur(calc(clamp(0, ${d} * ${d}, 1) * 10px))`,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-8 rounded-[2rem] blur-3xl"
            style={{ background: "oklch(0.55 0.16 258 / 0.18)" }}
          />
          <figure className="relative overflow-hidden rounded-2xl">
            <img
              src={service.src}
              alt=""
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="h-[46vh] w-full object-cover md:h-[62vh]"
              style={{ objectPosition: service.position }}
            />
            {/* edge integration into the dark environment */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(120% 100% at 50% 50%, transparent 45%, oklch(0.13 0.02 258 / 0.55) 88%, oklch(0.11 0.02 258 / 0.9) 100%)",
              }}
            />
            {/* subtle glass reflection */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-screen"
              style={{
                background:
                  "linear-gradient(115deg, oklch(0.75 0.06 258 / 0.1) 0%, transparent 38%, transparent 70%, oklch(0.65 0.18 255 / 0.06) 100%)",
              }}
            />
            {/* very subtle grain */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset"
              style={{ boxShadow: "inset 0 0 0 1px oklch(0.65 0.18 255 / 0.14)" }}
            />
          </figure>
        </div>
      </div>
    </div>
  );
}
