import type { Lang } from "@/lib/i18n";

export type Discipline = {
  id: string;
  index: string;
  label: string;
  note: string;
  to: "/services/web" | "/services/eshop" | "/services/design" | "/services/branding" | "/projects";
};

type CinematicCopy = {
  kicker: string;
  headline1: string;
  headline2: string;
  scroll: string;
  openHint: string;
  insideLabel: string;
  disciplinesEyebrow: string;
  disciplinesTitle: string;
  proofEyebrow: string;
  workEyebrow: string;
  workTitle: string;
  workAll: string;
  caseLabel: string;
  ctaTitle: string;
  ctaSub: string;
  ctaAction: string;
  disciplines: Discipline[];
};

const DISCIPLINE_IDS = ["web", "commerce", "apps", "product", "brand"] as const;
const DISCIPLINE_TO: Discipline["to"][] = [
  "/services/web",
  "/services/eshop",
  "/services/design",
  "/services/design",
  "/services/branding",
];

const build = (
  items: { label: string; note: string }[],
  rest: Omit<CinematicCopy, "disciplines">,
): CinematicCopy => ({
  ...rest,
  disciplines: items.map((it, i) => ({
    id: DISCIPLINE_IDS[i],
    index: `0${i + 1}`,
    label: it.label,
    note: it.note,
    to: DISCIPLINE_TO[i],
  })),
});

export const CINEMATIC: Record<Lang, CinematicCopy> = {
  CZ: build(
    [
      { label: "Web", note: "Firemní weby, které prodávají." },
      { label: "E-commerce", note: "E-shopy postavené na konverzi." },
      { label: "Aplikace", note: "Rozhraní pro reálné procesy." },
      { label: "Digitální produkt", note: "Dashboardy a systémy." },
      { label: "Branding", note: "Identita, která zůstane." },
    ],
    {
      kicker: "Digital studio · Praha",
      headline1: "Tvoříme digitální produkty,",
      headline2: "které posouvají byznys.",
      scroll: "Scroll",
      openHint: "Otevřete studio",
      insideLabel: "Elevate — uvnitř produktu",
      disciplinesEyebrow: "Disciplíny",
      disciplinesTitle: "Co u nás vzniká",
      proofEyebrow: "Důkazy",
      workEyebrow: "Vybrané projekty",
      workTitle: "Reálné projekty, reálné výsledky",
      workAll: "Zobrazit všechny projekty",
      caseLabel: "Case study",
      ctaTitle: "Připraveni posunout byznys?",
      ctaSub: "Napište nám a do 24 hodin dostanete první návrh postupu.",
      ctaAction: "Začít projekt",
    },
  ),
  EN: build(
    [
      { label: "Web", note: "Business sites that sell." },
      { label: "E-commerce", note: "Stores built to convert." },
      { label: "Applications", note: "Interfaces for real processes." },
      { label: "Digital product", note: "Dashboards and systems." },
      { label: "Branding", note: "Identity that lasts." },
    ],
    {
      kicker: "Digital studio · Prague",
      headline1: "We build digital products",
      headline2: "that move business forward.",
      scroll: "Scroll",
      openHint: "Open the studio",
      insideLabel: "Elevate — inside the product",
      disciplinesEyebrow: "Disciplines",
      disciplinesTitle: "What we build",
      proofEyebrow: "Proof",
      workEyebrow: "Selected projects",
      workTitle: "Real projects, real results",
      workAll: "View all projects",
      caseLabel: "Case study",
      ctaTitle: "Ready to move your business forward?",
      ctaSub: "Write to us and get a first plan within 24 hours.",
      ctaAction: "Start a project",
    },
  ),
  RU: build(
    [
      { label: "Сайты", note: "Сайты, которые продают." },
      { label: "E-commerce", note: "Магазины с фокусом на конверсию." },
      { label: "Приложения", note: "Интерфейсы для реальных процессов." },
      { label: "Digital-продукт", note: "Дашборды и системы." },
      { label: "Брендинг", note: "Идентичность, которая остаётся." },
    ],
    {
      kicker: "Digital studio · Прага",
      headline1: "Создаём digital-продукты,",
      headline2: "которые двигают бизнес вперёд.",
      scroll: "Скролл",
      openHint: "Открыть студию",
      insideLabel: "Elevate — внутри продукта",
      disciplinesEyebrow: "Дисциплины",
      disciplinesTitle: "Что мы делаем",
      proofEyebrow: "Доказательства",
      workEyebrow: "Избранные проекты",
      workTitle: "Реальные проекты, реальные результаты",
      workAll: "Все проекты",
      caseLabel: "Кейс",
      ctaTitle: "Готовы двигать бизнес вперёд?",
      ctaSub: "Напишите нам — первый план получите в течение 24 часов.",
      ctaAction: "Начать проект",
    },
  ),
  UA: build(
    [
      { label: "Сайти", note: "Сайти, які продають." },
      { label: "E-commerce", note: "Магазини з фокусом на конверсію." },
      { label: "Застосунки", note: "Інтерфейси для реальних процесів." },
      { label: "Digital-продукт", note: "Дашборди та системи." },
      { label: "Брендинг", note: "Ідентичність, яка залишається." },
    ],
    {
      kicker: "Digital studio · Прага",
      headline1: "Створюємо digital-продукти,",
      headline2: "які рухають бізнес уперед.",
      scroll: "Скрол",
      openHint: "Відкрити студію",
      insideLabel: "Elevate — усередині продукту",
      disciplinesEyebrow: "Дисципліни",
      disciplinesTitle: "Що ми робимо",
      proofEyebrow: "Докази",
      workEyebrow: "Вибрані проєкти",
      workTitle: "Реальні проєкти, реальні результати",
      workAll: "Усі проєкти",
      caseLabel: "Кейс",
      ctaTitle: "Готові рухати бізнес уперед?",
      ctaSub: "Напишіть нам — перший план отримаєте протягом 24 годин.",
      ctaAction: "Почати проєкт",
    },
  ),
};
