/**
 * The five services, stacked — the rendering for phones, and for desktop under
 * prefers-reduced-motion.
 *
 * On a capable desktop the services live inside the hero's pinned stage (one
 * window navigating through five pages — see `HeroScene.tsx`), and this section
 * is `display: none`. Below `lg` there is no pinned stage to navigate in, and
 * under reduced motion the stage's services phase is dropped in CSS, so the
 * same five pages are shown here instead: each service's real copy beside the
 * same window page, settled in its final state. Same content, same words, same
 * links — nothing is lost for a visitor who cannot or will not have the motion.
 *
 * The CSS switch (`lg:hidden motion-reduce:lg:block`) is the same media query
 * the hero's own `motion-reduce:` variants read, so the two can never both be
 * showing or both be hidden.
 */
import { motion, useMotionValue } from "framer-motion";
import { EASE, useReducedScene } from "@/components/cinematic";
import { useT } from "@/lib/i18n";
import { BrowserWindow } from "./BrowserWindow";
import { clientSite } from "./client-work";
import { SERVICE_COUNT, ServiceCopy } from "./service-copy";
import { AppStage, BrandBoard, ScrollingSite, SeoInspector, WebServicePage } from "./window-pages";

const ADDRESS = [
  "elevateit.cz/services/web",
  clientSite("biodent-clinic").domain,
  clientSite("exclusive-beauty").domain,
  "elevateit.cz/services/branding",
  "elevateit.cz/contact",
];

export function ServicesShowcase() {
  const { t } = useT();
  const reduced = useReducedScene();
  // Every page in its settled state: fans open, inspector docked, the e-shop
  // scrolled to its products.
  const settled = useMotionValue(1);
  const shopScroll = useMotionValue(0.34);

  const pages = [
    <WebServicePage key="web" open={settled} />,
    <SeoInspector key="seo" site={clientSite("biodent-clinic")} open={settled} />,
    <ScrollingSite key="shop" site={clientSite("exclusive-beauty")} scroll={shopScroll} />,
    <BrandBoard key="brand" open={settled} />,
    <AppStage key="app" open={settled} />,
  ];

  return (
    <section
      id="services"
      aria-label={t.nav.services}
      className="relative bg-[#0A0D13] py-20 lg:hidden lg:py-32 motion-reduce:lg:block"
    >
      <div className="container-luxe">
        <p className="label-micro flex items-center gap-4 text-white/60">
          <span aria-hidden className="h-px w-10 bg-white/30" />
          {t.ui.homeServicesEyebrow}
        </p>
        <p className="heading-scene mt-5 max-w-[20ch] text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] text-white">
          {t.ui.homeServicesTitle}
        </p>

        <ol className="mt-14 space-y-20 lg:mt-20 lg:space-y-28">
          {Array.from({ length: SERVICE_COUNT }, (_, i) => (
            <motion.li
              key={i}
              initial={reduced ? undefined : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-12% 0px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-16"
            >
              <div className={i % 2 ? "lg:order-2" : undefined}>
                <BrowserWindow compact address={ADDRESS[i]}>
                  <div className="relative aspect-[16/10] overflow-hidden">{pages[i]}</div>
                </BrowserWindow>
              </div>
              <div className={i % 2 ? "lg:order-1" : undefined}>
                <ServiceCopy index={i} size="list" />
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default ServicesShowcase;
