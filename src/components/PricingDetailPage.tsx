import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, Clock, MessageCircle, Sparkles, Target, TrendingUp } from "lucide-react";
import { type PricingPage } from "@/lib/pricing";

type PricingDetailPageProps = {
  offer: PricingPage;
  visual: "browser" | "shop" | "brand";
};

function PricingVisual({ visual }: { visual: PricingDetailPageProps["visual"] }) {
  if (visual === "browser") {
    return (
      <div className="rounded-xl border border-border bg-background/80 overflow-hidden shadow-2xl">
        <div className="flex items-center gap-2 px-5 py-4 border-b border-border bg-surface/70">
          <span className="h-2.5 w-2.5 rounded-full bg-primary/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/25" />
          <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          <span className="ml-3 text-[10px] uppercase tracking-widest text-muted-foreground">conversion website</span>
        </div>
        <div className="p-7 space-y-5">
          <div className="h-5 w-3/4 rounded bg-foreground/25" />
          <div className="h-3 w-5/6 rounded bg-foreground/12" />
          <div className="h-3 w-1/2 rounded bg-foreground/12" />
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="h-28 rounded-lg bg-primary/25" />
            <div className="h-28 rounded-lg border border-border bg-surface/70" />
            <div className="h-28 rounded-lg bg-primary/12" />
          </div>
          <div className="h-12 rounded-lg bg-primary" />
        </div>
      </div>
    );
  }

  if (visual === "shop") {
    return (
      <div className="rounded-xl border border-border bg-background/80 overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface/70">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">sales dashboard</span>
          <span className="text-[10px] font-mono text-primary">+120 % CR</span>
        </div>
        <div className="grid grid-cols-2 gap-4 p-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface/60 overflow-hidden">
              <div className="aspect-square bg-gradient-to-br from-primary/28 to-transparent" />
              <div className="p-3 space-y-2">
                <div className="h-2 rounded bg-foreground/20" />
                <div className="h-2 w-1/2 rounded bg-primary/70" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-background/80 p-7 shadow-2xl">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="aspect-square rounded-xl border border-border bg-surface/70 grid place-items-center">
          <span className="text-7xl font-black text-primary tracking-tighter">E</span>
        </div>
        <div className="aspect-square rounded-xl border border-primary/30 bg-primary/15 grid place-items-center">
          <span className="text-3xl font-bold text-foreground">brand.</span>
        </div>
      </div>
      <div className="rounded-xl border border-border bg-surface/60 p-4 flex gap-3">
        {["bg-primary", "bg-foreground/75", "bg-primary/45", "bg-foreground/20"].map((c) => (
          <div key={c} className={`${c} h-14 flex-1 rounded-md`} />
        ))}
      </div>
    </div>
  );
}

export function PricingDetailPage({ offer, visual }: PricingDetailPageProps) {
  return (
    <>
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/18 via-primary/5 to-transparent" />
        <div className="container-luxe relative grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Link to="/pricing" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/80 hover:text-foreground transition-colors mb-12">
              <ArrowLeft className="h-3.5 w-3.5" /> Všechny ceníky
            </Link>
            <p className="text-xs uppercase tracking-[0.3em] text-primary mb-6">{offer.eyebrow}</p>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mb-8 leading-[1.05]">
              {offer.title}
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">{offer.description}</p>
            <div className="flex flex-wrap gap-3 mb-10">
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs text-muted-foreground">
                <MessageCircle className="h-3.5 w-3.5 text-primary" /> Nezávazná konzultace zdarma
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" /> Odpovíme do 24 hodin
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> Individuální přístup
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/contact" className="btn-primary group">
                Získat nabídku
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div>
                <p className="text-xs uppercase tracking-widest text-primary mb-1">Cena</p>
                <p className="text-3xl font-bold text-foreground">{offer.price}</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5">
            <PricingVisual visual={visual} />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Popis</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Pro koho dává smysl</h2>
            <p className="text-muted-foreground leading-relaxed">{offer.bestFor}</p>
          </div>
          <div className="lg:col-span-8 grid sm:grid-cols-2 gap-4">
            {offer.included.map((item) => (
              <div key={item} className="rounded-xl border border-border bg-surface/45 p-5 flex items-start gap-3">
                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground/90">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Výsledky</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">Co má investice přinést</h2>
            <p className="text-muted-foreground leading-relaxed">{offer.note}</p>
          </div>
          <div className="lg:col-span-7 grid sm:grid-cols-3 gap-5">
            {offer.results.map((result) => (
              <div key={`${result.value}-${result.label}`} className="rounded-xl border border-primary/25 bg-primary/10 p-7">
                <TrendingUp className="h-5 w-5 text-primary mb-6" />
                <div className="text-4xl font-bold text-foreground tracking-tight mb-2">{result.value}</div>
                <p className="text-sm text-muted-foreground">{result.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="relative overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-transparent p-10 md:p-16 text-center">
            <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative max-w-3xl mx-auto">
              <Target className="h-8 w-8 text-primary mx-auto mb-6" />
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{offer.price}</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-5">
                Chcete přesnou cenu pro váš projekt?
              </h2>
              <p className="text-muted-foreground mb-9">
                Po krátké konzultaci vám pošleme konkrétní návrh rozsahu, ceny a nejbližšího termínu.
              </p>
              <Link to="/contact" className="btn-primary group mx-auto">
                Chci nezávazný návrh
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
