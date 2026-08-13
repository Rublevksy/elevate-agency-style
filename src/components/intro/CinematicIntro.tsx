import { useEffect } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { ScrollScene } from "./ScrollScene";
import { MacBook } from "./macbook/MacBook";
import { ScreenInterface } from "./ScreenInterface";
import { useCamera } from "./CameraController";
import { useIntroGeometry } from "./useIntroGeometry";
import { setCinematicActive } from "@/lib/cinematic-state";

/**
 * CinematicIntro — the homepage entrance.
 *
 * One realistic premium laptop, one pinned stage, one scroll timeline:
 * closed → camera orbit → hinge opening → fully open → camera enters the
 * display → fullscreen ELEVATE interface → hand-off to the website.
 */
export function CinematicIntro() {
  return <ScrollScene>{(p, raw) => <Stage p={p} raw={raw} />}</ScrollScene>;
}

function Stage({ p, raw }: { p: MotionValue<number>; raw: MotionValue<number> }) {
  const geo = useIntroGeometry();
  const reduced = !!useReducedMotion();
  const cam = useCamera(p, geo, reduced);

  // hide site chrome while the cinematic owns the viewport
  useMotionValueEvent(raw, "change", (v) => setCinematicActive(v < 0.965));
  useEffect(() => {
    setCinematicActive(true);
    return () => setCinematicActive(false);
  }, []);

  const takeoverScale = useTransform(p, [0.7, 0.84], [0.94, 1]);
  const takeoverRadius = useTransform(p, [0.7, 0.84], [geo.W * 0.016, 0]);

  return (
    <>
      {/* atmosphere only — soft product lighting, no particles or blobs */}
      <motion.div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: cam.ambient,
          background:
            "radial-gradient(ellipse at 50% 42%, oklch(0.24 0.04 250 / 0.55), transparent 62%)",
        }}
      />

      {/* stage */}
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid place-items-center" style={{ perspective: geo.perspective }}>
          <motion.div
            style={{
              transformStyle: "preserve-3d",
              opacity: cam.chassis,
              rotateX: cam.tilt,
              rotateY: cam.yaw,
              scale: cam.zoom,
              y: cam.frameY,
            }}
          >
            <MacBook
              geo={geo}
              lidRotate={cam.lidRotate}
              baseOpacity={cam.baseOpacity}
              bezelOpacity={cam.bezelOpacity}
              screenOpacity={cam.screenOpacity}
            />
          </motion.div>
        </div>
      </div>

      {/* the camera has entered the display */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          opacity: cam.takeover,
          scale: takeoverScale,
          borderRadius: takeoverRadius,
          pointerEvents: "none",
        }}
      >
        <ScreenInterface />
      </motion.div>

      {/* single, deliberately tiny hint */}
      <motion.div className="absolute inset-x-0 bottom-8 text-center" style={{ opacity: cam.hint }}>
        <span className="text-[9px] uppercase tracking-[0.55em] text-white/35">Scroll to enter</span>
      </motion.div>
    </>
  );
}
