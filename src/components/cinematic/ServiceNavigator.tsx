import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CINEMATIC } from "@/lib/cinematic-copy";
import { useT } from "@/lib/i18n";
import { screenshotUrl } from "@/lib/projects";

const PREVIEW: Record<string, string> = {
  web: screenshotUrl("https://biodentclinic.cz", 1600, 1000),
  commerce: screenshotUrl("https://exclusivebeauty.cz", 1600, 1000),
  apps: screenshotUrl("https://wrestlinggympraha.cz", 1600, 1000),
  product: screenshotUrl("https://inhomepraha.cz", 1600, 1000),
  brand: screenshotUrl("https://euromotors.cz", 1600, 1000),
};

export function ServiceNavigator() {
  const { lang } = useT();
  const c = CINEMATIC[lang];
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="relative border-t border-border py-24 md:py-32">
      <div className="container-luxe">
        <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
          <div>
            <p className="mb-3 text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
              {c.disciplinesEyebrow}
            </p>
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
              {c.disciplinesTitle}
            </h2>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.3fr)] lg:gap-16">
          <ul className="divide-y divide-border border-y border-border">
            {c.disciplines.map((d, i) => (
              <li key={d.id}>
                <Link
                  to={d.to}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group flex items-center gap-5 py-5 transition-colors md:py-6"
                >
                  <span
                    className={`font-mono text-[10px] transition-colors ${
                      i === active ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {d.index}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-xl tracking-[-0.02em] transition-colors md:text-2xl ${
                        i === active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {d.label}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground md:text-sm">{d.note}</span>
                  </span>
                  <ArrowUpRight
                    className={`h-4 w-4 shrink-0 transition-all ${
                      i === active
                        ? "translate-x-0 text-primary opacity-100"
                        : "-translate-x-1 text-muted-foreground opacity-0"
                    }`}
                  />
                </Link>
              </li>
            ))}
          </ul>

          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface">
            {c.disciplines.map((d, i) => (
              <img
                key={d.id}
                src={PREVIEW[d.id]}
                alt={d.label}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ${
                  i === active ? "scale-100 opacity-100" : "scale-[1.05] opacity-0"
                }`}
              />
            ))}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
