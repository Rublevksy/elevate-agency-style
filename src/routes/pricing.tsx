import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { Pricing } from "@/components/sections/Pricing";
import { useT } from "@/lib/i18n";
import { usePages } from "@/lib/pages-i18n";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Ceník služeb — ELEVATE" },
      { name: "description", content: "Samostatné ceníky pro webové stránky, e-shopy a branding s jasným rozsahem, výsledky a cenou." },
      { property: "og:title", content: "Ceník služeb — ELEVATE" },
      { property: "og:description", content: "Vyberte si konkrétní ceník: web, e-shop nebo branding." },
      { property: "og:url", content: "https://elevateit.cz/pricing" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/pricing" }],
  }),
});

function PricingPage() {
  const location = useLocation();
  const { lang } = useT();
  const i = usePages(lang).pricingIndex;

  if (location.pathname !== "/pricing") {
    return <Outlet />;
  }

  return (
    <>
      <section className="page-top pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{i.eyebrow}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl mb-6">{i.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">{i.subtitle}</p>
        </div>
      </section>
      <Pricing />
    </>
  );
}
