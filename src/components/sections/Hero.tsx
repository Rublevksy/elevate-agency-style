import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { Hero3D } from "@/components/Hero3D";

export function Hero() {
  const { t } = useT();

  return (
    <section id="top" className="relative pt-36 pb-28 md:pt-48 md:pb-40 overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent shimmer" />
      <div className="absolute top-1/3 -left-40 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[140px]" />
      <div className="absolute bottom-0 right-0 h-[20rem] w-[20rem] rounded-full bg-primary/10 blur-[140px]" />

      <div className="container-luxe relative grid lg:grid-cols-2 gap-20 items-center">
        <div className="reveal is-visible">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-xs uppercase tracking-widest text-muted-foreground mb-10">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t.hero.tag}
          </div>

          <div className="mb-10">
            <Logo className="w-full max-w-[500px] md:max-w-[640px] h-auto" />
          </div>


          <p className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.1] mb-5">
            {t.hero.title1} <br />
            <span className="text-primary">{t.hero.title2}</span>
          </p>
          <p className="text-base md:text-lg text-muted-foreground mb-12 max-w-md leading-relaxed">
            {t.hero.subtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link to="/contact" className="btn-primary group">
              {t.hero.cta1}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/projects" className="btn-outline">
              {t.hero.cta2}
            </Link>
          </div>
        </div>

        <div className="reveal is-visible relative" style={{ animationDelay: "0.15s" }}>
          <Hero3D />
        </div>
      </div>
    </section>
  );
}
