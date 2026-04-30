import { useMemo } from "react";
import { useT, type Lang } from "@/lib/i18n";
import { PROJECTS, type ProjectCase, type ProjectSlug } from "@/lib/projects";

export type ProjectI18n = {
  description: string;
  result: string;
  problem: string;
  solution: string;
  work: string[];
  results: { value: string; label: string }[];
};

type ProjectsDict = Record<ProjectSlug, ProjectI18n>;

const PROJECTS_I18N: Record<Lang, ProjectsDict> = {
  CZ: {
    "nordic-store": {
      description: "Redesign módního e-shopu s důrazem na rychlejší nákup a vyšší konverze.",
      result: "+120% konverze",
      problem: "E-shop měl vysokou návštěvnost, ale zákazníci odcházeli z produktových stránek a nedokončovali objednávky.",
      solution: "Zjednodušili jsme kategorii, produktový detail i checkout. Přidali jsme jasné signály důvěry a rychlejší cestu k nákupu.",
      work: ["UX audit a nákupní cesta", "Redesign produktových stránek", "Vývoj rychlého e-shopu", "Konverzní optimalizace checkoutu"],
      results: [
        { value: "+120%", label: "konverze" },
        { value: "+80%", label: "organická návštěvnost" },
        { value: "−38%", label: "opuštěných košíků" },
      ],
    },
    corvex: {
      description: "Firemní web pro technologickou společnost, který jasně vysvětluje nabídku a generuje leady.",
      result: "+45% poptávek",
      problem: "Původní web působil nejasně, nepředával důvěru a návštěvníci nerozuměli hodnotě služby.",
      solution: "Postavili jsme nový obsahový tok, silnější vizuální hierarchii a kontaktní body na klíčových místech webu.",
      work: ["Informační architektura", "UX/UI web design", "Frontend vývoj", "SEO základ a měření poptávek"],
      results: [
        { value: "+45%", label: "poptávek" },
        { value: "<2s", label: "načtení stránky" },
        { value: "+32%", label: "čas na webu" },
      ],
    },
    tinesort: {
      description: "Produktové UI a onboarding pro B2B platformu, která potřebovala rychleji aktivovat nové uživatele.",
      result: "+40% retence",
      problem: "Noví uživatelé se ztráceli v produktu a aktivace po registraci byla příliš nízká.",
      solution: "Navrhli jsme přehlednější dashboard, onboarding kroky a UI systém pro další rozvoj produktu.",
      work: ["Produktový UX výzkum", "SaaS dashboard", "Onboarding flow", "Design systém"],
      results: [
        { value: "+40%", label: "retence" },
        { value: "−30%", label: "churn" },
        { value: "+50%", label: "aktivace" },
      ],
    },
    patecura: {
      description: "Kompletní identita pro prémiovou wellness značku — logo, barvy, typografie a brand manuál.",
      result: "Kompletní identita",
      problem: "Značka působila nekonzistentně a v digitální komunikaci nebyla snadno rozpoznatelná.",
      solution: "Vytvořili jsme jednotný vizuální systém s jasnými pravidly pro web, tisk i sociální sítě.",
      work: ["Strategie značky", "Logo systém", "Barevná paleta a typografie", "Brand manuál"],
      results: [
        { value: "100%", label: "konzistence" },
        { value: "+ důvěra", label: "při prvním kontaktu" },
        { value: "ready", label: "pro web i tisk" },
      ],
    },
    "lumen-studio": {
      description: "Prezentační web pro architektonické studio s důrazem na portfolio, důvěru a poptávky.",
      result: "+95% poptávek",
      problem: "Studio mělo kvalitní práci, ale web nepůsobil prémiově a nevedl návštěvníky ke konzultaci.",
      solution: "Navrhli jsme vizuální portfolio systém, jasné služby a kontaktní CTA v návaznosti na typ projektu.",
      work: ["UX struktura portfolia", "Prémiový web design", "Rychlý frontend", "SEO pro lokální služby"],
      results: [
        { value: "+95%", label: "poptávek" },
        { value: "+52%", label: "zobrazení projektů" },
        { value: "<2s", label: "rychlost" },
      ],
    },
    "verda-market": {
      description: "Bio e-shop optimalizovaný pro mobilní nákupy, opakované objednávky a rychlý checkout.",
      result: "+60% obrat",
      problem: "Mobilní zákazníci nedokončovali nákup a produktová nabídka byla špatně filtrovatelná.",
      solution: "Zjednodušili jsme katalog, filtry, produktové karty i checkout s důrazem na opakovaný nákup.",
      work: ["Mobilní UX e-shopu", "Produktový grid", "Filtry a vyhledávání", "Měření objednávek"],
      results: [
        { value: "+60%", label: "obrat" },
        { value: "+34%", label: "mobilní konverze" },
        { value: "−28%", label: "opuštění košíku" },
      ],
    },
    northwind: {
      description: "Rebrand logistické firmy, který sjednotil vizuální styl napříč webem, prezentacemi a obchodem.",
      result: "Kompletní rebrand",
      problem: "Firma rostla, ale její vizuální komunikace působila roztříštěně a neodpovídala velikosti byznysu.",
      solution: "Vytvořili jsme moderní identitu, systém loga a jasná pravidla pro obchodní materiály i web.",
      work: ["Brand audit", "Logo a symbol", "Vizuální systém", "Obchodní prezentace"],
      results: [
        { value: "1 systém", label: "pro všechny kanály" },
        { value: "+ důvěra", label: "u B2B klientů" },
        { value: "30+", label: "brand assetů" },
      ],
    },
    "pulse-crm": {
      description: "Dashboard a onboarding flow pro CRM produkt, který potřeboval rychlejší aktivaci týmů.",
      result: "+50% aktivace",
      problem: "Uživatelé po registraci neviděli jasný další krok a týmy produkt nasazovaly příliš pomalu.",
      solution: "Navrhli jsme nový dashboard, onboarding checklist a metriky, které vedou uživatele k první hodnotě.",
      work: ["UX audit aplikace", "Dashboard UI", "Onboarding checklist", "Design komponent"],
      results: [
        { value: "+50%", label: "aktivace" },
        { value: "−35%", label: "čas k první hodnotě" },
        { value: "+22%", label: "týmové přijetí" },
      ],
    },
  },
  EN: {
    "nordic-store": {
      description: "Fashion e-commerce redesign focused on faster checkout and higher conversion.",
      result: "+120% conversion",
      problem: "The store had high traffic, but visitors abandoned product pages and rarely completed orders.",
      solution: "We simplified category, product detail and checkout pages, added clear trust signals and a faster path to purchase.",
      work: ["UX audit and buying journey", "Product page redesign", "Fast e-commerce build", "Checkout conversion optimisation"],
      results: [
        { value: "+120%", label: "conversion" },
        { value: "+80%", label: "organic traffic" },
        { value: "−38%", label: "abandoned carts" },
      ],
    },
    corvex: {
      description: "Corporate website for a tech company that clearly explains the offer and generates leads.",
      result: "+45% inquiries",
      problem: "The original site was unclear, lacked trust and visitors didn't grasp the value of the service.",
      solution: "We rebuilt the content flow, strengthened visual hierarchy and placed clear contact points across the site.",
      work: ["Information architecture", "UX/UI web design", "Frontend development", "SEO baseline & lead tracking"],
      results: [
        { value: "+45%", label: "inquiries" },
        { value: "<2s", label: "page load" },
        { value: "+32%", label: "time on site" },
      ],
    },
    tinesort: {
      description: "Product UI and onboarding for a B2B platform that needed to activate new users faster.",
      result: "+40% retention",
      problem: "New users got lost inside the product and activation after sign-up was too low.",
      solution: "We designed a clearer dashboard, onboarding steps and a UI system for future product growth.",
      work: ["Product UX research", "SaaS dashboard", "Onboarding flow", "Design system"],
      results: [
        { value: "+40%", label: "retention" },
        { value: "−30%", label: "churn" },
        { value: "+50%", label: "activation" },
      ],
    },
    patecura: {
      description: "Full identity for a premium wellness brand — logo, colors, typography and brand manual.",
      result: "Full identity",
      problem: "The brand felt inconsistent and was not easily recognisable in digital communication.",
      solution: "We built a unified visual system with clear rules for web, print and social media.",
      work: ["Brand strategy", "Logo system", "Color palette and typography", "Brand manual"],
      results: [
        { value: "100%", label: "consistency" },
        { value: "+ trust", label: "on first contact" },
        { value: "ready", label: "for web and print" },
      ],
    },
    "lumen-studio": {
      description: "Showcase site for an architecture studio focused on portfolio, trust and inquiries.",
      result: "+95% inquiries",
      problem: "The studio had great work, but the website didn't feel premium and didn't lead visitors to a consultation.",
      solution: "We designed a visual portfolio system, clear services and contact CTAs tied to project type.",
      work: ["Portfolio UX structure", "Premium web design", "Fast frontend", "Local SEO"],
      results: [
        { value: "+95%", label: "inquiries" },
        { value: "+52%", label: "project views" },
        { value: "<2s", label: "speed" },
      ],
    },
    "verda-market": {
      description: "Organic e-shop optimised for mobile purchases, repeat orders and fast checkout.",
      result: "+60% revenue",
      problem: "Mobile customers didn't complete purchases and the product range was hard to filter.",
      solution: "We simplified the catalogue, filters, product cards and checkout with a focus on repeat orders.",
      work: ["Mobile e-commerce UX", "Product grid", "Filters and search", "Order tracking"],
      results: [
        { value: "+60%", label: "revenue" },
        { value: "+34%", label: "mobile conversion" },
        { value: "−28%", label: "cart abandonment" },
      ],
    },
    northwind: {
      description: "Rebrand of a logistics company that unified the visual style across web, presentations and sales.",
      result: "Full rebrand",
      problem: "The company was growing, but its visual communication felt fragmented and didn't match the size of the business.",
      solution: "We created a modern identity, a logo system and clear rules for sales materials and web.",
      work: ["Brand audit", "Logo and symbol", "Visual system", "Sales presentations"],
      results: [
        { value: "1 system", label: "for all channels" },
        { value: "+ trust", label: "with B2B clients" },
        { value: "30+", label: "brand assets" },
      ],
    },
    "pulse-crm": {
      description: "Dashboard and onboarding flow for a CRM product that needed to activate teams faster.",
      result: "+50% activation",
      problem: "After sign-up, users didn't see a clear next step and teams rolled out the product too slowly.",
      solution: "We designed a new dashboard, an onboarding checklist and metrics that guide users to first value.",
      work: ["App UX audit", "Dashboard UI", "Onboarding checklist", "Component design"],
      results: [
        { value: "+50%", label: "activation" },
        { value: "−35%", label: "time to first value" },
        { value: "+22%", label: "team adoption" },
      ],
    },
  },
  RU: {
    "nordic-store": {
      description: "Редизайн модного интернет-магазина с фокусом на быстрый checkout и высокую конверсию.",
      result: "+120% конверсии",
      problem: "У магазина был большой трафик, но клиенты уходили со страниц товаров и не доводили заказы до конца.",
      solution: "Мы упростили категорию, карточку товара и checkout, добавили сигналы доверия и быстрый путь к покупке.",
      work: ["UX-аудит и путь покупки", "Редизайн страниц товаров", "Разработка быстрого магазина", "Оптимизация конверсии checkout"],
      results: [
        { value: "+120%", label: "конверсия" },
        { value: "+80%", label: "органический трафик" },
        { value: "−38%", label: "брошенных корзин" },
      ],
    },
    corvex: {
      description: "Корпоративный сайт для tech-компании, который чётко объясняет предложение и приносит заявки.",
      result: "+45% заявок",
      problem: "Старый сайт был непонятным, не вызывал доверия — посетители не понимали ценности услуги.",
      solution: "Мы перестроили контент, усилили визуальную иерархию и расставили контактные точки в ключевых местах.",
      work: ["Информационная архитектура", "UX/UI дизайн", "Frontend разработка", "Базовое SEO и трекинг заявок"],
      results: [
        { value: "+45%", label: "заявок" },
        { value: "<2с", label: "загрузка страниц" },
        { value: "+32%", label: "время на сайте" },
      ],
    },
    tinesort: {
      description: "Продуктовый UI и онбординг для B2B-платформы, которой нужна была более быстрая активация.",
      result: "+40% удержания",
      problem: "Новые пользователи терялись в продукте, активация после регистрации была слишком низкой.",
      solution: "Мы спроектировали понятный дашборд, шаги онбординга и UI-систему для развития продукта.",
      work: ["Продуктовый UX-ресёрч", "SaaS-дашборд", "Онбординг", "Дизайн-система"],
      results: [
        { value: "+40%", label: "удержание" },
        { value: "−30%", label: "отток" },
        { value: "+50%", label: "активация" },
      ],
    },
    patecura: {
      description: "Полная айдентика для премиального wellness-бренда — лого, цвета, типографика и brand book.",
      result: "Полная айдентика",
      problem: "Бренд выглядел несогласованно и плохо узнавался в digital-коммуникации.",
      solution: "Мы создали единую визуальную систему с чёткими правилами для веба, печати и соцсетей.",
      work: ["Стратегия бренда", "Логосистема", "Палитра и типографика", "Brand book"],
      results: [
        { value: "100%", label: "согласованности" },
        { value: "+ доверие", label: "при первом контакте" },
        { value: "ready", label: "для веба и печати" },
      ],
    },
    "lumen-studio": {
      description: "Презентационный сайт для архитектурной студии с фокусом на портфолио, доверие и заявки.",
      result: "+95% заявок",
      problem: "У студии были классные работы, но сайт не выглядел премиально и не вёл к консультации.",
      solution: "Мы спроектировали визуальную систему портфолио, ясные услуги и CTA по типу проекта.",
      work: ["UX-структура портфолио", "Премиум веб-дизайн", "Быстрый frontend", "SEO для локальных услуг"],
      results: [
        { value: "+95%", label: "заявок" },
        { value: "+52%", label: "просмотров проектов" },
        { value: "<2с", label: "скорость" },
      ],
    },
    "verda-market": {
      description: "Bio-магазин, оптимизированный под мобильные покупки, повторные заказы и быстрый checkout.",
      result: "+60% выручки",
      problem: "Мобильные клиенты не доводили покупку до конца, ассортимент было сложно фильтровать.",
      solution: "Мы упростили каталог, фильтры, карточки товаров и checkout с фокусом на повторные покупки.",
      work: ["Мобильный UX магазина", "Сетка товаров", "Фильтры и поиск", "Трекинг заказов"],
      results: [
        { value: "+60%", label: "выручки" },
        { value: "+34%", label: "мобильная конверсия" },
        { value: "−28%", label: "брошенных корзин" },
      ],
    },
    northwind: {
      description: "Ребрендинг логистической компании — единый стиль для сайта, презентаций и продаж.",
      result: "Полный ребрендинг",
      problem: "Компания росла, но визуальная коммуникация выглядела разрозненно и не соответствовала масштабу.",
      solution: "Мы создали современную айдентику, систему логотипа и правила для коммерческих материалов и сайта.",
      work: ["Brand-аудит", "Лого и символ", "Визуальная система", "Коммерческие презентации"],
      results: [
        { value: "1 система", label: "для всех каналов" },
        { value: "+ доверие", label: "у B2B-клиентов" },
        { value: "30+", label: "brand-ассетов" },
      ],
    },
    "pulse-crm": {
      description: "Дашборд и онбординг для CRM-продукта, которому нужна была быстрая активация команд.",
      result: "+50% активации",
      problem: "После регистрации пользователи не видели чёткого следующего шага, команды внедряли продукт слишком медленно.",
      solution: "Мы спроектировали новый дашборд, чек-лист онбординга и метрики, ведущие к первой ценности.",
      work: ["UX-аудит приложения", "Dashboard UI", "Чек-лист онбординга", "Дизайн компонентов"],
      results: [
        { value: "+50%", label: "активация" },
        { value: "−35%", label: "время до первой ценности" },
        { value: "+22%", label: "внедрение в команде" },
      ],
    },
  },
  UA: {
    "nordic-store": {
      description: "Редизайн модного інтернет-магазину з фокусом на швидкий checkout і вищу конверсію.",
      result: "+120% конверсії",
      problem: "Магазин мав великий трафік, але клієнти йшли зі сторінок товарів і не завершували замовлення.",
      solution: "Ми спростили категорію, картку товару й checkout, додали сигнали довіри і швидкий шлях до покупки.",
      work: ["UX-аудит і шлях покупки", "Редизайн сторінок товарів", "Розробка швидкого магазину", "Оптимізація конверсії checkout"],
      results: [
        { value: "+120%", label: "конверсія" },
        { value: "+80%", label: "органічний трафік" },
        { value: "−38%", label: "покинутих кошиків" },
      ],
    },
    corvex: {
      description: "Корпоративний сайт для tech-компанії, що чітко пояснює пропозицію та генерує заявки.",
      result: "+45% заявок",
      problem: "Старий сайт був неясним, не викликав довіри — відвідувачі не розуміли цінності послуги.",
      solution: "Ми перебудували контент, посилили візуальну ієрархію і розставили контактні точки.",
      work: ["Інформаційна архітектура", "UX/UI дизайн", "Frontend розробка", "Базове SEO і трекінг заявок"],
      results: [
        { value: "+45%", label: "заявок" },
        { value: "<2с", label: "завантаження сторінок" },
        { value: "+32%", label: "час на сайті" },
      ],
    },
    tinesort: {
      description: "Продуктовий UI та онбординг для B2B-платформи, що потребувала швидшої активації.",
      result: "+40% утримання",
      problem: "Нові користувачі губилися в продукті, активація після реєстрації була занадто низькою.",
      solution: "Ми спроєктували зрозумілий дашборд, кроки онбордингу та UI-систему для розвитку продукту.",
      work: ["Продуктовий UX-ресёрч", "SaaS-дашборд", "Онбординг", "Дизайн-система"],
      results: [
        { value: "+40%", label: "утримання" },
        { value: "−30%", label: "відтік" },
        { value: "+50%", label: "активація" },
      ],
    },
    patecura: {
      description: "Повна айдентика для преміального wellness-бренду — лого, кольори, типографіка і brand book.",
      result: "Повна айдентика",
      problem: "Бренд виглядав неузгоджено й погано впізнавався в digital-комунікації.",
      solution: "Ми створили єдину візуальну систему з чіткими правилами для веба, друку та соцмереж.",
      work: ["Стратегія бренду", "Логосистема", "Палітра і типографіка", "Brand book"],
      results: [
        { value: "100%", label: "узгодженості" },
        { value: "+ довіра", label: "при першому контакті" },
        { value: "ready", label: "для веба і друку" },
      ],
    },
    "lumen-studio": {
      description: "Презентаційний сайт для архітектурної студії з фокусом на портфоліо, довіру та заявки.",
      result: "+95% заявок",
      problem: "Студія мала якісні роботи, але сайт не виглядав преміально і не вів до консультації.",
      solution: "Ми спроєктували візуальну систему портфоліо, ясні послуги і CTA за типом проєкту.",
      work: ["UX-структура портфоліо", "Преміум вебдизайн", "Швидкий frontend", "SEO для локальних послуг"],
      results: [
        { value: "+95%", label: "заявок" },
        { value: "+52%", label: "переглядів проєктів" },
        { value: "<2с", label: "швидкість" },
      ],
    },
    "verda-market": {
      description: "Bio-магазин, оптимізований під мобільні покупки, повторні замовлення та швидкий checkout.",
      result: "+60% виручки",
      problem: "Мобільні клієнти не завершували покупки, асортимент було складно фільтрувати.",
      solution: "Ми спростили каталог, фільтри, картки товарів і checkout із фокусом на повторні покупки.",
      work: ["Мобільний UX магазину", "Сітка товарів", "Фільтри й пошук", "Трекінг замовлень"],
      results: [
        { value: "+60%", label: "виручки" },
        { value: "+34%", label: "мобільна конверсія" },
        { value: "−28%", label: "покинутих кошиків" },
      ],
    },
    northwind: {
      description: "Ребрендинг логістичної компанії — єдиний стиль для сайту, презентацій і продажів.",
      result: "Повний ребрендинг",
      problem: "Компанія росла, але візуальна комунікація виглядала розрізнено й не відповідала масштабу.",
      solution: "Ми створили сучасну айдентику, систему логотипа і правила для комерційних матеріалів і сайту.",
      work: ["Brand-аудит", "Лого і символ", "Візуальна система", "Комерційні презентації"],
      results: [
        { value: "1 система", label: "для всіх каналів" },
        { value: "+ довіра", label: "у B2B-клієнтів" },
        { value: "30+", label: "brand-ассетів" },
      ],
    },
    "pulse-crm": {
      description: "Дашборд і онбординг для CRM-продукту, що потребував швидкої активації команд.",
      result: "+50% активації",
      problem: "Після реєстрації користувачі не бачили чіткого наступного кроку, команди впроваджували продукт надто повільно.",
      solution: "Ми спроєктували новий дашборд, чек-лист онбордингу і метрики, що ведуть до першої цінності.",
      work: ["UX-аудит застосунку", "Dashboard UI", "Чек-лист онбордингу", "Дизайн компонентів"],
      results: [
        { value: "+50%", label: "активація" },
        { value: "−35%", label: "час до першої цінності" },
        { value: "+22%", label: "впровадження в команді" },
      ],
    },
  },
};

