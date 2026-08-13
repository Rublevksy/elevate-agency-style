import { useTexture } from "@react-three/drei";
import logoUrl from "@/assets/elevate-logo.png";
import { DEVICE } from "../constants";

/**
 * ELEVATE mark on the lid's outer shell — the existing brand asset, treated as
 * a machined inlay: a slightly darker etched pass underneath and a brushed
 * metal pass on top, so it reads as part of the aluminium rather than a sticker
 * or a neon decal. Visible with the lid closed.
 */
export function LidLogo() {
  const tex = useTexture(logoUrl);
  const w = DEVICE.W * 0.2;
  const h = w * 0.2174;
  const z = DEVICE.H * 0.5;

  return (
    <group position={[0, DEVICE.LID_T / 2 + 0.006, z]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* etched recess — a touch darker than the shell */}
      <mesh>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial map={tex} transparent opacity={0.55} color="#14171c" depthWrite={false} />
      </mesh>
      {/* polished inlay catching the key light */}
      <mesh position={[0, 0, 0.004]}>
        <meshStandardMaterial
          alphaMap={tex}
          transparent
          color="#8f9dae"
          metalness={0.95}
          roughness={0.28}
          envMapIntensity={1.4}
          depthWrite={false}
        />
        <planeGeometry args={[w, h]} />
      </mesh>
    </group>
  );
}
