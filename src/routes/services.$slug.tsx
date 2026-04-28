import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock, Sparkles, UserCog, ArrowRight } from "lucide-react";
import { useT, getServiceDetails, SERVICE_SLUGS, type ServiceSlug } from "@/lib/i18n";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const Route = createFileRoute("/services/$slug")({
  component: ServiceDetailPage,
  beforeLoad: ({ params }) => {
    if (!SERVICE_SLUGS.includes(params.slug as ServiceSlug)) throw notFound();
  },
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.toUpperCase()} — ELEVATE` },
      { name: "description", content: "Detail služby ELEVATE — výsledky, proces a cena." },
    ],
  }),
});

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const { t, lang } = useT();
  const detail = getServiceDetails(lang, slug as ServiceSlug);
  if (!detail) return null;
  const labels = t.services.detailLabels;

  return (
    <>
      {/* HERO — Headline */}
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <span
          aria-hidden
          className="absolute -right-20 -top-10 text-[28rem] font-extrabold leading-none text-foreground/[0.025] select-none pointer-events-none"
        >
          E
        </span>
        <div className="container-luxe relative">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {labels.back}
          </Link>
          <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">{detail.title}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mb-10 leading-[1.05]">
            {detail.headline}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-12">
            {detail.intro}
          </p>

          {/* Conversion strip */}
          <div className="flex flex-wrap gap-3 mb-12">
            {[labels.reply, labels.free, labels.individual].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs text-muted-foreground"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {chip}
              </span>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <Link to="/contact" className="btn-primary inline-flex items-center gap-2 group">
              {labels.cta}
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <p className="text-sm text-muted-foreground">
              <span className="text-xs uppercase tracking-widest text-primary mr-2">{labels.startingAt}</span>
              <span className="text-foreground font-bold">{detail.pricing}</span>
            </p>
          </div>
        </div>
      </section>

      {/* PROBLEM */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{labels.problem}</p>
          </div>
          <div className="lg:col-span-8">
            <p className="text-2xl md:text-3xl text-foreground font-bold leading-snug max-w-3xl">
              {detail.problem}
            </p>
          </div>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-12">{labels.results}</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {detail.results.map((r) => (
              <div
                key={r.l}
                className="hover-lift p-10 rounded-xl border border-border bg-background/40 backdrop-blur-sm"
              >
                <div className="text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-3">
                  {r.n}
                </div>
                <div className="text-sm text-muted-foreground">{r.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS + AUDIENCE */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-8">{labels.benefits}</p>
            <ul className="space-y-5">
              {detail.benefits.map((b) => (
                <li key={b} className="flex items-start gap-4 text-base md:text-lg text-foreground">
                  <Check className="h-5 w-5 text-primary mt-1 shrink-0" strokeWidth={2} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-8">{labels.audience}</p>
            <ul className="space-y-3">
              {detail.audience.map((a) => (
                <li
                  key={a}
                  className="text-base md:text-lg text-muted-foreground border-b border-border py-4"
                >
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-12">{labels.process}</p>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {detail.process.map((step, i) => (
              <li
                key={step}
                className="hover-lift p-8 rounded-xl border border-border bg-background/40 backdrop-blur-sm"
              >
                <span className="text-xs font-mono text-primary tracking-widest">0{i + 1}</span>
                <h3 className="text-lg font-bold text-foreground mt-4">{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PRICING + EXCLUSIVITY + FINAL CTA */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-10 md:p-16 relative overflow-hidden">
            <span
              aria-hidden
              className="absolute -right-10 -bottom-20 text-[18rem] font-extrabold leading-none text-foreground/[0.03] select-none pointer-events-none"
            >
              E
            </span>
            <div className="grid lg:grid-cols-2 gap-12 relative">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{labels.pricing}</p>
                <div className="text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
                  {detail.pricing}
                </div>
                <p className="text-sm text-muted-foreground max-w-md">{labels.exclusivity}</p>
              </div>
              <div className="flex flex-col justify-center gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { i: Clock, t: labels.reply },
                    { i: Sparkles, t: labels.free },
                    { i: UserCog, t: labels.individual },
                  ].map(({ i: Icon, t: label }) => (
                    <div
                      key={label}
                      className="flex items-start gap-3 p-4 rounded-lg border border-border bg-background/40"
                    >
                      <Icon className="h-4 w-4 text-primary mt-0.5 shrink-0" strokeWidth={1.5} />
                      <span className="text-xs text-muted-foreground leading-relaxed">{label}</span>
                    </div>
                  ))}
                </div>
                <Link to="/contact" className="btn-primary inline-flex items-center justify-center gap-2 group">
                  {labels.cta}
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
