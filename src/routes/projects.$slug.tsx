import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Target, TrendingUp } from "lucide-react";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { PROJECTS, PROJECT_SLUGS, ProjectVisual, type ProjectSlug } from "@/lib/projects";

function ProjectNotFound() {
  return (
    <section className="page-top pb-24">
      <div className="container-luxe">
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Projekt nenalezen</p>
        <h1 className="text-5xl font-bold text-foreground tracking-tight mb-8">Tento projekt neexistuje.</h1>
        <Link to="/projects" className="btn-primary">Zpět na portfolio</Link>
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
    const project = PROJECTS.find((item) => item.slug === params.slug);
    return {
      meta: [
        { title: `${project?.name ?? "Projekt"} — ELEVATE` },
        { name: "description", content: project?.description ?? "Případová studie projektu s měřitelnými výsledky." },
        { property: "og:title", content: `${project?.name ?? "Projekt"} — ELEVATE` },
        { property: "og:description", content: project?.description ?? "Případová studie projektu s měřitelnými výsledky." },
      ],
    };
  },
});

function ProjectDetail() {
  const { slug } = Route.useLoaderData();
  const project = PROJECTS.find((item) => item.slug === slug)!;

  return (
    <>
      <section className="page-top pb-16 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-10">
            <ArrowLeft className="h-4 w-4" /> Zpět na projekty
          </Link>
          <div className="grid lg:grid-cols-12 gap-12 items-end">
            <div className="lg:col-span-8">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{project.category}</p>
              <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mb-6">
                {project.name}
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">{project.description}</p>
            </div>
            <div className="lg:col-span-4 rounded-xl border border-primary/30 bg-primary/10 p-7">
              <p className="text-xs uppercase tracking-[0.2em] text-primary mb-3">Hlavní výsledek</p>
              <div className="text-4xl font-bold text-foreground tracking-tight">{project.result}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-luxe">
          <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface mb-16 shadow-2xl">
            <ProjectVisual project={project} mode="hero" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/35 to-transparent pointer-events-none" />
          </div>

          <div className="grid lg:grid-cols-12 gap-10 md:gap-14">
            <div className="lg:col-span-7 space-y-10">
              <article className="rounded-xl border border-border bg-surface/45 p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Problem</p>
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">Co klient potřeboval vyřešit</h2>
                <p className="text-muted-foreground leading-relaxed">{project.problem}</p>
              </article>

              <article className="rounded-xl border border-border bg-surface/45 p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Solution</p>
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">Jak jsme to postavili</h2>
                <p className="text-muted-foreground leading-relaxed">{project.solution}</p>
              </article>

              <article className="rounded-xl border border-border bg-surface/45 p-8 md:p-10">
                <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Work</p>
                <h2 className="text-3xl font-bold text-foreground tracking-tight mb-6">UX, development, optimization</h2>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {project.work.map((item) => (
                    <li key={item} className="flex items-start gap-3 rounded-lg border border-border bg-background/50 p-4">
                      <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                      <span className="text-sm text-foreground/90">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </div>

            <aside className="lg:col-span-5">
              <div className="sticky top-28 space-y-6">
                <div className="rounded-xl border border-border bg-background/70 p-8">
                  <div className="flex items-center gap-3 mb-7">
                    <TrendingUp className="h-6 w-6 text-primary" />
                    <p className="text-xs uppercase tracking-[0.25em] text-primary">Results</p>
                  </div>
                  <div className="grid gap-4">
                    {project.results.map((result) => (
                      <div key={`${result.value}-${result.label}`} className="rounded-lg border border-border bg-surface/50 p-5">
                        <div className="text-4xl font-bold text-foreground tracking-tight mb-1">{result.value}</div>
                        <p className="text-sm text-muted-foreground">{result.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-transparent p-8 overflow-hidden relative">
                  <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
                  <div className="relative">
                    <Target className="h-7 w-7 text-primary mb-6" />
                    <h2 className="text-3xl font-bold text-foreground tracking-tight mb-4">Chcete podobný výsledek?</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-7">
                      Popište nám projekt a navrhneme nejrychlejší cestu k webu, e-shopu nebo značce, která bude fungovat.
                    </p>
                    <Link to="/contact" className="btn-primary group w-full justify-center">
                      Chci podobný web
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
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
