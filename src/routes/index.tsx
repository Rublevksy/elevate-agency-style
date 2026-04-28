import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight, Globe, ShoppingBag, Sparkles } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Hero3DCube } from "@/components/Hero3DCube";
import { PROJECTS, ProjectVisual } from "@/lib/projects";

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

const SERVICES = [
  {
    icon: Globe,
    title: "Weby, které přivádí klienty",
    desc: "Rychlé weby zaměřené na konverzi a růst.",
    to: "/services/web" as const,
  },
  {
    icon: ShoppingBag,
    title: "E-shopy, které vydělávají",
    desc: "Optimalizované pro nákup od první návštěvy.",
    to: "/services/eshop" as const,
  },
  {
    icon: Sparkles,
    title: "Branding",
    desc: "Značka, kterou si lidé zapamatují.",
    to: "/services/branding" as const,
  },
];

function Home() {
  const featured = PROJECTS.slice(0, 3);

  return (
    <>
      {/* HERO */}
      <section className="relative pt-40 pb-32 md:pt-56 md:pb-44 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_70%)]" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[34rem] w-[34rem] rounded-full bg-primary/15 blur-[160px]" />
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[1100px] opacity-[0.03]">
          <Logo className="w-full h-auto" alt="" />
        </div>

        <div className="container-luxe relative grid lg:grid-cols-[1.05fr_1fr] gap-16 lg:gap-12 items-center">
          <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-10">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Digitální agentura
            </div>

            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground mb-6">
              ELEVATE
            </h1>
            <p className="text-2xl md:text-4xl font-semibold tracking-tight text-foreground mb-6">
              Tvoříme weby, <span className="text-primary">které vydělávají.</span>
            </p>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Pomáháme firmám získávat klienty online.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              <Link to="/contact" className="btn-primary group">
                Získat nabídku
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/projects" className="btn-outline">
                Naše práce
              </Link>
            </div>

            <p className="text-xs md:text-sm uppercase tracking-[0.18em] text-muted-foreground">
              <span className="text-foreground font-medium">4+ let</span> zkušeností
              <span className="mx-2 text-primary">•</span>
              <span className="text-foreground font-medium">50+</span> projektů
              <span className="mx-2 text-primary">•</span>
              Odpověď do <span className="text-foreground font-medium">24 hodin</span>
            </p>
          </div>

          <div className="relative">
            <Hero3DCube />
          </div>
        </div>
      </section>

      {/* SERVICES — only 3 */}
      <section className="py-28 md:py-36 border-t border-border">
        <div className="container-luxe">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">Co děláme</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Služby zaměřené na výsledky</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {SERVICES.map((s) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.title}
                  to={s.to}
                  className="group relative p-10 rounded-xl border border-border bg-surface/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:-translate-y-1 hover:shadow-[0_25px_70px_-25px_rgba(59,130,246,0.55)]"
                >
                  <div className="h-12 w-12 rounded-lg border border-border bg-background grid place-items-center mb-8 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-8">{s.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    Zjistit více
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* PORTFOLIO — only 3 */}
      <section className="py-28 md:py-36 border-t border-border">
        <div className="container-luxe">
          <div className="max-w-2xl mx-auto text-center mb-20">
            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">Vybrané projekty</p>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">Práce, která přináší výsledky</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
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
              Zobrazit všechny projekty
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-28 md:py-36 border-t border-border">
        <div className="container-luxe">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-14 md:p-24 text-center">
            <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/20 blur-[140px]" />
            <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)]" />
            <div className="relative">
              <h2 className="text-4xl md:text-6xl font-bold text-foreground mb-5 tracking-tight">Máš projekt?</h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl mx-auto">
                Navrhneme ti řešení zdarma.
              </p>
              <p className="text-sm uppercase tracking-[0.2em] text-primary mb-12">
                Odpovíme do 24 hodin
              </p>
              <Link to="/contact" className="btn-primary group mx-auto inline-flex">
                Získat nabídku
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
