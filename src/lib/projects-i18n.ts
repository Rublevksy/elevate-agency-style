import { useT, type Lang } from "@/lib/i18n";
import { PROJECTS_BASE, type ProjectBase, type ProjectSlug, type ProjectCategory } from "@/lib/projects";

export type LocalizedProject = Omit<ProjectBase, "category"> & {
  category: string;
  description: string;
  result: string;
  problem: string;
  solution: string;
  work: string[];
  results: { value: string; label: string }[];
};

type Content = {
  description: string;
  result: string;
  problem: string;
  solution: string;
  work: string[];
  results: { value: string; label: string }[];
};

const CATEGORY_LABELS: Record<Lang, Record<ProjectCategory, string>> = {
  CZ: { Web: "Web", "E-shop": "E-shop", Branding: "Branding", SaaS: "SaaS", Sport: "Sport · Zápasnický klub" },
  EN: { Web: "Web", "E-shop": "E-commerce", Branding: "Branding", SaaS: "SaaS", Sport: "Sport · Wrestling club" },
  RU: { Web: "Сайт", "E-shop": "Интернет-магазин", Branding: "Брендинг", SaaS: "SaaS", Sport: "Спорт · Борцовский клуб" },
  UA: { Web: "Сайт", "E-shop": "Інтернет-магазин", Branding: "Брендинг", SaaS: "SaaS", Sport: "Спорт · Борцівський клуб" },
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
      description: "Realitní web prémiového segmentu Prahy s katalogem nemovitostí, kvalitní vizuální galerií a kontaktem na makléře.",
      result: "+95% poptávek na nemovitosti",
      problem: "Stránka neodpovídala kvalitě portfolia a poptávky chodily převážně z externích portálů, nikoli přímo.",
      solution: "Vytvořili jsme webové prostředí s prémiovou typografií, detaily nemovitostí, mapou a CTA, které vede přímo k osobní schůzce.",
      work: ["Web design pro luxury reality", "Detail nemovitosti", "Filtry a vyhledávání", "Lead management"],
      results: [
        { value: "+95%", label: "přímých poptávek" },
        { value: "+62%", label: "zobrazení detailů" },
        { value: "+38%", label: "čas na webu" },
      ],
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
      description: "Web pro autorizovaného dealera prémiových vozů s katalogem aut, financováním a online rezervací zkušební jízdy.",
      result: "+120% rezervací test drive",
      problem: "Web nepůsobil jako prémiová značka a klienti dělali první kontakt telefonem až po několika návštěvách webu.",
      solution: "Postavili jsme cinematický web s detailem vozů, kalkulačkou financování a jednoduchou rezervací zkušební jízdy přímo z karty vozu.",
      work: ["Vizuální koncept", "Katalog a detail vozu", "Kalkulačka financování", "Rezervace test drive"],
      results: [
        { value: "+120%", label: "test drive rezervací" },
        { value: "+58%", label: "leadů z webu" },
        { value: "+34%", label: "vrácení návštěvníků" },
      ],
    },
    "psk-olymp-praha": {
      description: "Kompletní redesign digitální prezentace tradičního pražského zápasnického klubu. Zastaralý web jsme proměnili v moderní, přehlednou a responzivní platformu pro sportovce, rodiče i nové členy.",
      result: "Kompletní digitální transformace",
      problem: "Původní web obsahoval velké množství důležitých klubových informací, ale jeho technické a vizuální řešení již neodpovídalo současným očekáváním uživatelů. Obsah byl rozdělený ve starší struktuře, mobilní používání bylo komplikované a pro nové návštěvníky nebylo vždy jasné, kde najít rozvrh, kontakty, členské příspěvky nebo informace o prvním tréninku.",
      solution: "Vytvořili jsme moderní responzivní platformu s novou informační architekturou. Rozsáhlý klubový obsah jsme rozdělili do logických sekcí — tréninky, rozvrh, nábor, galerie, dokumenty i e-shop — tak, aby se každý návštěvník dostal k tomu, co hledá, během několika sekund.",
      work: ["UX strategie a informační architektura", "Kompletní redesign webu", "Náborový systém", "Integrace klubového obsahu"],
      results: [
        { value: "12+", label: "propojených sekcí" },
        { value: "100 %", label: "responzivní design" },
        { value: "1", label: "jednotný digitální ekosystém" },
      ],
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
      description: "Real-estate website for Prague's premium segment with a property catalogue, rich galleries and direct broker contact.",
      result: "+95% direct inquiries",
      problem: "The site didn't match the quality of the portfolio and most inquiries came from external portals, not directly.",
      solution: "We created a premium typographic environment with property detail pages, map and CTAs that lead straight to a personal meeting.",
      work: ["Luxury real-estate web design", "Property detail page", "Filters & search", "Lead management"],
      results: [
        { value: "+95%", label: "direct inquiries" },
        { value: "+62%", label: "detail page views" },
        { value: "+38%", label: "time on site" },
      ],
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
      description: "Website for an authorised premium car dealer with vehicle catalogue, financing calculator and online test-drive booking.",
      result: "+120% test-drive bookings",
      problem: "The site didn't feel like a premium brand and first contact was usually a phone call after several site visits.",
      solution: "We built a cinematic site with rich vehicle detail pages, a financing calculator and a one-click test-drive booking from the car page.",
      work: ["Visual concept", "Catalogue & car detail", "Financing calculator", "Test-drive booking"],
      results: [
        { value: "+120%", label: "test-drive bookings" },
        { value: "+58%", label: "leads from website" },
        { value: "+34%", label: "returning visitors" },
      ],
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
      description: "Сайт по недвижимости премиум-сегмента Праги с каталогом, галереями и контактом с брокером.",
      result: "+95% прямых заявок",
      problem: "Сайт не соответствовал качеству портфолио, и заявки приходили в основном с внешних порталов.",
      solution: "Мы создали премиальную типографическую среду с детальными страницами объектов, картой и CTA на встречу.",
      work: ["Дизайн для luxury-недвижимости", "Страница объекта", "Фильтры и поиск", "Управление лидами"],
      results: [
        { value: "+95%", label: "прямых заявок" },
        { value: "+62%", label: "просмотров деталей" },
        { value: "+38%", label: "время на сайте" },
      ],
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
      description: "Сайт официального дилера премиальных авто с каталогом, кредитным калькулятором и записью на тест-драйв.",
      result: "+120% тест-драйвов",
      problem: "Сайт не выглядел как премиальный бренд, и первый контакт обычно был по телефону после нескольких визитов.",
      solution: "Мы построили кинематографичный сайт с детальной страницей авто, калькулятором и быстрым бронированием тест-драйва.",
      work: ["Визуальная концепция", "Каталог и детали авто", "Калькулятор", "Бронирование тест-драйва"],
      results: [
        { value: "+120%", label: "тест-драйвов" },
        { value: "+58%", label: "лидов" },
        { value: "+34%", label: "возврат пользователей" },
      ],
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
      description: "Сайт нерухомості преміум-сегменту Праги з каталогом, галереями та контактом з брокером.",
      result: "+95% прямих заявок",
      problem: "Сайт не відповідав якості портфоліо, заявки приходили переважно з зовнішніх порталів.",
      solution: "Ми створили преміальне типографічне середовище з детальними сторінками об'єктів, мапою та CTA на зустріч.",
      work: ["Дизайн для luxury-нерухомості", "Сторінка об'єкта", "Фільтри та пошук", "Управління лідами"],
      results: [
        { value: "+95%", label: "прямих заявок" },
        { value: "+62%", label: "перегляди деталей" },
        { value: "+38%", label: "час на сайті" },
      ],
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
      description: "Сайт офіційного дилера преміальних авто з каталогом, кредитним калькулятором і записом на тест-драйв.",
      result: "+120% тест-драйвів",
      problem: "Сайт не виглядав як преміальний бренд, перший контакт зазвичай був по телефону після кількох візитів.",
      solution: "Ми побудували кінематографічний сайт з детальною сторінкою авто, калькулятором і швидким бронюванням тест-драйву.",
      work: ["Візуальна концепція", "Каталог і деталі авто", "Калькулятор", "Бронювання тест-драйву"],
      results: [
        { value: "+120%", label: "тест-драйвів" },
        { value: "+58%", label: "лідів" },
        { value: "+34%", label: "повернення відвідувачів" },
      ],
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
