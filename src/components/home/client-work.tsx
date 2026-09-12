/**
 * The four real client sites, as ELEVATE's homepage shows them.
 *
 * Every image here is a static capture of the live client site, taken in a
 * real browser by `scripts/capture-client-work.mjs` — never generated, never
 * retouched. They replaced the runtime WordPress mshots dependency, which had
 * no fallback and returned whatever state the page was in (one capture arrived
 * under the clinic's own cookie banner, another as an empty white field).
 *
 * What is stated about each site is only what the site itself says: its
 * domain (from `PROJECTS_BASE`), and its own `<title>`, meta description and
 * `<h1>` as served on 2026-09-11. Those are the client's words, shown the way
 * a browser tab and a search result show them — not claims written here.
 *
 * NOT used on the homepage, on purpose: the `description` / `problem` /
 * `solution` / `work` copy in `projects-i18n.ts`. For two of the four sites it
 * describes a different business from the one the live site is (N Home Praha
 * is written up as luxury real estate; inhomepraha.cz is a cleaning and moving
 * company. EuroMotors is written up as a premium car dealer with test-drive
 * booking; euromotors.cz is a repair shop). Putting that copy next to the real
 * screenshot would state something the screenshot visibly contradicts. The
 * data is not this file's to change — it is reported, not rewritten.
 */
import { PROJECTS_BASE, type ProjectSlug } from "@/lib/projects";

import biodentDesktopWebp from "@/assets/work/biodent-clinic-desktop.webp";
import biodentDesktopSmWebp from "@/assets/work/biodent-clinic-desktop-sm.webp";
import biodentDesktopSmJpg from "@/assets/work/biodent-clinic-desktop-sm.jpg";
import biodentDesktopJpg from "@/assets/work/biodent-clinic-desktop.jpg";
import biodentPageWebp from "@/assets/work/biodent-clinic-page.webp";
import biodentPageJpg from "@/assets/work/biodent-clinic-page.jpg";
import biodentMobileWebp from "@/assets/work/biodent-clinic-mobile.webp";
import biodentMobileJpg from "@/assets/work/biodent-clinic-mobile.jpg";
import beautyDesktopWebp from "@/assets/work/exclusive-beauty-desktop.webp";
import beautyDesktopSmWebp from "@/assets/work/exclusive-beauty-desktop-sm.webp";
import beautyDesktopSmJpg from "@/assets/work/exclusive-beauty-desktop-sm.jpg";
import beautyDesktopJpg from "@/assets/work/exclusive-beauty-desktop.jpg";
import beautyPageWebp from "@/assets/work/exclusive-beauty-page.webp";
import beautyPageJpg from "@/assets/work/exclusive-beauty-page.jpg";
import beautyMobileWebp from "@/assets/work/exclusive-beauty-mobile.webp";
import beautyMobileJpg from "@/assets/work/exclusive-beauty-mobile.jpg";
import nhomeDesktopWebp from "@/assets/work/nhome-praha-desktop.webp";
import nhomeDesktopSmWebp from "@/assets/work/nhome-praha-desktop-sm.webp";
import nhomeDesktopSmJpg from "@/assets/work/nhome-praha-desktop-sm.jpg";
import nhomeDesktopJpg from "@/assets/work/nhome-praha-desktop.jpg";
import nhomePageWebp from "@/assets/work/nhome-praha-page.webp";
import nhomePageJpg from "@/assets/work/nhome-praha-page.jpg";
import nhomeMobileWebp from "@/assets/work/nhome-praha-mobile.webp";
import nhomeMobileJpg from "@/assets/work/nhome-praha-mobile.jpg";
import euroDesktopWebp from "@/assets/work/euromotors-desktop.webp";
import euroDesktopSmWebp from "@/assets/work/euromotors-desktop-sm.webp";
import euroDesktopSmJpg from "@/assets/work/euromotors-desktop-sm.jpg";
import euroDesktopJpg from "@/assets/work/euromotors-desktop.jpg";
import euroPageWebp from "@/assets/work/euromotors-page.webp";
import euroPageJpg from "@/assets/work/euromotors-page.jpg";
import euroMobileWebp from "@/assets/work/euromotors-mobile.webp";
import euroMobileJpg from "@/assets/work/euromotors-mobile.jpg";

export type WorkKind = "desktop" | "page" | "mobile";

type Shot = {
  webp: string;
  jpg: string;
  width: number;
  height: number;
  /** Half-width cut, offered through `srcset` so a phone showing this capture
   *  in a ~290px window does not fetch the 1600px plate. */
  sm?: { webp: string; jpg: string; width: number };
};

export interface ClientSite {
  slug: ProjectSlug;
  name: string;
  domain: string;
  url: string;
  /** The site's own `<title>`, shown where a browser shows it: the tab. */
  tabTitle: string;
  /** The site's own meta description and h1, where it serves them. */
  metaDescription?: string;
  h1?: string;
  shots: Record<WorkKind, Shot>;
}

