import { forwardRef, useLayoutEffect, useMemo, useRef } from "react";
import { Html, useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh, MeshStandardMaterial } from "three";
import { MathUtils } from "three";
import glb from "@/assets/macbook-pro-14-m5.glb.asset.json";
import mark from "@/assets/elevate-logo.png";
import { ScreenSite } from "./ScreenSite";
import { measureMacbook } from "./glbParts";
import { DEVICE, PHASE, clamp01, range, smoothstep } from "./film";

const MODEL_URL = glb.url;
const PX_PER_UNIT = 44; // drei <Html transform>: 1 world unit → CSS px

/**
 * The physical product: the supplied MacBook Pro 14" GLB, measured at load
 * time and presented OPEN at ~100°, which is the better composition — the
 * display is readable from the first frame.
 *
 * The GLB's baked wallpaper is replaced by the real ELEVATE interface rendered
 * as HTML on the display plane. Chassis density yields as the camera enters the
 * display, so nothing ever cuts.
 */
export const Laptop = forwardRef<
  Group,
  { progress: React.RefObject<number>; screenRef: React.Ref<Group>; mobile: boolean }
>(function Laptop({ progress, screenRef, mobile }, ref) {
  const { scene } = useGLTF(MODEL_URL);
  const parts = useMemo(() => measureMacbook(scene), [scene]);
  const logoTex = useTexture(mark);
  const lidRef = useRef<Group>(null);
  const rootRef = useRef<Group>(null);
  const uiRef = useRef<HTMLDivElement>(null);

  // graphite aluminium + true black glass, tuned for product-photography reads
  useLayoutEffect(() => {
    (parts.panel as Mesh).traverse((o) => {
      const m = (o as Mesh).material as MeshStandardMaterial | undefined;
      if (!m || Array.isArray(m)) return;
      const c = m.clone();
      c.emissiveIntensity = 0;
      c.color?.set("#04060a");
      c.roughness = 0.14;
      c.metalness = 0.2;
      (o as Mesh).material = c;
    });
    for (const part of [parts.base, parts.lid]) {
      part.traverse((o) => {
        const m = (o as Mesh).material as MeshStandardMaterial | undefined;
        if (!m || Array.isArray(m) || !m.color) return;
        const c = m.clone();
        // keep the model's own texturing; only refine the metal response
        if (c.metalness > 0.2) {
          c.roughness = Math.min(0.42, Math.max(0.2, c.roughness));
          c.metalness = 0.92;
          c.envMapIntensity = 1.5;
        }
        (o as Mesh).material = c;
      });
    }
  }, [parts]);

  useFrame(() => {
    const p = progress.current ?? 0;
    // the display is live from the first frame and hands over at HANDOFF
    const el = uiRef.current;
    if (el) {
      const v = p >= PHASE.HANDOFF ? 0 : 1;
      el.style.opacity = String(v);
      el.style.visibility = v < 0.5 ? "hidden" : "visible";
    }
    // the chassis around the lens loses density as the camera passes it
    const density = 1 - smoothstep(PHASE.ENTER + 0.12, PHASE.HANDOFF, p);
    const root = rootRef.current;
    if (root) {
      root.traverse((o) => {
        const m = (o as Mesh).material as MeshStandardMaterial | undefined;
        if (!m || Array.isArray(m) || typeof m.opacity !== "number") return;
        m.transparent = true;
        m.opacity = density;
      });
    }
    // an almost imperceptible settle of the hinge during the reveal — the
    // device stays stable, the camera does the acting
    if (lidRef.current) {
      const settle = clamp01(range(0, PHASE.PRODUCTS_IN, p));
      lidRef.current.rotation.x = MathUtils.degToRad(DEVICE.LID_OPEN_DEG - 4 + settle * 4);
    }
  });

  const { quaternion: q, scale: s, hinge, screenOffset, screenTilt, openDeg, offset } = parts;
  const W = parts.screenW;
  const H = parts.screenH;
  const activeW = W - 0.85;
  const activeH = H - 0.95;

  return (
    <group ref={ref} position={offset}>
      <group ref={rootRef}>
        {/* base / top case — perfectly still */}
        <primitive object={parts.base} quaternion={q} scale={s} />

        {/* real hinge axis, carrying the GLB's authored open angle */}
        <group position={hinge} rotation={[(openDeg * Math.PI) / 180, 0, 0]}>
          <group ref={lidRef}>
            <primitive object={parts.lid} quaternion={q} scale={s} position={[-hinge.x, -hinge.y, -hinge.z]} />

            <group position={screenOffset} rotation={[-screenTilt, 0, 0]}>
              {/* ELEVATE mark, etched into the aluminium of the lid back */}
              <mesh position={[0, 0, -0.42]} rotation={[0, Math.PI, 0]}>
                <planeGeometry args={[W * 0.13, W * 0.13]} />
                <meshStandardMaterial
                  map={logoTex}
                  transparent
                  opacity={0.5}
                  color="#c9d4e4"
                  metalness={0.9}
                  roughness={0.36}
                  depthWrite={false}
                />
              </mesh>

              {/* the display: real HTML on the panel plane, camera entry anchor */}
              <group ref={screenRef} position={[0, 0, 0.06]}>
                <Html
                  transform
                  occlude={false}
                  pointerEvents="none"
                  position={[0, 0, 0.004]}
                  zIndexRange={[10, 0]}
                  distanceFactor={undefined}
                  style={{
                    width: activeW * PX_PER_UNIT,
                    height: activeH * PX_PER_UNIT,
                    overflow: "hidden",
                    userSelect: "none",
                  }}
                >
                  <div ref={uiRef} style={{ width: "100%", height: "100%" }}>
                    <ScreenSite />
                  </div>
                </Html>

                {/* one restrained glass reflection across the panel */}
                {!mobile && (
                  <mesh position={[0, 0, 0.03]}>
                    <planeGeometry args={[W, H]} />
                    <meshBasicMaterial color="#8fb4ea" transparent opacity={0.045} depthWrite={false} />
                  </mesh>
                )}
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

useGLTF.preload(MODEL_URL);
