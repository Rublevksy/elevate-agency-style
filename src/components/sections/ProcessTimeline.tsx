import { MessageSquare, Compass, Palette, Code2, Rocket, LifeBuoy } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

type Step = { t: string; d: string };
const STEPS: Record<Lang, Step[]> = {
  CZ: [
    { t: "Konzultace",  d: "Pochopíme byznys, cíle a co má web reálně přinést. Bez závazku, do 48 hodin máte zpětnou vazbu." },
    { t: "Strategie",   d: "Definujeme KPI, cílovou skupinu a obsahovou architekturu. Z čeho budeme růst, kde se bude měřit." },
    { t: "Design",      d: "UX wireframy, vizuální identita a UI systém zaměřený na důvěru, čitelnost a konverzi." },
    { t: "Vývoj",       d: "Rychlý, čistý kód. SEO, výkon a přístupnost jako standard, ne nadstavba." },
    { t: "Spuštění",    d: "Hladký launch včetně migrace, přesměrování a měření. Žádné výpadky, žádné překvapení." },
    { t: "Podpora",     d: "30 dní bezplatné podpory po spuštění + dlouhodobý servis a iterace podle reálných dat." },
  ],
  EN: [
    { t: "Consultation", d: "We learn your business, goals and what the site actually needs to deliver. No commitment, feedback within 48h." },
    { t: "Strategy",     d: "We define KPIs, audience and content architecture. What we grow from and where we measure." },
    { t: "Design",       d: "UX wireframes, visual identity and a UI system built for trust, readability and conversion." },
    { t: "Engineering",  d: "Fast, clean code. SEO, performance and accessibility as a standard, not an extra." },
    { t: "Launch",       d: "Smooth go-live including migration, redirects and analytics. No downtime, no surprises." },
    { t: "Support",      d: "30 days of free support post-launch + long-term maintenance and iteration based on real data." },
  ],
  RU: [
    { t: "Консультация", d: "Понимаем бизнес, цели и что сайт должен дать. Без обязательств, отзыв за 48 часов." },
    { t: "Стратегия",    d: "Определяем KPI, аудиторию и архитектуру контента. Откуда растём и где замеряем." },
    { t: "Дизайн",       d: "UX-вайрфреймы, визуальная идентичность и UI-система для доверия, читаемости и конверсии." },
    { t: "Разработка",   d: "Быстрый, чистый код. SEO, производительность и доступность как стандарт." },
    { t: "Запуск",       d: "Чёткий go-live с миграцией, редиректами и аналитикой. Без даунтайма, без сюрпризов." },
    { t: "Поддержка",    d: "30 дней бесплатной поддержки + долгосрочное сопровождение и итерации по данным." },
  ],
  UA: [
    { t: "Консультація", d: "Розуміємо бізнес, цілі та що сайт має дати. Без зобов'язань, фідбек за 48 годин." },
    { t: "Стратегія",    d: "Визначаємо KPI, аудиторію та архітектуру контенту. Звідки ростемо і де вимірюємо." },
    { t: "Дизайн",       d: "UX-вайрфрейми, візуальна ідентичність і UI-система для довіри, читабельності й конверсії." },
    { t: "Розробка",     d: "Швидкий, чистий код. SEO, продуктивність і доступність як стандарт." },
    { t: "Запуск",       d: "Чіткий go-live з міграцією, редиректами та аналітикою. Без даунтайму, без сюрпризів." },
    { t: "Підтримка",    d: "30 днів безкоштовної підтримки + довгострокове супроводження і ітерації за даними." },
  ],
};
const TITLE: Record<Lang, string> = {
  CZ: "Jak probíhá spolupráce",
  EN: "How we work together",
  RU: "Как идёт сотрудничество",
  UA: "Як проходить співпраця",
};
const EYEBROW: Record<Lang, string> = { CZ: "Proces", EN: "Process", RU: "Процесс", UA: "Процес" };
const ICONS = [MessageSquare, Compass, Palette, Code2, Rocket, LifeBuoy];


export function ProcessTimeline() {
  const { lang } = useT();
  const steps = STEPS[lang];
  return (
    <section className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            {EYEBROW[lang]}
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
            {TITLE[lang]}
          </h2>
        </div>

        <div className="relative grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-10 md:gap-6">
          <div
            className="hidden lg:block absolute top-7 left-[8%] right-[8%] h-px bg-border overflow-hidden"
            aria-hidden
          >
            <div className="h-full w-full bg-gradient-to-r from-primary via-primary to-primary/30 origin-left animate-[timelineGrow_1.4s_ease-out_forwards] scale-x-0" />
          </div>
          {steps.map((s, i) => {
            const Icon = ICONS[i];
            return (
              <div key={i} className="reveal flex flex-col items-start" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="relative z-10 grid place-items-center h-14 w-14 rounded-full border border-primary/30 bg-background text-primary mb-5">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <span className="text-xs font-mono text-primary tracking-widest mb-2">0{i + 1}</span>
                <h3 className="text-base font-bold text-foreground mb-1.5">{s.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
