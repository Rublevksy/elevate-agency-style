import { createFileRoute } from "@tanstack/react-router";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Guarantee } from "@/components/sections/Guarantee";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Ceník — ELEVATE" },
      { name: "description", content: "Transparentní ceník služeb: START, BUSINESS a PRO." },
      { property: "og:title", content: "Ceník — ELEVATE" },
      { property: "og:description", content: "Transparentní ceny pro každý projekt." },
    ],
  }),
});

function PricingPage() {
  const { t } = useT();
  return (
    <>
      <section className="page-top pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.pricing.title}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-3xl">
            {t.pricing.subtitle}
          </h1>
        </div>
      </section>
      <Pricing />
      <Guarantee />
      <Faq />
      <CtaBanner />
    </>
  );
}
