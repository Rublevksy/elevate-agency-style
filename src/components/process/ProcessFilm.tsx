import { useEffect, useRef, useState } from "react";
import { clamp01, easeFilm, lerp, range, useFilmProgress } from "@/components/devicefilm/film";
import { BriefStage, BuildStage, DesignStage, LaunchStage } from "./ProcessStages";

type Step = { n: string; title: string; desc: string; Stage: () => React.JSX.Element };

const STEPS: Step[] = [
  {
    n: "01",
    title: "START",
    desc: "Poznáme váš byznys, cíle a to, co od projektu skutečně potřebujete.",
    Stage: BriefStage,
  },
  {
    n: "02",
    title: "DESIGN",
    desc: "Navrhneme kompletní vizuální směr a UX. Ještě před vývojem vidíte, kam projekt směřuje.",
    Stage: DesignStage,
  },
  {
    n: "03",
    title: "BUILD",
    desc: "Schválený návrh převádíme do funkčního webu, e-shopu nebo aplikace.",
    Stage: BuildStage,
  },
  {
    n: "04",
    title: "LAUNCH",
    desc: "Testujeme, ladíme detaily a připravujeme projekt na skutečné používání.",
    Stage: LaunchStage,
  },
];

const N = STEPS.length;

/**
 * ELEVATE — CINEMATIC PROCESS.
 *
 * One continuous scene: a single floating project canvas that transforms from a
 * plain brief into a designed concept, then into a real build, then into a live
 * product. Scroll is the only driver and it reverses exactly.
 */
