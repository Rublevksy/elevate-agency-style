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
 * cut. Colour-block UI (same register as candidate 6 and candidates 1/2 of
 * `WEB_VISUAL_PROOF.md`) keeps the two sections one continuous world.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { EASE, useAct, useMotionCapability, useStageAct } from "@/components/cinematic";
import { useT } from "@/lib/i18n";
import { usePages } from "@/lib/pages-i18n";
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

  const introY = useTransform(enter, [0, 1], [reduced ? 0 : 64, 0]);
  const introScale = useTransform(enter, [0, 1], [reduced ? 1 : 0.96, 1]);
  const introFade = useTransform(enter, [0, 0.7], [reduced ? 1 : 0.2, 1]);

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
      className="relative z-10 overflow-hidden border-t border-white/8 bg-[#0A0D13] pt-24 pb-28 lg:pt-32 lg:pb-36 lg:[margin-top:calc(-1*var(--join))]"
    >
      {/* The ground the window docks onto — ramped in across the same
          length the hero's own tail fades over, so the handover reads as
          one continuous surface rather than two flat colours meeting. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[60vh] bg-gradient-to-b from-transparent via-[#0A0D13]/60 to-[#0A0D13]"
      />

      <div className="container-luxe relative">
        <motion.div
          style={{ y: introY, scale: introScale, opacity: introFade }}
          className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16"
        >
          {/* ---- The docked window: same chrome language as the hero's
              panel, now large and holding real service content. */}
          <div className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl border border-white/12 bg-white/[0.04] shadow-[0_60px_140px_-50px_oklch(0_0_0/0.85)] backdrop-blur-2xl">
              <div className="flex items-center gap-2 border-b border-white/8 bg-white/[0.03] px-4 py-3">
                <span className="size-2 rounded-full bg-white/25" />
                <span className="size-2 rounded-full bg-white/25" />
                <span className="size-2 rounded-full bg-white/25" />
                <div className="ml-3 flex h-6 flex-1 items-center rounded-full bg-black/30 px-3">
                  {/* Same contrast fix as the hero's chrome bar — Assessment A, P2. */}
                  <span className="truncate font-mono text-[11px] tracking-wide text-white/70">
                    elevateit.cz/services/web
                  </span>
                </div>
              </div>
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#0f1420] to-[#05070B] p-5">
                {/* The window's own content: soft colour blocks, the same
                    register as the hero's backdrop and as WEB_VISUAL_PROOF's
                    candidates 1/2 — never a screenshot, never real copy set
                    in miniature (T6/proof-A's own lesson: a model or a crop
                    both risk carrying something this page didn't choose). */}
                <div className="grid h-full grid-cols-3 grid-rows-3 gap-3">
                  <div className="col-span-2 row-span-2 rounded-xl bg-[#141b2c]" />
                  <div className="rounded-xl bg-primary" />
                  <div className="rounded-xl bg-white/10" />
                  <div className="col-span-2 rounded-xl bg-white/[0.07]" />
                </div>
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/80 to-transparent p-6 pt-16">
                  <span className="label-micro text-primary">01</span>
                  <h3 className="heading-display-sm mt-1.5 text-white">{stage.title}</h3>
                  <p className="mt-1 text-sm text-white/60">{stage.tag}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ---- Real copy, real price, real CTA — page content, not
              window content: the browser panel is the artefact, this is
              the studio's own page around it. */}
          <div className="order-1 lg:order-2">
            <span className="label-micro text-primary">{s.eyebrow}</span>
            <h2 className="heading-display-sm mt-3 text-foreground">{s.h1}</h2>
            <p className="mt-4 max-w-lg text-base leading-relaxed text-muted-foreground">
              {s.intro}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              {s.items.map((item) => (
                <span
                  key={item}
                  className="label-micro rounded-full border border-border px-3.5 py-1.5 text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-6">
              <div>
                <span className="label-micro block text-muted-foreground">{s.eyebrow}</span>
                <span className="heading-display-sm mt-1 block text-foreground">{price}</span>
              </div>
              <Link to="/services/web" className="btn-primary">
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
