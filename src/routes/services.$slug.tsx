import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check } from "lucide-react";
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
      { name: "description", content: "Detail služby ELEVATE — proces, výhody, ukázky a cena." },
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
      <section className="page-top pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-10">
            <ArrowLeft className="h-3.5 w-3.5" /> {labels.back}
          </Link>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-3xl mb-8">
            {detail.title}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">{detail.intro}</p>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">{labels.process}</p>
            <ol className="space-y-6">
              {detail.process.map((step, i) => (
                <li key={step} className="flex items-start gap-5">
                  <span className="text-xs font-mono text-primary tracking-widest pt-1">0{i + 1}</span>
                  <span className="text-lg font-bold text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">{labels.benefits}</p>
            <ul className="space-y-4">
              {detail.benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-base text-muted-foreground">
                  <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" strokeWidth={2} />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 border-t border-border bg-surface/30">
        <div className="container-luxe grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">{labels.examples}</p>
            <ul className="space-y-3">
              {detail.examples.map((ex) => (
                <li key={ex} className="text-lg text-foreground border-b border-border py-4">
                  {ex}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">{labels.pricing}</p>
            <p className="text-4xl md:text-5xl font-bold text-foreground mb-8">{detail.pricing}</p>
            <Link to="/contact" className="btn-primary inline-flex">{labels.cta}</Link>
          </div>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
