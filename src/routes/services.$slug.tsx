import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft, ArrowRight, Check, Clock, Sparkles, UserCog,
  ShoppingCart, CreditCard, Package, TrendingUp, BarChart3,
  Monitor, Smartphone, Gauge, Search, Star,
  Palette, Type, Layers, Aperture,
} from "lucide-react";
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
  const typedSlug = slug as ServiceSlug;
  const { t, lang } = useT();
  const detail = getServiceDetails(lang, typedSlug);
  if (!detail) return null;
  const labels = t.services.detailLabels;

  if (typedSlug === "eshop")    return <><EshopPage labels={labels} /><CtaBanner /></>;
  if (typedSlug === "web")      return <><WebPage labels={labels} /><CtaBanner /></>;
  if (typedSlug === "branding") return <><BrandingPage labels={labels} /><CtaBanner /></>;
  return <><DesignPage detail={detail} labels={labels} /><CtaBanner /></>;
}

// ─── tiny shared atoms ────────────────────────────────────────────
type Labels = ReturnType<typeof useT>["t"]["services"]["detailLabels"];

function BackLink({ label, color = "text-muted-foreground" }: { label: string; color?: string }) {
  return (
    <Link to="/services" className={`inline-flex items-center gap-2 text-xs uppercase tracking-widest ${color} hover:text-foreground transition-colors`}>
      <ArrowLeft className="h-3.5 w-3.5" /> {label}
    </Link>
  );
}

function Trust({ labels, dot = "bg-primary" }: { labels: Labels; dot?: string }) {
  const items = [
    { Icon: Sparkles, t: labels.free },
    { Icon: Clock,    t: labels.reply },
    { Icon: UserCog,  t: labels.individual },
  ];
  return (
    <div className="flex flex-wrap gap-3">
      {items.map(({ Icon, t }) => (
        <span key={t} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs text-muted-foreground">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
          {t}
        </span>
      ))}
    </div>
  );
}

function CtaButton({ label }: { label: string }) {
  return (
    <Link to="/contact" className="btn-primary inline-flex items-center justify-center gap-2 group">
      {label}
      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
    </Link>
  );
}

