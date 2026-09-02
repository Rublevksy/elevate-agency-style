/**
 * Closing CTA — the last frame of the scroll story.
 *
 * This one does have a reference: 01_HOME_DESKTOP_SCROLL_SERVICES_SHOWCASE.png
 * ends on a thin blue-bordered bar, question on the left, blue button on the
 * right. That is the source of truth, so this is that bar — not the previous
 * implementation's centred slab with a blurred colour blob behind it and a grid
 * texture on top, both of which the craft floor treats as decoration.
 *
 * The one thing added to the reference is the closing device: the vertical rule
 * that the hero starts under its SCROLL label comes back here, descends into
 * the bar and stops in a dot. The page opens with a line inviting a scroll and
 * closes with the same line arriving somewhere. It is the only reason this
 * section animates at all.
 */
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useT } from "@/lib/i18n";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ClosingCta() {
  const { t } = useT();
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  return (
    <section ref={ref} className="relative overflow-hidden bg-[#0A0D13] pb-28 pt-16 md:pb-40">
      <div className="container-luxe">
        {/* The line the hero opened, arriving. */}
        <div className="relative mx-auto mb-14 flex h-24 w-px justify-center md:mb-20 md:h-32">
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

        <motion.div
          initial={reduced ? undefined : { opacity: 0, scaleX: 0.94 }}
          whileInView={{ opacity: 1, scaleX: 1 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
          className="rounded-2xl border border-primary/40 bg-primary/[0.04] px-8 py-10 shadow-[0_0_60px_-15px_oklch(0.65_0.18_255/0.35)] md:px-14 md:py-14"
        >
          <div className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between md:gap-14">
            <div className="min-w-0">
              <h2 className="heading-scene max-w-[20ch] text-[clamp(1.6rem,1.1rem+1.8vw,2.6rem)] text-white">
                {t.cta.title}
              </h2>
              <p className="mt-4 max-w-[44ch] text-[0.9375rem] leading-relaxed text-white/60">
                {t.cta.subtitle}
              </p>
              <p className="label-micro mt-5 flex items-center gap-3 text-primary">
                <span aria-hidden className="size-[5px] rounded-full bg-primary" />
                {t.trust.response}
              </p>
            </div>

            <Link to="/contact" className="btn-primary shrink-0">
              {t.hero.cta1}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ClosingCta;
