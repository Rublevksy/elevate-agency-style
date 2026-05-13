import { useT, type Lang } from "@/lib/i18n";
import { PROJECTS_BASE, type ProjectBase, type ProjectSlug, type ProjectCategory } from "@/lib/projects";

export type LocalizedProject = ProjectBase & {
  name: string;
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
  CZ: { Web: "Web", "E-shop": "E-shop", Branding: "Branding", SaaS: "SaaS" },
  EN: { Web: "Web", "E-shop": "E-commerce", Branding: "Branding", SaaS: "SaaS" },
  RU: { Web: "Сайт", "E-shop": "Интернет-магазин", Branding: "Брендинг", SaaS: "SaaS" },
  UA: { Web: "Сайт", "E-shop": "Інтернет-магазин", Branding: "Брендинг", SaaS: "SaaS" },
};

const CONTENT: Record<Lang, Record<ProjectSlug, Content>> = {
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
      problem: "The store had high traffic, but customers left product pages without completing orders.",
      solution: "We simplified categories, product detail and checkout, and added clear trust signals and a faster path to purchase.",
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
      problem: "The original site felt unclear, did not build trust and visitors did not understand the value of the service.",
      solution: "We built a new content flow, stronger visual hierarchy and contact points at the key moments on the site.",
      work: ["Information architecture", "UX/UI web design", "Frontend development", "SEO foundation and lead tracking"],
      results: [
        { value: "+45%", label: "inquiries" },
        { value: "<2s", label: "page load" },
        { value: "+32%", label: "time on site" },
      ],
    },
    tinesort: {
      description: "Product UI and onboarding for a B2B platform that needed to activate new users faster.",
      result: "+40% retention",
      problem: "New users got lost in the product and post-signup activation was too low.",
      solution: "We designed a clearer dashboard, onboarding steps and a UI system for ongoing product growth.",
      work: ["Product UX research", "SaaS dashboard", "Onboarding flow", "Design system"],
      results: [
        { value: "+40%", label: "retention" },
        { value: "−30%", label: "churn" },
        { value: "+50%", label: "activation" },
      ],
    },
    patecura: {
      description: "Full identity for a premium wellness brand — logo, colours, typography and brand manual.",
      result: "Full identity",
      problem: "The brand felt inconsistent and was hard to recognise in digital communication.",
      solution: "We built a unified visual system with clear rules for web, print and social media.",
      work: ["Brand strategy", "Logo system", "Colour palette and typography", "Brand manual"],
      results: [
        { value: "100%", label: "consistency" },
        { value: "+ trust", label: "at first touch" },
        { value: "ready", label: "for web and print" },
      ],
    },
    "lumen-studio": {
      description: "Showcase website for an architecture studio focused on portfolio, trust and inquiries.",
      result: "+95% inquiries",
      problem: "The studio had great work, but the site did not feel premium and did not lead visitors to a consultation.",
      solution: "We designed a visual portfolio system, clear services and contact CTAs tied to the project type.",
      work: ["Portfolio UX structure", "Premium web design", "Fast frontend", "Local services SEO"],
      results: [
        { value: "+95%", label: "inquiries" },
        { value: "+52%", label: "project views" },
        { value: "<2s", label: "load speed" },
      ],
    },
    "verda-market": {
      description: "Organic e-shop optimised for mobile purchases, repeat orders and fast checkout.",
      result: "+60% revenue",
      problem: "Mobile customers did not complete purchases and the product range was hard to filter.",
      solution: "We simplified the catalogue, filters, product cards and checkout with a focus on repeat purchases.",
      work: ["Mobile e-shop UX", "Product grid", "Filters and search", "Order tracking"],
      results: [
        { value: "+60%", label: "revenue" },
        { value: "+34%", label: "mobile conversion" },
        { value: "−28%", label: "cart abandonment" },
      ],
    },
    northwind: {
      description: "Rebrand of a logistics company that unified the visual style across web, sales and presentations.",
      result: "Full rebrand",
      problem: "The company was growing, but its visual communication felt fragmented and out of step with the business.",
      solution: "We built a modern identity, logo system and clear rules for sales materials and the website.",
      work: ["Brand audit", "Logo and symbol", "Visual system", "Sales presentations"],
      results: [
        { value: "1 system", label: "across all channels" },
        { value: "+ trust", label: "with B2B clients" },
        { value: "30+", label: "brand assets" },
      ],
    },
    "pulse-crm": {
      description: "Dashboard and onboarding flow for a CRM product that needed faster team activation.",
      result: "+50% activation",
      problem: "After signup, users did not see a clear next step and teams adopted the product too slowly.",
      solution: "We designed a new dashboard, onboarding checklist and metrics that lead users to first value.",
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
      description: "Редизайн модного интернет-магазина с упором на быструю покупку и рост конверсии.",
      result: "+120% конверсии",
      problem: "У магазина был высокий трафик, но клиенты уходили со страниц товаров и не оформляли заказ.",
      solution: "Мы упростили каталог, карточку товара и оформление заказа, добавили доверие и более короткий путь к покупке.",
      work: ["UX-аудит и путь покупателя", "Редизайн страниц товаров", "Быстрая разработка магазина", "Оптимизация конверсии checkout"],
      results: [
        { value: "+120%", label: "конверсия" },
        { value: "+80%", label: "органический трафик" },
        { value: "−38%", label: "брошенных корзин" },
      ],
    },
    corvex: {
      description: "Корпоративный сайт для tech-компании, который ясно объясняет услугу и приносит заявки.",
      result: "+45% заявок",
      problem: "Старый сайт был непонятным, не вызывал доверия и не передавал ценность услуги.",
      solution: "Мы построили новый контент-поток, сильную визуальную иерархию и точки контакта в ключевых местах.",
      work: ["Информационная архитектура", "UX/UI дизайн сайта", "Frontend-разработка", "SEO-база и аналитика заявок"],
      results: [
        { value: "+45%", label: "заявок" },
        { value: "<2s", label: "загрузка страницы" },
        { value: "+32%", label: "время на сайте" },
      ],
    },
    tinesort: {
      description: "UI продукта и онбординг для B2B-платформы, которой нужна была более быстрая активация пользователей.",
      result: "+40% удержания",
      problem: "Новые пользователи терялись в продукте, активация после регистрации была слишком низкой.",
      solution: "Мы спроектировали понятный дашборд, шаги онбординга и UI-систему для роста продукта.",
      work: ["Продуктовое UX-исследование", "SaaS-дашборд", "Онбординг", "Дизайн-система"],
      results: [
        { value: "+40%", label: "удержание" },
        { value: "−30%", label: "отток" },
        { value: "+50%", label: "активация" },
      ],
    },
    patecura: {
      description: "Полная айдентика для премиального wellness-бренда — логотип, цвета, типографика и бренд-бук.",
      result: "Полная айдентика",
      problem: "Бренд выглядел непоследовательно и плохо узнавался в цифровой коммуникации.",
      solution: "Мы создали единую визуальную систему с чёткими правилами для веба, печати и соцсетей.",
      work: ["Стратегия бренда", "Система логотипа", "Палитра и типографика", "Бренд-бук"],
      results: [
        { value: "100%", label: "консистентность" },
        { value: "+ доверие", label: "при первом контакте" },
        { value: "ready", label: "для веба и печати" },
      ],
    },
    "lumen-studio": {
      description: "Презентационный сайт архитектурного бюро с упором на портфолио, доверие и заявки.",
      result: "+95% заявок",
      problem: "У студии были сильные проекты, но сайт не выглядел премиально и не вёл к консультации.",
      solution: "Мы спроектировали визуальную систему портфолио, понятные услуги и контактные CTA по типу проекта.",
      work: ["UX-структура портфолио", "Премиальный веб-дизайн", "Быстрый frontend", "SEO для локальных услуг"],
      results: [
        { value: "+95%", label: "заявок" },
        { value: "+52%", label: "просмотры проектов" },
        { value: "<2s", label: "скорость" },
      ],
    },
    "verda-market": {
      description: "Эко-магазин, оптимизированный под мобильные покупки, повторные заказы и быстрый checkout.",
      result: "+60% выручки",
      problem: "Мобильные покупатели не доходили до оплаты, фильтрация ассортимента была неудобной.",
      solution: "Мы упростили каталог, фильтры, карточки и checkout с упором на повторные покупки.",
      work: ["Мобильный UX магазина", "Сетка товаров", "Фильтры и поиск", "Аналитика заказов"],
      results: [
        { value: "+60%", label: "выручка" },
        { value: "+34%", label: "мобильная конверсия" },
        { value: "−28%", label: "брошенные корзины" },
      ],
    },
    northwind: {
      description: "Ребрендинг логистической компании, объединивший визуальный стиль на сайте, в продажах и презентациях.",
      result: "Полный ребрендинг",
      problem: "Компания росла, но визуальная коммуникация выглядела разрозненно и не соответствовала масштабу бизнеса.",
      solution: "Мы создали современную айдентику, систему логотипа и чёткие правила для коммерческих материалов и сайта.",
      work: ["Аудит бренда", "Логотип и символ", "Визуальная система", "Коммерческие презентации"],
      results: [
        { value: "1 система", label: "для всех каналов" },
        { value: "+ доверие", label: "у B2B-клиентов" },
        { value: "30+", label: "brand-ассетов" },
      ],
    },
    "pulse-crm": {
      description: "Дашборд и онбординг для CRM-продукта, которому требовалась более быстрая активация команд.",
      result: "+50% активации",
      problem: "После регистрации пользователи не видели чёткий следующий шаг, команды внедряли продукт слишком медленно.",
      solution: "Мы спроектировали новый дашборд, чек-лист онбординга и метрики, которые ведут к первой ценности.",
      work: ["UX-аудит приложения", "UI дашборда", "Чек-лист онбординга", "Дизайн компонентов"],
      results: [
        { value: "+50%", label: "активация" },
        { value: "−35%", label: "время до первой ценности" },
        { value: "+22%", label: "командное внедрение" },
      ],
    },
  },
  UA: {
    "nordic-store": {
      description: "Редизайн модного інтернет-магазину з акцентом на швидку покупку та зростання конверсії.",
      result: "+120% конверсії",
      problem: "У магазину був високий трафік, але клієнти йшли зі сторінок товарів і не завершували замовлення.",
      solution: "Ми спростили каталог, картку товару та оформлення замовлення, додали довіру й коротший шлях до покупки.",
      work: ["UX-аудит і шлях покупця", "Редизайн сторінок товарів", "Швидка розробка магазину", "Оптимізація конверсії checkout"],
      results: [
        { value: "+120%", label: "конверсія" },
        { value: "+80%", label: "органічний трафік" },
        { value: "−38%", label: "покинутих кошиків" },
      ],
    },
    corvex: {
      description: "Корпоративний сайт для tech-компанії, який чітко пояснює послугу та приносить заявки.",
      result: "+45% заявок",
      problem: "Старий сайт був незрозумілим, не викликав довіри та не передавав цінність послуги.",
      solution: "Ми побудували новий контент-потік, сильну візуальну ієрархію та точки контакту в ключових місцях.",
      work: ["Інформаційна архітектура", "UX/UI дизайн сайту", "Frontend-розробка", "SEO-база та аналітика заявок"],
      results: [
        { value: "+45%", label: "заявок" },
        { value: "<2s", label: "завантаження сторінки" },
        { value: "+32%", label: "час на сайті" },
      ],
    },
    tinesort: {
      description: "UI продукту й онбординг для B2B-платформи, якій потрібна була швидша активація користувачів.",
      result: "+40% утримання",
      problem: "Нові користувачі губилися у продукті, активація після реєстрації була занадто низькою.",
      solution: "Ми спроєктували зрозумілий дашборд, кроки онбордингу та UI-систему для зростання продукту.",
      work: ["Продуктове UX-дослідження", "SaaS-дашборд", "Онбординг", "Дизайн-система"],
      results: [
        { value: "+40%", label: "утримання" },
        { value: "−30%", label: "відтік" },
        { value: "+50%", label: "активація" },
      ],
    },
    patecura: {
      description: "Повна айдентика для преміального wellness-бренду — логотип, кольори, типографіка та бренд-бук.",
      result: "Повна айдентика",
      problem: "Бренд виглядав непослідовно і погано впізнавався у цифровій комунікації.",
      solution: "Ми створили єдину візуальну систему з чіткими правилами для вебу, друку та соцмереж.",
      work: ["Стратегія бренду", "Система логотипа", "Палітра та типографіка", "Бренд-бук"],
      results: [
        { value: "100%", label: "узгодженість" },
        { value: "+ довіра", label: "при першому контакті" },
        { value: "ready", label: "для вебу та друку" },
      ],
    },
    "lumen-studio": {
      description: "Презентаційний сайт архітектурного бюро з акцентом на портфоліо, довіру та заявки.",
      result: "+95% заявок",
      problem: "У студії були сильні проєкти, але сайт не виглядав преміально і не вів до консультації.",
      solution: "Ми спроєктували візуальну систему портфоліо, зрозумілі послуги та контактні CTA за типом проєкту.",
      work: ["UX-структура портфоліо", "Преміальний веб-дизайн", "Швидкий frontend", "SEO для локальних послуг"],
      results: [
        { value: "+95%", label: "заявок" },
        { value: "+52%", label: "перегляди проєктів" },
        { value: "<2s", label: "швидкість" },
      ],
    },
    "verda-market": {
      description: "Еко-магазин, оптимізований під мобільні покупки, повторні замовлення та швидкий checkout.",
      result: "+60% виторгу",
      problem: "Мобільні покупці не доходили до оплати, фільтрація асортименту була незручною.",
      solution: "Ми спростили каталог, фільтри, картки та checkout з акцентом на повторні покупки.",
      work: ["Мобільний UX магазину", "Сітка товарів", "Фільтри та пошук", "Аналітика замовлень"],
      results: [
        { value: "+60%", label: "виторг" },
        { value: "+34%", label: "мобільна конверсія" },
        { value: "−28%", label: "покинуті кошики" },
      ],
    },
    northwind: {
      description: "Ребрендинг логістичної компанії, який об'єднав візуальний стиль на сайті, у продажах та презентаціях.",
      result: "Повний ребрендинг",
      problem: "Компанія зростала, але візуальна комунікація виглядала розрізнено й не відповідала масштабу бізнесу.",
      solution: "Ми створили сучасну айдентику, систему логотипа та чіткі правила для комерційних матеріалів і сайту.",
      work: ["Аудит бренду", "Логотип і символ", "Візуальна система", "Комерційні презентації"],
      results: [
        { value: "1 система", label: "для всіх каналів" },
        { value: "+ довіра", label: "у B2B-клієнтів" },
        { value: "30+", label: "brand-активів" },
      ],
    },
    "pulse-crm": {
      description: "Дашборд та онбординг для CRM-продукту, якому потрібна була швидша активація команд.",
      result: "+50% активації",
      problem: "Після реєстрації користувачі не бачили чіткого наступного кроку, команди впроваджували продукт надто повільно.",
      solution: "Ми спроєктували новий дашборд, чек-лист онбордингу та метрики, які ведуть до першої цінності.",
      work: ["UX-аудит застосунку", "UI дашборда", "Чек-лист онбордингу", "Дизайн компонентів"],
      results: [
        { value: "+50%", label: "активація" },
        { value: "−35%", label: "час до першої цінності" },
        { value: "+22%", label: "командне впровадження" },
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
