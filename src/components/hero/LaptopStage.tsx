import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import glb from "@/assets/macbook-pro-14-m5.glb.asset.json";
import { prefersReducedMotion } from "@/lib/raf";

/**
 * The MacBook layer — its own WebGL layer above the light canvas.
 *
 * The GLB's lid subtree is re-parented into a pivot at the hinge, so the lid
 * genuinely rotates open as the scroll progress advances (continuous, fully
 * reversible, no asset swapping). The whole device also yaws from a rear 3/4
 * angle towards the viewer while the screen light comes up.
 */

const LID_NODE = "EhCmdLAMoLoXcIA";
const HINGE_Y = -11.045;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function Macbook({ progress }: { progress: { current: number } }) {
  const { scene } = useGLTF(glb.url);
  const group = useRef<THREE.Group>(null);
  const pivot = useRef<THREE.Group | null>(null);
  const glow = useRef<THREE.Mesh>(null);
  const reduced = prefersReducedMotion();

  const model = useMemo(() => {
    const root = scene.clone(true);
    const lid = root.getObjectByName(LID_NODE);
    if (lid && lid.parent) {
      const p = new THREE.Group();
      p.name = "lid-pivot";
      p.position.set(0, HINGE_Y, 0);
      lid.parent.add(p);
      lid.position.y -= HINGE_Y;
      p.add(lid);
      pivot.current = p;

      // screen light: a soft emissive panel just in front of the display
      const panel = new THREE.Mesh(
        new THREE.PlaneGeometry(29.5, 20),
        new THREE.MeshBasicMaterial({
          color: new THREE.Color("#1f6dff"),
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      panel.position.set(0, 10.1, 0.75);
      p.add(panel);
      (p as THREE.Group & { userData: { panel?: THREE.Mesh } }).userData.panel = panel;
    }
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
      const list = Array.isArray(mat) ? mat : [mat];
      for (const m of list) {
        if (!m || !("roughness" in m)) continue;
        m.envMapIntensity = 0.5;
        m.roughness = Math.min(1, (m.roughness ?? 0.5) * 0.85 + 0.1);
      }
    });
    return root;
  }, [scene]);

  useFrame((_, delta) => {
    const p = reduced ? 0.55 : clamp01(progress.current);
    const e = ease(p);
    const g = group.current;
    if (g) {
      // rear 3/4 → almost front, with a small lift and grow
      g.rotation.y = lerp(THREE.MathUtils.degToRad(212), THREE.MathUtils.degToRad(-8), e);
      g.rotation.x = lerp(-0.06, 0.02, e);
      g.position.x = lerp(0.55, -0.1, e);
      g.position.y = lerp(-0.72, -0.34, e);
      g.position.z = lerp(0, 1.5, e);
      const s = lerp(0.92, 1.16, e);
      g.scale.setScalar(s);
    }
    const pv = pivot.current;
    if (pv) {
      // -PI/2 = fully closed, +0.28 = comfortably open
      pv.rotation.x = lerp(-Math.PI / 2 + 0.11, 0.28, ease(clamp01(p / 0.85)));
      const panel = (pv as THREE.Group & { userData: { panel?: THREE.Mesh } }).userData.panel;
      if (panel) {
        const mat = panel.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.06 + 0.3 * ease(clamp01((p - 0.25) / 0.6));
      }
    }
    if (glow.current) {
      const mat = glow.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.1 + 0.12 * Math.sin(performance.now() / 2600);
    }
    void delta;
  });

  return (
    <group ref={group} position={[0.55, -0.72, 0]}>
      <primitive object={model} scale={9.4} />
      {/* contact shadow directly under the device */}
      <mesh ref={glow} rotation-x={-Math.PI / 2} position={[0, -0.01, 0.1]}>
        <circleGeometry args={[2.1, 48]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.85} />
      </mesh>
    </group>
  );
}

export default function LaptopStage({ progress }: { progress: { current: number } }) {
  const dpr = typeof window !== "undefined" && window.innerWidth < 820 ? ([1, 1.2] as [number, number]) : ([1, 1.6] as [number, number]);
  return (
    <Canvas
      dpr={dpr}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ position: [0, 0.9, 9.2], fov: 26 }}
      frameloop={prefersReducedMotion() ? "demand" : "always"}
      style={{ pointerEvents: "none" }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#02050a", 11, 22]} />
      <ambientLight intensity={0.18} />
      {/* cool key from the light streams behind the device */}
      <directionalLight position={[-6, 4, -5]} intensity={2.6} color="#7fb4ff" />
      {/* blue rim tracing the top edge */}
      <spotLight position={[4, 6, -3]} angle={0.8} penumbra={1} intensity={9} color="#2f7bff" />
      {/* soft fill from the front so the shell reads without washing out */}
      <directionalLight position={[3, 2, 7]} intensity={0.5} color="#cfe2ff" />
      <Macbook progress={progress} />
    </Canvas>
  );
}

useGLTF.preload(glb.url);
