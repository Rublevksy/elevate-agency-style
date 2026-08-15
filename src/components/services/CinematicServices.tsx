import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import sceneWeb from "@/assets/scene-web.webp";
import sceneEshop from "@/assets/scene-eshop.webp";
import sceneApps from "@/assets/scene-apps.webp";
import sceneSeo from "@/assets/scene-seo.webp";
import sceneDesign from "@/assets/scene-design.webp";
import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";
import { ServiceElements } from "./ServiceElements";


/**
 * ENTER THE ELEVATE STUDIO — one continuous scroll-driven stage where each
 * capability becomes the active scene. The campaign character and devices are
 * used as transparent cut-outs floating in the shared dark environment (no
 * cards, no framed thumbnails), layered with native interface fragments,
 * blue light and depth. Progress is written straight to transforms in a rAF
 * loop, so scrolling back reverses the film.
 */

type Scene = {
  id: string;
  index: string;
  label: string;
  title: string;
  desc: string;
  points: string[];
  to: string;
  src: string;
  /** cut-out sizing / anchoring inside the stage */
  height: string;
  offsetX: string;
  fragments: "web" | "shop" | "app" | "seo" | "brand";
};

const SCENES: Scene[] = [
  {
    id: "web",
    index: "01",
    label: "Weby",
    title: "Weby",
    desc: "Firemní weby, landing pages a moderní digitální prezentace.",
    points: ["UX / UI", "Responzivní design", "Výkon", "Konverze"],
    to: "/services/web",
    src: sceneWeb,
    height: "72vh",
    offsetX: "4%",
    fragments: "web",
  },
  {
    id: "eshop",
    index: "02",
    label: "E-shopy",
    title: "E-shopy",
    desc: "E-shopy navržené pro jednoduchý nákup, důvěru a konverzi.",
    points: ["UX nákupního procesu", "Mobilní optimalizace", "Checkout", "Výkon"],
    to: "/services/eshop",
    src: sceneEshop,
    height: "76vh",
    offsetX: "0%",
    fragments: "shop",
  },
  {
    id: "apps",
    index: "03",
    label: "Aplikace",
    title: "Mobilní aplikace",
    desc: "Aplikace pro iOS a Android, včetně přípravy a publikace v App Store a Google Play.",
    points: ["iOS", "Android", "App Store", "Google Play"],
    to: "/contact",
    src: sceneApps,
    height: "74vh",
    offsetX: "6%",
    fragments: "app",
  },
  {
    id: "seo",
    index: "04",
    label: "SEO & optimalizace",
    title: "SEO & optimalizace",
    desc: "Technické SEO, rychlost webu, Core Web Vitals, indexace a průběžná optimalizace výkonu.",
    points: ["SEO", "Rychlost", "Core Web Vitals", "Indexace"],
    to: "/audit",
    src: sceneSeo,
    height: "58vh",
    offsetX: "10%",
    fragments: "seo",
  },
  {
    id: "design",
    index: "05",
    label: "Logo & design",
    title: "Logo & design",
    desc: "Tvorba loga, vizuální identity, UI/UX a kompletního vizuálního směru značky.",
    points: ["Logo", "Brand identity", "UI/UX", "Visual direction"],
    to: "/services/design",
    src: sceneDesign,
    height: "68vh",
    offsetX: "2%",
    fragments: "brand",
  },
];

const CTA = "Detail služby";

/** scroll distance per service — long enough for a real resting state */
const VH_PER_SCENE = 240;
/** share of each service's scroll unit spent transitioning (the rest is HOLD) */
const TRANSITION = 0.34;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/**
 * Map the raw 0→1 section progress onto a stage position where each service
 * gets a long stable plateau and only a short window is used to cross-fade
 * into the next one. Purely a function of progress, so scrubbing backwards
 * reverses the film exactly.
 */
function holdStage(p: number, count: number) {
  const raw = Math.min(count - 1, Math.max(0, p * (count - 1)));
  const i = Math.min(count - 2, Math.floor(raw));
  const fr = raw - i;
  const start = (1 - TRANSITION) / 2;
  const t = Math.min(1, Math.max(0, (fr - start) / TRANSITION));
  return i + smoothstep(t);
}



/* ------------------------------------------------------------------ */
/* shared environment                                                  */
/* ------------------------------------------------------------------ */

