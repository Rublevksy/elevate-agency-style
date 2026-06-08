import { useMemo, useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT, type Lang } from "@/lib/i18n";
import { PhoneMockup, ProjectVisual, type ProjectCategory } from "@/lib/projects";
import { useProjects, type LocalizedProject } from "@/lib/projects-i18n";

type FilterId = "all" | "corporate" | "ecommerce";

const FILTER_TO_CATEGORY: Record<Exclude<FilterId, "all">, ProjectCategory[]> = {
  corporate: ["Web"],
  ecommerce: ["E-shop"],
};

const FILTER_LABELS: Record<Lang, Record<FilterId, string>> = {
  CZ: { all: "Vše", corporate: "Firemní weby", ecommerce: "E-shopy" },
  EN: { all: "All", corporate: "Corporate sites", ecommerce: "E-commerce" },
  RU: { all: "Все", corporate: "Корпоративные сайты", ecommerce: "Интернет-магазины" },
  UA: { all: "Усі", corporate: "Корпоративні сайти", ecommerce: "Інтернет-магазини" },
};

const INDUSTRY_BY_SLUG: Record<string, Record<Lang, string>> = {
  "biodent-clinic":   { CZ: "Zdravotnictví · Stomatologie", EN: "Healthcare · Dental",  RU: "Медицина · Стоматология", UA: "Медицина · Стоматологія" },
  "nhome-praha":      { CZ: "Reality · Praha",              EN: "Real estate · Prague", RU: "Недвижимость · Прага",   UA: "Нерухомість · Прага" },
  "exclusive-beauty": { CZ: "Beauty · Premium",             EN: "Beauty · Premium",     RU: "Beauty · Премиум",       UA: "Beauty · Преміум" },
  "euromotors":       { CZ: "Automotive · Dealer",          EN: "Automotive · Dealer",  RU: "Авто · Дилер",           UA: "Авто · Дилер" },
};

const FILTERS: FilterId[] = ["all", "corporate", "ecommerce"];

const COPY: Record<Lang, {
  eyebrow: string; title: string; subtitle: string;
  services: string; result: string; viewLive: string; readCase: string;
  empty: string;
}> = {
  CZ: {
    eyebrow: "Vybrané případové studie",
    title: "Projekty, které posunuly byznys našich klientů",
    subtitle: "Každý projekt řeší konkrétní obchodní problém. Pod každou vizuálem najdete kontext, dodávku a výsledek.",
    services: "Co jsme dodali",
    result: "Klíčový výsledek",
    viewLive: "Otevřít web",
    readCase: "Prohlédnout případovou studii",
    empty: "Pro tuto kategorii brzy přidáme nové případové studie.",
  },
  EN: {
    eyebrow: "Selected case studies",
    title: "Projects that moved our clients' business forward",
    subtitle: "Each project solves a specific business problem. Below every visual you'll find context, delivery and result.",
    services: "What we delivered",
    result: "Key result",
    viewLive: "Open live site",
    readCase: "View case study",
    empty: "New case studies for this category are coming soon.",
  },
  RU: {
    eyebrow: "Избранные кейсы",
    title: "Проекты, которые двинули бизнес клиентов вперёд",
    subtitle: "Каждый проект решает конкретную бизнес-задачу. Под каждым визуалом — контекст, что мы сделали и результат.",
    services: "Что мы сделали",
    result: "Ключевой результат",
    viewLive: "Открыть сайт",
    readCase: "Открыть кейс",
    empty: "Новые кейсы в этой категории скоро появятся.",
  },
  UA: {
    eyebrow: "Вибрані кейси",
    title: "Проєкти, які просунули бізнес наших клієнтів",
    subtitle: "Кожен проєкт вирішує конкретне бізнес-завдання. Під кожним візуалом — контекст, що зроблено і результат.",
    services: "Що ми зробили",
    result: "Ключовий результат",
    viewLive: "Відкрити сайт",
    readCase: "Відкрити кейс",
    empty: "Нові кейси для цієї категорії скоро з'являться.",
  },
};

