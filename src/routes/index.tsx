import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { ProjectVisual } from "@/lib/projects";
import { useProjects } from "@/lib/projects-i18n";
import { DeviceHero } from "@/components/hero/DeviceHero";
import { ServiceStage } from "@/components/sections/ServiceStage";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { TechStack } from "@/components/sections/TechStack";
import { IndustryStrip } from "@/components/sections/IndustryStrip";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { StudioPhilosophy } from "@/components/sections/StudioPhilosophy";
import { Collaboration } from "@/components/sections/Collaboration";
import { WhyElevate } from "@/components/sections/WhyElevate";
import { Results } from "@/components/sections/Results";
import { TrustBar } from "@/components/sections/TrustBar";
import { InstagramStrip } from "@/components/sections/InstagramStrip";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ELEVATE — Webdesign, UX a vývoj moderních webů" },
      { name: "description", content: "Moderní weby a UX strategie pro firmy, které chtějí růst online. Audit zdarma do 48 hodin." },
      { property: "og:title", content: "ELEVATE — Webdesign, UX a vývoj moderních webů" },
      { property: "og:description", content: "Moderní weby a UX strategie pro firmy, které chtějí růst online. Audit zdarma do 48 hodin." },
      { property: "og:url", content: "https://elevateit.cz/" },
      { name: "twitter:title", content: "ELEVATE — Webdesign, UX a vývoj moderních webů" },
      { name: "twitter:description", content: "Moderní weby a UX strategie pro firmy, které chtějí růst online. Audit zdarma do 48 hodin." },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/" }],
  }),
});

function Home() {
  const { t, lang } = useT();
  const featured = useProjects().slice(0, 3);

  return (
    <>
      {/* HERO */}
      <div className="hidden md:block">
        <DeviceHero variant="macbook" lang={lang} />
      </div>
      <div className="md:hidden">
        <DeviceHero variant="iphone" lang={lang} />
      </div>

      {/* SERVICES — all 5, via ServiceStage */}
      <ServiceStage />

      {/* INDUSTRY STRIP */}
      <IndustryStrip />

      {/* TECH STACK */}
      <TechStack />

      {/* STUDIO PHILOSOPHY */}
      <StudioPhilosophy />

      {/* HOW WE WORK */}
      <ProcessTimeline />

      {/* COLLABORATION */}
      <Collaboration />

      {/* WHY ELEVATE — trust & authority */}
      <WhyElevate />

      {/* RESULTS — animated counters */}
      <Results />

      {/* TRUST BAR */}
      <TrustBar />

      {/* PORTFOLIO — real projects only, via useProjects() */}
      <section className="py-28 md:py-36 border-t border-border">
        <div className="container-luxe">
          <SectionHeading eyebrow={t.ui.homeWorkEyebrow} title={t.ui.homeWorkTitle} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {featured.map((project) => (
              <Link
                key={project.slug}
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="hover-lift group relative overflow-hidden rounded-xl border border-border bg-surface flex flex-col transition-all duration-300 hover:border-primary/50 hover:shadow-contact"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-110">
                    <ProjectVisual project={project} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                  <span className="absolute top-4 left-4 text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 rounded-md bg-background/70 backdrop-blur border border-border text-primary">
                    {project.category}
                  </span>
                </div>
                <div className="p-6 flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">{project.category}</p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-primary">{project.result}</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/projects" className="btn-outline inline-flex">
              {t.ui.homeWorkViewAll}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* INSTAGRAM */}
      <InstagramStrip />

      {/* CTA */}
      <section className="py-28 md:py-36 border-t border-border">
        <div className="container-luxe">
          <div className="shadow-ambient relative overflow-hidden rounded-2xl border border-border bg-surface p-14 md:p-24 text-center">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/20 blur-[140px]" />
            <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
            <div className="relative">
              <h2 className="heading-display-sm text-foreground mb-5">{t.cta.title}</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl mx-auto">
                {t.cta.subtitle}
              </p>
              <p className="text-sm uppercase tracking-[0.2em] text-primary mb-12">
                {t.trust.response}
              </p>
              <Link to="/contact" className="btn-primary group mx-auto inline-flex">
                {t.hero.cta1}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
