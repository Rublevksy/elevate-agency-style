import { RoundedBox } from "@react-three/drei";
import { DEVICE } from "../constants";
import { Keyboard } from "./Keyboard";
import { ALUMINIUM, ALUMINIUM_DARK } from "./materials";

/**
 * The deck: unibody aluminium base with the keyboard well, trackpad and the
 * product details that make it read as a real machine — machined side chamfers,
 * ports, the rear exhaust slot and four soft feet.
 */
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

      {/* machined chamfers along both long edges — each catches one bright line */}
      {[-1, 1].map((s) => (
        <mesh key={`ch${s}`} position={[s * (W / 2 - 0.06), T - 0.06, 0]} rotation={[0, 0, s * Math.PI / 4]}>
          <boxGeometry args={[0.09, 0.09, D - 1.1]} />
          <meshPhysicalMaterial {...ALUMINIUM} roughness={0.16} />
        </mesh>
      ))}

      {/* side ports: two USB-C left, one right — small, dark, precise */}
      {[-0.34, -0.2].map((z) => (
        <mesh key={`pl${z}`} position={[-W / 2 + 0.02, T * 0.55, z * D]}>
          <boxGeometry args={[0.08, 0.13, 0.95]} />
          <meshStandardMaterial color="#0a0c10" roughness={0.9} />
        </mesh>
      ))}
      <mesh position={[W / 2 - 0.02, T * 0.55, -D * 0.27]}>
        <boxGeometry args={[0.08, 0.13, 0.95]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.9} />
      </mesh>

      {/* rear exhaust slot, tucked under the hinge line */}
      <mesh position={[0, T * 0.55, -D / 2 + 0.03]}>
        <boxGeometry args={[W * 0.44, 0.1, 0.08]} />
        <meshStandardMaterial color="#0a0c10" roughness={0.9} />
      </mesh>

      {/* four soft feet — the underside detail that sells the product */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz]) => (
        <mesh key={`f${sx}${sz}`} position={[sx! * W * 0.42, -0.035, sz! * D * 0.4]}>
          <cylinderGeometry args={[0.42, 0.42, 0.07, 20]} />
          <meshStandardMaterial {...ALUMINIUM_DARK} roughness={0.8} metalness={0.1} />
        </mesh>
      ))}

      <Keyboard />
    </group>
  );
}
