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
              <p className="text-muted-foreground mt-4 max-w-xl">Ukázka různých stylů — od minimalistických wordmarků po monogramy a symbolické značky.</p>
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">8 stylů · wordmark · monogram · ikona · 3D</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "wordmark", bg: "bg-background", content: <div className="text-3xl md:text-4xl font-bold tracking-tighter text-foreground">NORD<span className="text-primary">.</span></div> },
              { label: "serif", bg: "bg-gradient-to-br from-primary/20 to-transparent", content: <div className="text-3xl md:text-4xl italic font-bold tracking-tight text-foreground" style={{ fontFamily: "Georgia, serif" }}>Patecura</div> },
              { label: "icon + text", bg: "bg-foreground", content: <div className="flex items-center gap-2"><span className="text-4xl text-primary">◆</span><span className="text-2xl font-bold tracking-tighter text-background">CORVEX</span></div> },
              { label: "3D mark", bg: "bg-background", content: <div className="flex flex-col items-center gap-2"><div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/40 grid place-items-center text-background text-xl shadow-[0_8px_30px_rgba(59,130,246,0.5)]">▲</div><span className="text-sm font-bold text-foreground">Tinesort</span></div> },
              { label: "monogram", bg: "bg-background", content: <div className="h-14 w-14 rounded-full border-2 border-primary grid place-items-center text-2xl font-bold text-foreground">LM</div> },
              { label: "geometric", bg: "bg-foreground", content: <div className="flex items-center gap-2"><div className="h-8 w-8 bg-primary rotate-45" /><span className="text-xl font-bold text-background tracking-widest">VERDA</span></div> },
              { label: "minimal", bg: "bg-gradient-to-br from-surface to-background", content: <div className="text-2xl font-light tracking-[0.4em] text-foreground">L U M E N</div> },
              { label: "symbol", bg: "bg-background", content: <div className="flex flex-col items-center gap-2"><div className="relative h-12 w-12"><div className="absolute inset-0 rounded-full border-2 border-primary" /><div className="absolute inset-2 rounded-full bg-primary/30" /><div className="absolute inset-4 rounded-full bg-primary shadow-[0_0_15px_rgba(59,130,246,0.7)]" /></div><span className="text-xs font-mono uppercase tracking-widest text-foreground">Pulse</span></div> },
            ].map((logo, i) => (
              <div
                key={i}
                className="group aspect-square rounded-xl border border-border overflow-hidden relative transition-all duration-300 hover:border-primary/60 hover:shadow-[0_15px_50px_-15px_rgba(59,130,246,0.5)] hover:-translate-y-1"
              >
                <div className={`absolute inset-0 ${logo.bg} grid place-items-center p-4 transition-transform duration-500 group-hover:scale-105`}>
                  {logo.content}
                </div>
                <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 h-24 w-24 rounded-full bg-primary/0 group-hover:bg-primary/30 blur-3xl transition-all duration-500" />
                <span className="absolute bottom-2 left-3 text-[9px] font-mono uppercase tracking-[0.25em] text-muted-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity">{logo.label}</span>
              </div>
            ))}
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