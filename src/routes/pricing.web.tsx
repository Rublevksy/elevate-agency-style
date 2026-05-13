import { createFileRoute } from "@tanstack/react-router";
import { PricingDetailPage } from "@/components/PricingDetailPage";

export const Route = createFileRoute("/pricing/web")({
  component: WebPricingPage,
  head: () => ({
    meta: [
      { title: "Ceník webových stránek — ELEVATE" },
      { name: "description", content: "Webové stránky od 5 000 Kč: UX, design, vývoj, SEO základ a měření poptávek." },
      { property: "og:title", content: "Ceník webových stránek — ELEVATE" },
      { property: "og:description", content: "Profesionální web, který přivádí poptávky — od 5 000 Kč." },
      { property: "og:url", content: "https://elevateit.cz/pricing/web" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/pricing/web" }],
  }),
});

function WebPricingPage() {
  return <PricingDetailPage slug="web" visual="browser" />;
}
