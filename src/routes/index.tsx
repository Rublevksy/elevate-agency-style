import { createFileRoute } from "@tanstack/react-router";
import { HeroScene } from "@/components/home/HeroScene";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { PricingSection } from "@/components/home/PricingSection";
import { CaseShowcase } from "@/components/home/CaseShowcase";
import { ProjectBuilder } from "@/components/home/ProjectBuilder";
import { ClosingCta } from "@/components/home/ClosingCta";

export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ELEVATE — Webdesign, UX a vývoj moderních webů" },
      {
        name: "description",
        content:
          "Moderní weby a UX strategie pro firmy, které chtějí růst online. Audit zdarma do 48 hodin.",
      },
      { property: "og:title", content: "ELEVATE — Webdesign, UX a vývoj moderních webů" },
      {
        property: "og:description",
        content:
          "Moderní weby a UX strategie pro firmy, které chtějí růst online. Audit zdarma do 48 hodin.",
      },
      { property: "og:url", content: "https://elevateit.cz/" },
      { name: "twitter:title", content: "ELEVATE — Webdesign, UX a vývoj moderních webů" },
      {
        name: "twitter:description",
        content:
          "Moderní weby a UX strategie pro firmy, které chtějí růst online. Audit zdarma do 48 hodin.",
      },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/" }],
  }),
});

/**
 * The homepage opens on a schematic miniature Prague: ELEVATE's four real
 * projects form one visual route through the city, while the existing service,
 * pricing, builder and closing sections retain their verified content.
 *
 *   hero              HeroScene          miniature Prague and the studio promise
 *   services          ServicesShowcase   the existing five-service story
 *   pricing           PricingSection     the real prices, all visible at once
 *   cases             CaseShowcase       four project points on one city route
 *   builder           ProjectBuilder     the window draws the visitor's project
 *   closing           ClosingCta         back to the portal; the window is ELEVATE's
 *
 * Project positions are deliberately schematic until exact addresses and
 * coordinates are confirmed. Existing client captures remain the only project
 * imagery; no unverified metrics are shown on the homepage.
 */
function Home() {
  return (
    <>
      <HeroScene />
      <ServicesShowcase />
      <PricingSection />
      <CaseShowcase />
      <ProjectBuilder />
      <ClosingCta />
    </>
  );
}
