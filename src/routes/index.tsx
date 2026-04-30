import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Globe, ShoppingBag, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Hero3DCube } from "@/components/Hero3DCube";
import { ProjectVisual } from "@/lib/projects";
import { useLocalizedProjects } from "@/lib/projects-i18n";
import { useT } from "@/lib/i18n";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { TrustBar } from "@/components/sections/TrustBar";
import heroLogo from "@/assets/elevate-logo.png";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ELEVATE — Tvoříme weby, které vydělávají" },
      { name: "description", content: "Digitální agentura. Weby, e-shopy a branding, které přivádí klienty a zvyšují tržby." },
      { property: "og:title", content: "ELEVATE — Tvoříme weby, které vydělávají" },
      { property: "og:description", content: "Pomáháme firmám růst online." },
    ],
  }),
});

const SERVICE_ICONS = [Globe, ShoppingBag, Sparkles];
const SERVICE_LINKS = ["/services/web", "/services/eshop", "/services/branding"] as const;

function Home() {
  const { t } = useT();
  const projects = useLocalizedProjects();
  const featured = projects.slice(0, 6);

  return (
    <>
      {/* HERO */}
      <section className="relative pt-28 pb-20 md:pt-56 md:pb-44 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-[160px]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1100px] opacity-[0.03]">
          <Logo className="w-full h-auto" alt="" />
        </div>

        <div className="container-luxe relative grid lg:grid-cols-[1.05fr_1fr] gap-10 md:gap-16 lg:gap-12 items-center">
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-6 md:mb-10">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              {t.home.tag}
            </div>

            <div className="mb-8 md:mb-10 flex justify-center lg:justify-start">
              <img
                src={heroLogo}
                alt="ELEVATE"
                width={929}
                height={202}
                decoding="async"
                fetchPriority="high"
                className="w-[260px] sm:w-[400px] md:w-[560px] lg:w-[640px] max-w-full h-auto object-contain select-none"
                draggable={false}
              />
            </div>
            <p className="text-2xl md:text-4xl font-semibold tracking-tight text-foreground mb-5 md:mb-6">
              {t.home.title1} <span className="text-primary">{t.home.title2}</span>
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              {t.home.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <Link to="/contact" className="btn-primary group">
                {t.common.getQuote}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/projects" className="btn-outline">
                {t.home.ctaSecondary}
              </Link>
            </div>

            <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-foreground font-medium">{t.home.trustLine.years}</span> {t.home.trustLine.yearsLabel}
              <span className="mx-2 text-primary">•</span>
              <span className="text-foreground font-medium">{t.home.trustLine.projects}</span> {t.home.trustLine.projectsLabel}
              <span className="mx-2 text-primary">•</span>
              {t.home.trustLine.reply} <span className="text-foreground font-medium">{t.home.trustLine.replyValue}</span>
            </p>
          </div>

          <div className="relative hidden lg:block">
            <Hero3DCube />
          </div>
        </div>
      </section>

      {/* TRUST BAR */}
      <TrustBar />

      {/* SERVICES — only 3 */}
      <section className="py-20 md:py-36 border-t border-border">
        <div className="container-luxe">
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">{t.home.servicesEyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{t.home.servicesTitle}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {t.home.services.map((s, i) => {
              const Icon = SERVICE_ICONS[i];
              const to = SERVICE_LINKS[i];
              return (
                <Link
                  key={s.title}
                  to={to}
                  className="group relative p-8 md:p-10 rounded-xl border border-border bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_25px_70px_-25px_rgba(59,130,246,0.55)]"
                >
                  <div className="h-12 w-12 rounded-lg border border-border bg-background grid place-items-center mb-6 md:mb-8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6 md:mb-8">{s.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {t.common.learnMore}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-10 md:mt-14">
            <Link to="/contact" className="btn-primary group inline-flex">
              {t.common.getQuote}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <WhyUs />

      {/* PORTFOLIO — 6 cards */}
      <section className="py-20 md:py-36 border-t border-border">
        <div className="container-luxe">
          <div className="max-w-2xl mx-auto text-center mb-14 md:mb-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">{t.home.portfolioEyebrow}</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">{t.home.portfolioTitle}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featured.map((project) => (
              <Link
                key={project.slug}
                to="/projects/$slug"
                params={{ slug: project.slug }}
                className="group relative overflow-hidden rounded-xl border border-border bg-surface flex flex-col transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_25px_70px_-25px_rgba(59,130,246,0.55)]"
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
                <div className="p-5 md:p-6 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-bold text-foreground mb-1">{project.name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-2">{project.description}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold text-primary">{project.result}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12 md:mt-16">
            <Link to="/projects" className="btn-outline inline-flex">
              {t.common.viewAllProjects}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* FAQ */}
      <Faq />

      {/* CTA */}
      <section className="py-20 md:py-36 border-t border-border">
        <div className="container-luxe">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-10 md:p-24 text-center">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/20 blur-[140px]" />
            <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-5 tracking-tight">{t.home.ctaTitle}</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl mx-auto">
                {t.home.ctaSubtitle}
              </p>
              <p className="text-sm uppercase tracking-[0.2em] text-primary mb-10 md:mb-12">
                {t.common.replyIn24h}
              </p>
              <Link to="/contact" className="btn-primary group mx-auto inline-flex">
                {t.common.getQuote}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
