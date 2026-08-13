import { useEffect, useRef } from "react";
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

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

/**
 * The first editorial section after the cinematic intro — the same world, one
 * step closer. Everything is revealed by scroll position (never autoplayed):
 * the eyebrow, the statement and the lead arrive in sequence, then the three
 * principles come forward one at a time while the previous one settles back.
 */
export function StudioPhilosophy() {
  const { lang } = useT();
  const pillars = PILLARS[lang];

  const section = useRef<HTMLElement>(null);
  const heads = useRef<(HTMLElement | null)[]>([]);
  const panels = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    const apply = () => {
      raf = 0;
      const el = section.current;
      if (!el) return;
      const vh = window.innerHeight;
      const rect = el.getBoundingClientRect();
      // 0 → section entering from below, 1 → section leaving the top
      const p = clamp01((vh - rect.top) / (vh + rect.height * 0.55));

      heads.current.forEach((h, i) => {
        if (!h) return;
        const a = 0.06 + i * 0.05;
        const v = reduce ? 1 : smooth(a, a + 0.13, p);
        h.style.opacity = String(v);
        h.style.transform = `translate3d(0, ${(1 - v) * 26}px, 0)`;
        h.style.clipPath = `inset(0 0 ${(1 - v) * 42}% 0)`;
      });

      panels.current.forEach((panel, i) => {
        if (!panel) return;
        const a = 0.26 + i * 0.11;
        const v = reduce ? 1 : smooth(a, a + 0.15, p);
        // once the next principle arrives, this one settles gently backwards
        const recede = reduce ? 0 : smooth(a + 0.16, a + 0.34, p);
        panel.style.opacity = String(0.15 + v * 0.85 - recede * 0.14);
        panel.style.transform =
          `translate3d(0, ${(1 - v) * 40 - recede * 4}px, 0) scale(${0.965 + v * 0.035 - recede * 0.008})`;
        panel.style.setProperty("--accent", String(v * (1 - recede * 0.6)));
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [lang]);

  return (
    <section
      ref={section}
      className="relative overflow-hidden bg-background py-32 md:py-44"
    >
      {/* continuity with the cinematic space above: the same deep field, fading in */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-[46rem]"
        style={{
          background:
            "radial-gradient(110% 70% at 50% 0%, #0a1120 0%, rgba(7,11,18,0.6) 45%, transparent 78%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-40 w-px -translate-x-1/2 bg-gradient-to-b from-primary/40 to-transparent"
      />

      <div className="container-luxe relative">
        <div className="mb-20 grid items-start gap-12 md:mb-28 lg:grid-cols-[0.95fr_1.05fr] lg:gap-24">
          <div>
            <p
              ref={(el) => {
                heads.current[0] = el;
              }}
              className="mb-6 font-mono text-[10px] uppercase tracking-[0.5em] text-primary/75 will-change-transform"
            >
              {EYEBROW[lang]}
            </p>
            <h2
              ref={(el) => {
                heads.current[1] = el;
              }}
              className="max-w-[18ch] text-[clamp(1.85rem,4vw,3.4rem)] font-light leading-[1.06] tracking-[-0.03em] text-foreground/95 will-change-transform"
            >
              {TITLE[lang]}
            </h2>
          </div>
          <p
            ref={(el) => {
              heads.current[2] = el;
            }}
            className="max-w-xl text-base leading-relaxed text-muted-foreground will-change-transform md:text-lg lg:pt-12"
          >
            {LEAD[lang]}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {pillars.map((p, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={i}
                ref={(el) => {
                  panels.current[i] = el;
                }}
                className="group relative overflow-hidden rounded-2xl border border-border/70 bg-surface/30 p-9 backdrop-blur-[2px] transition-[border-color,background-color,transform] duration-500 will-change-transform hover:border-primary/35 hover:bg-surface/50 md:p-11"
                style={{ opacity: 0 }}
              >
                {/* the blue accent tracks the reveal, then stays as a whisper */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-9 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
                  style={{ opacity: "var(--accent, 0)" }}
                />
                <div className="mb-9 flex items-baseline justify-between">
                  <span className="font-mono text-[10px] tracking-[0.45em] text-primary/70">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    className="h-4 w-4 text-foreground/35 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:text-primary/80"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-xl font-light leading-snug tracking-[-0.02em] text-foreground transition-transform duration-500 group-hover:-translate-y-0.5 md:text-2xl">
                  {p.t}
                </h3>
                <p className="mt-5 max-w-[34ch] text-sm leading-relaxed text-muted-foreground">{p.d}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
