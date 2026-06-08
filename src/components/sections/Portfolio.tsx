import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT, type Lang } from "@/lib/i18n";
import { PhoneMockup, ProjectVisual, type ProjectCategory } from "@/lib/projects";
import { useProjects, type LocalizedProject } from "@/lib/projects-i18n";
import { SectionHeading } from "./SectionHeading";

type FilterId = "all" | "corporate" | "ecommerce" | "webapp" | "redesign";

const FILTER_TO_CATEGORY: Record<Exclude<FilterId, "all">, ProjectCategory> = {
  corporate: "Web",
  ecommerce: "E-shop",
  webapp: "SaaS",
  redesign: "Branding",
};

const FILTER_LABELS: Record<Lang, Record<FilterId, string>> = {
  CZ: { all: "Vše", corporate: "Firemní weby", ecommerce: "E-shopy", webapp: "Webové aplikace", redesign: "Redesign" },
  EN: { all: "All", corporate: "Corporate sites", ecommerce: "E-commerce", webapp: "Web apps", redesign: "Redesign" },
  RU: { all: "Все", corporate: "Корпоративные сайты", ecommerce: "Интернет-магазины", webapp: "Веб-приложения", redesign: "Редизайн" },
  UA: { all: "Усі", corporate: "Корпоративні сайти", ecommerce: "Інтернет-магазини", webapp: "Веб-додатки", redesign: "Редизайн" },
};

const INDUSTRY_BY_SLUG: Record<string, Record<Lang, string>> = {
  "biodent-clinic":   { CZ: "Zdravotnictví · Stomatologie", EN: "Healthcare · Dental", RU: "Медицина · Стоматология", UA: "Медицина · Стоматологія" },
  "nhome-praha":      { CZ: "Reality · Praha",              EN: "Real estate · Prague", RU: "Недвижимость · Прага",   UA: "Нерухомість · Прага" },
  "exclusive-beauty": { CZ: "Beauty · Premium",             EN: "Beauty · Premium",     RU: "Beauty · Премиум",       UA: "Beauty · Преміум" },
  "euromotors":       { CZ: "Automotive · Dealer",          EN: "Automotive · Dealer",  RU: "Авто · Дилер",           UA: "Авто · Дилер" },
  "america-pod-vezi": { CZ: "Gastronomie · Restaurace",     EN: "Hospitality · Restaurant", RU: "Гастрономия · Ресторан", UA: "Гастрономія · Ресторан" },
  "ideatech":         { CZ: "Technologie · B2B",            EN: "Technology · B2B",     RU: "Технологии · B2B",       UA: "Технології · B2B" },
};

const FILTERS: FilterId[] = ["all", "corporate", "ecommerce", "webapp", "redesign"];

const EMPTY_COPY: Record<Lang, string> = {
  CZ: "Pro tuto kategorii brzy přidáme nové případové studie.",
  EN: "New case studies for this category are coming soon.",
  RU: "Новые кейсы в этой категории скоро появятся.",
  UA: "Нові кейси для цієї категорії скоро з'являться.",
};

const SERVICES_LABEL: Record<Lang, string> = {
  CZ: "Co jsme dodali", EN: "What we delivered", RU: "Что мы сделали", UA: "Що ми зробили",
};
const FEATURED_LABEL: Record<Lang, string> = {
  CZ: "Vybraná případová studie", EN: "Featured case study", RU: "Избранный кейс", UA: "Вибраний кейс",
};
const VIEW_LIVE_LABEL: Record<Lang, string> = {
  CZ: "Otevřít web", EN: "Open live site", RU: "Открыть сайт", UA: "Відкрити сайт",
};
const READ_CASE_LABEL: Record<Lang, string> = {
  CZ: "Číst případovou studii", EN: "Read case study", RU: "Читать кейс", UA: "Читати кейс",
};

