import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Gauge, Monitor, Search, Smartphone } from "lucide-react";
import { useT } from "@/lib/i18n";
import { usePages } from "@/lib/pages-i18n";

export const Route = createFileRoute("/services/web")({
  component: WebServicePage,
  head: () => ({
    meta: [
      { title: "Weby, které přivádí klienty — ELEVATE" },
      { name: "description", content: "Webové stránky na míru od 5 000 Kč — design, responzivita a SEO základ pro více poptávek." },
      { property: "og:title", content: "Weby, které přivádí klienty — ELEVATE" },
      { property: "og:description", content: "Prezentační weby zaměřené na důvěru, poptávky a rychlé načítání." },
      { property: "og:url", content: "https://elevateit.cz/services/web" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/services/web" }],
  }),
});

const ICONS = [Monitor, Smartphone, Search];

function WebServicePage() {
  const { lang } = useT();
  const pages = usePages(lang);
  const s = pages.servicesWeb;
  const c = pages.common;
  const price = pages.pricingPages.web.price;

  return (
    <>
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="container-luxe relative grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/80 hover:text-foreground transition-colors mb-12">
              <ArrowLeft className="h-3.5 w-3.5" /> {c.backToServices}
            </Link>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-6">{s.eyebrow}</p>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-8 leading-[1.05]">{s.h1}</h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-10">{s.intro}</p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/contact" className="btn-primary group">{c.getQuote} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
              <span className="text-sm text-muted-foreground"><b className="text-foreground">{price}</b></span>
            </div>
          </div>
          <div className="relative min-h-[420px]">
            <div className="absolute inset-x-0 top-8 rounded-xl border border-border bg-background/85 shadow-2xl overflow-hidden">
              <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-surface/60">
                <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-primary/60" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                <span className="ml-3 text-[10px] font-mono text-muted-foreground">client-web.cz</span>
              </div>
              <div className="p-8">
                <div className="h-5 w-2/3 rounded bg-foreground/30 mb-4" />
                <div className="h-3 w-4/5 rounded bg-foreground/15 mb-2" />
                <div className="h-3 w-1/2 rounded bg-foreground/15 mb-8" />
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-28 rounded-lg bg-primary/30" />
                  <div className="h-28 rounded-lg border border-border bg-surface/50" />
                  <div className="h-28 rounded-lg bg-primary/15" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid md:grid-cols-3 gap-6">
          {s.items.map((item, i) => {
            const Icon = ICONS[i];
            return (
              <article key={item} className="rounded-xl border border-border bg-surface/40 p-10 min-h-[220px]">
                <Icon className="h-7 w-7 text-primary mb-8" />
                <p className="flex items-center gap-3 text-xl font-bold text-foreground"><Check className="h-5 w-5 text-primary" /> {item}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">{s.processLabel}</p>
            <h2 className="text-4xl font-bold text-foreground tracking-tight">{s.processTitle}</h2>
          </div>
          <ol className="lg:col-span-8 relative border-l border-border pl-8 space-y-10">
            {s.processSteps.map((step, i) => (
              <li key={step} className="relative">
                <span className="absolute -left-[42px] top-0 grid h-9 w-9 place-items-center rounded-full border border-primary/40 bg-background text-sm text-primary font-mono">{i + 1}</span>
                <h3 className="text-xl font-bold text-foreground">{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">{s.resultLabel}</p>
            <h2 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight mb-6">{s.resultBig}</h2>
            <p className="text-muted-foreground max-w-lg">{s.resultText}</p>
          </div>
          <div className="rounded-xl border border-border bg-gradient-to-br from-primary/15 to-transparent p-10">
            <Gauge className="h-8 w-8 text-primary mb-8" />
            <div className="grid grid-cols-2 gap-6 text-sm">
              <div><p className="text-4xl font-bold text-foreground">&lt;2s</p><p className="text-muted-foreground">{s.speed}</p></div>
              <div><p className="text-4xl font-bold text-foreground">SEO</p><p className="text-muted-foreground">{s.seoBase}</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe rounded-xl border border-border bg-background/60 p-10 md:p-14 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-primary mb-3">{s.ctaTrust}</p>
            <h2 className="text-5xl font-bold text-foreground tracking-tight">{price}</h2>
            <p className="mt-3 text-sm text-muted-foreground">{s.ctaSubtitle}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact" className="btn-primary">{c.getQuote}</Link>
            <Link to="/pricing/web" className="btn-outline">{c.viewPricing}</Link>
          </div>
        </div>
      </section>
    </>
  );
}
