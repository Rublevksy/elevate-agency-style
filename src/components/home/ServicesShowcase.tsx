/**
 * The five services, stacked — the rendering for phones, tablets and laptops
 * below xl, and for every width under prefers-reduced-motion.
 *
 * On a capable wide desktop the services live inside the hero's pinned stage
 * (one window navigating through five pages — see `HeroScene.tsx`), and this
 * section is `display: none`. Everywhere else the same five pages are shown
 * here, in the same single window (`WindowStory`): each service's real copy
 * scrolls past while the window navigates to its page and plays that page's
 * beats. Same content, same words, same links — nothing is lost for a visitor
 * who cannot or will not have the pinned act.
 *
 * The CSS switch (`xl:hidden motion-reduce:xl:block`) is the same media query
 * the hero's own `motion-reduce:` variants read, so the two can never both be
 * showing or both be hidden.
 */
import type { MotionValue } from "framer-motion";
import { useT } from "@/lib/i18n";
import { clientSite } from "./client-work";
import { SERVICE_COUNT, ServiceCopy } from "./service-copy";
import { AppStage, BrandBoard, SeoInspector, ShopScene, WebServicePage } from "./window-pages";
import { WindowStory } from "./WindowStory";

const ADDRESS = [
  "elevateit.cz/services/web",
  clientSite("biodent-clinic").domain,
  clientSite("exclusive-beauty").domain,
  "elevateit.cz/services/branding",
  "elevateit.cz/services",
];

function servicePage(index: number, open: MotionValue<number>) {
  switch (index) {
    case 0:
      return <WebServicePage open={open} />;
    case 1:
      return <SeoInspector site={clientSite("biodent-clinic")} open={open} />;
    case 2:
      return <ShopScene site={clientSite("exclusive-beauty")} open={open} />;
    case 3:
      return <BrandBoard open={open} />;
    default:
      return <AppStage open={open} />;
  }
}

export function ServicesShowcase() {
  const { t } = useT();

  return (
    <section
      id="services"
      aria-label={t.nav.services}
      className="relative bg-background pt-20 pb-8 xl:pt-28 xl:pb-20"
    >
      <div className="container-luxe">
        <p className="label-micro flex items-center gap-4 text-white/60">
          <span aria-hidden className="h-px w-10 bg-white/30" />
          {t.ui.homeServicesEyebrow}
        </p>
        <p className="heading-scene mt-5 max-w-[20ch] text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] text-white">
          {t.ui.homeServicesTitle}
        </p>

        <div className="mt-8 md:mt-4">
          <WindowStory
            count={SERVICE_COUNT}
            label={t.nav.services}
            address={(i) => ADDRESS[i]}
            page={servicePage}
            copy={(i) => <ServiceCopy index={i} size="list" />}
          />
        </div>
      </div>
    </section>
  );
}

export default ServicesShowcase;
