import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import arrowAsset from "@/assets/elevate-arrow.png.asset.json";

const SESSION_KEY = "elevate_loader_shown";
const TOTAL_MS = 2900;

const WORDMARK = ["E", "L", "E", "V", "ARROW", "T", "E"] as const;

export function PageLoader() {
  const [show, setShow] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      /* ignore */
    }
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    setShow(true);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => setShow(false), TOTAL_MS);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prev;
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => {
            document.body.style.overflow = "";
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-background"
          aria-hidden="true"
          style={{
            background:
              "radial-gradient(ellipse at center, oklch(0.18 0.04 255) 0%, oklch(0.12 0.03 255) 45%, oklch(0.08 0.02 255) 100%)",
          }}
        >
          {/* Animated grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.18 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(oklch(0.65 0.18 255 / 0.18) 1px, transparent 1px), linear-gradient(90deg, oklch(0.65 0.18 255 / 0.18) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
              maskImage:
                "radial-gradient(ellipse at center, black 0%, transparent 70%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 0%, transparent 70%)",
            }}
          />

          {/* Slow moving light beams */}
          <motion.div
            initial={{ opacity: 0, x: "-30%", rotate: 12 }}
            animate={{ opacity: [0, 0.5, 0.2], x: "30%" }}
            transition={{ duration: 2.8, ease: "easeInOut" }}
            className="pointer-events-none absolute top-0 left-0 h-[160%] w-[40%] blur-3xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.7 0.18 255 / 0.25), transparent)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, x: "30%", rotate: -8 }}
            animate={{ opacity: [0, 0.35, 0.15], x: "-20%" }}
            transition={{ duration: 2.8, ease: "easeInOut", delay: 0.3 }}
            className="pointer-events-none absolute bottom-0 right-0 h-[160%] w-[40%] blur-3xl"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.6 0.2 255 / 0.22), transparent)",
            }}
          />

          {/* Ambient glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.65, 0.45], scale: [0.6, 1.15, 1] }}
            transition={{ duration: 2.2, ease: "easeOut", times: [0, 0.55, 1] }}
            className="pointer-events-none absolute h-[48rem] w-[48rem] rounded-full blur-[160px]"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.65 0.2 255 / 0.55), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* Stage 1 — arrow draws, accelerates up, leaves trail */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.85 }}
              animate={{
                opacity: [0, 1, 1, 1, 0],
                y: [30, 0, -8, -60, -120],
                scale: [0.85, 1, 1.05, 0.9, 0.7],
              }}
              transition={{
                duration: 1.7,
                ease: [0.65, 0, 0.35, 1],
                times: [0, 0.25, 0.55, 0.85, 1],
              }}
              className="absolute"
              style={{ filter: "drop-shadow(0 0 28px oklch(0.65 0.2 255 / 0.85))" }}
            >
              <img
                src={arrowAsset.url}
                alt=""
                className="h-32 w-32 md:h-40 md:w-40 select-none"
                draggable={false}
              />
            </motion.div>

            {/* Light trail from arrow path */}
            <motion.div
              initial={{ opacity: 0, scaleY: 0, y: 40 }}
              animate={{ opacity: [0, 0.9, 0.6, 0], scaleY: [0, 1, 1, 1], y: [40, 0, -40, -80] }}
              transition={{ duration: 1.6, delay: 0.4, ease: "easeOut", times: [0, 0.3, 0.7, 1] }}
              className="absolute h-48 w-1 origin-bottom rounded-full"
              style={{
                background:
                  "linear-gradient(to top, transparent, oklch(0.75 0.2 255 / 0.9), oklch(0.85 0.15 255 / 1), transparent)",
                filter: "blur(2px)",
              }}
            />

            {/* Particles */}
            {!reduceMotion &&
              Array.from({ length: 8 }).map((_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const dist = 80 + (i % 3) * 24;
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: Math.cos(angle) * dist,
                      y: Math.sin(angle) * dist - 40,
                      scale: [0, 1, 0.3],
                    }}
                    transition={{ duration: 1.4, delay: 0.7 + i * 0.04, ease: "easeOut" }}
                    className="absolute h-1 w-1 rounded-full"
                    style={{
                      background: "oklch(0.85 0.15 255)",
                      boxShadow: "0 0 8px oklch(0.7 0.2 255 / 0.9)",
                    }}
                  />
                );
              })}

            {/* Stage 2 — wordmark letter-by-letter, arrow takes the V/A position */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.55, ease: [0.4, 0, 0.2, 1] }}
              className="flex items-center gap-[0.18em] text-[2.5rem] md:text-[4rem] font-extrabold tracking-tight text-foreground"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                filter: "drop-shadow(0 0 24px oklch(0.65 0.2 255 / 0.45))",
              }}
            >
              {WORDMARK.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 14, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.4,
                    delay: 1.55 + i * 0.07,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  className="inline-flex items-end leading-none"
                >
                  {ch === "ARROW" ? (
                    <img
                      src={arrowAsset.url}
                      alt=""
                      draggable={false}
                      className="inline-block h-[1.1em] w-auto -translate-y-[0.04em] select-none"
                      style={{
                        filter: "drop-shadow(0 0 14px oklch(0.7 0.2 255 / 0.85))",
                      }}
                    />
                  ) : (
                    ch
                  )}
                </motion.span>
              ))}
            </motion.div>

            {/* Final pulse glow under wordmark */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.3 }}
              animate={{ opacity: [0, 0.7, 0.4], scaleX: [0.3, 1.1, 1] }}
              transition={{ duration: 0.9, delay: 2.05, ease: "easeOut" }}
              className="mt-6 h-[2px] w-56 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, oklch(0.75 0.2 255), transparent)",
                boxShadow: "0 0 24px oklch(0.7 0.2 255 / 0.8)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
