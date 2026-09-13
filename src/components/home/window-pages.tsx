/**
 * What THE WINDOW shows — one component per page it navigates to.
 *
 * Everything here is depiction (`aria-hidden`): the readable, linked version of
 * the same information is always beside the window in real page type. So the
 * pages are sized in container-query units (`cqw`) against the window's own
 * width — the same composition at 300px on a phone and at 700px in the desktop
 * stage, instead of a desktop mock shrunk until its type turns to texture.
 *
 * Content rules (PRODUCT.md §02/§33, PROTO_GATE.md §7):
 *  - client pages are real captures of the real sites, nothing redrawn;
 *  - ELEVATE pages use ELEVATE's real strings (`t.*`, `usePages`);
 *  - the SEO inspector shows each site's own served `<title>`, meta description
 *    and `<h1>` — the client's words, not claims about results;
 *  - no metric, rank, score or percentage appears anywhere in a window. The SEO
 *    meters are character COUNTS of the client's own served strings — facts
 *    about those strings, not claims about performance;
 *  - commerce UI is icons, bars and crops of the client's real product photos:
 *    no invented product names, prices or quantities beyond UI state.
 *
 * Every scene reads ONE MotionValue, `open` (0..1). In the pinned hero act it is
 * a stretch of the act's scroll progress (reversible by construction); in the
 * stacked ServicesShowcase it is an in-view clock. Each scene cuts `open` into
 * its own beats, so the five read as one system: build → reveal → resolve.
 */
import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";
import { ArrowRight, Check, CreditCard, Search, ShoppingBag, Truck } from "lucide-react";
import { Logo } from "@/components/Logo";
import { useT } from "@/lib/i18n";
import { usePages } from "@/lib/pages-i18n";
import { CLIENT_SITES, WorkImage, clientSite, type ClientSite } from "./client-work";

/** The lit screen surface — a shade above the page ground, so glass reads as a plane. */
export const SCREEN = "bg-[#0d1220]";

/** A client site's first screen, filling the window. */
export function ClientFold({ site, priority = false }: { site: ClientSite; priority?: boolean }) {
  return (
    <div aria-hidden className="absolute inset-0 bg-white">
      <WorkImage
        site={site}
        kind="desktop"
        alt=""
        priority={priority}
        sizes="(min-width: 1024px) 50vw, 90vw"
        className="absolute inset-0 block h-full w-full"
        imgClassName="h-full w-full object-cover object-top"
      />
    </div>
  );
}

/**
 * A client site being scrolled. `scroll` is 0..1 of the capture's travel; the
 * capture is the first ~2.5 viewports of the real page, so at 1 the window
 * sits on its third screen. The travel is a percentage of the image's own
 * height (the image is 1200x1875, the window 16:10), so it is exact at every
 * window width.
 */
export function ScrollingSite({ site, scroll }: { site: ClientSite; scroll: MotionValue<number> }) {
  // 16:10 window over a 1200x1875 page: visible 0.625w of 1.5625w, so the
  // page can travel (1.5625 - 0.625) / 1.5625 = 60% of its own height.
  const y = useTransform(scroll, [0, 1], ["0%", "-60%"]);
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden bg-white">
      <motion.div style={{ y }} className="absolute inset-x-0 top-0">
        <WorkImage
          site={site}
          kind="page"
          alt=""
          sizes="(min-width: 1024px) 50vw, 90vw"
          className="block w-full"
          imgClassName="block h-auto w-full"
        />
      </motion.div>
    </div>
  );
}

