import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

export function CtaBanner() {
  const { t } = useT();
  return (
    <section className="py-32 md:py-40 border-t border-border">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-14 md:p-24 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] opacity-[0.04]"
          >
            <Logo className="w-full h-auto" alt="" />
          </div>
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/20 blur-[140px]" />
          <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
          <div className="relative reveal">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-5 tracking-tight">{t.cta.title}</h2>
            <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto">{t.cta.subtitle}</p>
            <Link to="/contact" className="btn-primary group mx-auto inline-flex">
              {t.cta.btn}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
