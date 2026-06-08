import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import arrowAsset from "@/assets/elevate-arrow-v2.png.asset.json";

const SESSION_KEY = "elevate_loader_shown";
const TOTAL_MS = 4200;

const WORDMARK = ["E", "L", "E", "V", "ARROW", "T", "E"] as const;

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

  // Timeline (seconds)
  // 0.0 -> grid in
  // 0.3 -> wireframe blocks draw
  // 1.1 -> wireframes morph into UI (color + content)
  // 1.9 -> converge toward center
  // 2.4 -> logo emerges
  // 2.9 -> light sweep + pulse
  // 3.1 -> wordmark
  // 3.7 -> logo lifts, energy wave
  // 4.2 -> exit

  // Layout positions (relative to a 560x340 stage). Components converge to (280,170).
  const blocks = [
    // {id, x, y, w, h, kind}
    { id: "nav",    x: 40,  y: 30,  w: 480, h: 36,  kind: "nav" },
    { id: "hero-l", x: 40,  y: 90,  w: 280, h: 150, kind: "hero" },
    { id: "hero-r", x: 340, y: 90,  w: 180, h: 150, kind: "card" },
    { id: "card-1", x: 40,  y: 260, w: 150, h: 60,  kind: "stat" },
    { id: "card-2", x: 205, y: 260, w: 150, h: 60,  kind: "chart" },
    { id: "card-3", x: 370, y: 260, w: 150, h: 60,  kind: "btn" },
  ] as const;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="page-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(14px)" }}
          transition={{ duration: 0.7, ease: EASE_IO }}
          onAnimationComplete={() => {
            document.body.style.overflow = "";
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          aria-hidden="true"
          style={{ backgroundColor: "#020817" }}
        >
          {/* Ambient vignette */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse at center, rgba(29,78,216,0.10) 0%, rgba(2,8,23,0) 65%)",
            }}
          />

          {/* Blueprint grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.55, 0.55, 0.25] }}
            transition={{ duration: 4.0, times: [0, 0.1, 0.55, 1], ease: "easeOut" }}
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(96,165,250,0.10) 1px, transparent 1px), linear-gradient(90deg, rgba(96,165,250,0.10) 1px, transparent 1px)",
              backgroundSize: "44px 44px",
              maskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 30%, transparent 75%)",
            }}
          />

          {/* Construction stage */}
          <div className="relative">
            <motion.svg
              width={560}
              height={340}
              viewBox="0 0 560 340"
              className="block max-w-[92vw] h-auto"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [1, 1, 0.92, 0.6],
                filter: [
                  "blur(0px)",
                  "blur(0px)",
                  "blur(0px)",
                  "blur(8px)",
                ],
              }}
              transition={{
                duration: 2.6,
                times: [0, 0.18, 0.78, 1],
                ease: EASE_IO,
              }}
              style={{ transformOrigin: "50% 50%" }}
            >
              <defs>
                <linearGradient id="ui-grad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="rgba(96,165,250,0.20)" />
                  <stop offset="100%" stopColor="rgba(29,78,216,0.10)" />
                </linearGradient>
                <linearGradient id="bar-grad" x1="0" y1="1" x2="0" y2="0">
                  <stop offset="0%" stopColor="rgba(96,165,250,0.9)" />
                  <stop offset="100%" stopColor="rgba(186,230,253,0.9)" />
                </linearGradient>
              </defs>

              {blocks.map((b, i) => {
                const cx = b.x + b.w / 2;
                const cy = b.y + b.h / 2;
                const dx = 280 - cx;
                const dy = 170 - cy;
                return (
                  <motion.g
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      x: [0, 0, 0, dx],
                      y: [0, 0, 0, dy],
                      scale: [1, 1, 1, 0.15],
                    }}
                    transition={{
                      duration: 2.4,
                      delay: 0.25 + i * 0.06,
                      times: [0, 0.18, 0.7, 1],
                      ease: EASE_IO,
                    }}
                    style={{ transformOrigin: `${cx}px ${cy}px` }}
                  >
                    {/* Wireframe outline */}
                    <motion.rect
                      x={b.x}
                      y={b.y}
                      width={b.w}
                      height={b.h}
                      rx={8}
                      fill="transparent"
                      stroke="rgba(96,165,250,0.55)"
                      strokeWidth={1}
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: [0, 1, 1, 0.4, 0] }}
                      transition={{
                        duration: 2.0,
                        delay: 0.25 + i * 0.06,
                        times: [0, 0.25, 0.55, 0.7, 1],
                        ease: EASE_OUT,
                      }}
                    />

                    {/* UI fill (fades in after wireframe) */}
                    <motion.rect
                      x={b.x}
                      y={b.y}
                      width={b.w}
                      height={b.h}
                      rx={10}
                      fill="url(#ui-grad)"
                      stroke="rgba(96,165,250,0.45)"
                      strokeWidth={1}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0, 1, 1] }}
                      transition={{
                        duration: 1.8,
                        delay: 0.9 + i * 0.05,
                        times: [0, 0.35, 0.6, 1],
                        ease: EASE_OUT,
                      }}
                    />

                    {/* UI content */}
                    {b.kind === "nav" && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 1, 1] }}
                        transition={{ duration: 1.6, delay: 1.0, times: [0, 0.4, 0.6, 1] }}
                      >
                        <circle cx={b.x + 18} cy={b.y + b.h / 2} r={5} fill="rgba(186,230,253,0.95)" />
                        {[0, 1, 2, 3].map((k) => (
                          <rect
                            key={k}
                            x={b.x + b.w - 40 - k * 60}
                            y={b.y + b.h / 2 - 4}
                            width={40}
                            height={8}
                            rx={4}
                            fill="rgba(148,163,184,0.45)"
                          />
                        ))}
                      </motion.g>
                    )}

                    {b.kind === "hero" && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 1, 1] }}
                        transition={{ duration: 1.6, delay: 1.05, times: [0, 0.4, 0.65, 1] }}
                      >
                        <rect x={b.x + 18} y={b.y + 28} width={180} height={14} rx={4} fill="rgba(226,232,240,0.85)" />
                        <rect x={b.x + 18} y={b.y + 50} width={140} height={10} rx={4} fill="rgba(148,163,184,0.55)" />
                        <rect x={b.x + 18} y={b.y + 68} width={110} height={10} rx={4} fill="rgba(148,163,184,0.45)" />
                        <rect x={b.x + 18} y={b.y + 100} width={80} height={24} rx={6} fill="rgba(59,130,246,0.9)" />
                        <rect x={b.x + 108} y={b.y + 100} width={70} height={24} rx={6} fill="transparent" stroke="rgba(148,163,184,0.6)" />
                      </motion.g>
                    )}

                    {b.kind === "card" && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 1, 1] }}
                        transition={{ duration: 1.6, delay: 1.1, times: [0, 0.4, 0.65, 1] }}
                      >
                        <circle cx={b.x + b.w / 2} cy={b.y + 56} r={26} fill="rgba(59,130,246,0.35)" stroke="rgba(96,165,250,0.7)" />
                        <rect x={b.x + 24} y={b.y + 100} width={b.w - 48} height={10} rx={4} fill="rgba(148,163,184,0.55)" />
                        <rect x={b.x + 24} y={b.y + 118} width={b.w - 80} height={8} rx={4} fill="rgba(148,163,184,0.4)" />
                      </motion.g>
                    )}

                    {b.kind === "stat" && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 1, 1] }}
                        transition={{ duration: 1.6, delay: 1.15, times: [0, 0.4, 0.65, 1] }}
                      >
                        <rect x={b.x + 12} y={b.y + 12} width={50} height={8} rx={3} fill="rgba(148,163,184,0.5)" />
                        <rect x={b.x + 12} y={b.y + 26} width={90} height={18} rx={4} fill="rgba(226,232,240,0.9)" />
                      </motion.g>
                    )}

                    {b.kind === "chart" && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 1, 1] }}
                        transition={{ duration: 1.6, delay: 1.2, times: [0, 0.4, 0.65, 1] }}
                      >
                        {[10, 22, 14, 30, 20, 36, 28].map((h, k) => (
                          <motion.rect
                            key={k}
                            x={b.x + 12 + k * 19}
                            y={b.y + b.h - 8 - h}
                            width={12}
                            height={h}
                            rx={2}
                            fill="url(#bar-grad)"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{
                              duration: 0.5,
                              delay: 1.25 + k * 0.04,
                              ease: EASE_OUT,
                            }}
                            style={{ transformOrigin: `${b.x + 12 + k * 19}px ${b.y + b.h - 8}px` }}
                          />
                        ))}
                      </motion.g>
                    )}

                    {b.kind === "btn" && (
                      <motion.g
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0, 1, 1] }}
                        transition={{ duration: 1.6, delay: 1.25, times: [0, 0.4, 0.65, 1] }}
                      >
                        <rect x={b.x + 16} y={b.y + 18} width={b.w - 32} height={24} rx={6} fill="rgba(59,130,246,0.9)" />
                      </motion.g>
                    )}
                  </motion.g>
                );
              })}

              {/* Connection lines drawn during convergence */}
              {blocks.map((b, i) => {
                const cx = b.x + b.w / 2;
                const cy = b.y + b.h / 2;
                return (
                  <motion.line
                    key={`l-${b.id}`}
                    x1={cx}
                    y1={cy}
                    x2={280}
                    y2={170}
                    stroke="rgba(96,165,250,0.65)"
                    strokeWidth={1}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1, 1], opacity: [0, 0.8, 0] }}
                    transition={{
                      duration: 0.9,
                      delay: 1.9 + i * 0.03,
                      times: [0, 0.6, 1],
                      ease: EASE_OUT,
                    }}
                  />
                );
              })}
            </motion.svg>

            {/* Logo emerging at the convergence point */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.01, delay: 2.35 }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.3, filter: "blur(12px)" }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  filter: "blur(0px)",
                  y: [0, 0, -18],
                }}
                transition={{
                  duration: 1.6,
                  delay: 2.35,
                  times: [0, 0.55, 1],
                  ease: EASE_OUT,
                }}
                className="relative"
                style={{
                  filter:
                    "drop-shadow(0 0 30px rgba(59,130,246,0.7)) drop-shadow(0 18px 50px rgba(2,8,23,0.9))",
                }}
              >
                <img
                  src={arrowAsset.url}
                  alt=""
                  draggable={false}
                  className="relative h-28 w-28 md:h-36 md:w-36 select-none"
                />

                {/* Light sweep */}
                <motion.div
                  initial={{ x: "-120%", opacity: 0 }}
                  animate={{ x: "120%", opacity: [0, 0.9, 0] }}
                  transition={{ duration: 0.9, delay: 2.9, ease: "easeInOut" }}
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(105deg, transparent 35%, rgba(186,230,253,0.85) 50%, transparent 65%)",
                    mixBlendMode: "screen",
                    filter: "blur(6px)",
                  }}
                />
              </motion.div>

              {/* Wordmark */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, y: [0, 0, -10] }}
                transition={{ duration: 1.4, delay: 3.05, times: [0, 0.5, 1] }}
                className="mt-6 flex items-center gap-[0.14em] text-[1.85rem] md:text-[2.6rem] font-extrabold tracking-tight text-white"
                style={{
                  fontFamily: "Inter, system-ui, sans-serif",
                  filter: "drop-shadow(0 0 24px rgba(59,130,246,0.45))",
                }}
              >
                {WORDMARK.map((ch, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{
                      duration: 0.45,
                      delay: 3.1 + i * 0.06,
                      ease: EASE_OUT,
                    }}
                    className="inline-flex items-end leading-none"
                  >
                    {ch === "ARROW" ? (
                      <img
                        src={arrowAsset.url}
                        alt=""
                        draggable={false}
                        className="inline-block h-[1.1em] w-auto -translate-y-[0.04em] select-none"
                        style={{ filter: "drop-shadow(0 0 12px rgba(59,130,246,0.85))" }}
                      />
                    ) : (
                      ch
                    )}
                  </motion.span>
                ))}
              </motion.div>

              {/* Energy wave at the end */}
              {!reduceMotion && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: [0, 0.55, 0], scale: [0.2, 2.6, 3.4] }}
                    transition={{ duration: 1.2, delay: 3.55, ease: "easeOut" }}
                    className="pointer-events-none absolute h-48 w-48 rounded-full border"
                    style={{
                      borderColor: "rgba(96,165,250,0.55)",
                      boxShadow: "0 0 60px rgba(59,130,246,0.4)",
                    }}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.2 }}
                    animate={{ opacity: [0, 0.3, 0], scale: [0.2, 3.4, 4.4] }}
                    transition={{ duration: 1.3, delay: 3.7, ease: "easeOut" }}
                    className="pointer-events-none absolute h-48 w-48 rounded-full border"
                    style={{ borderColor: "rgba(147,197,253,0.35)" }}
                  />
                </>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
