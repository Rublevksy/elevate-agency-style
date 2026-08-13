import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { CINEMATIC } from "@/lib/cinematic-copy";
import { useT } from "@/lib/i18n";
import { screenshotUrl } from "@/lib/projects";
import { useProjects } from "@/lib/projects-i18n";

export function CaseFilm() {
  const { lang } = useT();
  const c = CINEMATIC[lang];
  const projects = useProjects().slice(0, 4);

  return (
    <section className="border-t border-border py-24 md:py-32">
      <div className="container-luxe">
        <div className="mb-14 md:mb-20">
          <p className="mb-3 text-[10px] uppercase tracking-[0.34em] text-muted-foreground">{c.workEyebrow}</p>
          <h2 className="max-w-2xl text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">
            {c.workTitle}
          </h2>
        </div>

        <div className="space-y-16 md:space-y-28">
          {projects.map((project, i) => (
            <Link
              key={project.slug}
              to="/projects/$slug"
              params={{ slug: project.slug }}
              className="group grid items-center gap-6 md:grid-cols-12 md:gap-10"
            >
              <div
                className={`relative overflow-hidden rounded-xl border border-border bg-surface md:col-span-8 ${
                  i % 2 === 1 ? "md:order-2" : ""
                }`}
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={screenshotUrl(project.url, 1800, 1125)}
                    alt={`${project.name} — ${project.category}`}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              </div>

              <div className={`md:col-span-4 ${i % 2 === 1 ? "md:order-1" : ""}`}>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.28em] text-primary">
                  0{i + 1} / {project.category}
                </p>
                <h3 className="text-2xl font-medium tracking-[-0.02em] text-foreground md:text-3xl">
                  {project.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                <p className="mt-5 text-sm font-semibold text-primary">{project.result}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors group-hover:text-foreground">
                  {c.caseLabel}
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 md:mt-24">
          <Link to="/projects" className="btn-outline inline-flex">
            {c.workAll}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