// ════════════════════════════════════════════════════════════════════
// E-SHOP — green, product-driven, sales funnel rhythm
// Headline + What we do (✔) + Process (4 steps) + Product grid + Results + Pricing
// ════════════════════════════════════════════════════════════════════
function EshopPage({ labels }: { labels: Labels }) {
  const whatWeDo = [
    "Návrh struktury e-shopu",
    "UX pro vyšší konverze",
    "Napojení plateb a dopravy",
    "Optimalizace produktových stránek",
  ];
  const process = ["Analýza produktu", "Návrh e-shopu", "Design a vývoj", "Testování a spuštění"];
  const clientGets = ["Více objednávek", "Vyšší konverze", "Lepší UX zákazníka"];
  const products = [
    { name: "Premium Hoodie", sku: "NS-1042", price: "€129", tag: "BESTSELLER" },
    { name: "Wool Overcoat",  sku: "NS-1043", price: "€349", tag: "NEW" },
    { name: "Linen Shirt",    sku: "NS-1044", price: "€89",  tag: "−15%" },
    { name: "Leather Boots",  sku: "NS-1045", price: "€259", tag: "NEW" },
  ];

  return (
    <>
      {/* HERO — stacked, emerald accent, product strip preview */}
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-400/20 via-emerald-400/5 to-transparent" />
        <div className="container-luxe relative">
          <div className="mb-12"><BackLink label={labels.back} color="text-emerald-300/80" /></div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-300 mb-6">02 / E-COMMERCE</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mb-8 leading-[1.05]">
            E-shop, který prodává za vás
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-10">
            Navrhujeme e-shopy, které z návštěvníků dělají zákazníky.
          </p>
          <div className="mb-10"><Trust labels={labels} dot="bg-emerald-300" /></div>
          <div className="flex flex-wrap items-center gap-6">
            <CtaButton label="Získat nabídku" />
            <p className="text-sm text-muted-foreground">
              <span className="text-xs uppercase tracking-widest text-emerald-300 mr-2">Od</span>
              <span className="text-foreground font-bold text-base">25 000 Kč</span>
            </p>
          </div>
        </div>
      </section>

      {/* WHAT WE DO — checklist on left, mini cart visualisation on right */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 mb-6">Co děláme</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-10">
              Postavíme e-shop, který opravdu&nbsp;prodává.
            </h2>
            <ul className="space-y-4 max-w-xl">
              {whatWeDo.map((item) => (
                <li key={item} className="flex items-start gap-4 border-b border-border pb-4">
                  <span className="text-emerald-300 text-lg leading-none mt-1">✔</span>
                  <span className="text-base text-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* mock checkout card */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-6 bg-gradient-to-br from-emerald-400/20 to-transparent blur-2xl rounded-3xl" />
              <div className="relative rounded-2xl border border-border bg-background/80 backdrop-blur-sm p-6 shadow-2xl">
                <div className="flex items-center justify-between pb-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4 text-emerald-300" strokeWidth={1.5} />
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Košík</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">3 položky</span>
                </div>
                <ul className="py-4 space-y-3">
                  {products.slice(0, 3).map((p) => (
                    <li key={p.sku} className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-gradient-to-br from-emerald-400/30 to-primary/10 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground truncate">{p.name}</p>
                        <p className="text-[10px] font-mono text-muted-foreground">{p.sku}</p>
                      </div>
                      <span className="text-sm text-foreground font-bold tabular-nums">{p.price}</span>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">Celkem</span>
                  <span className="text-lg text-foreground font-bold">€567</span>
                </div>
                <button className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-md bg-emerald-300 text-background font-bold py-3 text-sm">
                  <CreditCard className="h-4 w-4" strokeWidth={2} /> Pokladna
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS — horizontal stepper with big numerals */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 mb-12">Jak to probíhá</p>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {process.map((step, i) => (
              <li key={step} className="relative px-6 py-8 border-t-2 border-emerald-300/40 md:border-r md:border-r-border md:last:border-r-0">
                <div className="text-6xl font-bold text-emerald-300/80 mb-4 font-mono leading-none">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-base font-bold text-foreground">{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* PRODUCT SHOWCASE — real product grid look */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 mb-3">Ukázky e-shopů</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Tak vypadá produktová stránka, která prodává.</h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">12 / 248 produktů</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {products.map((p, i) => (
              <div key={p.sku} className="hover-lift rounded-xl border border-border bg-background/60 overflow-hidden group">
                <div className="aspect-square bg-gradient-to-br from-emerald-400/20 via-primary/10 to-transparent relative">
                  <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-emerald-300/90 bg-background/70 px-2 py-1 rounded">
                    {p.tag}
                  </span>
                  <div className="absolute bottom-3 right-3 h-9 w-9 rounded-full bg-foreground/90 grid place-items-center text-background">
                    <Package className="h-4 w-4" strokeWidth={2} />
                  </div>
                  <div className="absolute inset-x-0 bottom-0 p-3 flex items-center gap-1">
                    {[...Array(5)].map((_, s) => (
                      <Star key={s} className={`h-3 w-3 ${s < 4 ? "text-emerald-300 fill-emerald-300" : "text-muted-foreground/40"}`} strokeWidth={1.5} />
                    ))}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">{p.sku}</p>
                  <p className="text-sm text-foreground mt-1 font-medium truncate">{p.name}</p>
                  <div className="flex items-baseline justify-between mt-2">
                    <p className="text-base text-emerald-300 font-bold">{p.price}</p>
                    <span className="text-[10px] text-muted-foreground">skladem</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT CLIENT GETS — 3 KPI cards */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 mb-12">Co klient získá</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { Icon: TrendingUp, n: "+85%", l: clientGets[0] },
              { Icon: BarChart3,  n: "3×",   l: clientGets[1] },
              { Icon: Sparkles,   n: "−40%", l: "opuštěných košíků — " + clientGets[2] },
            ].map(({ Icon, n, l }) => (
              <div key={l} className="hover-lift p-10 rounded-xl border border-border bg-gradient-to-br from-emerald-400/10 to-transparent">
                <Icon className="h-6 w-6 text-emerald-300 mb-6" strokeWidth={1.5} />
                <div className="text-6xl font-bold text-foreground tracking-tight mb-3">{n}</div>
                <div className="text-sm text-muted-foreground">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING + CTA — bold price */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-300 mb-4">Cena</p>
          <div className="text-7xl md:text-8xl font-bold text-foreground tracking-tighter mb-6">od 25 000 Kč</div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-10">
            Pracujeme jen s omezeným počtem klientů.
          </p>
          <div className="flex justify-center mb-8"><Trust labels={labels} dot="bg-emerald-300" /></div>
          <CtaButton label="Získat nabídku" />
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// WEB — blue/primary, browser & device mockups, side-by-side rhythm
// Headline + What you get + Process (4) + Browser preview + Results + Pricing
// ════════════════════════════════════════════════════════════════════
function WebPage({ labels }: { labels: Labels }) {
  const whatYouGet = [
    { Icon: Palette,    t: "Design na míru" },
    { Icon: Smartphone, t: "Responzivní web" },
    { Icon: Search,     t: "SEO základ" },
    { Icon: Gauge,      t: "Rychlé načítání" },
  ];
  const process = ["Konzultace", "Návrh", "Vývoj", "Spuštění"];
  const results = [
    { n: "+120%", l: "více poptávek" },
    { n: "<2s",   l: "doba načtení" },
    { n: "Top 10", l: "pozice v Google" },
  ];

  return (
    <>
      {/* HERO — split: copy left, browser mockup right */}
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/5 to-transparent [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_70%)]" />
        <div className="container-luxe relative grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            <div className="mb-12"><BackLink label={labels.back} color="text-primary/80" /></div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-6">01 / WEB</p>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-8 leading-[1.05]">
              Webové stránky, které přivádí klienty
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-10">
              Tvoříme weby, které budují důvěru a přinášejí poptávky.
            </p>
            <div className="mb-10"><Trust labels={labels} dot="bg-primary" /></div>
            <div className="flex flex-wrap items-center gap-6">
              <CtaButton label="Nezávazná konzultace" />
              <p className="text-sm text-muted-foreground">
                <span className="text-xs uppercase tracking-widest text-primary mr-2">Od</span>
                <span className="text-foreground font-bold text-base">10 000 Kč</span>
              </p>
            </div>
          </div>

          {/* device mockup: browser + phone */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-primary/20 to-transparent blur-3xl rounded-3xl" />
              <div className="relative rounded-xl border border-border bg-background/80 backdrop-blur-sm overflow-hidden shadow-2xl">
                <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-surface/60">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
                  <span className="ml-3 text-[10px] font-mono text-muted-foreground">elevate.studio</span>
                </div>
                <div className="p-6 space-y-4">
                  <div className="h-3 w-1/2 rounded bg-foreground/30" />
                  <div className="h-2 w-2/3 rounded bg-foreground/15" />
                  <div className="h-2 w-1/2 rounded bg-foreground/15" />
                  <div className="grid grid-cols-3 gap-3 pt-4">
                    <div className="h-20 rounded-lg bg-gradient-to-br from-primary/40 to-primary/5" />
                    <div className="h-20 rounded-lg bg-gradient-to-br from-primary/20 to-transparent border border-border" />
                    <div className="h-20 rounded-lg bg-gradient-to-br from-primary/30 to-transparent border border-border" />
                  </div>
                  <div className="flex items-center justify-between pt-3">
                    <div className="h-9 w-28 rounded-md bg-primary/90" />
                    <div className="h-9 w-16 rounded-md border border-border" />
                  </div>
                </div>
              </div>
              {/* phone overlap */}
              <div className="absolute -bottom-10 -left-8 hidden md:block w-32 rounded-2xl border-4 border-foreground/80 bg-background overflow-hidden shadow-2xl">
                <div className="h-3 bg-foreground/80" />
                <div className="p-2 space-y-2">
                  <div className="h-2 w-2/3 rounded bg-foreground/30" />
                  <div className="h-1.5 w-full rounded bg-foreground/15" />
                  <div className="h-16 rounded bg-gradient-to-br from-primary/40 to-primary/10" />
                  <div className="h-5 w-full rounded bg-primary/90" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET — 4 icon tiles */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-8">Co dostanete</p>
          <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight max-w-2xl mb-12">
            Web, který buduje důvěru a&nbsp;pracuje pro vás 24/7.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {whatYouGet.map(({ Icon, t }) => (
              <div key={t} className="hover-lift p-8 rounded-xl border border-border bg-surface/40 relative">
                <Icon className="h-6 w-6 text-primary mb-6" strokeWidth={1.5} />
                <p className="text-base text-foreground font-medium leading-relaxed flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" strokeWidth={2.5} /> {t}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — vertical timeline on alternating rail */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">Proces</p>
            <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Čtyři kroky od nápadu k&nbsp;živému webu.</h3>
          </div>
          <div className="lg:col-span-8">
            <ol className="relative border-l border-border pl-8 space-y-10">
              {process.map((step, i) => (
                <li key={step} className="relative">
                  <span className="absolute -left-[42px] top-0 grid h-9 w-9 place-items-center rounded-full border border-primary/40 bg-background text-sm font-mono text-primary">
                    {i + 1}
                  </span>
                  <h4 className="text-xl font-bold text-foreground">{step}</h4>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* RESULTS strip */}
      <section className="py-20 border-t border-border">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-8">Výsledky</p>
          <div className="grid md:grid-cols-3 gap-8">
            {results.map((r) => (
              <div key={r.l} className="border-t border-border pt-6">
                <div className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">{r.n}</div>
                <div className="text-sm text-muted-foreground uppercase tracking-widest mt-3">{r.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING CTA — quiet card */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-10 md:p-14">
            <div className="grid lg:grid-cols-3 gap-10 items-center">
              <div className="lg:col-span-2">
                <p className="text-xs uppercase tracking-widest text-primary mb-3">Cena</p>
                <h3 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-4">od 10 000 Kč</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xl">Pracujeme jen s omezeným počtem klientů.</p>
                <Trust labels={labels} dot="bg-primary" />
              </div>
              <div className="lg:text-right">
                <CtaButton label="Nezávazná konzultace" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// BRANDING — amber editorial: dark hero, big serif-feel display, logo gallery
// Headline + What we create (4) + Variants (4 logo styles) + Result + Pricing
// ════════════════════════════════════════════════════════════════════
function BrandingPage({ labels }: { labels: Labels }) {
  const whatWeCreate = [
    { Icon: Aperture, t: "Logo (více variant)" },
    { Icon: Palette,  t: "Barevná paleta" },
    { Icon: Type,     t: "Typografie" },
    { Icon: Layers,   t: "Brand guideline" },
  ];
  const variants = [
    { kind: "Minimalist", name: "NORD", mark: "—" },
    { kind: "Text logo",  name: "Patecura", mark: "" },
    { kind: "3D logo",    name: "CORVEX", mark: "◆" },
    { kind: "Icon logo",  name: "Tinesort", mark: "▲" },
  ];
  const result = ["Silná značka", "Profesionální image", "Konzistence ve všech kanálech"];

  return (
    <>
      {/* HERO — editorial, asymmetric, giant letter B */}
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tl from-amber-300/20 via-amber-300/5 to-transparent" />
        <span aria-hidden className="absolute right-[-6rem] top-10 text-[40rem] font-extrabold leading-none text-foreground/[0.04] select-none pointer-events-none tracking-tighter">
          B
        </span>
        <div className="container-luxe relative grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-32 space-y-3">
              <span className="block h-px w-12 bg-amber-300/60" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300/70">Identity studio</p>
            </div>
          </div>
          <div className="lg:col-span-10">
            <div className="mb-12"><BackLink label={labels.back} color="text-amber-300/80" /></div>
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300 mb-6">03 / BRANDING</p>
            <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tighter mb-10 leading-[0.95]">
              Značka, kterou si lidé&nbsp;zapamatují
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10 italic">
              Navrhujeme identitu, která buduje důvěru.
            </p>
            <div className="mb-10"><Trust labels={labels} dot="bg-amber-300" /></div>
            <div className="flex flex-wrap items-center gap-6">
              <CtaButton label="Začít projekt" />
              <p className="text-sm text-muted-foreground">
                <span className="text-xs uppercase tracking-widest text-amber-300 mr-2">Od</span>
                <span className="text-foreground font-bold text-base">5 000 Kč</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE CREATE — pull quote + 4 list rows */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-6">Co tvoříme</p>
            <p className="text-2xl md:text-3xl font-bold text-foreground leading-snug tracking-tight italic">
              "Silná identita = silnější byznys."
            </p>
          </div>
          <div className="lg:col-span-8">
            <ul className="divide-y divide-border border-y border-border">
              {whatWeCreate.map(({ Icon, t }, i) => (
                <li key={t} className="py-6 flex items-center gap-6">
                  <span className="text-xs font-mono text-amber-300/70 w-10">{String(i + 1).padStart(2, "0")}</span>
                  <Icon className="h-5 w-5 text-amber-300" strokeWidth={1.5} />
                  <span className="text-xl text-foreground tracking-tight flex-1">{t}</span>
                  <span className="text-amber-300/60 text-xl">✔</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* VARIANTS — 4 logo cards, each visually distinct */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-3">Varianty loga</p>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Čtyři přístupy. Jedna identita.</h2>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Logo system 01–04</span>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Minimalist */}
            <div className="hover-lift aspect-[16/10] rounded-xl border border-border bg-background relative overflow-hidden p-12 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300/70">Minimalist</span>
              <div className="text-center">
                <div className="text-7xl font-bold tracking-tighter text-foreground">NORD</div>
                <div className="mt-2 mx-auto h-px w-16 bg-foreground/40" />
              </div>
              <span className="text-[10px] font-mono text-muted-foreground self-end">© ELEVATE</span>
            </div>
            {/* Text logo */}
            <div className="hover-lift aspect-[16/10] rounded-xl border border-border bg-gradient-to-br from-amber-300/20 to-transparent relative overflow-hidden p-12 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300/70">Text logo</span>
              <div className="text-center">
                <div className="text-6xl italic font-bold tracking-tight text-foreground" style={{ fontFamily: "Georgia, serif" }}>
                  Patecura
                </div>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground self-end">© ELEVATE</span>
            </div>
            {/* 3D logo */}
            <div className="hover-lift aspect-[16/10] rounded-xl border border-border bg-foreground relative overflow-hidden p-12 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300">3D logo</span>
              <div className="flex items-center justify-center gap-4">
                <span className="text-8xl text-amber-300 drop-shadow-[0_8px_20px_rgba(252,211,77,0.4)]">◆</span>
                <span className="text-5xl font-bold tracking-tighter text-background">CORVEX</span>
              </div>
              <span className="text-[10px] font-mono text-background/60 self-end">© ELEVATE</span>
            </div>
            {/* Icon logo */}
            <div className="hover-lift aspect-[16/10] rounded-xl border border-border bg-background relative overflow-hidden p-12 flex flex-col justify-between">
              <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300/70">Icon logo</span>
              <div className="flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-amber-300 to-primary grid place-items-center">
                  <span className="text-4xl text-background">▲</span>
                </div>
                <span className="text-2xl font-bold tracking-tight text-foreground">Tinesort</span>
              </div>
              <span className="text-[10px] font-mono text-muted-foreground self-end">© ELEVATE</span>
            </div>
          </div>
          <p className="mt-6 text-xs text-muted-foreground text-center">
            {variants.map(v => v.kind).join(" · ")}
          </p>
        </div>
      </section>

      {/* RESULT — minimalist tracker + 3 outcomes */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
          <div className="bg-background p-12">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-8">Výsledek</p>
            <ul className="space-y-6">
              {result.map((r, i) => (
                <li key={r} className="flex items-baseline gap-5 border-b border-border pb-5">
                  <span className="text-3xl font-bold text-foreground tabular-nums">0{i + 1}</span>
                  <span className="text-lg text-foreground tracking-tight">{r}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface/30 p-12">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-8">V číslech</p>
            <ul className="space-y-6">
              {[
                { n: "+60%",     l: "rozpoznatelnost značky" },
                { n: "100%",     l: "konzistence napříč kanály" },
                { n: "Premium",  l: "vnímání trhem" },
              ].map((r) => (
                <li key={r.l} className="flex items-baseline gap-5 border-b border-border pb-5">
                  <span className="text-3xl font-bold text-amber-300 tabular-nums">{r.n}</span>
                  <span className="text-base text-muted-foreground">{r.l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* PRICING — editorial split */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-6">Cena</p>
            <div className="text-7xl md:text-8xl font-bold text-foreground tracking-tighter">od 5 000 Kč</div>
            <p className="mt-6 text-sm text-muted-foreground italic max-w-md">Pracujeme jen s omezeným počtem klientů.</p>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Trust labels={labels} dot="bg-amber-300" />
            <CtaButton label="Začít projekt" />
          </div>
        </div>
      </section>
    </>
  );
}

// ════════════════════════════════════════════════════════════════════
// DESIGN — kept compact, fuchsia poster rhythm, uses i18n detail
// ════════════════════════════════════════════════════════════════════
type Detail = NonNullable<ReturnType<typeof getServiceDetails>>;

function DesignPage({ detail, labels }: { detail: Detail; labels: Labels }) {
  return (
    <>
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-400/20 via-fuchsia-400/5 to-transparent [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]" />
        <div className="container-luxe relative text-center">
          <div className="text-left mb-12"><BackLink label={labels.back} color="text-fuchsia-400/80" /></div>
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-fuchsia-400 mb-6">04 / DESIGN</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mx-auto mb-8 leading-[1.05]">
            {detail.headline}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">{detail.intro}</p>
          <div className="flex justify-center mb-10"><Trust labels={labels} dot="bg-fuchsia-400" /></div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            <CtaButton label={labels.cta} />
            <p className="text-sm text-muted-foreground">
              <span className="text-xs uppercase tracking-widest text-fuchsia-400 mr-2">{labels.startingAt}</span>
              <span className="text-foreground font-bold text-base">{detail.pricing}</span>
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-400 mb-12 text-center">{labels.benefits}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {detail.benefits.map((b, i) => (
              <div key={b} className="hover-lift p-8 rounded-xl border border-border bg-background/60 relative">
                <span className="absolute top-4 right-5 text-xs font-mono text-fuchsia-400/60">0{i + 1}</span>
                <Check className="h-5 w-5 text-fuchsia-400 mb-4" strokeWidth={2} />
                <p className="text-base text-foreground leading-relaxed">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-2 gap-16">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-400 mb-8">{labels.process}</p>
            <ol className="space-y-4">
              {detail.process.map((step, i) => (
                <li key={step} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-surface/40">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-fuchsia-400 to-primary text-background text-sm font-bold">{i + 1}</span>
                  <span className="text-base text-foreground">{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-400 mb-8">{labels.results}</p>
            <div className="grid grid-cols-2 gap-4">
              {detail.results.map((r) => (
                <div key={r.l} className="p-6 rounded-xl border border-border bg-gradient-to-br from-fuchsia-400/10 to-transparent">
                  <div className="text-4xl font-bold text-foreground">{r.n}</div>
                  <div className="text-xs text-muted-foreground mt-2">{r.l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe text-center">
          <p className="text-xs uppercase tracking-widest text-fuchsia-400 mb-4">{labels.pricing}</p>
          <div className="text-6xl md:text-7xl font-bold text-foreground tracking-tighter mb-6">{detail.pricing}</div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">{labels.exclusivity}</p>
          <div className="flex justify-center mb-8"><Trust labels={labels} dot="bg-fuchsia-400" /></div>
          <CtaButton label={labels.cta} />
        </div>
      </section>
    </>
  );
}
