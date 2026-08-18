import { createFileRoute } from "@tanstack/react-router";
import { PricingDetailPage } from "@/components/PricingDetailPage";

export const Route = createFileRoute("/pricing/eshop")({
  component: EshopPricingPage,
  head: () => ({
    meta: [
      { title: "Ceník e-shopu — ELEVATE" },
      { name: "description", content: "E-shop od 15 000 Kč: strategie, UX, produktové stránky, platby, doprava a měření objednávek." },
      { property: "og:title", content: "Ceník e-shopu — ELEVATE" },
      { property: "og:description", content: "Výkonný e-shop připravený prodávat — od 15 000 Kč." },
      { property: "og:url", content: "https://elevateit.cz/pricing/eshop" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/pricing/eshop" }],
  }),
});

function EshopPricingPage() {
  return <PricingDetailPage slug="eshop" visual="shop" />;
}
