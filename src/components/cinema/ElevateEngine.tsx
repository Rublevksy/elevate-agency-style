import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
} from "three";
import { easeCine, lerp, stage } from "./progress";
import { makeGlowTexture, makeGridTexture } from "./textures";

/**
 * THE ELEVATE ARTIFACT — a precision-engineered digital engine.
 *
 * Machined outer structure (rings + radial blades) holding a suspended light
 * core, with internal digital surfaces that are only revealed as the camera
 * approaches. Late in the timeline the machined shell dissolves and the
 * interface planes take over the frame: object → interface → website.
 */
export function ElevateEngine({
  progressRef,
  pointerRef,
  mobile,
}: {
  progressRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  mobile: boolean;
}) {
  const root = useRef<Group>(null);
  const shell = useRef<Group>(null);
  const rings = useRef<Group[]>([]);
  const core = useRef<Mesh>(null);
  const halo = useRef<Mesh>(null);
  const surfaces = useRef<Group>(null);
  const panels = useRef<Group>(null);
  const smooth = useRef({ p: 0, mx: 0, my: 0 });

  const grid = useMemo(() => makeGridTexture(mobile ? 256 : 512), [mobile]);
  const glow = useMemo(() => makeGlowTexture(), []);

  const blades = useMemo(
    () => Array.from({ length: mobile ? 8 : 14 }, (_, i) => (i / (mobile ? 8 : 14)) * Math.PI * 2),
    [mobile],
  );

  useFrame((_, dt) => {
    const target = progressRef.current ?? 0;
    smooth.current.p += (target - smooth.current.p) * 0.12;
    const m = pointerRef.current ?? { x: 0, y: 0 };
    smooth.current.mx += (m.x - smooth.current.mx) * 0.05;
    smooth.current.my += (m.y - smooth.current.my) * 0.05;
    const p = smooth.current.p;
    const e = easeCine(p);

    if (root.current) {
      root.current.rotation.y = p * 1.9 + smooth.current.mx * 0.22;
      root.current.rotation.x = 0.07 + smooth.current.my * -0.12 - p * 0.05;
    }

    /* rings separate along depth and counter-rotate: the engine "opens" */
    const split = easeCine(stage(p, 0.3, 0.78));
    rings.current.forEach((g, i) => {
      if (!g) return;
      const dir = i - 1;
      g.position.z = dir * split * 2.6;
      g.rotation.z += dt * (0.05 + i * 0.04) * (i % 2 ? -1 : 1) * (0.25 + p);
      g.scale.setScalar(1 + split * (0.22 + i * 0.12));
    });

    /* machined shell dissolves as we pass into the interface */
    const dissolve = 1 - stage(p, 0.6, 0.9);
    if (shell.current) {
      shell.current.traverse((o) => {
        const mesh = o as Mesh;
        const mat = mesh.material as MeshStandardMaterial | undefined;
        if (mat && "opacity" in mat) mat.opacity = dissolve;
      });
      shell.current.visible = dissolve > 0.01;
    }

    /* light core: breathes with proximity, collapses into pure light at the end */
    if (core.current) {
      const s = lerp(1, 0.2, easeCine(stage(p, 0.62, 0.95)));
      core.current.scale.setScalar(s);
      const mat = core.current.material as MeshStandardMaterial;
      mat.emissiveIntensity = 0.5 + e * 1.3;
    }
    if (halo.current) {
      halo.current.scale.setScalar(lerp(4.5, 11, e));
      (halo.current.material as MeshBasicMaterial).opacity = lerp(0.16, 0.34, e) * (1 - stage(p, 0.94, 1));
      halo.current.lookAt(0, 0, 40);
    }

    /* internal digital surfaces become visible mid-shot */
    const inner = stage(p, 0.34, 0.66);
    if (surfaces.current) {
      surfaces.current.visible = inner > 0.01;
      surfaces.current.traverse((o) => {
        const mat = (o as Mesh).material as MeshBasicMaterial | undefined;
        if (mat && "opacity" in mat) mat.opacity = inner * 0.85 * (1 - stage(p, 0.9, 1));
      });
    }

    /* interface planes take the frame late, sliding past the camera */
    const iface = stage(p, 0.55, 0.98);
    if (panels.current) {
      panels.current.visible = iface > 0.01;
      panels.current.position.z = lerp(-6, 5.5, easeCine(iface));
      panels.current.scale.setScalar(lerp(0.75, 1.5, easeCine(iface)));
      panels.current.rotation.y = smooth.current.mx * 0.12;
      panels.current.children.forEach((child, i) => {
        const mesh = child as Mesh;
        const mat = mesh.material as MeshBasicMaterial;
        const local = Math.min(1, Math.max(0, (iface - i * 0.11) * 2.4));
        mat.opacity = local * 0.9;
      });
    }
  });

  const metal = (
    <meshStandardMaterial
      color="#1b2532"
      metalness={0.88}
      roughness={0.42}
      transparent
      opacity={1}
      envMapIntensity={1.4}
    />
  );

  return (
    <group ref={root}>
      <group ref={shell}>
        {/* three machined rings at different depths */}
        {[0, 1, 2].map((i) => (
          <group
            key={i}
            ref={(el) => {
              if (el) rings.current[i] = el;
            }}
            rotation={[Math.PI / 2 + (i - 1) * 0.06, 0, 0]}
          >
            {/* machined plate ring — reads as engineered metal, not wire */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[3.4 + i * 0.7, 3.4 + i * 0.7, 0.26 + i * 0.06, mobile ? 72 : 140, 1, true]} />
              <meshStandardMaterial
                color="#252f3d"
                metalness={0.92}
                roughness={0.34}
                side={DoubleSide}
                transparent
                opacity={1}
                envMapIntensity={1.6}
              />
            </mesh>
            {/* thin light channel inside the ring */}
            <mesh>
              <torusGeometry args={[3.4 + i * 0.7, 0.012, 6, mobile ? 60 : 120]} />
              <meshBasicMaterial color="#5b93f0" transparent opacity={0.7} blending={AdditiveBlending} />
            </mesh>
          </group>
        ))}

        {/* radial blades — precision engineering, not decoration */}
        {blades.map((a, i) => (
          <group key={i} rotation={[0, a, 0]}>
            <mesh position={[2.35, 0, 0]} rotation={[0, 0, 0.16]}>
              <boxGeometry args={[1.5, 0.07, 0.34]} />
              {metal}
            </mesh>
            <mesh position={[3.05, 0, 0]}>
              <boxGeometry args={[0.09, 0.02, 0.5]} />
              <meshBasicMaterial color="#8fb8fb" transparent opacity={0.45} blending={AdditiveBlending} />
            </mesh>
          </group>
        ))}

        {/* central hub housing */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[1.28, 1.5, 0.6, 12, 1, true]} />
          <meshStandardMaterial
            color="#2b3543"
            metalness={0.9}
            roughness={0.3}
            side={DoubleSide}
            transparent
            opacity={1}
            envMapIntensity={1.5}
          />
        </mesh>
      </group>

      {/* suspended core: dark machined body with a thin light equator */}
      <mesh ref={core}>
        <icosahedronGeometry args={[0.78, 1]} />
        <meshStandardMaterial
          color="#161d29"
          emissive="#2c5395"
          emissiveIntensity={0.35}
          metalness={0.95}
          roughness={0.22}
          envMapIntensity={1.8}
          flatShading
        />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.95, 0.006, 6, 90]} />
        <meshBasicMaterial color="#a8c8ff" transparent opacity={0.8} blending={AdditiveBlending} />
      </mesh>
      <mesh ref={halo}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glow} transparent opacity={0.3} blending={AdditiveBlending} depthWrite={false} />
      </mesh>


      {/* internal digital surfaces revealed as the camera closes in */}
      <group ref={surfaces} visible={false}>
        {[
          [1.5, -0.7, 0.6, -0.5],
          [-1.7, 0.55, -0.4, 0.42],
          [0.2, 1.35, 1.1, 0.1],
        ].map(([x, y, z, ry], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[0, ry, 0]}>
            <planeGeometry args={[1.7, 1.05]} />
            <meshBasicMaterial map={grid} transparent opacity={0} side={DoubleSide} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* interface planes: the object becoming the product */}
      <group ref={panels} visible={false}>
        {[
          [-2.6, 0.9, -1.4],
          [2.7, -0.6, -0.6],
          [-1.1, -1.5, 0.9],
          [1.6, 1.5, 1.6],
        ].map(([x, y, z], i) => (
          <mesh key={i} position={[x, y, z]} rotation={[0, x > 0 ? -0.24 : 0.24, 0]}>
            <planeGeometry args={[2.5, 1.5]} />
            <meshBasicMaterial map={grid} transparent opacity={0} side={DoubleSide} depthWrite={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}
