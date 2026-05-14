import { Target, Layers, MessagesSquare } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

type Pillar = { t: string; d: string };

const EYEBROW: Record<Lang, string> = {
  CZ: "Jak přemýšlíme",
  EN: "How we think",
  RU: "Как мы думаем",
  UA: "Як ми думаємо",
};

const TITLE: Record<Lang, string> = {
  CZ: "Studio, ne template továrna.",
  EN: "A studio, not a template factory.",
  RU: "Студия, а не фабрика шаблонов.",
  UA: "Студія, а не фабрика шаблонів.",
};

const LEAD: Record<Lang, string> = {
  CZ: "Pracujeme jako malý nezávislý tým. Každý projekt vede senior — od první konzultace až po spuštění. Žádní junioři na živých klientech, žádné šablony, žádné kompromisy v UX.",
  EN: "We work as a small independent team. Every project is led by a senior — from the first call to launch. No juniors on live clients, no templates, no UX compromises.",
  RU: "Мы — небольшая независимая команда. Каждый проект ведёт сениор — от первой встречи до запуска. Никаких джунов на боевых клиентах, никаких шаблонов.",
  UA: "Ми — невелика незалежна команда. Кожен проєкт веде сеньйор — від першої зустрічі до запуску. Жодних джунів на живих клієнтах, жодних шаблонів.",
};

const PILLARS: Record<Lang, Pillar[]> = {
  CZ: [
    { t: "Byznys první, pixely druhé", d: "Začínáme otázkou: co má web reálně vydělat? Design je důsledek strategie, ne dekorace." },
    { t: "UX postavené na rozhodnutích", d: "Každý prvek má důvod existovat. Hierarchie, kontrast a flow řešíme dřív, než otevřeme Figmu." },
    { t: "Transparentní spolupráce", d: "Pravidelné check-iny, jasné termíny, bez schovávání problémů. Klient vždy ví, na čem je." },
  ],
  EN: [
    { t: "Business first, pixels second", d: "We start with the question: what should this site actually earn? Design is a consequence of strategy, not decoration." },
    { t: "UX built on decisions", d: "Every element has a reason to exist. Hierarchy, contrast and flow are settled before Figma opens." },
    { t: "Transparent collaboration", d: "Regular check-ins, clear deadlines, no hiding problems. The client always knows where we stand." },
  ],
  RU: [
    { t: "Сначала бизнес, потом пиксели", d: "Начинаем с вопроса: что сайт должен зарабатывать? Дизайн — следствие стратегии, а не декор." },
    { t: "UX на решениях, не на трендах", d: "У каждого элемента есть причина. Иерархия, контраст и поток — до Figma." },
    { t: "Прозрачная работа", d: "Регулярные созвоны, чёткие сроки, без замалчивания проблем. Клиент всегда в курсе." },
  ],
  UA: [
    { t: "Спочатку бізнес, потім пікселі", d: "Починаємо з питання: що сайт має заробляти? Дизайн — наслідок стратегії, а не декор." },
    { t: "UX на рішеннях, не на трендах", d: "Кожен елемент має причину. Ієрархія, контраст і потік — до Figma." },
    { t: "Прозора співпраця", d: "Регулярні зідзвони, чіткі дедлайни, без замовчування проблем. Клієнт завжди в курсі." },
  ],
};

const ICONS = [Target, Layers, MessagesSquare];

export function StudioPhilosophy() {
  const { lang } = useT();
  const pillars = PILLARS[lang];

  return (
    <section className="py-28 md:py-36 border-t border-border relative overflow-hidden">
      <div aria-hidden className="absolute -top-40 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-primary/[0.06] blur-[160px]" />
      <div className="container-luxe relative">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-14 lg:gap-20 items-start mb-16">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">{EYEBROW[lang]}</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
              {TITLE[lang]}
            </h2>
          </div>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed lg:pt-10">
            {LEAD[lang]}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {pillars.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={i}
                className="group relative p-10 rounded-xl border border-border bg-surface/40 backdrop-blur-sm transition-all duration-300 hover:border-primary/40 hover:-translate-y-1"
              >
                <div className="h-11 w-11 rounded-lg border border-border bg-background grid place-items-center mb-7 text-primary">
                  <Icon className="h-5 w-5" strokeWidth={1.6} />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-3">{p.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
