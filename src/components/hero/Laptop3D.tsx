import { Suspense, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import glbAsset from "@/assets/macbook-pro-14-m5.glb.asset.json";
import { ScreenUI } from "./ScreenUI";

useGLTF.preload(glbAsset.url);

/** Finds the display panel of the model: the widest, thinnest mesh in the lid. */
function findScreen(root: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(root);
  const center = box.getCenter(new THREE.Vector3());
  let best: { mesh: THREE.Mesh; size: THREE.Vector3; center: THREE.Vector3; area: number } | null =
    null;

  root.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh || !mesh.geometry) return;
    mesh.geometry.computeBoundingBox();
    const b = mesh.geometry.boundingBox!.clone().applyMatrix4(mesh.matrixWorld);
    const size = b.getSize(new THREE.Vector3());
    const c = b.getCenter(new THREE.Vector3());
    const dims = [size.x, size.y, size.z].sort((a, z) => z - a);
    const area = dims[0] * dims[1];
    const thin = dims[2] / Math.max(dims[0], 1e-6);
    if (thin > 0.06) return; // must be a flat panel
    if (c.y < center.y) return; // must sit in the upper half (the lid)
    if (!best || area > best.area) best = { mesh, size, center: c, area };
  });
  return best;
}

function Model() {
  const { scene } = useGLTF(glbAsset.url);

  const prepared = useMemo(() => {
    const root = scene.clone(true);
    root.updateMatrixWorld(true);

    // normalize: centre at origin, scale to a stable width
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = 2.6 / Math.max(size.x, 1e-6);

    const screen = findScreen(root);

    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      const mat = mesh.material as THREE.MeshStandardMaterial | THREE.MeshStandardMaterial[];
      const list = Array.isArray(mat) ? mat : [mat];
      for (const m of list) {
        if (!m || !("metalness" in m)) continue;
        // Space Black aluminium
        if (m.metalness > 0.4) {
          m.color = new THREE.Color("#22262e");
          m.metalness = 0.95;
          m.roughness = 0.34;
        }
      }
      if (screen && mesh === screen.mesh) {
        mesh.visible = false;
      }
    });

    return { root, scale, center, screen };
  }, [scene]);

  const { root, scale, center, screen } = prepared;

  const screenTransform = useMemo(() => {
    if (!screen) return null;
    const q = new THREE.Quaternion();
    const p = new THREE.Vector3();
    const s = new THREE.Vector3();
    screen.mesh.matrixWorld.decompose(p, q, s);
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(q).multiplyScalar(0.004);
    const dims = [screen.size.x, screen.size.y, screen.size.z].sort((a, z) => z - a);
    return {
      position: screen.center.clone().sub(center).add(normal),
      quaternion: q,
      width: dims[0],
      height: dims[1],
    };
  }, [screen, center]);

  return (
    <group scale={scale} position={[0, 0, 0]}>
      <group position={[-center.x, -center.y, -center.z]}>
        <primitive object={root} />
      </group>
      {screenTransform && (
        <group position={screenTransform.position} quaternion={screenTransform.quaternion}>
          <Html
            transform
            occlude={false}
            distanceFactor={1}
            scale={screenTransform.width / 1600}
            style={{ pointerEvents: "none" }}
          >
            <ScreenUI />
          </Html>
        </group>
      )}
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
      camera={{ fov: 26, position: [0, 0.55, 6.2] }}
      style={{ width: "100%", height: "100%", background: "transparent" }}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[-3, 4, 5]} intensity={1.5} color="#cfe0ff" />
      <directionalLight position={[4, 2, -3]} intensity={2.2} color="#2f7bff" />
      <spotLight position={[0, 5, 2]} angle={0.7} penumbra={1} intensity={1.2} color="#ffffff" />
      <Suspense fallback={null}>
        <Model />
        <Environment preset="night" environmentIntensity={0.5} />
      </Suspense>
    </Canvas>
  );
}
