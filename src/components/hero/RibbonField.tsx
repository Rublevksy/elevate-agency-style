import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { clamp01, easeFilm, range } from "@/lib/film";

/**
 * THE RIBBONS — luminous fiber-optic light bands suspended around the device.
 *
 * Each ribbon is a tube along a smooth CatmullRom curve, drawn three times:
 * a wide soft halo, the electric blue body and a thin cold-white core. All
 * materials are additive + depth-write off, so they read as emissive light
 * with bloom-like falloff without any post-processing pass.
 *
 * Three depth layers (far / mid / near) drift and breathe at different speeds
 * and respond to the pointer with different parallax strength. As the hero
 * scroll progresses the whole field intensifies and the ribbons converge
 * toward the display plane — the portal is made of the ribbons themselves.
 */

const SERVICES_FROM = 0.26;

type Spec = {
  pts: [number, number, number][];
  r: number;
  /** 0 far · 1 mid · 2 near */
  layer: 0 | 1 | 2;
  /** base brightness multiplier */
  power: number;
  /** how much the ribbon bends toward the display when the portal forms */
  pull: number;
  speed: number;
  phase: number;
};

/** hand-placed sweeps: left/bottom → behind the device → upper right */
const SPECS: Spec[] = [
  {
    pts: [
      [-2.3, -0.42, -1.15],
      [-1.1, -0.2, -0.95],
      [-0.1, 0.1, -0.7],
      [0.9, 0.42, -0.95],
      [2.2, 0.86, -1.3],
    ],
    r: 0.0075,
    layer: 0,
    power: 0.42,
    pull: 0.5,
    speed: 0.11,
    phase: 0.4,
  },
  {
    pts: [
      [-2.4, 0.62, -1.05],
      [-1.2, 0.42, -0.8],
      [0.0, 0.5, -0.62],
      [1.25, 0.72, -0.85],
      [2.4, 1.05, -1.2],
    ],
    r: 0.006,
    layer: 0,
    power: 0.34,
    pull: 0.35,
    speed: 0.09,
    phase: 2.1,
  },
  {
    pts: [
      [-1.9, -0.3, -0.62],
      [-0.85, -0.06, -0.44],
      [0.05, 0.14, -0.3],
      [1.0, 0.4, -0.5],
      [2.0, 0.78, -0.8],
    ],
    r: 0.009,
    layer: 1,
    power: 0.78,
    pull: 1,
    speed: 0.16,
    phase: 1.2,
  },
  {
    pts: [
      [-1.85, 0.24, -0.5],
      [-0.8, 0.36, -0.3],
      [0.1, 0.3, -0.18],
      [1.1, 0.16, -0.34],
      [2.05, -0.1, -0.62],
    ],
    r: 0.0075,
    layer: 1,
    power: 0.66,
    pull: 0.9,
    speed: 0.13,
    phase: 3.4,
  },
  {
    // low arc skimming the ground behind the device
    pts: [
      [-1.7, -0.09, -0.4],
      [-0.7, -0.03, -0.24],
      [0.15, 0.0, -0.16],
      [1.05, -0.03, -0.26],
      [1.9, -0.1, -0.46],
    ],
    r: 0.0065,
    layer: 1,
    power: 0.6,
    pull: 0.45,
    speed: 0.1,
    phase: 5.0,
  },
  {
    pts: [
      [-1.5, -0.5, 0.16],
      [-0.72, -0.16, 0.08],
      [-0.1, 0.16, -0.02],
      [0.62, 0.5, 0.06],
      [1.5, 0.92, 0.2],
    ],
    r: 0.0115,
    layer: 2,
    power: 1,
    pull: 0.7,
    speed: 0.22,
    phase: 0.9,
  },
  {
    pts: [
      [-1.35, 0.78, 0.2],
      [-0.6, 0.5, 0.12],
      [0.06, 0.26, 0.02],
      [0.8, 0.02, 0.1],
      [1.45, -0.28, 0.24],
    ],
    r: 0.0085,
    layer: 2,
    power: 0.86,
    pull: 0.55,
    speed: 0.19,
    phase: 4.2,
  },
  {
    pts: [
      [-1.15, -0.62, 0.3],
      [-0.4, -0.34, 0.22],
      [0.25, -0.12, 0.14],
      [0.95, 0.12, 0.2],
      [1.3, 0.34, 0.32],
    ],
    r: 0.006,
    layer: 2,
    power: 0.7,
    pull: 0.3,
    speed: 0.26,
    phase: 2.7,
  },
];

