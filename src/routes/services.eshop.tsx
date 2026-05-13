import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BarChart3, Check, Clock, CreditCard, MessageCircle, Package, Search, ShieldCheck, ShoppingCart, Smartphone, Sparkles, TrendingUp, Truck, Zap } from "lucide-react";
import { useT } from "@/lib/i18n";
import { usePages } from "@/lib/pages-i18n";

export const Route = createFileRoute("/services/eshop")({
  component: EshopServicePage,
  head: () => ({
    meta: [
      { title: "E-shop, který vydělává — ELEVATE" },
      { name: "description", content: "Stavíme výkonné e-shopy zaměřené na konverze, objednávky a růst obratu. Od návrhu přes UX po napojení plateb." },
      { property: "og:title", content: "E-shop, který vydělává — ELEVATE" },
      { property: "og:description", content: "Výkonný e-shop od 15 000 Kč — UX, platby, produktová optimalizace a měřitelné výsledky." },
      { property: "og:url", content: "https://elevateit.cz/services/eshop" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/services/eshop" }],
  }),
});

const TRUST_ICONS = [MessageCircle, Clock, Sparkles];
const WHAT_ICONS = [ShoppingCart, Smartphone, CreditCard, Search, BarChart3, ShieldCheck];
const RESULT_ICONS = [TrendingUp, ShoppingCart, Truck, Zap];

function EshopServicePage() {
  const { lang } = useT();
  const pages = usePages(lang);
  const s = pages.servicesEshop;
  const c = pages.common;
  const price = pages.pricingPages.eshop.price;

  const products = [
    { name: "Premium Hoodie", sku: "NS-1042", price: "1 990 Kč", tag: "BESTSELLER" },
    { name: "Wool Coat", sku: "NS-1043", price: "5 490 Kč", tag: "NEW" },
    { name: "Leather Bag", sku: "NS-1044", price: "3 290 Kč", tag: "-15 %" },
    { name: "Sneakers", sku: "NS-1045", price: "2 790 Kč", tag: "STOCK" },
  ];

  return (
    <>
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        <div className="container-luxe relative grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/80 hover:text-foreground transition-colors mb-12">
              <ArrowLeft className="h-3.5 w-3.5" /> {c.backToServices}
            </Link>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-6">{s.eyebrow}</p>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mb-8 leading-[1.05]">
              {s.h1Pre} <span className="text-primary">{s.h1Highlight}</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10">{s.intro}</p>
            <div className="flex flex-wrap gap-3 mb-10">
              {s.trust.map((label, i) => {
                const Icon = TRUST_ICONS[i];
                return (
                  <span key={label} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                  </span>
                );
              })}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/contact" className="btn-primary group">{c.getQuote} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
              <p className="text-sm text-muted-foreground">
                <span className="text-xs uppercase tracking-widest text-primary mr-2">{c.price}</span>
                <span className="text-foreground font-bold">{price}</span>
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-background/80 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface/60">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <ShoppingCart className="h-4 w-4 text-primary" /> {s.liveCatalog}
                </span>
                <span className="text-[10px] font-mono text-primary">+38 % CR</span>
              </div>
              <div className="grid grid-cols-2 gap-4 p-5">
                {products.map((p) => (
                  <div key={p.sku} className="rounded-lg border border-border bg-surface/40 overflow-hidden">
                    <div className="aspect-square bg-gradient-to-br from-primary/30 via-primary/10 to-transparent relative">
                      <span className="absolute left-3 top-3 text-[9px] font-mono text-primary bg-background/70 px-2 py-1 rounded">{p.tag}</span>
                      <Package className="absolute right-3 bottom-3 h-5 w-5 text-foreground/80" />
                    </div>
                    <div className="p-3">
                      <p className="text-[10px] font-mono text-muted-foreground">{p.sku}</p>
                      <p className="text-sm text-foreground truncate">{p.name}</p>
                      <p className="text-sm font-bold text-primary mt-1">{p.price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">{s.whatWeDoLabel}</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{s.whatWeDoTitle}</h2>
            </div>
            <p className="lg:col-span-7 text-lg text-muted-foreground self-end">{s.whatWeDoText}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {s.whatWeDo.map((item, i) => {
              const Icon = WHAT_ICONS[i];
              return (
                <div key={item.t} className="rounded-xl border border-border bg-surface/40 p-7 hover:border-primary/40 transition-colors">
                  <div className="h-10 w-10 rounded-lg bg-primary/15 grid place-items-center mb-5">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{item.t}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">{s.processLabel}</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-16 max-w-2xl">{s.processTitle}</h2>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border-y border-border">
            {s.process.map((step, i) => (
              <li key={step.t} className={`p-8 border-border ${i < s.process.length - 1 ? "lg:border-r md:[&:nth-child(odd)]:border-r" : ""} ${i < 2 ? "md:border-b lg:border-b-0" : ""}`}>
                <div className="text-5xl font-bold text-primary/80 font-mono mb-5">0{i + 1}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">{s.resultsLabel}</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-16 max-w-2xl">{s.resultsTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {s.results.map((r, i) => {
              const Icon = RESULT_ICONS[i];
              return (
                <div key={r.l} className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-7">
                  <Icon className="h-6 w-6 text-primary mb-6" />
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{r.n}</div>
                  <p className="text-sm text-primary font-medium mb-3">{r.l}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{r.d}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">{s.includedLabel}</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">{s.includedTitle}</h2>
            <p className="text-muted-foreground">{s.includedText}</p>
          </div>
          <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
            {s.included.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-lg border border-border bg-surface/60 p-4">
                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-transparent p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-primary mb-4">{s.finalLabel}</p>
              <div className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground mb-3">{price}</div>
              <p className="text-muted-foreground max-w-xl mx-auto mb-10">{s.finalText}</p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs text-muted-foreground">
                {s.trust.map((label, i) => {
                  const Icon = TRUST_ICONS[i];
                  return (
                    <span key={label} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                      <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                    </span>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/contact" className="btn-primary"><CreditCard className="h-4 w-4" /> {s.finalCta}</Link>
                <Link to="/pricing/eshop" className="btn-outline">{c.viewPricing}</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
