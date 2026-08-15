import { useMemo, useRef, type RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { clamp01, easeFilm, range } from "@/lib/film";

/**
 * THE RIBBONS — wide, elegant blue/white light bands suspended BEHIND the device.
 *
 * Each ribbon is a camera-facing quad strip swept along a Catmull-Rom curve.
 * The strip is textured with a soft gradient (bright core → transparent edges,
 * fading ends) and drawn twice: a wide low-opacity halo and a tighter bright
 * body. Additive blending + depthWrite off makes them read as physical
 * fiber-optic light with a soft haze, with no post-processing.
 *
 * Every control point drifts on its own slow sine, so the field never stands
 * still; depth layers respond to the pointer with different parallax strength
 * and converge toward the display plane as the hero scroll progresses.
 */

const SERVICES_FROM = 0.26;
/** the display centre the ribbons converge into (device metric space) */
const FOCUS = new THREE.Vector3(0, 0.108, -0.15);

type Spec = {
  pts: [number, number, number][];
  /** world width of the bright body */
  w: number;
  /** 0 far · 1 mid · 2 near */
  layer: 0 | 1 | 2;
  power: number;
  /** convergence strength toward the display */
  pull: number;
  speed: number;
  phase: number;
  /** cold-white core on top of the blue body */
  white: number;
};

/** hand-placed sweeps: lower-left, behind the device, exiting upper-right */
const SPECS: Spec[] = [
  // FAR — long, calm, high sweeps well behind everything
  {
    pts: [
      [-2.1, -0.34, -1.5],
      [-1.05, 0.05, -1.28],
      [-0.1, 0.5, -1.2],
      [1.0, 0.78, -1.34],
      [2.1, 0.86, -1.6],
    ],
    w: 0.2,
    layer: 0,
    power: 0.4,
    pull: 0.3,
    speed: 0.055,
    phase: 0.4,
    white: 0,
  },
  {
    pts: [
      [-2.0, 0.86, -1.24],
      [-0.95, 0.4, -1.06],
      [0.15, 0.34, -1.0],
      [1.25, 0.58, -1.14],
      [2.0, 1.02, -1.38],
    ],
    w: 0.15,
    layer: 0,
    power: 0.3,
    pull: 0.25,
    speed: 0.043,
    phase: 2.1,
    white: 0,
  },
  // MID — the bands that frame the product
  {
    pts: [
      [-1.5, -0.16, -0.72],
      [-0.75, 0.1, -0.66],
      [-0.05, 0.3, -0.6],
      [0.7, 0.44, -0.66],
      [1.5, 0.66, -0.8],
    ],
    w: 0.11,
    layer: 1,
    power: 0.9,
    pull: 1,
    speed: 0.085,
    phase: 1.2,
    white: 0.55,
  },
  {
    pts: [
      [-1.5, 0.1, -0.6],
      [-0.72, 0.32, -0.52],
      [0.02, 0.52, -0.48],
      [0.78, 0.66, -0.54],
      [1.5, 0.9, -0.7],
    ],
    w: 0.085,
    layer: 1,
    power: 0.7,
    pull: 0.8,
    speed: 0.072,
    phase: 3.4,
    white: 0.35,
  },
  {
    // low arc skimming the ground behind the device
    pts: [
      [-1.4, -0.05, -0.55],
      [-0.7, 0.0, -0.5],
      [0.0, 0.02, -0.46],
      [0.72, 0.0, -0.5],
      [1.4, -0.04, -0.6],
    ],
    w: 0.09,
    layer: 1,
    power: 0.62,
    pull: 0.35,
    speed: 0.062,
    phase: 5.0,
    white: 0.2,
  },
  // NEAR — brighter accents, still behind the device plane
  {
    pts: [
      [-1.15, -0.34, -0.3],
      [-0.6, -0.06, -0.32],
      [-0.05, 0.26, -0.34],
      [0.55, 0.6, -0.3],
      [1.1, 0.92, -0.26],
    ],
    w: 0.075,
    layer: 2,
    power: 1,
    pull: 0.6,
    speed: 0.12,
    phase: 0.9,
    white: 0.7,
  },
  {
    pts: [
      [-1.15, -0.16, -0.28],
      [-0.58, 0.06, -0.32],
      [0.0, 0.2, -0.34],
      [0.6, 0.38, -0.3],
      [1.15, 0.62, -0.24],
    ],
    w: 0.06,
    layer: 2,
    power: 0.8,
    pull: 0.45,
    speed: 0.1,
    phase: 4.2,
    white: 0.5,
  },
  {
    pts: [
      [-0.95, -0.4, -0.22],
      [-0.4, -0.24, -0.26],
      [0.15, -0.08, -0.3],
      [0.75, 0.08, -0.26],
      [1.15, 0.22, -0.2],
    ],
    w: 0.05,
    layer: 2,
    power: 0.6,
    pull: 0.3,
    speed: 0.15,
    phase: 2.7,
    white: 0.3,
  },
];

const BODY = new THREE.Color("#4f92f5");
const HALO = new THREE.Color("#1d54ac");
const CORE = new THREE.Color("#e8f1ff");

/** soft band texture: bright centre line across V, gentle fade at both ends of U */
function bandTexture(edge: number) {
  const w = 128;
  const h = 64;
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    const v = y / (h - 1);
    const across = Math.pow(Math.max(0, 1 - Math.abs(v - 0.5) * 2), edge);
    for (let x = 0; x < w; x++) {
      const u = x / (w - 1);
      const along = Math.pow(Math.sin(Math.PI * u), 0.85);
      const a = across * along;
      const i = (y * w + x) * 4;
      img.data[i] = 255;
      img.data[i + 1] = 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = Math.round(a * 255);
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

type Band = {
  geo: THREE.BufferGeometry;
  mat: THREE.MeshBasicMaterial;
  /** width multiplier relative to the spec width */
  k: number;
  baseOpacity: number;
};

type Built = {
  spec: Spec;
  bands: Band[];
  ctrl: THREE.Vector3[];
  segments: number;
};

function makeStrip(segments: number) {
  const geo = new THREE.BufferGeometry();
  const count = (segments + 1) * 2;
  geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(count * 3), 3));
  const uv = new Float32Array(count * 2);
  const index: number[] = [];
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    uv[i * 4] = u;
    uv[i * 4 + 1] = 0;
    uv[i * 4 + 2] = u;
    uv[i * 4 + 3] = 1;
    if (i < segments) {
      const a = i * 2;
      index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  geo.setIndex(index);
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 6);
  return geo;
}

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

  const textures = useMemo(() => ({ soft: bandTexture(0.75), tight: bandTexture(2.4) }), []);

  const built = useMemo<Built[]>(() => {
    const specs = SPECS.slice(0, Math.max(3, count));
    return specs.map((spec) => {
      const segments = Math.max(28, Math.round((spec.layer === 0 ? 48 : 72) * quality));
      const band = (k: number, color: THREE.Color, opacity: number, tex: THREE.Texture): Band => ({
        geo: makeStrip(segments),
        mat: new THREE.MeshBasicMaterial({
          color,
          map: tex,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
          side: THREE.DoubleSide,
        }),
        k,
        baseOpacity: opacity,
      });
      const bands: Band[] = [
        band(6.5, HALO, 0.105 * spec.power, textures.soft),
        band(1.9, BODY, 0.3 * spec.power, textures.soft),
      ];
      if (spec.white > 0) bands.push(band(0.34, CORE, 0.62 * spec.power * spec.white, textures.tight));
      return {
        spec,
        bands,
        ctrl: spec.pts.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
        segments,
      };
    });
  }, [count, quality, textures]);

  const scratch = useMemo(
    () => ({
      pts: [] as THREE.Vector3[],
      tangent: new THREE.Vector3(),
      side: new THREE.Vector3(),
      view: new THREE.Vector3(0, 0.1, 1),
    }),
    [],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // scroll only softens the field as the hero leaves — no convergence, no cuts
    const p = clamp01(progress.current ?? 0);
    const intensity = 1;
    const converge = 0;
    const dissolve = easeFilm(range(0.35, 1, p)) * 0.85;


    smooth.current.x += (pointer.x - smooth.current.x) * 0.04;
    smooth.current.y += (pointer.y - smooth.current.y) * 0.04;

    for (let bi = 0; bi < built.length; bi++) {
      const b = built[bi];
      const s = b.spec;
      const par = s.layer === 0 ? 0.012 : s.layer === 1 ? 0.05 : 0.11;
      const px = smooth.current.x * par;
      const py = -smooth.current.y * par * 0.6;
      const pull = converge * s.pull;

      // animate the control points: slow drift + breathing amplitude
      const moved = b.ctrl.map((v, i) => {
        const ph = s.phase + i * 0.9;
        const amp = 0.03 + 0.055 * (s.layer === 0 ? 1.4 : s.layer === 1 ? 1 : 0.7);
        const breathe = 0.75 + 0.25 * Math.sin(t * s.speed * 2.1 + ph * 1.3);
        const x = v.x + Math.sin(t * s.speed * 1.7 + ph) * amp * 0.7 * breathe + px;
        const y = v.y + Math.cos(t * s.speed * 1.3 + ph * 1.4) * amp * breathe + py;
        const z = v.z + Math.sin(t * s.speed * 0.9 + ph * 0.7) * amp * 0.5;
        const out = new THREE.Vector3(x, y, z);
        // convergence: interior points bend toward the display aperture
        const w = pull * (1 - Math.abs(i / (b.ctrl.length - 1) - 0.5) * 1.4);
        return out.lerp(FOCUS, Math.max(0, w) * 0.55);
      });

      const curve = new THREE.CatmullRomCurve3(moved, false, "catmullrom", 0.5);
      const pts = curve.getPoints(b.segments);
      scratch.pts = pts;

      for (let n = 0; n < b.bands.length; n++) {
        const band = b.bands[n];
        const pos = band.geo.getAttribute("position") as THREE.BufferAttribute;
        const arr = pos.array as Float32Array;
        const halfW = (s.w * band.k) / 2;
        for (let i = 0; i <= b.segments; i++) {
          const cur = pts[i];
          const next = pts[Math.min(b.segments, i + 1)];
          const prev = pts[Math.max(0, i - 1)];
          scratch.tangent.subVectors(next, prev).normalize();
          scratch.side.crossVectors(scratch.tangent, scratch.view).normalize().multiplyScalar(halfW);
          const o = i * 6;
          arr[o] = cur.x - scratch.side.x;
          arr[o + 1] = cur.y - scratch.side.y;
          arr[o + 2] = cur.z - scratch.side.z;
          arr[o + 3] = cur.x + scratch.side.x;
          arr[o + 4] = cur.y + scratch.side.y;
          arr[o + 5] = cur.z + scratch.side.z;
        }
        pos.needsUpdate = true;

        const breathe = 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(t * s.speed * 3.2 + s.phase * 1.7));
        band.mat.opacity = band.baseOpacity * (1 - dissolve) * intensity * breathe * (1 + pull * 0.5);
      }
    }
  });

  return (
    <group ref={root} position={[0.14, 0.03, 0]}>
      {built.map((b, i) =>
        b.bands.map((band, n) => <mesh key={`${i}-${n}`} geometry={band.geo} material={band.mat} />),
      )}
    </group>
  );
}
