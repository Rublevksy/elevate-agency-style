import { createContext, useContext } from "react";

export type Lang = "CZ" | "EN" | "RU" | "UA";

// Service slugs are stable across languages
export type ServiceSlug = "web" | "eshop" | "branding" | "design";
export const SERVICE_SLUGS: ServiceSlug[] = ["web", "eshop", "branding", "design"];

type ServiceDetail = {
  slug: ServiceSlug;
  title: string;
  intro: string;
  headline: string;
  problem: string;
  audience: string[];
  results: { n: string; l: string }[];
  process: string[];
  benefits: string[];
  examples: string[];
  pricing: string;
};

type FaqItem = { q: string; a: string };

type SalesContent = {
  headline: string;
  problem: string;
  audience: string[];
  results: { n: string; l: string }[];
};

const buildServiceDetails = (
  raw: { title: string; desc: string }[],
  process: string[],
  benefits: Record<ServiceSlug, string[]>,
  examples: Record<ServiceSlug, string[]>,
  pricing: Record<ServiceSlug, string>,
  sales: Record<ServiceSlug, SalesContent>,
): ServiceDetail[] =>
  SERVICE_SLUGS.map((slug, i) => ({
    slug,
    title: raw[i].title,
    intro: raw[i].desc,
    headline: sales[slug].headline,
    problem: sales[slug].problem,
    audience: sales[slug].audience,
    results: sales[slug].results,
    process,
    benefits: benefits[slug],
    examples: examples[slug],
    pricing: pricing[slug],
  }));

