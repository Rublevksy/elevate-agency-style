import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Check,
  Clock,
  CreditCard,
  MessageCircle,
  Package,
  Search,
  ShieldCheck,
  ShoppingCart,
  Smartphone,
  Sparkles,
  TrendingUp,
  Truck,
  Zap,
} from "lucide-react";

export const Route = createFileRoute("/services/eshop")({
  component: EshopServicePage,
  head: () => ({
    meta: [
      { title: "E-shop, který vydělává — ELEVATE" },
      { name: "description", content: "Stavíme výkonné e-shopy zaměřené na konverze, objednávky a růst obratu. Od návrhu přes UX po napojení plateb." },
      { property: "og:title", content: "E-shop, který vydělává — ELEVATE" },
      { property: "og:description", content: "Výkonný e-shop od 25 000 Kč — UX, platby, produktová optimalizace a měřitelné výsledky." },
    ],
  }),
});

const TRUST_BADGES = [
  { Icon: MessageCircle, label: "Nezávazná konzultace zdarma" },
  { Icon: Clock, label: "Odpovíme do 24 hodin" },
  { Icon: Sparkles, label: "Individuální přístup" },
];

const WHAT_WE_DO = [
  { Icon: ShoppingCart, t: "Návrh struktury e-shopu", d: "Kategorie, filtry a navigace tak, aby zákazník našel produkt do tří kliků." },
  { Icon: Smartphone, t: "Mobilní UX optimalizace", d: "Více než 70 % nákupů jde z mobilu — design stavíme primárně pro telefon." },
  { Icon: CreditCard, t: "Napojení plateb a dopravy", d: "Stripe, GoPay, Comgate, Zásilkovna, PPL, DPD — vše připravené ke spuštění." },
  { Icon: Search, t: "Produktová a SEO optimalizace", d: "Produkty vidět ve vyhledávání. Strukturovaná data, popisy, rychlost." },
  { Icon: BarChart3, t: "Analytika a měření prodejů", d: "GA4 + e-commerce události. Víte, co prodává a co ne." },
  { Icon: ShieldCheck, t: "Bezpečnost a stabilita", d: "HTTPS, zálohy, ochrana proti spamu a útokům. Klid pro váš provoz." },
];

const PROCESS = [
  { n: "01", t: "Analýza a strategie", d: "Probereme produkty, cílovku, marže a konkurenci. Stanovíme cíle e-shopu." },
  { n: "02", t: "Návrh UX a designu", d: "Wireframy, vizuální koncept a prototyp. Validujeme dřív, než kódujeme." },
  { n: "03", t: "Vývoj a integrace", d: "Postavíme e-shop, napojíme platby, dopravu, sklad a analytiku." },
  { n: "04", t: "Spuštění a optimalizace", d: "Spustíme, měříme a ladíme konverze. Růst nekončí dnem launche." },
];

const RESULTS = [
  { Icon: TrendingUp, n: "+38 %", l: "vyšší konverzní poměr", d: "Lepší produktové stránky, košík a checkout zaměřený na rychlost." },
  { Icon: ShoppingCart, n: "+2,4×", l: "více objednávek", d: "Struktura kategorií a UX postavené podle reálného nákupního chování." },
  { Icon: Truck, n: "−45 %", l: "opuštěných košíků", d: "Jednoduchý checkout, ukládání rozpracované objednávky a 1-click platba." },
  { Icon: Zap, n: "<1,5 s", l: "načtení stránky", d: "Optimalizace obrázků, cache a moderní stack pro maximální rychlost." },
];

const INCLUDED = [
  "Responzivní design pro všechna zařízení",
  "Produktové stránky s galerií a variantami",
  "Pokročilé filtry a vyhledávání",
  "Správa skladu a stavů produktů",
  "Slevové kupóny a akce",
  "Napojení na účetnictví a sklad",
  "GDPR, cookie lišta, obchodní podmínky",
  "Školení správy a 30 dní podpory zdarma",
];

