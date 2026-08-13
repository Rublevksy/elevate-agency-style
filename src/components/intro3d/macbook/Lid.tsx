import { forwardRef } from "react";
import { RoundedBox } from "@react-three/drei";
import type { Group } from "three";
import { DEVICE } from "../constants";
import { Screen } from "./Screen";
import { LidLogo } from "./Logo";
import { ALUMINIUM } from "./materials";

/**
 * The lid: an independent body hinged on the deck's back edge. Rotating this
 * group around its local X axis IS the hinge — the base never moves.
 */
export const Lid = forwardRef<
  Group,
  { screenRef: React.Ref<Group>; progress: React.RefObject<number> }
>(function Lid({ screenRef, progress }, ref) {
  const { W, H, T, D, LID_T } = DEVICE;
  return (
    <group ref={ref} position={[0, T + LID_T / 2 + 0.03, -D / 2 + LID_T / 2]}>
      <RoundedBox args={[W, LID_T, H]} radius={0.18} smoothness={5} position={[0, 0, H / 2]} castShadow>
        <meshPhysicalMaterial {...ALUMINIUM} />
      </RoundedBox>
      <LidLogo />
      <Screen ref={screenRef} progress={progress} />
    </group>
  );
});
