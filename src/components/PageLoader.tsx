import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import logoAsset from "@/assets/elevate-full-logo.png.asset.json";

const SESSION_KEY = "elevate_loader_shown";
const TOTAL_MS = 3200;
const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_IO = [0.65, 0, 0.35, 1] as const;

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

  // 8 light lines converging to center from various angles
  const lines = Array.from({ length: 8 }, (_, i) => {
    const angle = (i / 8) * Math.PI * 2;
    return {
      x: Math.cos(angle) * 520,
      y: Math.sin(angle) * 520,
      delay: 0.25 + i * 0.04,
      rot: (angle * 180) / Math.PI,
    };
  });

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(10px)" }}
          transition={{ duration: 0.6, ease: EASE_IO }}
          onAnimationComplete={() => {
            document.body.style.overflow = "";
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          aria-hidden="true"
          style={{ backgroundColor: "#020817" }}
        >
          {/* Ambient depth vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(29,78,216,0.12) 0%, rgba(2,8,23,0) 60%)",
            }}
          />

          {/* Soft moving light beams */}
          {!reduceMotion &&
            [0, 1, 2].map((i) => (
              <motion.div
                key={`beam-${i}`}
                className="pointer-events-none absolute -inset-1/4"
                initial={{ opacity: 0, rotate: -20 + i * 15 }}
                animate={{
                  opacity: [0, 0.35, 0.35, 0],
                  x: ["-10%", "10%", "-5%", "5%"],
                }}
                transition={{
                  duration: 3.2,
                  delay: i * 0.2,
                  times: [0, 0.25, 0.7, 1],
                  ease: "easeInOut",
                }}
                style={{
                  background: `linear-gradient(${
                    100 + i * 25
                  }deg, transparent 40%, rgba(96,165,250,${
                    0.08 + i * 0.03
                  }) 50%, transparent 60%)`,
                  filter: "blur(40px)",
                }}
              />
            ))}

          {/* Converging light lines */}
          <div className="absolute inset-0 flex items-center justify-center">
            {lines.map((l, i) => (
              <motion.div
                key={`line-${i}`}
                className="absolute origin-right"
                style={{
                  width: 240,
                  height: 1,
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(96,165,250,0.0) 30%, rgba(147,197,253,0.9) 100%)",
                  rotate: `${l.rot}deg`,
                  filter: "drop-shadow(0 0 6px rgba(59,130,246,0.6))",
                }}
                initial={{ x: l.x, y: l.y, opacity: 0, scaleX: 0.4 }}
                animate={{
                  x: [l.x, 0],
                  y: [l.y, 0],
                  opacity: [0, 1, 0],
                  scaleX: [0.4, 1, 0.2],
                }}
                transition={{
                  duration: 1.2,
                  delay: l.delay,
                  times: [0, 0.7, 1],
                  ease: EASE_OUT,
                }}
              />
            ))}
          </div>

          {/* Circular energy field forming then opening */}
          <motion.div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: 280,
              height: 280,
              border: "1px solid rgba(96,165,250,0.7)",
              boxShadow:
                "0 0 60px rgba(59,130,246,0.45), inset 0 0 60px rgba(59,130,246,0.35)",
            }}
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{
              opacity: [0, 1, 1, 0],
              scale: [0.2, 1, 1.8, 2.6],
            }}
            transition={{
              duration: 1.8,
              delay: 1.0,
              times: [0, 0.35, 0.7, 1],
              ease: EASE_IO,
            }}
          />
          <motion.div
            className="pointer-events-none absolute rounded-full"
            style={{
              width: 180,
              height: 180,
              border: "1px solid rgba(147,197,253,0.5)",
              boxShadow: "0 0 40px rgba(59,130,246,0.5)",
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{
              opacity: [0, 0.9, 0],
              scale: [0.3, 1.2, 2.2],
            }}
            transition={{
              duration: 1.6,
              delay: 1.15,
              times: [0, 0.45, 1],
              ease: EASE_OUT,
            }}
          />

          {/* Logo (uploaded PNG, untouched) with subtle glow */}
          <motion.div
            className="relative z-10 flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.9,
              delay: 1.7,
              ease: EASE_OUT,
            }}
          >
            {/* Soft premium glow halo */}
            <motion.div
              className="pointer-events-none absolute"
              style={{
                width: "70%",
                height: "60%",
                background:
                  "radial-gradient(ellipse at center, rgba(59,130,246,0.45) 0%, rgba(59,130,246,0) 70%)",
                filter: "blur(30px)",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.9, 0.6] }}
              transition={{
                duration: 1.0,
                delay: 1.8,
                times: [0, 0.6, 1],
                ease: EASE_OUT,
              }}
            />

            <img
              src={logoAsset.url}
              alt="ELEVATE"
              draggable={false}
              className="relative block w-[min(78vw,720px)] h-auto select-none"
              style={{
                filter: "drop-shadow(0 0 28px rgba(59,130,246,0.35))",
              }}
            />
          </motion.div>

          {/* Light sweep across the screen near the end */}
          <motion.div
            className="pointer-events-none absolute inset-0"
            initial={{ x: "-110%", opacity: 0 }}
            animate={{ x: "110%", opacity: [0, 0.9, 0] }}
            transition={{
              duration: 0.9,
              delay: 2.5,
              ease: "easeInOut",
            }}
            style={{
              background:
                "linear-gradient(105deg, transparent 40%, rgba(186,230,253,0.7) 50%, transparent 60%)",
              mixBlendMode: "screen",
              filter: "blur(8px)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
