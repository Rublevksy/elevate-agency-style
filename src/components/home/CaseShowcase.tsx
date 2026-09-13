/**
 * Cases — the proof. "This is what ELEVATE actually builds."
 *
 * One window, four real client sites. As the visitor scrolls, the window
 * scrolls each real site from its first screen down through its content (the
 * way you would look at a site you were considering), then navigates to the
 * next client: the address changes to their real domain and the next site
 * rises over the last. Beside it, the same site at phone width. On the
 * left, the client's name, category and domain in real type, with the live
 * site and the case study one click away.
 *
 * Images are static captures of the live sites (`scripts/capture-client-work.mjs`,
 * via `client-work.tsx`). The runtime WordPress mshots dependency this section
 * used to have is gone: no third-party request, no cookie banners, no empty
 * captures, no failure mode.
 *
 * Below xl and under reduced motion the same story runs in one sticky window
 * (`WindowStory`) instead of four stacked ones.
 *
 * What is NOT on this page, deliberately: the descriptions, problem/solution
 * copy, work lists and result figures in `projects-i18n.ts`. The figures have
 * no source (PRODUCT.md §33); the page shows the work, and the case-study
 * route carries the words.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { motion, useMotionValueEvent, useTransform, type MotionValue } from "framer-motion";
import { useState } from "react";
import { PERSPECTIVE, useAct, useMotionCapability } from "@/components/cinematic";
import { useT } from "@/lib/i18n";
import { useProjects } from "@/lib/projects-i18n";
import { BrowserWindow } from "./BrowserWindow";
import { CLIENT_SITES, WorkImage, type ClientSite } from "./client-work";
import { ClientFold, ScrollingSite } from "./window-pages";
import { CutText, LoadBar, NavLayer, useLoadBar } from "./window-nav";
import { WindowStory } from "./WindowStory";

/* The act's budget, in viewports — same construction as `home-tokens.ts`. */
const INTRO_VP = 0.3;
const CASE_VP = 0.95;
const TAIL_VP = 0.2;
const COUNT = CLIENT_SITES.length;
const PINNED_VP = INTRO_VP + COUNT * CASE_VP + TAIL_VP;
const VIEWPORTS = PINNED_VP + 1;
const PIN = PINNED_VP / VIEWPORTS;
const at = (vp: number) => vp / PINNED_VP;
const caseStart = (i: number) => INTRO_VP + i * CASE_VP;
// Same navigation as the hero (home-tokens NAV): the next client's page rises
// over the previous one, so no position of the scroll shows a blank window.
const SWAP = 0.02;
const PAINT = 0.12;
const swapAt = (i: number) => (i < COUNT ? at(caseStart(i) - SWAP) : 2);

