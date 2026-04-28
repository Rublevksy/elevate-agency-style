import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Image, LayoutGrid, PenTool } from "lucide-react";

export const Route = createFileRoute("/services/design")({
  component: DesignServicePage,
  head: () => ({
    meta: [
      { title: "Grafika, která prodává — ELEVATE" },
      { name: "description", content: "Prémiová grafika pro kampaně, sociální sítě a tiskové materiály." },
      { property: "og:title", content: "Grafika, která prodává — ELEVATE" },
      { property: "og:description", content: "Vizuály, které sjednotí komunikaci a pomohou kampaním působit profesionálně." },
    ],
  }),
});

function DesignServicePage() {
  return (
    <>
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        <div className="container-luxe relative text-center">
          <div className="text-left mb-12">
            <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/80 hover:text-foreground transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" /> Všechny služby
            </Link>
          </div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-6">Graphic design</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mx-auto mb-8 leading-[1.05]">
            Grafika, která vypadá prémiově a podporuje prodej
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            Navrhujeme vizuály pro kampaně, sociální sítě a tisk tak, aby značka působila jednotně ve všech kanálech.
          </p>
          <Link to="/contact" className="btn-primary group">Získat nabídku <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid md:grid-cols-3 gap-6">
          {[{ Icon: Image, t: "sociální sítě" }, { Icon: LayoutGrid, t: "bannery a kampaně" }, { Icon: PenTool, t: "tiskové materiály" }].map(({ Icon, t }) => (
            <article key={t} className="rounded-xl border border-border bg-surface/40 p-10">
              <Icon className="h-7 w-7 text-primary mb-8" />
              <p className="flex items-center gap-3 text-xl font-bold text-foreground"><Check className="h-5 w-5 text-primary" /> {t}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe text-center">
          <p className="text-xs uppercase tracking-widest text-primary mb-4">Nezávazná konzultace zdarma · Odpovíme do 24 hodin · Individuální přístup</p>
          <div className="text-6xl md:text-7xl font-bold tracking-tighter text-foreground mb-6">od 3 000 Kč</div>
          <p className="text-sm text-muted-foreground mb-8">Pracujeme s omezeným počtem klientů.</p>
          <Link to="/contact" className="btn-primary">Získat nabídku</Link>
        </div>
      </section>
    </>
  );
}