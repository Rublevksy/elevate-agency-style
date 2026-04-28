import { createFileRoute } from "@tanstack/react-router";
import { PricingDetailPage } from "@/components/PricingDetailPage";
import { PRICING_PAGES } from "@/lib/pricing";

export const Route = createFileRoute("/pricing/eshop")({
  component: EshopPricingPage,
  head: () => ({
    meta: [
      { title: "Ceník e-shopu — ELEVATE" },
      { name: "description", content: "E-shop od 25 000 Kč: strategie, UX, produktové stránky, platby, doprava a měření objednávek." },
      { property: "og:title", content: "Ceník e-shopu — ELEVATE" },
      { property: "og:description", content: "Výkonný e-shop připravený prodávat — od 25 000 Kč." },
    ],
  }),
});

function EshopPricingPage() {
  return <PricingDetailPage offer={PRICING_PAGES.eshop} visual="shop" />;
}