export const translations = {
  CZ: {
    nav: { home: "Domů", services: "Služby", work: "Projekty", pricing: "Ceník", about: "O nás", contact: "Kontakt" },
    hero: {
      tag: "Digitální agentura",
      title1: "Tvoříme weby,",
      title2: "které vydělávají.",
      subtitle: "Pomáháme firmám růst online.",
      cta1: "Získat nabídku",
      cta2: "Naše práce",
    },
    trust: { years: "4+ let zkušeností", projects: "50+ projektů", clients: "Klienti v EU" },
    about: {
      eyebrow: "O nás",
      title: "Digitální agentura zaměřená na výkon.",
      body: "Nevytváříme jen design — stavíme řešení, která přinášejí měřitelné výsledky. Spojujeme strategii, design a technologii do jednoho celku, který pracuje pro vaše podnikání.",
    },
    results: {
      eyebrow: "Čísla",
      title: "Výsledky, které mluví za nás",
      items: [
        { n: "50+", l: "Dokončených projektů" },
        { n: "4+", l: "Roky zkušeností" },
        { n: "100%", l: "Spokojených klientů" },
        { n: "12", l: "Zemí v EU" },
      ],
    },
    guarantee: {
      eyebrow: "Záruky",
      title: "Co od nás můžete čekat",
      items: [
        { t: "Odpověď do 24 hodin", d: "Nikdy nezůstanete bez odpovědi déle než jeden pracovní den." },
        { t: "Individuální přístup", d: "Žádné šablony. Každý projekt řešíme od nuly." },
        { t: "Řešení na míru", d: "Stavíme přesně to, co váš byznys potřebuje." },
      ],
    },
    services: {
      title: "Služby",
      subtitle: "Co pro vás můžeme udělat",
      learnMore: "Detail služby",
      items: [
        { title: "Webové stránky", desc: "Moderní a rychlé weby na míru" },
        { title: "E-shopy", desc: "Prodejní řešení, která vydělávají" },
        { title: "Branding & logo", desc: "Silná vizuální identita" },
        { title: "Grafika & design", desc: "Digitální i tiskové materiály" },
      ],
      detailLabels: {
        process: "Proces",
        benefits: "Co získáte",
        examples: "Ukázky",
        pricing: "Cena",
        cta: "Získat nabídku",
        back: "Všechny služby",
        problem: "Problém, který řešíme",
        audience: "Pro koho je to",
        results: "Co můžete čekat",
        reply: "Odpovíme do 24 hodin",
        free: "Nezávazná konzultace zdarma",
        individual: "Individuální přístup",
        exclusivity: "Pracujeme jen s omezeným počtem klientů.",
        startingAt: "Od",
      },
    },
    why: {
      title: "Proč my",
      items: [
        { t: "Individuální přístup", d: "Každý projekt je jedinečný." },
        { t: "Rychlá komunikace", d: "Vždy víte, na čem jsme." },
        { t: "Moderní technologie", d: "Pracujeme s nejlepšími nástroji." },
        { t: "Zaměření na výsledky", d: "Měřitelný dopad na vaše podnikání." },
      ],
    },
    process: {
      title: "Proces",
      steps: ["Konzultace", "Návrh řešení", "Vývoj", "Spuštění"],
    },
    portfolio: {
      title: "Portfolio",
      subtitle: "Vybrané projekty",
      view: "Zobrazit projekt",
      items: [
        { name: "Nordic Store", tag: "E-shop", result: "+120% konverze" },
        { name: "Corvex", tag: "Web", result: "Nový brand launch" },
        { name: "Tinesort", tag: "SaaS", result: "+40% retence uživatelů" },
        { name: "Patecura", tag: "Branding", result: "Kompletní identita" },
      ],
    },
    pricing: {
      title: "Ceník",
      subtitle: "Transparentní ceny",
      from: "od",
      custom: "na míru",
      cta: "Získat nabídku",
      plans: [
        { name: "START", price: "10 000 Kč", features: ["Jednostránkový web", "Responzivní design", "Základní SEO"] },
        { name: "BUSINESS", price: "25 000 Kč", features: ["Vícestránkový web", "CMS", "Pokročilé SEO", "Analytika"] },
        { name: "PRO", price: "", features: ["E-shop / komplexní řešení", "Integrace", "Dlouhodobá podpora"] },
      ],
    },
    testimonials: {
      title: "Reference",
      items: [
        { q: "Profesionální přístup a rychlá komunikace.", a: "Jan Novák", r: "CEO, TechCo" },
        { q: "Web nám přinesl nové klienty.", a: "Petra Svobodová", r: "Majitelka, Studio K" },
        { q: "Skvělý tým, doporučuji každému.", a: "Martin Dvořák", r: "Marketing, BrandX" },
      ],
    },
    cta: {
      title: "Máš projekt?",
      subtitle: "Pojďme ho posunout na další úroveň.",
      btn: "Nezávazná konzultace",
    },
    faq: {
      eyebrow: "FAQ",
      title: "Časté dotazy",
      items: [
        { q: "Kolik stojí web?", a: "Ceny začínají od 10 000 Kč za jednoduchý web. Komplexní řešení tvoříme na míru po konzultaci." },
        { q: "Jak dlouho trvá vývoj?", a: "Standardní web 2–4 týdny, e-shop 4–8 týdnů. Termín vždy potvrdíme předem." },
        { q: "Co od vás potřebuji dodat?", a: "Stačí představa o cílech a obsahu. Vše ostatní (texty, fotky, strategii) zvládneme společně." },
        { q: "Pracujete i po spuštění?", a: "Ano, nabízíme dlouhodobou podporu, údržbu a růstové úpravy." },
      ] as FaqItem[],
    },
    contact: {
      title: "Kontakt",
      subtitle: "Napište nám",
      name: "Jméno",
      email: "Email",
      phone: "Telefon (volitelné)",
      service: "Typ služby",
      budget: "Rozpočet",
      message: "Zpráva",
      submit: "Odeslat poptávku",
      services: ["Web", "E-shop", "Logo", "Design"],
      budgets: ["do 20k", "20–50k", "50k+"],
      success: "Děkujeme, brzy se ozveme.",
    },
    footer: { nav: "Navigace", contact: "Kontakt", follow: "Sledujte nás", rights: "Všechna práva vyhrazena." },
  },
  EN: {
    nav: { home: "Home", services: "Services", work: "Projects", pricing: "Pricing", about: "About", contact: "Contact" },
    hero: {
      tag: "Digital agency",
      title1: "We build websites",
      title2: "that earn.",
      subtitle: "Helping businesses grow online.",
      cta1: "Get a quote",
      cta2: "Our work",
    },
    trust: { years: "4+ years of experience", projects: "50+ projects", clients: "EU clients" },
    about: {
      eyebrow: "About",
      title: "A digital agency focused on performance.",
      body: "We don't just design — we build solutions that deliver measurable results. Strategy, design and technology combined into one system that works for your business.",
    },
    results: {
      eyebrow: "Numbers",
      title: "Results that speak for us",
      items: [
        { n: "50+", l: "Projects delivered" },
        { n: "4+", l: "Years of experience" },
        { n: "100%", l: "Client satisfaction" },
        { n: "12", l: "Countries in EU" },
      ],
    },
    guarantee: {
      eyebrow: "Guarantees",
      title: "What you can expect",
      items: [
        { t: "Reply within 24 hours", d: "You'll never wait more than one business day." },
        { t: "Individual approach", d: "No templates. Every project starts from scratch." },
        { t: "Tailored solutions", d: "We build exactly what your business needs." },
      ],
    },
    services: {
      title: "Services",
      subtitle: "What we can do for you",
      learnMore: "Service details",
      items: [
        { title: "Websites", desc: "Modern, fast, custom-built sites" },
        { title: "E-commerce", desc: "Sales solutions that perform" },
        { title: "Branding & logo", desc: "Strong visual identity" },
        { title: "Graphics & design", desc: "Digital and print materials" },
      ],
      detailLabels: {
        process: "Process",
        benefits: "Benefits",
        examples: "Examples",
        pricing: "Pricing",
        cta: "Get a quote",
        back: "All services",
        problem: "The problem we solve",
        audience: "Who it's for",
        results: "What you can expect",
        reply: "We reply within 24 hours",
        free: "Free, no-obligation consultation",
        individual: "Individual approach",
        exclusivity: "We only work with a limited number of clients.",
        startingAt: "From",
      },
    },
    why: {
      title: "Why us",
      items: [
        { t: "Individual approach", d: "Every project is unique." },
        { t: "Fast communication", d: "You always know where we stand." },
        { t: "Modern technology", d: "We use the best tools." },
        { t: "Focused on results", d: "Measurable impact on your business." },
      ],
    },
    process: { title: "Process", steps: ["Consultation", "Proposal", "Development", "Launch"] },
    portfolio: {
      title: "Portfolio", subtitle: "Selected projects", view: "View project",
      items: [
        { name: "Nordic Store", tag: "E-commerce", result: "+120% conversion" },
        { name: "Corvex", tag: "Web", result: "New brand launch" },
        { name: "Tinesort", tag: "SaaS", result: "+40% user retention" },
        { name: "Patecura", tag: "Branding", result: "Full identity" },
      ],
    },
    pricing: {
      title: "Pricing", subtitle: "Transparent prices", from: "from", custom: "custom", cta: "Get a quote",
      plans: [
        { name: "START", price: "10 000 CZK", features: ["One-page website", "Responsive design", "Basic SEO"] },
        { name: "BUSINESS", price: "25 000 CZK", features: ["Multi-page website", "CMS", "Advanced SEO", "Analytics"] },
        { name: "PRO", price: "", features: ["E-commerce / complex", "Integrations", "Long-term support"] },
      ],
    },
    testimonials: {
      title: "Testimonials",
      items: [
        { q: "Professional approach and fast communication.", a: "Jan Novák", r: "CEO, TechCo" },
        { q: "The website brought us new clients.", a: "Petra Svobodová", r: "Owner, Studio K" },
        { q: "Great team, highly recommended.", a: "Martin Dvořák", r: "Marketing, BrandX" },
      ],
    },
    cta: { title: "Got a project?", subtitle: "Let's take it to the next level.", btn: "Free consultation" },
    faq: {
      eyebrow: "FAQ",
      title: "Frequently asked questions",
      items: [
        { q: "How much does a website cost?", a: "Prices start at 10 000 CZK for a simple website. Complex projects are quoted after a consultation." },
        { q: "How long does development take?", a: "A standard website takes 2–4 weeks, an e-shop 4–8 weeks. Timeline is always confirmed up front." },
        { q: "What do you need from us?", a: "Just an idea of your goals and content. We'll handle copy, photography and strategy together." },
        { q: "Do you support the site after launch?", a: "Yes, we offer long-term support, maintenance and growth iterations." },
      ] as FaqItem[],
    },
    contact: {
      title: "Contact", subtitle: "Get in touch",
      name: "Name", email: "Email", phone: "Phone (optional)",
      service: "Service type", budget: "Budget", message: "Message",
      submit: "Send inquiry",
      services: ["Web", "E-shop", "Logo", "Design"],
      budgets: ["up to 20k", "20–50k", "50k+"],
      success: "Thank you, we'll be in touch soon.",
    },
    footer: { nav: "Navigation", contact: "Contact", follow: "Follow us", rights: "All rights reserved." },
  },
  RU: {
    nav: { home: "Главная", services: "Услуги", work: "Проекты", pricing: "Цены", about: "О нас", contact: "Контакты" },
    hero: {
      tag: "Цифровое агентство",
      title1: "Создаём сайты,",
      title2: "которые приносят прибыль.",
      subtitle: "Помогаем бизнесу расти онлайн.",
      cta1: "Получить предложение",
      cta2: "Наши работы",
    },
    trust: { years: "4+ года опыта", projects: "50+ проектов", clients: "Клиенты в ЕС" },
    about: {
      eyebrow: "О нас",
      title: "Цифровое агентство, ориентированное на результат.",
      body: "Мы не просто рисуем — мы строим решения, дающие измеримый результат. Стратегия, дизайн и технологии в единой системе для вашего бизнеса.",
    },
    results: {
      eyebrow: "Цифры",
      title: "Результаты говорят за нас",
      items: [
        { n: "50+", l: "Реализованных проектов" },
        { n: "4+", l: "Года опыта" },
        { n: "100%", l: "Довольных клиентов" },
        { n: "12", l: "Стран в ЕС" },
      ],
    },
    guarantee: {
      eyebrow: "Гарантии",
      title: "Что вы получите",
      items: [
        { t: "Ответ в течение 24 часов", d: "Вы не будете ждать дольше одного рабочего дня." },
        { t: "Индивидуальный подход", d: "Без шаблонов. Каждый проект — с нуля." },
        { t: "Решения под задачу", d: "Делаем ровно то, что нужно вашему бизнесу." },
      ],
    },
    services: {
      title: "Услуги", subtitle: "Что мы можем сделать для вас",
      learnMore: "Подробнее",
      items: [
        { title: "Веб-сайты", desc: "Современные и быстрые сайты под ключ" },
        { title: "Интернет-магазины", desc: "Решения, которые продают" },
        { title: "Брендинг и логотип", desc: "Сильная визуальная идентичность" },
        { title: "Графика и дизайн", desc: "Цифровые и печатные материалы" },
      ],
      detailLabels: {
        process: "Процесс",
        benefits: "Что вы получите",
        examples: "Примеры",
        pricing: "Цена",
        cta: "Получить предложение",
        back: "Все услуги",
        problem: "Какую проблему решаем",
        audience: "Для кого это",
        results: "Чего ожидать",
        reply: "Ответим в течение 24 часов",
        free: "Бесплатная консультация",
        individual: "Индивидуальный подход",
        exclusivity: "Работаем с ограниченным числом клиентов.",
        startingAt: "От",
      },
    },
    why: {
      title: "Почему мы",
      items: [
        { t: "Индивидуальный подход", d: "Каждый проект уникален." },
        { t: "Быстрая коммуникация", d: "Вы всегда в курсе." },
        { t: "Современные технологии", d: "Лучшие инструменты." },
        { t: "Фокус на результат", d: "Измеримый эффект для бизнеса." },
      ],
    },
    process: { title: "Процесс", steps: ["Консультация", "Решение", "Разработка", "Запуск"] },
    portfolio: {
      title: "Портфолио", subtitle: "Избранные проекты", view: "Смотреть проект",
      items: [
        { name: "Nordic Store", tag: "E-commerce", result: "+120% конверсии" },
        { name: "Corvex", tag: "Web", result: "Запуск нового бренда" },
        { name: "Tinesort", tag: "SaaS", result: "+40% удержания" },
        { name: "Patecura", tag: "Брендинг", result: "Полная айдентика" },
      ],
    },
    pricing: {
      title: "Цены", subtitle: "Прозрачные цены", from: "от", custom: "по запросу", cta: "Получить предложение",
      plans: [
        { name: "START", price: "10 000 CZK", features: ["Одностраничный сайт", "Адаптивный дизайн", "Базовое SEO"] },
        { name: "BUSINESS", price: "25 000 CZK", features: ["Многостраничный сайт", "CMS", "Расширенное SEO", "Аналитика"] },
        { name: "PRO", price: "", features: ["Магазин / сложные решения", "Интеграции", "Долгосрочная поддержка"] },
      ],
    },
    testimonials: {
      title: "Отзывы",
      items: [
        { q: "Профессиональный подход и быстрая коммуникация.", a: "Ян Новак", r: "CEO, TechCo" },
        { q: "Сайт принёс нам новых клиентов.", a: "Петра Свободова", r: "Владелец, Studio K" },
        { q: "Отличная команда, рекомендую.", a: "Мартин Дворжак", r: "Маркетинг, BrandX" },
      ],
    },
    cta: { title: "Есть проект?", subtitle: "Поднимем его на новый уровень.", btn: "Бесплатная консультация" },
    faq: {
      eyebrow: "FAQ",
      title: "Частые вопросы",
      items: [
        { q: "Сколько стоит сайт?", a: "Цены начинаются от 10 000 CZK за простой сайт. Сложные проекты — после консультации." },
        { q: "Сколько занимает разработка?", a: "Стандартный сайт 2–4 недели, магазин 4–8 недель. Сроки подтверждаем заранее." },
        { q: "Что нужно от вас?", a: "Понимание целей и контента. Тексты, фото и стратегию проработаем вместе." },
        { q: "Поддерживаете сайт после запуска?", a: "Да, предлагаем долгосрочную поддержку и развитие." },
      ] as FaqItem[],
    },
    contact: {
      title: "Контакты", subtitle: "Свяжитесь с нами",
      name: "Имя", email: "Email", phone: "Телефон (необязательно)",
      service: "Тип услуги", budget: "Бюджет", message: "Сообщение",
      submit: "Отправить запрос",
      services: ["Веб", "Магазин", "Логотип", "Дизайн"],
      budgets: ["до 20k", "20–50k", "50k+"],
      success: "Спасибо, мы скоро свяжемся.",
    },
    footer: { nav: "Навигация", contact: "Контакты", follow: "Соцсети", rights: "Все права защищены." },
  },
  UA: {
    nav: { home: "Головна", services: "Послуги", work: "Проєкти", pricing: "Ціни", about: "Про нас", contact: "Контакти" },
    hero: {
      tag: "Цифрова агенція",
      title1: "Створюємо сайти,",
      title2: "що приносять прибуток.",
      subtitle: "Допомагаємо бізнесу рости онлайн.",
      cta1: "Отримати пропозицію",
      cta2: "Наші роботи",
    },
    trust: { years: "4+ роки досвіду", projects: "50+ проєктів", clients: "Клієнти в ЄС" },
    about: {
      eyebrow: "Про нас",
      title: "Цифрова агенція, орієнтована на результат.",
      body: "Ми не просто малюємо — ми будуємо рішення, що дають вимірний результат. Стратегія, дизайн і технології в єдиній системі для вашого бізнесу.",
    },
    results: {
      eyebrow: "Цифри",
      title: "Результати говорять за нас",
      items: [
        { n: "50+", l: "Реалізованих проєктів" },
        { n: "4+", l: "Роки досвіду" },
        { n: "100%", l: "Задоволених клієнтів" },
        { n: "12", l: "Країн у ЄС" },
      ],
    },
    guarantee: {
      eyebrow: "Гарантії",
      title: "Що ви отримаєте",
      items: [
        { t: "Відповідь протягом 24 годин", d: "Ви не чекатимете довше за один робочий день." },
        { t: "Індивідуальний підхід", d: "Без шаблонів. Кожен проєкт — з нуля." },
        { t: "Рішення під задачу", d: "Робимо саме те, що потрібно вашому бізнесу." },
      ],
    },
    services: {
      title: "Послуги", subtitle: "Що ми можемо зробити для вас",
      learnMore: "Деталі",
      items: [
        { title: "Веб-сайти", desc: "Сучасні та швидкі сайти під ключ" },
        { title: "Інтернет-магазини", desc: "Рішення, які продають" },
        { title: "Брендинг і логотип", desc: "Сильна візуальна ідентичність" },
        { title: "Графіка і дизайн", desc: "Цифрові та друковані матеріали" },
      ],
      detailLabels: {
        process: "Процес",
        benefits: "Переваги",
        examples: "Приклади",
        pricing: "Ціна",
        cta: "Отримати пропозицію",
        back: "Усі послуги",
        problem: "Яку проблему вирішуємо",
        audience: "Для кого це",
        results: "На що очікувати",
        reply: "Відповімо протягом 24 годин",
        free: "Безкоштовна консультація",
        individual: "Індивідуальний підхід",
        exclusivity: "Працюємо з обмеженою кількістю клієнтів.",
        startingAt: "Від",
      },
    },
    why: {
      title: "Чому ми",
      items: [
        { t: "Індивідуальний підхід", d: "Кожен проєкт унікальний." },
        { t: "Швидка комунікація", d: "Ви завжди в курсі." },
        { t: "Сучасні технології", d: "Найкращі інструменти." },
        { t: "Фокус на результат", d: "Вимірний вплив на бізнес." },
      ],
    },
    process: { title: "Процес", steps: ["Консультація", "Рішення", "Розробка", "Запуск"] },
    portfolio: {
      title: "Портфоліо", subtitle: "Вибрані проєкти", view: "Дивитись проєкт",
      items: [
        { name: "Nordic Store", tag: "E-commerce", result: "+120% конверсії" },
        { name: "Corvex", tag: "Web", result: "Запуск нового бренду" },
        { name: "Tinesort", tag: "SaaS", result: "+40% утримання" },
        { name: "Patecura", tag: "Брендинг", result: "Повна айдентика" },
      ],
    },
    pricing: {
      title: "Ціни", subtitle: "Прозорі ціни", from: "від", custom: "за запитом", cta: "Отримати пропозицію",
      plans: [
        { name: "START", price: "10 000 CZK", features: ["Односторінковий сайт", "Адаптивний дизайн", "Базове SEO"] },
        { name: "BUSINESS", price: "25 000 CZK", features: ["Багатосторінковий сайт", "CMS", "Розширене SEO", "Аналітика"] },
        { name: "PRO", price: "", features: ["Магазин / складні рішення", "Інтеграції", "Довгострокова підтримка"] },
      ],
    },
    testimonials: {
      title: "Відгуки",
      items: [
        { q: "Професійний підхід і швидка комунікація.", a: "Ян Новак", r: "CEO, TechCo" },
        { q: "Сайт приніс нам нових клієнтів.", a: "Петра Свободова", r: "Власниця, Studio K" },
        { q: "Чудова команда, рекомендую.", a: "Мартін Дворжак", r: "Маркетинг, BrandX" },
      ],
    },
    cta: { title: "Маєш проєкт?", subtitle: "Виведемо його на новий рівень.", btn: "Безкоштовна консультація" },
    faq: {
      eyebrow: "FAQ",
      title: "Часті питання",
      items: [
        { q: "Скільки коштує сайт?", a: "Ціни починаються від 10 000 CZK за простий сайт. Складні — після консультації." },
        { q: "Скільки триває розробка?", a: "Стандартний сайт 2–4 тижні, магазин 4–8 тижнів. Терміни підтверджуємо заздалегідь." },
        { q: "Що потрібно від вас?", a: "Розуміння цілей і контенту. Тексти, фото та стратегію опрацюємо разом." },
        { q: "Підтримуєте сайт після запуску?", a: "Так, пропонуємо довгострокову підтримку і розвиток." },
      ] as FaqItem[],
    },
    contact: {
      title: "Контакти", subtitle: "Напишіть нам",
      name: "Імʼя", email: "Email", phone: "Телефон (необовʼязково)",
      service: "Тип послуги", budget: "Бюджет", message: "Повідомлення",
      submit: "Надіслати запит",
      services: ["Веб", "Магазин", "Логотип", "Дизайн"],
      budgets: ["до 20k", "20–50k", "50k+"],
      success: "Дякуємо, ми скоро звʼяжемось.",
    },
    footer: { nav: "Навігація", contact: "Контакти", follow: "Соцмережі", rights: "Усі права захищені." },
  },
} as const;

