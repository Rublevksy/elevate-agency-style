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
    const scale = 2.5 / Math.max(size.x, 1e-6);

    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.frustumCulled = false;
      const list = (
        Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      ) as THREE.MeshStandardMaterial[];
      mesh.geometry.computeBoundingBox();
      const b = mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld);
      const c = b.getCenter(new THREE.Vector3());
      const s = b.getSize(new THREE.Vector3());
      const isLidFace =
        c.y > center.y && c.z < center.z && s.x > size.x * 0.7 && Math.hypot(s.y, s.z) > size.y * 0.6;

      for (const m of list) {
        if (!m || !("metalness" in m)) continue;
        if (isLidFace) {
          // black out the baked wallpaper — the live DOM screen sits in front
          m.map = null;
          m.color = new THREE.Color("#04060d");
          m.metalness = 0.2;
          m.roughness = 0.28;
          if ("emissive" in m) m.emissive = new THREE.Color("#000000");
        } else if (m.metalness > 0.35) {
          // Space Black aluminium
          m.color = new THREE.Color("#242830");
          m.metalness = 0.92;
          m.roughness = 0.36;
        }
        m.needsUpdate = true;
      }
    });

    return { root, scale, center };
  }, [scene]);

  const { root, scale, center } = built;

  return (
    <group scale={scale}>
      <group position={[-center.x, -center.y, -center.z]}>
        <primitive object={root} />
      </group>
    </group>
  );
}

/**
 * The hero device: the real MacBook GLB, studio-lit, with the live DOM
 * interface mapped onto the display. Pointer/scroll motion is applied by the
 * parent layer (transform only), so this canvas never re-renders on scroll.
 */
export default function Laptop3D() {
  return (
    <Canvas
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      camera={{ fov: 24, position: [0, 0.5, 6.4] }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.3} />
      <directionalLight position={[-3, 4, 5]} intensity={1.2} color="#cfe0ff" />
      <directionalLight position={[4, 2, -3]} intensity={2.6} color="#2f7bff" />
      <directionalLight position={[-4, 1, -3]} intensity={1.6} color="#3b82f6" />
      <spotLight position={[0, 5, 3]} angle={0.7} penumbra={1} intensity={1.1} color="#ffffff" />
      <Suspense fallback={null}>
        <Model />
        <Environment preset="night" environmentIntensity={0.45} />
      </Suspense>
    </Canvas>
  );
}
