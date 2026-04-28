import { createFileRoute, Link } from "@tanstack/react-router";
import { Aperture, ArrowLeft, ArrowRight, Check, Palette, Type } from "lucide-react";

export const Route = createFileRoute("/services/branding")({
  component: BrandingServicePage,
  head: () => ({
    meta: [
      { title: "Značka, kterou si lidé zapamatují — ELEVATE" },
      { name: "description", content: "Logo a branding od 5 000 Kč — logo, barvy, typografie a prémiová vizuální identita." },
      { property: "og:title", content: "Značka, kterou si lidé zapamatují — ELEVATE" },
      { property: "og:description", content: "Branding pro profesionální image a silnější rozpoznatelnost značky." },
    ],
  }),
});

function BrandingServicePage() {
  return (
    <>
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <span aria-hidden className="absolute -right-24 top-8 text-[32rem] font-extrabold leading-none text-foreground/[0.04] select-none">B</span>
        <div className="absolute inset-0 bg-gradient-to-tl from-primary/20 via-primary/5 to-transparent" />
        <div className="container-luxe relative grid lg:grid-cols-12 gap-12">
          <aside className="lg:col-span-2 hidden lg:block pt-20">
            <div className="sticky top-32">
              <div className="h-px w-14 bg-primary mb-4" />
              <p className="text-[10px] font-mono uppercase tracking-[0.35em] text-primary/80 [writing-mode:vertical-rl]">Identity system</p>
            </div>
          </aside>
          <div className="lg:col-span-10">
            <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/80 hover:text-foreground transition-colors mb-12">
              <ArrowLeft className="h-3.5 w-3.5" /> Všechny služby
            </Link>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-6">Branding & logo</p>
            <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tighter mb-10 leading-[0.95] max-w-5xl">
              Značka, kterou si lidé zapamatují
            </h1>
            <p className="text-xl italic text-muted-foreground max-w-2xl mb-10">
              Tvoříme vizuální identitu, která působí profesionálně, konzistentně a okamžitě odlišuje vaši firmu od konkurence.
            </p>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/contact" className="btn-primary group">Získat nabídku <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
              <span className="text-sm text-muted-foreground">od <b className="text-foreground">5 000 Kč</b></span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">Co tvoříme</p>
            <p className="text-3xl md:text-4xl font-bold text-foreground leading-tight italic">Silná identita zvyšuje důvěru ještě před první schůzkou.</p>
          </div>
          <div className="lg:col-span-8 divide-y divide-border border-y border-border">
            {[{ Icon: Aperture, t: "logo" }, { Icon: Palette, t: "barvy" }, { Icon: Type, t: "typografie" }].map(({ Icon, t }, i) => (
              <div key={t} className="py-7 flex items-center gap-6">
                <span className="text-xs font-mono text-primary/70 w-10">0{i + 1}</span>
                <Icon className="h-6 w-6 text-primary" />
                <span className="text-2xl font-bold text-foreground flex-1">{t}</span>
                <Check className="h-5 w-5 text-primary" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <div className="flex items-end justify-between gap-8 flex-wrap mb-12">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Varianty</p>
              <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Logo systém pro různé situace.</h2>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">minimalist · text · 3D · icon</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="aspect-[16/10] rounded-xl border border-border bg-background p-10 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-primary/70">minimalist logo</span>
              <div className="text-center text-7xl font-bold tracking-tighter text-foreground">NORD</div>
              <div className="mx-auto h-px w-20 bg-foreground/40" />
            </div>
            <div className="aspect-[16/10] rounded-xl border border-border bg-gradient-to-br from-primary/20 to-transparent p-10 flex items-center justify-center">
              <div className="text-6xl italic font-bold tracking-tight text-foreground" style={{ fontFamily: "Georgia, serif" }}>Patecura</div>
            </div>
            <div className="aspect-[16/10] rounded-xl border border-border bg-foreground p-10 flex items-center justify-center gap-5">
              <span className="text-8xl text-primary">◆</span>
              <span className="text-5xl font-bold tracking-tighter text-background">CORVEX</span>
            </div>
            <div className="aspect-[16/10] rounded-xl border border-border bg-background p-10 flex flex-col items-center justify-center gap-5">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary grid place-items-center text-background text-4xl">▲</div>
              <span className="text-2xl font-bold text-foreground">Tinesort</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid md:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
          <div className="bg-background p-12">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-8">Výsledek</p>
            <h2 className="text-5xl font-bold text-foreground tracking-tight mb-5">+ profesionální image</h2>
            <p className="text-muted-foreground">Značka působí jednotně na webu, sociálních sítích, vizitkách i v prezentacích.</p>
          </div>
          <div className="bg-surface/40 p-12">
            <p className="text-xs uppercase tracking-widest text-primary mb-6">Nezávazná konzultace zdarma</p>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Odpovíme do 24 hodin · Individuální přístup</p>
            <div className="text-6xl font-bold tracking-tighter text-foreground mb-6">od 5 000 Kč</div>
            <p className="text-sm text-muted-foreground mb-8">Pracujeme s omezeným počtem klientů.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/contact" className="btn-primary">Získat nabídku</Link>
              <Link to="/pricing/branding" className="btn-outline">Zobrazit ceník</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}