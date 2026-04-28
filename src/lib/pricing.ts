export type PricingSlug = "web" | "eshop" | "branding";

export type PricingPage = {
  slug: PricingSlug;
  path: "/pricing/web" | "/pricing/eshop" | "/pricing/branding";
  eyebrow: string;
  title: string;
  description: string;
  bestFor: string;
  included: string[];
  results: { value: string; label: string }[];
  price: string;
  note: string;
};

export const PRICING_PAGES: Record<PricingSlug, PricingPage> = {
  web: {
    slug: "web",
    path: "/pricing/web",
    eyebrow: "Webové stránky",
    title: "Web, který přivádí poptávky",
    description:
      "Pro firmy, které potřebují profesionální prezentaci, jasnou nabídku a web připravený proměnit návštěvníky v klienty.",
    bestFor: "Lokální služby, B2B firmy, specialisté, studia a menší značky",
    included: [
      "UX návrh struktury a obsahu",
      "Prémiový responzivní design",
      "Vývoj rychlého webu",
      "Základní SEO a technická optimalizace",
      "Kontaktní formulář a měření konverzí",
      "Nasazení, kontrola a 30 dní podpory",
    ],
    results: [
      { value: "+45 %", label: "více poptávek" },
      { value: "<2 s", label: "rychlé načtení" },
      { value: "SEO", label: "připravený základ" },
    ],
    price: "od 10 000 Kč",
    note: "Finální cena závisí na rozsahu, počtu podstránek a obsahu.",
  },
  eshop: {
    slug: "eshop",
    path: "/pricing/eshop",
    eyebrow: "E-shop",
    title: "E-shop připravený vydělávat",
    description:
      "Kompletní prodejní řešení pro značky, které chtějí prodávat online bez zbytečného tření v nákupním procesu.",
    bestFor: "Nové e-shopy, redesign stávajícího obchodu a značky připravené růst",
    included: [
      "Strategie kategorií a nákupní cesty",
      "Produktové stránky a košík zaměřený na konverze",
      "Napojení plateb, dopravy a základních integrací",
      "Mobilní UX optimalizace",
      "Měření objednávek a analytika",
      "Spuštění, testování a 30 dní podpory",
    ],
    results: [
      { value: "+120 %", label: "konverze" },
      { value: "−45 %", label: "opuštěných košíků" },
      { value: "+2,4×", label: "více objednávek" },
    ],
    price: "od 25 000 Kč",
    note: "Cena se odvíjí od počtu produktů, integrací a požadavků na správu obchodu.",
  },
  branding: {
    slug: "branding",
    path: "/pricing/branding",
    eyebrow: "Logo & Branding",
    title: "Značka, kterou si lidé zapamatují",
    description:
      "Vizuální identita pro firmy, které chtějí působit důvěryhodně, konzistentně a odlišit se od konkurence.",
    bestFor: "Nové značky, rebranding, produktové řady a profesionální firemní identita",
    included: [
      "Strategie vizuálního směru",
      "Logo systém a varianty použití",
      "Barevná paleta a typografie",
      "Základní brand manuál",
      "Sociální a prezentační podklady",
      "Exporty pro web, tisk a sociální sítě",
    ],
    results: [
      { value: "100 %", label: "konzistentní image" },
      { value: "+ důvěra", label: "při prvním kontaktu" },
      { value: "ready", label: "pro web i kampaně" },
    ],
    price: "od 5 000 Kč",
    note: "Rozsah upravíme podle toho, zda potřebujete pouze logo, nebo kompletní identitu.",
  },
};

export const PRICING_LIST = [PRICING_PAGES.web, PRICING_PAGES.eshop, PRICING_PAGES.branding];
