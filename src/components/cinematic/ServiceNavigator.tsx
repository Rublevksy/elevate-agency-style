import { useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CINEMATIC } from "@/lib/cinematic-copy";
import { useT } from "@/lib/i18n";
import { AetherField } from "@/components/atmosphere/AetherField";
import { COMPOSITIONS } from "./ServicePreviews";

/**
 * Disciplines as one continuous editorial scene: large type on the left, a
 * hand-built interface composition on the right. Hovering or focusing a
 * discipline makes it dominant; clicking opens its existing detail route.
 */
export function ServiceNavigator() {
  const { lang } = useT();
  const c = CINEMATIC[lang];
  const [active, setActive] = useState(0);
  const atmosphere = useRef(0.4);

  return (
    <section id="services" className="relative overflow-hidden border-t border-border bg-[#05070b] py-24 md:py-36">
      {/* the same controlled atmosphere, held very low behind the content */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage: "radial-gradient(120% 90% at 50% 40%, #000 0%, rgba(0,0,0,0.35) 70%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(120% 90% at 50% 40%, #000 0%, rgba(0,0,0,0.35) 70%, transparent 100%)",
        }}
      >
        <AetherField className="h-full w-full" intensityRef={atmosphere} strength={0.55} />
      </div>

      <div className="container-luxe relative">
        <div className="mb-14 flex items-end justify-between gap-6 md:mb-20">
          <div>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
              {c.disciplinesEyebrow}
            </p>
            <h2 className="text-3xl font-light tracking-[-0.03em] text-foreground md:text-5xl">
              {c.disciplinesTitle}
            </h2>
          </div>
          <span className="hidden font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground md:block">
            {String(active + 1).padStart(2, "0")} / {String(c.disciplines.length).padStart(2, "0")}
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-center lg:gap-20">
          {/* left — the editorial index */}
          <ul className="border-t border-white/5">
            {c.disciplines.map((d, i) => {
              const on = i === active;
              return (
                <li key={d.id} className="border-b border-white/5">
                  <Link
                    to={d.to}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group flex items-baseline gap-5 py-6 transition-all duration-500 md:py-7"
                    style={{ paddingLeft: on ? 8 : 0 }}
                  >
                    <span
                      className={`font-mono text-[10px] transition-colors duration-500 ${
                        on ? "text-primary" : "text-muted-foreground/60"
                      }`}
                    >
                      {d.index}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-2xl font-light tracking-[-0.02em] transition-all duration-500 md:text-[2rem] ${
                          on ? "text-foreground" : "text-muted-foreground/70"
                        }`}
                      >
                        {d.label}
                      </span>
                      <span
                        className={`mt-1.5 block text-xs transition-all duration-500 md:text-sm ${
                          on ? "text-muted-foreground opacity-100" : "text-muted-foreground/50 opacity-70"
                        }`}
                      >
                        {d.note}
                      </span>
                    </span>
                    <ArrowUpRight
                      className={`h-4 w-4 shrink-0 transition-all duration-500 ${
                        on ? "translate-x-0 text-primary opacity-100" : "-translate-x-2 text-muted-foreground opacity-0"
                      }`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* right — the visual state of the active discipline */}
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-white/8 bg-gradient-to-b from-white/[0.04] to-transparent shadow-[0_40px_120px_-60px_rgba(59,130,246,0.45)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[70%] -translate-x-1/2 rounded-full bg-primary/12 blur-3xl transition-opacity duration-700"
            />
            {c.disciplines.map((d, i) => {
              const Composition = COMPOSITIONS[d.id];
              const on = i === active;
              if (!Composition) return null;
              return (
                <div
                  key={d.id}
                  aria-hidden={!on}
                  className="absolute inset-0 transition-all duration-700 ease-out"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: on ? "scale(1) translateY(0)" : "scale(0.985) translateY(10px)",
                    filter: on ? "blur(0px)" : "blur(6px)",
                    clipPath: on ? "inset(0% 0% 0% 0%)" : "inset(4% 0% 4% 0%)",
                  }}
                >
                  <Composition />
                </div>
              );
            })}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#05070b] to-transparent" />
            <span className="pointer-events-none absolute bottom-4 left-5 font-mono text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              {c.disciplines[active]?.label}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
