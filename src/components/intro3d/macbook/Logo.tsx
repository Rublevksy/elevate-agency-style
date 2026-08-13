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
    <mesh position={[0, DEVICE.LID_T / 2 + 0.02, DEVICE.H * 0.5]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[w, w * 0.2174]} />
      <meshBasicMaterial
        map={tex}
        transparent
        opacity={0.82}
        depthWrite={false}
        color="#c8d6ea"
        toneMapped={false}
      />
    </mesh>

  );
}
