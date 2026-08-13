import { motion, type MotionValue } from "framer-motion";
import { Base } from "./Base";
import { Lid } from "./Lid";
import type { IntroGeometry } from "../useIntroGeometry";

/**
 * Assembled device. Base and lid are separate bodies sharing the hinge line at
 * y = 0, so the opening is real rotation rather than an image transform.
 */
export function MacBook({
  geo,
  lidRotate,
  baseOpacity,
  bezelOpacity,
  shellOpacity,
  screenOpacity,
}: {
  geo: IntroGeometry;
  lidRotate: MotionValue<string>;
  baseOpacity: MotionValue<number>;
  bezelOpacity: MotionValue<number>;
  shellOpacity: MotionValue<number>;
  screenOpacity: MotionValue<number>;
}) {
  return (
    <div style={{ transformStyle: "preserve-3d", position: "relative", width: geo.W, height: 0 }}>
      <motion.div style={{ transformStyle: "preserve-3d", opacity: baseOpacity }}>
        <Base geo={geo} />
      </motion.div>
      <Lid geo={geo} rotate={lidRotate} bezel={bezelOpacity} shell={shellOpacity} content={screenOpacity} />
    </div>
  );
}
