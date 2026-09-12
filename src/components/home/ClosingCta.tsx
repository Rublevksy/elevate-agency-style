/**
 * Closing — the page resolves where it began.
 *
 * The first screen was a window standing in the portal, showing the sites
 * ELEVATE has built. The last screen is the same portal and the same window,
 * now showing ELEVATE itself at elevateit.cz/contact — the page arrives back at
 * the studio, and the next site in that window is the visitor's. The arcs power
 * up as the section arrives (the one scroll-linked beat here), the window rises
 * into the portal, and then everything holds still: the visitor has the ending.
 *
 * Actions are the real ones: the builder above (the place to describe a
 * project), the /contact route, and the studio's direct channels from
 * `Socials.tsx` and the footer — phone, e-mail, Telegram, Instagram.
 */
import { Link } from "@tanstack/react-router";
import { ArrowRight, ArrowUp } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import { EASE, PERSPECTIVE, useAct, useReducedScene } from "@/components/cinematic";
import { Logo } from "@/components/Logo";
import { SceneImage } from "@/components/media/SceneImage";
import { useT } from "@/lib/i18n";
import { BrowserWindow } from "./BrowserWindow";

/** The portal box, centred this time: the ending is composed on its own axis. */
const BOX_W = "max(125vw, 179.1svh)";

export function ClosingCta() {
  const { t } = useT();
  const f = t.contact.form;
  const reduced = useReducedScene();
  const act = useAct("closing", { viewports: 1, pin: 0 });
  const { enter } = act;

  const plateOn = useTransform(enter, [0.2, 0.95], [reduced ? 1 : 0.15, 1]);
  const plateScale = useTransform(enter, [0, 1], [reduced ? 1 : 1.08, 1]);
  const winY = useTransform(enter, [0.35, 1], [reduced ? 0 : 140, 0]);
  const winRotateX = useTransform(enter, [0.35, 1], [reduced ? 0 : 18, 0]);

  const rise = (i: number) => ({
    initial: reduced ? undefined : { opacity: 0, y: 22 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-12% 0px" },
    transition: { duration: 0.7, delay: 0.1 + i * 0.09, ease: EASE },
  });

  return (
    <section
      ref={act.ref}
      aria-labelledby="closing-title"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#0A0D13]"
    >
      {/* ---- The portal, powering up --------------------------------------- */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <motion.div
          style={{ opacity: plateOn, width: BOX_W, left: `calc(50vw - 0.58 * ${BOX_W})` }}
          className="absolute bottom-0 aspect-[2400/1340] [mask-image:radial-gradient(90%_100%_at_58%_65%,#000_55%,transparent_100%)]"
        >
          <motion.div style={{ scale: plateScale }} className="absolute inset-0 origin-[58%_75%]">
            <SceneImage
              name="portal"
              alt=""
              sizes="100vw"
              className="absolute inset-0 block h-full w-full"
              imgClassName="h-full w-full object-cover"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#0A0D13_0%,#0A0D13_30%,#0A0D1300_62%)]" />
      </div>

      {/* ---- The words and the actions ------------------------------------- */}
      <div className="container-luxe relative pt-32 text-center md:pt-40">
        <motion.p
          {...rise(0)}
          className="label-micro flex items-center justify-center gap-3 text-white/60"
        >
          <span aria-hidden className="size-[5px] rounded-full bg-primary" />
          {t.hero.tag}
        </motion.p>
        {/* NOT `t.hero.title1/2`: that restates the hero's sentence with the
            same verb and the same accent break, so the page ended by repeating
            its opening instead of arriving somewhere. This is the studio's own
            statement about how it works. */}
        <motion.h2
          {...rise(1)}
          id="closing-title"
          className="heading-scene mx-auto mt-6 max-w-[18ch] text-[clamp(2.2rem,1.3rem+3.6vw,4.5rem)] text-white uppercase"
        >
          {t.about.title}
        </motion.h2>
        <motion.p
          {...rise(2)}
          className="mx-auto mt-6 max-w-[52ch] text-base leading-relaxed text-white/70"
        >
          {t.about.body}
        </motion.p>
        <motion.div
          {...rise(3)}
          className="mt-10 flex flex-col items-center justify-center gap-5 sm:flex-row sm:gap-8"
        >
          <a href="#builder" className="btn-primary">
            {t.hero.cta1}
            <ArrowUp className="size-4" aria-hidden />
          </a>
          <Link
            to="/contact"
            className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/75 underline-offset-8 transition-colors hover:text-white hover:underline"
          >
            {t.nav.contact}
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </motion.div>
      </div>

      {/* ---- The window, back in the portal -------------------------------- */}
      <div
        className="relative mt-auto flex justify-center px-6 pt-16 pb-10 md:pb-14"
        style={{ perspective: `${PERSPECTIVE}px` }}
      >
        <motion.div
          style={{ y: winY, rotateX: winRotateX }}
          className="w-full max-w-[34rem] origin-[50%_100%] lg:max-w-[38rem]"
        >
          <BrowserWindow address="elevateit.cz/contact" tab={t.nav.contact}>
            <div
              aria-hidden
              className="relative flex aspect-[16/9] flex-col items-center justify-center gap-5 bg-[#0d1220] px-6 [container-type:inline-size]"
            >
              <motion.span
                aria-hidden
                initial={reduced ? false : { scaleX: 0, opacity: 1 }}
                whileInView={{ scaleX: 1, opacity: 0 }}
                viewport={{ once: true }}
                transition={{
                  scaleX: { duration: 1.1, delay: 0.5, ease: EASE },
                  opacity: { duration: 0.4, delay: 1.6 },
                }}
                className="absolute inset-x-0 top-0 block h-[2px] origin-left bg-primary"
              />
              <div className="absolute inset-0 bg-[radial-gradient(60%_70%_at_50%_45%,oklch(0.65_0.18_255/0.18),transparent_70%)]" />
              {/* ELEVATE's own contact page, depicted — the last page the
                  window loads. The real, clickable channels live in the site
                  footer directly below; repeating them inside here made the
                  final frame a duplicate of the frame under it. */}
              <Logo className="relative h-[7cqw] w-auto" />
              <p className="relative text-[2.6cqw] text-white/70">{t.contact.subtitle}</p>
              <div className="relative flex w-[62%] flex-col gap-[1.6cqw]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block h-[3.2cqw] rounded-full border border-white/12 bg-white/[0.04]"
                  />
                ))}
                <span className="mt-[0.8cqw] block rounded-[1cqw] bg-primary py-[1.5cqw] text-center text-[2.4cqw] font-semibold text-white">
                  {t.contact.form.submit}
                </span>
              </div>
            </div>
          </BrowserWindow>
        </motion.div>
      </div>
    </section>
  );
}

export default ClosingCta;
