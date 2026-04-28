import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import heroMockup from "@/assets/hero-mockup.jpg";

export function Hero() {
  const { t } = useT();
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="top" className="relative pt-36 pb-28 md:pt-48 md:pb-40 overflow-hidden">
      {/* animated grid */}
      <div className="absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      {/* moving lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent shimmer" />
      {/* soft glow */}
      <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[20rem] w-[20rem] rounded-full bg-primary/10 blur-[140px]" />

      {/* huge watermark logo */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] max-w-[1400px] opacity-[0.035]"
      >
        <Logo className="w-full h-auto" alt="" />
      </div>

      <div className="container-luxe relative grid lg:grid-cols-2 gap-20 items-center">
        <div className="reveal is-visible">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs uppercase tracking-widest text-muted-foreground mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t.hero.tag}
          </div>

          <div className="mb-8">
            <Logo className="h-14 md:h-20 w-auto" />
          </div>

          <p className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
            {t.hero.title1} <br />
            <span className="text-primary">{t.hero.title2}</span>
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-md leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <button
              onClick={() => scroll("contact")}
              className="btn-primary group"
            >
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scroll("portfolio")}
              className="btn-outline"
            >
              {t.hero.cta2}
            </button>
          </div>
        </div>

        <div className="reveal is-visible relative" style={{ animationDelay: "0.15s" }}>
          <div className="absolute -inset-6 bg-gradient-to-tr from-primary/20 to-transparent blur-3xl opacity-70" />
          <div className="relative rounded-2xl overflow-hidden border border-border bg-surface shadow-2xl">
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
