/**
 * Compatibility shim for the /design-v* exploration routes.
 *
 * The scene plates and their presentation moved to
 * src/components/media/SceneImage.tsx when the production homepage was built
 * on them — production must not import from this deliberately temporary
 * folder. The exploration routes keep working through this re-export until
 * the whole design-explore zone is removed.
 */
export {
  SceneImage as RefImage,
  SceneImage as default,
  type SceneName as RefName,
  type SceneImageProps as RefImageProps,
} from "@/components/media/SceneImage";
