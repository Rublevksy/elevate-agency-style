import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import logo from "@/assets/elevate-logo.png";

const SESSION_KEY = "elevate_loader_shown";

export function PageLoader() {
  // Default to false on SSR; flip to true on first client mount if not yet shown.
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
      sessionStorage.setItem(SESSION_KEY, "1");
    } catch {
      // ignore (private mode etc.) — still play once
    }
    // Respect reduced motion: skip entirely.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    setShow(true);
    // Lock body scroll while loader is visible.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timer = window.setTimeout(() => setShow(false), 1500);
    return () => {
      window.clearTimeout(timer);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          onAnimationComplete={() => {
            document.body.style.overflow = "";
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          aria-hidden="true"
        >
          {/* Ambient glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: [0, 0.7, 0.45], scale: [0.6, 1.1, 1] }}
            transition={{ duration: 1.4, ease: "easeOut", times: [0, 0.6, 1] }}
            className="pointer-events-none absolute h-[40rem] w-[40rem] rounded-full blur-[140px]"
            style={{
              background:
                "radial-gradient(closest-side, oklch(0.65 0.18 255 / 0.45), transparent 70%)",
            }}
          />

          <div className="relative flex flex-col items-center gap-8">
            {/* Animated arrow line */}
            <svg
              width="92"
              height="110"
              viewBox="0 0 92 110"
              fill="none"
              className="drop-shadow-[0_0_18px_oklch(0.65_0.18_255/0.7)]"
            >
              <defs>
                <linearGradient id="loader-arrow-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7DD3FC" />
                  <stop offset="50%" stopColor="#38BDF8" />
                  <stop offset="100%" stopColor="#1D4ED8" />
                </linearGradient>
              </defs>
              {/* Upward arrow path: left leg up, head, right leg down, crossbar last */}
              <motion.path
                d="M 18 100 L 46 14 L 74 100 M 28 70 L 64 70"
                stroke="url(#loader-arrow-grad)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{
                  pathLength: { duration: 0.85, ease: [0.65, 0, 0.35, 1] },
                  opacity: { duration: 0.15 },
                }}
              />
            </svg>

            {/* Full logo fade-in with subtle pulse */}
            <motion.img
              src={logo}
              alt=""
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: [0, 1, 0.92, 1], y: 0 }}
              transition={{
                opacity: { duration: 0.9, delay: 0.55, times: [0, 0.45, 0.75, 1], ease: "easeOut" },
                y: { duration: 0.5, delay: 0.55, ease: [0.4, 0, 0.2, 1] },
              }}
              className="h-9 w-auto select-none"
              draggable={false}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
