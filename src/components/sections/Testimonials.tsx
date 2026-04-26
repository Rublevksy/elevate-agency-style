import { Quote } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  const { t } = useT();
  return (
    <section className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="06" title={t.testimonials.title} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.testimonials.items.map((it) => (
            <div key={it.q} className="p-8 rounded-xl border border-border bg-surface hover-lift">
              <Quote className="h-5 w-5 text-primary mb-6" strokeWidth={1.5} />
              <p className="text-base text-foreground leading-relaxed mb-8">"{it.q}"</p>
              <div className="pt-6 border-t border-border">
                <p className="text-sm font-bold text-foreground">{it.a}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{it.r}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
