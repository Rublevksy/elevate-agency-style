import { ArrowUpRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { PROJECTS, ProjectVisual } from "@/lib/projects";
import { SectionHeading } from "./SectionHeading";

export function Portfolio() {
  const { t } = useT();

  return (
    <section id="portfolio" className="py-32 md:py-40 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="04" title={t.portfolio.title} subtitle="Reálné ukázky práce, problémů a výsledků" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project, i) => (
            <article
              key={project.slug}
              className="reveal group relative overflow-hidden rounded-xl border border-border bg-surface hover-lift flex flex-col"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <Link to="/projects/$slug" params={{ slug: project.slug }} className="block aspect-[4/3] overflow-hidden relative">
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                  <ProjectVisual project={project} />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent opacity-90" />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-md bg-background/70 backdrop-blur border border-border text-primary">
                    {project.category}
                  </span>
                </div>
                <div className="absolute inset-0 bg-primary/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid place-items-center">
                  <span className="inline-flex items-center gap-2 text-sm uppercase tracking-widest font-semibold text-primary-foreground">
                    Zobrazit projekt
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              <div className="p-6 md:p-8 flex flex-col gap-5 flex-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">{project.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{project.description}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-primary">{project.result}</span>
                </div>

                <div className="grid grid-cols-2 gap-5 pt-4 border-t border-border">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Práce</p>
                    <ul className="space-y-1">
                      {project.work.slice(0, 3).map((item) => (
                        <li key={item} className="text-xs text-foreground/80">{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Výsledky</p>
                    <ul className="space-y-1">
                      {project.results.slice(0, 3).map((result) => (
                        <li key={`${result.value}-${result.label}`} className="text-xs font-medium text-primary">
                          {result.value} {result.label}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-auto pt-2">
                  <Link
                    to="/projects/$slug"
                    params={{ slug: project.slug }}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors group/btn"
                  >
                    Podrobnosti
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
