import { useT, type Lang } from "@/lib/i18n";
import { PROJECTS_BASE, type ProjectBase, type ProjectSlug, type ProjectCategory } from "@/lib/projects";

export type LocalizedProject = Omit<ProjectBase, "category"> & {
  category: string;
  description: string;
  result?: string;
  problem?: string;
  solution?: string;
  work: string[];
  results: { value: string; label: string }[];
};

type Content = {
  description: string;
  result?: string;
  problem?: string;
  solution?: string;
  work: string[];
  results: { value: string; label: string }[];
};

const CATEGORY_LABELS: Record<Lang, Record<ProjectCategory, string>> = {
  CZ: { Web: "Web", "E-shop": "E-shop", Branding: "Branding", SaaS: "SaaS" },
  EN: { Web: "Web", "E-shop": "E-commerce", Branding: "Branding", SaaS: "SaaS" },
  RU: { Web: "Сайт", "E-shop": "Интернет-магазин", Branding: "Брендинг", SaaS: "SaaS" },
  UA: { Web: "Сайт", "E-shop": "Інтернет-магазин", Branding: "Брендинг", SaaS: "SaaS" },
};

const CONTENT: Record<Lang, Record<ProjectSlug, Content>> = {
  CZ: {
    "biodent-clinic": {
      description: "Prémiový web stomatologické kliniky s důrazem na důvěru, online objednávky a prezentaci specialistů.",
      result: "+180% objednávek online",
      problem: "Klinika měla silnou klientskou základnu, ale starý web nevedl k online rezervacím a nepředával prémiovou úroveň péče.",
      solution: "Postavili jsme čistý prémiový web s jasnou strukturou služeb, profily lékařů, vizuálním důkazem výsledků a rychlou online rezervací.",
      work: ["UX strategie a IA", "Prémiový web design", "Online rezervační systém", "SEO pro Prahu"],
      results: [
        { value: "+180%", label: "online objednávek" },
        { value: "+74%", label: "návštěvnost z Google" },
        { value: "<1,8s", label: "rychlost načtení" },
      ],
    },
    "nhome-praha": {
      // Verified against the live site (2026-09); no problem/solution/result
      // copy or figures, because the repository has no source for them.
      description: "Web pražské společnosti INHOME, která nabízí úklidové služby, chemické čištění nábytku, stěhování po ČR i EU a hodinového manžela — v češtině, angličtině a ruštině, s formulářem pro zpětné volání.",
      work: ["Prezentace čtyř služeb", "Jazykové verze CZ · EN · RU", "Formulář pro zpětné volání", "Sekce „Proč INHOME?“"],
      results: [],
    },
    "exclusive-beauty": {
      description: "E-shop prémiové beauty značky — od produktové karty po checkout, optimalizovaný pro mobilní nákup a opakované objednávky.",
      result: "+140% obrat e-shopu",
      problem: "E-shop měl moderní vzhled, ale produktové karty nepřesvědčovaly a mobilní checkout měl vysokou míru opuštění.",
      solution: "Přepracovali jsme produktovou kartu, USP, recenze, cross-sell a zjednodušili checkout na 3 jednoznačné kroky.",
      work: ["UX e-shopu", "Redesign produktové karty", "Mobilní checkout", "Konverzní A/B testy"],
      results: [
        { value: "+140%", label: "obrat" },
        { value: "+82%", label: "mobilní konverze" },
        { value: "−41%", label: "opuštění košíku" },
      ],
    },
    euromotors: {
      // Verified against the live site (2026-09); no problem/solution/result
      // copy or figures, because the repository has no source for them.
      description: "Web autoservisu EURO-MOTORS v Praze 10 — kompletní opravy a údržba osobních i užitkových vozů všech značek, přehled služeb, časté dotazy a nezávazná poptávka, v češtině a ruštině.",
      work: ["Přehled služeb autoservisu", "Formulář nezávazné poptávky", "Časté dotazy (FAQ)", "Jazykové verze CZ · RU"],
      results: [],
    },
  },
  EN: {
    "biodent-clinic": {
      description: "Premium website for a dental clinic focused on trust, online bookings and showcasing specialists.",
      result: "+180% online bookings",
      problem: "The clinic had a strong client base, but the old website did not drive online bookings and failed to convey the premium level of care.",
      solution: "We built a clean, premium site with clear service architecture, doctor profiles, visual proof and a fast online booking flow.",
      work: ["UX strategy & IA", "Premium web design", "Online booking system", "Local SEO for Prague"],
      results: [
        { value: "+180%", label: "online bookings" },
        { value: "+74%", label: "organic traffic" },
        { value: "<1.8s", label: "load speed" },
      ],
    },
    "nhome-praha": {
      // Verified against the live site (2026-09); no problem/solution/result
      // copy or figures, because the repository has no source for them.
      description: "Website for INHOME, a Prague company offering cleaning services, upholstery cleaning, moves across the Czech Republic and the EU, and handyman help — in Czech, English and Russian, with a call-back request form.",
      work: ["Four service lines", "CZ · EN · RU language versions", "Call-back request form", "“Why INHOME?” section"],
      results: [],
    },
    "exclusive-beauty": {
      description: "Premium beauty brand e-shop — from product page to checkout, optimised for mobile purchases and repeat orders.",
      result: "+140% e-shop revenue",
      problem: "The shop looked modern, but product cards did not convince and mobile checkout had a high abandonment rate.",
      solution: "We rebuilt the product card, USPs, reviews and cross-sells, and simplified checkout into 3 clear steps.",
      work: ["E-commerce UX", "Product page redesign", "Mobile checkout", "Conversion A/B tests"],
      results: [
        { value: "+140%", label: "revenue" },
        { value: "+82%", label: "mobile conversion" },
        { value: "−41%", label: "cart abandonment" },
      ],
    },
    euromotors: {
      // Verified against the live site (2026-09); no problem/solution/result
      // copy or figures, because the repository has no source for them.
      description: "Website for EURO-MOTORS, a car service in Prague 10 — full repairs and maintenance of passenger and commercial vehicles of all makes, a service overview, FAQ and a free-quote request, in Czech and Russian.",
      work: ["Service overview", "Free-quote request form", "FAQ section", "CZ · RU language versions"],
      results: [],
    },
  },
  RU: {
    "biodent-clinic": {
      description: "Премиальный сайт стоматологической клиники с акцентом на доверие, онлайн-запись и презентацию врачей.",
      result: "+180% онлайн-записей",
      problem: "У клиники была сильная база клиентов, но старый сайт не приводил к онлайн-записи и не передавал премиальный уровень.",
      solution: "Мы построили чистый премиальный сайт с понятной структурой услуг, профилями врачей и быстрой онлайн-записью.",
      work: ["UX-стратегия и IA", "Премиальный веб-дизайн", "Онлайн-запись", "Локальное SEO"],
      results: [
        { value: "+180%", label: "онлайн-записей" },
        { value: "+74%", label: "органика" },
        { value: "<1,8с", label: "загрузка" },
      ],
    },
    "nhome-praha": {
      // Verified against the live site (2026-09); no problem/solution/result
      // copy or figures, because the repository has no source for them.
      description: "Сайт пражской компании INHOME: клининг, химчистка мебели и ковров, переезды по Чехии и ЕС и муж на час — на чешском, английском и русском, с формой обратного звонка.",
      work: ["Презентация четырёх услуг", "Языковые версии CZ · EN · RU", "Форма обратного звонка", "Раздел «Почему INHOME?»"],
      results: [],
    },
    "exclusive-beauty": {
      description: "Интернет-магазин премиального beauty-бренда — от карточки до checkout, оптимизирован под мобильные покупки.",
      result: "+140% выручки",
      problem: "Магазин выглядел современно, но карточки не убеждали, а мобильный checkout имел высокий процент отказов.",
      solution: "Мы пересобрали карточку товара, USP, отзывы, cross-sell и упростили checkout до 3 чётких шагов.",
      work: ["UX e-commerce", "Редизайн карточки", "Мобильный checkout", "A/B-тесты"],
      results: [
        { value: "+140%", label: "выручка" },
        { value: "+82%", label: "мобильная конверсия" },
        { value: "−41%", label: "брошенные корзины" },
      ],
    },
    euromotors: {
      // Verified against the live site (2026-09); no problem/solution/result
      // copy or figures, because the repository has no source for them.
      description: "Сайт автосервиса EURO-MOTORS в Праге 10 — полный ремонт и обслуживание легковых и коммерческих автомобилей всех марок, обзор услуг, частые вопросы и заявка без обязательств, на чешском и русском.",
      work: ["Обзор услуг автосервиса", "Форма заявки без обязательств", "Частые вопросы (FAQ)", "Языковые версии CZ · RU"],
      results: [],
    },
  },
  UA: {
    "biodent-clinic": {
      description: "Преміальний сайт стоматологічної клініки з акцентом на довіру, онлайн-запис і презентацію лікарів.",
      result: "+180% онлайн-записів",
      problem: "Клініка мала сильну базу клієнтів, але старий сайт не вів до онлайн-запису й не передавав преміальний рівень.",
      solution: "Ми побудували чистий преміальний сайт з понятною структурою послуг, профілями лікарів і швидким онлайн-записом.",
      work: ["UX-стратегія та IA", "Преміальний веб-дизайн", "Онлайн-запис", "Локальне SEO"],
      results: [
        { value: "+180%", label: "онлайн-записів" },
        { value: "+74%", label: "органіка" },
        { value: "<1,8с", label: "завантаження" },
      ],
    },
    "nhome-praha": {
      // Verified against the live site (2026-09); no problem/solution/result
      // copy or figures, because the repository has no source for them.
      description: "Сайт празької компанії INHOME: клінінг, хімчистка меблів і килимів, переїзди по Чехії та ЄС і чоловік на годину — чеською, англійською та російською, з формою зворотного дзвінка.",
      work: ["Презентація чотирьох послуг", "Мовні версії CZ · EN · RU", "Форма зворотного дзвінка", "Розділ «Чому INHOME?»"],
      results: [],
    },
    "exclusive-beauty": {
      description: "Інтернет-магазин преміального beauty-бренду — від картки до checkout, оптимізований під мобільні покупки.",
      result: "+140% виторгу",
      problem: "Магазин виглядав сучасно, але картки не переконували, мобільний checkout мав високий відсоток відмов.",
      solution: "Ми перебудували картку товару, USP, відгуки, cross-sell і спростили checkout до 3 чітких кроків.",
      work: ["UX e-commerce", "Редизайн картки", "Мобільний checkout", "A/B-тести"],
      results: [
        { value: "+140%", label: "виторг" },
        { value: "+82%", label: "мобільна конверсія" },
        { value: "−41%", label: "покинуті кошики" },
      ],
    },
    euromotors: {
      // Verified against the live site (2026-09); no problem/solution/result
      // copy or figures, because the repository has no source for them.
      description: "Сайт автосервісу EURO-MOTORS у Празі 10 — повний ремонт і обслуговування легкових та комерційних автомобілів усіх марок, огляд послуг, часті запитання та заявка без зобов'язань, чеською та російською.",
      work: ["Огляд послуг автосервісу", "Форма заявки без зобов'язань", "Часті запитання (FAQ)", "Мовні версії CZ · RU"],
      results: [],
    },
  },
};

export function getProjects(lang: Lang): LocalizedProject[] {
  return PROJECTS_BASE.map((base) => {
    const c = CONTENT[lang][base.slug];
    return {
      ...base,
      name: base.name,
      category: CATEGORY_LABELS[lang][base.category],
      ...c,
    };
  });
}

export function useProjects(): LocalizedProject[] {
  const { lang } = useT();
  return getProjects(lang);
}

export function useProject(slug: ProjectSlug): LocalizedProject | undefined {
  return useProjects().find((p) => p.slug === slug);
}
