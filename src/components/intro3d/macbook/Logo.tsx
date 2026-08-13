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
    <mesh position={[0, DEVICE.LID_T / 2 + 0.004, DEVICE.H * 0.5]} rotation={[-Math.PI / 2, 0, Math.PI]}>
      <planeGeometry args={[w, w * 0.2174]} />
      <meshStandardMaterial map={tex} transparent depthWrite={false} color="#c9d6e8" metalness={0.6} roughness={0.35} />
    </mesh>
  );
}
