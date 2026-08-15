import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";
import { useFilmProgress, clamp01, easeFilm, lerp, range, smoothstep } from "@/lib/film";
import { CssLaptop } from "./CssLaptop";
import { Portal } from "./Portal";
import { SceneArt } from "./SceneArt";

import sceneWeb from "@/assets/scene-web.webp";
import sceneEshop from "@/assets/scene-eshop.webp";
import sceneApps from "@/assets/scene-apps.webp";
import sceneSeo from "@/assets/scene-seo.webp";
import sceneDesign from "@/assets/scene-design.webp";

/**
 * ELEVATE — ONE homepage hero system.
 *
 * HERO → SCREEN → PORTAL → SERVICES, driven by a single scroll progress value
 * and a single rAF loop. Everything is transform/opacity on a handful of layers;
 * no canvas, no WebGL, no per-frame React state except the chapter index.
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
    height: "70vh",
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
    height: "76vh",
    x: "-4%",
  },
  {
    id: "apps",
    index: "03",
    title: "Aplikace",
    desc: "Aplikace pro iOS a Android včetně publikace v App Store a Google Play.",
    points: ["iOS", "Android", "App Store", "Google Play"],
    to: "/contact",
    src: sceneApps,
    art: "app",
    height: "72vh",
    x: "6%",
  },
  {
    id: "seo",
    index: "04",
    title: "Optimalizace",
    desc: "SEO, rychlost, Core Web Vitals a průběžná optimalizace výkonu.",
    points: ["SEO", "Rychlost", "Core Web Vitals", "Analytika"],

    to: "/audit",
    src: sceneSeo,
    art: "seo",
    height: "60vh",
    x: "8%",
  },
  {
    id: "design",
    index: "05",
    title: "Design",
    desc: "Logo, vizuální identita a kompletní vizuální směr značky.",
    points: ["Logo", "Brand identity", "UI / UX", "Visual direction"],
    to: "/services/design",
    src: sceneDesign,
    art: "brand",
    height: "66vh",
    x: "0%",
  },
];

/**
 * ONE timeline. `p` is the section's normalised scroll progress (0 → 1) and the
 * hero act lives in the first `SERVICES_FROM` of it, so all beats below are
 * expressed in hero-local time `hp = p / SERVICES_FROM`:
 *
 *   0.00 – 0.20  hero holds, the user reads it
 *   0.20 – 0.45  the camera approaches the display
 *   0.32 – 0.64  the portal forms and opens behind the screen
 *   0.50 – 0.84  UI is extracted out of the portal
 *   0.62 – 0.96  the device dissolves into light, off frame
 *   0.96 – 1.00  the Web service is fully stable
 */
const SERVICES_FROM = 0.26;
/** share of a service unit spent transforming (rest is a stable hold) */
const TRANSITION = 0.4;

const HERO_VH = 165;
const SCENE_VH = 96;

function stageOf(p: number, count: number) {
  const raw = Math.min(count - 1, Math.max(0, range(SERVICES_FROM, 1, p) * (count - 1)));
  const i = Math.min(count - 2, Math.floor(raw));
  const fr = raw - i;
  const start = (1 - TRANSITION) / 2;
  const t = clamp01((fr - start) / TRANSITION);
  return i + smoothstep(0, 1, t);
}


