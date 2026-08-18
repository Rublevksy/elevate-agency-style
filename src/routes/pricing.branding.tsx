import { createFileRoute } from "@tanstack/react-router";
import { PricingDetailPage } from "@/components/PricingDetailPage";

export const Route = createFileRoute("/pricing/branding")({
  component: BrandingPricingPage,
  head: () => ({
    meta: [
      { title: "Ceník brandingu — ELEVATE" },
      { name: "description", content: "Logo a branding od 2 000 Kč: logo systém, barvy, typografie, brand manuál a exporty." },
      { property: "og:title", content: "Ceník brandingu — ELEVATE" },
      { property: "og:description", content: "Vizuální identita, která působí profesionálně — od 2 000 Kč." },
      { property: "og:url", content: "https://elevateit.cz/pricing/branding" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/pricing/branding" }],
  }),
});

function BrandingPricingPage() {
  return <PricingDetailPage slug="branding" visual="brand" />;
}
