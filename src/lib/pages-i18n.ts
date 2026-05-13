import type { Lang } from "./i18n";

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

type PagesDict = {
  common: {
    backToServices: string;
    backToPricing: string;
    getQuote: string;
    viewPricing: string;
    consultation: string;
    reply24h: string;
    individual: string;
    limitedClients: string;
    price: string;
    from: string;
    showService: string;
    free: string;
    learnMore: string;
  };
  pricingIndex: {
    eyebrow: string;
    title: string;
    subtitle: string;
    sectionTitle: string;
    sectionSubtitle: string;
    viewPricing: string;
    notSure: string;
    notSureTitle: string;
    notSureText: string;
    notSureCta: string;
  };
  pricingDetail: {
    bestForLabel: string;
    bestForTitle: string;
    resultsLabel: string;
    resultsTitle: string;
    finalCtaTitle: string;
    finalCtaText: string;
    finalCtaBtn: string;
    priceLabel: string;
  };
  pricingPages: Record<PricingSlug, PricingPage>;
  servicesIndex: {
    cards: {
      to: "/services/web" | "/services/eshop" | "/services/branding" | "/services/design";
      title: string;
      desc: string;
    }[];
  };
  servicesWeb: {
    eyebrow: string;
    h1: string;
    intro: string;
    items: string[];
    processLabel: string;
    processTitle: string;
    processSteps: string[];
    resultLabel: string;
    resultBig: string;
    resultText: string;
    speed: string;
    seoBase: string;
    ctaTrust: string;
    ctaSubtitle: string;
  };
  servicesEshop: {
    eyebrow: string;
    h1Pre: string;
    h1Highlight: string;
    intro: string;
    trust: string[];
    whatWeDoLabel: string;
    whatWeDoTitle: string;
    whatWeDoText: string;
    whatWeDo: { t: string; d: string }[];
    processLabel: string;
    processTitle: string;
    process: { t: string; d: string }[];
    resultsLabel: string;
    resultsTitle: string;
    results: { n: string; l: string; d: string }[];
    includedLabel: string;
    includedTitle: string;
    includedText: string;
    included: string[];
    finalLabel: string;
    finalText: string;
    finalCta: string;
    liveCatalog: string;
  };
  servicesBranding: {
    eyebrow: string;
    h1: string;
    intro: string;
    creating: string;
    sectionTitle: string;
    items: string[];
    variantsLabel: string;
    variantsTitle: string;
    variantsText: string;
    variantsMeta: string;
    resultLabel: string;
    resultBig: string;
    resultText: string;
  };
  servicesDesign: {
    eyebrow: string;
    h1: string;
    intro: string;
    items: string[];
    finalTrust: string;
    finalPrice: string;
  };
  contactExtra: {
    location: string;
  };
  notSureLabels: {
    instagramOpen: string;
    telegramOpen: string;
  };
};

const PRICE_WEB = { CZ: "od 5 000 Kč", EN: "from 5 000 CZK", RU: "от 5 000 CZK", UA: "від 5 000 CZK" };
const PRICE_ESHOP = { CZ: "od 15 000 Kč", EN: "from 15 000 CZK", RU: "от 15 000 CZK", UA: "від 15 000 CZK" };
const PRICE_BRANDING = { CZ: "2 000 Kč", EN: "2 000 CZK", RU: "2 000 CZK", UA: "2 000 CZK" };
const PRICE_DESIGN = { CZ: "od 3 000 Kč", EN: "from 3 000 CZK", RU: "от 3 000 CZK", UA: "від 3 000 CZK" };

