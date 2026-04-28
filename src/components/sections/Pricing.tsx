import { Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const PLAN_DESCRIPTIONS: Record<string, string> = {
  START: "Pro firmy, které chtějí jednoduchou prezentaci se silným prvním dojmem.",
  BUSINESS: "Pro firmy, které potřebují web, který reálně přivádí zákazníky.",
  PRO: "Pro náročné projekty — e-shopy, integrace a komplexní řešení na míru.",
};

const POPULAR_LABEL = "Nejčastější volba";

export function Pricing() {
  const { t } = useT();

  return (
    <section id="pricing" className="py-28 md:py-36 border-t border-border bg-surface/30">
      <div className="container-luxe">
        <SectionHeading eyebrow="05" title={t.pricing.title} subtitle={t.pricing.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {t.pricing.plans.map((plan, i) => {
            const featured = i === 1;
            return (
              <div
                key={plan.name}
                className={`relative rounded-xl border p-8 flex flex-col ${
                  featured
                    ? "border-primary/50 bg-surface-elevated glow-primary"
                    : "border-border bg-surface"
                }`}
              >
                {featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
                    {POPULAR_LABEL}
                  </div>
                )}
                <h3 className="text-sm font-bold tracking-[0.2em] text-muted-foreground">{plan.name}</h3>
                <p className="mt-3 text-sm text-muted-foreground/90 leading-relaxed min-h-[3.5rem]">
                  {PLAN_DESCRIPTIONS[plan.name] ?? ""}
                </p>
                <div className="mt-5 mb-8">
                  {plan.price ? (
                    <>
                      <span className="text-xs text-muted-foreground">{t.pricing.from} </span>
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-foreground">{t.pricing.custom}</span>
                  )}
                </div>
                <ul className="space-y-3 mb-10 flex-1">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" strokeWidth={2} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className={`w-full py-3 rounded-lg text-sm font-medium transition-all text-center ${
                    featured
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border text-foreground hover:border-primary/60 hover:text-primary"
                  }`}
                >
                  {t.pricing.cta}
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
