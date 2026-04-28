import { createFileRoute } from "@tanstack/react-router";
import { PricingDetailPage } from "@/components/PricingDetailPage";
import { PRICING_PAGES } from "@/lib/pricing";

export const Route = createFileRoute("/pricing/branding")({
  component: BrandingPricingPage,
  head: () => ({
    meta: [
      { title: "Ceník brandingu — ELEVATE" },
      { name: "description", content: "Logo a branding od 5 000 Kč: logo systém, barvy, typografie, brand manuál a exporty." },
      { property: "og:title", content: "Ceník brandingu — ELEVATE" },
      { property: "og:description", content: "Vizuální identita, která působí profesionálně — od 5 000 Kč." },
    ],
  }),
});

function BrandingPricingPage() {
  return <PricingDetailPage offer={PRICING_PAGES.branding} visual="brand" />;
}
