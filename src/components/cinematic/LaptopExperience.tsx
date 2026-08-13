import { useEffect, useState } from "react";
import { useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { CINEMATIC } from "@/lib/cinematic-copy";
import { useT } from "@/lib/i18n";
import { setCinematicActive } from "@/lib/cinematic-state";
import { ScreenShowcase } from "./ScreenShowcase";
import mark from "@/assets/elevate-mark-transparent.png.asset.json";

/**
 * Scroll-driven opening narrative:
 * closed laptop → lid opens → screen reveal → screen takes over the viewport →
 * camera pulls back → lid closes → device leaves → the real website begins.
 * Every transform is derived from scroll progress only, so it is fully reversible.
 */
export function LaptopExperience() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { lang } = useT();
  const c = CINEMATIC[lang];
  const disciplines = c.disciplines.slice(0, 4);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  const [phase, setPhase] = useState(0);
  useMotionValueEvent(p, "change", (v) => setPhase(Math.round(v * 200) / 200));

  // hide site chrome while the cinematic owns the viewport
  useEffect(() => {
    setCinematicActive(phase < 0.93);
  }, [phase]);
  useEffect(() => () => setCinematicActive(false), []);

  // ── camera ────────────────────────────────────────────────────────────────
  const tilt = useTransform(p, [0, 0.2, 0.4, 0.5, 0.78, 0.9, 1], [-15, -10, -4, 0, 0, -8, -17]);
  const yaw = useTransform(p, [0, 0.18, 0.4, 0.5, 0.78, 0.92, 1], [-10, -6, -1, 0, 0, 6, 13]);
  const rise = useTransform(
    p,
    [0, 0.2, 0.4, 0.5, 0.78, 0.92, 1],
    ["-13vh", "-8vh", "-6vh", "-8vh", "-8vh", "-6vh", "-10vh"],
  );
  const zoom = useTransform(
    p,
    [0, 0.2, 0.4, 0.5, 0.78, 0.9, 1],
    reduced ? [0.72, 0.72, 0.78, 0.82, 0.82, 0.78, 0.72] : [1.0, 1.02, 1.0, 2.7, 2.7, 0.98, 0.6],
  );
  const deviceOpacity = useTransform(p, [0.44, 0.52, 0.8, 0.87, 0.98, 1], [1, 0, 0, 1, 1, 0.2]);

  // ── lid: closed lying on the deck → upright → closed again ────────────────
  const lid = useTransform(p, [0.07, 0.34, 0.8, 0.94], reduced ? [-10, -10, -10, -10] : [-100, -10, -10, -100]);
  // lift the lid a few px off the deck plane while closed so it paints above the keyboard
  const lidLift = useTransform(p, [0.07, 0.2, 0.86, 0.94], [16, 0, 0, 16]);
  // the deck is hidden under the lid while the device is closed
  const deckOpacity = useTransform(p, [0.08, 0.18, 0.84, 0.93], [0, 1, 1, 0]);
  const screenOn = useTransform(p, [0.22, 0.4, 0.86, 0.93], [0, 1, 1, 0]);
  const floorGlow = useTransform(p, [0.1, 0.4, 0.9, 1], [0.1, 0.42, 0.3, 0.05]);

  // ── typography ────────────────────────────────────────────────────────────
  const introOpacity = useTransform(p, [0, 0.07], [1, 0]);
  const introY = useTransform(p, [0, 0.07], [0, -24]);
  const outroOpacity = useTransform(p, [0.93, 0.97, 1], [0, 1, 1]);

  // ── takeover ──────────────────────────────────────────────────────────────
  const takeoverOpacity = useTransform(p, [0.46, 0.55, 0.79, 0.86], [0, 1, 1, 0]);
  const takeoverScale = useTransform(p, [0.46, 0.56, 0.79, 0.86], [1.08, 1, 1, 1.06]);

  // continuous showcase index (0..3) — content morphs while inside the screen
  const idx = Math.max(0, Math.min(3, ((phase - 0.5) / (0.78 - 0.5)) * 3));

  return (
    <div ref={wrap} className="relative h-[560vh] md:h-[700vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[oklch(0.09_0.008_255)]">
        {/* environment */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,oklch(0.2_0.04_255/0.6),transparent_65%)]" />
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[42vh]"
          style={{
            opacity: floorGlow,
            background: "radial-gradient(ellipse at 50% 100%, oklch(0.55 0.17 255 / 0.4), transparent 72%)",
          }}
        />

        {/* device */}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          style={{ opacity: deviceOpacity, perspective: 1800 }}
        >
          <motion.div
            className="relative w-[min(92vw,1040px)]"
            style={{ rotateX: tilt, rotateY: yaw, y: rise, scale: zoom, transformStyle: "preserve-3d" }}
          >
            <div className="relative -translate-y-[20%]">
            {/* contact shadow */}
            <div className="pointer-events-none absolute left-1/2 top-[104%] h-[16%] w-[86%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-2xl" />

            {/* lid */}
            <motion.div
              className="relative aspect-[16/10.4] w-full rounded-[12px] md:rounded-[16px]"
              style={{ rotateX: lid, z: lidLift, transformOrigin: "bottom center", transformStyle: "preserve-3d" }}
            >
              {/* aluminium back of the lid (seen while closed) */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[12px] bg-[linear-gradient(155deg,oklch(0.36_0.006_255),oklch(0.22_0.004_255)_38%,oklch(0.16_0.004_255)_62%,oklch(0.3_0.006_255))] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.95),inset_0_0_0_1px_rgba(255,255,255,0.09)] md:rounded-[16px]"
                style={{ transform: "rotateX(180deg)", backfaceVisibility: "hidden" }}
              >
                <div className="absolute inset-0 bg-[linear-gradient(112deg,transparent_36%,rgba(255,255,255,0.10)_49%,transparent_60%)]" />
                <div className="grid h-full place-items-center">
                  <img src={mark.url} alt="ELEVATE" className="h-7 w-auto opacity-40 md:h-11" />
                </div>
              </div>

              {/* screen side */}
              <div
                className="absolute inset-0 overflow-hidden rounded-[12px] bg-[oklch(0.08_0.004_255)] p-[5px] shadow-[0_50px_130px_-50px_rgba(0,0,0,0.95),inset_0_0_0_1px_rgba(255,255,255,0.10)] md:rounded-[16px] md:p-[8px]"
                style={{ backfaceVisibility: "hidden" }}
              >
                {/* camera dot */}
                <div className="absolute left-1/2 top-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/20 md:top-[4px]" />
                <motion.div
                  className="h-full w-full overflow-hidden rounded-[8px] bg-[oklch(0.12_0.01_255)] md:rounded-[11px]"
                  style={{ opacity: screenOn }}
                >
                  <ScreenShowcase disciplines={disciplines} index={idx} compact />
                </motion.div>
                {/* glass reflection */}
                <div className="pointer-events-none absolute inset-0 rounded-[12px] bg-[linear-gradient(122deg,rgba(255,255,255,0.10),transparent_38%)] md:rounded-[16px]" />
              </div>
            </motion.div>

            {/* hinge */}
            <div className="absolute inset-x-[16%] top-full h-[6px] -translate-y-[3px] rounded-full bg-[linear-gradient(180deg,oklch(0.3_0.005_255),oklch(0.14_0.004_255))]" />

            {/* deck */}
            <motion.div
              className="absolute inset-x-0 top-full aspect-[16/10.6] overflow-hidden rounded-b-[12px] bg-[linear-gradient(180deg,oklch(0.33_0.006_255),oklch(0.2_0.004_255)_45%,oklch(0.27_0.005_255))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07)] md:rounded-b-[16px]"
              style={{ transform: "rotateX(74deg)", transformOrigin: "top center", opacity: deckOpacity }}
            >
              {/* keyboard well */}
              <div className="mx-auto mt-[5%] h-[44%] w-[88%] rounded-[6px] bg-[oklch(0.11_0.004_255)] p-[1.2%] shadow-[inset_0_2px_10px_rgba(0,0,0,0.7)]">
                <div className="grid h-full grid-rows-5 gap-[3%]">
                  {[14, 14, 13, 12, 8].map((n, r) => (
                    <div key={r} className="flex gap-[1.2%]">
                      {Array.from({ length: n }).map((_, i) => (
                        <span
                          key={i}
                          className="flex-1 rounded-[2px] bg-[linear-gradient(180deg,oklch(0.24_0.004_255),oklch(0.16_0.004_255))]"
                          style={r === 4 && i === 3 ? { flex: 5 } : undefined}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>
              {/* trackpad */}
              <div className="mx-auto mt-[4%] h-[30%] w-[34%] rounded-[6px] bg-[linear-gradient(180deg,oklch(0.26_0.004_255),oklch(0.21_0.004_255))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
              {/* front lip */}
              <div className="absolute inset-x-[42%] bottom-0 h-[3%] rounded-t-[4px] bg-black/40" />
            </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* STAGE 1 — almost empty */}
        <motion.div
          className="absolute inset-x-0 bottom-[6vh] px-6"
          style={{ opacity: introOpacity, y: introY }}
        >
          <p className="text-center font-mono text-[9px] uppercase tracking-[0.5em] text-muted-foreground/70">
            {c.scroll} ↓
          </p>
        </motion.div>

        {/* STAGE 4 — the screen becomes the viewport */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: takeoverOpacity, scale: takeoverScale, pointerEvents: "none" }}
        >
          <ScreenShowcase disciplines={disciplines} index={idx} />
        </motion.div>

        {/* STAGE 5 — hand-off to the real website */}
        <motion.p
          aria-hidden
          className="absolute inset-x-0 bottom-[6vh] text-center font-mono text-[9px] uppercase tracking-[0.5em] text-muted-foreground/70"
          style={{ opacity: outroOpacity }}
        >
          {c.openHint} ↓
        </motion.p>
      </div>
    </div>
  );
}
