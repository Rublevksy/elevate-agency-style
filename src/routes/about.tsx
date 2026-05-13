import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, MessageCircle, Award, Users, Clock, Zap, ShieldCheck, TrendingUp, Quote, ArrowRight } from "lucide-react";
import { Guarantee } from "@/components/sections/Guarantee";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Counter } from "@/components/Counter";
import { useT, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "O nás — ELEVATE" },
      { name: "description", content: "Digitální agentura zaměřená na výsledky. Tvoříme weby a digitální řešení, která pomáhají firmám růst." },
      { property: "og:title", content: "O nás — ELEVATE" },
      { property: "og:description", content: "Digitální agentura zaměřená na výsledky." },
      { property: "og:url", content: "https://elevateit.cz/about" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/about" }],
  }),
});

const STATS = [
  { icon: Award, n: 4, suffix: "+", l: { CZ: "let zkušeností", EN: "years of experience", RU: "года опыта", UA: "роки досвіду" } },
  { icon: Users, n: 50, suffix: "+", l: { CZ: "realizovaných projektů", EN: "projects delivered", RU: "реализованных проектов", UA: "реалізованих проєктів" } },
  { icon: Sparkles, n: 12, suffix: "+", l: { CZ: "oborů a odvětví", EN: "industries served", RU: "отраслей", UA: "галузей" } },
] as const;

const VALUES_HEADING: Record<Lang, { eyebrow: string; title: string }> = {
  CZ: { eyebrow: "Naše hodnoty", title: "V čem jsme jiní" },
  EN: { eyebrow: "Our values", title: "What sets us apart" },
  RU: { eyebrow: "Наши ценности", title: "В чём мы отличаемся" },
  UA: { eyebrow: "Наші цінності", title: "Чим ми відрізняємось" },
};

const VALUES: { icon: typeof Sparkles; t: Record<Lang, string>; d: Record<Lang, string> }[] = [
  {
    icon: Sparkles,
    t: { CZ: "Individuální přístup", EN: "Individual approach", RU: "Индивидуальный подход", UA: "Індивідуальний підхід" },
    d: {
      CZ: "Žádné šablony. Každý projekt řešíme od základu podle vašich cílů.",
      EN: "No templates. Every project starts from scratch, built around your goals.",
      RU: "Без шаблонов. Каждый проект — с нуля под ваши цели.",
      UA: "Без шаблонів. Кожен проєкт — з нуля під ваші цілі.",
    },
  },
  {
    icon: Zap,
    t: { CZ: "Rychlá komunikace", EN: "Fast communication", RU: "Быстрая коммуникация", UA: "Швидка комунікація" },
    d: {
      CZ: "Odpovídáme do 24 hodin. Vždy víte, na čem jsme.",
      EN: "We reply within 24 hours. You always know where we stand.",
      RU: "Отвечаем в течение 24 часов. Вы всегда в курсе.",
      UA: "Відповідаємо протягом 24 годин. Ви завжди в курсі.",
    },
  },
  {
    icon: ShieldCheck,
    t: { CZ: "Kvalita kódu i designu", EN: "Quality of code and design", RU: "Качество кода и дизайна", UA: "Якість коду та дизайну" },
    d: {
      CZ: "Stavíme řešení, která vypadají skvěle a technicky fungují dlouhodobě.",
      EN: "We build solutions that look great and stand the test of time technically.",
      RU: "Создаём решения, которые отлично выглядят и работают долго.",
      UA: "Створюємо рішення, які чудово виглядають і працюють довго.",
    },
  },
  {
    icon: TrendingUp,
    t: { CZ: "Měřitelné výsledky", EN: "Measurable results", RU: "Измеримые результаты", UA: "Вимірні результати" },
    d: {
      CZ: "Navrhujeme s ohledem na konverze, ne jen estetiku.",
      EN: "We design for conversions, not just aesthetics.",
      RU: "Проектируем с прицелом на конверсию, а не только эстетику.",
      UA: "Проєктуємо з прицілом на конверсію, не лише естетику.",
    },
  },
];

const TESTIMONIALS_SOON: Record<Lang, { title: string; body: string; cta: string }> = {
  CZ: {
    title: "Reference brzy přibudou",
    body: "Reference brzy přibudou. Zatím nás poznejte přes naše projekty.",
    cta: "Zobrazit projekty",
  },
  EN: {
    title: "Testimonials coming soon",
    body: "Testimonials coming soon. Get to know us through our projects.",
    cta: "View projects",
  },
  RU: {
    title: "Отзывы скоро появятся",
    body: "Отзывы скоро появятся. Пока познакомьтесь с нашими проектами.",
    cta: "Смотреть проекты",
  },
  UA: {
    title: "Відгуки незабаром",
    body: "Відгуки незабаром. Поки що познайомтеся з нашими проектами.",
    cta: "Дивитись проєкти",
  },
};

function AboutPage() {
  const { lang } = useT();
  const vh = VALUES_HEADING[lang];
  const ts = TESTIMONIALS_SOON[lang];

  return (
    <>
      {/* HERO */}
      <section className="page-top pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">O nás</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[1.05] max-w-4xl">
            Jsme digitální agentura zaměřená na výsledky.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Tvoříme webové stránky a digitální řešení, která reálně pomáhají firmám růst — ne jen vypadat dobře.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="pb-20 md:pb-28">
        <div className="container-luxe">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((s) => {
              const Icon = s.icon;
              const label = s.l[lang];
              return (
                <div
                  key={label}
                  className="rounded-2xl border border-border bg-surface p-8 hover:border-primary/40 transition-colors"
                >
                  <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center mb-6">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">
                    <Counter end={s.n} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground uppercase tracking-widest">{label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.ui.aboutApproachEyebrow}</p>
            <div className="h-px w-12 bg-primary" />
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>{t.ui.aboutApproachP1}</p>
            <p>{t.ui.aboutApproachP2}</p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 md:py-28 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{vh.eyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              {vh.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.t.EN}
                  className="rounded-2xl border border-border bg-surface p-8 hover:border-primary/40 transition-colors"
                >
                  <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center mb-6">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{v.t[lang]}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.d[lang]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS — COMING SOON */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-luxe">
          <div className="max-w-2xl mx-auto rounded-2xl border border-border bg-surface/40 p-12 md:p-16 text-center">
            <Quote className="h-8 w-8 text-primary mx-auto mb-6" strokeWidth={1.4} />
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 tracking-tight">
              {ts.title}
            </h2>
            <p className="text-base text-muted-foreground leading-relaxed mb-8 max-w-md mx-auto">
              {ts.body}
            </p>
            <Link to="/projects" className="btn-primary inline-flex group">
              {ts.cta}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* EXCLUSIVITY / TRUST */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-luxe">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-transparent p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Limitovaná spolupráce</p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
                Pracujeme pouze s omezeným počtem klientů.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Abychom každému projektu mohli věnovat maximální pozornost, přijímáme jen několik nových
                spoluprací měsíčně.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Odpovíme do 24 hodin
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" /> Nezávazná konzultace zdarma
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Individuální přístup
                </span>
              </div>
              <Link to="/contact" className="btn-primary">
                Domluvit konzultaci
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Guarantee />
      <CtaBanner />
    </>
  );
}
