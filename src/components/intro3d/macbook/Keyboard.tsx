import { useMemo } from "react";
import { RoundedBox } from "@react-three/drei";
import { DEVICE } from "../constants";
import { KEY_CAP, TRACKPAD } from "./materials";

/**
 * Deck keyboard: a milled well, individual key caps and the trackpad.
 * Stays attached to the base, never to the lid.
 */
export function Keyboard() {
  const { W, D, T } = DEVICE;

  const wellW = W * 0.845;
  const wellD = D * 0.4;
  const wellZ = -D / 2 + wellD / 2 + D * 0.075;

  const keys = useMemo(() => {
    const rows = [14, 14, 14, 13, 12, 9];
    const gap = 0.11;
    const rowH = (wellD - gap * (rows.length + 1)) / rows.length;
    const out: { x: number; z: number; w: number; d: number }[] = [];
    rows.forEach((count, r) => {
      const z = wellZ - wellD / 2 + gap + rowH / 2 + r * (rowH + gap);
      const keyW = (wellW - gap * (count + 1)) / count;
      for (let c = 0; c < count; c++) {
        const x = -wellW / 2 + gap + keyW / 2 + c * (keyW + gap);
        out.push({ x, z, w: keyW, d: rowH * (r === 0 ? 0.62 : 1) });
      }
    });
    return out;
  }, [wellW, wellD, wellZ]);

  return (
    <group>
      {/* keyboard well */}
      <mesh position={[0, T - 0.06, wellZ]} receiveShadow>
        <boxGeometry args={[wellW + 0.5, 0.14, wellD + 0.5]} />
        <meshStandardMaterial color="#0a0c0f" roughness={0.85} metalness={0.2} />
      </mesh>

      {keys.map((k, i) => (
        <RoundedBox
          key={i}
          args={[k.w, 0.16, k.d]}
          radius={0.035}
          smoothness={2}
          position={[k.x, T + 0.03, k.z]}
        >
          <meshStandardMaterial {...KEY_CAP} />
        </RoundedBox>
      ))}

      {/* trackpad */}
      <mesh position={[0, T + 0.002, D * 0.21]}>
        <boxGeometry args={[W * 0.4, 0.03, D * 0.29]} />
        <meshStandardMaterial {...TRACKPAD} />
      </mesh>
    </group>
  );
}
