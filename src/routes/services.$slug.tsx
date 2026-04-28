import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Check, Clock, Sparkles, UserCog, ArrowRight, Circle } from "lucide-react";
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

// ─────────────────────────────────────────────────────────────────────
// Per-service visual themes (each page must feel different)
// ─────────────────────────────────────────────────────────────────────
type Theme = {
  accent: string;          // hex/oklch token used for hero accent line
  heroLayout: "split" | "stacked" | "editorial" | "centered";
  badgeLabel: string;      // e.g. "01 / WEB"
};

const THEMES: Record<ServiceSlug, Theme> = {
  web:      { accent: "from-primary/40 via-primary/10 to-transparent", heroLayout: "split",     badgeLabel: "01 / WEB" },
  eshop:    { accent: "from-emerald-400/30 via-primary/10 to-transparent", heroLayout: "stacked",  badgeLabel: "02 / E-COMMERCE" },
  branding: { accent: "from-amber-300/30 via-primary/10 to-transparent",   heroLayout: "editorial", badgeLabel: "03 / BRANDING" },
  design:   { accent: "from-fuchsia-400/30 via-primary/10 to-transparent", heroLayout: "centered",  badgeLabel: "04 / DESIGN" },
};

function ServiceDetailPage() {
  const { slug } = Route.useParams();
  const typedSlug = slug as ServiceSlug;
  const { t, lang } = useT();
  const detail = getServiceDetails(lang, typedSlug);
  if (!detail) return null;
  const labels = t.services.detailLabels;
  const theme = THEMES[typedSlug];

  return (
    <>
      {/* HERO — unique per slug */}
      <ServiceHero slug={typedSlug} theme={theme} detail={detail} labels={labels} />

      {/* BODY — completely different layout per service */}
      <ServiceBody slug={typedSlug} detail={detail} labels={labels} />

      <CtaBanner />
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// HERO — different layout per service
// ═══════════════════════════════════════════════════════════════════
function ServiceHero({
  slug, theme, detail, labels,
}: {
  slug: ServiceSlug;
  theme: Theme;
  detail: ReturnType<typeof getServiceDetails> & object;
  labels: ReturnType<typeof useT>["t"]["services"]["detailLabels"];
}) {
  const chips = (
    <div className="flex flex-wrap gap-3">
      {[labels.reply, labels.free, labels.individual].map((chip) => (
        <span key={chip} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {chip}
        </span>
      ))}
    </div>
  );

  const cta = (
    <div className="flex flex-wrap items-center gap-6">
      <Link to="/contact" className="btn-primary inline-flex items-center gap-2 group">
        {labels.cta}
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
      </Link>
      <p className="text-sm text-muted-foreground">
        <span className="text-xs uppercase tracking-widest text-primary mr-2">{labels.startingAt}</span>
        <span className="text-foreground font-bold">{detail!.pricing}</span>
      </p>
    </div>
  );

  const back = (
    <Link to="/services" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-12">
      <ArrowLeft className="h-3.5 w-3.5" /> {labels.back}
    </Link>
  );

  // SPLIT — Web (mockup right)
  if (theme.heroLayout === "split") {
    return (
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.accent} opacity-60 [mask-image:radial-gradient(ellipse_at_top_left,black_10%,transparent_70%)]`} />
        <div className="container-luxe relative grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7">
            {back}
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-primary mb-6">{theme.badgeLabel}</p>
            <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight mb-8 leading-[1.05]">{detail!.headline}</h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-10">{detail!.intro}</p>
            <div className="mb-10">{chips}</div>
            {cta}
          </div>
          <div className="lg:col-span-5">
            <BrowserMockup />
          </div>
        </div>
      </section>
    );
  }

  // STACKED — E-shop (product grid below)
  if (theme.heroLayout === "stacked") {
    return (
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-b ${theme.accent} opacity-60`} />
        <div className="container-luxe relative">
          {back}
          <p className="text-xs font-mono uppercase tracking-[0.3em] text-emerald-400 mb-6">{theme.badgeLabel}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mb-8 leading-[1.05]">{detail!.headline}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-10">{detail!.intro}</p>
          <div className="mb-12">{chips}</div>
          {cta}
        </div>
      </section>
    );
  }

  // EDITORIAL — Branding (giant typography, asymmetric)
  if (theme.heroLayout === "editorial") {
    return (
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-tl ${theme.accent} opacity-60`} />
        <span aria-hidden className="absolute right-[-4rem] top-20 text-[36rem] font-extrabold leading-none text-foreground/[0.04] select-none pointer-events-none tracking-tighter">B</span>
        <div className="container-luxe relative grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-2 hidden lg:block">
            <div className="sticky top-32 space-y-3">
              <span className="block h-px w-12 bg-amber-300/50" />
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-amber-300/70">Identity studio</p>
            </div>
          </div>
          <div className="lg:col-span-10">
            {back}
            <p className="text-xs font-mono uppercase tracking-[0.3em] text-amber-300 mb-6">{theme.badgeLabel}</p>
            <h1 className="text-6xl md:text-8xl font-bold text-foreground tracking-tighter mb-10 leading-[0.95]">{detail!.headline}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mb-10 italic">{detail!.intro}</p>
            <div className="mb-10">{chips}</div>
            {cta}
          </div>
        </div>
      </section>
    );
  }

  // CENTERED — Design (poster style)
  return (
    <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-b ${theme.accent} opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_70%)]`} />
      <div className="container-luxe relative text-center">
        <div className="text-left mb-12">{back}</div>
        <p className="text-xs font-mono uppercase tracking-[0.3em] text-fuchsia-400 mb-6">{theme.badgeLabel}</p>
        <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mx-auto mb-8 leading-[1.05]">{detail!.headline}</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">{detail!.intro}</p>
        <div className="flex justify-center mb-10">{chips}</div>
        <div className="flex justify-center">{cta}</div>
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SHOWCASE — unique visual per service
// ═══════════════════════════════════════════════════════════════════
function ServiceShowcase({ slug, detail }: { slug: ServiceSlug; detail: NonNullable<ReturnType<typeof getServiceDetails>> }) {
  if (slug === "web") return <WebShowcase examples={detail.examples} />;
  if (slug === "eshop") return <EshopShowcase examples={detail.examples} />;
  if (slug === "branding") return <BrandingShowcase examples={detail.examples} />;
  return <DesignShowcase examples={detail.examples} />;
}

// — Web: stacked browser windows
function WebShowcase({ examples }: { examples: string[] }) {
  return (
    <section className="py-24 md:py-32 border-t border-border bg-surface/30">
      <div className="container-luxe grid md:grid-cols-3 gap-6">
        {examples.slice(0, 3).map((ex, i) => (
          <div key={ex} className="hover-lift rounded-xl border border-border bg-background/60 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-surface/40">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
              <span className="ml-3 text-[10px] font-mono text-muted-foreground truncate">elevate.app/{i + 1}</span>
            </div>
            <div className="p-6 space-y-3">
              <div className="h-2 w-2/3 rounded bg-foreground/20" />
              <div className="h-2 w-1/2 rounded bg-foreground/10" />
              <div className="mt-6 h-24 rounded-lg bg-gradient-to-br from-primary/30 to-primary/5" />
              <p className="text-sm text-foreground pt-3 font-medium">{ex}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// — E-shop: product card grid
function EshopShowcase({ examples }: { examples: string[] }) {
  return (
    <section className="py-24 md:py-32 border-t border-border bg-surface/30">
      <div className="container-luxe grid grid-cols-2 md:grid-cols-4 gap-5">
        {examples.slice(0, 4).map((ex, i) => (
          <div key={ex} className="hover-lift rounded-xl border border-border bg-background/60 overflow-hidden group">
            <div className="aspect-square bg-gradient-to-br from-emerald-400/20 via-primary/10 to-transparent relative">
              <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-emerald-300/80 bg-background/60 px-2 py-1 rounded">New</span>
              <div className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-foreground/90 grid place-items-center text-background text-xs font-bold">+</div>
            </div>
            <div className="p-4">
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">SKU-{1000 + i}</p>
              <p className="text-sm text-foreground mt-1 font-medium truncate">{ex}</p>
              <p className="text-sm text-emerald-300 mt-1 font-bold">€{(49 + i * 30)}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// — Branding: logo lockups
function BrandingShowcase({ examples }: { examples: string[] }) {
  const marks = ["◆", "▲", "●", "■"];
  return (
    <section className="py-24 md:py-32 border-t border-border bg-surface/30">
      <div className="container-luxe grid md:grid-cols-2 gap-6">
        {examples.slice(0, 4).map((ex, i) => (
          <div key={ex} className="hover-lift aspect-[16/10] rounded-xl border border-border bg-background/60 p-10 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-300/10 to-transparent" />
            <div className="relative flex items-center gap-4">
              <span className="text-4xl text-amber-300/90">{marks[i % marks.length]}</span>
              <span className="text-2xl font-bold tracking-tight text-foreground uppercase">{ex.split(" ")[0]}</span>
            </div>
            <div className="relative flex items-end justify-between">
              <p className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">Logo system 0{i + 1}</p>
              <span className="text-[10px] font-mono text-amber-300/70">© ELEVATE</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// — Design: poster/swatch grid
function DesignShowcase({ examples }: { examples: string[] }) {
  const swatches = [
    "from-fuchsia-400 to-primary",
    "from-primary to-emerald-400",
    "from-amber-300 to-fuchsia-400",
    "from-foreground/80 to-foreground/30",
  ];
  return (
    <section className="py-24 md:py-32 border-t border-border bg-surface/30">
      <div className="container-luxe grid md:grid-cols-4 gap-5">
        {examples.slice(0, 4).map((ex, i) => (
          <div key={ex} className="hover-lift rounded-xl overflow-hidden border border-border">
            <div className={`aspect-[3/4] bg-gradient-to-br ${swatches[i % swatches.length]} relative grid place-items-center`}>
              <Circle className="h-16 w-16 text-background/40" strokeWidth={1} />
              <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest text-background/80">Poster 0{i + 1}</span>
            </div>
            <div className="p-4 bg-background/60">
              <p className="text-sm text-foreground font-medium truncate">{ex}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ═══════════════════════════════════════════════════════════════════
// Browser mockup used in WEB hero
// ═══════════════════════════════════════════════════════════════════
function BrowserMockup() {
  return (
    <div className="relative">
      <div className="absolute -inset-6 bg-gradient-to-br from-primary/20 to-transparent blur-2xl rounded-3xl" />
      <div className="relative rounded-xl border border-border bg-background/80 backdrop-blur-sm overflow-hidden shadow-2xl">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-surface/60">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/60" />
          <span className="ml-3 text-[10px] font-mono text-muted-foreground">elevate.studio</span>
        </div>
        <div className="p-6 space-y-4">
          <div className="h-3 w-1/3 rounded bg-foreground/20" />
          <div className="h-2 w-2/3 rounded bg-foreground/10" />
          <div className="h-2 w-1/2 rounded bg-foreground/10" />
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="h-20 rounded-lg bg-gradient-to-br from-primary/40 to-primary/5" />
            <div className="h-20 rounded-lg bg-gradient-to-br from-primary/20 to-transparent border border-border" />
            <div className="h-20 rounded-lg bg-gradient-to-br from-primary/30 to-transparent border border-border" />
          </div>
          <div className="flex items-center justify-between pt-3">
            <div className="h-8 w-24 rounded-md bg-primary/80" />
            <div className="h-8 w-16 rounded-md border border-border" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SERVICE BODY — completely different layout & rhythm per slug
// ═══════════════════════════════════════════════════════════════════
type Detail = NonNullable<ReturnType<typeof getServiceDetails>>;
type Labels = ReturnType<typeof useT>["t"]["services"]["detailLabels"];

function ServiceBody({ slug, detail, labels }: { slug: ServiceSlug; detail: Detail; labels: Labels }) {
  if (slug === "web")      return <WebBody detail={detail} labels={labels} />;
  if (slug === "eshop")    return <EshopBody detail={detail} labels={labels} />;
  if (slug === "branding") return <BrandingBody detail={detail} labels={labels} />;
  return <DesignBody detail={detail} labels={labels} />;
}

// ─── shared atoms ─────────────────────────────────────────────────
function ConversionStrip({ labels, accent = "primary" }: { labels: Labels; accent?: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {[
        { i: Sparkles, t: labels.free },
        { i: Clock, t: labels.reply },
        { i: UserCog, t: labels.individual },
      ].map(({ i: Icon, t: text }) => (
        <span key={text} className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface/50 backdrop-blur-sm text-xs text-muted-foreground">
          <Icon className={`h-3.5 w-3.5 text-${accent}`} strokeWidth={1.5} />
          {text}
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

// ═══════════════════════════════════════════════════════════════════
// WEB — split, two-column rhythm, vertical process timeline on right
// ═══════════════════════════════════════════════════════════════════
function WebBody({ detail, labels }: { detail: Detail; labels: Labels }) {
  return (
    <>
      <WebShowcase examples={detail.examples} />

      {/* "What you get" + vertical process timeline side-by-side */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-6">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-8">{labels.benefits}</p>
            <ul className="grid sm:grid-cols-2 gap-4">
              {detail.benefits.map((b) => (
                <li key={b} className="hover-lift flex items-start gap-3 p-5 rounded-xl border border-border bg-surface/40">
                  <Check className="h-4 w-4 text-primary mt-1 shrink-0" strokeWidth={2.5} />
                  <span className="text-sm text-foreground leading-relaxed">{b}</span>
                </li>
              ))}
            </ul>
            <p className="mt-10 text-2xl md:text-3xl font-bold text-foreground leading-snug max-w-md">
              {detail.problem}
            </p>
          </div>
          <div className="lg:col-span-6">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-8">{labels.process}</p>
            <ol className="relative border-l border-border pl-8 space-y-10">
              {detail.process.map((step, i) => (
                <li key={step} className="relative">
                  <span className="absolute -left-[42px] top-0 grid h-8 w-8 place-items-center rounded-full border border-border bg-background text-xs font-mono text-primary">
                    {i + 1}
                  </span>
                  <h3 className="text-lg font-bold text-foreground">{step}</h3>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Result strip */}
      <section className="py-20 border-t border-border bg-surface/30">
        <div className="container-luxe flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-6">{labels.results}</p>
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              {detail.results.map((r) => (
                <div key={r.l}>
                  <div className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{r.n}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-widest mt-2">{r.l}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-widest text-primary">{labels.startingAt}</p>
            <div className="text-4xl font-bold text-foreground mt-1">{detail.pricing}</div>
          </div>
        </div>
      </section>

      {/* CTA card */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="rounded-2xl border border-border bg-surface/40 backdrop-blur-sm p-10 md:p-14">
            <div className="grid lg:grid-cols-3 gap-10 items-center">
              <div className="lg:col-span-2">
                <h3 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4">{detail.headline}</h3>
                <p className="text-sm text-muted-foreground mb-6 max-w-xl">{labels.exclusivity}</p>
                <ConversionStrip labels={labels} />
              </div>
              <div className="lg:text-right">
                <CtaButton label={labels.cta} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// E-SHOP — sales-funnel rhythm: What we do → Process → What client gets → KPI → Pricing
// ═══════════════════════════════════════════════════════════════════
function EshopBody({ detail, labels }: { detail: Detail; labels: Labels }) {
  return (
    <>
      <EshopShowcase examples={detail.examples} />

      {/* "What we do" — bullet list with checkmarks, full-width 2 cols */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <div className="max-w-3xl mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 mb-4">{labels.benefits}</p>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{detail.problem}</h2>
          </div>
          <ul className="grid md:grid-cols-2 gap-x-12 gap-y-5 max-w-4xl">
            {detail.benefits.map((b) => (
              <li key={b} className="flex items-start gap-4 border-b border-border pb-5">
                <span className="text-emerald-300 text-lg leading-none mt-1">✔</span>
                <span className="text-base text-foreground">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Process — horizontal numbered stepper */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 mb-12">{labels.process}</p>
          <ol className="grid grid-cols-1 md:grid-cols-4 gap-0 relative">
            {detail.process.map((step, i) => (
              <li key={step} className="relative px-6 py-8 border-t-2 border-emerald-300/40 md:border-r md:border-r-border md:last:border-r-0">
                <div className="text-5xl font-bold text-emerald-300/80 mb-4 font-mono">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="text-base font-bold text-foreground">{step}</h3>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* What client gets — KPIs */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300 mb-12">{labels.results}</p>
          <div className="grid md:grid-cols-3 gap-6">
            {detail.results.map((r, i) => (
              <div key={r.l} className="hover-lift p-10 rounded-xl border border-border bg-gradient-to-br from-emerald-400/5 to-transparent relative overflow-hidden">
                <span className="absolute top-4 right-5 text-[10px] font-mono text-emerald-300/60">0{i + 1}</span>
                <div className="text-6xl font-bold text-foreground tracking-tight mb-3">{r.n}</div>
                <div className="text-sm text-muted-foreground">{r.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For whom */}
      <section className="py-20 border-t border-border bg-surface/30">
        <div className="container-luxe grid md:grid-cols-2 gap-10 items-center">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-300">{labels.audience}</p>
          <ul className="flex flex-wrap gap-3">
            {detail.audience.map((a) => (
              <li key={a} className="px-4 py-2 rounded-full border border-emerald-300/30 bg-background/60 text-sm text-foreground">
                {a}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Pricing block — bold large */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe text-center">
          <p className="text-xs uppercase tracking-widest text-emerald-300 mb-4">{labels.pricing}</p>
          <div className="text-7xl md:text-8xl font-bold text-foreground tracking-tighter mb-6">{detail.pricing}</div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-10">{labels.exclusivity}</p>
          <div className="flex justify-center mb-8"><ConversionStrip labels={labels} accent="emerald-300" /></div>
          <CtaButton label={labels.cta} />
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// BRANDING — editorial magazine layout: includes / result columns, large quote, gallery
// ═══════════════════════════════════════════════════════════════════
function BrandingBody({ detail, labels }: { detail: Detail; labels: Labels }) {
  return (
    <>
      {/* Editorial intro — pull-quote */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-3">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300">{labels.problem}</p>
          </div>
          <div className="lg:col-span-9">
            <p className="text-3xl md:text-5xl font-bold text-foreground leading-tight tracking-tight">
              "{detail.problem}"
            </p>
          </div>
        </div>
      </section>

      <BrandingShowcase examples={detail.examples} />

      {/* Two columns: includes / result */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-2 gap-px bg-border rounded-xl overflow-hidden">
          <div className="bg-background p-12">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-8">{labels.benefits}</p>
            <ul className="space-y-6">
              {detail.benefits.map((b) => (
                <li key={b} className="flex items-baseline gap-5 border-b border-border pb-5">
                  <span className="text-amber-300 text-xl">✔</span>
                  <span className="text-xl text-foreground tracking-tight">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-surface/30 p-12">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-8">{labels.results}</p>
            <ul className="space-y-6">
              {detail.results.map((r) => (
                <li key={r.l} className="flex items-baseline gap-5 border-b border-border pb-5">
                  <span className="text-3xl font-bold text-foreground tabular-nums">{r.n}</span>
                  <span className="text-base text-muted-foreground">{r.l}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process — minimalist tracker */}
      <section className="py-20 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-10">{labels.process}</p>
          <div className="flex flex-wrap items-center gap-4">
            {detail.process.map((step, i) => (
              <span key={step} className="inline-flex items-center gap-3">
                <span className="text-xs font-mono text-amber-300">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-base text-foreground">{step}</span>
                {i < detail.process.length - 1 && <span className="text-muted-foreground/50 mx-2">/</span>}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — editorial price tag */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 items-end">
          <div className="lg:col-span-7">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-6">{labels.pricing}</p>
            <div className="text-6xl md:text-7xl font-bold text-foreground tracking-tighter">{detail.pricing}</div>
            <p className="mt-6 text-sm text-muted-foreground italic max-w-md">{labels.exclusivity}</p>
          </div>
          <div className="lg:col-span-5 space-y-6">
            <ConversionStrip labels={labels} accent="amber-300" />
            <CtaButton label={labels.cta} />
          </div>
        </div>
      </section>
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// DESIGN — poster-driven layout, centered rhythm
// ═══════════════════════════════════════════════════════════════════
function DesignBody({ detail, labels }: { detail: Detail; labels: Labels }) {
  return (
    <>
      <DesignShowcase examples={detail.examples} />

      {/* Big centered statement */}
      <section className="py-24 md:py-32 border-t border-border">
        <div className="container-luxe text-center max-w-3xl mx-auto">
          <p className="text-xs uppercase tracking-[0.25em] text-fuchsia-400 mb-6">{labels.problem}</p>
          <p className="text-3xl md:text-4xl font-bold text-foreground leading-snug">{detail.problem}</p>
        </div>
      </section>

      {/* Benefits — 3-up cards */}
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

      {/* Process + Audience side */}
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

      {/* Final pricing CTA */}
      <section className="py-24 md:py-32 border-t border-border bg-surface/30">
        <div className="container-luxe text-center">
          <p className="text-xs uppercase tracking-widest text-fuchsia-400 mb-4">{labels.pricing}</p>
          <div className="text-6xl md:text-7xl font-bold text-foreground tracking-tighter mb-6">{detail.pricing}</div>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">{labels.exclusivity}</p>
          <div className="flex justify-center mb-8"><ConversionStrip labels={labels} accent="fuchsia-400" /></div>
          <CtaButton label={labels.cta} />
        </div>
      </section>
    </>
  );
}
