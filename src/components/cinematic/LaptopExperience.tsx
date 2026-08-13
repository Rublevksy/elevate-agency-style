import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { CINEMATIC } from "@/lib/cinematic-copy";
import { useT } from "@/lib/i18n";
import { setCinematicActive } from "@/lib/cinematic-state";
import { ScreenShowcase } from "./ScreenShowcase";
import mark from "@/assets/elevate-mark-transparent.png.asset.json";

/**
 * Scroll = animation. One continuous camera shot:
 * closed laptop → orbit → lid opens → camera enters the screen →
 * fullscreen experience → camera pulls back → lid closes → device leaves.
 *
 * Hinge rig (physically correct):
 * both the base and the lid are anchored to the same hinge line (top edge) and
 * live in the same 3D space. The base rests on the table at DECK°, the lid
 * starts coplanar with it (closed) and rotates OPEN° further to stand up.
 */
const DECK = 74; // base plane on the table
const OPEN = 121; // lid rotation from closed to fully open

export function LaptopExperience() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();
  const { lang } = useT();
  const c = CINEMATIC[lang];
  const disciplines = c.disciplines.slice(0, 4);

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.32 });

  const [phase, setPhase] = useState(0);
  useMotionValueEvent(p, "change", (v) => setPhase(Math.round(v * 200) / 200));

  useEffect(() => {
    setCinematicActive(phase < 0.94);
  }, [phase]);
  useEffect(() => () => setCinematicActive(false), []);

  // ── camera ────────────────────────────────────────────────────────────────
  const tilt = useTransform(p, [0, 0.12, 0.3, 0.5, 0.76, 0.9, 1], [-17, -14, -8, 0, 0, -11, -19]);
  const yaw = useTransform(p, [0, 0.12, 0.3, 0.5, 0.76, 0.9, 1], [-15, -10, -3, 0, 0, 9, 17]);
  const rise = useTransform(
    p,
    [0, 0.3, 0.5, 0.76, 1],
    ["3vh", "0vh", "-2vh", "-2vh", "4vh"],
  );
  const zoom = useTransform(
    p,
    [0, 0.16, 0.36, 0.55, 0.76, 0.9, 1],
    reduced ? [0.8, 0.8, 0.82, 0.86, 0.86, 0.82, 0.78] : [0.88, 0.92, 1.02, 3.6, 3.6, 1.0, 0.64],
  );
  const deviceOpacity = useTransform(p, [0.5, 0.57, 0.76, 0.83, 0.97, 1], [1, 0, 0, 1, 1, 0]);

  // ── lid: 0° = closed on the deck, OPEN° = upright ──────────────────────────
  const lidA = useTransform(p, [0.08, 0.4, 0.82, 0.94], reduced ? [OPEN, OPEN, OPEN, OPEN] : [0, OPEN, OPEN, 0]);
  const lidRotate = useTransform(lidA, (a) => DECK + a);
  // face crossfade — the aluminium back is what you see while it is closed
  const shellOpacity = useTransform(lidA, [12, 46], [1, 0]);
  const faceOpacity = useTransform(lidA, [24, 62], [0, 1]);
  const screenOn = useTransform(lidA, [55, 100], [0, 1]);
  const floorGlow = useTransform(p, [0.1, 0.4, 0.9, 1], [0.14, 0.4, 0.3, 0.06]);

  // ── typography ────────────────────────────────────────────────────────────
  const introOpacity = useTransform(p, [0, 0.06], [1, 0]);
  const introY = useTransform(p, [0, 0.06], [0, -18]);
  const outroOpacity = useTransform(p, [0.94, 0.98, 1], [0, 1, 1]);

  // ── takeover ──────────────────────────────────────────────────────────────
  const takeoverOpacity = useTransform(p, [0.52, 0.58, 0.77, 0.83], [0, 1, 1, 0]);
  const takeoverScale = useTransform(p, [0.52, 0.59, 0.77, 0.83], [1.1, 1, 1, 1.08]);

  // continuous morph index (0..3) inside the fullscreen experience
  const idx = Math.max(0, Math.min(3, ((phase - 0.57) / (0.77 - 0.57)) * 3));

  return (
    <div ref={wrap} className="relative h-[560vh] md:h-[700vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[oklch(0.08_0.006_255)]">
        {/* environment — one soft key light, nothing else */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_26%,oklch(0.19_0.035_255/0.55),transparent_68%)]" />
        <motion.div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[40vh]"
          style={{
            opacity: floorGlow,
            background: "radial-gradient(ellipse at 50% 100%, oklch(0.5 0.14 255 / 0.28), transparent 74%)",
          }}
        />

        {/* ── device ───────────────────────────────────────────────────────── */}
        <motion.div
          className="absolute inset-0 grid place-items-center"
          style={{ opacity: deviceOpacity, perspective: 2200 }}
        >
          <motion.div
            className="relative"
            style={{
              rotateX: tilt,
              rotateY: yaw,
              y: rise,
              scale: zoom,
              transformStyle: "preserve-3d",
              transformOrigin: "50% 30%",
            }}
          >
            {/* idle breathing so the closed state is not dead */}
            <motion.div
              className="relative w-[min(86vw,860px)]"
              style={{ transformStyle: "preserve-3d" }}
              animate={reduced ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* hinge line is the top edge of this box; both halves hang from it */}
              <div className="relative h-0 w-full" style={{ transformStyle: "preserve-3d" }}>
                {/* contact shadow on the table */}
                <div
                  className="pointer-events-none absolute left-1/2 top-0 h-[54%] w-[92%] -translate-x-1/2 rounded-[50%] bg-black/80 blur-[42px]"
                  style={{ transform: "rotateX(74deg) translateZ(-6px)", transformOrigin: "top center" }}
                />

                {/* ── base (aluminium unibody on the table) ───────────────── */}
                <div
                  className="absolute left-0 top-0 aspect-[16/10.9] w-full overflow-hidden rounded-[10px] md:rounded-[14px]"
                  style={{
                    transform: `rotateX(${DECK}deg)`,
                    transformOrigin: "top center",
                    background:
                      "linear-gradient(178deg,oklch(0.42 0.005 255) 0%,oklch(0.3 0.004 255) 12%,oklch(0.24 0.004 255) 55%,oklch(0.33 0.005 255) 100%)",
                    boxShadow:
                      "inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.5), 0 30px 60px -30px rgba(0,0,0,0.9)",
                  }}
                >
                  {/* brushed sheen */}
                  <div className="absolute inset-0 bg-[linear-gradient(100deg,transparent_20%,rgba(255,255,255,0.05)_46%,transparent_66%)]" />

                  {/* keyboard well */}
                  <div className="mx-auto mt-[4.5%] h-[42%] w-[86%] rounded-[5px] bg-[oklch(0.1_0.003_255)] p-[0.9%] shadow-[inset_0_2px_9px_rgba(0,0,0,0.8)]">
                    <div className="grid h-full grid-rows-6 gap-[2.4%]">
                      {[13, 14, 14, 13, 12, 8].map((n, r) => (
                        <div key={r} className="flex gap-[0.9%]">
                          {Array.from({ length: n }).map((_, i) => (
                            <span
                              key={i}
                              className="flex-1 rounded-[2px] shadow-[inset_0_-1px_0_rgba(0,0,0,0.6)]"
                              style={{
                                flex: r === 5 && i === 3 ? 5.5 : undefined,
                                background:
                                  "linear-gradient(180deg,oklch(0.25 0.004 255),oklch(0.155 0.004 255))",
                              }}
                            />
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* trackpad */}
                  <div className="mx-auto mt-[4%] h-[30%] w-[32%] rounded-[6px] bg-[linear-gradient(180deg,oklch(0.28_0.004_255),oklch(0.235_0.004_255))] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.07),inset_0_2px_6px_rgba(0,0,0,0.35)]" />

                  {/* front lip notch */}
                  <div className="absolute inset-x-[43%] bottom-0 h-[2.5%] rounded-t-[4px] bg-black/45" />
                </div>

                {/* ── hinge ────────────────────────────────────────────────── */}
                <div
                  className="absolute inset-x-[14%] top-0 h-[7px]"
                  style={{
                    transform: "rotateX(30deg) translateZ(2px)",
                    transformOrigin: "top center",
                    background: "linear-gradient(180deg,oklch(0.34 0.004 255),oklch(0.12 0.003 255))",
                    borderRadius: "3px",
                  }}
                />

                {/* ── lid ──────────────────────────────────────────────────── */}
                <motion.div
                  className="absolute left-0 top-0 aspect-[16/10.3] w-full"
                  style={{
                    rotateX: lidRotate,
                    z: 7,
                    transformOrigin: "top center",
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* aluminium back (visible while closed) */}
                  <motion.div
                    className="absolute inset-0 overflow-hidden rounded-[10px] md:rounded-[14px]"
                    style={{
                      opacity: shellOpacity,
                      background:
                        "linear-gradient(163deg,oklch(0.44 0.005 255) 0%,oklch(0.3 0.004 255) 34%,oklch(0.21 0.004 255) 62%,oklch(0.36 0.005 255) 100%)",
                      boxShadow:
                        "inset 0 0 0 1px rgba(255,255,255,0.12), 0 40px 80px -40px rgba(0,0,0,0.9)",
                    }}
                  >
                    <div className="absolute inset-0 bg-[linear-gradient(108deg,transparent_30%,rgba(255,255,255,0.07)_48%,transparent_64%)]" />
                    <div className="grid h-full place-items-center">
                      <img src={mark.url} alt="ELEVATE" className="h-6 w-auto opacity-[0.22] md:h-9" />
                    </div>
                  </motion.div>

                  {/* display side (mirrored back so it reads upright when open) */}
                  <motion.div
                    className="absolute inset-0 overflow-hidden rounded-[10px] p-[5px] md:rounded-[14px] md:p-[7px]"
                    style={{
                      opacity: faceOpacity,
                      transform: "rotateX(180deg)",
                      background: "oklch(0.07 0.003 255)",
                      boxShadow:
                        "inset 0 0 0 1px rgba(255,255,255,0.13), 0 50px 110px -50px rgba(0,0,0,0.95)",
                    }}
                  >
                    <div className="absolute left-1/2 top-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full bg-white/25" />
                    <motion.div
                      className="h-full w-full overflow-hidden rounded-[7px] bg-[oklch(0.1_0.008_255)] md:rounded-[10px]"
                      style={{ opacity: screenOn }}
                    >
                      <ScreenShowcase disciplines={disciplines} index={idx} compact />
                    </motion.div>
                    {/* glass */}
                    <div className="pointer-events-none absolute inset-0 rounded-[10px] bg-[linear-gradient(118deg,rgba(255,255,255,0.09),transparent_36%)] md:rounded-[14px]" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* one short statement */}
        <motion.p
          className="absolute inset-x-0 bottom-[7vh] text-center font-mono text-[9px] uppercase tracking-[0.52em] text-muted-foreground/60"
          style={{ opacity: introOpacity, y: introY }}
        >
          {c.scroll} ↓
        </motion.p>

        {/* the screen becomes the viewport */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          style={{ opacity: takeoverOpacity, scale: takeoverScale, pointerEvents: "none" }}
        >
          <ScreenShowcase disciplines={disciplines} index={idx} />
        </motion.div>

        {/* hand-off to the real website */}
        <motion.p
          aria-hidden
          className="absolute inset-x-0 bottom-[7vh] text-center font-mono text-[9px] uppercase tracking-[0.52em] text-muted-foreground/60"
          style={{ opacity: outroOpacity }}
        >
          {c.openHint} ↓
        </motion.p>
      </div>
    </div>
  );
}
