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
 * The homepage: one website experience built around one object — THE WINDOW,
 * a real browser window (see `BrowserWindow.tsx`). ELEVATE builds websites, so
 * the website experience itself is the showcase.
 *
 *   hero + services   HeroScene          the window stands in the portal showing
 *                                        the studio's real client sites, then
 *                                        navigates through the five services
 *                     ServicesShowcase   the same five, stacked — phones, and
 *                                        desktop under prefers-reduced-motion
 *   pricing           PricingSection     the real prices, all visible at once
 *   cases             CaseShowcase       the window scrolls each real client site
 *   builder           ProjectBuilder     the window draws the visitor's project
 *   closing           ClosingCta         back to the portal; the window is ELEVATE's
 *
 * Hero and services are ONE pinned act on purpose: two pinned sections always
 * had a frame with two windows at their seam (PROTO_GATE.md, condition 2).
 * Everything is real: client captures of the live sites, `t.*` / `usePages`
 * copy, `pricingPages` prices, the untouched Telegram contact pipeline. No
 * metrics are shown anywhere on the page (PRODUCT.md §33).
 *
 * Unmounted and kept (recoverable, not deleted): StudioManifesto,
 * HeroCameraPlate, HeroLightField and the camera clips in /public/media — the
 * previous "camera into a lit screen" hero. The tag checkpoint/pre-homepage-rebuild
 * marks the last commit with that homepage.
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