const HALO = new THREE.Color("#1c53a8");
const BODY = new THREE.Color("#4b8ef0");
const CORE = new THREE.Color("#dbe9ff");

type Built = {
  spec: Spec;
  group: THREE.Group;
  mats: THREE.MeshBasicMaterial[];
  base: number[];
  restY: number;
  restZ: number;
};

export function RibbonField({
  progress,
  pointer,
  count = SPECS.length,
  quality = 1,
}: {
  progress: RefObject<number>;
  pointer: { x: number; y: number };
  count?: number;
  quality?: number;
}) {
  const root = useRef<THREE.Group>(null);
  const smooth = useRef({ x: 0, y: 0 });

  const built = useMemo<Built[]>(() => {
    const specs = SPECS.slice(0, Math.max(2, count));
    return specs.map((spec) => {
      const curve = new THREE.CatmullRomCurve3(
        spec.pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        false,
        "catmullrom",
        0.4,
      );
      const seg = Math.round((spec.layer === 0 ? 64 : 96) * quality);
      const group = new THREE.Group();
      const mats: THREE.MeshBasicMaterial[] = [];
      const build = (radius: number, color: THREE.Color, opacity: number, radial: number) => {
        const geo = new THREE.TubeGeometry(curve, seg, radius, radial, false);
        const mat = new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
          side: THREE.DoubleSide,
        });
        mats.push(mat);
        group.add(new THREE.Mesh(geo, mat));
      };
      build(spec.r * 4.2, HALO, 0.1 * spec.power, 5);
      build(spec.r, BODY, 0.62 * spec.power, 7);
      build(spec.r * 0.34, CORE, 0.8 * spec.power, 5);
      return {
        spec,
        group,
        mats,
        base: mats.map((m) => m.opacity),
        restY: 0,
        restZ: 0,
      };
    });
  }, [count, quality]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const p = progress.current ?? 0;
    const hp = clamp01(p / SERVICES_FROM);
    const intensity = 1 + easeFilm(range(0.1, 0.6, hp)) * 0.9;
    const converge = easeFilm(range(0.3, 0.8, hp));
    const dissolve = easeFilm(range(0.82, 1, hp));

    smooth.current.x += (pointer.x - smooth.current.x) * 0.045;
    smooth.current.y += (pointer.y - smooth.current.y) * 0.045;

    if (root.current) {
      root.current.rotation.y = smooth.current.x * 0.05;
      root.current.position.x = 0.02 + smooth.current.x * 0.012;
      root.current.rotation.x = -smooth.current.y * 0.03;
    }

    for (let i = 0; i < built.length; i++) {
      const b = built[i];
      const s = b.spec;
      const par = s.layer === 0 ? 0.02 : s.layer === 1 ? 0.055 : 0.12;
      const drift = Math.sin(t * s.speed + s.phase);
      const breathe = 0.72 + 0.28 * (0.5 + 0.5 * Math.sin(t * (s.speed * 3.4) + s.phase * 1.7));

      // converge: ribbons bend in toward the display plane, forming the aperture
      const pull = converge * s.pull;
      b.group.position.set(
        smooth.current.x * par + drift * 0.02 - pull * 0.06,
        smooth.current.y * par * -0.6 + drift * 0.035 + pull * 0.05,
        pull * 0.22,
      );
      b.group.scale.setScalar(1 - pull * 0.24);
      b.group.rotation.z = drift * 0.03 + pull * 0.1;

      const fade = (1 - dissolve) * intensity * breathe;
      for (let m = 0; m < b.mats.length; m++) {
        b.mats[m].opacity = b.base[m] * fade * (1 + pull * 0.6);
      }
    }
  });

  return (
    <group ref={root} scale={0.33} position={[0.02, 0.03, 0]}>
      {built.map((b, i) => (
        <primitive key={i} object={b.group} />
      ))}
    </group>
  );
}
