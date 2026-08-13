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

      {/* hinge assembly: a recessed dark channel with the barrel running through
          it and two machined knuckles — the part that visually ties lid to deck */}
      <mesh position={[0, T - 0.14, -D / 2 + 0.34]}>
        <boxGeometry args={[W * 0.72, 0.34, 0.66]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.85} metalness={0.35} />
      </mesh>
      <mesh position={[0, T - 0.2, -D / 2 + 0.34]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.26, 0.26, W * 0.7, 28]} />
        <meshStandardMaterial {...ALUMINIUM_DARK} roughness={0.3} />
      </mesh>
      {[-1, 1].map((s) => (
        <group key={s}>
          <mesh position={[s * W * 0.29, T - 0.2, -D / 2 + 0.34]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.3, 0.3, W * 0.075, 24]} />
            <meshStandardMaterial {...ALUMINIUM_DARK} roughness={0.24} />
          </mesh>
          <mesh position={[s * W * 0.09, T - 0.2, -D / 2 + 0.34]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.29, 0.29, W * 0.06, 24]} />
            <meshStandardMaterial {...ALUMINIUM_DARK} roughness={0.24} />
          </mesh>
        </group>
      ))}

      <Lid ref={lidRef} screenRef={screenRef} progress={progress} stage={stage} />
    </group>
  );
});