export function Portfolio() {
  const { t, lang } = useT();
  const projects = useProjects();
  const [active, setActive] = useState<FilterId>("all");

  const filtered = useMemo<LocalizedProject[]>(() => {
    if (active === "all") return projects;
    const target = FILTER_TO_CATEGORY[active];
    const accepted = new Set<string>([
      target,
      ...(["CZ", "EN", "RU", "UA"] as Lang[]).map((l) => {
        const map: Record<Lang, Record<ProjectCategory, string>> = {
          CZ: { Web: "Web", "E-shop": "E-shop", Branding: "Branding", SaaS: "SaaS" },
          EN: { Web: "Web", "E-shop": "E-commerce", Branding: "Branding", SaaS: "SaaS" },
          RU: { Web: "Сайт", "E-shop": "Интернет-магазин", Branding: "Брендинг", SaaS: "SaaS" },
          UA: { Web: "Сайт", "E-shop": "Інтернет-магазин", Branding: "Брендинг", SaaS: "SaaS" },
        };
        return map[l][target];
      }),
    ]);
    return projects.filter((p) => accepted.has(p.category));
  }, [projects, active]);

  const featured = active === "all" ? projects[0] : filtered[0];
  const rest = active === "all" ? projects.slice(1) : filtered.slice(1);

  return (
    <section id="portfolio" className="py-28 md:py-36 border-t border-border relative overflow-hidden">
      {/* Ambient premium glows */}
      <div className="absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-primary/12 blur-[180px] pointer-events-none" />
      <div className="absolute -bottom-40 left-0 h-[30rem] w-[30rem] rounded-full bg-primary/6 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)] pointer-events-none" />

      <div className="container-luxe relative">
        <SectionHeading eyebrow="04 — Case studies" title={t.portfolio.title} subtitle={t.ui.portfolioSubtitle} />

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 md:gap-2.5 mb-12 md:mb-16">
          {FILTERS.map((f) => {
            const label = FILTER_LABELS[lang][f];
            const isActive = active === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={isActive}
                className={`relative inline-flex items-center gap-1.5 px-4 md:px-5 py-2.5 rounded-full text-[11px] md:text-xs uppercase tracking-[0.18em] font-medium border transition-all duration-300 ${
                  isActive
                    ? "border-primary/70 bg-primary/10 text-foreground shadow-[0_10px_30px_-12px_oklch(0.72_0.18_250/0.75)]"
                    : "border-border bg-surface/40 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5"
                }`}
              >
                {isActive && <Sparkles className="h-3 w-3 text-primary" strokeWidth={2} />}
                {label}
              </button>
            );
          })}
        </div>

        {/* FEATURED CASE STUDY */}
        {featured && <FeaturedCase project={featured} lang={lang} />}

        {/* GRID — masonry-style with mixed spans */}
        {rest.length > 0 && (
          <div className="mt-20 md:mt-28 grid grid-cols-1 md:grid-cols-6 gap-6 md:gap-8 auto-rows-auto">
            {rest.map((project, i) => {
              // Asymmetric span pattern → premium magazine feel
              const spans = ["md:col-span-4", "md:col-span-2", "md:col-span-3", "md:col-span-3", "md:col-span-2", "md:col-span-4"];
              const span = spans[i % spans.length];
              return <PortfolioCard key={project.slug} project={project} lang={lang} span={span} delay={i} t={t} />;
            })}
          </div>
        )}

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">{EMPTY_COPY[lang]}</p>
        )}
      </div>
    </section>
  );
}