export const PAGES: Record<Lang, PagesDict> = {
  CZ: {
    common: {
      backToServices: "Všechny služby",
      backToPricing: "Všechny ceníky",
      getQuote: "Získat nabídku",
      viewPricing: "Zobrazit ceník",
      consultation: "Nezávazná konzultace zdarma",
      reply24h: "Odpovíme do 24 hodin",
      individual: "Individuální přístup",
      limitedClients: "Pracujeme s omezeným počtem klientů.",
      price: "Cena",
      from: "od",
      showService: "Zobrazit službu",
      free: "zdarma",
      learnMore: "Detail služby",
    },
    pricingIndex: {
      eyebrow: "Ceník",
      title: "Samostatné ceny pro konkrétní typ projektu.",
      subtitle: "Web, e-shop a branding mají vlastní stránku, vlastní rozsah práce a jasně popsaný výsledek.",
      sectionTitle: "Vyberte si typ řešení",
      sectionSubtitle: "Každý ceník má vlastní stránku, rozsah a jasný výsledek. Žádný výběrový systém ani univerzální balíčky.",
      viewPricing: "Zobrazit ceník",
      notSure: "Nejste si jistí?",
      notSureTitle: "Navrhneme vám řešení zdarma.",
      notSureText: "Pošlete nám krátký popis projektu. Doporučíme vhodný rozsah, ceník i další kroky.",
      notSureCta: "Nechat si poradit",
    },
    pricingDetail: {
      bestForLabel: "Popis",
      bestForTitle: "Pro koho dává smysl",
      resultsLabel: "Výsledky",
      resultsTitle: "Co má investice přinést",
      finalCtaTitle: "Chcete přesnou cenu pro váš projekt?",
      finalCtaText: "Po krátké konzultaci vám pošleme konkrétní návrh rozsahu, ceny a nejbližšího termínu.",
      finalCtaBtn: "Chci nezávazný návrh",
      priceLabel: "Cena",
    },
    pricingPages: {
      web: {
        slug: "web",
        path: "/pricing/web",
        eyebrow: "Webové stránky",
        title: "Web, který přivádí poptávky",
        description: "Pro firmy, které potřebují profesionální prezentaci, jasnou nabídku a web připravený proměnit návštěvníky v klienty.",
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
        price: PRICE_WEB.CZ,
        note: "Finální cena závisí na rozsahu, počtu podstránek a obsahu.",
      },
      eshop: {
        slug: "eshop",
        path: "/pricing/eshop",
        eyebrow: "E-shop",
        title: "E-shop připravený vydělávat",
        description: "Kompletní prodejní řešení pro značky, které chtějí prodávat online bez zbytečného tření v nákupním procesu.",
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
        price: PRICE_ESHOP.CZ,
        note: "Cena se odvíjí od počtu produktů, integrací a požadavků na správu obchodu.",
      },
      branding: {
        slug: "branding",
        path: "/pricing/branding",
        eyebrow: "Logo & Branding",
        title: "Značka, kterou si lidé zapamatují",
        description: "Vizuální identita pro firmy, které chtějí působit důvěryhodně, konzistentně a odlišit se od konkurence.",
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
        price: PRICE_BRANDING.CZ,
        note: "Rozsah upravíme podle toho, zda potřebujete pouze logo, nebo kompletní identitu.",
      },
    },
    servicesIndex: {
      cards: [
        { to: "/services/web", title: "Weby, které přivádí klienty", desc: "Prezentační weby, které přivádí poptávky a budují důvěru." },
        { to: "/services/eshop", title: "E-shopy, které vydělávají", desc: "Prodejní řešení navržená pro objednávky, košík a růst obratu." },
        { to: "/services/branding", title: "Značka, kterou si lidé zapamatují", desc: "Vizuální identita, kterou si zákazníci zapamatují." },
        { to: "/services/design", title: "Vizuály, které prodávají", desc: "Kampaně, bannery a materiály s prémiovým vizuálním dojmem." },
      ],
    },
    servicesWeb: {
      eyebrow: "Web design & SEO",
      h1: "Weby, které přivádí klienty",
      intro: "Tvoříme weby, které rychle vysvětlí vaši hodnotu, vzbudí důvěru a přivedou návštěvníka k poptávce.",
      items: ["design na míru", "responzivní web", "SEO základ"],
      processLabel: "Proces",
      processTitle: "Přesná cesta od nápadu k hotovému webu.",
      processSteps: ["Konzultace", "Wireframe", "Design", "Spuštění"],
      resultLabel: "Výsledek",
      resultBig: "+ více poptávek",
      resultText: "Web jasně ukáže, proč si má zákazník vybrat právě vás — a dovede ho ke kontaktu bez zbytečných překážek.",
      speed: "rychlost načtení",
      seoBase: "základ připraven",
      ctaTrust: "Nezávazná konzultace zdarma · Odpovíme do 24 hodin · Individuální přístup",
      ctaSubtitle: "Pracujeme s omezeným počtem klientů.",
    },
    servicesEshop: {
      eyebrow: "E-commerce performance",
      h1Pre: "E-shop, který za vás",
      h1Highlight: "vydělává",
      intro: "Stavíme e-shopy zaměřené na výkon a prodej. Od struktury kategorií, přes produktové stránky, až po rychlou cestu k objednávce — každý prvek je navržen, aby přinesl víc nákupů.",
      trust: ["Nezávazná konzultace zdarma", "Odpovíme do 24 hodin", "Individuální přístup"],
      whatWeDoLabel: "Co děláme",
      whatWeDoTitle: "Od návštěvy k objednávce bez zbytečného tření.",
      whatWeDoText: "Každý e-shop stavíme jako prodejní stroj. Promyšlený UX, rychlost a konverzně optimalizovaný checkout. Vše, co zákazník potřebuje k nákupu, najde okamžitě.",
      whatWeDo: [
        { t: "Návrh struktury e-shopu", d: "Kategorie, filtry a navigace tak, aby zákazník našel produkt do tří kliků." },
        { t: "Mobilní UX optimalizace", d: "Více než 70 % nákupů jde z mobilu — design stavíme primárně pro telefon." },
        { t: "Napojení plateb a dopravy", d: "Stripe, GoPay, Comgate, Zásilkovna, PPL, DPD — vše připravené ke spuštění." },
        { t: "Produktová a SEO optimalizace", d: "Produkty vidět ve vyhledávání. Strukturovaná data, popisy, rychlost." },
        { t: "Analytika a měření prodejů", d: "GA4 + e-commerce události. Víte, co prodává a co ne." },
        { t: "Bezpečnost a stabilita", d: "HTTPS, zálohy, ochrana proti spamu a útokům. Klid pro váš provoz." },
      ],
      processLabel: "Proces",
      processTitle: "Jasný plán. Žádná překvapení.",
      process: [
        { t: "Analýza a strategie", d: "Probereme produkty, cílovku, marže a konkurenci. Stanovíme cíle e-shopu." },
        { t: "Návrh UX a designu", d: "Wireframy, vizuální koncept a prototyp. Validujeme dřív, než kódujeme." },
        { t: "Vývoj a integrace", d: "Postavíme e-shop, napojíme platby, dopravu, sklad a analytiku." },
        { t: "Spuštění a optimalizace", d: "Spustíme, měříme a ladíme konverze. Růst nekončí dnem launche." },
      ],
      resultsLabel: "Výsledky",
      resultsTitle: "Co reálně dostanete.",
      results: [
        { n: "+38 %", l: "vyšší konverzní poměr", d: "Lepší produktové stránky, košík a checkout zaměřený na rychlost." },
        { n: "+2,4×", l: "více objednávek", d: "Struktura kategorií a UX postavené podle reálného nákupního chování." },
        { n: "−45 %", l: "opuštěných košíků", d: "Jednoduchý checkout, ukládání rozpracované objednávky a 1-click platba." },
        { n: "<1,5 s", l: "načtení stránky", d: "Optimalizace obrázků, cache a moderní stack pro maximální rychlost." },
      ],
      includedLabel: "V ceně",
      includedTitle: "Vše, co e-shop potřebuje k provozu.",
      includedText: "Žádné skryté náklady ani překvapení po spuštění. Dostanete e-shop připravený prodávat od prvního dne.",
      included: [
        "Responzivní design pro všechna zařízení",
        "Produktové stránky s galerií a variantami",
        "Pokročilé filtry a vyhledávání",
        "Správa skladu a stavů produktů",
        "Slevové kupóny a akce",
        "Napojení na účetnictví a sklad",
        "GDPR, cookie lišta, obchodní podmínky",
        "Školení správy a 30 dní podpory zdarma",
      ],
      finalLabel: "Pracujeme s omezeným počtem klientů",
      finalText: "Konečnou cenu navrhneme po konzultaci podle počtu produktů, integrací a funkcí. Nezávazně a zdarma.",
      finalCta: "Chci nezávaznou nabídku",
      liveCatalog: "Live katalog",
    },
    servicesBranding: {
      eyebrow: "Branding & logo",
      h1: "Značka, kterou si lidé zapamatují",
      intro: "Tvoříme vizuální identitu, která působí profesionálně, konzistentně a okamžitě odlišuje vaši firmu od konkurence.",
      creating: "Co tvoříme",
      sectionTitle: "Silná identita zvyšuje důvěru ještě před první schůzkou.",
      items: ["logo", "barvy", "typografie"],
      variantsLabel: "Varianty",
      variantsTitle: "Logo systém pro různé situace.",
      variantsText: "Ukázka různých stylů — od minimalistických wordmarků po monogramy a symbolické značky.",
      variantsMeta: "8 stylů · wordmark · monogram · ikona · 3D",
      resultLabel: "Výsledek",
      resultBig: "+ profesionální image",
      resultText: "Značka působí jednotně na webu, sociálních sítích, vizitkách i v prezentacích.",
    },
    servicesDesign: {
      eyebrow: "Graphic design",
      h1: "Grafika, která vypadá prémiově a podporuje prodej",
      intro: "Navrhujeme vizuály pro kampaně, sociální sítě a tisk tak, aby značka působila jednotně ve všech kanálech.",
      items: ["sociální sítě", "bannery a kampaně", "tiskové materiály"],
      finalTrust: "Nezávazná konzultace zdarma · Odpovíme do 24 hodin · Individuální přístup",
      finalPrice: PRICE_DESIGN.CZ,
    },
    contactExtra: { location: "Praha, CZ" },
    notSureLabels: { instagramOpen: "Otevřít Instagram", telegramOpen: "Napsat na Telegram" },
  },

  EN: {
    common: {
      backToServices: "All services",
      backToPricing: "All pricing",
      getQuote: "Get a quote",
      viewPricing: "View pricing",
      consultation: "Free, no-obligation consultation",
      reply24h: "We reply within 24 hours",
      individual: "Individual approach",
      limitedClients: "We work with a limited number of clients.",
      price: "Price",
      from: "from",
      showService: "View service",
      free: "free",
      learnMore: "Service details",
    },
    pricingIndex: {
      eyebrow: "Pricing",
      title: "Separate prices for each project type.",
      subtitle: "Web, e-shop and branding each have their own page, scope and clearly described outcome.",
      sectionTitle: "Pick the right solution",
      sectionSubtitle: "Each pricing page has its own scope and clear outcome. No selectors, no universal bundles.",
      viewPricing: "View pricing",
      notSure: "Not sure?",
      notSureTitle: "We'll suggest a solution for free.",
      notSureText: "Send us a short brief. We'll recommend the right scope, pricing and next steps.",
      notSureCta: "Get advice",
    },
    pricingDetail: {
      bestForLabel: "About",
      bestForTitle: "Who it makes sense for",
      resultsLabel: "Results",
      resultsTitle: "What the investment delivers",
      finalCtaTitle: "Want an exact price for your project?",
      finalCtaText: "After a short consultation we'll send you a concrete proposal of scope, price and the next available slot.",
      finalCtaBtn: "Get a no-obligation proposal",
      priceLabel: "Price",
    },
    pricingPages: {
      web: {
        slug: "web", path: "/pricing/web",
        eyebrow: "Websites",
        title: "A website that brings inquiries",
        description: "For companies that need a professional presence, a clear offer and a website built to turn visitors into clients.",
        bestFor: "Local services, B2B companies, specialists, studios and smaller brands",
        included: [
          "UX structure and content design",
          "Premium responsive design",
          "Fast website development",
          "Basic SEO and technical optimisation",
          "Contact form and conversion tracking",
          "Launch, QA and 30 days of support",
        ],
        results: [
          { value: "+45 %", label: "more inquiries" },
          { value: "<2 s", label: "fast load" },
          { value: "SEO", label: "ready foundation" },
        ],
        price: PRICE_WEB.EN,
        note: "Final price depends on scope, number of pages and content.",
      },
      eshop: {
        slug: "eshop", path: "/pricing/eshop",
        eyebrow: "E-shop",
        title: "An e-shop built to earn",
        description: "A complete sales solution for brands that want to sell online with no friction in the buying process.",
        bestFor: "New e-shops, redesigns and brands ready to grow",
        included: [
          "Category strategy and buying journey",
          "Product pages and conversion-focused checkout",
          "Payments, shipping and base integrations",
          "Mobile UX optimisation",
          "Order tracking and analytics",
          "Launch, QA and 30 days of support",
        ],
        results: [
          { value: "+120 %", label: "conversion" },
          { value: "−45 %", label: "abandoned carts" },
          { value: "+2.4×", label: "more orders" },
        ],
        price: PRICE_ESHOP.EN,
        note: "Price depends on the number of products, integrations and store management requirements.",
      },
      branding: {
        slug: "branding", path: "/pricing/branding",
        eyebrow: "Logo & Branding",
        title: "A brand people will remember",
        description: "Visual identity for companies that want to look trustworthy, consistent and stand out from the competition.",
        bestFor: "New brands, rebrands, product lines and professional corporate identity",
        included: [
          "Visual direction strategy",
          "Logo system and usage variants",
          "Colour palette and typography",
          "Basic brand guidelines",
          "Social and presentation assets",
          "Exports for web, print and social",
        ],
        results: [
          { value: "100 %", label: "consistent image" },
          { value: "+ trust", label: "at first contact" },
          { value: "ready", label: "for web and campaigns" },
        ],
        price: PRICE_BRANDING.EN,
        note: "We'll adjust the scope based on whether you need only a logo or a full identity.",
      },
    },
    servicesIndex: {
      cards: [
        { to: "/services/web", title: "Websites that bring clients", desc: "Presentation sites that bring inquiries and build trust." },
        { to: "/services/eshop", title: "E-shops that earn", desc: "Sales solutions designed for orders, checkout and revenue growth." },
        { to: "/services/branding", title: "A brand people remember", desc: "Visual identity your customers will remember." },
        { to: "/services/design", title: "Visuals that sell", desc: "Campaigns, banners and materials with a premium visual feel." },
      ],
    },
    servicesWeb: {
      eyebrow: "Web design & SEO",
      h1: "Websites that bring clients",
      intro: "We build websites that quickly explain your value, build trust and lead visitors to inquire.",
      items: ["custom design", "responsive web", "SEO foundation"],
      processLabel: "Process",
      processTitle: "A precise path from idea to a finished website.",
      processSteps: ["Consultation", "Wireframe", "Design", "Launch"],
      resultLabel: "Result",
      resultBig: "+ more inquiries",
      resultText: "The website clearly shows why a customer should choose you — and leads them to contact without unnecessary friction.",
      speed: "page load",
      seoBase: "foundation ready",
      ctaTrust: "Free consultation · Reply within 24 hours · Individual approach",
      ctaSubtitle: "We work with a limited number of clients.",
    },
    servicesEshop: {
      eyebrow: "E-commerce performance",
      h1Pre: "An e-shop that",
      h1Highlight: "earns for you",
      intro: "We build e-shops focused on performance and sales. From category structure, through product pages, to a fast path to checkout — every element is designed to bring more orders.",
      trust: ["Free consultation", "Reply within 24 hours", "Individual approach"],
      whatWeDoLabel: "What we do",
      whatWeDoTitle: "From visit to order with zero friction.",
      whatWeDoText: "We build every e-shop as a sales machine. Thoughtful UX, speed and a conversion-optimised checkout. Everything a customer needs to buy is right there.",
      whatWeDo: [
        { t: "E-shop structure design", d: "Categories, filters and navigation so the customer finds the product in three clicks." },
        { t: "Mobile UX optimisation", d: "Over 70% of purchases come from mobile — we design for the phone first." },
        { t: "Payments and shipping integrations", d: "Stripe, GoPay, Comgate, Zásilkovna, PPL, DPD — all ready to launch." },
        { t: "Product and SEO optimisation", d: "Products visible in search. Structured data, descriptions, speed." },
        { t: "Analytics and sales tracking", d: "GA4 + e-commerce events. You know what sells and what doesn't." },
        { t: "Security and stability", d: "HTTPS, backups, spam and attack protection. Peace of mind for your operation." },
      ],
      processLabel: "Process",
      processTitle: "A clear plan. No surprises.",
      process: [
        { t: "Analysis and strategy", d: "We discuss products, audience, margins and competition. We set e-shop goals." },
        { t: "UX and design proposal", d: "Wireframes, visual concept and prototype. We validate before we code." },
        { t: "Development and integrations", d: "We build the e-shop, connect payments, shipping, stock and analytics." },
        { t: "Launch and optimisation", d: "We launch, measure and tune conversions. Growth doesn't stop on launch day." },
      ],
      resultsLabel: "Results",
      resultsTitle: "What you actually get.",
      results: [
        { n: "+38 %", l: "higher conversion rate", d: "Better product pages, cart and checkout focused on speed." },
        { n: "+2.4×", l: "more orders", d: "Category structure and UX built around real buying behaviour." },
        { n: "−45 %", l: "abandoned carts", d: "Simple checkout, saved orders and 1-click payment." },
        { n: "<1.5 s", l: "page load", d: "Image optimisation, cache and modern stack for maximum speed." },
      ],
      includedLabel: "Included",
      includedTitle: "Everything an e-shop needs to run.",
      includedText: "No hidden costs and no surprises after launch. You get an e-shop ready to sell from day one.",
      included: [
        "Responsive design for all devices",
        "Product pages with gallery and variants",
        "Advanced filters and search",
        "Stock and product status management",
        "Discount coupons and promotions",
        "Accounting and inventory integrations",
        "GDPR, cookie banner, terms of service",
        "Admin training and 30 days of free support",
      ],
      finalLabel: "We work with a limited number of clients",
      finalText: "We'll propose the final price after a consultation, based on number of products, integrations and features. Free and no obligation.",
      finalCta: "Get a no-obligation quote",
      liveCatalog: "Live catalog",
    },
    servicesBranding: {
      eyebrow: "Branding & logo",
      h1: "A brand people will remember",
      intro: "We create a visual identity that looks professional, consistent and instantly sets your company apart from the competition.",
      creating: "What we create",
      sectionTitle: "A strong identity raises trust before the first meeting.",
      items: ["logo", "colours", "typography"],
      variantsLabel: "Variants",
      variantsTitle: "A logo system for different situations.",
      variantsText: "A sample of styles — from minimal wordmarks to monograms and symbolic marks.",
      variantsMeta: "8 styles · wordmark · monogram · icon · 3D",
      resultLabel: "Result",
      resultBig: "+ professional image",
      resultText: "Your brand looks unified across web, social, business cards and presentations.",
    },
    servicesDesign: {
      eyebrow: "Graphic design",
      h1: "Graphics that look premium and support sales",
      intro: "We design visuals for campaigns, social media and print so the brand feels consistent across every channel.",
      items: ["social media", "banners and campaigns", "print materials"],
      finalTrust: "Free consultation · Reply within 24 hours · Individual approach",
      finalPrice: PRICE_DESIGN.EN,
    },
    contactExtra: { location: "Prague, CZ" },
    notSureLabels: { instagramOpen: "Open Instagram", telegramOpen: "Message on Telegram" },
  },

  RU: {
    common: {
      backToServices: "Все услуги",
      backToPricing: "Все цены",
      getQuote: "Получить предложение",
      viewPricing: "Смотреть цены",
      consultation: "Бесплатная консультация",
      reply24h: "Ответим в течение 24 часов",
      individual: "Индивидуальный подход",
      limitedClients: "Работаем с ограниченным числом клиентов.",
      price: "Цена",
      from: "от",
      showService: "Открыть услугу",
      free: "бесплатно",
      learnMore: "Подробнее",
    },
    pricingIndex: {
      eyebrow: "Цены",
      title: "Отдельные цены для каждого типа проекта.",
      subtitle: "Сайт, магазин и брендинг — отдельная страница, отдельный объём работ и понятный результат.",
      sectionTitle: "Выберите тип решения",
      sectionSubtitle: "У каждого тарифа своя страница, объём и результат. Никаких селекторов и универсальных пакетов.",
      viewPricing: "Смотреть цены",
      notSure: "Не уверены?",
      notSureTitle: "Предложим решение бесплатно.",
      notSureText: "Пришлите краткое описание проекта. Подскажем подходящий объём, цену и следующие шаги.",
      notSureCta: "Получить совет",
    },
    pricingDetail: {
      bestForLabel: "Описание",
      bestForTitle: "Кому подходит",
      resultsLabel: "Результаты",
      resultsTitle: "Что даёт инвестиция",
      finalCtaTitle: "Хотите точную цену для вашего проекта?",
      finalCtaText: "После короткой консультации пришлём конкретное предложение по объёму, цене и срокам.",
      finalCtaBtn: "Хочу предложение без обязательств",
      priceLabel: "Цена",
    },
    pricingPages: {
      web: {
        slug: "web", path: "/pricing/web",
        eyebrow: "Сайты",
        title: "Сайт, который приводит заявки",
        description: "Для компаний, которым нужна профессиональная презентация, понятное предложение и сайт, готовый превращать посетителей в клиентов.",
        bestFor: "Локальные услуги, B2B, специалисты, студии и небольшие бренды",
        included: [
          "UX структура и контент",
          "Премиальный адаптивный дизайн",
          "Разработка быстрого сайта",
          "Базовое SEO и техническая оптимизация",
          "Форма и измерение конверсий",
          "Запуск, контроль и 30 дней поддержки",
        ],
        results: [
          { value: "+45 %", label: "больше заявок" },
          { value: "<2 с", label: "быстрая загрузка" },
          { value: "SEO", label: "готовый фундамент" },
        ],
        price: PRICE_WEB.RU,
        note: "Финальная цена зависит от объёма, числа страниц и контента.",
      },
      eshop: {
        slug: "eshop", path: "/pricing/eshop",
        eyebrow: "Магазин",
        title: "Магазин, готовый зарабатывать",
        description: "Полное решение для брендов, которые хотят продавать онлайн без лишнего трения в процессе покупки.",
        bestFor: "Новые магазины, редизайн и бренды, готовые расти",
        included: [
          "Стратегия категорий и пути покупки",
          "Карточки товаров и корзина под конверсию",
          "Подключение платежей, доставки и интеграций",
          "Мобильная UX-оптимизация",
          "Аналитика заказов",
          "Запуск, тестирование и 30 дней поддержки",
        ],
        results: [
          { value: "+120 %", label: "конверсия" },
          { value: "−45 %", label: "брошенных корзин" },
          { value: "+2,4×", label: "больше заказов" },
        ],
        price: PRICE_ESHOP.RU,
        note: "Цена зависит от количества товаров, интеграций и требований к управлению.",
      },
      branding: {
        slug: "branding", path: "/pricing/branding",
        eyebrow: "Лого и брендинг",
        title: "Бренд, который запомнят",
        description: "Визуальная идентичность для компаний, которые хотят выглядеть надёжно, последовательно и выделяться.",
        bestFor: "Новые бренды, ребрендинг, продуктовые линейки и корпоративная идентичность",
        included: [
          "Стратегия визуального направления",
          "Логотип-система и варианты использования",
          "Палитра и типографика",
          "Базовый бренд-гайд",
          "Социальные и презентационные материалы",
          "Экспорты для web, печати и соцсетей",
        ],
        results: [
          { value: "100 %", label: "единый образ" },
          { value: "+ доверие", label: "при первом контакте" },
          { value: "ready", label: "для web и кампаний" },
        ],
        price: PRICE_BRANDING.RU,
        note: "Объём подстраиваем под задачу — только лого или полная идентичность.",
      },
    },
    servicesIndex: {
      cards: [
        { to: "/services/web", title: "Сайты, которые приводят клиентов", desc: "Презентационные сайты, которые приводят заявки и формируют доверие." },
        { to: "/services/eshop", title: "Магазины, которые зарабатывают", desc: "Решения, разработанные под заказы, корзину и рост выручки." },
        { to: "/services/branding", title: "Бренд, который запоминают", desc: "Визуальная идентичность, которую запомнят клиенты." },
        { to: "/services/design", title: "Визуалы, которые продают", desc: "Кампании, баннеры и материалы с премиальным визуальным стилем." },
      ],
    },
    servicesWeb: {
      eyebrow: "Web design & SEO",
      h1: "Сайты, которые приводят клиентов",
      intro: "Создаём сайты, которые быстро объясняют ценность, формируют доверие и приводят посетителя к заявке.",
      items: ["дизайн под задачу", "адаптивный сайт", "SEO-фундамент"],
      processLabel: "Процесс",
      processTitle: "Чёткий путь от идеи к готовому сайту.",
      processSteps: ["Консультация", "Wireframe", "Дизайн", "Запуск"],
      resultLabel: "Результат",
      resultBig: "+ больше заявок",
      resultText: "Сайт ясно покажет, почему клиент должен выбрать вас — и приведёт к контакту без лишних барьеров.",
      speed: "загрузка страниц",
      seoBase: "фундамент готов",
      ctaTrust: "Бесплатная консультация · Ответ за 24 часа · Индивидуальный подход",
      ctaSubtitle: "Работаем с ограниченным числом клиентов.",
    },
    servicesEshop: {
      eyebrow: "E-commerce performance",
      h1Pre: "Магазин, который",
      h1Highlight: "зарабатывает за вас",
      intro: "Строим магазины под продажи и результат. Структура, карточки товаров и быстрый путь к заказу — каждый элемент работает на покупки.",
      trust: ["Бесплатная консультация", "Ответ за 24 часа", "Индивидуальный подход"],
      whatWeDoLabel: "Что мы делаем",
      whatWeDoTitle: "От визита к заказу без лишнего трения.",
      whatWeDoText: "Каждый магазин — как продающая машина. Продуманный UX, скорость и оптимизированный checkout.",
      whatWeDo: [
        { t: "Проектирование структуры", d: "Категории, фильтры и навигация — товар находится за три клика." },
        { t: "Мобильная UX-оптимизация", d: "Более 70% покупок с мобилки — сначала проектируем под телефон." },
        { t: "Платежи и доставка", d: "Stripe, GoPay, Comgate, Zásilkovna, PPL, DPD — готово к запуску." },
        { t: "SEO и продуктовая оптимизация", d: "Товары видны в поиске. Структурные данные, описания, скорость." },
        { t: "Аналитика продаж", d: "GA4 + e-commerce события. Знаете, что продаёт." },
        { t: "Безопасность и стабильность", d: "HTTPS, бэкапы, защита от спама и атак." },
      ],
      processLabel: "Процесс",
      processTitle: "Понятный план. Без сюрпризов.",
      process: [
        { t: "Анализ и стратегия", d: "Обсудим товары, аудиторию, маржу и конкурентов. Поставим цели." },
        { t: "UX и дизайн", d: "Wireframe, концепт и прототип. Валидируем до кода." },
        { t: "Разработка и интеграции", d: "Соберём магазин, подключим платежи, доставку, склад и аналитику." },
        { t: "Запуск и оптимизация", d: "Запускаем, измеряем, улучшаем конверсию." },
      ],
      resultsLabel: "Результаты",
      resultsTitle: "Что вы реально получите.",
      results: [
        { n: "+38 %", l: "выше конверсия", d: "Лучшие карточки, корзина и быстрый checkout." },
        { n: "+2,4×", l: "больше заказов", d: "Структура и UX под реальное поведение покупателей." },
        { n: "−45 %", l: "брошенных корзин", d: "Простой checkout, сохранение заказа и 1-click оплата." },
        { n: "<1,5 с", l: "загрузка", d: "Оптимизация изображений, кеш и современный стек." },
      ],
      includedLabel: "Включено",
      includedTitle: "Всё, что нужно магазину для работы.",
      includedText: "Без скрытых платежей. Получите магазин, готовый продавать с первого дня.",
      included: [
        "Адаптивный дизайн для всех устройств",
        "Карточки с галереей и вариантами",
        "Расширенные фильтры и поиск",
        "Управление складом и статусами",
        "Купоны и акции",
        "Интеграция с учётом и складом",
        "GDPR, cookie, оферта",
        "Обучение и 30 дней поддержки",
      ],
      finalLabel: "Работаем с ограниченным числом клиентов",
      finalText: "Финальную цену предложим после консультации — по количеству товаров, интеграций и функций. Бесплатно и без обязательств.",
      finalCta: "Хочу предложение без обязательств",
      liveCatalog: "Live каталог",
    },
    servicesBranding: {
      eyebrow: "Брендинг и лого",
      h1: "Бренд, который запомнят",
      intro: "Создаём визуальную идентичность, которая выглядит профессионально, последовательно и сразу выделяет компанию среди конкурентов.",
      creating: "Что мы делаем",
      sectionTitle: "Сильная идентичность повышает доверие ещё до первой встречи.",
      items: ["логотип", "цвета", "типографика"],
      variantsLabel: "Варианты",
      variantsTitle: "Лого-система для разных ситуаций.",
      variantsText: "Примеры стилей — от минимальных wordmark до монограмм и символьных знаков.",
      variantsMeta: "8 стилей · wordmark · монограмма · иконка · 3D",
      resultLabel: "Результат",
      resultBig: "+ профессиональный образ",
      resultText: "Бренд выглядит единым на сайте, в соцсетях, на визитках и в презентациях.",
    },
    servicesDesign: {
      eyebrow: "Graphic design",
      h1: "Графика, которая выглядит премиально и поддерживает продажи",
      intro: "Создаём визуалы для кампаний, соцсетей и печати — бренд звучит одинаково во всех каналах.",
      items: ["соцсети", "баннеры и кампании", "печатные материалы"],
      finalTrust: "Бесплатная консультация · Ответ за 24 часа · Индивидуальный подход",
      finalPrice: PRICE_DESIGN.RU,
    },
    contactExtra: { location: "Прага, CZ" },
    notSureLabels: { instagramOpen: "Открыть Instagram", telegramOpen: "Написать в Telegram" },
  },

  UA: {
    common: {
      backToServices: "Усі послуги",
      backToPricing: "Усі ціни",
      getQuote: "Отримати пропозицію",
      viewPricing: "Дивитись ціни",
      consultation: "Безкоштовна консультація",
      reply24h: "Відповімо протягом 24 годин",
      individual: "Індивідуальний підхід",
      limitedClients: "Працюємо з обмеженою кількістю клієнтів.",
      price: "Ціна",
      from: "від",
      showService: "Відкрити послугу",
      free: "безкоштовно",
      learnMore: "Деталі",
    },
    pricingIndex: {
      eyebrow: "Ціни",
      title: "Окремі ціни для кожного типу проєкту.",
      subtitle: "Сайт, магазин і брендинг — окрема сторінка, обсяг робіт і чіткий результат.",
      sectionTitle: "Оберіть тип рішення",
      sectionSubtitle: "Кожен тариф має власну сторінку, обсяг і результат. Без селекторів і універсальних пакетів.",
      viewPricing: "Дивитись ціни",
      notSure: "Не впевнені?",
      notSureTitle: "Запропонуємо рішення безкоштовно.",
      notSureText: "Надішліть короткий опис проєкту. Підкажемо обсяг, ціну і наступні кроки.",
      notSureCta: "Отримати пораду",
    },
    pricingDetail: {
      bestForLabel: "Опис",
      bestForTitle: "Кому підходить",
      resultsLabel: "Результати",
      resultsTitle: "Що дає інвестиція",
      finalCtaTitle: "Хочете точну ціну для вашого проєкту?",
      finalCtaText: "Після короткої консультації надішлемо конкретну пропозицію щодо обсягу, ціни і термінів.",
      finalCtaBtn: "Хочу пропозицію без зобов'язань",
      priceLabel: "Ціна",
    },
    pricingPages: {
      web: {
        slug: "web", path: "/pricing/web",
        eyebrow: "Сайти",
        title: "Сайт, який приводить заявки",
        description: "Для компаній, яким потрібна професійна презентація, чітка пропозиція і сайт, готовий перетворювати відвідувачів на клієнтів.",
        bestFor: "Локальні послуги, B2B, спеціалісти, студії та малі бренди",
        included: [
          "UX структура і контент",
          "Преміальний адаптивний дизайн",
          "Розробка швидкого сайту",
          "Базове SEO і технічна оптимізація",
          "Форма і вимірювання конверсій",
          "Запуск, перевірка і 30 днів підтримки",
        ],
        results: [
          { value: "+45 %", label: "більше заявок" },
          { value: "<2 с", label: "швидке завантаження" },
          { value: "SEO", label: "готовий фундамент" },
        ],
        price: PRICE_WEB.UA,
        note: "Фінальна ціна залежить від обсягу, кількості сторінок і контенту.",
      },
      eshop: {
        slug: "eshop", path: "/pricing/eshop",
        eyebrow: "Магазин",
        title: "Магазин, готовий заробляти",
        description: "Повне рішення для брендів, які хочуть продавати онлайн без зайвого тертя.",
        bestFor: "Нові магазини, редизайн і бренди, готові зростати",
        included: [
          "Стратегія категорій і шляху покупки",
          "Картки товарів і кошик під конверсію",
          "Підключення оплат, доставки та інтеграцій",
          "Мобільна UX-оптимізація",
          "Аналітика замовлень",
          "Запуск, тестування і 30 днів підтримки",
        ],
        results: [
          { value: "+120 %", label: "конверсія" },
          { value: "−45 %", label: "покинутих кошиків" },
          { value: "+2,4×", label: "більше замовлень" },
        ],
        price: PRICE_ESHOP.UA,
        note: "Ціна залежить від кількості товарів, інтеграцій і вимог до керування.",
      },
      branding: {
        slug: "branding", path: "/pricing/branding",
        eyebrow: "Лого і брендинг",
        title: "Бренд, який запам'ятають",
        description: "Візуальна ідентичність для компаній, які хочуть виглядати надійно, послідовно і виділятись.",
        bestFor: "Нові бренди, ребрендинг, продуктові лінії та корпоративна ідентичність",
        included: [
          "Стратегія візуального напрямку",
          "Лого-система і варіанти використання",
          "Палітра і типографіка",
          "Базовий бренд-гайд",
          "Соціальні і презентаційні матеріали",
          "Експорти для web, друку і соцмереж",
        ],
        results: [
          { value: "100 %", label: "єдиний образ" },
          { value: "+ довіра", label: "при першому контакті" },
          { value: "ready", label: "для web і кампаній" },
        ],
        price: PRICE_BRANDING.UA,
        note: "Обсяг налаштуємо під задачу — лише лого чи повна ідентичність.",
      },
    },
    servicesIndex: {
      cards: [
        { to: "/services/web", title: "Сайти, які приводять клієнтів", desc: "Презентаційні сайти, які приводять заявки і формують довіру." },
        { to: "/services/eshop", title: "Магазини, які заробляють", desc: "Рішення під замовлення, кошик і ріст виторгу." },
        { to: "/services/branding", title: "Бренд, який запам'ятовують", desc: "Візуальна ідентичність, яку запам'ятають клієнти." },
        { to: "/services/design", title: "Візуали, які продають", desc: "Кампанії, банери і матеріали з преміальним візуальним стилем." },
      ],
    },
    servicesWeb: {
      eyebrow: "Web design & SEO",
      h1: "Сайти, які приводять клієнтів",
      intro: "Створюємо сайти, які швидко пояснюють цінність, формують довіру і приводять відвідувача до заявки.",
      items: ["дизайн під задачу", "адаптивний сайт", "SEO-фундамент"],
      processLabel: "Процес",
      processTitle: "Чіткий шлях від ідеї до готового сайту.",
      processSteps: ["Консультація", "Wireframe", "Дизайн", "Запуск"],
      resultLabel: "Результат",
      resultBig: "+ більше заявок",
      resultText: "Сайт чітко покаже, чому клієнт має обрати саме вас — і приведе до контакту без зайвих бар'єрів.",
      speed: "завантаження сторінок",
      seoBase: "фундамент готовий",
      ctaTrust: "Безкоштовна консультація · Відповідь за 24 години · Індивідуальний підхід",
      ctaSubtitle: "Працюємо з обмеженою кількістю клієнтів.",
    },
    servicesEshop: {
      eyebrow: "E-commerce performance",
      h1Pre: "Магазин, який",
      h1Highlight: "заробляє за вас",
      intro: "Будуємо магазини під продажі та результат. Структура, картки і швидкий шлях до замовлення — кожен елемент працює на покупки.",
      trust: ["Безкоштовна консультація", "Відповідь за 24 години", "Індивідуальний підхід"],
      whatWeDoLabel: "Що ми робимо",
      whatWeDoTitle: "Від візиту до замовлення без зайвого тертя.",
      whatWeDoText: "Кожен магазин — як машина продажів. Продуманий UX, швидкість і оптимізований checkout.",
      whatWeDo: [
        { t: "Проєктування структури", d: "Категорії, фільтри і навігація — товар знаходиться за три кліки." },
        { t: "Мобільна UX-оптимізація", d: "Понад 70% покупок з мобільного — спочатку дизайн під телефон." },
        { t: "Оплати і доставка", d: "Stripe, GoPay, Comgate, Zásilkovna, PPL, DPD — готово до запуску." },
        { t: "SEO і продуктова оптимізація", d: "Товари видно в пошуку. Структурні дані, описи, швидкість." },
        { t: "Аналітика продажів", d: "GA4 + e-commerce події. Знаєте, що продає." },
        { t: "Безпека і стабільність", d: "HTTPS, бекапи, захист від спаму і атак." },
      ],
      processLabel: "Процес",
      processTitle: "Зрозумілий план. Без сюрпризів.",
      process: [
        { t: "Аналіз і стратегія", d: "Обговоримо товари, аудиторію, маржу і конкурентів. Поставимо цілі." },
        { t: "UX і дизайн", d: "Wireframe, концепт і прототип. Валідуємо до коду." },
        { t: "Розробка і інтеграції", d: "Зберемо магазин, підключимо оплати, доставку, склад і аналітику." },
        { t: "Запуск і оптимізація", d: "Запускаємо, вимірюємо, покращуємо конверсію." },
      ],
      resultsLabel: "Результати",
      resultsTitle: "Що ви реально отримаєте.",
      results: [
        { n: "+38 %", l: "вища конверсія", d: "Кращі картки, кошик і швидкий checkout." },
        { n: "+2,4×", l: "більше замовлень", d: "Структура і UX під реальну поведінку покупців." },
        { n: "−45 %", l: "покинутих кошиків", d: "Простий checkout, збереження замовлення і 1-click оплата." },
        { n: "<1,5 с", l: "завантаження", d: "Оптимізація зображень, кеш і сучасний стек." },
      ],
      includedLabel: "Включено",
      includedTitle: "Усе, що потрібно магазину для роботи.",
      includedText: "Без прихованих платежів. Отримайте магазин, готовий продавати з першого дня.",
      included: [
        "Адаптивний дизайн для всіх пристроїв",
        "Картки з галереєю і варіантами",
        "Розширені фільтри і пошук",
        "Керування складом і статусами",
        "Купони і акції",
        "Інтеграція з обліком і складом",
        "GDPR, cookie, оферта",
        "Навчання і 30 днів підтримки",
      ],
      finalLabel: "Працюємо з обмеженою кількістю клієнтів",
      finalText: "Фінальну ціну запропонуємо після консультації — за кількістю товарів, інтеграцій і функцій. Безкоштовно і без зобов'язань.",
      finalCta: "Хочу пропозицію без зобов'язань",
      liveCatalog: "Live каталог",
    },
    servicesBranding: {
      eyebrow: "Брендинг і лого",
      h1: "Бренд, який запам'ятають",
      intro: "Створюємо візуальну ідентичність, що виглядає професійно, послідовно і одразу виділяє компанію серед конкурентів.",
      creating: "Що ми робимо",
      sectionTitle: "Сильна ідентичність підвищує довіру ще до першої зустрічі.",
      items: ["логотип", "кольори", "типографіка"],
      variantsLabel: "Варіанти",
      variantsTitle: "Лого-система для різних ситуацій.",
      variantsText: "Приклади стилів — від мінімальних wordmark до монограм і символьних знаків.",
      variantsMeta: "8 стилів · wordmark · монограма · іконка · 3D",
      resultLabel: "Результат",
      resultBig: "+ професійний образ",
      resultText: "Бренд виглядає єдиним на сайті, у соцмережах, на візитках і в презентаціях.",
    },
    servicesDesign: {
      eyebrow: "Graphic design",
      h1: "Графіка, що виглядає преміально і підтримує продажі",
      intro: "Створюємо візуали для кампаній, соцмереж і друку — бренд звучить однаково в усіх каналах.",
      items: ["соцмережі", "банери і кампанії", "друковані матеріали"],
      finalTrust: "Безкоштовна консультація · Відповідь за 24 години · Індивідуальний підхід",
      finalPrice: PRICE_DESIGN.UA,
    },
    contactExtra: { location: "Прага, CZ" },
    notSureLabels: { instagramOpen: "Відкрити Instagram", telegramOpen: "Написати в Telegram" },
  },
};

export function usePages(lang: Lang): PagesDict {
  return PAGES[lang];
}
