import { createFileRoute } from "@tanstack/react-router";
import { HeroScene } from "@/components/home/HeroScene";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { StudioManifesto } from "@/components/home/StudioManifesto";
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
 * The homepage is one scroll story, in six frames:
 *
 *   the scene            HeroScene         camera into a lit screen
 *   the room behind it   ServicesShowcase  five takes of one studio
 *   the breath           StudioManifesto   the page's quiet beat
 *   what came out of it  CaseShowcase      real client work, reverse angle
 *   the visitor's turn   ProjectBuilder    the one interactive beat
 *   the last frame       ClosingCta        the light goes down
 *
 * The order is PRODUCT.md section 31's, with one deliberate omission: there is
 * no pricing act. Prices are real business data and they live where they convert
 * — the service routes and /pricing — and the owner ruled on 2026-09-05 that
 * putting them on the homepage would end the film on a price list. Nothing was
 * removed to achieve that; the pricing routes are untouched.
 *
 * THE SHAPE OF THE PAGE, and why it is not five equal sections. Three acts are
 * cut against the master timeline and each owns a different verb — the hero
 * pushes IN, the services room PANS between takes of one space, the cases are a
 * reverse angle that PUSHES sideways between reels. Between them sits one
 * unpinned, wordless-by-comparison beat so the loud stretches are not
 * continuous, and after them the one section the visitor drives rather than
 * watches. A fourth pinned act would have made the page read as one trick.
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
      <ProjectBuilder />
      <ClosingCta />
    </>
  );
}
