/**
 * Closing — the last frame, not a banner.
 *
 * WHAT THIS REPLACED. A rounded rectangle with a blue border and a blue tint,
 * question on the left and button on the right. That shape came from the closing
 * bar in 01_HOME_DESKTOP_SCROLL_SERVICES_SHOWCASE.png and it was a fair reading
 * of the reference — but the reference is a poster of a page, and this is the
 * end of a film. Four viewports of camera work resolving into a bordered box is
 * the page announcing that the cinema is over and the website has resumed.
 *
 * So the box is gone and what is left is the frame itself: the studio's line
 * arriving, one statement at display size, one action, and the light going down.
 * The section has no background of its own — it is the same black the hero
 * opened in, which is the point.
 *
 * THE LINE IS THE BOOKEND. The hero opens with a vertical rule under its SCROLL
 * label; that rule comes back here, descends, and stops in a lit dot. The page
 * opens with a line inviting a scroll and closes with the same line arriving
 * somewhere. It is the only reason this section animates at all, and it is why
 * the motion is a one-shot on arrival rather than anything scroll-driven: the
 * film has stopped moving by now.
 *
 * IT POINTS BACK AT THE BUILDER. PRODUCT.md section 17 asks the closing to
 * connect to the project builder rather than to be a second, lesser form. The
 * builder is the section immediately above, so the action here is an anchor to
 * it — a visitor who scrolled past it gets taken back to the one place on the
 * page where they can actually say what they want — with the /contact route
 * kept as the quieter second option for anyone who would rather write.
 */
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import { EASE, useReducedScene } from "@/components/cinematic";
import { useT } from "@/lib/i18n";

export function ClosingCta() {
  const { t } = useT();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedScene();

  /** One arrival, in reading order. No section-wide stagger beyond this. */
  const rise = (i: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-15% 0px" },
    transition: { duration: 0.7, delay: 0.15 + i * 0.1, ease: EASE },
  });

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden bg-[#0A0D13] pb-32 pt-20 md:pb-44 md:pt-28"
    >
      {/* The light going down: one bloom low in the frame, additive, so its
          floor is the section's own black rather than a grey wash. It is the
          last thing the arc that crossed the hero does. */}
      <motion.div
        aria-hidden
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-10% 0px" }}
        transition={{ duration: 1.6, ease: EASE }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] mix-blend-screen"
      >
        <div className="h-full w-full bg-[radial-gradient(75%_65%_at_50%_78%,oklch(0.65_0.18_255/0.18),transparent_70%)]" />
      </motion.div>

      <div className="container-luxe relative">
        {/* The line the hero opened, arriving. */}
        <div className="relative mx-auto mb-16 flex h-24 w-px justify-center md:mb-24 md:h-32">
          <motion.span
            aria-hidden
            initial={reduced ? undefined : { scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 0.9, ease: EASE }}
            className="block h-full w-px origin-top bg-gradient-to-b from-transparent to-white/25"
          />
          <motion.span
            aria-hidden
            initial={reduced ? undefined : { opacity: 0, scale: 0.4 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-20% 0px" }}
            transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
            className="absolute -bottom-[3px] left-1/2 size-1.5 -translate-x-1/2 rounded-full bg-primary shadow-[0_0_12px_2px_oklch(0.65_0.18_255/0.55)]"
          />
        </div>

        {/* Centred, because a last frame is composed on its own axis and there
            is nothing left for it to be in dialogue with. */}
        <div className="mx-auto max-w-[46rem] text-center">
          <motion.h2
            {...rise(0)}
            className="heading-scene text-[clamp(2rem,1.2rem+3.4vw,4rem)] text-white"
          >
            {t.cta.title}
          </motion.h2>
          <motion.p
            {...rise(1)}
            className="mx-auto mt-6 max-w-[44ch] text-[0.9375rem] leading-relaxed text-white/60 sm:text-base"
          >
            {t.cta.subtitle}
          </motion.p>

          <motion.div
            {...rise(2)}
            className="mt-10 flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8"
          >
            <a href="#builder" className="btn-primary">
              {t.hero.cta1}
              <ArrowUp className="size-4" aria-hidden />
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-sm font-medium text-white/60 underline-offset-8 transition-colors hover:text-white hover:underline"
            >
              {t.nav.contact}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </motion.div>

          <motion.p
            {...rise(3)}
            className="label-micro mt-8 flex items-center justify-center gap-3 text-white/40"
          >
            <span aria-hidden className="size-[5px] rounded-full bg-primary" />
            {t.trust.response}
          </motion.p>
        </div>
      </div>
    </section>
  );
}

export default ClosingCta;
