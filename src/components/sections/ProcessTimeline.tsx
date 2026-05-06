import { Phone, PenLine, Monitor, Rocket } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

type Step = { t: string; d: string };
const STEPS: Record<Lang, Step[]> = {
  CZ: [
    { t: "Konzultace zdarma", d: "15minutový hovor. Pochopíme váš projekt." },
    { t: "Návrh do 48 hodin", d: "Wireframe a struktura ještě před designem." },
    { t: "Design & vývoj", d: "Prémiový design a rychlý frontendový vývoj." },
    { t: "Spuštění + podpora", d: "Nasazení a 30 dní podpory zdarma." },
  ],
  EN: [
    { t: "Free consultation", d: "15-minute call. We understand your project." },
    { t: "Proposal in 48h", d: "Wireframe and structure before design." },
    { t: "Design & dev", d: "Premium design and fast frontend development." },
    { t: "Launch + support", d: "Deployment and 30 days free support." },
  ],
  RU: [
    { t: "Бесплатная консультация", d: "15 минут. Разбираемся в проекте." },
    { t: "Предложение за 48ч", d: "Структура и прототип до дизайна." },
    { t: "Дизайн и разработка", d: "Премиум дизайн и быстрая разработка." },
    { t: "Запуск + поддержка", d: "Запуск и 30 дней поддержки бесплатно." },
  ],
  UA: [
    { t: "Безкоштовна консультація", d: "15 хвилин. Розбираємося в проекті." },
    { t: "Пропозиція за 48г", d: "Структура і прототип до дизайну." },
    { t: "Дизайн і розробка", d: "Преміум дизайн і швидка розробка." },
    { t: "Запуск + підтримка", d: "Запуск і 30 днів підтримки безкоштовно." },
  ],
};
const TITLE: Record<Lang, string> = {
  CZ: "Jak spolupráce vypadá",
  EN: "How we work",
  RU: "Как мы работаем",
  UA: "Як ми працюємо",
};
const EYEBROW: Record<Lang, string> = { CZ: "Proces", EN: "Process", RU: "Процесс", UA: "Процес" };
const ICONS = [Phone, PenLine, Monitor, Rocket];

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

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          <div
            className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px bg-border overflow-hidden"
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
