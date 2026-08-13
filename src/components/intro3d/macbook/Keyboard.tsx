import { useMemo } from "react";
import { DEVICE } from "../constants";
import { chamferedSlab } from "./geometry";
import { ANODISED_BLACK, KEY_CAP, TRACKPAD, useMicroSurface } from "./materials";

/**
 * Deck keyboard: a milled well, individual scissor keycaps with real chamfered
 * geometry (shared geometry, per-key scale, so 78 keys stay cheap), the
 * function row, an arrow cluster and the large precision trackpad.
 * Stays attached to the base, never to the lid.
 */
export function Keyboard() {
  const { W, D, T } = DEVICE;
  const micro = useMicroSurface();

  const wellW = W * 0.7;
  const wellD = D * 0.415;
  const wellZ = -D / 2 + wellD / 2 + D * 0.085;

  /** one shared chamfered keycap, scaled per key */
  const cap = useMemo(
    () => chamferedSlab({ w: 1, h: 1, thickness: 0.17, corner: 0.13, chamfer: 0.045, curveSegments: 4 }),
    [],
  );

  const keys = useMemo(() => {
    const gap = 0.1;
    // 6 rows: function row is half height, bottom row holds the arrow cluster
    const rowCounts = [13, 14, 14, 13, 12, 9];
    const rowH = (wellD - gap * (rowCounts.length + 1)) / (rowCounts.length - 0.45);
    const out: { x: number; z: number; w: number; d: number }[] = [];
    let z = wellZ - wellD / 2 + gap;

    rowCounts.forEach((count, r) => {
      const h = r === 0 ? rowH * 0.55 : rowH;
      const cz = z + h / 2;
      // widths per row: modifiers are wider, so distribute unevenly
      const weights = Array.from({ length: count }, (_, c) => {
        if (r === 1 && c === count - 1) return 1.9; // backspace
        if (r === 2 && c === 0) return 1.5; // tab
        if (r === 2 && c === count - 1) return 1.4;
        if (r === 3 && c === 0) return 1.75; // caps
        if (r === 3 && c === count - 1) return 2.0; // return
        if (r === 4 && (c === 0 || c === count - 1)) return 2.3; // shifts
        if (r === 5 && c === 4) return 5.2; // space
        if (r === 5 && (c === 0 || c === 1)) return 1.15;
        return 1;
      });
      const total = weights.reduce((a, b) => a + b, 0);
      const unit = (wellW - gap * (count + 1)) / total;
      let x = -wellW / 2 + gap;
      weights.forEach((wt, c) => {
        const kw = unit * wt;
        // the bottom row's last two slots are the half-height arrow cluster
        const isArrow = r === 5 && c >= count - 2;
        if (isArrow) {
          out.push({ x: x + kw / 2, z: cz - h / 4, w: kw, d: h / 2 - gap / 2 });
          out.push({ x: x + kw / 2, z: cz + h / 4, w: kw, d: h / 2 - gap / 2 });
        } else {
          out.push({ x: x + kw / 2, z: cz, w: kw, d: h });
        }
        x += kw + gap;
      });
      z += h + gap;
    });
    return out;
  }, [wellW, wellD, wellZ]);

  return (
    <group>
      {/* milled keyboard well — a real recess with an inner wall */}
      <mesh position={[0, T - 0.085, wellZ]}>
        <boxGeometry args={[wellW + 0.42, 0.16, wellD + 0.42]} />
        <meshStandardMaterial {...ANODISED_BLACK} />
      </mesh>

      {keys.map((k, i) => (
        <mesh
          key={i}
          geometry={cap}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[k.x, T + 0.015, k.z]}
          scale={[k.w, k.d, 1]}
        >
          <meshStandardMaterial {...KEY_CAP} {...micro} />
        </mesh>
      ))}

      {/* trackpad: glass, inset with a fine machined border */}
      <mesh position={[0, T - 0.012, D * 0.225]}>
        <boxGeometry args={[W * 0.395, 0.06, D * 0.275]} />
        <meshStandardMaterial color="#0e1115" roughness={0.6} metalness={0.3} />
      </mesh>
      <mesh position={[0, T + 0.008, D * 0.225]}>
        <boxGeometry args={[W * 0.385, 0.03, D * 0.265]} />
        <meshPhysicalMaterial {...TRACKPAD} clearcoat={0.8} clearcoatRoughness={0.12} />
      </mesh>
    </group>
  );
}