export function HeroFilm() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useFilmProgress(wrap);

  const stage = useRef<HTMLDivElement>(null);
  const lid = useRef<HTMLDivElement>(null);
  const chassis = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const deviceLayer = useRef<HTMLDivElement>(null);
  const portal = useRef<HTMLDivElement>(null);
  const bloom = useRef<HTMLDivElement>(null);
  const type = useRef<HTMLDivElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [active, setActive] = useState(-1);

  useEffect(() => {
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

      smooth.x += (raw.x - smooth.x) * 0.07;
      smooth.y += (raw.y - smooth.y) * 0.07;

      // hero-local time — every beat below is a slice of the hero act
      const hp = clamp01(p / SERVICES_FROM);

      // 01 — the device: hold, approach the display, then pass through it
      const settle = easeFilm(range(0, 0.14, hp));
      const approach = easeFilm(range(0.2, 0.62, hp));
      const pass = easeFilm(range(0.58, 0.96, hp));
      /** the device sits right of centre in the hero; the camera re-centres on it */
      const recentre = isMobile ? 0 : -approach * 19 * (window.innerWidth / 100);

      if (lid.current) {
        lid.current.style.transform = `rotateX(${lerp(9, -1.5, settle).toFixed(2)}deg)`;
      }
      if (stage.current) {
        const sc = lerp(isMobile ? 0.9 : 0.94, isMobile ? 1.3 : 1.5, approach) + pass * (isMobile ? 1.1 : 1.5);
        const damp = 1 - approach;
        const ry = smooth.x * damp * 7 * cursor;
        const rx = -smooth.y * damp * 4 * cursor;
        stage.current.style.transform = `translate3d(${recentre.toFixed(2)}px, ${((approach * 4 + pass * 14) * vh).toFixed(2)}px, 0) scale(${sc.toFixed(4)}) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      }
      // the chassis dissolves as the camera passes the glass — only light remains
      if (chassis.current) chassis.current.style.opacity = (1 - pass).toFixed(3);
      if (screen.current) screen.current.style.opacity = (1 - pass * 1.05).toFixed(3);
      if (deviceLayer.current) {
        deviceLayer.current.style.opacity = (1 - pass).toFixed(3);
        deviceLayer.current.style.visibility = pass >= 0.995 ? "hidden" : "visible";
      }

      // 02 — the portal: light first, then the gate opens behind the display
      const form = easeFilm(range(0.26, 0.62, hp));
      const open = easeFilm(range(0.4, 0.92, hp));
      // once the first service is stable the gate has done its job
      const settled = easeFilm(range(0.9, 1, hp));
      if (portal.current) {
        portal.current.style.setProperty("--form", form.toFixed(3));
        portal.current.style.setProperty("--open", open.toFixed(3));
        portal.current.style.opacity = (1 - settled * 0.9).toFixed(3);
        portal.current.style.transform = `translate3d(${recentre.toFixed(2)}px, 0, 0)`;
      }

      if (bloom.current) {
        bloom.current.style.opacity = ((form * 0.3 + open * 0.5) * (1 - settled * 0.72)).toFixed(3);
        bloom.current.style.transform = `translate3d(-50%, -50%, 0) scale(${(0.35 + form * 0.5 + open * 1.4).toFixed(3)})`;
      }
      if (type.current) {
        const out = easeFilm(range(0.18, 0.44, hp));
        type.current.style.opacity = (1 - out).toFixed(3);
        type.current.style.transform = `translate3d(${(-out * 4).toFixed(2)}vw, 0, 0)`;
        type.current.style.visibility = out >= 0.995 ? "hidden" : "visible";
      }

      // 03 — the services are extracted out of the portal
      const s = stageOf(p, SCENES.length);
      /** the first scene is pulled out of the gate while the device is still there */
      const extract = easeFilm(range(0.5, 0.94, hp));
      const started = hp > 0.48;
      const copyIn = easeFilm(range(0.74, 1, hp));

      sceneRefs.current.forEach((el, i) => {
        if (!el) return;
        const d = s - i;
        const away = Math.min(1.4, Math.abs(d));
        if (!started || away >= 1) {
          if (el.style.visibility !== "hidden") {
            el.style.visibility = "hidden";
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
          }
          return;
        }
        const first = i === 0;
        el.style.visibility = "visible";
        el.style.opacity = (clamp01(1 - away) * (first ? extract : 1)).toFixed(3);
        el.style.pointerEvents = away < 0.25 ? "auto" : "none";

        const near = 1 - away;
        // 1 → still inside the portal, 0 → settled in the frame
        const emerge = first ? 1 - extract : 0;
        const text = el.querySelector<HTMLElement>("[data-layer='text']");
        const fig = el.querySelector<HTMLElement>("[data-layer='figure']");
        const art = el.querySelector<HTMLElement>("[data-layer='art']");
        const glow = el.querySelector<HTMLElement>("[data-layer='glow']");

        if (text) {
          text.style.opacity = (clamp01(1 - away * 2.6) * (first ? copyIn : 1)).toFixed(3);
          text.style.transform = `translate3d(${(smooth.x * 4 * cursor).toFixed(2)}px, ${(-d * 4 * vh + emerge * 3 * vh).toFixed(2)}px, 0)`;
        }
        if (fig) {
          fig.style.opacity = (first ? clamp01(extract * 1.25) : 1).toFixed(3);
          fig.style.transform = `translate3d(${(smooth.x * 8 * cursor - d * 3 * vh - emerge * 4 * vh).toFixed(2)}px, ${(-d * 5 * vh + smooth.y * 5 * cursor + emerge * 3 * vh).toFixed(2)}px, 0) scale(${(0.95 + near * 0.05 - emerge * 0.22).toFixed(4)})`;
        }
        if (glow) {
          glow.style.opacity = (0.3 + near * 0.7).toFixed(3);
          glow.style.transform = `translate3d(-50%, calc(-50% + ${(-d * 4 * vh).toFixed(2)}px), 0) scale(${(0.92 + near * 0.12).toFixed(3)})`;
        }
        if (art) {
          // the whole composition is thrown out of the gate: 0.7 → 1.0
          art.style.transform = `scale(${(1 - emerge * 0.3).toFixed(4)})`;
          const floats = art.querySelectorAll<HTMLElement>("[data-float]");
          floats.forEach((f, fi) => {
            const depth = Number(f.dataset.depth ?? 0.5);
            // staggered ejection — near objects arrive first, deep ones trail
            const shot = first ? clamp01((extract - fi * 0.05) / 0.6) : 1;
            const enter = clamp01(1 - away * 1.6) * shot;
            const mx = smooth.x * (4 + depth * 14) * cursor;
            const my = smooth.y * (2 + depth * 8) * cursor;
            const sy = -d * (4 + depth * 12) * vh;
            const eject = (1 - shot) * (10 + depth * 26);
            f.style.transform = `translate3d(${(mx - d * depth * 14 - eject * 1.4).toFixed(2)}px, ${(my + sy + eject).toFixed(2)}px, 0) scale(${(0.7 + shot * 0.3 + enter * 0.02).toFixed(4)})`;
            f.style.opacity = enter.toFixed(3);
          });
        }
      });

      const next = started && extract > 0.35 ? Math.min(SCENES.length - 1, Math.round(s)) : -1;
      setActive((prev) => (prev === next ? prev : next));

    };

    const stop = startFrameLoop(tick, wrap.current);
    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
    };
  }, [progress]);

  return (
    <div ref={wrap} className="relative" style={{ height: `${HERO_VH + SCENES.length * SCENE_VH}vh` }}>
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* environment — one deep navy volume with a single static grid */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(56% 50% at 58% 32%, oklch(0.3 0.07 258 / 0.22) 0%, transparent 70%), radial-gradient(90% 80% at 46% 112%, oklch(0.18 0.045 258 / 0.34) 0%, transparent 66%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.09]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.65 0.18 255 / 0.16) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.65 0.18 255 / 0.12) 1px, transparent 1px)",
            backgroundSize: "128px 128px",
            maskImage: "radial-gradient(72% 62% at 55% 45%, #000 0%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(72% 62% at 55% 45%, #000 0%, transparent 100%)",
          }}
        />

        {/* the display light: the bridge from the screen into the services */}
        <div
          ref={bloom}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 z-[25] h-[110vh] w-[110vh] rounded-full"
          style={{
            opacity: 0,
            transform: "translate3d(-50%, -50%, 0) scale(0.35)",
            background:
              "radial-gradient(circle, oklch(0.8 0.09 250 / 0.42) 0%, oklch(0.45 0.14 255 / 0.2) 40%, transparent 72%)",
            willChange: "opacity, transform",
          }}
        />

        {/* 01 — THE DEVICE + PORTAL */}
        <div ref={deviceLayer} className="absolute inset-0 z-20" style={{ willChange: "opacity" }}>
          <div className="absolute inset-0 md:left-[38%]">
            <Portal rootRef={portal} />
            <CssLaptop stageRef={stage} lidRef={lid} chassisRef={chassis} screenRef={screen} />
          </div>

          {/* HERO COPY */}
          <div
            ref={type}
            className="pointer-events-none absolute inset-x-0 bottom-[8vh] z-30 px-7 md:bottom-0 md:top-0 md:flex md:w-[42%] md:items-center md:px-[5vw]"
            style={{ willChange: "opacity, transform" }}
          >
            <div className="max-w-[34rem]">
              <span className="block font-mono text-[10px] uppercase tracking-[0.42em] text-primary">
                Digitální studio · Praha
              </span>
              <h1 className="mt-5 text-[2.1rem] font-medium leading-[1.04] tracking-[-0.04em] text-foreground md:text-[3.6vw]">
                Weby, e-shopy
                <br />
                a aplikace <span className="text-primary">na míru.</span>
              </h1>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Navrhujeme, vyvíjíme a optimalizujeme digitální produkty, které posouvají firmy dál.
              </p>
              <Link to="/contact" className="btn-primary group pointer-events-auto mt-8 inline-flex">
                Chci projekt
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>

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

        {/* 02–06 — THE SERVICES, emerging from the portal */}
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
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[46vh] w-[46vh] rounded-full blur-[110px] will-change-transform"
                  style={{ background: "oklch(0.6 0.17 258 / 0.26)", transform: "translate3d(-50%, -50%, 0)" }}
                />
                <div
                  data-layer="art"
                  aria-hidden
                  className="pointer-events-none absolute inset-0 hidden will-change-transform md:block"
                  style={{ transformOrigin: "18% 46%" }}
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
                        filter: "saturate(1.04) contrast(1.06) drop-shadow(0 42px 64px oklch(0.03 0.01 258 / 0.66))",
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
          className="pointer-events-none absolute inset-x-0 bottom-0 z-40 h-[20vh]"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, oklch(0.115 0.018 258 / 0.14) 55%, oklch(0.115 0.018 258 / 0.34) 100%)",
          }}
        />
      </div>
    </div>
  );
}
