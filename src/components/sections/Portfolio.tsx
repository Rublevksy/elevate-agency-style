import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

const IMAGES = [p1, p2, p3, p4];
const SLUGS = ["nordic-store", "corvex", "tinesort", "patecura"] as const;

// Localized case-study extras keyed by slug (kept inline to avoid bloating i18n.ts)
const EXTRAS: Record<
  string,
  Record<(typeof SLUGS)[number], { did: string[]; results: string[] }>
> = {
  CZ: {
    "nordic-store": { did: ["UX/UI design", "Vývoj e-shopu", "Optimalizace konverze"], results: ["+120% konverze", "+80% návštěvnosti"] },
    "corvex":       { did: ["Branding", "Webové stránky", "SEO základ"],               results: ["Nový brand launch", "+45% poptávek"] },
    "tinesort":     { did: ["Produktový UX", "SaaS UI systém", "Onboarding flow"],     results: ["+40% retence", "−30% churnu"] },
    "patecura":     { did: ["Vizuální identita", "Logo systém", "Brand manuál"],       results: ["Kompletní identita", "Konzistentní brand"] },
  },
  EN: {
    "nordic-store": { did: ["UX/UI design", "E-commerce build", "Conversion optimization"], results: ["+120% conversion", "+80% traffic"] },
    "corvex":       { did: ["Branding", "Website", "SEO foundation"],                       results: ["Brand launch", "+45% inquiries"] },
    "tinesort":     { did: ["Product UX", "SaaS UI system", "Onboarding flow"],             results: ["+40% retention", "−30% churn"] },
    "patecura":     { did: ["Visual identity", "Logo system", "Brand guidelines"],          results: ["Full identity", "Consistent brand"] },
  },
  RU: {
    "nordic-store": { did: ["UX/UI дизайн", "Разработка магазина", "Оптимизация"],     results: ["+120% конверсии", "+80% трафика"] },
    "corvex":       { did: ["Брендинг", "Сайт", "SEO основа"],                           results: ["Запуск бренда", "+45% заявок"] },
    "tinesort":     { did: ["Продуктовый UX", "SaaS UI", "Онбординг"],                   results: ["+40% удержание", "−30% оттока"] },
    "patecura":     { did: ["Айдентика", "Логотип", "Бренд-гайд"],                       results: ["Полная айдентика", "Единый бренд"] },
  },
  UA: {
    "nordic-store": { did: ["UX/UI дизайн", "Розробка магазину", "Оптимізація"],       results: ["+120% конверсії", "+80% трафіку"] },
    "corvex":       { did: ["Брендинг", "Сайт", "Основи SEO"],                           results: ["Запуск бренду", "+45% заявок"] },
    "tinesort":     { did: ["Продуктовий UX", "SaaS UI", "Онбординг"],                   results: ["+40% утримання", "−30% відтоку"] },
    "patecura":     { did: ["Айдентика", "Логотип", "Бренд-гайд"],                       results: ["Повна айдентика", "Єдиний бренд"] },
  },
};

const LABELS: Record<string, { did: string; results: string; case: string }> = {
  CZ: { did: "Co jsme udělali", results: "Výsledky", case: "Detail projektu" },
  EN: { did: "What we did",     results: "Results",  case: "Case study" },
  RU: { did: "Что мы сделали",  results: "Результаты", case: "Кейс" },
  UA: { did: "Що ми зробили",   results: "Результати",  case: "Кейс" },
};

export { EXTRAS as PROJECT_EXTRAS, SLUGS as PROJECT_SLUGS, LABELS as PROJECT_LABELS, IMAGES as PROJECT_IMAGES };

export function Portfolio() {
  const { t, lang } = useT();
  const labels = LABELS[lang];
  const extras = EXTRAS[lang];
  const projects = t.portfolio.items.map((p, i) => ({
    ...p,
    img: IMAGES[i],
    slug: SLUGS[i],
    did: extras[SLUGS[i]].did,
    results: extras[SLUGS[i]].results,
  }));

  return (
    <section id="portfolio" className="py-32 md:py-40 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="04" title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <article
              key={p.slug}
              className="reveal group relative overflow-hidden rounded-2xl border border-border bg-surface hover-lift flex flex-col"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  decoding="async"
                  width={1024}
                  height={768}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-90" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-md bg-background/70 backdrop-blur border border-border text-primary">
                    {p.tag}
                  </span>
                </div>
              </div>

              <div className="p-6 md:p-8 flex flex-col gap-5 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-xl md:text-2xl font-bold text-foreground">{p.name}</h3>
                </div>

                <div className="grid grid-cols-2 gap-5 pt-2 border-t border-border">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{labels.did}</p>
                    <ul className="space-y-1">
                      {p.did.map((d) => (
                        <li key={d} className="text-xs text-foreground/80">{d}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">{labels.results}</p>
                    <ul className="space-y-1">
                      {p.results.map((r) => (
                        <li key={r} className="text-xs font-medium text-primary">{r}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-2">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: p.slug }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors group/btn"
                  >
                    {labels.case}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
