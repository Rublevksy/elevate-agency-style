import { forwardRef, useMemo } from "react";
import type { Group } from "three";
import { DEVICE } from "../constants";
import { Screen } from "./Screen";
import { LidLogo } from "./Logo";
import { chamferedFrame, chamferedSlab } from "./geometry";
import { ALUMINIUM, ALUMINIUM_DARK, ANODISED_BLACK, useMicroSurface } from "./materials";

/**
 * The lid: an independent body hinged on the deck's back edge. Rotating this
 * group around its local X axis IS the hinge — the base never moves.
 *
 * The shell is an extruded, bevelled rounded-rectangle (true chamfer + rounded
 * corners) and the display sits inside a genuinely thin milled bezel frame with
 * the camera housing at the top edge.
 */
export const Lid = forwardRef<
  Group,
  {
    screenRef: React.Ref<Group>;
    progress: React.RefObject<number>;
    stage: React.RefObject<number>;
  }
>(function Lid({ screenRef, progress, stage }, ref) {
  const { W, H, T, D, LID_T } = DEVICE;
  const micro = useMicroSurface();

  const shell = useMemo(
    () => chamferedSlab({ w: W, h: H, thickness: LID_T, corner: 0.95, chamfer: 0.075 }),
    [W, H, LID_T],
  );
  const bezel = useMemo(
    () =>
      chamferedFrame({
        w: W - 0.05,
        h: H - 0.05,
        innerW: W - 0.92,
        innerH: H - 1.05,
        thickness: 0.1,
        corner: 0.9,
        innerCorner: 0.45,
      }),
    [W, H],
  );

  return (
    <group ref={ref} position={[0, T + LID_T / 2 + 0.03, -D / 2 + LID_T / 2]}>
      {/* outer shell */}
      <mesh geometry={shell} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, H / 2]} castShadow>
        <meshPhysicalMaterial {...ALUMINIUM} {...micro} />
      </mesh>

      {/* black panel behind the bezel: gives the display real recessed depth */}
      <mesh position={[0, -LID_T / 2 - 0.012, H / 2]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[W - 0.05, H - 0.05]} />
        <meshStandardMaterial {...ANODISED_BLACK} roughness={0.9} />
      </mesh>

      {/* thin milled bezel frame */}
      <mesh geometry={bezel} rotation={[Math.PI / 2, 0, 0]} position={[0, -LID_T / 2 - 0.05, H / 2]}>
        <meshStandardMaterial {...ALUMINIUM_DARK} roughness={0.62} {...micro} />
      </mesh>

      {/* camera housing at the top of the display */}
      <group position={[0, -LID_T / 2 - 0.06, H - 0.32]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.11, 20]} />
          <meshStandardMaterial color="#05070a" roughness={0.35} metalness={0.5} />
        </mesh>
        <mesh position={[0, -0.008, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.05, 16]} />
          <meshStandardMaterial color="#0b1622" roughness={0.15} metalness={0.8} />
        </mesh>
      </group>

      <LidLogo />
      <Screen ref={screenRef} progress={progress} stage={stage} />
    </group>
  );
});