export function Portfolio() {
  const { lang } = useT();
  const projects = useProjects();
  const [active, setActive] = useState<FilterId>("all");
  const c = COPY[lang];

  const filtered = useMemo<LocalizedProject[]>(() => {
    if (active === "all") return projects;
    const targets = FILTER_TO_CATEGORY[active];
    return projects.filter((p) => {
      // Localized category labels — match by base via original english tag
      return targets.some((t) => p.category.toLowerCase().includes(
        t === "Web" ? (lang === "RU" || lang === "UA" ? "сайт" : "web")
        : (lang === "RU" || lang === "UA" ? "магаз" : "e")
      ));
    });
  }, [projects, active, lang]);

  return (
    <section id="portfolio" className="py-28 md:py-36 border-t border-border relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -top-40 right-0 h-[36rem] w-[36rem] rounded-full bg-primary/12 blur-[180px] pointer-events-none" />
      <div className="absolute -bottom-40 left-0 h-[30rem] w-[30rem] rounded-full bg-primary/8 blur-[160px] pointer-events-none" />
      <div className="absolute inset-0 grid-bg opacity-[0.16] [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_75%)] pointer-events-none" />

      <div className="container-luxe relative">
        {/* Heading */}
        <div className="max-w-3xl mb-12 md:mb-16">
          <p className="text-[11px] uppercase tracking-[0.28em] text-primary mb-5">{c.eyebrow}</p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground tracking-[-0.02em] leading-[1.05] mb-6">
            {c.title}
          </h2>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed">{c.subtitle}</p>
        </div>

        {/* Filter pills */}
        <div className="flex flex-wrap gap-2 md:gap-2.5 mb-16 md:mb-24">
          {FILTERS.map((f) => {
            const label = FILTER_LABELS[lang][f];
            const isActive = active === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => setActive(f)}
                aria-pressed={isActive}
                className={`relative inline-flex items-center gap-2 px-4 md:px-5 py-2.5 rounded-full text-[11px] md:text-xs uppercase tracking-[0.18em] font-medium border transition-all duration-300 ${
                  isActive
                    ? "border-primary/70 bg-primary/10 text-foreground shadow-[0_10px_30px_-12px_oklch(0.72_0.18_250/0.75)]"
                    : "border-border bg-surface/40 text-muted-foreground hover:border-primary/40 hover:text-foreground hover:-translate-y-0.5"
                }`}
              >
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-primary" />}
                {label}
              </button>
            );
          })}
        </div>

        {/* Case study rows */}
        <div className="space-y-24 md:space-y-32">
          {filtered.map((project, i) => (
            <CaseStudyRow key={project.slug} project={project} lang={lang} index={i} copy={c} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-20">{c.empty}</p>
        )}
      </div>
    </section>
  );
}

/* ---------- Case study row — premium agency layout ---------- */
function CaseStudyRow({
  project, lang, index, copy,
}: {
  project: LocalizedProject;
  lang: Lang;
  index: number;
  copy: ReturnType<typeof useT>["t"] extends never ? never : (typeof COPY)[Lang];
}) {
  const reversed = index % 2 === 1;
  const industry = INDUSTRY_BY_SLUG[project.slug]?.[lang] ?? project.category;

  return (
    <article className="reveal relative grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
      {/* Visual block */}
      <div className={`relative lg:col-span-7 ${reversed ? "lg:order-2" : ""}`}>
        <Link
          to="/projects/$slug"
          params={{ slug: project.slug }}
          className="group block relative"
          aria-label={`${copy.readCase} — ${project.name}`}
        >
          {/* Halo */}
          <span aria-hidden className="pointer-events-none absolute -inset-10 rounded-[2rem] bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.18_250/0.18),transparent_70%)] opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Desktop browser mockup */}
          <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-border/70 bg-surface shadow-[0_50px_120px_-40px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-out group-hover:-translate-y-1">
            <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.03]">
              <ProjectVisual project={project} mode="hero" />
            </div>
            {/* Glow border on hover */}
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-primary/0 group-hover:ring-primary/40 transition-[box-shadow,ring] duration-500 group-hover:shadow-[0_0_60px_-10px_oklch(0.72_0.18_250/0.5)_inset]" />
          </div>

          {/* Phone overlay */}
          <div className={`hidden md:block absolute -bottom-10 ${reversed ? "-left-6" : "-right-6"} z-10 drop-shadow-2xl transition-transform duration-700 group-hover:-translate-y-2`}>
            <PhoneMockup project={project} />
          </div>

          {/* Live link chip */}
          <div className="absolute top-4 left-4">
            <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.22em] px-3 py-1.5 rounded-full bg-background/85 backdrop-blur-md border border-border text-foreground/85 font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {industry}
            </span>
          </div>
        </Link>
      </div>

      {/* Copy block */}
      <div className={`lg:col-span-5 ${reversed ? "lg:order-1" : ""}`}>
        <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-4 font-medium tabular-nums">
          0{index + 1} — Case study
        </p>
        <h3 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-foreground tracking-[-0.02em] leading-[1.05] mb-5">
          {project.name}
        </h3>
        <p className="text-[15px] md:text-base text-muted-foreground leading-relaxed mb-7 max-w-xl">
          {project.description}
        </p>

        {/* Result strip */}
        <div className="rounded-2xl border border-border/70 bg-background/60 backdrop-blur-sm p-6 mb-7">
          <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3">{copy.result}</p>
          <div className="text-3xl md:text-[2.1rem] font-semibold text-foreground tabular-nums tracking-tight mb-5 leading-none">
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

        {/* Services */}
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-3">{copy.services}</p>
          <div className="flex flex-wrap gap-1.5">
            {project.work.map((item) => (
              <span key={item} className="inline-flex text-[11.5px] px-2.5 py-1 rounded-md bg-surface/60 border border-border/70 text-foreground/85">
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap gap-3">
          <Link
            to="/projects/$slug"
            params={{ slug: project.slug }}
            className="group/btn inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-foreground text-background text-sm font-semibold hover:bg-foreground/90 transition-colors"
          >
            {copy.readCase}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
          </Link>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-border bg-surface/50 text-sm font-medium text-foreground hover:border-primary/50 hover:text-primary transition-colors"
          >
            {copy.viewLive}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </article>
  );
}
