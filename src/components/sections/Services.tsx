import { Monitor, ShoppingBag, Sparkles, Palette } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const ICONS = [Monitor, ShoppingBag, Sparkles, Palette];

export function Services() {
  const { t } = useT();
  return (
    <section id="services" className="py-28 md:py-36">
      <div className="container-luxe">
        <SectionHeading eyebrow="01" title={t.services.title} subtitle={t.services.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.services.items.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <div key={s.title} className="hover-lift group p-8 rounded-xl border border-border bg-surface">
                <Icon className="h-7 w-7 text-primary mb-8" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-foreground mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
