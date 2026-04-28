import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BarChart3, Check, CreditCard, Package, ShoppingCart, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/services/eshop")({
  component: EshopServicePage,
  head: () => ({
    meta: [
      { title: "E-shop, který prodává za vás — ELEVATE" },
      { name: "description", content: "Navrhujeme výkonné e-shopy zaměřené na konverze, objednávky a růst prodeje." },
      { property: "og:title", content: "E-shop, který prodává za vás — ELEVATE" },
      { property: "og:description", content: "Výkonný e-shop od 25 000 Kč s UX, platbami a produktovou optimalizací." },
    ],
  }),
});

function EshopServicePage() {
  const products = [
    { name: "Premium Hoodie", sku: "NS-1042", price: "1 990 Kč", tag: "BESTSELLER" },
    { name: "Wool Coat", sku: "NS-1043", price: "5 490 Kč", tag: "NOVINKA" },
    { name: "Leather Bag", sku: "NS-1044", price: "3 290 Kč", tag: "-15 %" },
    { name: "Sneakers", sku: "NS-1045", price: "2 790 Kč", tag: "SKLADEM" },
  ];

  return (
    <>
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/20 via-primary/5 to-transparent" />
        <div className="container-luxe relative grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-primary/80 hover:text-foreground transition-colors mb-12">
              <ArrowLeft className="h-3.5 w-3.5" /> Všechny služby
            </Link>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-6">E-commerce performance</p>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mb-8 leading-[1.05]">
              E-shop, který prodává za vás
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10">
              Navrhujeme e-shopy zaměřené na výkon a prodej. Od struktury kategorií přes produktové stránky až po rychlou cestu k objednávce.
            </p>
            <div className="flex flex-wrap gap-3 mb-10 text-xs text-muted-foreground">
              {[
                "Nezávazná konzultace zdarma",
                "Odpovíme do 24 hodin",
                "Individuální přístup",
              ].map((item) => (
                <span key={item} className="rounded-full border border-border bg-surface/50 px-4 py-2">{item}</span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link to="/contact" className="btn-primary group">Získat nabídku <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></Link>
              <p className="text-sm text-muted-foreground"><span className="text-xs uppercase tracking-widest text-primary mr-2">Cena</span><span className="text-foreground font-bold">od 25 000 Kč</span></p>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="rounded-xl border border-border bg-background/80 backdrop-blur-sm overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-surface/60">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground"><ShoppingCart className="h-4 w-4 text-primary" /> Live katalog</span>
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
        <div className="container-luxe grid lg:grid-cols-12 gap-14">
          <div className="lg:col-span-5">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Co děláme</p>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">Od návštěvy k objednávce bez zbytečného tření.</h2>
          </div>
          <ul className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
            {["návrh struktury e-shopu", "UX optimalizace", "napojení plateb", "optimalizace produktů"].map((item) => (
              <li key={item} className="rounded-xl border border-border bg-surface/40 p-6 flex gap-4"><Check className="h-5 w-5 text-primary shrink-0" /><span className="text-foreground">{item}</span></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-12">Proces</p>
          <ol className="grid md:grid-cols-4 gap-0 border-y border-border">
            {["Analýza", "Návrh", "Vývoj", "Spuštění"].map((step, i) => (
              <li key={step} className="p-8 md:border-r md:last:border-r-0 border-border">
                <div className="text-6xl font-bold text-primary/80 font-mono mb-4">{i + 1}</div>
                <h3 className="text-xl font-bold text-foreground">{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid md:grid-cols-2 gap-6">
          {[{ Icon: TrendingUp, n: "+ vyšší konverze", l: "Lepší produktové stránky, košík a objednávkový tok." }, { Icon: BarChart3, n: "+ více objednávek", l: "E-shop navržený podle nákupního chování zákazníků." }].map(({ Icon, n, l }) => (
            <div key={n} className="rounded-xl border border-border bg-gradient-to-br from-primary/10 to-transparent p-10">
              <Icon className="h-7 w-7 text-primary mb-8" />
              <h3 className="text-4xl font-bold text-foreground mb-4">{n}</h3>
              <p className="text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe text-center">
          <p className="text-xs uppercase tracking-widest text-primary mb-4">Pracujeme s omezeným počtem klientů</p>
          <div className="text-7xl md:text-8xl font-bold tracking-tighter text-foreground mb-8">od 25 000 Kč</div>
          <Link to="/contact" className="btn-primary"><CreditCard className="h-4 w-4" /> Získat nabídku</Link>
        </div>
      </section>
    </>
  );
}