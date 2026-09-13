/**
 * The five services, stacked — the rendering for phones, and for desktop under
 * prefers-reduced-motion.
 *
 * On a capable desktop the services live inside the hero's pinned stage (one
 * window navigating through five pages — see `HeroScene.tsx`), and this section
 * is `display: none`. Below `lg` there is no pinned stage to navigate in, and
 * under reduced motion the stage's services phase is dropped in CSS, so the
 * same five pages are shown here instead: each service's real copy beside the
 * same window scene, which plays its beats once when it scrolls into view. Same content, same words, same
 * links — nothing is lost for a visitor who cannot or will not have the motion.
 *
 * The CSS switch (`lg:hidden motion-reduce:lg:block`) is the same media query
 * the hero's own `motion-reduce:` variants read, so the two can never both be
 * showing or both be hidden.
 */
import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue } from "framer-motion";
import { EASE, useReducedScene } from "@/components/cinematic";
import { useT } from "@/lib/i18n";
import { BrowserWindow } from "./BrowserWindow";
import { clientSite } from "./client-work";
import { SERVICE_COUNT, ServiceCopy } from "./service-copy";
import { AppStage, BrandBoard, SeoInspector, ShopScene, WebServicePage } from "./window-pages";

const ADDRESS = [
  "elevateit.cz/services/web",
  clientSite("biodent-clinic").domain,
  clientSite("exclusive-beauty").domain,
  "elevateit.cz/services/branding",
  "elevateit.cz/services",
];

/** How long a scene takes to play through its beats once it is in view. */
const SCENE_SECONDS = 3.4;

/**
 * One service scene with its own clock. There is no pinned stage here, so the
 * scene's `open` is not a stretch of scroll: it plays once, when the window is
 * mostly on screen, over a few seconds — the same build → reveal → resolve
 * beats the pinned stage scrubs. Never scroll-driven (no `useScroll` in home
 * sections, ADR 0013), so it cannot hijack a phone's scroll. Under reduced
 * motion the scene is set straight to its resolved state.
 */
function ServiceScene({ index, reduced }: { index: number; reduced: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const open = useMotionValue(0);

  useEffect(() => {
    if (reduced) {
      open.set(1);
      return;
    }
    if (!inView) return;
    const controls = animate(open, 1, { duration: SCENE_SECONDS, ease: EASE });
    return () => controls.stop();
  }, [inView, reduced, open]);

  const scene = [
    <WebServicePage key="web" open={open} />,
    <SeoInspector key="seo" site={clientSite("biodent-clinic")} open={open} />,
    <ShopScene key="shop" site={clientSite("exclusive-beauty")} open={open} />,
    <BrandBoard key="brand" open={open} />,
    <AppStage key="app" open={open} />,
  ][index];

  return (
    <div ref={ref}>
      <BrowserWindow compact address={ADDRESS[index]}>
        <div className="relative aspect-[16/10] overflow-hidden">{scene}</div>
      </BrowserWindow>
    </div>
  );
}

export function ServicesShowcase() {
  const { t } = useT();
  const reduced = useReducedScene();

  return (
    <section
      id="services"
      aria-label={t.nav.services}
      className="relative bg-[#0A0D13] py-20 xl:hidden xl:py-32 motion-reduce:xl:block"
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
                <ServiceScene index={i} reduced={reduced} />
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
