import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, BufferGeometry, Group, Points } from "three";
import { easeCine, lerp, stage } from "./progress";
import { makeGlowTexture } from "./textures";

/**
 * Digital space — not outer space. Volumetric haze sheets, fine suspended
 * particles, thin architectural structures and long light trails. Everything
 * parallaxes by depth from the single scroll progress value.
 */
export function Atmosphere({
  progressRef,
  pointerRef,
  mobile,
}: {
  progressRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  mobile: boolean;
}) {
  const glow = useMemo(() => makeGlowTexture(), []);
  const far = useRef<Group>(null);
  const mid = useRef<Group>(null);
  const near = useRef<Group>(null);
  const dust = useRef<Points>(null);
  const smooth = useRef({ p: 0, mx: 0, my: 0 });

  const particles = useMemo(() => {
    const n = mobile ? 500 : 1400;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    return g;
  }, [mobile]);

  const trails = useMemo(
    () =>
      Array.from({ length: mobile ? 5 : 11 }, (_, i) => ({
        x: (Math.random() - 0.5) * 26,
        y: (Math.random() - 0.5) * 13,
        z: -6 - Math.random() * 22,
        len: 6 + Math.random() * 16,
        o: 0.1 + Math.random() * 0.22,
        i,
      })),
    [mobile],
  );

  useFrame(() => {
    const target = progressRef.current ?? 0;
    smooth.current.p += (target - smooth.current.p) * 0.12;
    const m = pointerRef.current ?? { x: 0, y: 0 };
    smooth.current.mx += (m.x - smooth.current.mx) * 0.04;
    smooth.current.my += (m.y - smooth.current.my) * 0.04;
    const p = smooth.current.p;
    const e = easeCine(p);

    if (far.current) {
      far.current.position.x = smooth.current.mx * 0.5;
      far.current.position.y = smooth.current.my * 0.3 + e * 0.6;
    }
    if (mid.current) {
      mid.current.position.x = smooth.current.mx * 1.5;
      mid.current.position.y = smooth.current.my * 0.9 - e * 1.2;
      mid.current.rotation.y = p * 0.16;
    }
    if (near.current) {
      near.current.position.x = smooth.current.mx * 3.4;
      near.current.position.y = smooth.current.my * 2.1;
      near.current.position.z = lerp(-2, 7, e);
    }
    if (dust.current) {
      dust.current.rotation.y = p * 0.3;
      const mat = dust.current.material as unknown as { opacity: number };
      mat.opacity = lerp(0.5, 0.15, stage(p, 0.75, 1));
    }
  });

  return (
    <group>
      {/* FAR — architectural depth walls, barely there */}
      <group ref={far}>
        {[-30].map((z, i) => (
          <gridHelper
            key={z}
            args={[70, 24, "#0d1728", "#0a1120"]}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0, z]}
            scale={1 + i * 0.2}
          />
        ))}
        <mesh position={[0, 0, -24]}>
          <planeGeometry args={[80, 46]} />
          <meshBasicMaterial map={glow} transparent opacity={0.18} blending={AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>

      {/* MID — haze sheets + suspended particles */}
      <group ref={mid}>
        <points ref={dust} geometry={particles}>
          <pointsMaterial
            color="#9dc0f5"
            size={mobile ? 0.045 : 0.03}
            sizeAttenuation
            transparent
            opacity={0.5}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
        {[
          [-9, 2, -12, 26],
          [11, -3, -9, 22],
        ].map(([x, y, z, s], i) => (
          <mesh key={i} position={[x, y, z]}>
            <planeGeometry args={[s, s * 0.7]} />
            <meshBasicMaterial map={glow} transparent opacity={0.16} blending={AdditiveBlending} depthWrite={false} />
          </mesh>
        ))}
      </group>

      {/* NEAR — thin light trails passing the lens */}
      <group ref={near}>
        {trails.map((t) => (
          <mesh key={t.i} position={[t.x, t.y, t.z]} rotation={[0, 0, Math.PI / 2]}>
            <planeGeometry args={[0.012, t.len]} />
            <meshBasicMaterial
              color="#bcd6ff"
              transparent
              opacity={t.o}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}