export type LocalizedProject = ProjectCase & ProjectI18n;

export function localizeProject(p: ProjectCase, lang: Lang): LocalizedProject {
  const tr = PROJECTS_I18N[lang][p.slug];
  return { ...p, ...tr };
}

export function useLocalizedProjects(): LocalizedProject[] {
  const { lang } = useT();
  return useMemo(() => PROJECTS.map((p) => localizeProject(p, lang)), [lang]);
}

export function useLocalizedProject(slug: ProjectSlug): LocalizedProject | undefined {
  const { lang } = useT();
  return useMemo(() => {
    const p = PROJECTS.find((x) => x.slug === slug);
    return p ? localizeProject(p, lang) : undefined;
  }, [lang, slug]);
}

// Page chrome labels
export const PROJECT_PAGE_LABELS: Record<Lang, {
  back: string;
  mainResult: string;
  problemEyebrow: string;
  problemTitle: string;
  solutionEyebrow: string;
  solutionTitle: string;
  workEyebrow: string;
  workTitle: string;
  resultsEyebrow: string;
  ctaTitle: string;
  ctaBody: string;
  ctaBtn: string;
  notFoundEyebrow: string;
  notFoundTitle: string;
  notFoundBack: string;
}> = {
  CZ: {
    back: "Zpět na projekty",
    mainResult: "Hlavní výsledek",
    problemEyebrow: "Problém",
    problemTitle: "Co klient potřeboval vyřešit",
    solutionEyebrow: "Řešení",
    solutionTitle: "Jak jsme to postavili",
    workEyebrow: "Práce",
    workTitle: "UX, vývoj, optimalizace",
    resultsEyebrow: "Výsledky",
    ctaTitle: "Chcete podobný výsledek?",
    ctaBody: "Popište nám projekt a navrhneme nejrychlejší cestu k webu, e-shopu nebo značce, která bude fungovat.",
    ctaBtn: "Chci podobný web",
    notFoundEyebrow: "Projekt nenalezen",
    notFoundTitle: "Tento projekt neexistuje.",
    notFoundBack: "Zpět na portfolio",
  },
  EN: {
    back: "Back to projects",
    mainResult: "Main result",
    problemEyebrow: "Problem",
    problemTitle: "What the client needed to solve",
    solutionEyebrow: "Solution",
    solutionTitle: "How we built it",
    workEyebrow: "Work",
    workTitle: "UX, development, optimisation",
    resultsEyebrow: "Results",
    ctaTitle: "Want a similar result?",
    ctaBody: "Tell us about your project and we'll map the fastest path to a website, e-shop or brand that actually works.",
    ctaBtn: "I want a similar site",
    notFoundEyebrow: "Project not found",
    notFoundTitle: "This project doesn't exist.",
    notFoundBack: "Back to portfolio",
  },
  RU: {
    back: "Назад к проектам",
    mainResult: "Главный результат",
    problemEyebrow: "Проблема",
    problemTitle: "Что нужно было решить клиенту",
    solutionEyebrow: "Решение",
    solutionTitle: "Как мы это построили",
    workEyebrow: "Работа",
    workTitle: "UX, разработка, оптимизация",
    resultsEyebrow: "Результаты",
    ctaTitle: "Хотите такой же результат?",
    ctaBody: "Расскажите о проекте, и мы составим самый быстрый путь к сайту, магазину или бренду, который реально работает.",
    ctaBtn: "Хочу похожий сайт",
    notFoundEyebrow: "Проект не найден",
    notFoundTitle: "Такого проекта нет.",
    notFoundBack: "Назад в портфолио",
  },
  UA: {
    back: "Назад до проєктів",
    mainResult: "Головний результат",
    problemEyebrow: "Проблема",
    problemTitle: "Що потрібно було вирішити клієнту",
    solutionEyebrow: "Рішення",
    solutionTitle: "Як ми це побудували",
    workEyebrow: "Робота",
    workTitle: "UX, розробка, оптимізація",
    resultsEyebrow: "Результати",
    ctaTitle: "Хочете подібний результат?",
    ctaBody: "Розкажіть про проєкт — складемо найшвидший шлях до сайту, магазину чи бренду, що реально працює.",
    ctaBtn: "Хочу подібний сайт",
    notFoundEyebrow: "Проєкт не знайдено",
    notFoundTitle: "Цього проєкту не існує.",
    notFoundBack: "Назад до портфоліо",
  },
};

export function useProjectLabels() {
  const { lang } = useT();
  return PROJECT_PAGE_LABELS[lang];
}
