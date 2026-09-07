/**
 * Studio manifesto — the studio's position, stated rather than illustrated.
 *
 * There is no reference comp for this section, so the reference governs the
 * language, not the layout: same black, same display voice, same restraint with
 * the blue. Two deliberate decisions shape it.
 *
 * It carries no photograph. It sits between two heavily photographic sections
 * (the device scene above, the client work below), and a third picture here
 * would flatten the page into one continuous loud stretch. This is the page's
 * quiet beat — the breath that makes the section after it land. Space and type
 * are the material.
 *
 * And the three positions are a LIST, not cards. Same-size boxes of
 * icon-plus-heading-plus-text are the lazy container the craft floor refuses,
 * and they say nothing about the argument; hairline-separated rows with the
 * claim on the left and the reasoning on the right read as a considered
 * statement, which is what the copy actually is.
 */
import { motion } from "framer-motion";
import { EASE, useReducedScene } from "@/components/cinematic";
import { useT } from "@/lib/i18n";

/**
 * One gate and one curve for the whole page: `still` is the page's single
 * reading of prefers-reduced-motion, and EASE is the page's single easing.
 *
 * The section keeps `whileInView` on purpose. It has no shot list and no pinned
 * stage, so there is no timeline for it to be cut against — "arrive when the
 * reader gets here" is exactly what an in-view trigger says. Putting it on an
 * act would be the master timeline duplicated from the other side.
 */

export function StudioManifesto() {
  const { t } = useT();
  const reduced = useReducedScene();
  const pillars = t.ui.philosophyPillars;

  /**
   * Headline lines are uncovered from below — the hero's own material, so the
   * page keeps one way of introducing display type.
   *
   * The in-view trigger has to sit on the OUTER, unclipped element and reach
   * the inner one through variants. Putting `whileInView` on the clipped child
   * deadlocks: it starts translated fully outside its `overflow: hidden`
   * parent, IntersectionObserver clips against ancestor overflow and so reports
   * it as never intersecting, the animation never starts, and the heading stays
   * invisible forever.
   */
  const line = (i: number, children: React.ReactNode) => (
    <motion.span
      initial={reduced ? undefined : "hide"}
      whileInView="show"
      viewport={{ once: true, margin: "-12% 0px" }}
      className="block overflow-hidden pb-[0.08em]"
    >
      <motion.span
        variants={{ hide: { y: "108%" }, show: { y: "0%" } }}
        transition={{ duration: 0.85, delay: i * 0.1, ease: EASE }}
        className="block"
      >
        {children}
      </motion.span>
    </motion.span>
  );

  return (
    <section className="relative isolate overflow-hidden bg-[#0A0D13] py-24 md:py-36">
      {/* THE PAUSE IS LIT, NOT EMPTY.
          This section carries no photograph and it should not — it sits between
          two heavily photographic acts and a third picture here would make the
          page one continuous loud stretch. But flat black between two lit rooms
          is not a pause in a film, it is a gap in one: the projector reads as
          switched off rather than as the lights being taken down.

          So the section keeps its silence and gets the world's light instead of
          the world's furniture — one very low bloom, off to one side, in the
          same blue the hero's arc and the services room are lit by. Additive, so
          its floor is exactly the section's own black and nothing is tinted;
          masked at both ends so it has no edge to read as a panel. The section
          before it hands over a lit room, this holds a trace of that light, and
          the case reels pick it up again. */}
      <motion.div
        aria-hidden
        initial={reduced ? undefined : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-5% 0px" }}
        transition={{ duration: 1.8, ease: EASE }}
        className="pointer-events-none absolute inset-0 mix-blend-screen [mask-image:linear-gradient(to_bottom,transparent_0%,#000_28%,#000_72%,transparent_100%)]"
      >
        <div className="h-full w-full bg-[radial-gradient(52%_48%_at_82%_38%,oklch(0.65_0.18_255/0.10),transparent_72%)]" />
      </motion.div>

      <div className="container-luxe relative">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <div>
            <p className="label-micro flex items-center gap-3 text-white/55">
              <span aria-hidden className="size-[5px] rounded-full bg-primary" />
              {t.ui.philosophyEyebrow}
            </p>
            <h2 className="heading-scene mt-6 max-w-[16ch] text-[clamp(1.9rem,1.2rem+2.4vw,3.25rem)] text-white">
              {line(0, t.ui.philosophyTitle)}
            </h2>
          </div>

          <motion.p
            initial={reduced ? undefined : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-12% 0px" }}
            transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
            className="max-w-[42ch] text-[0.9375rem] leading-relaxed text-white/60 sm:text-base lg:pt-14"
          >
            {t.ui.philosophyLead}
          </motion.p>
        </div>

        {/* The argument. Claim left, reasoning right, a drawn rule between —
            no borders, no fills, nothing that turns a position into a tile. */}
        <ul className="mt-20 md:mt-28">
          {pillars.map((p, i) => (
            <li key={p.t} className="relative">
              <motion.span
                aria-hidden
                initial={reduced ? undefined : { scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.9, delay: 0.08 + i * 0.12, ease: EASE }}
                className="absolute inset-x-0 top-0 block h-px origin-left bg-white/12"
              />
              <motion.div
                initial={reduced ? undefined : { opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-8% 0px" }}
                transition={{ duration: 0.7, delay: 0.18 + i * 0.12, ease: EASE }}
                className="grid gap-3 py-9 md:grid-cols-[0.85fr_1.15fr] md:gap-14 md:py-11"
              >
                <h3 className="max-w-[22ch] text-[1.0625rem] font-semibold leading-snug text-white md:text-[1.15rem]">
                  {p.t}
                </h3>
                <p className="max-w-[58ch] text-[0.9375rem] leading-relaxed text-white/55">{p.d}</p>
              </motion.div>
            </li>
          ))}
          {/* Closing rule, so the last position is bounded like the others. */}
          <li aria-hidden className="h-px bg-white/12" />
        </ul>
      </div>
    </section>
  );
}

export default StudioManifesto;
