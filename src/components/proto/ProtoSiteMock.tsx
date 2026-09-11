/**
 * What is actually inside the browser windows on /proto.
 *
 * This exists because the independent critique of the first prototype found
 * the one thing that undermined the whole device: the chrome promised "a real
 * website" and the frame contained a centred logo (hero) and three untitled
 * colour blocks (service). Chrome wrapped around emptiness reads as
 * unfinished, not as intentional — a studio whose pitch is "we build websites
 * that convert" was showing an empty window twice in a row.
 *
 * So these are real compositions, not placeholders:
 *
 *   - real ELEVATE navigation labels (`t.nav`), in all four languages;
 *   - real copy — the home mock uses `t.hero.tag`/`title1`/`title2`, which is
 *     DIFFERENT real ELEVATE copy from the `sceneLine*` strings the outer page
 *     hero is showing at the same moment, so nothing is said twice on screen;
 *   - the real wordmark, as the real `<Logo>` component;
 *   - real approved photography (`hero-macbook` / `hero-iphone` plates through
 *     `SceneImage`) — never a generated screen, never a baked glyph;
 *   - real service copy and the real price for the service mock.
 *
 * NOT used, and worth recording: live client screenshots. `screenshotUrl()`
 * (WordPress mshots) is the project's existing way of showing the four real
 * client sites and would have been the single most convincing thing to put
 * behind this glass. It returns HTTP 403 from here for every project URL, so
 * the window would have rendered a broken image. That is reported rather than
 * worked around — see the run's report; it also means the production
 * `CaseShowcase` may currently be showing nothing.
 *
 * Nothing here invents a statistic, a metric, a client, or a UI string.
 */
import { SceneImage } from "@/components/media/SceneImage";
import { Logo } from "@/components/Logo";
import { useT } from "@/lib/i18n";
import { usePages } from "@/lib/pages-i18n";

/** The mock's own surface — a lit screen, deliberately lighter than the page
 *  ground behind it so the glass reads as a separate plane rather than as a
 *  hole cut in the section. */
const SCREEN = "bg-[#0d1220]";

/**
 * The navigation bar, shared by both mocks so the two windows read as two
 * pages of ONE site rather than two unrelated screens. Labels are real and
 * translated; `aria-hidden` because this is depicted UI, not the page's own
 * navigation — a screen reader announcing a second, non-functioning "Domů /
 * Služby / Projekty" set would be a duplicate of the real Nav.
 */
function MockNav({ compact = false }: { compact?: boolean }) {
  const { t } = useT();
  const items = compact
    ? [t.nav.services, t.nav.work]
    : [t.nav.home, t.nav.services, t.nav.work, t.nav.pricing];

  return (
    <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
      <Logo className="h-2.5 w-auto opacity-95" />
      <div className="flex items-center gap-3">
        {items.map((label) => (
          <span key={label} className="text-[0.5rem] tracking-wide text-white/50">
            {label}
          </span>
        ))}
        <span className="rounded-full bg-primary px-2 py-[3px] text-[0.5rem] font-semibold text-white">
          {t.nav.contact}
        </span>
      </div>
    </div>
  );
}

/**
 * The home page, as ELEVATE actually builds one: nav, a two-column hero with
 * real headline and two real CTAs, a real photographic plate, and a numbered
 * strip of the real five services underneath.
 */
