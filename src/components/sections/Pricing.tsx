import { Check, MessageCircle, Clock, Sparkles, Globe, ShoppingBag, Palette } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

type Offer = {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  name: string;
  tagline: string;
  features: string[];
  price: string;
  priceLabel: string;
};

const OFFERS: Offer[] = [
  {
    key: "web",
    icon: Globe,
    name: "Webové stránky",
    tagline: "Moderní web, který přivádí klienty.",
    features: [
      "Design na míru",
      "Responzivní zobrazení",
      "SEO základ",
      "Optimalizace rychlosti",
    ],
    price: "10 000 Kč",
    priceLabel: "od",
  },
  {
    key: "eshop",
    icon: ShoppingBag,
    name: "E-shop",
    tagline: "Prodejní řešení připravené na růst.",
    features: [
      "Návrh struktury",
      "Platební systémy",
      "UX optimalizace",
      "Mobilní verze",
    ],
    price: "25 000 Kč",
    priceLabel: "od",
  },
  {
    key: "branding",
    icon: Palette,
    name: "Logo & Branding",
    tagline: "Vizuální identita, která zaujme.",
    features: [
      "Logo (více variant)",
      "Barevná paleta",
      "Vizuální styl",
    ],
    price: "5 000 Kč",
    priceLabel: "od",
  },
];

export function Pricing() {
  const { t } = useT();

  return (
    <section id="pricing" className="py-28 md:py-36 border-t border-border bg-surface/30">
      <div className="container-luxe">
        <SectionHeading eyebrow="05" title={t.pricing.title} subtitle={t.pricing.subtitle} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {OFFERS.map((o, i) => {
            const Icon = o.icon;
            const featured = i === 1;
            return (
              <div
                key={o.key}
                className={`relative rounded-2xl border p-8 md:p-10 flex flex-col transition-all ${
                  featured
                    ? "border-primary/50 bg-surface-elevated glow-primary"
                    : "border-border bg-surface hover:border-primary/40"
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-foreground">{o.name}</h3>
                </div>

                <p className="text-sm text-muted-foreground leading-relaxed mb-8 min-h-[3rem]">
                  {o.tagline}
                </p>

                <ul className="space-y-3 mb-10 flex-1">
                  {o.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-sm text-foreground/90">
                      <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" strokeWidth={2.5} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mb-6 pt-6 border-t border-border">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">{o.priceLabel} </span>
                  <div className="text-3xl font-bold text-foreground mt-1">{o.price}</div>
                </div>

                <Link
                  to="/contact"
                  className={`w-full py-3 rounded-lg text-sm font-medium transition-all text-center ${
                    featured
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border border-border text-foreground hover:border-primary/60 hover:text-primary"
                  }`}
                >
                  Získat nabídku
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
              Řekněte nám, co potřebujete. Připravíme nezávazný návrh i orientační cenu — odpovíme do 24 hodin.
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
