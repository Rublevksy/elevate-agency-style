import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, MeshReflectorMaterial, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";

import glb from "@/assets/macbook-pro-14-m5.glb.asset.json";
import aMark from "@/assets/elevate-a-mark.png.asset.json";

/**
 * LAPTOP 3D — the real MacBook GLB, art-directed to the hero reference:
 * large on the right, rear lid toward the viewer at a 3/4 angle, base reaching
 * toward the centre-left, standing on a glossy black floor with a real
 * reflection and a soft contact shadow. Cool white/blue rim light rakes the
 * aluminium. Scroll gently rotates and lowers the machine.
 */

const SCROLL_SPAN = 900;

function useScrollNorm() {
  const v = useRef(0);
  useEffect(() => {
    const on = () => {
      v.current = Math.min(1, Math.max(0, window.scrollY / SCROLL_SPAN));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return v;
}

function Machine() {
  const { scene } = useGLTF(glb.url);
  const mark = useTexture(aMark.url);
  const group = useRef<THREE.Group>(null);
  const scroll = useScrollNorm();
  const pointer = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  const model = useMemo(() => {
    const s = scene.clone(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    const k = 2.6 / Math.max(size.x, size.y, size.z);
    s.scale.setScalar(k);
    s.position.set(-center.x * k, -box.min.y * k, -center.z * k);
    s.traverse((o) => {
      const m = o as THREE.Mesh;
      if (!m.isMesh) return;
      m.castShadow = true;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && "roughness" in mat) {
        mat.envMapIntensity = 1.35;
        if (mat.color && mat.color.getHSL({ h: 0, s: 0, l: 0 }).l < 0.35) {
          mat.roughness = Math.min(mat.roughness ?? 0.4, 0.42);
          mat.metalness = Math.max(mat.metalness ?? 0.6, 0.75);
        }
      }
    });
    return s;
  }, [scene]);

  useEffect(() => {
    const on = (e: PointerEvent) => {
      pointer.current.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const p = pointer.current;
    p.x += (p.tx - p.x) * 0.05;
    p.y += (p.ty - p.y) * 0.05;
    const s = scroll.current;
    g.rotation.y = -0.62 + p.x * 0.1 + s * 0.55;
    g.rotation.x = 0.02 + p.y * 0.035 - s * 0.06;
    g.position.y = -0.62 - s * 0.5;
    g.position.z = s * 1.1;
  });

  return (
    <group ref={group} position={[0, -0.62, 0]}>
      <primitive object={model} />
      {/* brand emblem on the rear of the lid */}
      <mesh position={[0, 1.42, -0.46]} rotation={[-0.06, Math.PI, 0]}>
        <planeGeometry args={[0.34, 0.34]} />
        <meshBasicMaterial map={mark} transparent opacity={0.92} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Stage() {
  return (
    <>
      <color attach="background" args={["#000103"]} />
      <ambientLight intensity={0.16} />
      {/* cool key from upper-left */}
      <directionalLight position={[-4.5, 5.5, 2.5]} intensity={2.6} color="#cfe4ff" castShadow />
      {/* electric blue rim from behind-right */}
      <spotLight position={[5.5, 3.2, -4.5]} angle={0.7} penumbra={1} intensity={40} color="#5aa2ff" />
      {/* white rim raking the lid edge */}
      <spotLight position={[-2.5, 1.4, -5]} angle={0.9} penumbra={1} intensity={26} color="#ffffff" />
      <pointLight position={[1.6, 0.4, 3.2]} intensity={6} color="#7db4ff" />
      <Environment preset="night" environmentIntensity={0.5} />

      <Suspense fallback={null}>
        <Machine />
      </Suspense>

      {/* glossy black floor with a real mirror reflection */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.63, 0]}>
        <planeGeometry args={[42, 42]} />
        <MeshReflectorMaterial
          resolution={1024}
          mixBlur={0.9}
          mixStrength={26}
          blur={[320, 90]}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.3}
          color="#04070d"
          metalness={0.85}
          roughness={0.72}
          mirror={0.62}
        />
      </mesh>
      <ContactShadows position={[0, -0.615, 0]} opacity={0.85} scale={12} blur={2.6} far={4} color="#000000" />
    </>
  );
}

export default function Laptop3D() {
  return (
    <Canvas
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      shadows
      camera={{ position: [0.2, 1.1, 5.4], fov: 30 }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping;
        gl.toneMappingExposure = 1.05;
      }}
      className="!absolute inset-0"
    >
      <Stage />
    </Canvas>
  );
}

useGLTF.preload(glb.url);
