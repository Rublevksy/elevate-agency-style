import { useMemo } from "react";
import { DEVICE } from "../constants";
import { Keyboard } from "./Keyboard";
import { chamferedSlab, grillAlphaMap } from "./geometry";
import {
  ALUMINIUM,
  ALUMINIUM_DARK,
  ALUMINIUM_MATTE,
  ANODISED_BLACK,
  useMicroSurface,
} from "./materials";

/**
 * The deck: a single milled unibody. The chassis itself is an extruded
 * rounded-rectangle profile with a bevel, so every corner is genuinely round
 * and every top/bottom edge carries a machined chamfer — no boxes.
 *
 * Product detail: perforated speaker grills, milled port cavities with real
 * depth, the rear exhaust, the front opening notch, a recessed bottom panel
 * and four rubber feet.
 */
export function Base() {
  const { W, D, T } = DEVICE;
  const micro = useMicroSurface();

  const shell = useMemo(
    () => chamferedSlab({ w: W, h: D, thickness: T, corner: 1.05, chamfer: 0.11 }),
    [W, D, T],
  );
  const bottom = useMemo(
    () => chamferedSlab({ w: W - 0.5, h: D - 0.5, thickness: 0.14, corner: 0.85, chamfer: 0.05 }),
    [W, D],
  );
  const grill = useMemo(() => grillAlphaMap(110, 9), []);

  /** milled port cavity: a dark recess with an inner lip, not a painted line */
  const port = (
    key: string,
    side: -1 | 1,
    z: number,
    width: number,
    height: number,
  ) => (
    <group key={key} position={[side * (W / 2 - 0.06), T * 0.52, z]}>
      <mesh position={[side * 0.03, 0, 0]}>
        <boxGeometry args={[0.2, height, width]} />
        <meshStandardMaterial {...ANODISED_BLACK} />
      </mesh>
      <mesh position={[side * -0.07, 0, 0]}>
        <boxGeometry args={[0.05, height + 0.05, width + 0.06]} />
        <meshStandardMaterial {...ALUMINIUM_DARK} roughness={0.3} />
      </mesh>
    </group>
  );

  return (
    <group>
      {/* unibody deck */}
      <mesh geometry={shell} rotation={[-Math.PI / 2, 0, 0]} position={[0, T / 2, 0]} castShadow receiveShadow>
        <meshPhysicalMaterial {...ALUMINIUM} {...micro} />
      </mesh>

      {/* recessed bottom panel — visible on the low-angle and edge views */}
      <mesh geometry={bottom} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.045, 0]}>
        <meshStandardMaterial {...ALUMINIUM_MATTE} {...micro} />
      </mesh>

      {/* front opening notch, milled into the lip */}
      <mesh position={[0, T - 0.05, D / 2 - 0.06]}>
        <boxGeometry args={[W * 0.24, 0.11, 0.4]} />
        <meshStandardMaterial {...ANODISED_BLACK} />
      </mesh>

      {/* perforated speaker grills flanking the keyboard */}
      {[-1, 1].map((s) => (
        <group key={`sp${s}`} position={[s * W * 0.408, T - 0.008, -D * 0.075]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W * 0.055, D * 0.4]} />
            <meshStandardMaterial
              color="#04060a"
              roughness={1}
              metalness={0}
              transparent
              alphaTest={0.45}
              alphaMap={grill ?? undefined}
            />
          </mesh>
          {/* dark cavity beneath the perforation gives the holes depth */}
          <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[W * 0.055, D * 0.4]} />
            <meshStandardMaterial color="#020305" roughness={1} />
          </mesh>
        </group>
      ))}

      {/* ports: MagSafe + 2× Thunderbolt left, Thunderbolt + HDMI + SD right */}
      {port("magsafe", -1, -D * 0.3, 0.75, 0.2)}
      {port("tb1", -1, -D * 0.14, 0.95, 0.16)}
      {port("tb2", -1, D * 0.0, 0.95, 0.16)}
      {port("tb3", 1, -D * 0.3, 0.95, 0.16)}
      {port("hdmi", 1, -D * 0.13, 1.35, 0.24)}
      {port("sdxc", 1, D * 0.04, 1.25, 0.14)}
      {port("jack", 1, D * 0.2, 0.42, 0.34)}

      {/* rear exhaust slot, tucked under the hinge line */}
      <mesh position={[0, T * 0.55, -D / 2 + 0.04]}>
        <boxGeometry args={[W * 0.46, 0.13, 0.1]} />
        <meshStandardMaterial {...ANODISED_BLACK} />
      </mesh>

      {/* four rubber feet on the underside */}
      {[
        [-1, -1],
        [1, -1],
        [-1, 1],
        [1, 1],
      ].map(([sx, sz]) => (
        <mesh key={`f${sx}${sz}`} position={[sx! * W * 0.42, -0.055, sz! * D * 0.4]}>
          <cylinderGeometry args={[0.4, 0.36, 0.11, 24]} />
          <meshStandardMaterial color="#14171b" roughness={0.9} metalness={0.05} />
        </mesh>
      ))}

      <Keyboard />
    </group>
  );
}
