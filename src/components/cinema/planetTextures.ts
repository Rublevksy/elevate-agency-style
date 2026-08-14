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

function smooth(t: number) {
  return t * t * (3 - 2 * t);
}

function noise(x: number, y: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = smooth(x - xi);
  const yf = smooth(y - yi);
  const a = hash(xi, yi);
  const b = hash(xi + 1, yi);
  const c = hash(xi, yi + 1);
  const d = hash(xi + 1, yi + 1);
  return a + (b - a) * xf + (c - a) * yf + (a - b - c + d) * xf * yf;
}

function fbm(x: number, y: number, octaves = 6) {
  let v = 0;
  let amp = 0.5;
  let f = 1;
  for (let i = 0; i < octaves; i++) {
    v += noise(x * f, y * f) * amp;
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

  const scale = 6;
  const heights = new Float32Array(w * h);

  for (let y = 0; y < h; y++) {
    /* latitude compression keeps the noise from pinching at the poles */
    const v = y / h;
    const lat = (v - 0.5) * Math.PI;
    const comp = Math.max(0.15, Math.cos(lat));
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const nx = u * scale * comp * 2;
      const ny = v * scale;
      /* domain warp: gives continents organic, non-blobby edges */
      const wx = fbm(nx + 5.2, ny + 1.3, 4);
      const wy = fbm(nx + 9.7, ny + 4.1, 4);
      let e = fbm(nx + wx * 0.9, ny + wy * 0.9, 6);
      e = Math.pow(Math.max(0, e * 1.25 - 0.18), 1.15);
      const micro = fbm(nx * 9, ny * 9, 3) * 0.16;
      heights[y * w + x] = Math.min(1, e + micro * e);
    }
  }

  for (let i = 0; i < w * h; i++) {
    const e = heights[i]!;
    const land = Math.min(1, Math.max(0, (e - 0.34) / 0.24));
    const ridge = Math.min(1, Math.max(0, (e - 0.62) / 0.3));
    const o = i * 4;

    /* ALBEDO — deep navy basins → graphite landmass → cool white ridges */
    const r = 8 + land * 44 + ridge * 92;
    const g = 13 + land * 52 + ridge * 100;
    const b = 26 + land * 62 + ridge * 108;
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
      if (hash(x * 1.7, y * 2.3) > 0.16) continue;
      const len = 6 + hash(x, y) * 26;
      const dir = hash(y, x) > 0.5 ? 0 : 1;
      ex.strokeStyle = `rgba(96,150,246,${0.35 + hash(x + 3, y) * 0.5})`;
      ex.beginPath();
      ex.moveTo(x, y);
      ex.lineTo(dir ? x + len : x, dir ? y : y + len);
      ex.stroke();
    }
  }
  /* a few long orbital-city arteries for scale */
  for (let i = 0; i < 26; i++) {
    const y0 = hash(i, 7) * h;
    ex.strokeStyle = `rgba(120,170,255,${0.14 + hash(i, 3) * 0.16})`;
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
