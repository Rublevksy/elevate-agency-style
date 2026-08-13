import { forwardRef, useLayoutEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import glb from "@/assets/macbook-pro-14-m5.glb.asset.json";
import { Screen } from "./Screen";
import { measureMacbook } from "./glbParts";

const MODEL_URL = glb.url;

/**
 * The real product: the supplied MacBook Pro 14" GLB, measured at load time.
 *
 * BASE and LID are the model's own groups, kept independent. The lid is hung on
 * a pivot placed on the GLB's real hinge barrel, pre-rotated by the angle the
 * model was authored at, so the existing cinematic can keep driving `lidRef`
 * with DEVICE.LID_CLOSED_DEG → DEVICE.LID_OPEN_DEG and nothing else changes.
 *
 * The display panel from the GLB is dimmed and the live ELEVATE interface is
 * rendered on the same plane, so the screen content stays real HTML.
 */
export const MacBook3D = forwardRef<
  Group,
  {
    lidRef: React.Ref<Group>;
    screenRef: React.Ref<Group>;
    /** master timeline — drives the interface inside the display */
    progress: React.RefObject<number>;
    /** device timeline — drives hinge, screen light and handoff */
    stage: React.RefObject<number>;
  }
>(function MacBook3D({ lidRef, screenRef, progress, stage }, ref) {
  const { scene } = useGLTF(MODEL_URL);
  const parts = useMemo(() => measureMacbook(scene), [scene]);

  // the GLB ships a baked wallpaper on the display; the live interface replaces
  // it, so the panel itself becomes plain black glass
  useLayoutEffect(() => {
    const panel = parts.panel as Mesh;
    panel.traverse((o) => {
      const m = (o as Mesh).material as MeshStandardMaterial | undefined;
      if (!m || Array.isArray(m)) return;
      const clone = m.clone();
      clone.emissiveIntensity = 0;
      clone.color?.set("#05070a");
      (o as Mesh).material = clone;
    });
  }, [parts]);

  const { quaternion: q, scale: s, hinge, screenOffset, screenTilt, openDeg, offset } = parts;

  return (
    <group ref={ref} position={offset}>
      {/* base / top case — stays perfectly still */}
      <primitive object={parts.base} quaternion={q} scale={s} />

      {/* real hinge: the pivot sits on the model's hinge axis and carries the
          GLB's authored open angle, so lidRef sees 0° = closed */}
      <group position={hinge} rotation={[(openDeg * Math.PI) / 180, 0, 0]}>
        <group ref={lidRef}>
          <primitive
            object={parts.lid}
            quaternion={q}
            scale={s}
            position={[-hinge.x, -hinge.y, -hinge.z]}
          />

          {/* the display surface: independent, live HTML, camera entry anchor */}
          <group position={screenOffset} rotation={[-screenTilt, 0, 0]}>
            <group position={[0, 0, 0.06]}>
              <Screen ref={screenRef} progress={progress} stage={stage} w={parts.screenW} h={parts.screenH} />
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

useGLTF.preload(MODEL_URL);
