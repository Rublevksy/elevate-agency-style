import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import arrowAsset from "@/assets/elevate-arrow-v2.png.asset.json";

const SESSION_KEY = "elevate_loader_shown";
const TOTAL_MS = 3600;

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
          exit={{ opacity: 0, filter: "blur(12px)", scale: 1.04 }}
          transition={{ duration: 0.7, ease: [0.65, 0, 0.35, 1] }}
          onAnimationComplete={() => {
            document.body.style.overflow = "";
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          aria-hidden="true"
          style={{ backgroundColor: "#020817" }}
        >
          {/* Deep ambient vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(29,78,216,0.10) 0%, rgba(2,8,23,0) 60%)",
            }}
          />

          {/* Initial seed light — small pulse in center before logo appears */}
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{
              opacity: [0, 1, 0.9, 0],
              scale: [0.2, 0.8, 1.4, 2.2],
            }}
            transition={{ duration: 1.0, ease: "easeOut", times: [0, 0.4, 0.7, 1] }}
            className="pointer-events-none absolute h-24 w-24 rounded-full"
            style={{
              background:
                "radial-gradient(closest-side, rgba(96,165,250,0.95), rgba(59,130,246,0.5) 40%, transparent 70%)",
              filter: "blur(6px)",
            }}
          />

          {/* Vertical accelerating light streak (the "rising light") */}
          <motion.div
            initial={{ opacity: 0, scaleY: 0, y: 200 }}
            animate={{
              opacity: [0, 0.9, 0.7, 0],
              scaleY: [0, 1, 1, 0.6],
              y: [200, 40, -40, -160],
            }}
            transition={{ duration: 1.1, delay: 0.2, ease: [0.6, 0, 0.3, 1], times: [0, 0.4, 0.75, 1] }}
            className="pointer-events-none absolute h-72 w-[3px] origin-bottom rounded-full"
            style={{
              background:
                "linear-gradient(to top, transparent, rgba(96,165,250,0.95), rgba(186,230,253,1), transparent)",
              filter: "blur(2px)",
              boxShadow: "0 0 24px rgba(59,130,246,0.9)",
            }}
          />

          {/* Expanding energy wave ring after logo lands */}
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 0.55, 0], scale: [0.2, 2.6, 3.4] }}
            transition={{ duration: 1.6, delay: 1.5, ease: "easeOut" }}
            className="pointer-events-none absolute h-56 w-56 rounded-full border"
            style={{
              borderColor: "rgba(96,165,250,0.55)",
              boxShadow:
                "0 0 60px rgba(59,130,246,0.45), inset 0 0 40px rgba(59,130,246,0.35)",
            }}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: [0, 0.35, 0], scale: [0.2, 3.2, 4.2] }}
            transition={{ duration: 1.8, delay: 1.7, ease: "easeOut" }}
            className="pointer-events-none absolute h-56 w-56 rounded-full border"
            style={{ borderColor: "rgba(147,197,253,0.35)" }}
          />

          {/* Ambient halo behind logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.7, 0.55], scale: [0.6, 1.2, 1] }}
            transition={{ duration: 2.0, delay: 0.9, ease: "easeOut", times: [0, 0.55, 1] }}
            className="pointer-events-none absolute h-[42rem] w-[42rem] rounded-full blur-[140px]"
            style={{
              background:
                "radial-gradient(closest-side, rgba(59,130,246,0.55), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center">
            {/* Logo reveal — mask wipe + glow + light sweep */}
            <motion.div
              initial={{ opacity: 0, scale: 0.7, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.0, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
              style={{
                filter:
                  "drop-shadow(0 0 30px rgba(59,130,246,0.85)) drop-shadow(0 18px 50px rgba(2,8,23,0.9))",
              }}
            >
              {/* The mark */}
              <motion.img
                src={arrowAsset.url}
                alt=""
                draggable={false}
                className="relative h-40 w-40 md:h-52 md:w-52 select-none"
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)" }}
                transition={{ duration: 1.0, delay: 1.05, ease: [0.65, 0, 0.35, 1] }}
              />

              {/* Light sweep across the mark */}
              <motion.div
                initial={{ x: "-120%", opacity: 0 }}
                animate={{ x: "120%", opacity: [0, 0.9, 0] }}
                transition={{ duration: 0.9, delay: 1.7, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 35%, rgba(186,230,253,0.85) 50%, transparent 65%)",
                  mixBlendMode: "screen",
                  filter: "blur(6px)",
                  clipPath:
                    "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                }}
              />

              {/* Final pulse glow ring around mark */}
              <motion.div
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 0.7, 0], scale: [0.6, 1.6, 2] }}
                transition={{ duration: 1.2, delay: 2.3, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(closest-side, rgba(96,165,250,0.55), transparent 70%)",
                  filter: "blur(20px)",
                }}
              />
            </motion.div>

            {/* Particles following arrow direction (upward-right) */}
            {!reduceMotion &&
              Array.from({ length: 10 }).map((_, i) => {
                const offsetX = (i - 5) * 8;
                const targetY = -(120 + (i % 4) * 22);
                const targetX = offsetX + 30 + (i % 3) * 12;
                return (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, x: offsetX, y: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      x: targetX,
                      y: targetY,
                      scale: [0, 1, 0.3],
                    }}
                    transition={{
                      duration: 1.3,
                      delay: 1.3 + i * 0.04,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                    className="absolute h-[3px] w-[3px] rounded-full"
                    style={{
                      background: "rgba(186,230,253,1)",
                      boxShadow: "0 0 10px rgba(59,130,246,0.95)",
                    }}
                  />
                );
              })}

            {/* Wordmark — letter-by-letter with arrow as the A */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 2.2 }}
              className="mt-10 flex items-center gap-[0.16em] text-[2.25rem] md:text-[3.5rem] font-extrabold tracking-tight text-white"
              style={{
                fontFamily: "Inter, system-ui, sans-serif",
                filter: "drop-shadow(0 0 28px rgba(59,130,246,0.5))",
              }}
            >
              {WORDMARK.map((ch, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{
                    duration: 0.5,
                    delay: 2.2 + i * 0.07,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="inline-flex items-end leading-none"
                >
                  {ch === "ARROW" ? (
                    <img
                      src={arrowAsset.url}
                      alt=""
                      draggable={false}
                      className="inline-block h-[1.15em] w-auto -translate-y-[0.05em] select-none"
                      style={{
                        filter:
                          "drop-shadow(0 0 14px rgba(59,130,246,0.9))",
                      }}
                    />
                  ) : (
                    ch
                  )}
                </motion.span>
              ))}
            </motion.div>

            {/* Underline pulse */}
            <motion.div
              initial={{ opacity: 0, scaleX: 0.2 }}
              animate={{ opacity: [0, 0.85, 0.5], scaleX: [0.2, 1.1, 1] }}
              transition={{ duration: 0.9, delay: 2.85, ease: "easeOut" }}
              className="mt-5 h-[2px] w-60 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(96,165,250,1), transparent)",
                boxShadow: "0 0 24px rgba(59,130,246,0.85)",
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