export type Dict = typeof translations["EN"];

// Service detail content keyed per language
const SERVICE_DETAILS_DATA: Record<Lang, ServiceDetail[]> = {
  CZ: buildServiceDetails(
    translations.CZ.services.items as unknown as { title: string; desc: string }[],
    ["Konzultace a strategie", "Wireframe a návrh", "Vývoj a testování", "Spuštění a podpora"],
    {
      web: ["Rychlost a SEO", "Responzivní design", "CMS pro snadnou správu", "Analytika a měření"],
      eshop: ["Vyšší konverze", "Integrace plateb a dopravy", "Správa produktů", "Marketingové nástroje"],
      branding: ["Konzistentní identita", "Brand manuál", "Logo a typografie", "Šablony pro tisk a web"],
      design: ["Premium vizuály", "Konzistence napříč kanály", "Šablony pro sociální sítě", "Tiskové podklady"],
    },
    {
      web: ["Corporate web pro Corvex", "Landing page pro SaaS Tinesort", "Portfolio web pro studio"],
      eshop: ["Nordic Store — fashion", "Patecura — beauty produkty", "Specializovaný B2B e-shop"],
      branding: ["Patecura — full identity", "Corvex — rebrand", "Tinesort — naming a logo"],
      design: ["Sociální kampaně", "Pitch decky pro startupy", "Tiskové brožury"],
    },
    {
      web: "od 10 000 Kč",
      eshop: "od 35 000 Kč",
      branding: "od 15 000 Kč",
      design: "od 5 000 Kč",
    },
    {
      web: {
        headline: "Web, který přivádí klienty — ne jen návštěvy.",
        problem: "Většina firemních webů vypadá hezky, ale neprodává. Pomalé načítání, slabé SEO a nejasná struktura ztrácejí denně potenciální klienty.",
        audience: ["Firmy s ambicí růst online", "Profesionální služby a B2B", "Startupy připravené na škálování"],
        results: [
          { n: "+120%", l: "více poptávek" },
          { n: "<2s", l: "rychlost načítání" },
          { n: "Top 10", l: "pozice v Google" },
        ],
      },
      eshop: {
        headline: "E-shop, který skutečně prodává.",
        problem: "Šablonové e-shopy mají nízkou konverzi a komplikovanou správu. Zákazníci odcházejí v košíku a vy přicházíte o tržby.",
        audience: ["Značky s vlastním produktem", "Rostoucí D2C e-shopy", "Firmy přecházející z marketplace"],
        results: [
          { n: "+85%", l: "konverzní poměr" },
          { n: "-40%", l: "opuštěných košíků" },
          { n: "3×", l: "vyšší AOV" },
        ],
      },
      branding: {
        headline: "Značka, kterou si zákazníci zapamatují.",
        problem: "Bez silné identity splynete s konkurencí. Nekonzistentní vizuál snižuje důvěru a hodnotu vaší značky.",
        audience: ["Nové firmy a rebranding", "Premium značky", "Tvůrci produktů a služeb"],
        results: [
          { n: "+60%", l: "rozpoznatelnost značky" },
          { n: "100%", l: "konzistence napříč kanály" },
          { n: "Premium", l: "vnímání hodnoty" },
        ],
      },
      design: {
        headline: "Design, který prodává a buduje důvěru.",
        problem: "Amatérská grafika kazí dojem i u skvělého produktu. Ztrácíte pozornost dříve, než přečtou první větu.",
        audience: ["Marketingové týmy", "Startupy a SaaS", "Firmy s pravidelnou komunikací"],
        results: [
          { n: "+45%", l: "engagement na sítích" },
          { n: "2×", l: "rychlejší výroba" },
          { n: "100%", l: "brand konzistence" },
        ],
      },
    },
  ),
  EN: buildServiceDetails(
    translations.EN.services.items as unknown as { title: string; desc: string }[],
    ["Consultation & strategy", "Wireframe & design", "Development & QA", "Launch & support"],
    {
      web: ["Speed and SEO", "Responsive design", "CMS for easy editing", "Analytics setup"],
      eshop: ["Higher conversion", "Payments & shipping", "Product management", "Marketing tools"],
      branding: ["Consistent identity", "Brand guidelines", "Logo and typography", "Print and web templates"],
      design: ["Premium visuals", "Cross-channel consistency", "Social templates", "Print-ready files"],
    },
    {
      web: ["Corporate site for Corvex", "Landing page for SaaS Tinesort", "Studio portfolio site"],
      eshop: ["Nordic Store — fashion", "Patecura — beauty products", "Specialised B2B e-shop"],
      branding: ["Patecura — full identity", "Corvex — rebrand", "Tinesort — naming and logo"],
      design: ["Social campaigns", "Startup pitch decks", "Print brochures"],
    },
    {
      web: "from 10 000 CZK",
      eshop: "from 35 000 CZK",
      branding: "from 15 000 CZK",
      design: "from 5 000 CZK",
    },
    {
      web: {
        headline: "A website that brings clients — not just visitors.",
        problem: "Most corporate websites look nice but don't sell. Slow load times, weak SEO and unclear structure quietly lose you leads every day.",
        audience: ["Companies aiming to grow online", "Professional services and B2B", "Startups ready to scale"],
        results: [
          { n: "+120%", l: "more inquiries" },
          { n: "<2s", l: "page load" },
          { n: "Top 10", l: "Google ranking" },
        ],
      },
      eshop: {
        headline: "An e-commerce store that actually sells.",
        problem: "Template e-shops have low conversion and clumsy admin. Customers drop off in checkout — and you lose revenue.",
        audience: ["Brands with their own product", "Growing D2C stores", "Companies leaving marketplaces"],
        results: [
          { n: "+85%", l: "conversion rate" },
          { n: "-40%", l: "cart abandonment" },
          { n: "3×", l: "higher AOV" },
        ],
      },
      branding: {
        headline: "A brand customers remember.",
        problem: "Without a strong identity you blend in. Inconsistent visuals lower trust and perceived value.",
        audience: ["New companies and rebrands", "Premium brands", "Product and service creators"],
        results: [
          { n: "+60%", l: "brand recognition" },
          { n: "100%", l: "channel consistency" },
          { n: "Premium", l: "value perception" },
        ],
      },
      design: {
        headline: "Design that sells and builds trust.",
        problem: "Amateur graphics ruin even a great product. You lose attention before the first sentence is read.",
        audience: ["Marketing teams", "Startups and SaaS", "Companies with regular comms"],
        results: [
          { n: "+45%", l: "social engagement" },
          { n: "2×", l: "faster production" },
          { n: "100%", l: "brand consistency" },
        ],
      },
    },
  ),
  RU: buildServiceDetails(
    translations.RU.services.items as unknown as { title: string; desc: string }[],
    ["Консультация и стратегия", "Прототип и дизайн", "Разработка и тесты", "Запуск и поддержка"],
    {
      web: ["Скорость и SEO", "Адаптивный дизайн", "CMS для редактирования", "Настройка аналитики"],
      eshop: ["Выше конверсия", "Оплата и доставка", "Управление товарами", "Маркетинг-инструменты"],
      branding: ["Единый стиль", "Brand guidelines", "Лого и типографика", "Шаблоны для печати и веба"],
      design: ["Премиум-визуал", "Единство во всех каналах", "Шаблоны для соцсетей", "Файлы для печати"],
    },
    {
      web: ["Сайт Corvex", "Лендинг SaaS Tinesort", "Портфолио студии"],
      eshop: ["Nordic Store — мода", "Patecura — косметика", "B2B-магазин"],
      branding: ["Patecura — айдентика", "Corvex — ребрендинг", "Tinesort — нейминг и лого"],
      design: ["Соц-кампании", "Питч-деки", "Брошюры"],
    },
    {
      web: "от 10 000 CZK",
      eshop: "от 35 000 CZK",
      branding: "от 15 000 CZK",
      design: "от 5 000 CZK",
    },
  ),
  UA: buildServiceDetails(
    translations.UA.services.items as unknown as { title: string; desc: string }[],
    ["Консультація і стратегія", "Прототип і дизайн", "Розробка і тести", "Запуск і підтримка"],
    {
      web: ["Швидкість і SEO", "Адаптивний дизайн", "CMS для редагування", "Налаштування аналітики"],
      eshop: ["Вища конверсія", "Оплата і доставка", "Керування товарами", "Маркетинг-інструменти"],
      branding: ["Єдиний стиль", "Brand guidelines", "Лого і типографіка", "Шаблони для друку і веба"],
      design: ["Преміум-візуал", "Єдність у каналах", "Шаблони для соцмереж", "Файли для друку"],
    },
    {
      web: ["Сайт Corvex", "Лендинг SaaS Tinesort", "Портфоліо студії"],
      eshop: ["Nordic Store — мода", "Patecura — косметика", "B2B-магазин"],
      branding: ["Patecura — айдентика", "Corvex — ребрендинг", "Tinesort — нейминг і лого"],
      design: ["Соц-кампанії", "Пітч-деки", "Брошури"],
    },
    {
      web: "від 10 000 CZK",
      eshop: "від 35 000 CZK",
      branding: "від 15 000 CZK",
      design: "від 5 000 CZK",
    },
  ),
};

export function getServiceDetails(lang: Lang, slug: ServiceSlug): ServiceDetail | undefined {
  return SERVICE_DETAILS_DATA[lang].find((s) => s.slug === slug);
}

export function getAllServiceDetails(lang: Lang): ServiceDetail[] {
  return SERVICE_DETAILS_DATA[lang];
}

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "CZ",
  setLang: () => {},
  t: translations.CZ as unknown as Dict,
});

export const useT = () => useContext(LangContext);
