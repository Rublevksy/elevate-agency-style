import { createContext, useContext } from "react";

export type Lang = "CZ" | "EN" | "RU" | "UA";

export const translations = {
  CZ: {
    nav: { services: "Služby", work: "Práce", pricing: "Ceník", contact: "Kontakt" },
    hero: {
      tag: "Digitální agentura",
      title1: "Tvoříme weby,",
      title2: "které vydělávají.",
      subtitle: "Pomáháme firmám růst online.",
      cta1: "Získat nabídku",
      cta2: "Naše práce",
    },
    trust: { years: "4+ let zkušeností", projects: "50+ projektů", clients: "Klienti v EU" },
    services: {
      title: "Služby",
      subtitle: "Co pro vás můžeme udělat",
      items: [
        { title: "Webové stránky", desc: "Moderní a rychlé weby na míru" },
        { title: "E-shopy", desc: "Prodejní řešení, která vydělávají" },
        { title: "Branding & logo", desc: "Silná vizuální identita" },
        { title: "Grafika & design", desc: "Digitální i tiskové materiály" },
      ],
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
    nav: { services: "Services", work: "Work", pricing: "Pricing", contact: "Contact" },
    hero: {
      tag: "Digital agency",
      title1: "We build websites",
      title2: "that earn.",
      subtitle: "Helping businesses grow online.",
      cta1: "Get a quote",
      cta2: "Our work",
    },
    trust: { years: "4+ years of experience", projects: "50+ projects", clients: "EU clients" },
    services: {
      title: "Services",
      subtitle: "What we can do for you",
      items: [
        { title: "Websites", desc: "Modern, fast, custom-built sites" },
        { title: "E-commerce", desc: "Sales solutions that perform" },
        { title: "Branding & logo", desc: "Strong visual identity" },
        { title: "Graphics & design", desc: "Digital and print materials" },
      ],
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
    portfolio: { title: "Portfolio", subtitle: "Selected projects", view: "View project" },
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
    nav: { services: "Услуги", work: "Работы", pricing: "Цены", contact: "Контакты" },
    hero: {
      tag: "Цифровое агентство",
      title1: "Создаём сайты,",
      title2: "которые приносят прибыль.",
      subtitle: "Помогаем бизнесу расти онлайн.",
      cta1: "Получить предложение",
      cta2: "Наши работы",
    },
    trust: { years: "4+ года опыта", projects: "50+ проектов", clients: "Клиенты в ЕС" },
    services: {
      title: "Услуги", subtitle: "Что мы можем сделать для вас",
      items: [
        { title: "Веб-сайты", desc: "Современные и быстрые сайты под ключ" },
        { title: "Интернет-магазины", desc: "Решения, которые продают" },
        { title: "Брендинг и логотип", desc: "Сильная визуальная идентичность" },
        { title: "Графика и дизайн", desc: "Цифровые и печатные материалы" },
      ],
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
    portfolio: { title: "Портфолио", subtitle: "Избранные проекты", view: "Смотреть проект" },
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
    nav: { services: "Послуги", work: "Роботи", pricing: "Ціни", contact: "Контакти" },
    hero: {
      tag: "Цифрова агенція",
      title1: "Створюємо сайти,",
      title2: "що приносять прибуток.",
      subtitle: "Допомагаємо бізнесу рости онлайн.",
      cta1: "Отримати пропозицію",
      cta2: "Наші роботи",
    },
    trust: { years: "4+ роки досвіду", projects: "50+ проєктів", clients: "Клієнти в ЄС" },
    services: {
      title: "Послуги", subtitle: "Що ми можемо зробити для вас",
      items: [
        { title: "Веб-сайти", desc: "Сучасні та швидкі сайти під ключ" },
        { title: "Інтернет-магазини", desc: "Рішення, які продають" },
        { title: "Брендинг і логотип", desc: "Сильна візуальна ідентичність" },
        { title: "Графіка і дизайн", desc: "Цифрові та друковані матеріали" },
      ],
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
    portfolio: { title: "Портфоліо", subtitle: "Вибрані проєкти", view: "Дивитись проєкт" },
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

export const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({
  lang: "CZ",
  setLang: () => {},
  t: translations.CZ as unknown as Dict,
});

export const useT = () => useContext(LangContext);
