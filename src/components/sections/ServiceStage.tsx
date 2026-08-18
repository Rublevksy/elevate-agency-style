import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

/**
 * Route each of the 5 ELEVATE services resolves to when its stage is
 * activated. Order matches `t.ui.serviceStage` (ticket 01): Weby, SEO,
 * E-shopy, Design & Branding, Aplikace. Every entry must be a real,
 * existing route — no `/services/seo` or `/services/app` (not built).
 */
const SERVICE_ROUTES = [
  "/services/web",
  "/audit",
  "/services/eshop",
  "/services",
  "/contact",
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;
const AUTO_ADVANCE_MS = 5200;

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="shadow-contact relative aspect-[4/3] w-full overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface/70 to-background">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-16 h-40 w-40 rounded-full bg-primary/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-16 -left-10 h-36 w-36 rounded-full bg-primary/10 blur-3xl"
      />
      <div className="relative h-full p-4">{children}</div>
    </div>
  );
}

/** 00 — Weby: browser chrome with a conversion-focused hero block. */
function WebPreview() {
  return (
    <PreviewFrame>
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background/90">
        <div className="flex items-center gap-1.5 border-b border-border bg-surface/60 px-3 py-2">
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <span className="h-2 w-2 rounded-full bg-foreground/20" />
          <div className="ml-3 h-2 flex-1 rounded bg-foreground/10" />
        </div>
        <div className="flex-1 space-y-2.5 p-3.5">
          <div className="h-2.5 w-2/3 rounded bg-foreground/40" />
          <div className="h-2 w-1/2 rounded bg-foreground/15" />
          <div className="mt-2 h-6 w-24 rounded bg-primary shadow-[0_0_20px_oklch(0.65_0.18_255/0.5)]" />
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            <div className="h-10 rounded bg-gradient-to-br from-primary/50 to-primary/10" />
            <div className="h-10 rounded bg-foreground/10" />
            <div className="h-10 rounded bg-gradient-to-br from-primary/30 to-transparent" />
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

/** 01 — SEO: a metrics dashboard with an upward trend line. */
function SeoPreview() {
  const bars = [30, 45, 38, 58, 50, 72, 88];
  return (
    <PreviewFrame>
      <div className="flex h-full flex-col overflow-hidden rounded-lg border border-border bg-background/90 p-3.5">
        <div className="grid grid-cols-3 gap-1.5">
          <div className="rounded bg-surface/60 p-1.5">
            <div className="h-1.5 w-8 rounded bg-foreground/20" />
            <div className="mt-1 h-2.5 w-6 rounded bg-primary/80" />
          </div>
          <div className="rounded bg-surface/60 p-1.5">
            <div className="h-1.5 w-8 rounded bg-foreground/20" />
            <div className="mt-1 h-2.5 w-8 rounded bg-primary/60" />
          </div>
          <div className="rounded bg-surface/60 p-1.5">
            <div className="h-1.5 w-8 rounded bg-foreground/20" />
            <div className="mt-1 h-2.5 w-5 rounded bg-primary/40" />
          </div>
        </div>
        <div className="mt-3 flex flex-1 items-end gap-1.5">
          {bars.map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-primary/70 to-primary/20"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </PreviewFrame>
  );
}

/** 02 — E-shopy: a product grid with price tags. */
function EshopPreview() {
  return (
    <PreviewFrame>
      <div className="grid h-full grid-cols-2 gap-2">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col overflow-hidden rounded-md border border-border bg-surface/60"
          >
            <div className="relative flex-1 bg-gradient-to-br from-primary/40 via-primary/15 to-transparent">
              {i === 0 && (
                <span className="absolute right-1 top-1 rounded bg-primary px-1 text-[8px] font-mono text-primary-foreground">
                  NEW
                </span>
              )}
            </div>
            <div className="space-y-1 p-1.5">
              <div className="h-1.5 w-3/4 rounded bg-foreground/25" />
              <div className="h-1.5 w-1/2 rounded bg-primary/70" />
            </div>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

/** 03 — Design & Branding: mark, palette and typography swatches. */
function BrandingPreview() {
  return (
    <PreviewFrame>
      <div className="grid h-full grid-cols-2 gap-2">
        <div className="grid place-items-center rounded-md border border-border bg-background text-2xl font-bold tracking-tighter text-foreground">
          E<span className="text-primary">.</span>
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <div className="rounded-md bg-primary shadow-[0_0_20px_oklch(0.65_0.18_255/0.5)]" />
          <div className="rounded-md bg-foreground/80" />
          <div className="rounded-md bg-primary/30" />
          <div className="rounded-md border border-border bg-transparent" />
        </div>
        <div className="col-span-2 flex items-center gap-2 rounded-md border border-border bg-surface/60 px-3">
          <div className="h-2 w-1/3 rounded bg-foreground/30" />
          <div className="h-2 w-1/4 rounded bg-primary/70" />
        </div>
      </div>
    </PreviewFrame>
  );
}

/** 04 — Aplikace: a mobile app screen inside a device frame. */
function AppPreview() {
  return (
    <PreviewFrame>
      <div className="grid h-full place-items-center">
        <div className="h-full w-[62%] rounded-[1.4rem] border-2 border-border bg-background/90 p-1.5 shadow-[0_0_30px_oklch(0.65_0.18_255/0.25)]">
          <div className="flex h-full flex-col overflow-hidden rounded-[1rem] border border-border/80 bg-surface/60">
            <div className="mx-auto mt-1.5 h-1 w-8 rounded-full bg-foreground/20" />
            <div className="space-y-1.5 p-2.5">
              <div className="h-2 w-1/2 rounded bg-foreground/30" />
              <div className="h-8 rounded-md bg-gradient-to-br from-primary/50 to-primary/10" />
              <div className="h-1.5 w-3/4 rounded bg-foreground/15" />
              <div className="h-1.5 w-2/3 rounded bg-foreground/15" />
            </div>
            <div className="mt-auto flex items-center justify-around border-t border-border/80 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
              <span className="h-1.5 w-1.5 rounded-full bg-foreground/20" />
            </div>
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

const PREVIEWS = [WebPreview, SeoPreview, EshopPreview, BrandingPreview, AppPreview];

export function ServiceStage() {
  const { t } = useT();
  const items = t.ui.serviceStage;
  const [active, setActive] = useState(0);
  const [hovered, setHovered] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (hovered || interacted || reducedMotion) return;
    const id = window.setInterval(() => {
      setActive((i) => (i + 1) % items.length);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [hovered, interacted, reducedMotion, items.length]);

  function selectService(index: number) {
    setActive(index);
    setInteracted(true);
  }

  const Preview = PREVIEWS[active];
  const activeItem = items[active];

  return (
    <section id="services" className="border-t border-border py-28 md:py-36">
      <div className="container-luxe">
        <SectionHeading eyebrow={t.ui.homeServicesEyebrow} title={t.ui.homeServicesTitle} />

        <div
          className="grid grid-cols-1 items-start gap-10 md:grid-cols-[minmax(0,300px)_1fr] md:gap-14 lg:gap-20"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          {/* Connected numbered index — one shared line, not 5 unrelated cards.
              Always a vertical stack (mobile included) so this never becomes
              a horizontal overflow-scroll row of clipped items. */}
          <div
            role="tablist"
            aria-label={t.ui.homeServicesTitle}
            className="relative flex flex-col gap-1"
          >
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-4 top-4 w-px bg-border"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-4 top-4 w-px origin-top bg-gradient-to-b from-primary to-primary/30"
              style={{
                transform: `scaleY(${items.length > 1 ? active / (items.length - 1) : 0})`,
                transition: `transform 500ms ${`cubic-bezier(${EASE.join(",")})`}`,
              }}
            />
            {items.map((item, index) => {
              const isActive = index === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  role="tab"
                  id={`service-stage-tab-${index}`}
                  aria-controls={`service-stage-panel-${index}`}
                  aria-selected={isActive}
                  onClick={() => selectService(index)}
                  onFocus={() => setHovered(true)}
                  onBlur={() => setHovered(false)}
                  className={`group flex items-center gap-3 rounded-lg px-4 py-3 text-left transition-colors duration-300 ${
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span
                    className={`relative z-10 grid h-8 w-8 shrink-0 place-items-center rounded-full border font-mono text-xs transition-colors duration-300 ${
                      isActive
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground group-hover:border-primary/50"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="text-sm font-semibold md:text-base">{item.title}</span>
                </button>
              );
            })}
          </div>

          {/* Active stage — single preview, minimal text, links to the real route */}
          <Link
            to={SERVICE_ROUTES[active]}
            role="tabpanel"
            id={`service-stage-panel-${active}`}
            aria-labelledby={`service-stage-tab-${active}`}
            className="hover-lift group block rounded-2xl border border-border bg-surface/40 p-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary md:p-8"
          >
            <div className="grid grid-cols-1 items-center gap-6 md:grid-cols-[1fr_1.1fr] md:gap-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reducedMotion ? 0 : -8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
                  className="order-2 md:order-1"
                >
                  <h3 className="heading-display-sm text-foreground">{activeItem.title}</h3>
                  <p className="mt-3 text-base text-muted-foreground">{activeItem.tag}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-primary">
                    {t.ui.servicesHover}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </motion.div>
              </AnimatePresence>
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: reducedMotion ? 0 : 0.4, ease: EASE }}
                  className="order-1 md:order-2"
                >
                  <Preview />
                </motion.div>
              </AnimatePresence>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}