/* ---------- Featured hero case study ---------- */
function FeaturedCase({ project, lang }: { project: LocalizedProject; lang: Lang }) {
  return (
    <article className="relative overflow-hidden rounded-[1.75rem] border border-border/70 bg-gradient-to-br from-surface/80 via-surface/40 to-background animate-fade-in">
      {/* Halo */}
      <span aria-hidden className="pointer-events-none absolute -top-32 -right-20 h-[28rem] w-[28rem] rounded-full bg-primary/15 blur-[140px]" />
      <span aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-[22rem] w-[22rem] rounded-full bg-primary/8 blur-[120px]" />

      <div className="relative grid lg:grid-cols-12 gap-10 lg:gap-14 p-7 sm:p-10 md:p-14">
        {/* Copy column */}
        <div className="lg:col-span-5 flex flex-col">
          <p className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-primary mb-6">
            <Sparkles className="h-3 w-3" />
            {FEATURED_LABEL[lang]}
          </p>
          <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground mb-3">
            {INDUSTRY_BY_SLUG[project.slug]?.[lang] ?? project.category}
          </p>
          <h3 className="text-4xl md:text-5xl lg:text-[3.4rem] font-semibold text-foreground tracking-tight leading-[1.05] mb-5">
            {project.name}
          </h3>
          <p className="text-[15.5px] md:text-base text-muted-foreground leading-relaxed mb-8 max-w-xl">
            {project.description}
          </p>

          {/* Result strip */}
          <div className="rounded-2xl border border-border/70 bg-background/60 backdrop-blur-sm p-6 mb-8">
            <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">Klíčový výsledek</p>
            <div className="text-3xl md:text-4xl font-semibold text-foreground tabular-nums tracking-tight mb-5">
              {project.result}
            </div>
            <div className="grid grid-cols-3 gap-3">
              {project.results.slice(0, 3).map((r) => (
                <div key={`${r.value}-${r.label}`} className="min-w-0">
                  <div className="text-base md:text-lg font-semibold text-primary tabular-nums leading-tight">{r.value}</div>
                  <div className="text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground mt-1 leading-tight">{r.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Services chips */}
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">{SERVICES_LABEL[lang]}</p>
            <div className="flex flex-wrap gap-1.5">
              {project.work.map((item) => (
                <span key={item} className="inline-flex text-[11.5px] px-2.5 py-1 rounded-md bg-background/60 border border-border/70 text-foreground/85">
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-3">
            <Link
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
            >
              {READ_CASE_LABEL[lang]}
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border bg-surface/50 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
            >
              {VIEW_LIVE_LABEL[lang]}
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        {/* Mockup column */}
        <div className="lg:col-span-7 relative">
          <div className="relative aspect-[16/11] rounded-2xl overflow-hidden border border-border/70 bg-surface shadow-[0_50px_120px_-40px_rgba(0,0,0,0.8)]">
            <ProjectVisual project={project} mode="hero" />
          </div>
          {/* Phone overlap */}
          <div className="hidden md:block absolute -bottom-10 -right-2 lg:-right-6 z-10 drop-shadow-2xl">
            <PhoneMockup project={project} />
          </div>
        </div>
      </div>
    </article>
  );
}

/* ---------- Grid card ---------- */
function PortfolioCard({
  project, lang, span, delay, t,
}: {
  project: LocalizedProject; lang: Lang; span: string; delay: number; t: ReturnType<typeof useT>["t"];
}) {
  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-border/70 bg-surface/50 backdrop-blur-sm flex flex-col transition-all duration-500 hover:border-primary/40 hover:-translate-y-1.5 hover:shadow-[0_40px_100px_-30px_oklch(0.72_0.18_250/0.55)] animate-fade-in ${span}`}
      style={{ animationDelay: `${delay * 0.07}s` }}
    >
      <span aria-hidden className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_top,oklch(0.72_0.18_250/0.22),transparent_65%)]" />

      <Link
        to="/projects/$slug"
        params={{ slug: project.slug }}
        className="block aspect-[16/10] overflow-hidden relative bg-background"
        aria-label={project.name}
      >
        <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]">
          <ProjectVisual project={project} />
        </div>
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/80 via-background/30 to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-border text-foreground/85 font-medium">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {INDUSTRY_BY_SLUG[project.slug]?.[lang] ?? project.category}
          </span>
        </div>
        <div className="absolute bottom-4 right-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
          <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold px-3.5 py-2 rounded-md bg-foreground text-background shadow-2xl">
            {t.ui.portfolioShow}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </Link>

      <div className="relative p-6 md:p-7 flex flex-col gap-5 flex-1">
        <header className="flex items-start justify-between gap-5">
          <div className="min-w-0">
            <h3 className="text-xl md:text-[22px] font-semibold text-foreground tracking-tight mb-2 leading-tight">
              {project.name}
            </h3>
            <p className="text-[13.5px] text-muted-foreground leading-relaxed line-clamp-2">
              {project.description}
            </p>
          </div>
          <span className="shrink-0 text-right">
            <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1">KPI</span>
            <span className="block text-sm md:text-base font-semibold text-primary tabular-nums">
              {project.result}
            </span>
          </span>
        </header>

        <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/60">
          {project.work.slice(0, 3).map((item) => (
            <span key={item} className="inline-flex text-[11px] px-2.5 py-1 rounded-md bg-background/60 border border-border/70 text-foreground/80">
              {item}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
}
