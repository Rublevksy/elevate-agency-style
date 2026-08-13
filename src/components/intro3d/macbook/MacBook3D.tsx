import { forwardRef } from "react";
import type { Group } from "three";
import { DEVICE } from "../constants";
import { Base } from "./Base";
import { Lid } from "./Lid";
import { ALUMINIUM_DARK } from "./materials";

/**
 * Assembled product: BASE + HINGE + LID (+ SCREEN, KEYBOARD, LOGO inside).
 *
 * Every part is an independent object, so a real GLB product model can replace
 * these primitives one-for-one later (see MACBOOK_MODEL_URL in constants.ts):
 * load the GLB, then map its BASE / LID / SCREEN nodes onto the same refs.
 */
export const MacBook3D = forwardRef<
  Group,
  {
    lidRef: React.Ref<Group>;
    screenRef: React.Ref<Group>;
    /** master timeline — drives the interface inside the display */
    progress: React.RefObject<number>;
    /** device timeline — drives hinge, screen light and handoff */
    stage: React.RefObject<number>;
  }
>(function MacBook3D({ lidRef, screenRef, progress, stage }, ref) {
  const { W, D, T } = DEVICE;
  return (
    <group ref={ref}>
      <Base />

      {/* hinge barrel */}
      <mesh position={[0, T - 0.22, -D / 2 + 0.3]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.28, 0.28, W * 0.52, 24]} />
        <meshStandardMaterial {...ALUMINIUM_DARK} />
      </mesh>

      {/* hinge end caps */}
      {[-1, 1].map((s) => (
        <mesh
          key={s}
          position={[s * W * 0.3, T - 0.22, -D / 2 + 0.3]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.24, 0.24, W * 0.06, 20]} />
          <meshStandardMaterial {...ALUMINIUM_DARK} />
        </mesh>
      ))}

      <Lid ref={lidRef} screenRef={screenRef} progress={progress} stage={stage} />
    </group>
  );
});
