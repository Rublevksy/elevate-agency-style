import { motion, type MotionValue } from "framer-motion";
import { ScreenInterface } from "../ScreenInterface";

/**
 * The display panel: bezel, camera notch, live interface and glass reflection.
 * `bezel` and `content` are independent opacities so the chassis can peel away
 * in layers as the camera travels into the screen.
 */
export function Screen({
  W,
  bezel,
  content,
}: {
  W: number;
  bezel: MotionValue<number>;
  content: MotionValue<number>;
}) {
  return (
    <motion.div
      style={{
        position: "absolute",
        inset: 0,
        borderRadius: W * 0.014,
        background: "#080a0d",
        padding: W * 0.009,
        opacity: bezel,
        boxShadow: `0 0 0 1px rgba(255,255,255,.06), inset 0 0 ${W * 0.02}px rgba(0,0,0,.9)`,
        overflow: "hidden",
      }}
    >
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: W * 0.0032,
          left: "50%",
          width: W * 0.0038,
          height: W * 0.0038,
          borderRadius: 99,
          background: "#1d222a",
        }}
      />
      <div
        style={{
          position: "relative",
          height: "100%",
          width: "100%",
          borderRadius: W * 0.005,
          overflow: "hidden",
          containerType: "size",
        }}
      >
        <motion.div style={{ position: "absolute", inset: 0, opacity: content }}>
          <ScreenInterface compact />
        </motion.div>
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(115deg, rgba(255,255,255,.06) 0%, rgba(255,255,255,0) 36%, rgba(255,255,255,.025) 60%, rgba(255,255,255,0) 100%)",
          }}
        />
      </div>
    </motion.div>
  );
}
