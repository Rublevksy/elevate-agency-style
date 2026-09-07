/**
 * Builds G1 — the film-grain overlay for "THE PRODUCTION STRIP" — as a
 * deterministic, seamlessly-tileable PNG. See docs/creative-rebuild/ASSET_PLAN.md
 * §1: grain must tile, and a generated (photographed or AI) raster does not,
 * so this is procedural, not an asset pulled from Higgsfield or a reference.
 *
 * WHY A SEEDED PRNG, NOT Math.random(). The plate is checked into git; running
 * this script twice must produce byte-identical output, or a routine rebuild
 * would show up as an unexplained diff. mulberry32 seeded with a fixed
 * constant guarantees that.
 *
 * WHY A WRAPPED (CIRCULAR) BLUR, NOT A SHARP BOX BLUR AT THE EDGES. Independent
 * per-pixel noise already tiles — there is no spatial correlation to break at a
 * seam — but it reads as TV static, not film grain (VISUAL_LANGUAGE §3.1: "не
 * как случайный шум поверх страницы"). A small blur gives grain its clumped,
 * material look, but a normal blur softens the four edges unevenly against
 * their neighbours. Sampling with indices wrapped modulo the plate size makes
 * the blur itself circular, so the tile is exactly as smooth across a seam as
 * it is anywhere else in the field.
 *
 * Output: RGB is flat white; only alpha carries the noise. Composited at
 * `opacity: 0.10` over `stock` (VISUAL_LANGUAGE §3.1) that reads as light
 * speckle on true black without a second color entering the palette.
 *
 * Run: node scripts/generate-bench-grain.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "fs";

const OUT_DIR = "src/assets/bench/";
mkdirSync(OUT_DIR, { recursive: true });

// Fixed seed — "ELEVATE" leetified. Never randomize; see header note.
const SEED = 0xe1e5a7e;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * One tileable grain field at `size`×`size`. `size` must stay the same for
 * every call sharing a seed if the 1x/2x plates are meant to look like the same
 * grain at two densities rather than two different textures.
 */
function buildGrainField(size) {
  const rand = mulberry32(SEED);
  const raw = new Float32Array(size * size);
  for (let i = 0; i < raw.length; i++) raw[i] = rand();

  // Circular 3x3 box blur — clumps the static into grain without breaking the
  // tile seam (see header note).
  const blurred = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let sum = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const sx = (x + dx + size) % size;
          const sy = (y + dy + size) % size;
          sum += raw[sy * size + sx];
        }
      }
      blurred[y * size + x] = sum / 9;
    }
  }

  // Stretch contrast back out — the box blur compresses the range toward the
  // mean, and flat grain is invisible grain.
  let min = Infinity;
  let max = -Infinity;
  for (const v of blurred) {
    if (v < min) min = v;
    if (v > max) max = v;
  }
  const range = max - min || 1;

  // Alpha ceiling below 255: real film grain never fully opaques a fleck, and
  // composited at layer opacity 0.10 a full 0-255 spread wastes headroom on
  // near-black already-invisible steps. 168 keeps the brightest flecks
  // readable at 100% zoom (VISUAL_LANGUAGE §3.1) without a harsh salt-and-
  // pepper ceiling.
  const ALPHA_CEILING = 168;
  const rgba = Buffer.alloc(size * size * 4);
  for (let p = 0; p < blurred.length; p++) {
    const norm = (blurred[p] - min) / range; // 0..1
    const alpha = Math.round(norm * ALPHA_CEILING);
    rgba[p * 4] = 255;
    rgba[p * 4 + 1] = 255;
    rgba[p * 4 + 2] = 255;
    rgba[p * 4 + 3] = alpha;
  }
  return rgba;
}

async function build() {
  const plates = [
    { size: 256, out: "grain-g1.webp" },
    { size: 512, out: "grain-g1@2x.webp" },
  ];
  for (const plate of plates) {
    const rgba = buildGrainField(plate.size);
    // Lossy webp: noise has no structure to protect, so quantization artifacts
    // are indistinguishable from the grain itself, and it drops the tile from
    // ~74-285 KB (PNG, DEFLATE barely compresses noise) to ~20-80 KB.
    await sharp(rgba, { raw: { width: plate.size, height: plate.size, channels: 4 } })
      .webp({ quality: 60, alphaQuality: 50, effort: 6 })
      .toFile(`${OUT_DIR}${plate.out}`);
    const m = await sharp(`${OUT_DIR}${plate.out}`).metadata();
    console.log(`${plate.out}: ${m.width}x${m.height}, alpha=${m.hasAlpha}`);
  }
}

build();
