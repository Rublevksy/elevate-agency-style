import { createFileRoute } from "@tanstack/react-router";
import { HeroScene } from "@/components/home/HeroScene";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { StudioManifesto } from "@/components/home/StudioManifesto";
import { CaseShowcase } from "@/components/home/CaseShowcase";
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
 * The homepage is one scroll story, in five frames:
 *
 *   the scene            HeroScene         01_HOME_DESKTOP_HERO.png
 *   the work we do       ServicesShowcase  01_HOME_DESKTOP_SCROLL_SERVICES_SHOWCASE.png
 *   how we think         StudioManifesto   (the page's quiet beat)
 *   what it produced     CaseShowcase      real client work only
 *   the invitation       ClosingCta        the reference's closing bar
 *
 * The sections that used to sit between these — IndustryStrip, TechStack,
 * ProcessTimeline, Collaboration, WhyElevate, Results, TrustBar and
 * InstagramStrip — are no longer mounted. They are generic-card-grid work from
 * before the reference-led rebuild and they broke the story into eight
 * unrelated beats. Their files are untouched, so any of them can come back once
 * it has been rebuilt in this visual language.
 */
function Home() {
  return (
    <>
      <HeroScene />
      <ServicesShowcase />
      <StudioManifesto />
      <CaseShowcase />
      <ClosingCta />
    </>
  );
}
