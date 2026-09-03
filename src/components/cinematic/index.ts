/**
 * The cinematic foundation: one timeline, one camera, one gate.
 *
 * Sections import from here and from nowhere deeper — the point of the module
 * is that there is a single answer to "where is the page scrolled", "what does
 * the camera look like" and "how much motion does this machine carry".
 */
export {
  CinematicStage,
  useStage,
  useOptionalStage,
  useStageProgress,
  useStageAct,
  type ActRegistration,
  type ActRecord,
} from "./CinematicStage";
export { useAct, type Act, type ActOptions } from "./useAct";
export {
  useMotionCapability,
  useReducedScene,
  useCinematicScene,
  useDetectedCapability,
  type MotionCapability,
} from "./useMotionCapability";
export {
  EASE,
  BEAT,
  depth,
  HERO_TAIL_MASK_START,
  HERO_TAIL_MASK_END,
  PERSPECTIVE,
  Z_ATMO,
  Z_LIGHT_BACK,
  Z_PLATE,
  Z_LIGHT_FRONT,
} from "./motion-tokens";
