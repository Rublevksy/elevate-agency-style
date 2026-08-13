import { RoundedBox } from "@react-three/drei";
import { DEVICE } from "../constants";
import { Keyboard } from "./Keyboard";
import { ALUMINIUM } from "./materials";

/** The deck: unibody aluminium base with the keyboard well and trackpad. */
export function Base() {
  const { W, D, T } = DEVICE;
  return (
    <group>
      <RoundedBox args={[W, T, D]} radius={0.28} smoothness={5} position={[0, T / 2, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...ALUMINIUM} />
      </RoundedBox>

      {/* front lip cut — reads as the thin opening edge */}
      <mesh position={[0, T - 0.02, D / 2 - 0.02]}>
        <boxGeometry args={[W * 0.28, 0.06, 0.35]} />
        <meshStandardMaterial color="#101317" roughness={0.7} />
      </mesh>

      <Keyboard />
    </group>
  );
}
