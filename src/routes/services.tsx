import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/i18n";

function WebPreview() {
  return (
    <div className="rounded-lg border border-border bg-background/80 overflow-hidden">
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-border bg-surface/60">
        <span className="h-2 w-2 rounded-full bg-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-foreground/30" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-3 w-2/3 rounded bg-foreground/30" />
        <div className="h-2 w-1/2 rounded bg-foreground/15" />
        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="h-14 rounded bg-primary/35" />
          <div className="h-14 rounded bg-foreground/10" />
          <div className="h-14 rounded bg-primary/20" />
        </div>
      </div>
    </div>
  );
}

function EshopPreview() {
  return (
    <div className="grid grid-cols-3 gap-2">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-surface/40 overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          <div className="p-2 space-y-1">
            <div className="h-1.5 w-3/4 rounded bg-foreground/20" />
            <div className="h-1.5 w-1/2 rounded bg-primary/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BrandingPreview() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="aspect-square rounded-lg border border-border bg-background grid place-items-center text-3xl font-bold tracking-tighter text-foreground">N</div>
      <div className="aspect-square rounded-lg border border-border bg-foreground grid place-items-center text-3xl text-primary">◆</div>
      <div className="aspect-square rounded-lg border border-border bg-gradient-to-br from-primary/30 to-transparent grid place-items-center text-xl italic font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>Pa</div>
      <div className="aspect-square rounded-lg border border-border bg-background grid place-items-center">
        <div className="h-10 w-10 rounded-md bg-gradient-to-br from-primary to-primary/40" />
      </div>
      <div className="aspect-square rounded-lg border border-border bg-surface/40 grid place-items-center text-xs font-mono text-muted-foreground">CORVEX</div>
      <div className="aspect-square rounded-lg border border-border bg-background grid place-items-center">
        <div className="h-8 w-8 rounded-full border-2 border-primary" />
      </div>
    </div>
  );
}

function DesignPreview() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-2 aspect-[16/10] rounded-lg bg-gradient-to-br from-primary/40 via-primary/15 to-transparent border border-border" />
      <div className="aspect-square rounded-full bg-primary/30 border border-border" />
      <div className="aspect-square rounded-lg bg-foreground/10 border border-border" />
      <div className="col-span-2 aspect-[16/10] rounded-lg border border-border bg-surface/60 flex items-center px-4 gap-3">
        <div className="h-2.5 w-1/3 rounded bg-foreground/30" />
        <div className="h-2.5 w-1/4 rounded bg-primary/60" />
      </div>
    </div>
  );
}

const SERVICE_CARDS = [
  { to: "/services/web", Preview: WebPreview, title: "Weby, které přivádí klienty", desc: "Prezentační weby, které přivádí poptávky a budují důvěru." },
  { to: "/services/eshop", Preview: EshopPreview, title: "E-shopy, které prodávají", desc: "Prodejní řešení navržená pro objednávky, košík a růst obratu." },
  { to: "/services/branding", Preview: BrandingPreview, title: "Značka, kterou si lidé zapamatují", desc: "Vizuální identita, kterou si zákazníci zapamatují." },
  { to: "/services/design", Preview: DesignPreview, title: "Vizuály, které prodávají", desc: "Kampaně, bannery a materiály s prémiovým vizuálním dojmem." },
] as const;

export const Route = createFileRoute("/services")({
  component: ServicesPage,
  head: () => ({
    meta: [
      { title: "Služby — ELEVATE" },
      { name: "description", content: "Webové stránky, e-shopy, branding a design pro firmy, které chtějí růst." },
      { property: "og:title", content: "Služby — ELEVATE" },
      { property: "og:description", content: "Webové stránky, e-shopy, branding a design." },
    ],
  }),
});

function ServicesPage() {
  const { t } = useT();
  const location = useLocation();

  if (location.pathname !== "/services") {
    return <Outlet />;
  }

  return (
    <>
      <section className="page-top pb-20 md:pb-28 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.services.title}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-3xl">
            {t.services.subtitle}
          </h1>
        </div>
      </section>

      <section className="pb-28 md:pb-36">
        <div className="container-luxe grid grid-cols-1 md:grid-cols-2 gap-8">
          {SERVICE_CARDS.map((s, i) => {
            const Icon = s.Icon;
            return (
              <Link
                key={s.title}
                to={s.to}
                className="reveal hover-lift group p-12 rounded-xl border border-border bg-surface/40 relative overflow-hidden block min-h-[280px]"
              >
                <span
                  aria-hidden
                  className="absolute -right-6 -bottom-12 text-[12rem] font-extrabold leading-none text-foreground/[0.03] select-none"
                >
                  E
                </span>
                <Icon className="h-6 w-6 text-primary mb-10 relative" strokeWidth={1.5} />
                <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 relative">{s.title}</h2>
                <p className="text-base text-muted-foreground leading-relaxed relative max-w-md mb-8">{s.desc}</p>
                <span className="relative text-sm uppercase tracking-widest text-primary inline-flex items-center gap-2">
                  {t.services.learnMore}
                  <ArrowUpRight className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>
    </>
  );
}
