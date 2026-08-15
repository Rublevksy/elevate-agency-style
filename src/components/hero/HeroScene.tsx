import { useEffect, useMemo, useRef, type RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Html, Lightformer, useGLTF } from "@react-three/drei";
import * as THREE from "three";

import glb from "@/assets/macbook-pro-14-m5.glb.asset.json";
import { ScreenUI } from "./ScreenUI";
import { RibbonField } from "./RibbonField";
import { clamp01, easeFilm, range } from "@/lib/film";

/**
 * THE HERO SET — the real MacBook Pro 14" GLB as a product shot, suspended in a
 * near-black volume with luminous ribbons sweeping behind it and a restrained
 * glossy spill on the ground. One canvas, one render loop, no post-processing.
 *
 * The ELEVATE interface is a DOM plane placed exactly on the display quad of the
 * model, so the screen shows the real design at native sharpness.
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

/** soft radial texture reused for the ground spill and the aperture bloom */
function useGlowTexture() {
  return useMemo(() => {
    const size = 128;
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(150,195,255,0.42)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(c);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Device({
  progress,
  pointer,
  shift,
}: {
  progress: RefObject<number>;
  pointer: { x: number; y: number };
  shift: number;
}) {
  const { scene } = useGLTF(glb.url);
  const group = useRef<THREE.Group>(null);
  const camera = useThree((s) => s.camera);
  const smooth = useRef({ x: 0, y: 0 });
  const aperture = useRef<THREE.Mesh>(null);
  const glow = useGlowTexture();

  const model = useMemo(() => {
    const root = scene.clone(true);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const list = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      list.forEach((raw) => {
        const m = raw as THREE.MeshStandardMaterial;
        if (!m || !("envMapIntensity" in m)) return;
        m.envMapIntensity = 1.45;
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
    const open = easeFilm(range(0.34, 0.8, hp));

    smooth.current.x += (pointer.x - smooth.current.x) * 0.06;
    smooth.current.y += (pointer.y - smooth.current.y) * 0.06;
    const damp = 1 - approach;

    if (group.current) {
      const g = group.current;
      g.rotation.y = (-0.34 + settle * 0.28 + smooth.current.x * 0.1 * damp) * damp;
      g.rotation.x = -smooth.current.y * 0.03 * damp;
      g.position.y = -0.045 + settle * 0.008;
    }

    if (aperture.current) {
      const m = aperture.current.material as THREE.MeshBasicMaterial;
      m.opacity = open * 0.85;
      const s = 0.22 + open * 0.95;
      aperture.current.scale.set(s, s * 0.8, 1);
    }

    // camera pushes in on the display, then travels through the glass
    const z = 1.34 - approach * 0.68 - pass * 0.62;
    const y = 0.24 - approach * 0.1 - pass * 0.03;
    const x = shift * (1 - approach) + smooth.current.x * 0.04 * damp;
    camera.position.set(x, y, z);
    camera.lookAt(shift * 0.62 * (1 - approach), 0.1 + approach * 0.008, -0.08);
    camera.updateProjectionMatrix();
  });

  return (
    <group ref={group} position={[0, -0.045, 0]}>
      <primitive object={model} />

      {/* the aperture: light gathering behind the display, fed by the ribbons */}
      <mesh ref={aperture} position={[SCREEN.x, SCREEN.y + 0.01, SCREEN.z - 0.03]} rotation={[SCREEN.tilt, 0, 0]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={glow}
          transparent
          opacity={0}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          color="#8fbcff"
        />
      </mesh>

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

      {/* restrained glossy ground: reflected light spill, no visible platform */}
      <mesh position={[0, -0.0094, -0.02]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 1.1]} />
        <meshBasicMaterial
          map={glow}
          transparent
          opacity={0.3}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          toneMapped={false}
          color="#3f7fe0"
        />
      </mesh>

      <ContactShadows
        position={[0, -0.0092, -0.03]}
        opacity={0.78}
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
  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

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
        dpr={[1, mobile ? 1.4 : 1.7]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 26, position: [0, 0.24, 1.34], near: 0.02, far: 12 }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.05;
        }}
      >
        {/* studio light rig — soft key, cool fill, tight ELEVATE-blue rim */}
        <ambientLight intensity={0.14} />
        <directionalLight position={[0.5, 1.0, 0.6]} intensity={1.75} color="#e6eeff" />
        <directionalLight position={[-0.8, 0.5, -0.5]} intensity={0.85} color="#4b8ef0" />
        <pointLight position={[0, 0.22, -0.5]} intensity={0.3} color="#2f6fd6" distance={2} />

        <Environment resolution={128}>
          <Lightformer form="rect" intensity={2.6} position={[0, 1.2, 0.6]} scale={[2, 1.2, 1]} color="#eaf1ff" />
          <Lightformer form="rect" intensity={1.1} position={[-1.4, 0.5, 0.2]} scale={[1.4, 1.4, 1]} color="#9fc0ff" />
          <Lightformer form="rect" intensity={1.5} position={[1.3, 0.4, -0.4]} scale={[1.2, 1.2, 1]} color="#3f7fe0" />
          <Lightformer form="ring" intensity={0.7} position={[0, 0.1, -1.6]} scale={2} color="#1a3d78" />
        </Environment>

        <RibbonField
          progress={progress}
          pointer={pointer}
          count={mobile ? 4 : 8}
          quality={mobile ? 0.6 : 1}
        />
        <Device progress={progress} pointer={pointer} shift={mobile ? 0 : -0.075} />
      </Canvas>
    </div>
  );
}

useGLTF.preload(glb.url);