export function ProcessFilm() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useFilmProgress(wrap);
  const canvas = useRef<HTMLDivElement>(null);
  const stages = useRef<(HTMLDivElement | null)[]>([]);
  const rows = useRef<(HTMLDivElement | null)[]>([]);
  const atmos = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = 0.5 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    const tick = () => {
      const p = clamp01(progress.current ?? 0);
      smooth.x += ((reduced ? 0 : pointer.x) - smooth.x) * 0.06;
      smooth.y += ((reduced ? 0 : pointer.y) - smooth.y) * 0.06;

      // the four beats sit inside 0.04 → 0.9; the last stretch is the "HOTOVO" settle
      const s = clamp01(range(0.04, 0.9, p)) * N;

      if (canvas.current) {
        const drift = Math.sin(clamp01(p) * Math.PI) * 0.02;
        const ry = lerp(mobile ? 0 : 7, mobile ? 0 : -5, easeFilm(clamp01(s / N))) + smooth.x * (mobile ? 2 : 5);
        const rx = smooth.y * (mobile ? -1.2 : -3);
        const settle = easeFilm(range(0.9, 1, p));
        canvas.current.style.transform = `translate3d(${(smooth.x * (mobile ? 0.6 : 1.6)).toFixed(3)}vw, ${(smooth.y * -1 - settle * 2).toFixed(3)}vh, 0) rotateY(${ry.toFixed(2)}deg) rotateX(${rx.toFixed(2)}deg) scale(${(1 + drift - settle * 0.02).toFixed(4)})`;
      }
      if (atmos.current) {
        atmos.current.style.transform = `translate3d(${smooth.x * -2}vw, ${smooth.y * 1.4}vh, 0)`;
        atmos.current.style.opacity = String(0.55 + Math.sin(clamp01(p) * Math.PI) * 0.35);
      }

      let active = Math.min(N - 1, Math.floor(s));
      if (s <= 0) active = 0;

      STEPS.forEach((_, i) => {
        // 0 → 1 while this stage owns the frame; the first and last beats hold
        let u = s - i;
        if (i === 0) u = Math.max(u, 0.5);
        if (i === N - 1) u = Math.min(u, 0.5);
        const vis = clamp01(1 - Math.abs(u - 0.5) / 0.72);
        const el = stages.current[i];
        if (el) {
          const dir = u < 0.5 ? 1 : -1;
          const off = (1 - vis) * 26 * dir;
          el.style.opacity = String(vis);
          el.style.transform = `translate3d(0, ${off.toFixed(2)}px, ${((1 - vis) * -140).toFixed(1)}px) scale(${(1 - (1 - vis) * 0.04).toFixed(4)})`;
          el.style.filter = `blur(${((1 - vis) * 8).toFixed(2)}px)`;
          el.style.visibility = vis < 0.01 ? "hidden" : "visible";
        }
        const row = rows.current[i];
        if (row) {
          const on = i === active ? 1 : 0;
          row.style.opacity = String(on ? 1 : 0.3);
          row.dataset["active"] = on ? "true" : "false";
        }
      });

      if (done.current) {
        const v = easeFilm(range(0.9, 0.99, p));
        done.current.style.opacity = String(v);
        done.current.style.transform = `translate3d(0, ${((1 - v) * 20).toFixed(2)}px, 0)`;
        done.current.style.visibility = v < 0.01 ? "hidden" : "visible";
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", check);
      window.removeEventListener("pointermove", onMove);
    };
  }, [progress, mobile]);

  return (
    <section id="process" ref={wrap} className="relative h-[420vh] bg-[#04060a]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* atmosphere: soft cinematic glow + thin technical lines + grain */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 55% at 68% 40%, oklch(0.24 0.05 258 / 0.42) 0%, transparent 72%), linear-gradient(180deg, #04060a 0%, #060910 55%, #04060a 100%)",
          }}
        />
        <div ref={atmos} aria-hidden className="absolute inset-[-6%]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(to right, oklch(1 0 0 / 0.035) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / 0.025) 1px, transparent 1px)",
              backgroundSize: mobile ? "56px 56px" : "84px 84px",
              maskImage: "radial-gradient(60% 60% at 60% 45%, black 0%, transparent 78%)",
              WebkitMaskImage: "radial-gradient(60% 60% at 60% 45%, black 0%, transparent 78%)",
            }}
          />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-soft-light"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
        />

        <div className="relative z-10 mx-auto flex h-full max-w-[100rem] flex-col justify-center gap-8 px-7 md:grid md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] md:items-center md:gap-[5vw] md:px-[6vw]">
          {/* copy column */}
          <div>
            <span className="block font-mono text-[10px] uppercase tracking-[0.4em] text-primary">Jak pracujeme</span>
            <h2 className="mt-5 max-w-[22rem] text-[1.9rem] font-medium leading-[1.06] tracking-[-0.035em] text-foreground md:max-w-none md:text-[2.9vw]">
              Od první myšlenky k hotovému digitálnímu produktu.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">
              Jasný proces, průběžný výsledek a žádné zbytečné kroky.
            </p>
            <p className="mt-4 max-w-sm border-l border-primary/40 pl-3 text-xs leading-relaxed text-foreground/80 md:text-sm">
              První konkrétní výsledek vidíte už během prvních 2 týdnů.
            </p>

            <ol className="mt-8 space-y-3 md:mt-10 md:space-y-4">
              {STEPS.map((st, i) => (
                <li key={st.n}>
                  <div
                    ref={(el) => {
                      rows.current[i] = el;
                    }}
                    data-active="false"
                    className="group flex gap-4 transition-opacity duration-500"
                    style={{ opacity: 0.3 }}
                  >
                    <span className="mt-0.5 font-mono text-[10px] tracking-[0.2em] text-primary">{st.n}</span>
                    <div className="min-w-0">
                      <span className="block font-mono text-[11px] uppercase tracking-[0.3em] text-foreground">
                        {st.title}
                      </span>
                      <p className="mt-1.5 max-w-[24rem] text-xs leading-relaxed text-muted-foreground data-[active=true]:text-foreground/70 md:text-[0.82rem]">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* the project canvas — one object, four states */}
          <div style={{ perspective: mobile ? "1200px" : "1800px", perspectiveOrigin: "55% 45%" }}>
            <div
              ref={canvas}
              className="relative mx-auto aspect-[16/10] w-full max-w-[46rem] rounded-xl border border-white/[0.08]"
              style={{
                transformStyle: "preserve-3d",
                willChange: "transform",
                background: "linear-gradient(165deg, oklch(0.16 0.02 258 / 0.9) 0%, oklch(0.09 0.012 258 / 0.95) 100%)",
                boxShadow:
                  "0 60px 140px -40px oklch(0.1 0.06 258 / 0.9), inset 0 1px 0 oklch(1 0 0 / 0.08), 0 0 0 1px oklch(0 0 0 / 0.4)",
              }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-xl" style={{ transformStyle: "preserve-3d" }}>
                {STEPS.map((st, i) => (
                  <div
                    key={st.n}
                    ref={(el) => {
                      stages.current[i] = el;
                    }}
                    className="absolute inset-0"
                    style={{ opacity: 0, willChange: "transform, opacity, filter" }}
                  >
                    <st.Stage />
                  </div>
                ))}
              </div>
              {/* glass edge highlight */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  background:
                    "linear-gradient(140deg, oklch(1 0 0 / 0.06) 0%, transparent 30%, transparent 70%, oklch(1 0 0 / 0.03) 100%)",
                }}
              />
            </div>

            {/* the ending beat */}
            <div
              ref={done}
              className="mt-7 text-center md:mt-9"
              style={{ opacity: 0, willChange: "transform, opacity" }}
            >
              <span className="font-mono text-lg uppercase tracking-[0.32em] text-foreground md:text-2xl">Hotovo.</span>
              <p className="mt-2 text-xs text-muted-foreground md:text-sm">
                Web, e-shop nebo aplikace připravená pro skutečný provoz.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
