import { ArrowRight } from "lucide-react";
import { useT } from "@/lib/i18n";

export function CtaBanner() {
  const { t } = useT();
  const scroll = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  return (
    <section className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-12 md:p-20 text-center">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/30 blur-[120px]" />
          <div className="relative">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-4">{t.cta.title}</h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">{t.cta.subtitle}</p>
            <button
              onClick={scroll}
              className="group inline-flex items-center gap-2 bg-primary text-primary-foreground px-7 py-4 rounded-lg font-medium hover:bg-primary/90 transition-all glow-primary"
            >
              {t.cta.btn}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
