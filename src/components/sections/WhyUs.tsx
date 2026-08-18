import { UserCheck, MessageSquare, Cpu, Target } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const ICONS = [UserCheck, MessageSquare, Cpu, Target];

export function WhyUs() {
  const { t } = useT();
  return (
    <section className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="02" title={t.why.title} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {t.why.items.map((it, i) => {
            const Icon = ICONS[i];
            return (
              <div key={it.t} className="reveal" style={{ animationDelay: `${i * 0.06}s` }}>
                <Icon className="h-5 w-5 text-primary mb-6" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-foreground mb-2">{it.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{it.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
