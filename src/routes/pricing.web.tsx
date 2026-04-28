import { createFileRoute } from "@tanstack/react-router";
import { PricingDetailPage } from "@/components/PricingDetailPage";
import { PRICING_PAGES } from "@/lib/pricing";

export const Route = createFileRoute("/pricing/web")({
  component: WebPricingPage,
  head: () => ({
    meta: [
      { title: "Ceník webových stránek — ELEVATE" },
      { name: "description", content: "Webové stránky od 10 000 Kč: UX, design, vývoj, SEO základ a měření poptávek." },
      { property: "og:title", content: "Ceník webových stránek — ELEVATE" },
      { property: "og:description", content: "Profesionální web, který přivádí poptávky — od 10 000 Kč." },
    ],
  }),
});

function WebPricingPage() {
  return <PricingDetailPage offer={PRICING_PAGES.web} visual="browser" />;
}
