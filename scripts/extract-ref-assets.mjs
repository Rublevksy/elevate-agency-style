/**
 * Builds the production scene plates in src/assets/refs/ from the generated
 * masters in references/generated/.
 *
 * WHY THE SOURCE MOVED. The eight files in /references are finished poster
 * comps: Czech marketing copy baked into the raster, invented figures painted
 * onto the screens (+220% / +180% / +150%, "+2 482 users"), a third-party
 * trademark on a shoe, and a cartoon mascot in five of them. They were always
 * the art direction of record, never shippable pixels — PRODUCT.md principle 5
 * forbids fabricated metrics, and a baked headline hardcodes one language into
 * an image on a CZ/EN/RU/UA site.
 *
 * So the plates are now original photoreal renders, generated from those same
 * references through Higgsfield (nano_banana, reference-guided) so the approved
 * art direction survives intact — matte-black devices, honed black stone, one
 * cyan arc per frame, drifting light filaments, near-black void — while the
 * project owns the pixels. The posters stay in /references, untouched.
 *
 * Rules the masters follow. They are the design, not housekeeping:
 *
 * 1. The home hero is a SCENE, not a device cut-out. `hero-macbook` keeps the
 *    full frame so the arc, the plinth, the filaments and the air around the
 *    device all survive. Cropping tighter turns it into "a laptop in a box",
 *    which is the failure mode this file exists to prevent.
 * 2. The five service scenes are five takes of ONE room, shot at one focal
 *    length and one eye-line, each carrying exactly one blue emissive source.
 *    They share an output size (900x1342) so cutting between them reads as a
 *    camera finding another part of the same space, not as five unrelated
 *    pictures — which is what makes the hero → services handoff hold.
 * 3. No glyphs and no logos anywhere, in any master. Every headline, label and
 *    mark on top of these is live DOM, so one plate serves four languages.
 *
 * Run: node scripts/extract-ref-assets.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "fs";

const REF = "references/";
const OUT = "src/assets/refs/";
mkdirSync(OUT, { recursive: true });

/**
 * Hero masters — generated, full frame, no crop.
 *
 * The hero is the one place a crop of the poster cannot be used: its whole left
 * half is the Czech headline, and what remains after cutting the glyphs away is
 * too narrow to be a scene. So the hero plates are original renders built from
 * 01_HOME_DESKTOP_HERO.png and 05_HOME_MOBILE_HERO.png — same matte-black
 * device on dark stone, same single cyan arc, same drifting filaments, no text
 * and no logo, at a size the first screen can actually use.
 */
const MASTERS = [
  { src: "generated/hero-macbook-master.png", out: "hero-macbook", width: 1400 },
  { src: "generated/hero-iphone-master.png", out: "hero-iphone", width: 720 },
];

/** Shared frame for the five service scenes — see rule 2 below. */
const SVC = { left: 660, width: 594, height: 886 };

/**
 * Service scenes — cropped from the user's own reference posters.
 *
 * These five ARE the art direction, not an approximation of it: the mascot in
 * the ELEVATE hoodie, his room, his desk. They are cropped rather than
 * regenerated, and the crop is what makes them shippable:
 *
 * 1. Every baked glyph is excluded — the Czech headlines, the CTA buttons and
 *    the icon captions all sit outside the box, so one plate serves CZ/EN/RU/UA
 *    and the page keeps a real DOM heading.
 * 2. The five share one crop width and height (594x886), so the desk, window,
 *    wall sign and chair land in the same place on every frame; cutting between
 *    them then reads as a camera move inside one room. Only `top` is tuned per
 *    frame, to level the mascot's eye-line.
 * 3. `svc-seo` starts below y=368 for a second reason: the source monitor has
 *    invented figures painted on it (+220% / +180% / +150%) and PRODUCT.md
 *    principle 5 forbids fabricated metrics. The crop keeps the rising chart
 *    and excludes the numbers. The same rule puts the e-shop's third-party
 *    trademark outside `svc-eshop`.
 */
const ASSETS = [
  { src: "10_SERVICE_WEB_HERO.png", out: "svc-web", region: { ...SVC, top: 250 }, width: 900 },
  { src: "40_SERVICE_SEO_HERO.png", out: "svc-seo", region: { ...SVC, top: 368 }, width: 900 },
  { src: "20_SERVICE_ESHOP_HERO.png", out: "svc-eshop", region: { ...SVC, top: 180 }, width: 900 },
  {
    src: "50_SERVICE_BRANDING_HERO.png",
    out: "svc-branding",
    region: { ...SVC, top: 170 },
    width: 900,
  },
  { src: "30_SERVICE_APP_HERO.png", out: "svc-app", region: { ...SVC, top: 200 }, width: 900 },
];

