import { createFileRoute, Link, Outlet, useLocation } from "@tanstack/react-router";
import { ArrowUpRight, Monitor, Palette, ShoppingBag, Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

const SERVICE_CARDS = [
  { to: "/services/web", Icon: Monitor, title: "Webové stránky", desc: "Prezentační weby, které přivádí poptávky a budují důvěru." },
  { to: "/services/eshop", Icon: ShoppingBag, title: "E-shopy", desc: "Prodejní řešení navržená pro objednávky, košík a růst obratu." },
  { to: "/services/branding", Icon: Sparkles, title: "Branding & logo", desc: "Vizuální identita, kterou si zákazníci zapamatují." },
  { to: "/services/design", Icon: Palette, title: "Grafika", desc: "Kampaně, bannery a materiály s prémiovým vizuálním dojmem." },
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
