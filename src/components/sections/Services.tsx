import { Link } from "@tanstack/react-router";
import { Monitor, ShoppingBag, Sparkles, Palette, ArrowUpRight } from "lucide-react";
import { useT, SERVICE_SLUGS } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const ICONS = [Monitor, ShoppingBag, Sparkles, Palette];

export function Services() {
  const { t } = useT();
  return (
    <section id="services" className="py-32 md:py-40 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="01" title={t.services.title} subtitle={t.services.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[i];
            const slug = SERVICE_SLUGS[i];
            return (
              <Link
                key={s.title}
                to="/services/$slug"
                params={{ slug }}
                className="reveal hover-lift group p-10 rounded-xl border border-border bg-surface/50 backdrop-blur-sm relative overflow-hidden block"
              >
                <span
                  aria-hidden
                  className="absolute -right-4 -bottom-8 text-[8rem] font-extrabold leading-none text-foreground/[0.03] select-none"
                >
                  E
                </span>
                <Icon className="h-5 w-5 text-primary mb-10 relative" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-foreground mb-3 relative">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative mb-6">{s.desc}</p>
                <span className="relative text-xs uppercase tracking-widest text-primary inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {t.services.learnMore}
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