export function CaseShowcase() {
  const { t } = useT();
  const projects = useProjects();
  const capability = useMotionCapability();
  const reduced = capability === "still";
  const act = useAct("cases", { viewports: VIEWPORTS, pin: PIN });
  const { progress: p, enter, exit } = act;

  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    let a = 0;
    for (let i = 1; i < COUNT; i++) if (v >= swapAt(i)) a = i;
    setActive(a);
  });

  const category = (slug: ClientSite["slug"]) => projects.find((x) => x.slug === slug)?.category;

  // Arrival: the window comes up out of the page below and squares to camera.
  const winY = useTransform(enter, [0, 1], [reduced ? 0 : 120, 0]);
  const winRotateX = useTransform(enter, [0, 1], [reduced ? 0 : 12, 0]);
  const winScale = useTransform(enter, [0, 1], [reduced ? 1 : 0.9, 1]);
  const headFade = useTransform(enter, [0.3, 0.9], [reduced ? 1 : 0, 1]);
  // The window leaves with its own act. Without this, the builder's window
  // rose into frame while this one was still 48% visible — two windows in one
  // frame at the seam (independent review measured 5-7 such frames here).
  const winFade = useTransform(exit, [0, 0.4], [1, reduced ? 1 : 0]);

  const bar = useLoadBar(
    p,
    Array.from({ length: COUNT - 1 }, (_, k): [number, number] => [
      at(caseStart(k + 1) - 0.06),
      at(caseStart(k + 1) + PAINT),
    ]),
    reduced,
  );

  const jumpTo = (i: number) => {
    const el = act.ref.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: top + (caseStart(i) + 0.25) * window.innerHeight, behavior: "smooth" });
  };

  const header = (
    <div>
      <p className="label-micro flex items-center gap-4 text-white/60">
        <span aria-hidden className="h-px w-10 bg-white/30" />
        {t.nav.work}
      </p>
      {/* Not `homeWorkTitle` ("Práce, která přináší výsledky"): this section
          shows the work, not figures for it, and the page states no metric
          anywhere (PRODUCT.md §33). A heading that promises results over four
          screenshots is the one place the page would over-claim. */}
      <h2 className="heading-scene mt-5 max-w-[16ch] text-[clamp(1.6rem,1.1rem+1.5vw,2.4rem)] text-white">
        {t.ui.homeWorkEyebrow}
      </h2>
    </div>
  );

  return (
    <section
      ref={act.ref}
      id="work"
      aria-label={t.ui.homeWorkEyebrow}
      style={{ "--cases-track": `${(VIEWPORTS * 100).toFixed(2)}svh` } as React.CSSProperties}
      className="relative isolate bg-[#0A0D13] xl:h-[var(--cases-track)] motion-reduce:xl:h-auto"
    >
      {/* ================= DESKTOP: pinned, one window ================= */}
      <div className="hidden overflow-hidden xl:sticky xl:top-0 xl:block xl:h-[100svh] motion-reduce:xl:hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_68%_52%,oklch(0.65_0.18_255/0.16),transparent_72%)]"
        />
        <div className="container-luxe relative grid h-full grid-cols-[0.78fr_1.22fr] items-center gap-12 pt-24 pb-24 xl:gap-16">
          <div className="relative flex h-full flex-col justify-center">
            <motion.div style={{ opacity: headFade }}>{header}</motion.div>
            <div className="relative mt-12 h-[17rem]">
              {CLIENT_SITES.map((site, i) => (
                <CaseSlot key={site.slug} p={p} i={i} reduced={reduced}>
                  <CaseCopy site={site} index={i} category={category(site.slug)} />
                </CaseSlot>
              ))}
            </div>
          </div>

          <div className="relative" style={{ perspective: `${PERSPECTIVE}px` }}>
            <motion.div
              style={{ y: winY, rotateX: winRotateX, scale: winScale, opacity: winFade }}
              className="relative origin-[50%_100%]"
            >
              <BrowserWindow
                tab={CLIENT_SITES.map((site, i) => (
                  <CutText
                    key={site.slug}
                    p={p}
                    from={i === 0 ? -1 : swapAt(i)}
                    to={swapAt(i + 1)}
                    className="absolute inset-0 truncate"
                  >
                    {site.tabTitle}
                  </CutText>
                ))}
                address={CLIENT_SITES.map((site, i) => (
                  <CutText
                    key={site.slug}
                    p={p}
                    from={i === 0 ? -1 : swapAt(i)}
                    to={swapAt(i + 1)}
                    className="absolute inset-0"
                  >
                    {site.domain}
                  </CutText>
                ))}
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-white">
                  {CLIENT_SITES.map((site, i) =>
                    i === 0 ? (
                      <CasePage key={site.slug} p={p} i={i} site={site} reduced={reduced} />
                    ) : (
                      <NavLayer
                        key={site.slug}
                        p={p}
                        swap={swapAt(i)}
                        painted={at(caseStart(i) + PAINT)}
                      >
                        <CasePage p={p} i={i} site={site} reduced={reduced} />
                      </NavLayer>
                    ),
                  )}
                  <LoadBar bar={bar} />
                </div>
              </BrowserWindow>

              {/* The same site at phone width, on the nearer plane. */}
              <div className="absolute -right-[5%] -bottom-[10%] aspect-[1/2] w-[20%] overflow-hidden rounded-[1.2rem] border-[5px] border-[#05070c] bg-white shadow-[0_40px_90px_-25px_oklch(0_0_0/0.95)]">
                {CLIENT_SITES.map((site, i) => {
                  const img = (
                    <WorkImage
                      site={site}
                      kind="mobile"
                      alt=""
                      sizes="160px"
                      className="absolute inset-0 block h-full w-full"
                      imgClassName="h-full w-full object-cover object-top"
                    />
                  );
                  return i === 0 ? (
                    <div key={site.slug} className="absolute inset-0">
                      {img}
                    </div>
                  ) : (
                    <NavLayer
                      key={site.slug}
                      p={p}
                      swap={swapAt(i)}
                      painted={at(caseStart(i) + PAINT)}
                    >
                      {img}
                    </NavLayer>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>

        {/* The four clients as a rail: where you are, and a way to jump. */}
        <nav aria-label={t.ui.homeWorkEyebrow} className="absolute inset-x-0 bottom-0 z-20">
          <div className="container-luxe">
            <ol className="flex border-t border-white/10">
              {CLIENT_SITES.map((site, i) => (
                <li key={site.slug} className="flex-1">
                  <button
                    type="button"
                    onClick={() => jumpTo(i)}
                    aria-current={active === i ? "step" : undefined}
                    className={`group relative w-full py-4 pr-3 text-left transition-colors duration-300 ${
                      active === i ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                  >
                    <RailFill p={p} i={i} />
                    <span className="label-micro block tabular-nums text-primary">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block truncate text-sm">{site.name}</span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </nav>
      </div>

      {/* ================= STACKED: phones, and reduced motion ================= */}
      <div className="container-luxe py-20 xl:hidden motion-reduce:xl:block motion-reduce:xl:py-32">
        {header}
        <div className="mt-6 md:mt-2">
          <WindowStory
            count={CLIENT_SITES.length}
            label={t.nav.work}
            screenClass="bg-white"
            address={(i) => CLIENT_SITES[i].domain}
            page={(i, open) =>
              reduced ? (
                <ClientFold site={CLIENT_SITES[i]} />
              ) : (
                <StoryCasePage site={CLIENT_SITES[i]} open={open} />
              )
            }
            companion={(i) => (
              <WorkImage
                site={CLIENT_SITES[i]}
                kind="mobile"
                alt=""
                sizes="120px"
                className="absolute inset-0 block h-full w-full bg-white"
                imgClassName="h-full w-full object-cover object-top"
              />
            )}
            copy={(i) => (
              <CaseCopy
                site={CLIENT_SITES[i]}
                index={i}
                category={category(CLIENT_SITES[i].slug)}
              />
            )}
          />
        </div>
      </div>

      <div className="container-luxe pb-4 xl:hidden motion-reduce:xl:block motion-reduce:xl:pb-24">
        <Link
          to="/projects"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/75 underline-offset-8 hover:text-white hover:underline"
        >
          {t.ui.homeWorkViewAll}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

/** One client's copy: real name, category, domain, and two real destinations. */
function CaseCopy({
  site,
  index,
  category,
}: {
  site: ClientSite;
  index: number;
  category?: string;
}) {
  const { t } = useT();
  return (
    <div>
      <p className="label-micro flex items-baseline gap-3">
        <span className="text-primary tabular-nums">{String(index + 1).padStart(2, "0")}</span>
        {category && (
          <>
            <span aria-hidden className="h-px w-8 self-center bg-white/20" />
            <span className="text-white/70">{category}</span>
          </>
        )}
      </p>
      <h3 className="heading-scene mt-4 text-[clamp(1.9rem,1.2rem+2.4vw,3.25rem)] text-white">
        {site.name}
      </h3>
      <p className="mt-3 font-mono text-[0.9375rem] tracking-wide text-white/60">{site.domain}</p>
      <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
        <Link to="/projects/$slug" params={{ slug: site.slug }} className="btn-primary">
          {t.ui.casesOpen}
          <ArrowRight className="size-4" aria-hidden />
        </Link>
        <a
          href={site.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-white/75 underline-offset-8 transition-colors hover:text-white hover:underline"
        >
          {t.ui.casesLive}
          <ArrowUpRight className="size-4" aria-hidden />
        </a>
      </div>
    </div>
  );
}

/** The client site in the window, scrolled across its stretch of the act. */
function CasePage({
  p,
  i,
  site,
  reduced,
}: {
  p: MotionValue<number>;
  i: number;
  site: ClientSite;
  reduced: boolean;
}) {
  const scroll = useTransform(
    p,
    [at(caseStart(i) + 0.12), at(caseStart(i) + CASE_VP - 0.14)],
    [0, reduced ? 0 : 1],
  );
  return <ScrollingSite site={site} scroll={scroll} />;
}

/** The client site in the stacked story's window: it scrolls once, on its own clock. */
function StoryCasePage({ site, open }: { site: ClientSite; open: MotionValue<number> }) {
  const scroll = useTransform(open, [0.25, 1], [0, 0.32]);
  return <ScrollingSite site={site} scroll={scroll} />;
}

/** A client's copy, in the left column's slot: in after its page, out before the next. */
function CaseSlot({
  p,
  i,
  reduced,
  children,
}: {
  p: MotionValue<number>;
  i: number;
  reduced: boolean;
  children: React.ReactNode;
}) {
  const last = i === COUNT - 1;
  const inA = i === 0 ? -1 : at(caseStart(i) - 0.02);
  const inB = i === 0 ? -0.5 : at(caseStart(i) + 0.06);
  const outA = last ? 2 : at(caseStart(i + 1) - 0.1);
  const outB = last ? 2.1 : at(caseStart(i + 1) - 0.04);
  const y = useTransform(p, [inA, inB, outA, outB], [reduced ? 0 : 40, 0, 0, reduced ? 0 : -40]);
  const opacity = useTransform(p, [inA, inB, outA, outB], [0, 1, 1, 0]);
  const pointerEvents = useTransform(p, (v) => (v > inA && v < outB ? "auto" : "none"));
  const visibility = useTransform(p, (v) => (v >= inA && v <= outB ? "visible" : "hidden"));
  return (
    <motion.div
      style={{ y, opacity, pointerEvents, visibility }}
      className="absolute inset-0 flex items-center"
    >
      <div className="w-full">{children}</div>
    </motion.div>
  );
}

/** The rail's progress line for client `i`: fills across that client's stretch. */
function RailFill({ p, i }: { p: MotionValue<number> & object; i: number }) {
  const from = i === 0 ? 0 : swapAt(i);
  const to = swapAt(i + 1) > 1 ? 1 : swapAt(i + 1);
  const scaleX = useTransform(p, [from, to], [0, 1]);
  return (
    <motion.span
      aria-hidden
      style={{ scaleX }}
      className="absolute -top-px left-0 block h-[2px] w-full origin-left bg-primary"
    />
  );
}

export default CaseShowcase;
