import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, TrendingUp } from "lucide-react";
import { useT } from "@/lib/i18n";
import {
  PROJECT_SLUGS,
  PROJECT_EXTRAS,
  PROJECT_LABELS,
  PROJECT_IMAGES,
} from "@/components/sections/Portfolio";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const Route = createFileRoute("/projects/$slug")({
  component: ProjectDetail,
  loader: ({ params }) => {
    if (!(PROJECT_SLUGS as readonly string[]).includes(params.slug)) throw notFound();
    return { slug: params.slug };
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} — ELEVATE` },
      { name: "description", content: "Případová studie projektu — co jsme udělali a jaké byly výsledky." },
    ],
  }),
});

function ProjectDetail() {
  const { slug } = Route.useParams();
  const { t, lang } = useT();
  const idx = (PROJECT_SLUGS as readonly string[]).indexOf(slug);
  const project = t.portfolio.items[idx];
  const extras = PROJECT_EXTRAS[lang][slug as (typeof PROJECT_SLUGS)[number]];
  const labels = PROJECT_LABELS[lang];
  const img = PROJECT_IMAGES[idx];

  const back: Record<string, string> = { CZ: "Zpět na projekty", EN: "Back to projects", RU: "К проектам", UA: "До проєктів" };
  const overview: Record<string, string> = { CZ: "Přehled", EN: "Overview", RU: "Обзор", UA: "Огляд" };

  return (
    <>
      <section className="page-top pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
            <ArrowLeft className="h-4 w-4" /> {back[lang]}
          </Link>
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{project.tag}</p>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground tracking-tight max-w-3xl">
            {project.name}
          </h1>
        </div>
      </section>

      <section className="pb-20 md:pb-28">
        <div className="container-luxe">
          <div className="rounded-2xl overflow-hidden border border-border bg-surface mb-16">
            <img src={img} alt={project.name} loading="lazy" decoding="async" className="w-full h-auto object-cover" />
          </div>

          <div className="grid md:grid-cols-3 gap-12 md:gap-16">
            <div className="md:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">{overview[lang]}</p>
              <p className="text-lg text-foreground/85 leading-relaxed mb-10">
                {project.name} — {project.result}.
              </p>

              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">{labels.did}</p>
              <ul className="space-y-3">
                {extras.did.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-foreground/90">
                    <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <aside>
              <div className="rounded-2xl border border-border bg-surface p-7 sticky top-28">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-5">{labels.results}</p>
                <ul className="space-y-4">
                  {extras.results.map((r) => (
                    <li key={r} className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-lg font-semibold text-foreground">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
