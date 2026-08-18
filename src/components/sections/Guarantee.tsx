import { Clock, UserCog, Wrench } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const ICONS = [Clock, UserCog, Wrench];

export function Guarantee() {
  const { t } = useT();
  return (
    <section className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow={t.guarantee.eyebrow} title={t.guarantee.title} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.guarantee.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={it.t}
                className="reveal hover-lift p-10 rounded-xl border border-border bg-surface/40 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 text-primary mb-8" strokeWidth={1.5} />
                <h3 className="text-lg font-bold text-foreground mb-3">{it.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{it.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
