import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { ClientOnly, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";
import { useFilmProgress, clamp01, easeFilm, range, smoothstep } from "@/components/devicefilm/film";
import { HeroType } from "@/components/devicefilm/HeroType";
import { SceneArt } from "./SceneArt";

import sceneWeb from "@/assets/scene-web.webp";
import sceneEshop from "@/assets/scene-eshop.webp";
import sceneApps from "@/assets/scene-apps.webp";
import sceneSeo from "@/assets/scene-seo.webp";
import sceneDesign from "@/assets/scene-design.webp";

const FilmScene = lazy(() => import("@/components/devicefilm/FilmScene"));

/**
 * ELEVATE — ONE cinematic homepage system.
 *
 * A single normal-scroll section with a single sticky stage, a single progress
 * value and a single rAF loop:
 *
 *   MACBOOK (finished ELEVATE interface + character)
 *     → camera enters the display
 *       → 01 WEBY → 02 E-SHOPY → 03 APLIKACE → 04 SEO → 05 LOGO & DESIGN
 *
 * Every scene gets a long stable hold and a short transformation window, so one
 * normal scroll gesture always produces meaningful, reversible movement.
 */

type Scene = {
  id: string;
  index: string;
  title: string;
  desc: string;
  points: string[];
  to: string;
  src: string;
  art: "web" | "shop" | "app" | "seo" | "brand";
  /** cut-out height + horizontal anchor: each scene is composed differently */
  height: string;
  x: string;
};

const SCENES: Scene[] = [
  {
    id: "web",
    index: "01",
    title: "Weby",
    desc: "Firemní weby, landing pages a moderní digitální prezentace.",
    points: ["UX / UI", "Responzivní design", "Výkon", "Konverze"],
    to: "/services/web",
    src: sceneWeb,
    art: "web",
    height: "72vh",
    x: "2%",
  },
  {
    id: "eshop",
    index: "02",
    title: "E-shopy",
    desc: "E-shopy navržené pro jednoduchý nákup, důvěru a konverzi.",
    points: ["Produktové UX", "Košík", "Checkout", "Platby"],
    to: "/services/eshop",
    src: sceneEshop,
    art: "shop",
    height: "78vh",
    x: "-4%",
  },
  {
    id: "apps",
    index: "03",
    title: "Mobilní aplikace",
    desc: "Aplikace pro iOS a Android včetně publikace v App Store a Google Play.",
    points: ["iOS", "Android", "App Store", "Google Play"],
    to: "/contact",
    src: sceneApps,
    art: "app",
    height: "74vh",
    x: "6%",
  },
  {
    id: "seo",
    index: "04",
    title: "SEO & optimalizace",
    desc: "Technické SEO, rychlost, Core Web Vitals a průběžná optimalizace.",
    points: ["SEO", "Rychlost", "Core Web Vitals", "Indexace"],
    to: "/audit",
    src: sceneSeo,
    art: "seo",
    height: "60vh",
    x: "8%",
  },
  {
    id: "design",
    index: "05",
    title: "Logo & design",
    desc: "Logo, vizuální identita a kompletní vizuální směr značky.",
    points: ["Logo", "Brand identity", "UI / UX", "Visual direction"],
    to: "/services/design",
    src: sceneDesign,
    art: "brand",
    height: "68vh",
    x: "0%",
  },
];

/** timeline: the device owns the opening, then the five services share the rest */
const HERO = 0.22;
const SERVICES_FROM = 0.18;
/** share of a service unit spent transforming (rest is a stable hold) → 20/60/20 */
const TRANSITION = 0.4;

const HERO_VH = 150;
const SCENE_VH = 118;

function stageOf(p: number, count: number) {
  const raw = Math.min(count - 1, Math.max(0, range(SERVICES_FROM, 1, p) * (count - 1)));
  const i = Math.min(count - 2, Math.floor(raw));
  const fr = raw - i;
  const start = (1 - TRANSITION) / 2;
  const t = clamp01((fr - start) / TRANSITION);
  return i + smoothstep(0, 1, t);
}

export function HomeFilm() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useFilmProgress(wrap);
  const device = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  const deviceLayer = useRef<HTMLDivElement>(null);
  const bloom = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [mobile, setMobile] = useState(false);
  const [active, setActive] = useState(-1);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);

    const reduced = prefersReducedMotion();
    const raw = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      raw.x = e.clientX / window.innerWidth - 0.5;
      raw.y = e.clientY / window.innerHeight - 0.5;
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const p = progress.current ?? 0;
      const isMobile = window.innerWidth < 768;
      const cursor = isMobile || reduced ? 0 : 1;
      const vh = window.innerHeight / 100;

      // the device timeline: one continuous camera move into the display
      device.current = range(0, HERO, p);
      pointer.current.x = smooth.x * 12;
      pointer.current.y = -smooth.y * 12;

      smooth.x += (raw.x - smooth.x) * 0.07;
      smooth.y += (raw.y - smooth.y) * 0.07;

      // the display light takes the frame, then releases into the first service
      const light = easeFilm(range(HERO * 0.72, HERO, p));
      const release = easeFilm(range(HERO * 0.78, HERO + 0.05, p));
      if (bloom.current) {
        bloom.current.style.opacity = (light * (1 - release)).toFixed(3);
        bloom.current.style.transform = `scale(${(0.6 + light * 1.8).toFixed(3)})`;
      }
      if (deviceLayer.current) {
        deviceLayer.current.style.opacity = (1 - release).toFixed(3);
        deviceLayer.current.style.visibility = release >= 0.995 ? "hidden" : "visible";
        deviceLayer.current.style.transform = `translate3d(0, ${(-release * 6).toFixed(2)}vh, 0) scale(${(1 + release * 0.06).toFixed(4)})`;
      }

      // the five services: only the active and neighbouring scene do any work
      const stage = stageOf(p, SCENES.length);
      const started = p > SERVICES_FROM - 0.02;
      sceneRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = stage - i;
        const away = Math.min(1.4, Math.abs(d));
        if (!started || away >= 1) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
          }
          return;
        }
        el.style.visibility = "visible";
        // a true crossfade: the two neighbouring scenes always sum to 1, so the
        // stage never dips to black and never shows two bright copies
        el.style.opacity = clamp01(1 - away).toFixed(3);
        el.style.pointerEvents = away < 0.25 ? "auto" : "none";

        const near = 1 - away;
        const text = el.querySelector<HTMLElement>("[data-layer='text']");
        const fig = el.querySelector<HTMLElement>("[data-layer='figure']");
        const art = el.querySelector<HTMLElement>("[data-layer='art']");
        const glow = el.querySelector<HTMLElement>("[data-layer='glow']");

        if (text) {
          // only the dominant scene's copy is readable — no ghosted headlines
          text.style.opacity = clamp01(1 - away * 2.6).toFixed(3);
          text.style.transform = `translate3d(${(smooth.x * 4 * cursor).toFixed(2)}px, ${(-d * 4 * vh).toFixed(2)}px, 0)`;
        }
        if (fig) {
          // the character stays one continuous, always-sharp subject
          fig.style.transform = `translate3d(${(smooth.x * 8 * cursor - d * 3 * vh).toFixed(2)}px, ${(-d * 5 * vh + smooth.y * 5 * cursor).toFixed(2)}px, 0) scale(${(0.95 + near * 0.05).toFixed(4)})`;
        }
        if (glow) {
          glow.style.opacity = (0.3 + near * 0.7).toFixed(3);
          glow.style.transform = `translate3d(-50%, calc(-50% + ${(-d * 4 * vh).toFixed(2)}px), 0) scale(${(0.92 + near * 0.12).toFixed(3)})`;
        }

        if (art) {
          const floats = art.querySelectorAll<HTMLElement>("[data-float]");
          floats.forEach((f) => {
            const depth = Number(f.dataset.depth ?? 0.5);
            const enter = clamp01(1 - away * 1.6);
            const mx = smooth.x * (4 + depth * 14) * cursor;
            const my = smooth.y * (2 + depth * 8) * cursor;
            const sy = -d * (4 + depth * 12) * vh;
            f.style.transform = `translate3d(${(mx - d * depth * 14).toFixed(2)}px, ${(my + sy).toFixed(2)}px, 0) scale(${(0.96 + enter * 0.04).toFixed(4)})`;
            f.style.opacity = enter.toFixed(3);
          });
        }
      });

      const next = started ? Math.min(SCENES.length - 1, Math.round(stage)) : -1;
      setActive((prev) => (prev === next ? prev : next));
    };

    const stop = startFrameLoop(tick, wrap.current);
    return () => {
      stop();
      window.removeEventListener("resize", check);
      window.removeEventListener("pointermove", onMove);
    };
  }, [progress]);

  return (
    <div ref={wrap} className="relative" style={{ height: `${HERO_VH + SCENES.length * SCENE_VH}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* environment — light and one static grid; it never competes */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(58% 52% at 56% 34%, oklch(0.3 0.07 258 / 0.2) 0%, transparent 70%), radial-gradient(90% 80% at 46% 112%, oklch(0.18 0.045 258 / 0.34) 0%, transparent 66%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.65 0.18 255 / 0.16) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.65 0.18 255 / 0.12) 1px, transparent 1px)",
            backgroundSize: "128px 128px",
            maskImage: "radial-gradient(72% 62% at 55% 45%, #000 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(72% 62% at 55% 45%, #000 0%, transparent 100%)",
          }}
        />

        {/* 01 — THE DEVICE: the stage the whole film starts from */}
        <div ref={deviceLayer} className="absolute inset-0 z-20" style={{ willChange: "opacity, transform" }}>
          <ClientOnly fallback={<div className="absolute inset-0" />}>
            <Suspense fallback={<div className="absolute inset-0" />}>
              <div className="absolute inset-0">
                <FilmScene progress={device} pointer={pointer} mobile={mobile} />
              </div>
            </Suspense>
          </ClientOnly>
          <HeroType progress={device} />
        </div>

        {/* the display light: the single bridge from the device into the services */}
        <div
          ref={bloom}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-30 h-[120vh] w-[120vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            opacity: 0,
            background:
              "radial-gradient(circle, oklch(0.78 0.09 250 / 0.5) 0%, oklch(0.45 0.14 255 / 0.24) 38%, transparent 72%)",
            willChange: "opacity, transform",
          }}
        />

        {/* chapter indicator */}
        <div className="pointer-events-none absolute left-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 xl:flex">
          {SCENES.map((s, i) => {
            const on = i === active;
            return (
              <span key={s.id} className="flex items-center gap-2">
                <span
                  className="h-px transition-all duration-500"
                  style={{
                    width: on ? 22 : 8,
                    background: on ? "oklch(0.65 0.18 255)" : "oklch(0.65 0.18 255 / 0.22)",
                  }}
                />
                <span
                  className={`font-mono text-[10px] tracking-[0.24em] transition-colors duration-500 ${
                    on ? "text-primary" : "text-muted-foreground/40"
                  }`}
                >
                  {s.index}
                </span>
              </span>
            );
          })}
        </div>

        {/* 02–06 — THE SERVICES */}
        {SCENES.map((s, i) => (
          <div
            key={s.id}
            ref={(el) => {
              sceneRefs.current[i] = el;
            }}
            className="absolute inset-0 z-10 flex items-center"
            style={{ opacity: 0, visibility: "hidden" }}
          >
            <div className="container-luxe grid w-full items-center gap-6 md:grid-cols-[0.85fr_1.15fr] md:gap-10">
              <div data-layer="text" className="relative z-20 order-2 will-change-transform md:order-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
                  {s.index} / {s.title.toUpperCase()}
                </p>
                <h2 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.035em] text-foreground md:text-[3.5vw]">
                  {s.title}
                </h2>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">{s.desc}</p>
                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                  {s.points.map((pt) => (
                    <li
                      key={pt}
                      className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70"
                    >
                      <span className="h-px w-3 bg-primary/60" />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link
                  to={s.to}
                  className="group mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80 transition-colors hover:text-primary"
                >
                  Detail služby
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>

              <div className="relative order-1 h-[44vh] md:order-2 md:h-[80vh]">
                <div
                  data-layer="glow"
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[48vh] w-[48vh] rounded-full blur-[110px] will-change-transform"
                  style={{ background: "oklch(0.6 0.17 258 / 0.26)", transform: "translate3d(-50%, -50%, 0)" }}
                />
                <div
                  data-layer="art"
                  aria-hidden
                  className="pointer-events-none absolute inset-0 hidden will-change-transform md:block"
                >
                  <SceneArt kind={s.art} />
                </div>
                <div
                  data-layer="figure"
                  className="absolute bottom-0 right-0 will-change-transform"
                  style={{ transform: `translateX(${s.x})` }}
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute bottom-[2%] left-1/2 h-[6%] w-[74%] -translate-x-1/2 rounded-[50%] blur-2xl"
                    style={{ background: "oklch(0.03 0.01 258 / 0.7)" }}
                  />
                  <img
                    src={s.src}
                    alt=""
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    draggable={false}
                    className="h-[38vh] w-auto max-w-none md:h-[var(--fh)]"
                    style={
                      {
                        "--fh": s.height,
                        filter:
                          "saturate(1.04) contrast(1.06) drop-shadow(0 42px 64px oklch(0.03 0.01 258 / 0.66))",
                      } as React.CSSProperties
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* the seam onward: light falloff only, never a colour cut */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[22vh]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.115 0.018 258 / 0.14) 55%, oklch(0.115 0.018 258 / 0.34) 100%)",
          }}
        />
      </div>
    </div>
  );
}
