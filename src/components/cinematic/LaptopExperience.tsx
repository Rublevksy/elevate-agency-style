import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { CINEMATIC } from "@/lib/cinematic-copy";
import { useT } from "@/lib/i18n";
import { ScreenInterface } from "./ScreenInterface";
import mark from "@/assets/elevate-mark-transparent.png.asset.json";

/**
 * Scroll-driven laptop sequence:
 * closed → opening → screen reveal → camera approach → screen becomes the viewport.
 * Reversible: every transform is derived from scroll progress only.
 */
export function LaptopExperience() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { lang } = useT();
  const c = CINEMATIC[lang];

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 110, damping: 26, mass: 0.35 });

  const [active, setActive] = useState(0);
  const [phase, setPhase] = useState(0);
  useMotionValueEvent(p, "change", (v) => setPhase(v));

  // camera
  const tilt = useTransform(p, [0, 0.28, 0.62, 0.8], [22, 10, 3, 0]);
  const yaw = useTransform(p, [0, 0.3, 0.62], [-12, -4, 0]);
  const rise = useTransform(p, [0, 0.3, 0.62, 0.86], ["-1vh", "-7vh", "-9vh", "-13vh"]);
  const zoom = useTransform(p, [0, 0.3, 0.62, 0.86], [0.62, 0.72, 0.84, 2.2]);
  const deviceOpacity = useTransform(p, [0.74, 0.87], [1, 0]);

  // lid — closed (lying on the deck) → upright
  const lid = useTransform(p, [0.1, 0.52], [reduced ? -6 : 78, -6]);
  const screenFade = useTransform(p, [0.3, 0.48], [0, 1]);
  const glow = useTransform(p, [0.3, 0.55, 0.9], [0, 0.5, 0.16]);

  // typography
  const introOpacity = useTransform(p, [0, 0.12], [1, 0]);
  const introY = useTransform(p, [0, 0.12], [0, -30]);
  const hintOpacity = useTransform(p, [0, 0.08, 0.55, 0.68], [0, 0, 0, 1]);

  // takeover
  const takeoverOpacity = useTransform(p, [0.82, 0.9], [0, 1]);
  const takeoverScale = useTransform(p, [0.82, 0.92], [1.06, 1]);

  // auto-cycle disciplines while inside the product view
  useEffect(() => {
    if (reduced || phase < 0.8) return;
    const id = window.setInterval(() => setActive((i) => (i + 1) % c.disciplines.length), 3600);
    return () => window.clearInterval(id);
  }, [reduced, phase, c.disciplines.length]);

  return (
    <div ref={wrap} className="relative h-[380vh] md:h-[460vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-background">
        {/* environment: soft floor light, no particles */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_18%,oklch(0.26_0.06_250/0.55),transparent_62%)]" />
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[45vh]"
          style={{
            opacity: glow,
            background: "radial-gradient(ellipse at 50% 100%, oklch(0.55 0.16 250 / 0.5), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-[0.07] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_72%)]" />

        {/* device */}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          style={{ opacity: deviceOpacity, perspective: 1600 }}
        >
          <motion.div
            className="relative w-[min(90vw,980px)]"
            style={{ rotateX: tilt, rotateY: yaw, y: rise, scale: zoom, transformStyle: "preserve-3d" }}
          >
            {/* lid */}
            <motion.div
              className="relative aspect-[16/10] w-full rounded-[14px] md:rounded-[18px]"
              style={{ rotateX: lid, transformOrigin: "bottom center", transformStyle: "preserve-3d" }}
            >
              {/* outer shell (visible while closed) */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[14px] border border-white/[0.08] bg-[linear-gradient(150deg,oklch(0.22_0.01_250),oklch(0.13_0.01_250)_55%,oklch(0.18_0.02_250))] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] md:rounded-[18px]"
                style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(115deg,transparent_38%,rgba(255,255,255,0.07)_50%,transparent_62%)]" />
                <div className="grid h-full place-items-center">
                  <img src={mark.url} alt="ELEVATE" className="h-8 w-auto opacity-70 md:h-12" />
                </div>
              </div>

              {/* screen side */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[14px] border border-white/[0.09] bg-[oklch(0.11_0.01_250)] p-[6px] shadow-[0_50px_120px_-50px_rgba(0,0,0,0.95)] md:rounded-[18px] md:p-[9px]"
                style={{ backfaceVisibility: "hidden" }}
              >
                <motion.div
                  className="h-full w-full overflow-hidden rounded-[9px] md:rounded-[12px]"
                  style={{ opacity: screenFade }}
                >
                  <ScreenInterface
                    disciplines={c.disciplines}
                    active={active}
                    onSelect={setActive}
                    label={c.insideLabel}
                    compact
                  />
                </motion.div>
                <div className="pointer-events-none absolute inset-0 rounded-[14px] bg-[linear-gradient(125deg,rgba(255,255,255,0.09),transparent_42%)] md:rounded-[18px]" />
              </div>
            </motion.div>

            {/* deck */}
            <div
              className="absolute inset-x-0 top-full aspect-[16/10] rounded-b-[14px] border border-white/[0.06] bg-[linear-gradient(180deg,oklch(0.2_0.01_250),oklch(0.12_0.01_250))] md:rounded-b-[18px]"
              style={{ transform: "rotateX(78deg)", transformOrigin: "top center" }}
            >
              <div className="mx-auto mt-[6%] h-[46%] w-[86%] rounded-md bg-[oklch(0.1_0.005_250)]/70" />
              <div className="mx-auto mt-[4%] h-[26%] w-[34%] rounded-md bg-[oklch(0.16_0.005_250)]/70" />
            </div>
          </motion.div>
        </motion.div>

        {/* STATE 01 — minimal statement */}
        <motion.div
          className="absolute inset-x-0 bottom-[7vh] px-6 md:bottom-[9vh]"
          style={{ opacity: introOpacity, y: introY }}
        >
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 text-[9px] uppercase tracking-[0.42em] text-muted-foreground md:text-[10px]">
              {c.kicker}
            </p>
            <h1 className="text-[clamp(1.5rem,3.6vw,2.6rem)] font-medium leading-[1.12] tracking-[-0.03em] text-foreground">
              {c.headline1}
              <span className="block text-muted-foreground">{c.headline2}</span>
            </h1>
            <p className="mt-8 font-mono text-[9px] uppercase tracking-[0.42em] text-muted-foreground/70">
              {c.scroll} ↓
            </p>
          </div>
        </motion.div>

        {/* open hint during reveal */}
        <motion.p
          aria-hidden
          className="absolute inset-x-0 bottom-6 text-center font-mono text-[9px] uppercase tracking-[0.42em] text-muted-foreground/70"
          style={{ opacity: hintOpacity }}
        >
          {c.openHint}
        </motion.p>

        {/* STATE 05 — the screen becomes the viewport */}
        <motion.div
          className="absolute inset-0 overflow-hidden pt-[64px]"
          style={{ opacity: takeoverOpacity, scale: takeoverScale, pointerEvents: phase > 0.85 ? "auto" : "none" }}
        >

          <ScreenInterface
            disciplines={c.disciplines}
            active={active}
            onSelect={setActive}
            label={c.insideLabel}
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-4">
            <Link
              to="/contact"
              className="magnetic pointer-events-auto inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-5 py-2.5 text-[10px] font-semibold uppercase tracking-[0.24em] text-foreground backdrop-blur transition-colors hover:border-primary hover:bg-primary/20"
            >
              {c.ctaAction}
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