function Depth({ progress }: { progress: React.RefObject<number> }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    return startFrameLoop(() => {
      const el = ref.current;
      if (el) el.style.setProperty("--p", String(progress.current ?? 0));
    }, ref.current);
  }, [progress]);


  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute -top-[18%] left-[46%] h-[78vh] w-[78vh] rounded-full blur-[130px]"
        style={{
          background: "oklch(0.55 0.15 258 / 0.18)",
          transform: "translate3d(calc(var(--p, 0) * -8vw), calc(var(--p, 0) * 14vh), 0)",
        }}
      />
      <div
        className="absolute bottom-[-12%] left-[-10%] h-[54vh] w-[54vh] rounded-full blur-[140px]"
        style={{
          background: "oklch(0.45 0.11 258 / 0.14)",
          transform: "translate3d(calc(var(--p, 0) * 6vw), calc(var(--p, 0) * -9vh), 0)",
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, oklch(0.65 0.18 255 / 0.16) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.65 0.18 255 / 0.1) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          maskImage: "radial-gradient(75% 65% at 55% 45%, #000 0%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(75% 65% at 55% 45%, #000 0%, transparent 100%)",
          transform: "translate3d(0, calc(var(--p, 0) * -7vh), 0)",
        }}
      />
      <div
        className="absolute inset-y-0 left-[20%] w-px"
        style={{
          background: "linear-gradient(to bottom, transparent, oklch(0.65 0.18 255 / 0.16), transparent)",
          transform: "translate3d(0, calc(var(--p, 0) * 12vh), 0)",
        }}
      />
      <div
        className="absolute inset-x-0 top-[40%] h-px"
        style={{
          background: "linear-gradient(to right, transparent, oklch(0.65 0.18 255 / 0.12), transparent)",
          transform: "translate3d(calc(var(--p, 0) * -5vw), 0, 0)",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function CinematicServices() {
  const sectionRef = useRef<HTMLElement>(null);
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progress = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduced = prefersReducedMotion();
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };

    const onMove = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    if (!reduced) window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {

      const section = sectionRef.current;
      if (section) {
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
        progress.current = p;

        smooth.x += (pointer.x - smooth.x) * 0.07;
        smooth.y += (pointer.y - smooth.y) * 0.07;

        const mobile = window.innerWidth < 768;
        const par = mobile ? 0.3 : 1;
        const cursor = mobile ? 0 : 1;
        const stage = holdStage(p, SCENES.length);
        const vh = window.innerHeight / 100;

        sceneRefs.current.forEach((el, i) => {
          if (!el) return;
          const d = stage - i;
          const away = Math.min(1, Math.abs(d));
          const near = 1 - away;
          el.style.opacity = String(Math.max(0, 1 - away * 1.4));
          el.style.visibility = away >= 0.99 ? "hidden" : "visible";

          const text = el.querySelector<HTMLElement>("[data-layer='text']");
          const figure = el.querySelector<HTMLElement>("[data-layer='figure']");
          const frag = el.querySelector<HTMLElement>("[data-layer='frag']");
          const glow = el.querySelector<HTMLElement>("[data-layer='glow']");

          if (text) {
            text.style.transform = `translate3d(${smooth.x * 3 * cursor}px, ${(-d * 4 * vh + smooth.y * 2 * cursor).toFixed(2)}px, 0)`;
          }
          if (frag) {
            frag.style.transform = `translate3d(0px, ${(-d * 4 * vh * par).toFixed(2)}px, 0)`;
            frag.style.opacity = "1";
            const floats = frag.querySelectorAll<HTMLElement>("[data-float]");
            floats.forEach((f, k) => {
              const depth = Number(f.dataset.depth ?? 0.5);
              const mx = smooth.x * (3 + depth * 9) * cursor;
              const my = smooth.y * (2 + depth * 6) * cursor;
              const sy = -d * (5 + depth * 14) * vh * par;
              const rot = (k % 2 === 0 ? -1 : 1) * (0.5 + depth * 1.1) - d * depth * 1.4;
              const enter = Math.max(0, Math.min(1, 1 - (away - depth * 0.1) * 2.1));
              f.style.transform = `translate3d(${(mx + depth * d * -16).toFixed(2)}px, ${(my + sy).toFixed(2)}px, 0) scale(${(0.93 + enter * 0.07 + depth * 0.02).toFixed(4)}) rotate(${rot.toFixed(2)}deg)`;
              f.style.opacity = String(enter);
              f.style.filter = `blur(${((1 - enter) * 5).toFixed(2)}px)`;
              f.style.willChange = "transform, opacity";
            });
          }
          if (figure) {
            figure.style.transform = `translate3d(${smooth.x * 6 * cursor}px, ${(-d * 7 * vh * par + smooth.y * 4 * cursor).toFixed(2)}px, 0) scale(${(0.93 + near * 0.07).toFixed(4)}) rotate(${(d * -0.7).toFixed(3)}deg)`;
            figure.style.filter = `blur(${(away * away * 8).toFixed(2)}px)`;
          }
          if (glow) {
            glow.style.opacity = String(0.25 + near * 0.75);
            glow.style.transform = `translate3d(${smooth.x * -4 * cursor}px, ${(-d * 5 * vh).toFixed(2)}px, 0) scale(${(0.9 + near * 0.15).toFixed(3)})`;
          }
        });

        const next = Math.min(SCENES.length - 1, Math.round(stage));
        setActive((prev) => (prev === next ? prev : next));
      }
    };
    const stop = startFrameLoop(tick, sectionRef.current);

    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);


  return (
    <section ref={sectionRef} className="relative" style={{ height: `${SCENES.length * VH_PER_SCENE}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <Depth progress={progress} />

        {/* vertical chapter indicator */}
        <div className="pointer-events-none absolute left-4 top-1/2 z-20 hidden -translate-y-1/2 flex-col gap-4 md:flex lg:left-8">
          {SCENES.map((s, i) => {
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
          {SCENES.map((s, i) => (
            <div
              key={s.id}
              ref={(el) => {
                sceneRefs.current[i] = el;
              }}
              className="absolute inset-0 z-10 flex items-center"
              style={{ opacity: i === 0 ? 1 : 0, pointerEvents: "none" }}
            >
              <Stage scene={s} eager={i === 0} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Stage({ scene, eager }: { scene: Scene; eager: boolean }) {
  return (
    <div className="container-luxe grid w-full items-center gap-6 md:grid-cols-[0.85fr_1.15fr] md:gap-10">
      {/* copy */}
      <div data-layer="text" className="relative z-20 order-2 will-change-transform md:order-1">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
          {scene.index} / {scene.label}
        </p>
        <h3 className="mt-5 text-4xl font-medium leading-[1.02] tracking-[-0.035em] text-foreground md:text-[3.6vw]">
          {scene.title}
        </h3>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">{scene.desc}</p>
        <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          {scene.points.map((pt) => (
            <li key={pt} className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
              <span className="h-px w-3 bg-primary/60" />
              {pt}
            </li>
          ))}
        </ul>
        <Link
          to={scene.to}
          className="group mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80 transition-colors hover:text-primary"
          style={{ pointerEvents: "auto" }}
        >
          {CTA}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>

      {/* composition — cut-out character/devices floating in the environment */}
      <div className="relative order-1 h-[42vh] md:order-2 md:h-[80vh]">
        {/* blue key light behind the subject */}
        <div
          data-layer="glow"
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[52vh] w-[52vh] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[110px] will-change-transform"
          style={{ background: "oklch(0.6 0.17 258 / 0.3)" }}
        />
        {/* composed floating service elements — foreground / mid layers */}
        <div data-layer="frag" aria-hidden className="pointer-events-none absolute inset-0 hidden will-change-transform md:block">
          <ServiceElements kind={scene.fragments} />
        </div>

        {/* the fixed brand character + devices, lit into the environment */}
        <div
          data-layer="figure"
          className="absolute bottom-0 right-0 will-change-transform"
          style={{ transform: `translateX(${scene.offsetX})` }}
        >
          {/* contact shadow grounding the subject */}
          <div
            aria-hidden
            className="pointer-events-none absolute bottom-[2%] left-1/2 h-[7%] w-[78%] -translate-x-1/2 rounded-[50%] blur-2xl"
            style={{ background: "oklch(0.03 0.01 258 / 0.75)" }}
          />
          <div className="relative">
            <img
              src={scene.src}
              alt=""
              loading={eager ? "eager" : "lazy"}
              decoding="async"
              className="h-[40vh] w-auto max-w-none md:h-[var(--fh)]"
              style={
                {
                  "--fh": scene.height,
                  filter:
                    "saturate(1.06) contrast(1.08) brightness(1.03) drop-shadow(0 46px 70px oklch(0.03 0.01 258 / 0.7)) drop-shadow(-14px -6px 26px oklch(0.6 0.17 258 / 0.3))",
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 9%, #000 88%, transparent 100%), linear-gradient(to right, transparent 0%, #000 8%, #000 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 9%, #000 88%, transparent 100%), linear-gradient(to right, transparent 0%, #000 8%, #000 100%)",
                  maskComposite: "intersect",
                  WebkitMaskComposite: "source-in",
                } as React.CSSProperties
              }
            />
            {/* blue rim light hugging the subject silhouette */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 mix-blend-screen"
              style={{
                background: "linear-gradient(115deg, oklch(0.65 0.18 255 / 0.4) 0%, transparent 42%)",
                maskImage: `url(${scene.src})`,
                WebkitMaskImage: `url(${scene.src})`,
                maskSize: "100% 100%",
                WebkitMaskSize: "100% 100%",
                maskRepeat: "no-repeat",
                WebkitMaskRepeat: "no-repeat",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
