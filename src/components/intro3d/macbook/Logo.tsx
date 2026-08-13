import { useTexture } from "@react-three/drei";
import logoUrl from "@/assets/elevate-logo.png";
import { DEVICE } from "../constants";

/**
 * Etched ELEVATE mark on the lid's outer shell — uses the existing brand asset,
 * never a redrawn logo.
 */
export function LidLogo() {
  const tex = useTexture(logoUrl);
  const w = DEVICE.W * 0.26;
  return (
    <mesh position={[0, DEVICE.LID_T / 2 + 0.003, DEVICE.H * 0.5]} rotation={[Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, w * 0.2174]} />
      <meshPhysicalMaterial
        map={tex}
        transparent
        depthWrite={false}
        color="#9fb0c6"
        metalness={1}
        roughness={0.16}
        envMapIntensity={2.4}
        clearcoat={0.6}
        clearcoatRoughness={0.2}
      />
    </mesh>

  );
}
