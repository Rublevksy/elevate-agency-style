import { motion, type MotionValue } from "framer-motion";
import { Screen } from "./Screen";
import { LidLogo } from "./Logo";
import { ALU, GRAIN, SHEEN } from "./material";
import type { IntroGeometry } from "../useIntroGeometry";

/**
 * The lid: an independent body hinged on the deck's back edge. 180° = closed
 * flat on the deck, ~68° = open and reclined. Contains the screen panel and the
 * aluminium outer shell carrying the ELEVATE mark.
 */
export function Lid({
  geo,
  rotate,
  bezel,
  content,
}: {
  geo: IntroGeometry;
  rotate: MotionValue<string>;
  bezel: MotionValue<number>;
  content: MotionValue<number>;
}) {
  const { W, H, T } = geo;
  return (
    <motion.div
      style={{
        position: "absolute",
        top: -H,
        left: 0,
        width: W,
        height: H,
        transformOrigin: "50% 100%",
        transformStyle: "preserve-3d",
        transform: rotate,
      }}
    >
      <Screen W={W} bezel={bezel} content={content} />

      {/* aluminium outer shell */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: W * 0.016,
          backgroundImage: `${SHEEN}, ${GRAIN}, ${ALU}`,
          transform: `translateZ(${-Math.max(8, T * 1.25)}px)`,
          display: "grid",
          placeItems: "center",
          opacity: bezel,
          backfaceVisibility: "hidden",
          boxShadow: `inset 0 1px 0 rgba(255,255,255,.24), inset 0 0 0 1px rgba(255,255,255,.06), 0 ${T}px ${T * 5}px rgba(0,0,0,.7)`,
        }}
      >
        <LidLogo W={W} flip />
      </motion.div>
    </motion.div>
  );
}