/** Natural sizes stamped by `scripts/capture-client-work.mjs`. */
const desktop = (webp: string, jpg: string, smWebp: string, smJpg: string): Shot => ({
  webp,
  jpg,
  width: 1600,
  height: 1000,
  sm: { webp: smWebp, jpg: smJpg, width: 800 },
});
const page = (webp: string, jpg: string): Shot => ({ webp, jpg, width: 1200, height: 1875 });
const mobile = (webp: string, jpg: string, height = 960): Shot => ({
  webp,
  jpg,
  width: 480,
  height,
});

const EXTRA: Record<ProjectSlug, Omit<ClientSite, "slug" | "name" | "domain" | "url">> = {
  "biodent-clinic": {
    tabTitle: "Stomatologie Praha | Zubní ordinace Praha 2 | BioDent",
    metaDescription:
      "Moderní stomatologie s 15 lety zkušeností. 3D diagnostika, kvalitní materiály a citlivý přístup. Pracujeme i v sobotu. Objednejte se online.",
    h1: "Stomatologická ordinace BioDent v Praze",
    shots: {
      desktop: desktop(
        biodentDesktopWebp,
        biodentDesktopJpg,
        biodentDesktopSmWebp,
        biodentDesktopSmJpg,
      ),
      page: page(biodentPageWebp, biodentPageJpg),
      mobile: mobile(biodentMobileWebp, biodentMobileJpg, 950),
    },
  },
  "exclusive-beauty": {
    tabTitle: "Síť salonu Exclusive Beauty Clinic - Kosmetický salon Praha",
    metaDescription:
      "Kosmetický salon Exclusive Beauty nabízí širokou škálu kosmetických služeb. Naší specialitou jsou depilace cukrovou vatou a ošetření ultrazvukovou špachtlí.",
    shots: {
      desktop: desktop(
        beautyDesktopWebp,
        beautyDesktopJpg,
        beautyDesktopSmWebp,
        beautyDesktopSmJpg,
      ),
      page: page(beautyPageWebp, beautyPageJpg),
      mobile: mobile(beautyMobileWebp, beautyMobileJpg),
    },
  },
  "nhome-praha": {
    tabTitle: "Úklidové služby, chemické čištění nábytku, stěhování a hodinový manžel - INHOME",
    shots: {
      desktop: desktop(nhomeDesktopWebp, nhomeDesktopJpg, nhomeDesktopSmWebp, nhomeDesktopSmJpg),
      page: page(nhomePageWebp, nhomePageJpg),
      mobile: mobile(nhomeMobileWebp, nhomeMobileJpg),
    },
  },
  euromotors: {
    tabTitle: "Kompletní opravy a údržba vozidel | Autoservis EURO-MOTORS",
    metaDescription:
      "V Praze 10 provádíme kompletní opravy a údržbu osobních i užitkových vozů všech značek. Zaručujeme vysokou kvalitu práce! Obraťte se na náš autoservis ještě dnes!",
    h1: "Důvěryhodný a spolehlivý autoservis pro vaše auto v Praze",
    shots: {
      desktop: desktop(euroDesktopWebp, euroDesktopJpg, euroDesktopSmWebp, euroDesktopSmJpg),
      page: page(euroPageWebp, euroPageJpg),
      mobile: mobile(euroMobileWebp, euroMobileJpg),
    },
  },
};

/** In `PROJECTS_BASE` order — the order the rest of the site lists them in. */
export const CLIENT_SITES: ClientSite[] = PROJECTS_BASE.map((p) => ({
  slug: p.slug,
  name: p.name,
  domain: p.domain,
  url: p.url,
  ...EXTRA[p.slug],
}));

export const clientSite = (slug: ProjectSlug) =>
  CLIENT_SITES.find((s) => s.slug === slug) as ClientSite;

/**
 * One client capture. Static imports only (see `SceneImage`): a runtime-built
 * path would fall out of Vite's asset graph and 404 in a production build.
 */
export function WorkImage({
  site,
  kind,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes,
  style,
}: {
  site: ClientSite;
  kind: WorkKind;
  /** Empty when the image is decoration beside a caption that names the site. */
  alt: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}) {
  const shot = site.shots[kind];
  const set = (full: string, small?: string) =>
    shot.sm && small ? `${small} ${shot.sm.width}w, ${full} ${shot.width}w` : full;
  return (
    <picture className={className} style={style}>
      <source type="image/webp" srcSet={set(shot.webp, shot.sm?.webp)} sizes={sizes} />
      <img
        src={shot.jpg}
        srcSet={shot.sm ? set(shot.jpg, shot.sm.jpg) : undefined}
        alt={alt}
        width={shot.width}
        height={shot.height}
        sizes={sizes}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        draggable={false}
        className={imgClassName}
      />
    </picture>
  );
}
