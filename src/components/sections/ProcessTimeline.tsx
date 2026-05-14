import { Compass, PenLine, Palette, Code2, Rocket } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

type Step = { t: string; d: string };
const STEPS: Record<Lang, Step[]> = {
  CZ: [
    { t: "Strategie", d: "Pochopíme byznys, cíle a cílovou skupinu. Definujeme, co má web reálně přinést." },
    { t: "UX & wireframe", d: "Informační architektura a klikatelný prototyp dřív, než kdokoli kreslí pixely." },
    { t: "Design", d: "Vizuální identita a UI systém zaměřený na důvěru, čitelnost a konverzi." },
    { t: "Vývoj", d: "Rychlý, čistý kód. SEO, výkon a přístupnost jako standard, ne nadstavba." },
    { t: "Launch & optimalizace", d: "Spuštění, měření a iterace podle reálných dat z prvních týdnů." },
  ],
  EN: [
    { t: "Strategy", d: "We learn the business, goals and audience. We define what the site actually needs to deliver." },
    { t: "UX & wireframe", d: "Information architecture and a clickable prototype before anyone draws pixels." },
    { t: "Design", d: "Visual identity and a UI system built for trust, readability and conversion." },
    { t: "Engineering", d: "Fast, clean code. SEO, performance and accessibility as a standard, not an extra." },
    { t: "Launch & optimization", d: "Ship, measure, and iterate based on real data from the first weeks." },
  ],
  RU: [
    { t: "Стратегия", d: "Понимаем бизнес, цели и аудиторию. Определяем, что сайт должен дать на самом деле." },
    { t: "UX и прототип", d: "Информационная архитектура и кликабельный прототип до пикселей." },
    { t: "Дизайн", d: "Визуальная идентичность и UI-система для доверия, читаемости и конверсии." },
    { t: "Разработка", d: "Быстрый и чистый код. SEO, производительность и доступность как стандарт." },
    { t: "Запуск и оптимизация", d: "Запуск, измерения и итерации по данным первых недель." },
  ],
  UA: [
    { t: "Стратегія", d: "Розуміємо бізнес, цілі та аудиторію. Визначаємо, що сайт має реально дати." },
    { t: "UX і прототип", d: "Інформаційна архітектура і клікабельний прототип до пікселів." },
    { t: "Дизайн", d: "Візуальна ідентичність та UI-система для довіри, читабельності й конверсії." },
    { t: "Розробка", d: "Швидкий і чистий код. SEO, продуктивність і доступність як стандарт." },
    { t: "Запуск і оптимізація", d: "Запуск, вимірювання та ітерації за даними перших тижнів." },
  ],
};
const TITLE: Record<Lang, string> = {
  CZ: "Jak postupujeme od nápadu k výsledku",
  EN: "How we move from idea to result",
  RU: "Как мы идём от идеи к результату",
  UA: "Як ми йдемо від ідеї до результату",
};
const EYEBROW: Record<Lang, string> = { CZ: "Proces", EN: "Process", RU: "Процесс", UA: "Процес" };
const ICONS = [Compass, PenLine, Palette, Code2, Rocket];

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

        <div className="relative grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-6">
          <div
            className="hidden md:block absolute top-7 left-[10%] right-[10%] h-px bg-border overflow-hidden"
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
