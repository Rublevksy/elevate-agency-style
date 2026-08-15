import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

import { startFrameLoop, prefersReducedMotion } from "@/lib/raf";
import { useT } from "@/lib/i18n";

import sceneWeb from "@/assets/scene-web.webp";
import sceneEshop from "@/assets/scene-eshop.webp";
import sceneApps from "@/assets/scene-apps.webp";
import sceneDesign from "@/assets/scene-design.webp";
import sceneSeo from "@/assets/scene-seo.webp";

/**
 * SERVICE STAGE — the second scene of the film.
 *
 * Same volume as the hero (deep navy + electric blue light), no cards: one
 * cinematic media stage on the left that swaps as the visitor moves through the
 * editorial index on the right. Motion is one shared rAF loop writing only
 * transforms/opacity — no per-frame React state.
 */

const SCENES = [
  { img: sceneWeb, to: "/services/web" as const, tag: "01" },
  { img: sceneEshop, to: "/services/eshop" as const, tag: "02" },
  { img: sceneApps, to: "/services/web" as const, tag: "03" },
  { img: sceneDesign, to: "/services/design" as const, tag: "04" },
  { img: sceneSeo, to: "/services/branding" as const, tag: "05" },
];

const FALLBACK = [
  { title: "Weby", desc: "Rychlé weby na míru, které prodávají." },
  { title: "E-shopy", desc: "Prodejní řešení postavená na konverzi." },
  { title: "Aplikace", desc: "Produkty a interní systémy na míru." },
  { title: "Design", desc: "Vizuální identita a digitální design." },
  { title: "SEO", desc: "Viditelnost, která přináší poptávky." },
];

export function ServiceStage() {
  const { t } = useT();
  const items = FALLBACK.map((f, i) => {
    const loc = (t.services.items as unknown as { title: string; desc: string }[])[i];
    return { ...f, title: loc?.title ?? f.title, desc: loc?.desc ?? f.desc };
  });

  const wrap = useRef<HTMLDivElement>(null);
  const media = useRef<HTMLDivElement>(null);
  const rows = useRef<Array<HTMLAnchorElement | null>>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let last = -1;
    const tick = () => {
      const mid = window.innerHeight * 0.52;
      let best = 0;
      let bestD = Infinity;
      rows.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestD) {
          bestD = d;
          best = i;
        }
        // depth: rows drift toward the reader, brighten as they pass the line
        const k = Math.max(0, 1 - d / (window.innerHeight * 0.55));
        el.style.opacity = (0.34 + k * 0.66).toFixed(3);
        el.style.transform = `translate3d(${((1 - k) * 22).toFixed(2)}px, 0, 0)`;
      });
      if (best !== last) {
        last = best;
        setActive(best);
      }
      const m = media.current;
      const w = wrap.current;
      if (m && w) {
        const r = w.getBoundingClientRect();
        const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - mid) / window.innerHeight));
        m.style.transform = `translate3d(0, ${(p * -3.2).toFixed(2)}vh, 0) scale(${(1 + Math.abs(p) * 0.012).toFixed(4)})`;
      }
    };
    return startFrameLoop(tick, wrap.current);
  }, []);

  return (
    <section id="services" ref={wrap} className="relative overflow-hidden" aria-label="Služby">
      {/* the same light volume as the hero — never a colour cut */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 46% at 22% 12%, oklch(0.32 0.08 258 / 0.3) 0%, transparent 72%), radial-gradient(70% 60% at 86% 82%, oklch(0.28 0.07 258 / 0.22) 0%, transparent 70%)",
        }}
      />

      <div className="container-luxe relative pb-[14vh] pt-[8vh] md:pb-[18vh] md:pt-[10vh]">
        <div className="flex items-baseline justify-between gap-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.42em] text-primary md:text-[11px]">
            {t.services.subtitle}
          </p>
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground/50">
            {String(active + 1).padStart(2, "0")} / 05
          </span>
        </div>

        <div className="mt-[7vh] grid gap-[8vh] lg:grid-cols-[1.02fr_1fr] lg:items-start lg:gap-16">
          {/* the media stage — one frame, the scene inside swaps */}
          <div className="lg:sticky lg:top-[18vh]">
            <div
              ref={media}
              className="relative aspect-[4/3] w-full"
              style={{ willChange: "transform" }}
            >
              <div
                aria-hidden
                className="absolute inset-[6%] rounded-full blur-[70px]"
                style={{ background: "radial-gradient(circle, oklch(0.55 0.18 255 / 0.4) 0%, transparent 70%)" }}
              />
              {SCENES.map((s, i) => (
                <img
                  key={s.tag}
                  src={s.img}
                  alt={items[i].title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-contain transition-[opacity,transform] duration-[900ms] ease-out"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transform: `scale(${i === active ? 1 : 0.965})`,
                    filter: "drop-shadow(0 30px 70px oklch(0.1 0.03 258 / 0.7))",
                  }}
                />
              ))}
            </div>
          </div>

          {/* the editorial index */}
          <div className="flex flex-col">
            {items.map((s, i) => (
              <Link
                key={s.title}
                to={SCENES[i].to}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                className="group relative block border-t border-white/[0.07] py-8 first:border-t-0 md:py-10"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="flex items-start gap-6 md:gap-10">
                  <span className="mt-2 font-mono text-[10px] tracking-[0.28em] text-primary/80">{SCENES[i].tag}</span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-medium uppercase leading-[1.06] tracking-[-0.03em] text-foreground md:text-[2.4rem]">
                      {s.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">{s.desc}</p>
                    <span
                      aria-hidden
                      className="mt-5 block h-px w-full max-w-[14rem] origin-left scale-x-[0.18] transition-transform duration-500 group-hover:scale-x-100"
                      style={{ background: "linear-gradient(90deg, oklch(0.68 0.18 255), transparent)" }}
                    />
                  </div>
                  <ArrowUpRight className="mt-2 h-4 w-4 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
