import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import glb from "@/assets/macbook-pro-14-m5.glb.asset.json";
import { ScreenUI } from "./ScreenUI";
import { clamp01, easeFilm, range } from "@/lib/film";

/**
 * THE DEVICE — the real MacBook Pro 14" GLB, rendered as a product shot.
 *
 * Materials, reflections and the contact shadow come from the model + a local
 * (network-free) studio environment made of lightformers. The ELEVATE interface
 * is a DOM plane placed exactly on the display quad of the model, so the screen
 * shows the real design at native sharpness.
 */

/** display quad, measured from the GLB itself (metres, model space) */
const SCREEN = {
  x: 0,
  y: 0.1053,
  z: -0.1514,
  tilt: -0.3495, // rad, lid leans back ~20°
  w: 0.3008,
  h: 0.1956,
};
/** drei <Html transform> renders 40px per world unit; keep the DOM 1200px wide */
const UI_W = 1200;
const UI_H = Math.round((UI_W * SCREEN.h) / SCREEN.w);
const UI_SCALE = SCREEN.w / (UI_W / 40);

const SERVICES_FROM = 0.26;

function Device({ progress, pointer }: { progress: RefObject<number>; pointer: { x: number; y: number } }) {
  const { scene } = useGLTF(glb.url);
  const group = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const smooth = useRef({ x: 0, y: 0 });

  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      list.forEach((raw) => {
        const m = raw as THREE.MeshStandardMaterial;
        if (!m || !("envMapIntensity" in m)) return;
        m.envMapIntensity = 1.35;
        m.toneMapped = true;
      });
    });
    // normalise the model into the measured metric space the SCREEN quad uses
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const k = 0.3117 / size.x;
    root.scale.setScalar(k);
    const box2 = new THREE.Box3().setFromObject(root);
    const c = box2.getCenter(new THREE.Vector3());
    root.position.set(-c.x, 0.0965 - c.y, -0.04 - c.z);
    const holder = new THREE.Group();
    holder.add(root);
    return holder;
  }, [scene]);


  useFrame(() => {
    const p = progress.current ?? 0;
    const hp = clamp01(p / SERVICES_FROM);
    const approach = easeFilm(range(0.2, 0.5, hp));
    const pass = easeFilm(range(0.6, 0.9, hp));
    const settle = easeFilm(range(0, 0.16, hp));

    smooth.current.x += (pointer.x - smooth.current.x) * 0.06;
    smooth.current.y += (pointer.y - smooth.current.y) * 0.06;
    const damp = 1 - approach;

    if (group.current) {
      const g = group.current;
      g.rotation.y = (-0.36 + settle * 0.3 + smooth.current.x * 0.16 * damp) * damp + 0.0;
      g.rotation.x = -smooth.current.y * 0.05 * damp;
      g.position.y = -0.045 + settle * 0.008;
    }

    // camera pushes in on the display, then travels through the glass
    const z = 3.0 - approach * 0.68 - pass * 0.62;
    const y = 0.24 - approach * 0.1 - pass * 0.03;
    camera.position.set(smooth.current.x * 0.05 * damp, y, z);
    camera.lookAt(0, 0.1 + approach * 0.008, -0.08);
    camera.updateProjectionMatrix();
    (window as any).__cam = camera.position.toArray();

  });

  return (
    <group ref={group} position={[0, -0.045, 0]}>
      <primitive object={model} />
      <Html
        transform
        center
        occlude={false}
        position={[SCREEN.x, SCREEN.y, SCREEN.z + 0.0016]}
        rotation={[SCREEN.tilt, 0, 0]}
        scale={UI_SCALE}
        zIndexRange={[10, 0]}
        style={{ pointerEvents: "none" }}
      >
        <div style={{ width: UI_W, height: UI_H, overflow: "hidden", borderRadius: 8, background: "#04070d" }}>
          <ScreenUI />
        </div>
      </Html>

      <ContactShadows
        position={[0, -0.0092, -0.03]}
        opacity={0.72}
        scale={1.1}
        blur={2.6}
        far={0.3}
        resolution={512}
        color="#000308"
      />
    </group>
  );
}

export default function Laptop3D({ progress }: { progress: RefObject<number> }) {
  const pointer = useRef({ x: 0, y: 0 }).current;

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [pointer]);

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 1.7]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 26, position: [0, 0.24, 1.34], near: 0.02, far: 12 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        {/* studio light rig — soft key, cool fill, tight ELEVATE-blue rim */}
        <ambientLight intensity={0.16} />
        <directionalLight position={[0.5, 0.9, 0.6]} intensity={1.6} color="#dfe9ff" />
        <directionalLight position={[-0.7, 0.4, -0.5]} intensity={0.7} color="#4b8ef0" />
        <pointLight position={[0, 0.22, -0.5]} intensity={0.25} color="#2f6fd6" distance={2} />

        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2.4} position={[0, 1.2, 0.6]} scale={[2, 1.2, 1]} color="#eaf1ff" />
          <Lightformer form="rect" intensity={1.1} position={[-1.4, 0.5, 0.2]} scale={[1.4, 1.4, 1]} color="#9fc0ff" />
          <Lightformer form="rect" intensity={1.4} position={[1.3, 0.4, -0.4]} scale={[1.2, 1.2, 1]} color="#3f7fe0" />
          <Lightformer form="ring" intensity={0.6} position={[0, 0.1, -1.6]} scale={2} color="#1a3d78" />
        </Environment>

        <Device progress={progress} pointer={pointer} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(glb.url);
