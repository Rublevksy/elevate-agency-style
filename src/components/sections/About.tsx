import { useT } from "@/lib/i18n";

export function About() {
  const { t } = useT();
  return (
    <section className="py-32 md:py-40 border-t border-border relative overflow-hidden">
      {/* Giant E watermark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/2 -translate-y-1/2 text-[28rem] font-extrabold leading-none text-foreground/[0.025] select-none tracking-tighter"
      >
        E
      </div>
      <div className="container-luxe relative grid lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-4">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.about.eyebrow}</p>
          <div className="h-px w-12 bg-primary" />
        </div>
        <div className="lg:col-span-8 reveal">
          <h2 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight leading-[1.1] mb-8">
            {t.about.title}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {t.about.body}
          </p>
        </div>
      </div>
    </section>
  );
}