/**
 * Depth layers for the home hero, derived from the same source frame.
 *
 * 01_HOME_DESKTOP_HERO.png is one flat raster, but it is not one flat scene:
 * measured over the crop, 57% of it is near-black void and the lit elements sit
 * in separate bands — the arc across the top (luminance 25-53 against 1-5), the
 * device mass in the middle (peaking at 171 on the lit lid edge), the light
 * waves down both sides (51-112), the stone at the foot. Two of those planes
 * can be pulled out honestly; one cannot.
 *
 * `hero-light` is a matte derived from the photograph's own luminance — no
 * drawn shape, no geometric mask. It carries the arc, the lid rim, the ELEVATE
 * engraving, the waves and the speckle on the stone, on soft alpha. It is
 * pixel-registered with the base plate, which is the whole point: composited at
 * zero offset it can be brightened and dimmed without any risk of ghosting.
 *
 * `hero-atmo` is the glow field with every recognisable edge blurred away. Its
 * light distribution *is* the reference's light distribution, so it can never
 * fight the composition, and because it holds no structure it can travel at its
 * own parallax rate with no visible misregistration.
 *
 * What is deliberately NOT extracted: the device itself. Its lid reads cleanly
 * against the background but the keyboard deck dissolves into the stone with no
 * edge, so an automatic matte would chew or halo exactly where the eye rests. A
 * cheap cut-out reads worse than none — so the device stays part of the base
 * plate and gets its depth from perspective instead.
 */
async function buildHeroLayers() {
  const src = sharp(REF + "generated/hero-macbook-master.png");

  const { data, info } = await src.clone().raw().toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;
  const rgba = Buffer.alloc(width * height * 4);
  // Everything below FLOOR is void and gets no alpha at all; the curve above it
  // is squared so only genuinely luminous pixels carry weight.
  const FLOOR = 42;
  const KNEE = 150;
  for (let p = 0; p < width * height; p++) {
    const i = p * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const lum = r * 0.299 + g * 0.587 + b * 0.114;
    const a = Math.min(1, Math.max(0, (lum - FLOOR) / (KNEE - FLOOR)));
    rgba[p * 4] = r;
    rgba[p * 4 + 1] = g;
    rgba[p * 4 + 2] = b;
    rgba[p * 4 + 3] = Math.round(a * a * 255);
  }
  // webp only, no raster fallback. The layer is purely additive — if it never
  // arrives the base plate still carries the light, because the light is in the
  // photograph. A 450 kB PNG fallback would cost more than the layer is worth.
  await sharp(rgba, { raw: { width, height, channels: 4 } })
    .resize({ width: 900 })
    .webp({ quality: 86, alphaQuality: 90 })
    .toFile(`${OUT}hero-light.webp`);

  // The atmosphere holds no detail, so it ships small on purpose.
  const atmo = src.clone().blur(28).modulate({ brightness: 0.85 }).resize({ width: 420 });
  await atmo.clone().webp({ quality: 82 }).toFile(`${OUT}hero-atmo.webp`);
  await atmo.clone().jpeg({ quality: 82, mozjpeg: true }).toFile(`${OUT}hero-atmo.jpg`);

  for (const name of ["hero-light.webp", "hero-atmo.jpg"]) {
    const m = await sharp(OUT + name).metadata();
    console.log(`${name}: ${m.width}x${m.height}`);
  }
}

for (const master of MASTERS) {
  const base = sharp(REF + master.src).resize({ width: master.width });
  await base.clone().webp({ quality: 88 }).toFile(`${OUT}${master.out}.webp`);
  await base.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(`${OUT}${master.out}.jpg`);
  const m = await sharp(`${OUT}${master.out}.jpg`).metadata();
  console.log(`${master.out}: ${m.width}x${m.height}`);
}

for (const asset of ASSETS) {
  const input = REF + asset.src;
  const meta = await sharp(input).metadata();
  const { left, top, width, height } = asset.region;
  if (left + width > meta.width || top + height > meta.height) {
    throw new Error(
      `${asset.src}: region ${left},${top} ${width}x${height} exceeds source ${meta.width}x${meta.height}`,
    );
  }

  const base = sharp(input).extract(asset.region).resize({ width: asset.width });
  await base.clone().webp({ quality: 88 }).toFile(`${OUT}${asset.out}.webp`);
  await base.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(`${OUT}${asset.out}.jpg`);

  const outMeta = await sharp(`${OUT}${asset.out}.jpg`).metadata();
  console.log(`${asset.out}: ${outMeta.width}x${outMeta.height}`);
}

await buildHeroLayers();
