/**
 * /proto — first service, docked from the hero's own browser window.
 *
 * The join mechanism is copied from `ServicesShowcase.tsx`'s documented
 * pattern exactly, against this prototype's own hero act: ask the register
 * for how much of the hero's departure is physical travel, rise through a
 * fraction of it via negative margin, and drive the intro transform off
 * `enter` rather than off a literal `vh`. That is what makes two separately
 * pinned sections read as one continuous move instead of two pages meeting
 * at a seam — see `useAct.ts` and `proto-tokens.ts` for why the numbers are
 * a fraction of a declared length, never typed in twice.
 *
 * Every word of content is real: service #1 is "Web" because that is index 0
 * of `t.ui.serviceStage` and the first entry in `ServiceStage.tsx`'s own
 * `SERVICE_ROUTES`, and the description/price come from `usePages(lang)`
 * (`pages.servicesWeb`, `pages.pricingPages.web`).
 *
 * The window's own content is drawn, not photographed: `svc-web` (the
 * approved services-room plate for this exact service) was tried first and
 * pulled straight back out after a real screenshot — it carries the cartoon
 * mascot, and landing on it one scroll after candidate 6's abstract,
 * mascot-free hero is exactly the "incompatible visual registers" defect
 * `DESIGN.md` names as the incumbent's central flaw, reintroduced in one
 * cut. The window now carries the composed `/services/web` page from
 * `ProtoSiteMock.tsx` — the same page the hero's window navigates to just
 * before this section rises, so the two are one window, docked.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { EASE, useAct, useMotionCapability, useStageAct } from "@/components/cinematic";
import { useT } from "@/lib/i18n";
import { usePages } from "@/lib/pages-i18n";
import { ProtoSiteService } from "./ProtoSiteMock";
import { BrowserChrome } from "./ProtoHero";
import {
  PROTO_JOIN_OF_DEPARTURE,
  PROTO_SERVICE_PIN,
  PROTO_SERVICE_VIEWPORTS,
} from "./proto-tokens";

export function ProtoFirstService() {
  const { t, lang } = useT();
  const pages = usePages(lang);
  const s = pages.servicesWeb;
  const price = pages.pricingPages.web.price;
  const stage = t.ui.serviceStage[0];

  const capability = useMotionCapability();
  const reduced = capability === "still";

  const act = useAct("proto-first-service", {
    viewports: PROTO_SERVICE_VIEWPORTS,
    pin: PROTO_SERVICE_PIN,
  });
  const { enter } = act;

  const hero = useStageAct("proto-hero");
  const heroDeparture = hero ? hero.viewports * (1 - hero.pin) : 0;
  const join = `${(PROTO_JOIN_OF_DEPARTURE * heroDeparture * 100).toFixed(2)}vh`;

  // The arrival completes by half-way through `enter`, not at its end.
  // `enter` reaches 1 only when this section's top meets the viewport's top,
  // and as the last, short (~684px) section on the page it never gets there:
  // measured, it topped out at 0.76 at 900 and 0.634 at 1080, so the service
  // content was still 15-24px low, at 0.99 scale and 92% opacity when the
  // page ended — an arrival that never lands. Finishing at 0.5 lands it while
  // the section is still rising, on every viewport height.
  const introY = useTransform(enter, [0, 0.5], [reduced ? 0 : 64, 0]);
  const introScale = useTransform(enter, [0, 0.5], [reduced ? 1 : 0.96, 1]);
  const introFade = useTransform(enter, [0, 0.4], [reduced ? 1 : 0.2, 1]);

  return (
    <section
      ref={act.ref}
      // `--join` only pulls the section up on `lg:` — mirrors
      // ServicesShowcase.tsx's own gating exactly. The hero's sticky/pinned
      // rig (and the departure this length is a fraction of) is itself
      // `lg:`-only (see ProtoHero.tsx: `lg:sticky lg:h-[100svh]`); below
      // `lg` the hero is a plain stacked block with nothing "departing" to
      // dock into. Applying the pull unconditionally — confirmed by
      // Assessment B's rendered-DOM measurement, not by inspection alone —
      // put this section's opaque background over the still-visible mobile
      // hero's own CTA, on first paint, no scroll required: an interactive
      // element hidden behind another section is a P0, not a style nit.
      style={{ "--join": join } as React.CSSProperties}
      // `motion-reduce:` removes the join along with the hero's track: with no
      // pinned stage there is no departure to rise through.
      className="relative z-10 overflow-hidden pt-24 pb-28 lg:pt-32 lg:pb-36 lg:[margin-top:calc(-1*var(--join))] motion-reduce:lg:mt-0"
    >
      {/* THE GROUND, and why it is a separate masked layer rather than a
          background colour on the section.

          It was `bg-[#0A0D13]` on the section itself with a gradient drawn
          on top — which ramps nothing: the section's own fill is already
          opaque from its first pixel, so the hero's still-lit set was cut
          by a hard horizontal line exactly at the section's top edge, and
          the "gradient" was painting over ground that had already arrived.
          Seen immediately in a screenshot of the seam; invisible in code.
          Masked across the join instead, the ground fades in at the same
          rate the hero's own tail fades out — the same construction
          ServicesShowcase.tsx uses for the real hero, and the reason the
          two sections read as one surface. */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-[#0A0D13] lg:[mask-image:linear-gradient(to_bottom,transparent_0,#000_var(--join))] motion-reduce:lg:[mask-image:none]"
      />

      <div className="container-luxe relative">
        <motion.div
          style={{ y: introY, scale: introScale, opacity: introFade }}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16"
        >
          {/* ---- The docked window: same chrome language as the hero's
              panel, now large and holding real service content. */}
          <div className="order-2 lg:order-1">
            {/* The hero's own `BrowserChrome`, not a hand-copied twin: the
                copy had drifted (size-2 white/25 dots here against size-1.5
                white/18 in the hero) — two windows meant to be the same one
                were visibly two different components. */}
            <BrowserChrome path="elevateit.cz/services/web">
              {/* The real `/services/web` page, composed — the same page the
                  hero's window has just navigated to. 16:10 on desktop (a
                  real viewport proportion); taller on phones, where 16:10 at
                  ~340px is 212px, less than this page needs even with its
                  intro and footer dropped. */}
              <div className="aspect-[4/3] md:aspect-[16/10]">
                <ProtoSiteService />
              </div>
            </BrowserChrome>
          </div>

          {/* The page around the artefact. Every string here is a DIFFERENT
              real string from the ones inside the window — the window shows
              the real `/services/web` page (eyebrow, h1, intro, items), this
              column is the section's own framing (number, service name, tag,
              price). Nothing is stated twice on one screen; the only repeat
              is the CTA label, which is what a button is for. */}
          <div className="order-1 lg:order-2">
            <div className="flex items-baseline gap-3">
              <span className="label-micro text-primary">01</span>
              <span className="label-micro text-muted-foreground">{t.nav.services}</span>
            </div>
            <h2 className="heading-display-sm mt-3 text-foreground">{stage.title}</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
              {stage.tag}
            </p>

            <div className="mt-8 border-t border-border pt-6">
              {/* "Ceník", not `s.eyebrow` again: the eyebrow is already inside
                  the window above, so this label was "WEB DESIGN & SEO" twice
                  on one screen. */}
              <span className="label-micro block text-muted-foreground">{t.nav.pricing}</span>
              <span className="heading-display-sm mt-2 block text-foreground">{price}</span>
              <Link to="/services/web" className="btn-primary mt-6">
                {pages.common.getQuote}
                <ArrowRight className="size-4" aria-hidden />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default ProtoFirstService;
