import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import glbAsset from "@/assets/macbook-pro-14-m5.glb.asset.json";

useGLTF.preload(glbAsset.url);

function Model() {
  const { scene } = useGLTF(glbAsset.url);

  const built = useMemo(() => {
    const root = scene.clone(true);
    root.updateMatrixWorld(true);

    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 2.6 / Math.max(size.x, 1e-6);

    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      const list = (
        Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      ) as THREE.MeshStandardMaterial[];
      for (const m of list) {
        if (!m || !("metalness" in m)) continue;
        if (m.metalness > 0.35) {
          // Space Black aluminium
          m.color = new THREE.Color("#1e222a");
          m.metalness = 0.9;
          m.roughness = 0.34;
        }
        m.needsUpdate = true;
      }
    });

    return { root, scale, center };
  }, [scene]);

  const { root, scale, center } = built;

  return (
    // strong 3/4 rear angle, as in the reference art direction
    <group scale={scale} rotation={[0.06, Math.PI * 0.78, 0]}>
      <group position={[-center.x, -center.y, -center.z]}>
        <primitive object={root} />
      </group>
    </group>
  );
}

/**
 * The hero device: the real MacBook GLB, studio-lit with a blue rim light,
 * seen from a 3/4 rear angle. Pointer/scroll motion lives on the parent layer
 * (transform only) so this canvas never re-renders on scroll.
 */
export default function Laptop3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 26, position: [0, 0.85, 6.2] }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.24} />
      {/* key */}
      <directionalLight position={[-3, 4, 5]} intensity={1.1} color="#cfe0ff" />
      {/* blue rim from behind, matching the ribbon field */}
      <directionalLight position={[4, 1.5, -3.5]} intensity={3.2} color="#2f7bff" />
      <directionalLight position={[-4.5, 0.8, -3]} intensity={1.9} color="#3b82f6" />
      <spotLight position={[0, 5, 2]} angle={0.75} penumbra={1} intensity={1} color="#ffffff" />
      <Suspense fallback={null}>
        <Model />
        <Environment preset="night" environmentIntensity={0.4} />
      </Suspense>
    </Canvas>
  );
}
