import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Monitor, ShoppingBag, Sparkles, Palette } from "lucide-react";
import { useT, SERVICE_SLUGS } from "@/lib/i18n";
import { Process } from "@/components/sections/Process";
import { Guarantee } from "@/components/sections/Guarantee";
import { CtaBanner } from "@/components/sections/CtaBanner";

const ICONS = [Monitor, ShoppingBag, Sparkles, Palette];

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
          {t.services.items.map((s, i) => {
            const Icon = ICONS[i];
            const slug = SERVICE_SLUGS[i];
            return (
              <Link
                key={s.title}
                to="/services/$slug"
                params={{ slug }}
                className="reveal hover-lift group p-12 rounded-2xl border border-border bg-surface/40 relative overflow-hidden block"
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

      <Process />
      <Guarantee />
      <CtaBanner />
    </>
  );
}
