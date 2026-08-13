import { forwardRef, useRef } from "react";
import { Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group, MeshBasicMaterial } from "three";
import { DEVICE, HANDOFF_START, OPEN_END, ROTATION_END, clamp01, smoothstep } from "../constants";
import { GLASS_PANEL } from "./materials";
import { ScreenInterface } from "../ScreenInterface";

const PX_PER_UNIT = 40; // drei <Html transform> maps 1 world unit to 40 CSS px

/**
 * The display: an independent surface on the lid's inner face carrying REAL
 * HTML (not a baked image), so the interface stays editable.
 * `ref` is the anchor the camera flies into.
 */
export const Screen = forwardRef<
  Group,
  {
    progress: React.RefObject<number>;
    stage: React.RefObject<number>;
    /** display size in world units — measured from the GLB when available */
    w?: number;
    h?: number;
  }
>(function Screen({ progress, stage, w, h }, ref) {
  const W = w ?? DEVICE.W - 0.16;
  const H = h ?? DEVICE.H - 0.16;
  const activeW = W - 0.9;
  const activeH = H - 1.0;
  const uiRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<MeshBasicMaterial>(null);

  // the display is dark while the lid is shut, lights up as it opens and hands
  // over to the fullscreen layer once the camera is inside it
  useFrame(() => {
    const p = stage.current ?? 0;
    // hard cut at the handoff: a crossfade would show the 3D screen and the
    // fullscreen layer at once, which reads as doubled text
    const on = p >= HANDOFF_START ? 0 : smoothstep(0.36, 0.5, p);
    if (glowRef.current) {
      glowRef.current.opacity = 0.16 * smoothstep(ROTATION_END, OPEN_END, p) * (p >= HANDOFF_START ? 0 : 1);
    }
    const el = uiRef.current;
    if (!el) return;
    const v = clamp01(on);
    el.style.opacity = String(v);
    el.style.visibility = v < 0.01 ? "hidden" : "visible";
  });

  return (
    // the group sits on the display plane; its +Z is the display normal
    <group ref={ref}>
      {/* black glass panel */}
      <mesh position={[0, 0, -0.002]}>
        <planeGeometry args={[W, H]} />
        <meshStandardMaterial {...GLASS_PANEL} />
      </mesh>

      <Html
        transform
        occlude={false}
        pointerEvents="none"
        position={[0, 0, 0.004]}
        zIndexRange={[10, 0]}
        style={{
          width: activeW * PX_PER_UNIT,
          height: activeH * PX_PER_UNIT,
          overflow: "hidden",
          userSelect: "none",
        }}
      >
        <div ref={uiRef} style={{ width: "100%", height: "100%", opacity: 0, visibility: "hidden" }}>
          <ScreenInterface progress={progress} />
        </div>
      </Html>

      {/* glass sheen over the panel — one restrained reflection */}
      <mesh position={[0, 0, 0.02]}>
        <planeGeometry args={[W, H]} />
        <meshBasicMaterial ref={glowRef} color="#9dc0ee" transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
});
