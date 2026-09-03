/**
 * Client work — the studio's evidence, presented the way a studio presents it:
 * a body of work you choose from, not a grid of thumbnails you scan.
 *
 * Why not the usual portfolio grid: three equal tiles say every project is
 * interchangeable, and they give a screenshot roughly 300px to make its case.
 * Here the four client names carry the section as display type — the way a
 * filmography reads — and the one you pick gets the whole right-hand side at a
 * size where the actual site is legible.
 *
 * The interaction is deliberately NOT scroll-driven. The services section above
 * already owns scroll as its mechanism; repeating it here would make the page
 * feel like it has one trick. This one answers to the pointer and the keyboard.
 *
 * Every figure on this page is real: the names, domains and result lines all
 * come from src/lib/projects-i18n.ts, and the trust line from t.results. Nothing
 * here is invented — PRODUCT.md principle 5 rules the section.
 */
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { EASE, useReducedScene } from "@/components/cinematic";
import { ProjectVisual } from "@/lib/projects";
import { useProjects } from "@/lib/projects-i18n";
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

export function CaseShowcase() {
  const { t } = useT();
  const projects = useProjects();
  const reduced = useReducedScene();
  const [active, setActive] = useState(0);

  const current = projects[active];
  if (!current) return null;

  return (
    <section className="relative bg-[#0A0D13] py-28 md:py-36" aria-label={t.ui.homeWorkTitle}>
      <div className="container-luxe">
        <p className="label-micro flex items-center gap-3 text-white/55">
          <span aria-hidden className="size-[5px] rounded-full bg-primary" />
          {t.ui.homeWorkEyebrow}
        </p>
        <h2 className="heading-scene mt-6 max-w-[18ch] text-[clamp(1.9rem,1.2rem+2.4vw,3.25rem)] text-white">
          {t.ui.homeWorkTitle}
        </h2>

        {/* The studio's standing facts, as one quiet line rather than a wall of
            counters — the hero's discipline row, reused as a rhythm. It gets
            its own full-width row: set beside the heading it competed with it
            and wrapped into an unreadable block. */}
        <ul className="label-micro mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-white/10 pt-5 text-white/40">
          {t.results.items.map((it, i) => (
            <li key={it.l} className="flex items-center gap-3">
              {i > 0 && <span aria-hidden className="size-[3px] rounded-full bg-primary/70" />}
              <span className="text-white/70">{it.n}</span>
              <span>{it.l}</span>
            </li>
          ))}
        </ul>

        <div className="mt-14 grid items-start gap-x-16 gap-y-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] xl:gap-x-20">
          {/* ---- The body of work ---------------------------------------- */}
          <div>
            <ul className="lg:pt-2">
              {projects.map((p, i) => {
                const on = i === active;
                return (
                  <li key={p.slug} className="border-t border-white/10 last:border-b">
                    <button
                      type="button"
                      onClick={() => setActive(i)}
                      onMouseEnter={() => !reduced && setActive(i)}
                      onFocus={() => setActive(i)}
                      aria-current={on ? "true" : undefined}
                      aria-controls="case-panel"
                      className="group relative flex w-full items-baseline justify-between gap-4 py-5 text-left focus-visible:outline-none"
                    >
                      {/* A single underline that travels between the names, rather
                        than one appearing while another disappears — the move
                        is what tells you the two are the same control. */}
                      {on && (
                        <motion.span
                          layoutId="case-marker"
                          aria-hidden
                          className="absolute inset-y-0 -left-4 w-0.5 rounded bg-primary"
                          transition={reduced ? { duration: 0 } : { duration: 0.42, ease: EASE }}
                        />
                      )}
                      <span
                        className={`heading-scene text-[1.35rem] transition-colors duration-400 md:text-[1.6rem] ${
                          on
                            ? "text-white"
                            : "text-white/35 group-hover:text-white/70 group-focus-visible:text-white/70"
                        }`}
                      >
                        {p.name}
                      </span>
                      <span
                        className={`label-micro shrink-0 transition-colors duration-400 ${
                          on ? "text-primary" : "text-white/25"
                        }`}
                      >
                        {p.category}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <Link
              to="/projects"
              className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-white/70 underline-offset-8 transition-colors hover:text-white hover:underline"
            >
              {t.ui.homeWorkViewAll}
              <ArrowRight className="size-4" aria-hidden />
            </Link>
          </div>

          {/* ---- The selected work ---------------------------------------- */}
          <div id="case-panel" aria-live="polite">
            <motion.div
              key={current.slug}
              initial={reduced ? false : { opacity: 0, y: 22, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.55, ease: EASE }}
            >
              <Link
                to="/projects/$slug"
                params={{ slug: current.slug }}
                aria-label={`${current.name} — ${t.ui.casesOpen}`}
                className="group block"
              >
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10 shadow-[0_50px_110px_-45px_rgb(0_0_0/0.95)]">
                  <ProjectVisual project={current} mode="hero" />
                </div>

                <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="min-w-0">
                    <p className="text-[0.9375rem] leading-relaxed text-white/60">
                      {current.description}
                    </p>
                    {/* Recorded outcomes, read as a sentence. Three framed
                        numbers would be the hero-metric template the craft
                        floor refuses, and would outshout the work itself. */}
                    <ul className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2">
                      {current.results.map((r, i) => (
                        <li
                          key={r.label}
                          className="label-micro flex items-center gap-3 text-white/45"
                        >
                          {i > 0 && (
                            <span aria-hidden className="size-[3px] rounded-full bg-primary/70" />
                          )}
                          <span className="text-primary">{r.value}</span>
                          <span>{r.label}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="label-micro flex shrink-0 items-center gap-2 text-white/45 transition-colors group-hover:text-primary">
                    {current.domain}
                    <ArrowUpRight className="size-3.5" aria-hidden />
                  </span>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CaseShowcase;
