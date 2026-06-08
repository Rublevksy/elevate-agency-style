import { useMemo, useState } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT, type Lang } from "@/lib/i18n";
import { ProjectVisual, type ProjectCategory } from "@/lib/projects";
import { useProjects, type LocalizedProject } from "@/lib/projects-i18n";
import { SectionHeading } from "./SectionHeading";

/**
 * High-level filters surfaced in the UI (industry-style buckets).
 * Each filter maps to one underlying ProjectCategory so the section is
 * trivial to extend with new placeholder projects later.
 */
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
  "nordic-store": { CZ: "Móda · Retail", EN: "Fashion · Retail", RU: "Мода · Ритейл", UA: "Мода · Ретейл" },
  corvex: { CZ: "B2B · Technologie", EN: "B2B · Technology", RU: "B2B · Технологии", UA: "B2B · Технології" },
  tinesort: { CZ: "B2B · SaaS", EN: "B2B · SaaS", RU: "B2B · SaaS", UA: "B2B · SaaS" },
  patecura: { CZ: "Wellness · Premium", EN: "Wellness · Premium", RU: "Wellness · Премиум", UA: "Wellness · Преміум" },
  "lumen-studio": { CZ: "Architektura", EN: "Architecture", RU: "Архитектура", UA: "Архітектура" },
  "verda-market": { CZ: "Bio potraviny · E-shop", EN: "Organic food · E-shop", RU: "Био-продукты · Магазин", UA: "Біо-продукти · Магазин" },
  northwind: { CZ: "Logistika · B2B", EN: "Logistics · B2B", RU: "Логистика · B2B", UA: "Логістика · B2B" },
  "pulse-crm": { CZ: "SaaS · CRM", EN: "SaaS · CRM", RU: "SaaS · CRM", UA: "SaaS · CRM" },
};

const FILTERS: FilterId[] = ["all", "corporate", "ecommerce", "webapp", "redesign"];

const EMPTY_COPY: Record<Lang, string> = {
  CZ: "Pro tuto kategorii brzy přidáme nové případové studie.",
  EN: "New case studies for this category are coming soon.",
  RU: "Новые кейсы в этой категории скоро появятся.",
  UA: "Нові кейси для цієї категорії скоро з’являться.",
};

const SERVICES_LABEL: Record<Lang, string> = {
  CZ: "Co jsme dodali",
  EN: "What we delivered",
  RU: "Что мы сделали",
  UA: "Що ми зробили",
};

export function Portfolio() {
  const { t, lang } = useT();
  const projects = useProjects();
  const [active, setActive] = useState<FilterId>("all");

  const categoryLabelByLocalized = useMemo(() => {
    // Build a reverse lookup: a project's localized category string → its base ProjectCategory
    // by walking the known base list once. Since useProjects returns base + content merged,
    // each project's `category` is the localized label. We instead filter by slug-derived
    // base category using INDUSTRY_BY_SLUG presence + the original PROJECTS_BASE ordering.
    return null;
  }, []);
  void categoryLabelByLocalized;

  const filtered = useMemo<LocalizedProject[]>(() => {
    if (active === "all") return projects;
    const target = FILTER_TO_CATEGORY[active];
    // Project base category is preserved through the slug list — compare via
    // the localized labels by matching against every language's label for `target`.
    const acceptedLabels = new Set<string>([
      target,
      ...(["CZ", "EN", "RU", "UA"] as Lang[]).map((l) => {
        // Mirror the labels used in projects-i18n CATEGORY_LABELS
        const map: Record<Lang, Record<ProjectCategory, string>> = {
          CZ: { Web: "Web", "E-shop": "E-shop", Branding: "Branding", SaaS: "SaaS" },
          EN: { Web: "Web", "E-shop": "E-commerce", Branding: "Branding", SaaS: "SaaS" },
          RU: { Web: "Сайт", "E-shop": "Интернет-магазин", Branding: "Брендинг", SaaS: "SaaS" },
          UA: { Web: "Сайт", "E-shop": "Інтернет-магазин", Branding: "Брендинг", SaaS: "SaaS" },
        };
        return map[l][target];
      }),
    ]);
    return projects.filter((p) => acceptedLabels.has(p.category));
  }, [projects, active]);

  return (
    <section id="portfolio" className="py-32 md:py-40 border-t border-border relative overflow-hidden">
      {/* Ambient premium glow */}
      <div className="absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-primary/10 blur-[180px] pointer-events-none" />
      <div className="absolute -bottom-40 left-0 h-[30rem] w-[30rem] rounded-full bg-primary/5 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-[0.18] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)] pointer-events-none" />

      <div className="container-luxe relative">
        <SectionHeading eyebrow="04 — Case studies" title={t.portfolio.title} subtitle={t.ui.portfolioSubtitle} />

        {/* Filter pill bar */}
        <div className="flex flex-wrap gap-2 md:gap-2.5 mb-14">
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

        {/* Premium card grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 md:gap-9">
          {filtered.map((project, i) => (
            <article
              key={project.slug}
              className="group relative overflow-hidden rounded-3xl border border-border/70 bg-surface/50 backdrop-blur-sm flex flex-col transition-all duration-500 hover:border-primary/40 hover:-translate-y-1.5 hover:shadow-[0_40px_100px_-30px_oklch(0.72_0.18_250/0.55)] animate-fade-in"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              {/* Hover glow halo */}
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_top,oklch(0.72_0.18_250/0.22),transparent_65%)]"
              />

              {/* Cover */}
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="block aspect-[16/10] overflow-hidden relative bg-background"
                aria-label={project.name}
              >
                <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.08]">
                  <ProjectVisual project={project} />
                </div>
                {/* Vignette */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background via-background/60 to-transparent pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-background/30 pointer-events-none" />

                {/* Industry chip */}
                <div className="absolute top-5 left-5">
                  <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-border text-foreground/85 font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                    {INDUSTRY_BY_SLUG[project.slug]?.[lang] ?? project.category}
                  </span>
                </div>

                {/* Hover CTA */}
                <div className="absolute bottom-5 right-5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold px-3.5 py-2 rounded-md bg-foreground text-background shadow-2xl">
                    {t.ui.portfolioShow}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>

              {/* Body */}
              <div className="relative p-7 md:p-9 flex flex-col gap-6 flex-1">
                <header className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <h3 className="text-2xl md:text-[26px] font-semibold text-foreground tracking-tight mb-2.5 leading-tight">
                      {project.name}
                    </h3>
                    <p className="text-sm md:text-[14.5px] text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-right">
                    <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-1.5">KPI</span>
                    <span className="block text-base md:text-lg font-semibold text-primary tabular-nums">
                      {project.result}
                    </span>
                  </span>
                </header>

                {/* Services delivered */}
                <div className="pt-5 border-t border-border/60">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/90 mb-3 font-medium">
                    {SERVICES_LABEL[lang]}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.work.slice(0, 4).map((item) => (
                      <span
                        key={item}
                        className="inline-flex text-[11.5px] px-2.5 py-1 rounded-md bg-background/60 border border-border/70 text-foreground/80"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-auto pt-1">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground/90 hover:text-primary transition-colors group/btn"
                  >
                    {t.ui.portfolioDetails}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">{EMPTY_COPY[lang]}</p>
        )}
      </div>
    </section>
  );
}
