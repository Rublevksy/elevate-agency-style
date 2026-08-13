import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { ElevateScreen } from "./ElevateScreen";
import { setCinematicActive } from "@/lib/cinematic-state";
import logo from "@/assets/elevate-logo.png";

/**
 * MacbookIntro — the homepage opening.
 *
 * One pinned scene, scroll-driven from 0 → 1:
 *  01 (0–.15)   closed aluminium laptop, breathing camera
 *  02 (.15–.30) cinematic orbit around the device
 *  03 (.30–.55) realistic hinge opening (lid + base are separate bodies)
 *  04 (.55–.65) fully open, display readable
 *  05 (.65–.80) camera travels into the display, chassis leaves the frame
 *  06 (.80–1)   only the digital experience remains, then hands off to the site
 */
export function MacbookIntro() {
  const wrap = useRef<HTMLDivElement | null>(null);
  const reduced = useReducedMotion();

  const [vp, setVp] = useState({ w: 1280, h: 800 });
  useLayoutEffect(() => {
    const read = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  const mobile = vp.w < 768;
  // display geometry (16:10), sized so the device owns 70–85% of the viewport
  const W = Math.min(mobile ? vp.w * 0.92 : vp.w * 0.8, mobile ? 460 : 1120, vp.h * (mobile ? 0.95 : 0.92));
  const H = W * 0.625; // display height
  const D = W * 0.68; // base depth
  const T = Math.max(6, W * 0.011); // body thickness

  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.35 });

  useMotionValueEvent(scrollYProgress, "change", (v) => setCinematicActive(v < 0.965));
  useEffect(() => () => setCinematicActive(false), []);

  // ── camera ────────────────────────────────────────────────────────────────
  const tilt = useTransform(p, [0, 0.15, 0.3, 0.55, 0.65, 0.8], [-46, -50, -60, -70, -76, -84]);
  const yaw = useTransform(
    p,
    [0, 0.15, 0.3, 0.45, 0.6, 0.72],
    reduced ? [0, 0, 0, 0, 0, 0] : [-14, -9, 17, 8, 2, 0],
  );
  const zoom = useTransform(
    p,
    [0, 0.15, 0.3, 0.55, 0.65, 0.8],
    reduced ? [0.9, 0.9, 0.92, 0.94, 0.94, 0.94] : [0.95, 0.96, 0.94, 0.82, 0.9, 3.9],
  );
  // screen-space framing: closed device sits low, then the display is tracked
  // to the viewport centre so the camera zoom lands exactly inside the screen
  const frameY = useTransform([p, zoom] as never, (v) => {
    const [pp, z] = v as unknown as number[];
    const closed = -D * 0.5;
    const tracked = H * 0.5 * z;
    const b = Math.min(1, Math.max(0, (pp - 0.3) / 0.28));
    const e = b * b * (3 - 2 * b);
    return closed * (1 - e) + tracked * e;
  });


  // ── hinge: 180° = lid closed on the deck, 62° = open & reclined ────────────
  const lidA = useTransform(p, [0.3, 0.55, 0.65, 0.8], [180, 68, 64, 88]);
  const lidRot = useTransform(lidA, (a) => `rotateX(${a}deg)`);

  // chassis leaves the frame as the camera enters the display
  const screenContent = useTransform(p, [0.58, 0.67], [1, 0]);
  const chassis = useTransform(p, [0.74, 0.86], [1, 0]);
  const takeover = useTransform(p, [0.70, 0.80, 0.96, 1], [0, 1, 1, 0]);
  const hintOpacity = useTransform(p, [0, 0.08], [1, 0]);
  const ambient = useTransform(p, [0, 0.5, 0.8], [0.5, 0.7, 0.25]);

  const metal =
    "linear-gradient(150deg, #2c3138 0%, #1b1f25 34%, #23282f 58%, #14171c 100%)";

  return (
    <div ref={wrap} className="relative h-[620vh] md:h-[720vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#04060a]">
        {/* atmosphere only — no particles, no blobs */}
        <motion.div
          aria-hidden
          className="absolute inset-0"
          style={{
            opacity: ambient,
            background:
              "radial-gradient(ellipse at 50% 42%, oklch(0.26 0.05 250 / 0.55), transparent 62%)",
          }}
        />

        {/* stage — 2D framing wrapper keeps the device composed in the viewport */}
        <div className="absolute inset-0 grid place-items-center">
        <div className="grid place-items-center" style={{ perspective: mobile ? 1400 : 2200 }}>
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              opacity: chassis,
              rotateX: tilt,
              rotateY: yaw,
              scale: zoom,
              y: frameY,
            }}
          >
            {/* hinge origin */}
            <motion.div style={{ transformStyle: "preserve-3d" }}>
              <div style={{ transformStyle: "preserve-3d", position: "relative", width: W, height: 0 }}>
                {/* ── BASE (deck) — extends toward the viewer from the hinge ── */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: W,
                    height: D,
                    borderRadius: `${W * 0.006}px ${W * 0.006}px ${W * 0.02}px ${W * 0.02}px`,
                    background: metal,
                    boxShadow: `0 ${T * 1.4}px ${T * 3}px rgba(0,0,0,.75), inset 0 1px 0 rgba(255,255,255,.07)`,
                    transformStyle: "preserve-3d",
                  }}
                >
                  {/* keyboard well */}
                  <div
                    style={{
                      position: "absolute",
                      left: "6%",
                      right: "6%",
                      top: "9%",
                      height: "44%",
                      borderRadius: W * 0.008,
                      background: "linear-gradient(180deg, #0a0c0f, #05070a)",
                      boxShadow: "inset 0 1px 2px rgba(0,0,0,.9)",
                      display: "grid",
                      gridTemplateRows: "repeat(5, 1fr)",
                      gap: W * 0.0035,
                      padding: W * 0.006,
                    }}
                  >
                    {Array.from({ length: 5 }).map((_, r) => (
                      <div key={r} style={{ display: "grid", gridTemplateColumns: `repeat(${r === 4 ? 9 : 14}, 1fr)`, gap: W * 0.0035 }}>
                        {Array.from({ length: r === 4 ? 9 : 14 }).map((__, c) => (
                          <div
                            key={c}
                            style={{
                              borderRadius: Math.max(1, W * 0.002),
                              background: "linear-gradient(180deg, #191d23, #0d1014)",
                              boxShadow: "0 1px 0 rgba(0,0,0,.8), inset 0 1px 0 rgba(255,255,255,.04)",
                            }}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                  {/* trackpad */}
                  <div
                    style={{
                      position: "absolute",
                      left: "30%",
                      right: "30%",
                      top: "58%",
                      height: "30%",
                      borderRadius: W * 0.006,
                      background: "linear-gradient(180deg, #1d2229, #171b21)",
                      boxShadow: "inset 0 0 0 1px rgba(255,255,255,.05)",
                    }}
                  />
                </div>

                {/* front edge thickness */}
                <div
                  style={{
                    position: "absolute",
                    top: D,
                    left: 0,
                    width: W,
                    height: T,
                    background: "linear-gradient(180deg, #23272e, #0c0e12)",
                    borderRadius: `0 0 ${W * 0.02}px ${W * 0.02}px`,
                    transform: `rotateX(-90deg)`,
                    transformOrigin: "50% 0%",
                  }}
                />

                {/* ── LID — its own body, hinged on the back edge ── */}
                <motion.div
                  style={{
                    position: "absolute",
                    top: -H,
                    left: 0,
                    width: W,
                    height: H,
                    transformOrigin: "50% 100%",
                    transformStyle: "preserve-3d",
                    transform: lidRot,
                  }}
                >
                  {/* screen side (faces the deck when closed) */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: W * 0.014,
                      background: "#0a0c10",
                      padding: W * 0.009,
                      boxShadow: `0 0 0 1px rgba(255,255,255,.06), 0 ${T}px ${T * 4}px rgba(0,0,0,.6)`,
                      backfaceVisibility: "hidden",
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ position: "absolute", top: W * 0.0035, left: "50%", width: W * 0.004, height: W * 0.004, borderRadius: 99, background: "#1c2129" }} />
                    <div style={{ position: "relative", height: "100%", width: "100%", borderRadius: W * 0.006, overflow: "hidden" }}>
                      <motion.div style={{ position: "absolute", inset: 0, opacity: screenContent }}>
                        <ElevateScreen compact />
                      </motion.div>
                      {/* glass reflection */}
                      <div
                        aria-hidden
                        style={{
                          position: "absolute",
                          inset: 0,
                          background:
                            "linear-gradient(115deg, rgba(255,255,255,.07) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,.03) 62%, rgba(255,255,255,0) 100%)",
                        }}
                      />
                    </div>
                  </div>

                  {/* aluminium outer shell with the ELEVATE mark */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: W * 0.014,
                      background: metal,
                      transform: "translateZ(-2px)",
                      display: "grid",
                      placeItems: "center",
                      boxShadow: "inset 0 1px 0 rgba(255,255,255,.08), inset 0 0 60px rgba(0,0,0,.5)",
                    }}
                  >
                    <img
                      src={logo}
                      alt=""
                      aria-hidden
                      style={{ width: W * 0.34, height: "auto", opacity: 0.5, transform: "scaleY(-1)", filter: "grayscale(0.35) brightness(1.15)" }}
                      decoding="async"
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
        </div>

        {/* fullscreen digital experience — the camera has entered the display */}
        <motion.div className="absolute inset-0" style={{ opacity: takeover, pointerEvents: "none" }}>
          <ElevateScreen />
        </motion.div>

        {/* the single, deliberately tiny hint */}
        <motion.div
          className="absolute inset-x-0 bottom-8 text-center"
          style={{ opacity: hintOpacity }}
        >
          <span className="text-[9px] uppercase tracking-[0.55em] text-white/35">Scroll to explore</span>
        </motion.div>
      </div>
    </div>
  );
}