function EshopServicePage() {
  const products = [
    { name: "Premium Hoodie", sku: "NS-1042", price: "1 990 Kč", tag: "BESTSELLER" },
    { name: "Wool Coat", sku: "NS-1043", price: "5 490 Kč", tag: "NOVINKA" },
    { name: "Leather Bag", sku: "NS-1044", price: "3 290 Kč", tag: "-15 %" },
    { name: "Sneakers", sku: "NS-1045", price: "2 790 Kč", tag: "SKLADEM" },
  ];

  return (
    <>
      {/* HERO */}
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        <div className="container-luxe relative grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/80 hover:text-foreground transition-colors mb-12">
              <ArrowLeft className="h-3.5 w-3.5" /> Všechny služby
            </Link>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-6">E-commerce performance</p>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mb-8 leading-[1.05]">
              E-shop, který za vás <span className="text-primary">vydělává</span>.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10">
              Stavíme e-shopy zaměřené na výkon a prodej. Od struktury kategorií, přes produktové stránky, až po rychlou cestu k objednávce — každý prvek je navržen, aby přinesl víc nákupů.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              {TRUST_BADGES.map(({ Icon, label }) => (
                <span key={label} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/contact" className="btn-primary group">
                Získat nabídku <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <p className="text-sm text-muted-foreground">
                <span className="text-xs uppercase tracking-widest text-primary mr-2">Cena</span>
                <span className="text-foreground font-bold">od 25 000 Kč</span>
              </p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-background/80 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface/60">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground">
                  <ShoppingCart className="h-4 w-4 text-primary" /> Live katalog
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

      {/* WHAT WE DO */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="grid lg:grid-cols-12 gap-12 mb-16">
            <div className="lg:col-span-5">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Co děláme</p>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                Od návštěvy k objednávce <br />bez zbytečného tření.
              </h2>
            </div>
            <p className="lg:col-span-7 text-lg text-muted-foreground self-end">
              Každý e-shop stavíme jako prodejní stroj. Promyšlený UX, rychlost a konverzně optimalizovaný checkout. Vše, co zákazník potřebuje k nákupu, najde okamžitě.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WHAT_WE_DO.map(({ Icon, t, d }) => (
              <div key={t} className="rounded-xl border border-border bg-surface/40 p-7 hover:border-primary/40 transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/15 grid place-items-center mb-5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Proces</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-16 max-w-2xl">
            Jasný plán. Žádná překvapení.
          </h2>
          <ol className="grid md:grid-cols-2 lg:grid-cols-4 gap-0 border-y border-border">
            {PROCESS.map((step, i) => (
              <li key={step.n} className={`p-8 border-border ${i < PROCESS.length - 1 ? "lg:border-r md:[&:nth-child(odd)]:border-r" : ""} ${i < 2 ? "md:border-b lg:border-b-0" : ""}`}>
                <div className="text-5xl font-bold text-primary/80 font-mono mb-5">{step.n}</div>
                <h3 className="text-xl font-bold text-foreground mb-3">{step.t}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Výsledky</p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-16 max-w-2xl">
            Co reálně dostanete.
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {RESULTS.map(({ Icon, n, l, d }) => (
              <div key={l} className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-7">
                <Icon className="h-6 w-6 text-primary mb-6" />
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{n}</div>
                <p className="text-sm text-primary font-medium mb-3">{l}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INCLUDED */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">V ceně</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground mb-6">
              Vše, co e-shop potřebuje k provozu.
            </h2>
            <p className="text-muted-foreground">
              Žádné skryté náklady ani překvapení po spuštění. Dostanete e-shop připravený prodávat od prvního dne.
            </p>
          </div>
          <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-3">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-3 rounded-lg border border-border bg-surface/60 p-4">
                <Check className="h-5 w-5 text-primary mt-0.5 shrink-0" />
                <span className="text-sm text-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PRICING + CTA */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-surface to-transparent p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative">
              <p className="text-xs uppercase tracking-widest text-primary mb-4">Pracujeme s omezeným počtem klientů</p>
              <div className="text-6xl md:text-8xl font-bold tracking-tighter text-foreground mb-3">od 25 000 Kč</div>
              <p className="text-muted-foreground max-w-xl mx-auto mb-10">
                Konečnou cenu navrhneme po konzultaci podle počtu produktů, integrací a funkcí. Nezávazně a zdarma.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-10 text-xs text-muted-foreground">
                {TRUST_BADGES.map(({ Icon, label }) => (
                  <span key={label} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                    <Icon className="h-3.5 w-3.5 text-primary" /> {label}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Link to="/contact" className="btn-primary">
                  <CreditCard className="h-4 w-4" /> Chci nezávaznou nabídku
                </Link>
                <Link to="/pricing" className="btn-outline">Zobrazit ceník</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
