import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

export function Results() {
  const { t } = useT();
  return (
    <section className="py-28 md:py-36 border-t border-border bg-surface/30 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="container-luxe relative">
        <SectionHeading eyebrow={t.results.eyebrow} title={t.results.title} />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
          {t.results.items.map((it) => (
            <div
              key={it.l}
              className="reveal bg-background p-8 md:p-12 flex flex-col items-start hover:bg-surface/60 transition-colors"
            >
              <p className="text-5xl md:text-6xl font-extrabold text-gradient tracking-tight mb-3">
                {it.n}
              </p>
              <p className="text-sm text-muted-foreground uppercase tracking-widest">{it.l}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
