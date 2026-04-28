import { Check, MessageCircle, Clock, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const PLAN_DESCRIPTIONS: Record<string, string> = {
  START: "Pro firmy, které chtějí jednoduchou prezentaci se silným prvním dojmem.",
  BUSINESS: "Pro firmy, které potřebují web, jenž reálně přivádí zákazníky a poptávky.",
  PRO: "Pro náročné projekty — e-shopy, integrace a komplexní řešení na míru.",
};

const PLAN_BENEFITS: Record<string, string[]> = {
  START: [
    "Spuštění do 2 týdnů",
    "Připraveno pro Google a vyhledávače",
    "Profesionální první dojem",
  ],
  BUSINESS: [
    "Více poptávek z webu",
    "Měřitelné výsledky a analytika",
    "Snadná správa obsahu",
    "Růst návštěvnosti díky SEO",
  ],
  PRO: [
    "Řešení postavené na míru",
    "Vyšší obrat z e-shopu",
    "Dlouhodobá technická podpora",
  ],
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
            const benefits = PLAN_BENEFITS[plan.name] ?? [];
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
                <div className="mt-5 mb-6">
                  {plan.price ? (
                    <>
                      <span className="text-xs text-muted-foreground">{t.pricing.from} </span>
                      <span className="text-3xl font-bold text-foreground">{plan.price}</span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-foreground">{t.pricing.custom}</span>
                  )}
                </div>

                {benefits.length > 0 && (
                  <div className="mb-6 rounded-lg border border-primary/20 bg-primary/5 p-4">
                    <p className="text-[10px] uppercase tracking-widest text-primary font-bold mb-3">Co tím získáte</p>
                    <ul className="space-y-2">
                      {benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2 text-sm text-foreground/90">
                          <Sparkles className="h-3.5 w-3.5 text-primary mt-0.5 shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-3">Obsah balíčku</p>
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

        <div className="mt-16 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-transparent p-10 md:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Nejste si jistí?</p>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight max-w-2xl mx-auto mb-4">
              Navrhneme vám řešení zdarma.
            </h3>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Řekněte nám, co potřebujete. Připravíme nezávazný návrh i orientační cenu — bez závazků.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                <Clock className="h-3.5 w-3.5 text-primary" /> Odpovíme do 24 hodin
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                <MessageCircle className="h-3.5 w-3.5 text-primary" /> Nezávazná konzultace zdarma
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Individuální přístup
              </span>
            </div>
            <Link to="/contact" className="btn-primary">
              Získat nezávazný návrh
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