export function ProtoSiteHome({ compact = false }: { compact?: boolean }) {
  const { t } = useT();
  const services = t.ui.serviceStage;

  return (
    <div className={`${SCREEN} flex h-full flex-col`} aria-hidden>
      <MockNav compact={compact} />

      <div className="flex flex-1 items-stretch gap-4 px-4 py-4">
        {/* ELEVATE's services landing, not its homepage. The homepage cut
            put `t.hero.title1/2` ("Digitální produkty, které posouvají
            byznys") beside the page's own H1 ("Digitální řešení, která
            posouvají…") — two near-identical headlines on one screen, and in
            RU almost word-for-word ("Цифровые продукты" / "Цифровые
            решения"), stacked 60px apart on mobile. The services landing is
            real, says something different, and is the page the five-service
            strip below actually belongs to. Its buttons are the site's real
            Pricing / Work labels, not the hero's CTA a third time. */}
        <div className="flex min-w-0 flex-[1.15] flex-col justify-center">
          <span className="text-[0.45rem] tracking-[0.2em] text-primary uppercase">
            {t.ui.homeServicesEyebrow}
          </span>
          <h3 className="font-display mt-2 text-[0.95rem] leading-[1.12] font-extrabold tracking-tight text-white">
            {t.ui.homeServicesTitle}
          </h3>
          {!compact && (
            <p className="mt-2 text-[0.5rem] leading-[1.6] text-white/55">{t.hero.subtitle}</p>
          )}
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-md bg-primary px-2.5 py-1 text-[0.5rem] font-semibold text-white">
              {t.nav.pricing}
            </span>
            <span className="text-[0.5rem] text-white/45">{t.nav.work}</span>
          </div>
        </div>

        {/* The real approved plate, not a grey box: the image area is where a
            placeholder is most obvious, so it carries real photography. */}
        <div className="relative flex-1 overflow-hidden rounded-lg border border-white/8">
          <SceneImage
            name="hero-macbook"
            alt=""
            sizes="240px"
            className="absolute inset-0 block h-full w-full"
            imgClassName="h-full w-full object-cover object-[62%_40%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1220] via-transparent to-transparent" />
        </div>
      </div>

      {/* The five real services, numbered — the strip a studio site actually
          carries under its hero.

          Dropped in `compact`: at ~300px each of the five columns is 60px
          wide, which truncates every label to "Weby, kter…" and then still
          overflowed the viewport box and clipped mid-row. Five unreadable
          stubs are not density, they are noise — so the phone-width cut of
          this page deliberately ends at the hero, which is what a real
          responsive site does too. */}
      {!compact && (
        <div className="grid grid-cols-5 gap-px border-t border-white/8 bg-white/8">
          {services.map((s, i) => (
            <div key={s.title} className={`${SCREEN} px-2 py-2`}>
              <span className="text-[0.4rem] text-primary">{String(i + 1).padStart(2, "0")}</span>
              <span className="mt-0.5 block truncate text-[0.45rem] text-white/60">{s.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * The Web service page — the real `/services/web` route, composed. Real
 * eyebrow, real h1, real intro, the real three items and the real price.
 */
export function ProtoSiteService() {
  const { t, lang } = useT();
  const pages = usePages(lang);
  const s = pages.servicesWeb;

  return (
    <div className={`${SCREEN} flex h-full flex-col`} aria-hidden>
      <MockNav />

      <div className="flex flex-1 items-stretch gap-4 px-4 py-4">
        <div className="flex min-w-0 flex-[1.2] flex-col justify-center">
          <span className="text-[0.45rem] tracking-[0.2em] text-primary uppercase">
            {s.eyebrow}
          </span>
          <h3 className="font-display mt-2 text-[0.95rem] leading-[1.12] font-extrabold tracking-tight text-white">
            {s.h1}
          </h3>
          {/* Hidden below `md`: at phone width the window is ~340px, and
              nav + headline + intro + wrapped chips + CTA overflowed the
              viewport box and got cut mid-component by the chrome's own
              `overflow-hidden` — a mock-up with its bottom sliced off reads
              as a broken screenshot, not as a designed page. Found by
              screenshot at 390px, not by inspection. */}
          <p className="mt-2 hidden line-clamp-3 text-[0.5rem] leading-[1.6] text-white/55 md:block">
            {s.intro}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {s.items.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/12 px-2 py-[3px] text-[0.45rem] text-white/55"
              >
                {item}
              </span>
            ))}
          </div>

          {/* No price in here on purpose: the section around this window
              carries it, large, as the page's own conversion element, and
              the same number stated twice in one screen is the redundancy
              the first prototype's duplicate headline already showed. */}
          <div className="mt-3 flex items-center gap-2">
            <span className="rounded-md bg-primary px-2.5 py-1 text-[0.5rem] font-semibold text-white">
              {pages.common.getQuote}
            </span>
            <span className="text-[0.5rem] text-white/45">{pages.common.viewPricing}</span>
          </div>
        </div>

        {/* Responsive is the product here, so the plate is the phone: the
            service is "weby" and the evidence a studio shows for it is the
            same site standing up on a second screen size. */}
        <div className="relative w-[34%] shrink-0 overflow-hidden rounded-lg border border-white/8">
          <SceneImage
            name="hero-iphone"
            alt=""
            sizes="180px"
            className="absolute inset-0 block h-full w-full"
            imgClassName="h-full w-full object-cover object-[52%_35%]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1220] via-transparent to-transparent" />
        </div>
      </div>

      {/* Footer strip: desktop only, same overflow reason as the intro. It
          no longer repeats the service tag — the section around this window
          states that tag at full size, so here it was the same words twice
          on one screen. The site's real nav is what a footer carries. */}
      <div className="hidden items-center justify-between border-t border-white/8 px-4 py-2 md:flex">
        <span className="text-[0.45rem] text-white/40">
          {t.nav.about} · {t.nav.contact}
        </span>
        <span className="text-[0.45rem] tracking-wide text-white/30">elevateit.cz</span>
      </div>
    </div>
  );
}

/**
 * The satellite: the same site at phone width, overlapping the desktop
 * window. Two viewports of one site is the most compact way a web studio can
 * say "responsive" without a word of copy about it — and it is the second
 * plane that gives the hero its depth.
 */
export function ProtoPhoneMock() {
  const { t } = useT();

  return (
    <div
      aria-hidden
      className="overflow-hidden rounded-[1.1rem] border border-white/15 bg-[#0d1220] shadow-[0_30px_80px_-30px_oklch(0_0_0/0.9)]"
    >
      {/* status strip + notch, drawn — the phone's own chrome, kept to the
          minimum that reads as a device rather than as a card. */}
      <div className="relative flex h-4 items-center justify-center border-b border-white/8">
        <span className="h-1 w-8 rounded-full bg-white/20" />
      </div>

      <div className="px-2.5 py-2.5">
        <span className="text-[0.4rem] tracking-[0.18em] text-primary uppercase">
          {t.nav.services}
        </span>
        <h4 className="font-display mt-1 text-[0.6rem] leading-[1.15] font-extrabold tracking-tight text-white">
          {t.ui.serviceStage[0].title}
        </h4>

        <div className="relative mt-2 h-14 overflow-hidden rounded-md border border-white/8">
          <SceneImage
            name="hero-iphone"
            alt=""
            sizes="120px"
            className="absolute inset-0 block h-full w-full"
            imgClassName="h-full w-full object-cover object-[52%_30%]"
          />
        </div>

        {/* The service's real tag, not two grey skeleton bars and a third
            copy of the hero's CTA. The bars were the last placeholder left
            anywhere in the composition (independent critique), and a button
            here made four blue buttons on one screen, one of them real. */}
        <p className="mt-2 text-[0.45rem] leading-[1.5] text-white/55">
          {t.ui.serviceStage[0].tag}
        </p>
        <div className="mt-2 h-px w-full bg-white/10" />
        <p className="mt-1.5 text-[0.4rem] tracking-wide text-white/35">elevateit.cz</p>
      </div>
    </div>
  );
}