/** Depicted navigation — shared, so every ELEVATE page reads as one site. */
function MockNav() {
  const { t } = useT();
  return (
    <div className="flex items-center justify-between border-b border-white/8 px-[3cqw] py-[1.6cqw]">
      <Logo className="h-[1.9cqw] w-auto opacity-95" />
      <div className="flex items-center gap-[2.2cqw]">
        {[t.nav.services, t.nav.work, t.nav.pricing].map((label) => (
          <span key={label} className="text-[1.25cqw] tracking-wide text-white/55">
            {label}
          </span>
        ))}
        <span className="rounded-full bg-primary px-[1.4cqw] py-[0.5cqw] text-[1.25cqw] font-semibold text-white">
          {t.nav.contact}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* Shared scene vocabulary                                                   */
/* ------------------------------------------------------------------------ */

const BLUEPRINT_LINE = "border border-dashed border-[oklch(0.72_0.16_250/0.6)]";
const BLUEPRINT_FILL = "bg-[oklch(0.72_0.16_250/0.16)]";
const CHIP =
  "rounded-full border border-white/15 px-[1.2cqw] py-[0.45cqw] text-[1.15cqw] text-white/65";
const EYEBROW = "text-[1.2cqw] tracking-[0.2em] text-primary uppercase";
const TITLE = "font-display mt-[1.2cqw] leading-[1.08] font-extrabold tracking-tight text-white";

/** A beat of `open`, remapped to 0..1. */
function useBeat(open: MotionValue<number>, a: number, b: number) {
  return useTransform(open, [a, b], [0, 1]);
}

/**
 * A rectangle of a capture as a CSS background. With the box at the crop's own
 * aspect ratio, percentage size/position place the crop exactly at any width.
 */
function cropStyle(url: string, x: number, y: number, w: number, h: number): React.CSSProperties {
  return {
    backgroundImage: `url(${url})`,
    backgroundSize: `${100 / w}% ${100 / h}%`,
    backgroundPosition: `${(x / (1 - w)) * 100}% ${(y / (1 - h)) * 100}%`,
  };
}

/* ------------------------------------------------------------------------ */
/* 01 · WEB — a website being made: blueprint → real site → responsive       */
/* ------------------------------------------------------------------------ */

/**
 * elevateit.cz/services/web. The page transforms in three beats, labelled with
 * the service page's own process steps (`servicesWeb.processSteps`): the
 * wireframe draws, the real EuroMotors site paints over it top-down, then the
 * build fans out into the studio's other real sites and stands up at phone
 * width.
 */
export function WebServicePage({ open }: { open: MotionValue<number> }) {
  const { lang } = useT();
  const s = usePages(lang).servicesWeb;
  const pages = usePages(lang).common;
  const [front, mid, back] = [
    clientSite("euromotors"),
    clientSite("biodent-clinic"),
    clientSite("nhome-praha"),
  ];

  const w0 = useBeat(open, 0.0, 0.14);
  const w1 = useBeat(open, 0.06, 0.2);
  const w2 = useBeat(open, 0.12, 0.26);
  const w3 = useBeat(open, 0.18, 0.32);
  const w1y = useTransform(w1, [0, 1], ["20%", "0%"]);
  const paint = useTransform(open, [0.3, 0.6], [100, 0]);
  const paintClip = useMotionTemplate`inset(0 0 ${paint}% 0)`;
  const fan = useBeat(open, 0.6, 0.95);
  const fanO = useTransform(fan, [0, 0.2], [0, 1]);
  const backX = useTransform(fan, [0, 1], ["0%", "-17%"]);
  const backR = useTransform(fan, [0, 1], [0, -6]);
  const midX = useTransform(fan, [0, 1], ["0%", "-9%"]);
  const midR = useTransform(fan, [0, 1], [0, -3]);
  const phoneY = useTransform(fan, [0, 1], ["35%", "0%"]);
  const phoneO = useTransform(fan, [0.1, 0.55], [0, 1]);

  // The service's own steps, from "Wireframe" on — one lit per beat.
  const steps = s.processSteps.slice(1, 4);
  const s0 = useTransform(open, [0, 0.3, 0.32], [1, 1, 0.35]);
  const s1 = useTransform(open, [0.28, 0.3, 0.6, 0.62], [0.35, 1, 1, 0.35]);
  const s2 = useTransform(open, [0.58, 0.6], [0.35, 1]);
  const stepO = [s0, s1, s2];

  const card =
    "absolute inset-0 overflow-hidden rounded-[0.8cqw] border border-white/10 shadow-[0_2cqw_5cqw_-2cqw_oklch(0_0_0/0.8)]";

  return (
    <div
      aria-hidden
      className={`${SCREEN} absolute inset-0 flex flex-col [container-type:inline-size]`}
    >
      <MockNav />
      <div className="relative flex flex-1 items-center gap-[3cqw] overflow-hidden px-[3cqw]">
        <div className="relative z-10 w-[38%] shrink-0">
          <span className={EYEBROW}>{s.eyebrow}</span>
          <p className={`${TITLE} text-[3.6cqw]`}>{s.h1}</p>
          <div className="mt-[1.8cqw] flex flex-wrap gap-[0.8cqw]">
            {s.items.map((item) => (
              <span key={item} className={CHIP}>
                {item}
              </span>
            ))}
          </div>
          <span className="mt-[2cqw] inline-block rounded-[0.6cqw] bg-primary px-[1.8cqw] py-[0.8cqw] text-[1.25cqw] font-semibold text-white">
            {pages.getQuote}
          </span>
          {/* Process stepper — the real steps, lighting as the page is built. */}
          <div className="mt-[2.6cqw] flex items-center gap-[1cqw]">
            {steps.map((label, i) => (
              <motion.span
                key={label}
                style={{ opacity: stepO[i] }}
                className="flex items-center gap-[0.6cqw] text-[1.1cqw] tracking-wide text-white"
              >
                <span className="size-[0.9cqw] rounded-full bg-primary" />
                {label}
                {i < steps.length - 1 && <span className="ml-[0.4cqw] h-px w-[2cqw] bg-white/30" />}
              </motion.span>
            ))}
          </div>
        </div>

        <div className="relative h-[80%] flex-1">
          <motion.div
            style={{ x: backX, rotate: backR, opacity: fanO }}
            className="absolute inset-y-[8%] right-0 left-[14%] origin-bottom-right"
          >
            <div className={`${card} bg-white`}>
              <WorkImage
                site={back}
                kind="desktop"
                alt=""
                className="absolute inset-0 block h-full w-full"
                imgClassName="h-full w-full object-cover object-top"
              />
            </div>
          </motion.div>
          <motion.div
            style={{ x: midX, rotate: midR, opacity: fanO }}
            className="absolute inset-y-[4%] right-[2%] left-[8%] origin-bottom-right"
          >
            <div className={`${card} bg-white`}>
              <WorkImage
                site={mid}
                kind="desktop"
                alt=""
                className="absolute inset-0 block h-full w-full"
                imgClassName="h-full w-full object-cover object-top"
              />
            </div>
          </motion.div>

          {/* The page being built: blueprint underneath, the real site painting over it. */}
          <div className="absolute inset-y-0 right-[4%] left-0">
            <div className={`${card} bg-[#0a1020]`}>
              <div className="absolute inset-[5%] flex flex-col gap-[4%]">
                <motion.div
                  style={{ opacity: w0, scaleX: w0 }}
                  className={`h-[10%] origin-left rounded-[0.5cqw] ${BLUEPRINT_LINE}`}
                />
                <motion.div
                  style={{ opacity: w1, y: w1y }}
                  className={`flex h-[34%] gap-[4%] rounded-[0.5cqw] p-[3%] ${BLUEPRINT_LINE}`}
                >
                  <div className="flex flex-1 flex-col justify-center gap-[12%]">
                    <div className="h-[14%] w-[80%] rounded-full bg-white/40" />
                    <div className="h-[14%] w-[55%] rounded-full bg-white/25" />
                    <div className="h-[18%] w-[30%] rounded-[0.4cqw] bg-primary/70" />
                  </div>
                  <div className={`w-[42%] rounded-[0.4cqw] ${BLUEPRINT_FILL}`} />
                </motion.div>
                <motion.div style={{ opacity: w2 }} className="grid flex-1 grid-cols-3 gap-[4%]">
                  {[0, 1, 2].map((k) => (
                    <div
                      key={k}
                      className={`rounded-[0.5cqw] ${BLUEPRINT_LINE} ${BLUEPRINT_FILL}`}
                    />
                  ))}
                </motion.div>
                <motion.div
                  style={{ opacity: w3 }}
                  className={`h-[8%] rounded-[0.5cqw] ${BLUEPRINT_LINE}`}
                />
              </div>
              <motion.div style={{ clipPath: paintClip }} className="absolute inset-0 bg-white">
                <WorkImage
                  site={front}
                  kind="desktop"
                  alt=""
                  className="absolute inset-0 block h-full w-full"
                  imgClassName="h-full w-full object-cover object-left-top"
                />
              </motion.div>
            </div>
          </div>

          <motion.div
            style={{ y: phoneY, opacity: phoneO }}
            className="absolute -bottom-[5%] right-[-3%] aspect-[1/2] w-[19%] overflow-hidden rounded-[1.6cqw] border-[0.5cqw] border-[#05070c] bg-white shadow-[0_3cqw_6cqw_-2cqw_oklch(0_0_0/0.9)]"
          >
            <WorkImage
              site={front}
              kind="mobile"
              alt=""
              className="absolute inset-0 block h-full w-full"
              imgClassName="h-full w-full object-cover object-top"
            />
          </motion.div>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/8 px-[3cqw] py-[1.2cqw]">
        {CLIENT_SITES.map((c) => (
          <span key={c.slug} className="font-mono text-[1.05cqw] tracking-wide text-white/40">
            {c.domain}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 02 · SEO — visibility, measured on a real page                            */
/* ------------------------------------------------------------------------ */

/**
 * The client's real page on the left, scanned; on the right, the search side
 * of it. The client's own domain types into a search field, their own
 * `<title>` and description come up as a result, and the meters measure those
 * same strings — character counts against the width a results page shows.
 * Every number is a count of a real served string. No rank, score or traffic.
 */
export function SeoInspector({ site, open }: { site: ClientSite; open: MotionValue<number> }) {
  const typed = useTransform(open, [0.02, 0.26], [100, 0]);
  const typedClip = useMotionTemplate`inset(0 ${typed}% 0 0)`;
  const caretO = useTransform(open, [0, 0.26, 0.3], [1, 1, 0]);
  const scanY = useTransform(open, [0.12, 0.62], ["-10%", "110%"]);
  const scanO = useTransform(open, [0.12, 0.18, 0.56, 0.62], [0, 1, 1, 0]);
  const markO = useTransform(open, [0.3, 0.46], [0, 1]);
  const serpY = useTransform(open, [0.26, 0.46], ["18%", "0%"]);
  const serpO = useTransform(open, [0.26, 0.42], [0, 1]);
  const titleLen = site.tabTitle.length;
  const descLen = site.metaDescription?.length ?? 0;
  const tBar = useTransform(open, [0.5, 0.78], [0, Math.min(1, titleLen / 60)]);
  const dBar = useTransform(open, [0.56, 0.86], [0, Math.min(1, descLen / 160)]);
  const meterO = useTransform(open, [0.46, 0.56], [0, 1]);
  const h1O = useTransform(open, [0.8, 0.9], [0, 1]);

  const meter = (tag: string, count: number, bar: MotionValue<number>) => (
    <div className="grid grid-cols-[auto_1fr_auto] items-center gap-[1cqw]">
      <span className="font-mono text-[1.15cqw] text-primary">{tag}</span>
      <span className="relative h-[0.7cqw] overflow-hidden rounded-full bg-white/10">
        <motion.span
          style={{ scaleX: bar }}
          className="absolute inset-0 block origin-left rounded-full bg-[linear-gradient(90deg,oklch(0.65_0.18_255),oklch(0.78_0.19_253))]"
        />
      </span>
      <span className="font-mono text-[1.15cqw] tabular-nums text-white/80">{count}</span>
    </div>
  );

  return (
    <div
      aria-hidden
      className="absolute inset-0 flex overflow-hidden bg-[#0b0f18] [container-type:inline-size]"
    >
      {/* The real page, being read. */}
      <div className="relative w-[57%] shrink-0 overflow-hidden bg-white">
        <WorkImage
          site={site}
          kind="desktop"
          alt=""
          className="absolute inset-0 block h-full w-full"
          imgClassName="h-full w-full object-cover object-left-top"
        />
        <motion.div
          style={{ opacity: markO }}
          className="absolute top-[17%] left-[3%] h-[24%] w-[62%] rounded-[0.4cqw] border-[0.25cqw] border-primary bg-primary/10"
        >
          <span className="absolute -top-[2.6cqw] left-0 rounded-[0.3cqw] bg-primary px-[0.8cqw] py-[0.25cqw] font-mono text-[1.15cqw] text-white">
            h1
          </span>
        </motion.div>
        <motion.div
          style={{ y: scanY, opacity: scanO }}
          className="absolute inset-x-0 top-0 h-[16%]"
        >
          <div className="h-full w-full bg-[linear-gradient(to_bottom,transparent,oklch(0.65_0.18_255/0.22)_70%,oklch(0.78_0.19_253/0.9)_100%)]" />
        </motion.div>
      </div>

      {/* The search side. */}
      <div className="relative flex flex-1 flex-col gap-[1.8cqw] p-[2.4cqw]">
        <div className="flex items-center gap-[0.9cqw] rounded-full border border-white/12 bg-white/[0.05] px-[1.4cqw] py-[1cqw]">
          <Search className="size-[1.6cqw] shrink-0 text-white/60" strokeWidth={2.2} />
          <span className="relative font-mono text-[1.3cqw] text-white/90">
            <motion.span style={{ clipPath: typedClip }} className="block">
              {site.domain}
            </motion.span>
          </span>
          <motion.span style={{ opacity: caretO }} className="h-[1.6cqw] w-px bg-white/80" />
        </div>

        <motion.div
          style={{ y: serpY, opacity: serpO }}
          className="rounded-[0.8cqw] border border-white/10 bg-white/[0.03] p-[1.6cqw]"
        >
          <p className="flex items-center gap-[0.8cqw] text-[1.1cqw] text-white/55">
            <span className="size-[1.3cqw] rounded-full bg-white/80" />
            {site.domain}
          </p>
          <p className="mt-[0.7cqw] line-clamp-2 text-[1.6cqw] leading-[1.25] text-[oklch(0.78_0.19_253)]">
            {site.tabTitle}
          </p>
          <p className="mt-[0.7cqw] line-clamp-3 text-[1.1cqw] leading-[1.5] text-white/60">
            {site.metaDescription}
          </p>
        </motion.div>

        <motion.div style={{ opacity: meterO }} className="mt-auto space-y-[1.2cqw]">
          {meter("<title>", titleLen, tBar)}
          {site.metaDescription && meter("<meta>", descLen, dBar)}
          {site.h1 && (
            <motion.p
              style={{ opacity: h1O }}
              className="flex items-center gap-[0.8cqw] font-mono text-[1.15cqw] text-white/80"
            >
              <span className="text-primary">&lt;h1&gt;</span>
              <Check className="size-[1.4cqw] text-[oklch(0.78_0.19_253)]" strokeWidth={3} />
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 03 · E-SHOP — a real storefront becoming a purchase                       */
/* ------------------------------------------------------------------------ */

/**
 * exclusivebeauty.cz — the real storefront scrolls; a cart drawer slides in and
 * two of the site's own product photos (crops of the real capture) drop into
 * it; checkout advances through bag → payment → delivery. Names are bars and
 * steps are icons: nothing here names a product or states a price.
 */
export function ShopScene({ site, open }: { site: ClientSite; open: MotionValue<number> }) {
  const url = site.shots.desktop.webp;
  const pageY = useTransform(open, [0, 1], ["0%", "-26%"]);
  const drawerX = useTransform(open, [0.16, 0.4], ["105%", "0%"]);
  const scrim = useTransform(open, [0.16, 0.4], [0, 0.45]);
  const i1 = useBeat(open, 0.38, 0.52);
  const i2 = useBeat(open, 0.5, 0.64);
  const i1y = useTransform(i1, [0, 1], ["-40%", "0%"]);
  const i2y = useTransform(i2, [0, 1], ["-40%", "0%"]);
  const badge1 = useTransform(open, [0.44, 0.46, 0.56, 0.58], [0, 1, 1, 0]);
  const badge2 = useTransform(open, [0.56, 0.58], [0, 1]);
  const flow = useBeat(open, 0.66, 0.92);
  const c1 = useTransform(open, [0.66, 0.7], [0.3, 1]);
  const c2 = useTransform(open, [0.76, 0.8], [0.3, 1]);
  const c3 = useTransform(open, [0.86, 0.9], [0.3, 1]);
  const cta = useTransform(open, [0.9, 0.98], [0.35, 1]);

  // Crops of the site's own product photography in the capture (fractions of
  // the 1600x1000 fold): the product line-up and a treatment photo.
  const crops = [
    { x: 0.23, y: 0.41, w: 0.23, h: 0.26 },
    { x: 0.7, y: 0.41, w: 0.22, h: 0.25 },
  ];
  const items = [
    { o: i1, y: i1y, c: crops[0] },
    { o: i2, y: i2y, c: crops[1] },
  ];

  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-white [container-type:inline-size]"
    >
      <motion.div style={{ y: pageY }} className="absolute inset-x-0 top-0">
        <WorkImage
          site={site}
          kind="page"
          alt=""
          className="block w-full"
          imgClassName="block h-auto w-full"
        />
      </motion.div>
      <motion.div style={{ opacity: scrim }} className="absolute inset-0 bg-[#05070c]" />

      <motion.div
        style={{ x: drawerX }}
        className="absolute inset-y-0 right-0 flex w-[40%] flex-col gap-[1.6cqw] border-l border-white/10 bg-[#0b0f18] p-[2.2cqw] shadow-[-3cqw_0_6cqw_-2cqw_oklch(0_0_0/0.8)]"
      >
        <div className="flex items-center justify-between">
          <span className="h-[0.9cqw] w-[30%] rounded-full bg-white/45" />
          <span className="relative">
            <ShoppingBag className="size-[2.4cqw] text-white/85" strokeWidth={1.8} />
            <motion.span
              style={{ opacity: badge1 }}
              className="absolute -top-[0.9cqw] -right-[1cqw] grid size-[1.8cqw] place-items-center rounded-full bg-primary text-[1cqw] font-semibold text-white"
            >
              1
            </motion.span>
            <motion.span
              style={{ opacity: badge2 }}
              className="absolute -top-[0.9cqw] -right-[1cqw] grid size-[1.8cqw] place-items-center rounded-full bg-primary text-[1cqw] font-semibold text-white"
            >
              2
            </motion.span>
          </span>
        </div>

        <div className="space-y-[1.2cqw]">
          {items.map((it, k) => (
            <motion.div
              key={k}
              style={{ opacity: it.o, y: it.y }}
              className="flex items-center gap-[1.2cqw] rounded-[0.8cqw] border border-white/8 bg-white/[0.03] p-[0.9cqw]"
            >
              <span
                className="block w-[34%] shrink-0 rounded-[0.5cqw]"
                style={{
                  aspectRatio: `${it.c.w * 1600} / ${it.c.h * 1000}`,
                  ...cropStyle(url, it.c.x, it.c.y, it.c.w, it.c.h),
                }}
              />
              <span className="flex-1 space-y-[0.7cqw]">
                <span className="block h-[0.8cqw] w-[85%] rounded-full bg-white/50" />
                <span className="block h-[0.8cqw] w-[55%] rounded-full bg-white/25" />
              </span>
            </motion.div>
          ))}
        </div>

        {/* Checkout: bag → payment → delivery, advancing. */}
        <div className="mt-auto">
          <div className="relative flex items-center justify-between px-[0.4cqw]">
            <span className="absolute inset-x-[1.6cqw] top-1/2 h-px bg-white/12" />
            <motion.span
              style={{ scaleX: flow }}
              className="absolute inset-x-[1.6cqw] top-1/2 h-px origin-left bg-primary"
            />
            {[
              { Icon: ShoppingBag, o: c1 },
              { Icon: CreditCard, o: c2 },
              { Icon: Truck, o: c3 },
            ].map(({ Icon, o }, k) => (
              <motion.span
                key={k}
                style={{ opacity: o }}
                className="relative grid size-[3.2cqw] place-items-center rounded-full border border-primary/60 bg-[#0b0f18]"
              >
                <Icon className="size-[1.6cqw] text-[oklch(0.78_0.19_253)]" strokeWidth={2} />
              </motion.span>
            ))}
          </div>
          <motion.span
            style={{ opacity: cta }}
            className="mt-[1.8cqw] flex items-center justify-center rounded-[0.7cqw] bg-primary py-[1.3cqw]"
          >
            <ArrowRight className="size-[1.8cqw] text-white" strokeWidth={2.4} />
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 04 · BRANDING — an identity system under construction                     */
/* ------------------------------------------------------------------------ */

/**
 * elevateit.cz/services/branding — ELEVATE's own identity as the specimen (not a
 * client's: nothing in the data says ELEVATE designed a client mark). The mark
 * is constructed on a grid, the palette lays out, the type sets in a scale, and
 * the mark is applied. Captions are the branding page's own items.
 */
export function BrandBoard({ open }: { open: MotionValue<number> }) {
  const { t, lang } = useT();
  const items = usePages(lang).servicesBranding.items;
  const grid = useBeat(open, 0, 0.3);
  const gridFade = useTransform(open, [0.3, 0.55], [1, 0.3]);
  const markO = useTransform(open, [0.22, 0.44], [0, 1]);
  const markS = useTransform(open, [0.22, 0.44], [0.9, 1]);
  const sw0 = useBeat(open, 0.34, 0.46);
  const sw1 = useBeat(open, 0.4, 0.52);
  const sw2 = useBeat(open, 0.46, 0.58);
  const sw3 = useBeat(open, 0.52, 0.64);
  const sw = [sw0, sw1, sw2, sw3];
  const swY = [
    useTransform(sw0, [0, 1], ["40%", "0%"]),
    useTransform(sw1, [0, 1], ["40%", "0%"]),
    useTransform(sw2, [0, 1], ["40%", "0%"]),
    useTransform(sw3, [0, 1], ["40%", "0%"]),
  ];
  const ty0 = useBeat(open, 0.58, 0.7);
  const ty1 = useBeat(open, 0.64, 0.76);
  const ty2 = useBeat(open, 0.7, 0.82);
  const ty = [ty0, ty1, ty2];
  const tyX = [
    useTransform(ty0, [0, 1], ["-8%", "0%"]),
    useTransform(ty1, [0, 1], ["-8%", "0%"]),
    useTransform(ty2, [0, 1], ["-8%", "0%"]),
  ];
  const apply = useBeat(open, 0.8, 0.96);

  const swatches = ["#0B0F1A", "#3B82F6", "#FFFFFF", "#B9C0CE"];
  const caption = "mt-[1cqw] text-[1.2cqw] tracking-[0.2em] text-white/50 uppercase";

  return (
    <div
      aria-hidden
      className={`${SCREEN} absolute inset-0 flex flex-col [container-type:inline-size]`}
    >
      <MockNav />
      <div className="grid flex-1 grid-cols-[1.2fr_1fr] gap-[2.4cqw] p-[3cqw]">
        <div className="flex flex-col">
          {/* Deep navy, not brand blue: the mark's "A" is itself a blue arrow and
              vanished on a blue tile ("ELEV TE"). Blue stays in the linework. */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[1cqw] bg-[#0b1224]">
            <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_50%_40%,oklch(0.65_0.18_255/0.28),transparent_72%)]" />
            {/* Construction grid, drawn, then dimmed under the finished mark. */}
            <motion.svg
              style={{ opacity: gridFade }}
              viewBox="0 0 100 62"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              {[
                "M 0 20.7 L 100 20.7",
                "M 0 41.3 L 100 41.3",
                "M 33.3 0 L 33.3 62",
                "M 66.6 0 L 66.6 62",
                "M 0 0 L 100 62",
                "M 100 0 L 0 62",
              ].map((d) => (
                <motion.path
                  key={d}
                  d={d}
                  stroke="oklch(0.78 0.19 253)"
                  strokeOpacity={0.55}
                  strokeWidth={0.25}
                  fill="none"
                  style={{ pathLength: grid }}
                />
              ))}
              <motion.circle
                cx={50}
                cy={31}
                r={19}
                stroke="oklch(0.78 0.19 253)"
                strokeOpacity={0.55}
                strokeWidth={0.25}
                fill="none"
                style={{ pathLength: grid }}
              />
            </motion.svg>
            <motion.div style={{ opacity: markO, scale: markS }} className="relative">
              <Logo className="h-[6.5cqw] w-auto" />
            </motion.div>
          </div>
          <span className={caption}>{items[0]}</span>
        </div>

        <div className="flex flex-col gap-[2cqw]">
          <div className="flex flex-col">
            <div className="grid h-[9cqw] grid-cols-4 gap-[0.8cqw]">
              {swatches.map((c, k) => (
                <motion.div
                  key={c}
                  style={{ opacity: sw[k], y: swY[k], background: c }}
                  className="relative rounded-[0.6cqw] border border-white/10"
                >
                  <span
                    className={`absolute bottom-[0.8cqw] left-[0.8cqw] font-mono text-[0.95cqw] ${k >= 2 ? "text-black/60" : "text-white/70"}`}
                  >
                    {c}
                  </span>
                </motion.div>
              ))}
            </div>
            <span className={caption}>{items[1]}</span>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="flex flex-1 flex-col justify-center gap-[0.6cqw] overflow-hidden rounded-[1cqw] border border-white/10 px-[2cqw]">
              <motion.span
                style={{ opacity: ty[0], x: tyX[0] }}
                className="font-display text-[4.6cqw] leading-none font-extrabold tracking-tight text-white"
              >
                ELEVATE
              </motion.span>
              <motion.span
                style={{ opacity: ty[1], x: tyX[1] }}
                className="font-display text-[2.4cqw] leading-none font-extrabold tracking-tight text-white/85"
              >
                ELEVATE
              </motion.span>
              <motion.span
                style={{ opacity: ty[2], x: tyX[2] }}
                className="text-[1.4cqw] text-white/60"
              >
                {t.hero.sceneKicker} · Montserrat / Inter
              </motion.span>
            </div>
            <span className={caption}>{items[2]}</span>
          </div>

          <motion.div style={{ opacity: apply }} className="grid h-[6cqw] grid-cols-2 gap-[0.8cqw]">
            <div className="grid place-items-center rounded-[0.6cqw] bg-[#05070c]">
              <Logo className="h-[2cqw] w-auto" />
            </div>
            <div className="grid place-items-center rounded-[0.6cqw] bg-[oklch(0.3_0.09_258)]">
              <Logo className="h-[2cqw] w-auto" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------ */
/* 05 · APPS — a mobile flow, tapped through                                 */
/* ------------------------------------------------------------------------ */

/**
 * elevateit.cz/services — the app ELEVATE would build, drawn in the blueprint
 * register (explicitly a design, not a claimed shipped product): three screens
 * of one flow — onboarding, list, detail — appear in order while a tap travels
 * through them. Words are the service's own title, tags and CTA label.
 */
export function AppStage({ open }: { open: MotionValue<number> }) {
  const { t, lang } = useT();
  const stage = t.ui.serviceStage[4];
  const bullets = t.ui.showcaseBullets[4] ?? [];
  const common = usePages(lang).common;
  const p0 = useBeat(open, 0.0, 0.2);
  const p1 = useBeat(open, 0.14, 0.34);
  const p2 = useBeat(open, 0.28, 0.48);
  const py = [
    useTransform(p0, [0, 1], ["14%", "0%"]),
    useTransform(p1, [0, 1], ["14%", "0%"]),
    useTransform(p2, [0, 1], ["14%", "0%"]),
  ];
  const link1 = useBeat(open, 0.46, 0.58);
  const link2 = useBeat(open, 0.66, 0.78);
  // Transforms, not left/top: each axis on its own full-size wrapper, so a
  // percentage translate resolves against the flow row, not the dot.
  const tapX = useTransform(
    open,
    [0.4, 0.5, 0.6, 0.7, 0.82, 0.9],
    ["16.5%", "16.5%", "50%", "50%", "83.5%", "83.5%"],
  );
  const tapY = useTransform(
    open,
    [0.4, 0.5, 0.6, 0.7, 0.82, 0.9],
    ["86%", "86%", "52%", "52%", "78%", "78%"],
  );
  const tapO = useTransform(open, [0.38, 0.42, 0.92, 0.98], [0, 1, 1, 0]);
  const ring = [
    useTransform(open, [0.4, 0.46, 0.54, 0.6], [0, 1, 1, 0]),
    useTransform(open, [0.6, 0.66, 0.74, 0.8], [0, 1, 1, 0]),
    useTransform(open, [0.8, 0.86], [0, 1]),
  ];

  const phone =
    "relative aspect-[1/1.95] h-full overflow-hidden rounded-[2.4cqw] border-[0.5cqw] border-[#05070c] bg-[#0a1020] shadow-[0_3cqw_6cqw_-2cqw_oklch(0_0_0/0.9)]";
  const bar = (w: string, o = "bg-white/40") => (
    <span className={`block h-[0.7cqw] rounded-full ${o}`} style={{ width: w }} />
  );

  return (
    <div
      aria-hidden
      className={`${SCREEN} absolute inset-0 flex flex-col [container-type:inline-size]`}
    >
      <MockNav />
      <div className="relative flex flex-1 flex-col overflow-hidden px-[3cqw] pt-[2.2cqw] pb-[2cqw]">
        <div className="absolute inset-0 bg-[radial-gradient(55%_60%_at_60%_62%,oklch(0.65_0.18_255/0.18),transparent_70%)]" />
        <div className="relative z-10 flex items-end justify-between gap-[3cqw]">
          <div>
            <span className={EYEBROW}>{t.ui.homeServicesEyebrow}</span>
            <p className={`${TITLE} text-[2.8cqw]`}>{stage.title}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-[0.8cqw]">
            {bullets.map((b) => (
              <span key={b} className={CHIP}>
                {b}
              </span>
            ))}
          </div>
        </div>

        <div className="relative z-10 mt-[2.2cqw] flex min-h-0 flex-1 items-stretch justify-between">
          {/* connectors between the screens */}
          <motion.span
            style={{ scaleX: link1 }}
            className="absolute top-1/2 left-[27%] h-px w-[12%] origin-left bg-primary"
          />
          <motion.span
            style={{ scaleX: link2 }}
            className="absolute top-1/2 left-[61%] h-px w-[12%] origin-left bg-primary"
          />

          {/* 1 · onboarding */}
          <motion.div style={{ opacity: p0, y: py[0] }} className="flex w-[33%] justify-center">
            <div className={phone}>
              <motion.span
                style={{ opacity: ring[0] }}
                className="absolute inset-0 z-10 rounded-[2cqw] ring-[0.3cqw] ring-primary"
              />
              <div className="flex h-full flex-col items-center justify-between p-[1.6cqw]">
                <Logo className="mt-[1.2cqw] h-[1.4cqw] w-auto" />
                <span
                  className={`block aspect-square w-[62%] rounded-full ${BLUEPRINT_LINE} ${BLUEPRINT_FILL}`}
                />
                <span className="w-full space-y-[0.7cqw]">
                  {bar("80%")}
                  {bar("56%", "bg-white/25")}
                </span>
                <span className="block h-[2.2cqw] w-full rounded-[0.8cqw] bg-primary" />
              </div>
            </div>
          </motion.div>

          {/* 2 · list */}
          <motion.div style={{ opacity: p1, y: py[1] }} className="flex w-[33%] justify-center">
            <div className={phone}>
              <motion.span
                style={{ opacity: ring[1] }}
                className="absolute inset-0 z-10 rounded-[2cqw] ring-[0.3cqw] ring-primary"
              />
              <div className="flex h-full flex-col gap-[0.9cqw] p-[1.4cqw]">
                <span className="w-full pt-[0.6cqw]">{bar("46%", "bg-white/55")}</span>
                {[0, 1, 2, 3].map((k) => (
                  <span
                    key={k}
                    className={`flex items-center gap-[0.8cqw] rounded-[0.8cqw] p-[0.8cqw] ${k === 1 ? "bg-primary/20 ring-1 ring-primary/60" : BLUEPRINT_LINE}`}
                  >
                    <span
                      className={`block size-[2.4cqw] shrink-0 rounded-[0.5cqw] ${BLUEPRINT_FILL}`}
                    />
                    <span className="flex-1 space-y-[0.5cqw]">
                      {bar("78%")}
                      {bar("50%", "bg-white/25")}
                    </span>
                  </span>
                ))}
                <span
                  className={`mt-auto flex justify-around rounded-[0.8cqw] py-[0.8cqw] ${BLUEPRINT_LINE}`}
                >
                  {[0, 1, 2].map((k) => (
                    <span
                      key={k}
                      className={`block size-[1.2cqw] rounded-[0.3cqw] ${k === 0 ? "bg-primary" : "bg-white/25"}`}
                    />
                  ))}
                </span>
              </div>
            </div>
          </motion.div>

          {/* 3 · detail */}
          <motion.div style={{ opacity: p2, y: py[2] }} className="flex w-[33%] justify-center">
            <div className={phone}>
              <motion.span
                style={{ opacity: ring[2] }}
                className="absolute inset-0 z-10 rounded-[2cqw] ring-[0.3cqw] ring-primary"
              />
              <div className="flex h-full flex-col gap-[1cqw] p-[1.4cqw]">
                <span
                  className={`block h-[38%] w-full rounded-[0.9cqw] ${BLUEPRINT_LINE} ${BLUEPRINT_FILL}`}
                />
                <span className="space-y-[0.7cqw]">
                  {bar("70%", "bg-white/55")}
                  {bar("90%")}
                  {bar("62%", "bg-white/25")}
                </span>
                <span className="mt-auto block rounded-[0.8cqw] bg-primary py-[0.9cqw] text-center text-[1.05cqw] font-semibold text-white">
                  {common.getQuote}
                </span>
              </div>
            </div>
          </motion.div>

          {/* the tap, travelling the flow */}
          <motion.div
            style={{ x: tapX, opacity: tapO }}
            className="pointer-events-none absolute inset-0 z-20"
          >
            <motion.div style={{ y: tapY }} className="absolute inset-0">
              <span className="absolute top-0 left-0 size-[2.6cqw] -translate-x-1/2 -translate-y-1/2 rounded-full border-[0.3cqw] border-white/90 bg-white/25 shadow-[0_0_2cqw_oklch(0.78_0.19_253/0.8)]" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
