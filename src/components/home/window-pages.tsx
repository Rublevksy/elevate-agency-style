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
 *  - no metric, rank, score or percentage appears anywhere in a window.
 */
import { motion, useTransform, type MotionValue } from "framer-motion";
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

/**
 * elevateit.cz/services/web — the page the hero's window navigates to.
 *
 * The real service page's own words on the left; on the right, what a web
 * studio's service page actually leads with — its work: three real client
 * sites fanned out and one of them at phone width. The fan opens as `open`
 * goes 0..1, so the page arrives and then shows its evidence.
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

  const backX = useTransform(open, [0, 1], ["0%", "-16%"]);
  const backR = useTransform(open, [0, 1], [0, -6]);
  const midX = useTransform(open, [0, 1], ["0%", "-8%"]);
  const midR = useTransform(open, [0, 1], [0, -3]);
  const phoneY = useTransform(open, [0, 1], ["22%", "0%"]);
  const phoneO = useTransform(open, [0, 0.6], [0, 1]);

  const shot =
    "absolute inset-0 overflow-hidden rounded-[0.8cqw] border border-white/10 bg-white shadow-[0_2cqw_5cqw_-2cqw_oklch(0_0_0/0.8)]";

  return (
    <div
      aria-hidden
      className={`${SCREEN} absolute inset-0 flex flex-col [container-type:inline-size]`}
    >
      <MockNav />
      <div className="relative flex flex-1 items-center gap-[3cqw] overflow-hidden px-[3cqw]">
        <div className="relative z-10 w-[40%] shrink-0">
          <span className="text-[1.2cqw] tracking-[0.2em] text-primary uppercase">{s.eyebrow}</span>
          <p className="font-display mt-[1.2cqw] text-[3.6cqw] leading-[1.08] font-extrabold tracking-tight text-white">
            {s.h1}
          </p>
          <p className="mt-[1.4cqw] line-clamp-3 text-[1.35cqw] leading-[1.55] text-white/60">
            {s.intro}
          </p>
          <div className="mt-[1.8cqw] flex flex-wrap gap-[0.8cqw]">
            {s.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/15 px-[1.2cqw] py-[0.45cqw] text-[1.15cqw] text-white/65"
              >
                {item}
              </span>
            ))}
          </div>
          <span className="mt-[2cqw] inline-block rounded-[0.6cqw] bg-primary px-[1.8cqw] py-[0.8cqw] text-[1.25cqw] font-semibold text-white">
            {pages.getQuote}
          </span>
        </div>

        <div className="relative h-[78%] flex-1">
          <motion.div
            style={{ x: backX, rotate: backR }}
            className="absolute inset-y-[8%] right-0 left-[14%] origin-bottom-right"
          >
            <div className={shot}>
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
            style={{ x: midX, rotate: midR }}
            className="absolute inset-y-[4%] right-[2%] left-[8%] origin-bottom-right"
          >
            <div className={shot}>
              <WorkImage
                site={mid}
                kind="desktop"
                alt=""
                className="absolute inset-0 block h-full w-full"
                imgClassName="h-full w-full object-cover object-top"
              />
            </div>
          </motion.div>
          <div className="absolute inset-y-0 right-[4%] left-0">
            <div className={shot}>
              <WorkImage
                site={front}
                kind="desktop"
                alt=""
                className="absolute inset-0 block h-full w-full"
                imgClassName="h-full w-full object-cover object-top"
              />
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

/**
 * SEO, shown on a real site: the client's page with an inspector docked over
 * it. The inspector reads the site's OWN served `<title>`, meta description and
 * `<h1>` — the three strings SEO work is literally about — and previews them
 * the way a results page lists them. No rank, no score, no traffic figure.
 */
