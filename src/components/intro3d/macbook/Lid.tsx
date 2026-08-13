import { forwardRef } from "react";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { DEVICE } from "../constants";
import { Screen } from "./Screen";
import { LidLogo } from "./Logo";
import { ALUMINIUM, ALUMINIUM_DARK } from "./materials";

/**
 * The lid: an independent body hinged on the deck's back edge. Rotating this
 * group around its local X axis IS the hinge — the base never moves.
 */
export const Lid = forwardRef<
  Group,
  {
    screenRef: React.Ref<Group>;
    progress: React.RefObject<number>;
    stage: React.RefObject<number>;
  }
>(function Lid({ screenRef, progress, stage }, ref) {
  const { W, H, T, D, LID_T } = DEVICE;
  return (
    <group ref={ref} position={[0, T + LID_T / 2 + 0.03, -D / 2 + LID_T / 2]}>
      <RoundedBox args={[W, LID_T, H]} radius={0.18} smoothness={5} position={[0, 0, H / 2]} castShadow>
        <meshPhysicalMaterial {...ALUMINIUM} />
      </RoundedBox>

      {/* machined chamfer along the lid's front edge — catches one bright line */}
      <mesh position={[0, -LID_T / 2 + 0.02, H - 0.05]} rotation={[Math.PI / 4, 0, 0]}>
        <boxGeometry args={[W - 0.9, 0.1, 0.1]} />
        <meshPhysicalMaterial {...ALUMINIUM} roughness={0.18} />
      </mesh>

      {/* inner bezel frame */}
      <mesh position={[0, -LID_T / 2 - 0.004, H / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.06, H - 0.06]} />
        <meshStandardMaterial {...ALUMINIUM_DARK} roughness={0.55} />
      </mesh>

      <LidLogo />
      <Screen ref={screenRef} progress={progress} stage={stage} />
    </group>
  );
});
