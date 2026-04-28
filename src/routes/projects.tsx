import { createFileRoute } from "@tanstack/react-router";
import { Portfolio } from "@/components/sections/Portfolio";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Results } from "@/components/sections/Results";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/projects")({
  component: ProjectsPage,
  head: () => ({
    meta: [
      { title: "Projekty — ELEVATE" },
      { name: "description", content: "Vybrané projekty: weby, e-shopy a branding s měřitelnými výsledky." },
      { property: "og:title", content: "Projekty — ELEVATE" },
      { property: "og:description", content: "Vybrané projekty s měřitelnými výsledky." },
    ],
  }),
});

function ProjectsPage() {
  const { t } = useT();
  return (
    <>
      <section className="page-top pb-16 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.portfolio.title}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-3xl">
            {t.portfolio.subtitle}
          </h1>
        </div>
      </section>
      <Portfolio />
      <Results />
      <CtaBanner />
    </>
  );
}
