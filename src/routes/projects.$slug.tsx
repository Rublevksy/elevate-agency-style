import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Target, TrendingUp } from "lucide-react";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PROJECTS_BASE, PROJECT_SLUGS, ProjectVisual, type ProjectSlug } from "@/lib/projects";
import { getProjects, useProject } from "@/lib/projects-i18n";
import { useT } from "@/lib/i18n";

function ProjectNotFound() {
  const { t } = useT();
  return (
    <section className="page-top pb-24">
      <div className="container-luxe">
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.ui.projectNotFoundEyebrow}</p>
        <h1 className="text-5xl font-bold text-foreground tracking-tight mb-8">{t.ui.projectNotFoundTitle}</h1>
        <Link to="/projects" className="btn-primary">{t.ui.projectBackToPortfolio}</Link>
      </div>
    </section>
  );
}

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
  notFoundComponent: ProjectNotFound,
  loader: ({ params }) => {
    if (!PROJECT_SLUGS.includes(params.slug as ProjectSlug)) throw notFound();
    return { slug: params.slug as ProjectSlug };
  },
  head: ({ params }) => {
    const base = PROJECTS_BASE.find((item) => item.slug === params.slug);
    const cz = getProjects("CZ").find((item) => item.slug === params.slug);
    const url = `https://elevateit.cz/projects/${params.slug}`;
    return {
      meta: [
        { title: `${base?.name ?? "Projekt"} — ELEVATE` },
        { name: "description", content: cz?.description ?? "Případová studie projektu s měřitelnými výsledky." },
        { property: "og:title", content: `${base?.name ?? "Projekt"} — ELEVATE` },
        { property: "og:description", content: cz?.description ?? "Případová studie projektu s měřitelnými výsledky." },
        { property: "og:url", content: url },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
});

function ProjectDetail() {
  const { slug } = Route.useLoaderData();
  const project = useProject(slug)!;
  const { t } = useT();

  return (
    <>
      <section className="page-top pb-14 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_65%)]" />
        <div className="container-luxe relative">
          <Link
            to="/projects"
            className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors mb-10"
          >
            <ArrowLeft className="h-4 w-4" /> {t.ui.projectBack}
          </Link>
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-end">
            <div className="lg:col-span-8">
              <p className="text-[11px] uppercase tracking-[0.28em] text-muted-foreground mb-5">
                <span className="text-foreground/90 font-medium">{project.category}</span>
                <span className="mx-2 text-border">/</span>
                <span>Case study</span>
              </p>
              <h1 className="text-5xl md:text-7xl font-semibold text-foreground tracking-[-0.02em] max-w-4xl mb-6 leading-[1.02]">
                {project.name}
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
                {project.description}
              </p>
            </div>
            <div className="lg:col-span-4 rounded-2xl border border-border bg-surface/60 p-7">
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground mb-3 font-medium">
                {t.ui.projectMainResult}
              </p>
              <div className="text-4xl md:text-5xl font-semibold text-foreground tracking-tight tabular-nums">
                {project.result}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-luxe">
          <figure className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-surface mb-16 md:mb-20">
            <ProjectVisual project={project} mode="hero" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background/40 to-transparent pointer-events-none" />
          </figure>

          <div className="grid lg:grid-cols-12 gap-10 md:gap-16">
            <div className="lg:col-span-7 space-y-12 md:space-y-14">
              <article>
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-4 font-medium">
                  01 — {t.ui.projectProblemEyebrow}
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-5 leading-tight">
                  {t.ui.projectChallengeTitle}
                </h2>
                <p className="text-[15.5px] md:text-base text-foreground/75 leading-relaxed max-w-2xl">
                  {project.problem}
                </p>
              </article>

              <div className="h-px bg-border/70" />

              <article>
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-4 font-medium">
                  02 — {t.ui.projectSolutionEyebrow}
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-5 leading-tight">
                  {t.ui.projectSolutionTitle}
                </h2>
                <p className="text-[15.5px] md:text-base text-foreground/75 leading-relaxed max-w-2xl">
                  {project.solution}
                </p>
              </article>

              <div className="h-px bg-border/70" />

              <article>
                <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground mb-4 font-medium">
                  03 — {t.ui.projectWorkEyebrow}
                </p>
                <h2 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-7 leading-tight">
                  {t.ui.projectWorkTitle}
                </h2>
                <ul className="grid sm:grid-cols-2 gap-2.5">
                  {project.work.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-3 rounded-lg border border-border/80 bg-surface/40 p-4"
                    >
                      <Check className="h-4 w-4 text-foreground/70 mt-0.5 shrink-0" />
                      <span className="text-[13.5px] text-foreground/85 leading-snug">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <aside className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-2xl border border-border bg-surface/40 p-8">
                  <div className="flex items-center gap-2.5 mb-7">
                    <TrendingUp className="h-4 w-4 text-foreground/80" />
                    <p className="text-[10px] uppercase tracking-[0.28em] text-muted-foreground font-medium">
                      04 — {t.ui.projectResultsEyebrow}
                    </p>
                  </div>
                  <div className="divide-y divide-border/70">
                    {project.results.map((result) => (
                      <div
                        key={`${result.value}-${result.label}`}
                        className="flex items-baseline justify-between gap-6 py-5 first:pt-0 last:pb-0"
                      >
                        <p className="text-[13px] text-muted-foreground leading-snug max-w-[60%]">
                          {result.label}
                        </p>
                        <div className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight tabular-nums">
                          {result.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-border bg-background p-8">
                  <Target className="h-5 w-5 text-foreground/80 mb-5" />
                  <h2 className="text-2xl font-semibold text-foreground tracking-tight mb-3 leading-tight">
                    {t.ui.projectCtaTitle}
                  </h2>
                  <p className="text-[14px] text-muted-foreground leading-relaxed mb-7">
                    {t.ui.projectCtaDesc}
                  </p>
                  <Link to="/contact" className="btn-primary group w-full justify-center">
                    {t.ui.projectCtaBtn}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
