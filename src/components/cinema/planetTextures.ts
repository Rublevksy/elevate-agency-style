import { CanvasTexture, RepeatWrapping, SRGBColorSpace } from "three";

/**
 * Procedural planet maps for the ELEVATE cinematic world.
 *
 * One fbm height field drives four coherent maps (albedo, roughness,
 * displacement/bump and an emissive interface-network map) so the surface reads
 * as a single believable material instead of four unrelated textures.
 */

function hash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return n - Math.floor(n);
}

function hash3(x: number, y: number, z: number) {
  const n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123;
  return n - Math.floor(n);
}

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

/** 3D value noise — sampled on the sphere so the surface has no UV seam or pole pinch */
function noise3(x: number, y: number, z: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const zf = smooth(z - zi);
  const c = (dx: number, dy: number, dz: number) => hash3(xi + dx, yi + dy, zi + dz);
  const l = (a: number, b: number, t: number) => a + (b - a) * t;
  const x00 = l(c(0, 0, 0), c(1, 0, 0), xf);
  const x10 = l(c(0, 1, 0), c(1, 1, 0), xf);
  const x01 = l(c(0, 0, 1), c(1, 0, 1), xf);
  const x11 = l(c(0, 1, 1), c(1, 1, 1), xf);
  return l(l(x00, x10, yf), l(x01, x11, yf), zf);
}

function fbm3(x: number, y: number, z: number, octaves = 6) {
  let v = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    v += noise3(x * f, y * f, z * f) * amp;
    f *= 2.03;
    amp *= 0.5;
  }
  return v;
}

export type PlanetMaps = {
  albedo: CanvasTexture;
  roughness: CanvasTexture;
  displacement: CanvasTexture;
  emissive: CanvasTexture;
};

/** Build the full coherent map set. `w` should be a power of two; height = w/2. */
export function makePlanetMaps(w = 1024): PlanetMaps {
  const h = w / 2;
  const mk = () => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const ctx = c.getContext("2d")!;
    return { c, ctx, data: ctx.createImageData(w, h) };
  };

  const A = mk();
  const R = mk();
  const D = mk();
  const E = mk();

  const scale = 2.6;
  const heights = new Float32Array(w * h);

  for (let y = 0; y < h; y++) {
    const lat = (y / h - 0.5) * Math.PI;
    const cy = Math.sin(lat);
    const cr = Math.cos(lat);
    for (let x = 0; x < w; x++) {
      const lon = (x / w) * Math.PI * 2;
      const sx = Math.cos(lon) * cr * scale;
      const sy = cy * scale;
      const sz = Math.sin(lon) * cr * scale;
      /* domain warp: gives continents organic, non-blobby edges */
      const wx = fbm3(sx + 5.2, sy + 1.3, sz + 2.4, 4);
      const wy = fbm3(sx + 9.7, sy + 4.1, sz + 7.8, 4);
      let e = fbm3(sx + wx * 1.1, sy + wy * 1.1, sz + wx * 0.6, 6);
      e = Math.pow(Math.max(0, e * 1.35 - 0.2), 1.1);
      const micro = fbm3(sx * 8, sy * 8, sz * 8, 3) * 0.18;
      heights[y * w + x] = Math.min(1, e + micro * e);
    }
  }


  for (let i = 0; i < w * h; i++) {
    const e = heights[i]!;
    const land = Math.min(1, Math.max(0, (e - 0.34) / 0.24));
    const ridge = Math.min(1, Math.max(0, (e - 0.62) / 0.3));
    const o = i * 4;

    /* ALBEDO — deep navy basins → graphite landmass → cool white ridges */
    const r = 12 + land * 46 + ridge * 62;
    const g = 18 + land * 54 + ridge * 70;
    const b = 34 + land * 66 + ridge * 82;
    A.data.data[o] = r;
    A.data.data[o + 1] = g;
    A.data.data[o + 2] = b;
    A.data.data[o + 3] = 255;

    /* ROUGHNESS — basins polished (specular response), land matte + micro variation */
    const rough = 255 * (0.22 + land * 0.5 + (hash(i, i * 0.37) - 0.5) * 0.06);
    R.data.data[o] = R.data.data[o + 1] = R.data.data[o + 2] = Math.max(0, Math.min(255, rough));
    R.data.data[o + 3] = 255;

    /* DISPLACEMENT — only landmass rises, basins stay flat */
    const d = 255 * Math.pow(land, 1.2) * (0.55 + ridge * 0.45);
    D.data.data[o] = D.data.data[o + 1] = D.data.data[o + 2] = d;
    D.data.data[o + 3] = 255;

    E.data.data[o] = E.data.data[o + 1] = E.data.data[o + 2] = 0;
    E.data.data[o + 3] = 255;
  }

  /* EMISSIVE — ELEVATE blue network settled on coastlines: digital architecture,
     not city lights. Drawn as strokes so it keeps crisp interface geometry. */
  E.ctx.putImageData(E.data, 0, 0);
  const ex = E.ctx;
  ex.lineWidth = Math.max(1, w / 900);
  for (let y = 2; y < h - 2; y += 2) {
    for (let x = 2; x < w - 2; x += 2) {
      const e = heights[y * w + x]!;
      if (e < 0.32 || e > 0.42) continue;
      if (hash(x * 1.7, y * 2.3) > 0.085) continue;
      const len = (4 + hash(x, y) * 16) * (w / 1024);
      const dir = hash(y, x) > 0.5 ? 0 : 1;
      ex.strokeStyle = `rgba(96,150,246,${0.2 + hash(x + 3, y) * 0.35})`;
      ex.beginPath();
      ex.moveTo(x, y);
      ex.lineTo(dir ? x + len : x, dir ? y : y + len);
      ex.stroke();
    }
  }
  /* a few long orbital-city arteries for scale */
  for (let i = 0; i < 26; i++) {
    const y0 = hash(i, 7) * h;
    ex.strokeStyle = `rgba(120,170,255,${0.07 + hash(i, 3) * 0.09})`;
    ex.lineWidth = Math.max(1, w / 1400);
    ex.beginPath();
    ex.moveTo(0, y0);
    for (let x = 0; x <= w; x += w / 24) {
      ex.lineTo(x, y0 + Math.sin(x / (40 + i)) * (6 + hash(i, x) * 10));
    }
    ex.stroke();
  }

  A.ctx.putImageData(A.data, 0, 0);
  R.ctx.putImageData(R.data, 0, 0);
  D.ctx.putImageData(D.data, 0, 0);

  const tex = (canvas: HTMLCanvasElement, srgb: boolean) => {
    const t = new CanvasTexture(canvas);
    t.wrapS = t.wrapT = RepeatWrapping;
    if (srgb) t.colorSpace = SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  };

  return {
    albedo: tex(A.c, true),
    roughness: tex(R.c, false),
    displacement: tex(D.c, false),
    emissive: tex(E.c, true),
  };
}
