import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import heroMockup from "@/assets/hero-mockup.jpg";

export function Hero() {
  const { t } = useT();
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="top" className="relative pt-32 pb-24 md:pt-40 md:pb-32 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
      <div className="absolute top-1/4 -left-32 h-96 w-96 rounded-full bg-primary/20 blur-[120px]" />

      <div className="container-luxe relative grid lg:grid-cols-2 gap-16 items-center">
        <div className="fade-in-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs uppercase tracking-widest text-muted-foreground mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t.hero.tag}
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            <span className="block text-gradient">ELEVATE</span>
          </h1>

          <p className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3">
            {t.hero.title1} <br />
            <span className="text-primary">{t.hero.title2}</span>
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-md">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scroll("contact")}
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3.5 rounded-lg font-medium text-sm hover:bg-primary/90 transition-all glow-primary"
            >
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scroll("portfolio")}
              className="inline-flex items-center gap-2 border border-border px-6 py-3.5 rounded-lg font-medium text-sm text-foreground hover:border-primary/60 hover:text-primary transition-all"
            >
              {t.hero.cta2}
            </button>
          </div>
        </div>

        <div className="fade-in-up relative" style={{ animationDelay: "0.15s" }}>
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary/30 to-transparent blur-3xl opacity-60" />
          <div className="relative rounded-2xl overflow-hidden border border-border bg-surface">
            <img
              src={heroMockup}
              alt="ELEVATE — modern dashboard mockup"
              width={1280}
              height={960}
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
