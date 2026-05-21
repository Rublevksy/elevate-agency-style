/**
 * Insights / blog content. Source of truth for /insights and /insights/$slug.
 * Articles are long-form, business-oriented, CZ-first. Add EN versions later
 * by extending the `locales` field — current routes render `cs` only.
 */

export type InsightSection = {
  /** Section heading rendered as <h2>. */
  heading: string;
  /** Paragraphs rendered as <p>. */
  paragraphs: string[];
  /** Optional bullet list rendered after paragraphs. */
  list?: string[];
};

export type Insight = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date string */
  publishedAt: string;
  readingMinutes: number;
  category: string;
  /** Lead paragraph rendered above section list. */
  lead: string;
  sections: InsightSection[];
  /** Optional FAQ pairs — rendered into FAQPage JSON-LD. */
  faq?: { q: string; a: string }[];
  /** Slugs of related insights (max 2). */
  related?: string[];
};

export const INSIGHTS: Insight[] = [
  {
    slug: "nejcastejsi-chyby-firemnich-webu-2026",
    title: "Nejčastější chyby firemních webů v roce 2026",
    excerpt:
      "Co dnes brzdí české firemní weby nejvíc — a proč to není o vizuálu, ale o rozhodování a struktuře.",
    publishedAt: "2026-04-12",
    readingMinutes: 7,
    category: "Web strategie",
    lead:
      "Většina firemních webů, které dnes vidíme, není technicky špatná. Problém je jinde: web nebyl postavený s jasným rozhodnutím, co má dělat. Tady je pět chyb, které potkáváme nejčastěji — a co s nimi.",
    sections: [
      {
        heading: "1. Hero, který nic neříká",
        paragraphs: [
          "Návštěvník má tři sekundy, aby pochopil, co děláte, pro koho a proč by ho to mělo zajímat. „Vítejte na našem webu" nebo „Inovativní řešení pro váš byznys" tuhle otázku nezodpoví.",
          "Hero musí konkrétně pojmenovat výsledek, který klient získá. Ne službu — výsledek. „E-shopy, které vydělávají od první návštěvy" funguje lépe než „E-commerce řešení na míru".",
        ],
      },
      {
        heading: "2. Žádná jasná další akce",
        paragraphs: [
          "Web bez jasného next step je drahá vizitka. Klient odejde, protože neví, co má udělat dál. Každá sekce by měla mít buď tlačítko, nebo důvod jít na další sekci.",
          "Primární CTA musí být přítomné v heroovi, v hlavičce a opakovaně v obsahu. Sekundární CTA (např. audit zdarma, ukázky práce) snižuje bariéru pro váhající návštěvníky.",
        ],
      },
      {
        heading: "3. Trust signály až ve footru",
        paragraphs: [
          "Reference, certifikace, počty projektů, jména klientů — to vše patří nahoru, ne dolů. Čím dříve klient vidí důvod vám věřit, tím větší šance že dočte stránku.",
        ],
      },
      {
        heading: "4. Mobil jako dodatek, ne jako priorita",
        paragraphs: [
          "70 % návštěvnosti přichází z mobilu. Pokud se na něm hůř čte, pomaleji načítá, nebo CTA mizí pod záhybem, ztrácíte větší část publika ještě před tím, než dostane šanci.",
        ],
      },
      {
        heading: "5. Žádné měření, žádná iterace",
        paragraphs: [
          "Web spuštěný bez analytiky a heatmap je střelba naslepo. Bez dat nevíte, kde lidé odpadávají, na co klikají, co je mate. První měsíc po spuštění je nejdůležitější — a ve většině případů se promrhá.",
        ],
      },
    ],
    faq: [
      {
        q: "Jak často by se měl firemní web aktualizovat?",
        a: "Strukturální audit jednou za 12–18 měsíců, obsahové iterace průběžně podle dat z analytiky. Kompletní redesign typicky každé 3–4 roky.",
      },
      {
        q: "Stačí mi šablona, nebo potřebuju web na míru?",
        a: "Šablona je v pořádku pro projekty, kde nejde o konverzi a značku. Pokud má web být obchodním kanálem, šablonové řešení vás bude dlouhodobě stát víc než kvalitně postavený web.",
      },
    ],
    related: ["ux-duvera-konverze", "kolik-stoji-kvalitni-web"],
  },
  {
    slug: "ux-duvera-konverze",
    title: "Jak moderní UX ovlivňuje důvěru a konverze",
    excerpt:
      "Důvěra se na webu netvoří texty „proč my". Tvoří se tisícem malých UX rozhodnutí, kterých si návštěvník nikdy nevšimne — a přesto je cítí.",
    publishedAt: "2026-03-04",
    readingMinutes: 8,
    category: "UX",
    lead:
      "Konverze není o triku ani o agresivním CTA. Konverze je výsledek důvěry, kterou si web musí zasloužit dřív, než cokoli žádá. Moderní UX je nástroj, jak tuhle důvěru postavit metodicky, ne náhodou.",
    sections: [
      {
        heading: "Důvěra je nasčítaný dojem",
        paragraphs: [
          "Návštěvník v prvních vteřinách nevyhodnocuje obsah — vyhodnocuje signály. Typografie, kontrast, rytmus, kvalita fotek, plynulost interakcí. Pokud je to v pořádku, mozek pustí pozornost dál. Pokud ne, vytvoří se podvědomý odpor.",
        ],
      },
      {
        heading: "Vizuální hierarchie = rozhodovací mapa",
        paragraphs: [
          "Dobré UX vede oko po stránce tam, kam má. Ne tam, kam designér chtěl, aby šlo — tam, kam jde uživatel přirozeně. Hierarchie nadpisů, barevné akcenty, white space a směr pohledu rozhodují o tom, co vůbec dojde k vědomí.",
        ],
        list: [
          "Jeden primární CTA na obrazovku, ne tři",
          "Rozdíl mezi primárním a sekundárním CTA musí být na první pohled patrný",
          "Trust signály blízko CTA, ne v jiné sekci",
          "Formuláře krátké — ptejte se jen na to, co k dalšímu kroku skutečně potřebujete",
        ],
      },
      {
        heading: "Rychlost je UX prvek",
        paragraphs: [
          "Každých 100 ms načítání = měřitelný pokles konverze. Performance dnes není jen technický KPI, je to UX rozhodnutí. Lazy loading, optimalizované obrázky, žádné neblokující skripty třetích stran v kritické cestě — to vše jsou součásti dobrého UX, ne jen DevOps detaily.",
        ],
      },
      {
        heading: "Mikrointerakce: malé, ale zásadní",
        paragraphs: [
          "Hover stavy, jemné přechody, loading indikátory, potvrzovací stavy — věci, kterých si návštěvník nevšimne, dokud chybí. Když chybí, web působí mrtvě, levně, nedokončeně. Když fungují, web působí profesionálně a stabilně.",
        ],
      },
      {
        heading: "Empatie ve formulářích",
        paragraphs: [
          "Formulář je moment, kdy klient nejvíc váhá. Každé extra políčko je důvod odejít. Validace v reálném čase, jasné chybové hlášky, žádné nečekané kroky. Konverze na poslední obrazovce se rodí v každém políčku předtím.",
        ],
      },
    ],
    faq: [
      {
        q: "Co je nejdůležitější UX prvek pro konverzi?",
        a: "Jasná hierarchie. Pokud návštěvník na první pohled neví, co je nejdůležitější a co má udělat, žádné další optimalizace to nezachrání.",
      },
      {
        q: "Jak měřit kvalitu UX?",
        a: "Kombinace kvantitativních dat (bounce rate, scroll depth, dokončené konverze) a kvalitativních (heatmapy, session recording, user testing). Jedno bez druhého vede k chybným závěrům.",
      },
    ],
    related: ["nejcastejsi-chyby-firemnich-webu-2026", "kolik-stoji-kvalitni-web"],
  },
  {
    slug: "kolik-stoji-kvalitni-web",
    title: "Kolik stojí kvalitní web a proč levné řešení často nestačí",
    excerpt:
      "Otevřený rozhovor o cenách, rozpočtech a o tom, proč nejlevnější nabídka skoro vždy vyjde nejdráž.",
    publishedAt: "2026-02-18",
    readingMinutes: 9,
    category: "Byznys",
    lead:
      "„Kolik to bude stát?" je první otázka každého klienta — a zaslouží si poctivou odpověď, ne marketingovou. V tomhle článku rozebíráme reálné rozpočty českého trhu a co za nimi stojí.",
    sections: [
      {
        heading: "Tři cenové úrovně, které dnes existují",
        paragraphs: [
          "Trh se v praxi rozpadl do tří jasných pásem. Každé má své opodstatnění — záleží, co od webu očekáváte.",
        ],
        list: [
          "Šablonové weby (5–25 000 Kč): rychlé, funkční, vizuálně omezené. Pro projekty bez ambicí na značku a konverzi.",
          "Profesionální weby na míru (60–200 000 Kč): vlastní design, UX strategie, výkon a SEO jako standard. Vhodné pro firmy, kterým web reálně vydělává.",
          "Komplexní digitální projekty (200 000 Kč+): e-commerce, integrace, vícejazyčné weby, dlouhodobá optimalizace. Investice s návratností v měsících, ne letech.",
        ],
      },
      {
        heading: "Proč levné řešení vyjde dráž",
        paragraphs: [
          "Levný web typicky neřeší strategii. Jen překlopí vaše požadavky do šablony. Výsledek vypadá, jak vypadá, a konvertuje, jak konvertuje — což obvykle znamená málo.",
          "Za rok končíte u redesignu. Zaplatíte podruhé. Často víc, protože je potřeba opravit i základ, který nebyl postavený správně.",
        ],
      },
      {
        heading: "Co se vlastně skrývá v ceně kvalitního webu",
        paragraphs: [
          "Když mluvíme o 100–150 tisících za web, je dobré vědět, za co konkrétně klient platí.",
        ],
        list: [
          "Strategická příprava: workshop, výzkum, definice cílů a KPI",
          "UX architektura a klikatelný prototyp ke schválení před vývojem",
          "Vlastní vizuální systém — typografie, barvy, ikonografie, motion",
          "Vývoj postavený na výkonu, SEO a přístupnosti",
          "Měření, analytika a 30 dní podpory po spuštění",
        ],
      },
      {
        heading: "Návratnost: jak to spočítat",
        paragraphs: [
          "Pokud váš průměrný klient přinese 30 000 Kč obratu a web vám měsíčně přivede tři nové, návratnost investice 120 000 Kč je 1,3 měsíce. To je matematika, kterou si umí spočítat každý majitel firmy — a důvod, proč profesionální web není náklad, ale investice s nejlepším poměrem v digitálu.",
        ],
      },
      {
        heading: "Co se ptát před objednávkou",
        paragraphs: [
          "Před podpisem smlouvy si vyžádejte odpovědi na čtyři otázky. Pokud dodavatel umí na všechny odpovědět konkrétně, jste pravděpodobně ve správných rukou.",
        ],
        list: [
          "Jak vypadá váš proces od prvního setkání po spuštění?",
          "Kdo konkrétně bude na projektu pracovat?",
          "Jak měříte úspěch projektu po spuštění?",
          "Co se stane, když potřebuji změny po launch?",
        ],
      },
    ],
    faq: [
      {
        q: "Můžu začít s levným webem a později upgradovat?",
        a: "V principu ano, ale prakticky vyjde stejně draho jako rovnou postavit kvalitní web. Migrace dat, redesign a SEO obnova stojí čas i peníze.",
      },
      {
        q: "Jak dlouho trvá kvalitní web?",
        a: "Standardní firemní web 6–10 týdnů od kickoff do spuštění. E-shop typicky 10–14 týdnů. Termín potvrzujeme po strategické fázi.",
      },
      {
        q: "Platí se předem, nebo po?",
        a: "Standardně 50 % na začátku, 30 % při schválení designu, 20 % před spuštěním. Žádné překvapivé vícenáklady.",
      },
    ],
    related: ["nejcastejsi-chyby-firemnich-webu-2026", "ux-duvera-konverze"],
  },
];

export function getInsight(slug: string): Insight | undefined {
  return INSIGHTS.find((i) => i.slug === slug);
}

export const INSIGHT_SLUGS = INSIGHTS.map((i) => i.slug);
