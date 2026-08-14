import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import {
  AdditiveBlending,
  BackSide,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Points,
  ShaderMaterial,
} from "three";
import { easeCine, lerp, stage } from "./progress";
import { makeGlowTexture, makeGridTexture } from "./textures";
import { makePlanetMaps } from "./planetTextures";

/**
 * THE ELEVATE WORLD — a cinematic digital planet.
 *
 * Not an astronomical body: a high-detail displaced sphere (graphite landmass,
 * polished navy basins, a blue interface network on the coastlines) wrapped in
 * scattered atmosphere, thin orbital architecture and suspended interface
 * fragments. Everything is driven by the single scroll progress value.
 */

const ATMO_VERT = /* glsl */ `
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vN = normalize(mat3(modelMatrix) * normal);
    vV = normalize(cameraPosition - wp.xyz);
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;

const ATMO_FRAG = /* glsl */ `
  uniform vec3 uColor;
  uniform vec3 uRim;
  uniform float uPower;
  uniform float uStrength;
  uniform vec3 uLight;
  varying vec3 vN;
  varying vec3 vV;
  void main() {
    float fres = pow(1.0 - max(dot(vN, vV), 0.0), uPower);
    float lit = pow(max(dot(normalize(vN), normalize(uLight)) * 0.5 + 0.5, 0.0), 1.6);
    vec3 col = mix(uColor, uRim, lit);
    gl_FragColor = vec4(col, fres * uStrength * (0.25 + lit * 0.9));
  }
