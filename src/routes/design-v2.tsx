import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/Logo";
import { ExploreSwitcher } from "@/components/design-explore/ExploreSwitcher";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/design-v2")({
  component: DesignV2Page,
  head: () => ({
    meta: [
      { title: "V2 — Editorial digital studio — ELEVATE design exploration" },
      { name: "robots", content: "noindex, nofollow" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&display=swap",
      },
    ],
  }),
});

/** Editorial display gharnitura — self-contained to this route, not the sitewide Inter voice (R11/craft-floor). */
const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function DesignV2Page() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ExploreSwitcher active="design-v2" />
      <V2Hero />
      <V2Services />
      <V2Proof />
      <V2Cta />
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Hero — no device, no 3D scroll scene. Serif headline + one atmospheric  */
/* "figure plate" panel, distinct from V1's device-glow arc (R11 risk).    */
/* ---------------------------------------------------------------------- */

function V2Hero() {
  const { t } = useT();
  return (
    <header className="relative overflow-hidden border-b border-border/60 px-6 pb-16 pt-28 md:px-14 md:pb-24 md:pt-40">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.32em] text-primary md:text-xs">
          {t.hero.tag}
        </p>
        <h1
          className="mt-6 text-foreground"
          style={{
            fontFamily: SERIF,
            fontSize: "clamp(2.75rem, 2rem + 4vw, 6.5rem)",
            lineHeight: 1.04,
            letterSpacing: "-0.01em",
            fontWeight: 500,
          }}
        >
          {t.hero.title1}
          <br />
          <span className="italic text-primary">{t.hero.title2}</span>
        </h1>
        <p className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg">
          {t.hero.subtitle}
        </p>
        <Link
          to="/contact"
          className="mt-10 inline-flex items-center gap-2 border-b border-primary/70 pb-1 text-sm font-medium tracking-wide text-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          {t.hero.cta1}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* One atmospheric "figure plate" — a quiet editorial panel, not a device photo,
          not V1's dugообразный arc-glow. A single motivated accent line, no gradient wash. */}
      <div
        aria-hidden="true"
        className="relative mx-auto mt-20 h-[38vh] max-w-5xl overflow-hidden rounded-sm border border-border/50 md:mt-28 md:h-[46vh]"
      >
        <div className="absolute inset-0 grid-bg opacity-20 [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
        <span className="absolute bottom-4 left-4 font-mono text-[0.65rem] uppercase tracking-[0.25em] text-muted-foreground/70 md:bottom-6 md:left-6">
          Fig. 01 — Praha
        </span>
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------------- */
/* Services — sticky editorial spread. Left: numbered table-of-contents    */
/* rail. Right: crossfading scene synced to page scroll position (R11).   */
/* Deliberately not click/hover/auto-timer driven — see useHeroScroll for */
/* the same principle applied to the production hero.                     */
/* ---------------------------------------------------------------------- */

function V2Services() {
  const { t } = useT();
  const items = t.ui.serviceStage;
  const prefersReducedMotion = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement | null>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Five services → six stage boundaries; each panel is fully visible across
  // its own segment and crossfades into the next over a short overlap.
  const opacity0 = useTransform(scrollYProgress, [0, 0.16, 0.22], [1, 1, 0]);
  const opacity1 = useTransform(scrollYProgress, [0.18, 0.24, 0.36, 0.42], [0, 1, 1, 0]);
  const opacity2 = useTransform(scrollYProgress, [0.38, 0.44, 0.56, 0.62], [0, 1, 1, 0]);
  const opacity3 = useTransform(scrollYProgress, [0.58, 0.64, 0.76, 0.82], [0, 1, 1, 0]);
  const opacity4 = useTransform(scrollYProgress, [0.78, 0.84, 1], [0, 1, 1]);
  const opacities = [opacity0, opacity1, opacity2, opacity3, opacity4];

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = Math.min(items.length - 1, Math.floor(value * items.length));
    setActive((prev) => (prev === next ? prev : next));
  });

  if (prefersReducedMotion) {
    return (
      <section id="v2-services" className="border-b border-border/60 px-6 py-20 md:px-14">
        <h2 className="sr-only">{t.ui.homeServicesTitle}</h2>
        <div className="mx-auto flex max-w-5xl flex-col gap-16">
          {items.map((item, index) => (
            <ServiceRow key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {/* Mobile: linearized reading flow — no sticky rail/scene squeeze into one
          viewport (R31.1 explicitly allows this simplification below md). */}
      <section id="v2-services-mobile" className="border-b border-border/60 px-6 py-20 md:hidden">
        <h2 className="sr-only">{t.ui.homeServicesTitle}</h2>
        <div className="flex flex-col gap-16">
          {items.map((item, index) => (
            <ServiceRow key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      {/* Desktop: sticky editorial spread, scroll-synced crossfade. */}
      <section
        id="v2-services"
        ref={sectionRef}
        className="relative hidden md:block"
        style={{ height: `${items.length * 100}vh` }}
      >
        <h2 className="sr-only">{t.ui.homeServicesTitle}</h2>
        <div className="sticky top-0 flex h-screen flex-col border-b border-border/60 md:flex-row">
          <nav
            aria-label={t.ui.homeServicesTitle}
            className="flex w-full shrink-0 flex-col justify-center gap-1 border-b border-border/60 px-6 py-10 md:w-[36%] md:border-b-0 md:border-r md:px-14 md:py-16"
          >
            <ol className="flex flex-col gap-1">
              {items.map((item, index) => {
                const isActive = index === active;
                return (
                  <li key={item.title}>
                    <a
                      href={`#v2-service-${index}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`group flex items-baseline gap-4 rounded-sm px-2 py-2.5 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`font-mono text-xs transition-colors duration-300 ${isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-primary/70"}`}
                      >
                        {pad(index + 1)}
                      </span>
                      <span
                        style={{ fontFamily: SERIF }}
                        className="text-lg leading-snug md:text-xl"
                      >
                        {item.title}
                      </span>
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="relative flex-1">
            {items.map((item, index) => (
              <motion.div
                key={item.title}
                style={{ opacity: opacities[index] }}
                className="absolute inset-0 flex flex-col justify-center px-6 py-12 md:px-16"
              >
                <ServiceScene item={item} index={index} />
              </motion.div>
            ))}
          </div>
        </div>

        {/* Invisible anchor targets spaced across the scroll track — keyboard/Enter
            on a rail link jumps here, which naturally drives scrollYProgress above. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {items.map((_, index) => (
            <span
              key={index}
              id={`v2-service-${index}`}
              className="absolute left-0 block h-px w-px"
              style={{ top: `${(index / items.length) * 100}%` }}
            />
          ))}
        </div>
      </section>
    </>
  );
}

function ServiceScene({ item, index }: { item: { title: string; tag: string }; index: number }) {
  return (
    <div className="max-w-xl">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
        {pad(index + 1)} / 05
      </span>
      <h3
        style={{ fontFamily: SERIF }}
        className="mt-4 text-[clamp(2.25rem,1.7rem+2.5vw,4rem)] leading-[1.06] text-foreground"
      >
        {item.title}
      </h3>
      <p className="mt-5 max-w-md text-base text-muted-foreground md:text-lg">{item.tag}</p>
      <div className="mt-10 h-px w-24 bg-gradient-to-r from-primary to-transparent" />
    </div>
  );
}

function ServiceRow({ item, index }: { item: { title: string; tag: string }; index: number }) {
  return (
    <div id={`v2-service-${index}`} className="border-t border-border/60 pt-8">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
        {pad(index + 1)} / 05
      </span>
      <h3
        style={{ fontFamily: SERIF }}
        className="mt-4 text-[clamp(1.9rem,1.5rem+1.5vw,2.75rem)] leading-[1.08] text-foreground"
      >
        {item.title}
      </h3>
      <p className="mt-4 max-w-md text-base text-muted-foreground">{item.tag}</p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Proof — quote-spread on t.results, large typography, no icons/cards.    */
/* ---------------------------------------------------------------------- */

function V2Proof() {
  const { t } = useT();
  return (
    <section className="border-b border-border/60 px-6 py-24 md:px-14 md:py-36">
      <div className="mx-auto max-w-5xl">
        <p className="font-mono text-xs uppercase tracking-[0.32em] text-primary">
          {t.results.eyebrow}
        </p>
        <h2
          style={{ fontFamily: SERIF }}
          className="mt-6 max-w-3xl text-[clamp(2rem,1.4rem+3vw,4.25rem)] leading-[1.14] text-foreground"
        >
          {t.results.title}
        </h2>
        <div className="mt-16 grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-4">
          {t.results.items.map((item) => (
            <div key={item.l} className="border-t border-border/60 pt-5">
              <div
                style={{ fontFamily: SERIF }}
                className="text-[clamp(1.9rem,1.4rem+2vw,3.25rem)] font-medium text-foreground"
              >
                {item.n}
              </div>
              <div className="mt-2 font-mono text-[0.7rem] uppercase tracking-[0.22em] text-muted-foreground">
                {item.l}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------------- */
/* CTA                                                                     */
/* ---------------------------------------------------------------------- */

function V2Cta() {
  const { t } = useT();
  return (
    <section className="px-6 py-24 text-center md:py-32">
      <h2
        style={{ fontFamily: SERIF }}
        className="mx-auto max-w-2xl text-[clamp(2rem,1.5rem+2.5vw,3.75rem)] leading-[1.12] text-foreground"
      >
        {t.cta.title}
      </h2>
      <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground">{t.cta.subtitle}</p>
      <Link
        to="/contact"
        className="mt-10 inline-flex items-center gap-2 border-b border-primary pb-1 text-lg font-medium text-primary transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {t.cta.btn}
        <ArrowRight className="h-5 w-5" />
      </Link>
      <div className="mt-20 flex items-center justify-center opacity-70">
        <Logo className="h-6 w-auto" />
      </div>
    </section>
  );
}
