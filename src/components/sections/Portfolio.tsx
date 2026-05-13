import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { ProjectVisual } from "@/lib/projects";
import { useProjects } from "@/lib/projects-i18n";
import { SectionHeading } from "./SectionHeading";

export function Portfolio() {
  const { t } = useT();
  const projects = useProjects();

  return (
    <section id="portfolio" className="py-32 md:py-40 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="04 — Case studies" title={t.portfolio.title} subtitle={t.ui.portfolioSubtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {projects.map((project, i) => (
            <article
              key={project.slug}
              className="reveal group relative overflow-hidden rounded-2xl border border-border bg-surface/60 flex flex-col transition-all duration-500 hover:border-foreground/20 hover:bg-surface hover:-translate-y-0.5"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              {/* Visual */}
              <Link
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="block aspect-[16/10] overflow-hidden relative bg-background"
              >
                <div className="absolute inset-0 transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]">
                  <ProjectVisual project={project} />
                </div>
                {/* Subtle bottom fade for label legibility — no blue tint */}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background/70 to-transparent pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] uppercase tracking-[0.22em] px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-md border border-border/80 text-foreground/80 font-medium">
                    {project.category}
                  </span>
                </div>
                {/* Hover affordance — small chip, not a full overlay */}
                <div className="absolute bottom-4 right-4 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] font-semibold px-3 py-1.5 rounded-md bg-foreground text-background">
                    {t.ui.portfolioShow}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </Link>

              {/* Body */}
              <div className="p-7 md:p-8 flex flex-col gap-6 flex-1">
                <header className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <h3 className="text-[22px] md:text-2xl font-semibold text-foreground tracking-tight mb-2 leading-tight">
                      {project.name}
                    </h3>
                    <p className="text-[13.5px] md:text-sm text-muted-foreground leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-right">
                    <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1">
                      KPI
                    </span>
                    <span className="block text-base font-semibold text-foreground tabular-nums">
                      {project.result}
                    </span>
                  </span>
                </header>

                <div className="grid grid-cols-2 gap-6 pt-5 border-t border-border/70">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/90 mb-2.5 font-medium">
                      {t.ui.portfolioWork}
                    </p>
                    <ul className="space-y-1.5">
                      {project.work.slice(0, 3).map((item) => (
                        <li key={item} className="text-[13px] text-foreground/85 leading-snug">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground/90 mb-2.5 font-medium">
                      {t.ui.portfolioResults}
                    </p>
                    <ul className="space-y-1.5">
                      {project.results.slice(0, 3).map((result) => (
                        <li
                          key={`${result.value}-${result.label}`}
                          className="text-[13px] text-foreground/90 leading-snug"
                        >
                          <span className="font-semibold text-foreground tabular-nums">{result.value}</span>{" "}
                          <span className="text-muted-foreground">{result.label}</span>
                        </li>
                      ))}
                    </ul>
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
      </div>
    </section>
  );
}