`;

export function ElevatePlanet({
  progressRef,
  pointerRef,
  mobile,
}: {
  progressRef: RefObject<number>;
  pointerRef: RefObject<{ x: number; y: number }>;
  mobile: boolean;
}) {
  const root = useRef<Group>(null);
  const body = useRef<Mesh>(null);
  const atmoInner = useRef<Mesh>(null);
  const atmoOuter = useRef<Mesh>(null);
  const grid = useRef<Mesh>(null);
  const rings = useRef<Group>(null);
  const fragments = useRef<Group>(null);
  const bloom = useRef<Mesh>(null);
  const orbitDust = useRef<Points>(null);
  const smooth = useRef({ p: 0, mx: 0, my: 0 });

  const maps = useMemo(() => {
    const m = makePlanetMaps(mobile ? 512 : 1024);
    if (typeof window !== "undefined")
      (window as unknown as Record<string, unknown>).__PLANET_DEBUG__ = {
        albedo: m.albedo.image.width,
        px: m.albedo.image.getContext("2d").getImageData(200, 100, 1, 1).data.join(","),
        em: m.emissive.image.getContext("2d").getImageData(200, 100, 1, 1).data.join(","),
      };
    return m;
  }, [mobile]);
  const uiTex = useMemo(() => makeGridTexture(mobile ? 256 : 512), [mobile]);
  const glow = useMemo(() => makeGlowTexture(), []);
  const seg = mobile ? 128 : 320;

  const dust = useMemo(() => {
    const n = mobile ? 260 : 700;
    const pos = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 3.4 + Math.random() * 2.6;
      const t = (Math.random() - 0.5) * 0.5;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = t + Math.sin(a * 3) * 0.12;
      pos[i * 3 + 2] = Math.sin(a) * r;
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new BufferAttribute(pos, 3));
    return g;
  }, [mobile]);

  const frags = useMemo(
    () =>
      Array.from({ length: mobile ? 4 : 8 }, (_, i) => {
        const a = (i / (mobile ? 4 : 8)) * Math.PI * 2 + 0.4;
        const r = 3.1 + (i % 3) * 0.55;
        return {
          i,
          a,
          r,
          y: ((i % 4) - 1.5) * 0.85,
          s: 0.55 + (i % 3) * 0.22,
          spin: 0.1 + (i % 5) * 0.04,
        };
      }),
    [mobile],
  );

  useFrame((_, dt) => {
    const target = progressRef.current ?? 0;
    /* inertial follow: no linear robotic motion, and it fully reverses */
    smooth.current.p += (target - smooth.current.p) * 0.075;
    const m = pointerRef.current ?? { x: 0, y: 0 };
    smooth.current.mx += (m.x - smooth.current.mx) * 0.035;
    smooth.current.my += (m.y - smooth.current.my) * 0.035;
    const p = smooth.current.p;
    const e = easeCine(p);

    /* hero framing 40–55%, then the world recedes so the service field can own
       the frame without a section break */
    const recede = easeCine(stage(p, 0.66, 1));
    if (root.current) {
      root.current.position.x = lerp(0.9, -0.6, e) + smooth.current.mx * 0.18;
      root.current.position.y = lerp(-0.35, 0.15, e) + smooth.current.my * 0.12 - recede * 0.5;
      root.current.position.z = -recede * 5.5;
      root.current.scale.setScalar(lerp(1, 0.86, recede));
      root.current.rotation.z = 0.14 - p * 0.05;
    }

    if (body.current) {
      body.current.rotation.y = 0.6 + p * 1.35 + smooth.current.mx * 0.06;
      const mat = body.current.material as MeshStandardMaterial;
      /* the interface network wakes up as the world becomes digital */
      mat.emissiveIntensity = 0.45 + easeCine(stage(p, 0.5, 0.85)) * 1.15;
      mat.displacementScale = lerp(0.075, 0.05, recede);
    }

    const scatter = 0.55 + easeCine(stage(p, 0.15, 0.6)) * 0.55;
    if (atmoInner.current) {
      const u = (atmoInner.current.material as ShaderMaterial).uniforms;
      u.uStrength!.value = scatter * (1 - recede * 0.35);
    }
    if (atmoOuter.current) {
      const u = (atmoOuter.current.material as ShaderMaterial).uniforms;
      u.uStrength!.value = 0.34 * scatter * (1 - recede * 0.4);
      atmoOuter.current.scale.setScalar(lerp(1.14, 1.22, easeCine(stage(p, 0.5, 0.95))));
    }

    if (grid.current) {
      const a = easeCine(stage(p, 0.55, 0.82));
      const mat = grid.current.material as MeshBasicMaterial;
      mat.opacity = a * 0.3;
      grid.current.visible = a > 0.01;
      grid.current.rotation.y = -0.3 - p * 0.8;
      grid.current.scale.setScalar(1.035 + a * 0.02);
    }

    if (rings.current) {
      rings.current.rotation.z += dt * 0.02;
      rings.current.rotation.y = 0.4 + p * 0.5;
      rings.current.children.forEach((c, i) => {
        const mat = (c as Mesh).material as MeshBasicMaterial;
        if (mat && "opacity" in mat) mat.opacity = (0.16 + i * 0.05) * (0.4 + e * 0.9);
      });
    }

    if (orbitDust.current) {
      orbitDust.current.rotation.y += dt * 0.035;
      (orbitDust.current.material as unknown as { opacity: number }).opacity =
        0.35 + easeCine(stage(p, 0.2, 0.7)) * 0.3;
    }

    if (fragments.current) {
      const a = easeCine(stage(p, 0.5, 0.9));
      fragments.current.visible = a > 0.01;
      fragments.current.rotation.y = 0.2 + p * 0.35 + smooth.current.mx * 0.12;
      fragments.current.children.forEach((c, i) => {
        const f = frags[i];
        if (!f) return;
        const local = Math.min(1, Math.max(0, (a - i * 0.06) * 2.2));
        c.position.set(
          Math.cos(f.a) * lerp(f.r * 0.75, f.r, local),
          f.y * local + smooth.current.my * 0.1,
          Math.sin(f.a) * lerp(f.r * 0.75, f.r, local),
        );
        c.rotation.y = -f.a + Math.PI / 2 + smooth.current.mx * 0.2;
        c.scale.setScalar(f.s * (0.6 + local * 0.4));
        const mat = ((c as Mesh).material as MeshBasicMaterial) || undefined;
        if (mat && "opacity" in mat) mat.opacity = local * 0.55;
      });
    }

    if (bloom.current) {
      bloom.current.scale.setScalar(lerp(6.2, 8.4, e));
      (bloom.current.material as MeshBasicMaterial).opacity = (0.14 + e * 0.12) * (1 - recede * 0.5);
      bloom.current.lookAt(0, 0, 40);
    }
  });

  const lightDir = useMemo(() => new Color(), []);
  void lightDir;

  return (
    <group ref={root}>
      {/* PLANET BODY — displaced high-density sphere, PBR response */}
      <mesh ref={body} castShadow receiveShadow>
        <sphereGeometry args={[2.35, seg, seg / 2]} />
        <meshStandardMaterial
          map={maps.albedo}
          roughnessMap={maps.roughness}
          displacementMap={maps.displacement}
          displacementScale={0.075}
          bumpMap={maps.displacement}
          bumpScale={0.6}
          emissiveMap={maps.emissive}
          emissive="#5b93f0"
          emissiveIntensity={0.45}
          metalness={0.12}
          roughness={0.72}
          envMapIntensity={0.5}
        />
      </mesh>

      {/* digital latitude architecture settling over the surface */}
      <mesh ref={grid} visible={false}>
        <sphereGeometry args={[2.35, mobile ? 64 : 128, mobile ? 32 : 64]} />
        <meshBasicMaterial
          map={uiTex}
          transparent
          opacity={0}
          blending={AdditiveBlending}
          depthWrite={false}
          wireframe={false}
        />
      </mesh>

      {/* ATMOSPHERE — inner scatter shell + wide outer halo */}
      <mesh ref={atmoInner} scale={1.045}>
        <sphereGeometry args={[2.35, 96, 48]} />
        <shaderMaterial
          vertexShader={ATMO_VERT}
          fragmentShader={ATMO_FRAG}
          transparent
          depthWrite={false}
          side={BackSide}
          blending={AdditiveBlending}
          uniforms={{
            uColor: { value: new Color("#2c5ea8") },
            uRim: { value: new Color("#b9d4ff") },
            uPower: { value: 3.2 },
            uStrength: { value: 0.7 },
            uLight: { value: [0.6, 0.55, 0.6] },
          }}
        />
      </mesh>
      <mesh ref={atmoOuter} scale={1.16}>
        <sphereGeometry args={[2.35, 64, 32]} />
        <shaderMaterial
          vertexShader={ATMO_VERT}
          fragmentShader={ATMO_FRAG}
          transparent
          depthWrite={false}
          side={BackSide}
          blending={AdditiveBlending}
          uniforms={{
            uColor: { value: new Color("#123a76") },
            uRim: { value: new Color("#7fa9f0") },
            uPower: { value: 2.1 },
            uStrength: { value: 0.3 },
            uLight: { value: [0.6, 0.55, 0.6] },
          }}
        />
      </mesh>

      {/* thin orbital architecture — engineered, not sci-fi */}
      <group ref={rings} rotation={[1.32, 0.4, 0.22]}>
        {[2.95, 3.35, 4.15].map((r, i) => (
          <mesh key={r} rotation={[i * 0.05, 0, i * 0.07]}>
            <torusGeometry args={[r, i === 1 ? 0.006 : 0.0035, 6, mobile ? 90 : 200]} />
            <meshBasicMaterial
              color={i === 1 ? "#a8c8ff" : "#4f83dd"}
              transparent
              opacity={0.2}
              blending={AdditiveBlending}
              depthWrite={false}
            />
          </mesh>
        ))}
        <points ref={orbitDust} geometry={dust}>
          <pointsMaterial
            color="#b9d4ff"
            size={mobile ? 0.03 : 0.02}
            sizeAttenuation
            transparent
            opacity={0.4}
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
      </group>

      {/* suspended interface fragments orbiting the world */}
      <group ref={fragments} visible={false}>
        {frags.map((f) => (
          <mesh key={f.i}>
            <planeGeometry args={[1.35, 0.85]} />
            <meshBasicMaterial
              map={uiTex}
              transparent
              opacity={0}
              side={DoubleSide}
              depthWrite={false}
              blending={AdditiveBlending}
            />
          </mesh>
        ))}
      </group>

      <mesh ref={bloom} position={[0, 0, -0.5]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={glow} transparent opacity={0.16} blending={AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
}