export function SeoInspector({ site, open }: { site: ClientSite; open: MotionValue<number> }) {
  const panelY = useTransform(open, [0, 1], ["100%", "0%"]);
  const markO = useTransform(open, [0.3, 0.8], [0, 1]);
  return (
    <div
      aria-hidden
      className="absolute inset-0 overflow-hidden bg-white [container-type:inline-size]"
    >
      <WorkImage
        site={site}
        kind="desktop"
        alt=""
        className="absolute inset-0 block h-full w-full"
        imgClassName="h-full w-full object-cover object-top"
      />
      {/* The h1, outlined where the page renders it (Biodent's heading block
          sits in the left column of its first screen). */}
      <motion.div
        style={{ opacity: markO }}
        className="absolute top-[17%] left-[2%] h-[23%] w-[37%] rounded-[0.4cqw] border-[0.25cqw] border-primary bg-primary/10"
      >
        <span className="absolute -top-[2.6cqw] left-0 rounded-[0.3cqw] bg-primary px-[0.8cqw] py-[0.25cqw] font-mono text-[1.15cqw] text-white">
          h1
        </span>
      </motion.div>

      <motion.div
        style={{ y: panelY }}
        className="absolute inset-x-0 bottom-0 h-[54%] border-t border-white/10 bg-[#0b0f18]/97 px-[3cqw] py-[2.2cqw] font-mono"
      >
        <div className="grid h-full grid-cols-[1.15fr_1fr] gap-[3cqw]">
          <div className="min-w-0 space-y-[1.1cqw] text-[1.3cqw] leading-[1.5]">
            <p className="truncate">
              <span className="text-primary">&lt;title&gt;</span>
              <span className="text-white/85">{site.tabTitle}</span>
              <span className="text-primary">&lt;/title&gt;</span>
            </p>
            {site.metaDescription && (
              <p className="line-clamp-3">
                <span className="text-primary">
                  &lt;meta name=&quot;description&quot; content=&quot;
                </span>
                <span className="text-white/70">{site.metaDescription}</span>
                <span className="text-primary">&quot;&gt;</span>
              </p>
            )}
            {site.h1 && (
              <p className="truncate">
                <span className="text-primary">&lt;h1&gt;</span>
                <span className="text-white/85">{site.h1}</span>
                <span className="text-primary">&lt;/h1&gt;</span>
              </p>
            )}
          </div>
          <div className="min-w-0 rounded-[0.8cqw] border border-white/10 bg-white/[0.03] p-[1.8cqw] font-sans">
            <p className="flex items-center gap-[0.8cqw] text-[1.15cqw] text-white/55">
              <span className="size-[1.4cqw] rounded-full bg-white/80" />
              {site.domain}
            </p>
            <p className="mt-[0.8cqw] line-clamp-2 text-[1.75cqw] leading-[1.25] text-[oklch(0.78_0.19_253)]">
              {site.tabTitle}
            </p>
            <p className="mt-[0.8cqw] line-clamp-3 text-[1.2cqw] leading-[1.5] text-white/60">
              {site.metaDescription}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/**
 * elevateit.cz/services/branding — ELEVATE's own identity as the specimen.
 *
 * Not a client's logo: nothing in the project data says ELEVATE designed any of
 * the four client marks, so showing them here would be a claim. The studio's
 * own mark, palette and type are real and are the honest sample. The three
 * captions are the branding page's own three items (logo, colours, type).
 */
export function BrandBoard({ open }: { open: MotionValue<number> }) {
  const { lang } = useT();
  const items = usePages(lang).servicesBranding.items;
  const a = useTransform(open, [0, 0.45], [0, 1]);
  const b = useTransform(open, [0.2, 0.65], [0, 1]);
  const c = useTransform(open, [0.4, 0.85], [0, 1]);
  const ay = useTransform(open, [0, 0.45], ["6%", "0%"]);
  const by = useTransform(open, [0.2, 0.65], ["6%", "0%"]);
  const cy = useTransform(open, [0.4, 0.85], ["6%", "0%"]);

  const swatches = [
    { c: "#0B0F1A", n: "#0B0F1A" },
    { c: "#3B82F6", n: "#3B82F6" },
    { c: "#FFFFFF", n: "#FFFFFF" },
    { c: "#B9C0CE", n: "#B9C0CE" },
  ];
  const caption = "mt-[1cqw] text-[1.2cqw] tracking-[0.2em] text-white/50 uppercase";

  return (
    <div
      aria-hidden
      className={`${SCREEN} absolute inset-0 flex flex-col [container-type:inline-size]`}
    >
      <MockNav />
      <div className="grid flex-1 grid-cols-[1.25fr_1fr] gap-[2.4cqw] p-[3cqw]">
        <motion.div style={{ opacity: a, y: ay }} className="flex flex-col">
          <div className="relative flex flex-1 items-center justify-center overflow-hidden rounded-[1cqw] bg-primary">
            <div className="absolute inset-0 bg-[radial-gradient(70%_80%_at_30%_20%,oklch(1_0_0/0.22),transparent_70%)]" />
            <Logo className="relative h-[6.5cqw] w-auto" />
          </div>
          <span className={caption}>{items[0]}</span>
        </motion.div>
        <div className="flex flex-col gap-[2.4cqw]">
          <motion.div style={{ opacity: b, y: by }} className="flex flex-1 flex-col">
            <div className="grid flex-1 grid-cols-4 overflow-hidden rounded-[1cqw] border border-white/10">
              {swatches.map((s) => (
                <div key={s.c} className="relative" style={{ background: s.c }}>
                  <span
                    className={`absolute bottom-[1cqw] left-[1cqw] font-mono text-[1cqw] ${
                      s.c === "#FFFFFF" || s.c === "#B9C0CE" ? "text-black/60" : "text-white/70"
                    }`}
                  >
                    {s.n}
                  </span>
                </div>
              ))}
            </div>
            <span className={caption}>{items[1]}</span>
          </motion.div>
          <motion.div style={{ opacity: c, y: cy }} className="flex flex-1 flex-col">
            <div className="flex flex-1 items-end justify-between rounded-[1cqw] border border-white/10 px-[2cqw] pb-[1.4cqw]">
              <span className="font-display text-[9cqw] leading-none font-extrabold tracking-tight text-white">
                Aa
              </span>
              <span className="pb-[1cqw] text-right text-[1.3cqw] leading-[1.6] text-white/60">
                <span className="font-display block font-extrabold text-white">Montserrat</span>
                <span className="block">Inter</span>
              </span>
            </div>
            <span className={caption}>{items[2]}</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * Apps — elevateit.cz/services, showing the app the studio would build.
 *
 * It used to be the approved `hero-iphone` photograph: beautiful, but the one
 * chapter of five containing no interface at all, which read as decoration
 * next to four chapters of real web material. It is now drawn in the same
 * schematic register as the builder's blueprint — explicitly a design, not a
 * claim that some shipped app exists — with the service's own real name, tags
 * and CTA label. The address bar says `/services`, which is the page this is,
 * so the window never contradicts itself.
 */
export function AppStage({ open }: { open: MotionValue<number> }) {
  const { t, lang } = useT();
  const stage = t.ui.serviceStage[4];
  const bullets = t.ui.showcaseBullets[4] ?? [];
  const common = usePages(lang).common;
  const phoneY = useTransform(open, [0, 1], ["10%", "0%"]);
  const phoneO = useTransform(open, [0, 0.55], [0, 1]);
  const line = "border border-dashed border-[oklch(0.72_0.16_250/0.6)]";

  return (
    <div
      aria-hidden
      className={`${SCREEN} absolute inset-0 flex flex-col [container-type:inline-size]`}
    >
      <MockNav />
      <div className="relative flex flex-1 items-center gap-[3cqw] overflow-hidden px-[3cqw]">
        <div className="absolute inset-0 bg-[radial-gradient(55%_65%_at_72%_55%,oklch(0.65_0.18_255/0.18),transparent_70%)]" />
        <div className="relative z-10 w-[46%] shrink-0">
          <span className="text-[1.2cqw] tracking-[0.2em] text-primary uppercase">
            {t.ui.homeServicesEyebrow}
          </span>
          <p className="font-display mt-[1.2cqw] text-[3.4cqw] leading-[1.08] font-extrabold tracking-tight text-white">
            {stage.title}
          </p>
          <div className="mt-[1.8cqw] flex flex-wrap gap-[0.8cqw]">
            {bullets.map((b) => (
              <span
                key={b}
                className="rounded-full border border-white/15 px-[1.2cqw] py-[0.45cqw] text-[1.15cqw] text-white/65"
              >
                {b}
              </span>
            ))}
          </div>
          <span className="mt-[2cqw] inline-block rounded-[0.6cqw] bg-primary px-[1.8cqw] py-[0.8cqw] text-[1.25cqw] font-semibold text-white">
            {common.getQuote}
          </span>
        </div>

        {/* The app itself, as a drawing on the device. */}
        <div className="relative z-10 flex flex-1 justify-center">
          <motion.div
            style={{ y: phoneY, opacity: phoneO }}
            className="relative aspect-[1/1.9] w-[46%] overflow-hidden rounded-[3cqw] border-[0.6cqw] border-[#05070c] bg-[#0a1020] shadow-[0_3cqw_7cqw_-2cqw_oklch(0_0_0/0.9)]"
          >
            <div className="flex h-full flex-col p-[1.6cqw]">
              <div className="flex items-center justify-between px-[0.6cqw] pb-[1.2cqw]">
                <Logo className="h-[1.5cqw] w-auto" />
                <span className={`block size-[1.6cqw] rounded-full ${line}`} />
              </div>
              <div
                className={`mb-[1.2cqw] h-[9cqw] shrink-0 rounded-[1.2cqw] ${line} bg-[oklch(0.72_0.16_250/0.14)]`}
              />
              <div className="flex flex-1 flex-col gap-[1cqw]">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-[1cqw] rounded-[1cqw] p-[1cqw] ${line}`}
                  >
                    <span className="block size-[3cqw] shrink-0 rounded-[0.6cqw] bg-[oklch(0.72_0.16_250/0.22)]" />
                    <span className="flex-1 space-y-[0.6cqw]">
                      <span className="block h-[0.7cqw] w-[72%] rounded-full bg-white/45" />
                      <span className="block h-[0.7cqw] w-[48%] rounded-full bg-white/25" />
                    </span>
                  </div>
                ))}
              </div>
              <span className="mt-[1.2cqw] block rounded-[1cqw] bg-primary py-[1.2cqw] text-center text-[1.3cqw] font-semibold text-white">
                {common.getQuote}
              </span>
              {/* tab bar */}
              <div
                className={`mt-[1.2cqw] flex items-center justify-around rounded-[1cqw] px-[1cqw] py-[1cqw] ${line}`}
              >
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`block size-[1.6cqw] rounded-[0.4cqw] ${i === 0 ? "bg-primary" : "bg-white/25"}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
