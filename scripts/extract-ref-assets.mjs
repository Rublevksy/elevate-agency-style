/**
 * Extracts clean, text-free visual assets from the art-direction references in
 * /references into src/assets/refs/.
 *
 * Why this exists: the reference PNGs are finished poster comps — device shots,
 * mascot scenes and light effects with Czech marketing copy baked into the
 * raster. Shipping them whole would hardcode one language into an image
 * (the site is CZ/EN/RU/UA) and duplicate every headline the page already
 * renders as live text. So each asset is cropped to the *pictorial* region
 * only, leaving all typography to the DOM.
 *
 * Run: node scripts/extract-ref-assets.mjs
 */
import sharp from "sharp";
import { mkdirSync } from "fs";

const REF = "references/";
const OUT = "src/assets/refs/";
mkdirSync(OUT, { recursive: true });

/** Crop regions, in source pixels, chosen to exclude every baked-in glyph. */
const ASSETS = [
  // --- Home hero devices (text-free) ---
  {
    src: "01_HOME_DESKTOP_HERO.png",
    out: "hero-macbook",
    // 1536x1024 — right-hand device on its stone plinth, past the copy column
    region: { left: 660, top: 120, width: 876, height: 830 },
    width: 1200,
  },
  {
    src: "05_HOME_MOBILE_HERO.png",
    out: "hero-iphone",
    // 1672x941 — the phone on stone. Starts below the copy block and stops
    // short of the source's right-hand letterbox bar.
    region: { left: 790, top: 458, width: 386, height: 483 },
    width: 700,
  },
  // --- Service mascot scenes ---
  // Framed mascot-forward on purpose. The source comps put invented figures on
  // the depicted screens (+220% / +2,482 users / "2 499 Kč"), and PRODUCT.md
  // forbids fabricated metrics; keeping the character dominant stops those
  // numbers from reading as claims the page is making. Any that survive at the
  // edge of frame are flagged for replacement with real data before production.
  {
    src: "10_SERVICE_WEB_HERO.png",
    out: "svc-web",
    region: { left: 648, top: 130, width: 606, height: 1010 },
    width: 820,
  },
  {
    src: "20_SERVICE_ESHOP_HERO.png",
    out: "svc-eshop",
    region: { left: 606, top: 130, width: 648, height: 1010 },
    width: 820,
  },
  {
    src: "30_SERVICE_APP_HERO.png",
    out: "svc-app",
    region: { left: 610, top: 110, width: 644, height: 1010 },
    width: 820,
  },
  {
    src: "40_SERVICE_SEO_HERO.png",
    out: "svc-seo",
    region: { left: 600, top: 470, width: 654, height: 784 },
    width: 820,
  },
  {
    src: "50_SERVICE_BRANDING_HERO.png",
    out: "svc-branding",
    region: { left: 620, top: 130, width: 634, height: 1010 },
    width: 820,
  },
];

for (const { src, out, region, width } of ASSETS) {
  const meta = await sharp(REF + src).metadata();
  // Clamp so a mis-measured region fails loudly rather than silently shifting.
  if (
    region.left + region.width > meta.width ||
    region.top + region.height > meta.height
  ) {
    throw new Error(
      `${src}: region ${JSON.stringify(region)} exceeds ${meta.width}x${meta.height}`
    );
  }
  const base = sharp(REF + src).extract(region).resize({ width });
  await base.clone().webp({ quality: 88 }).toFile(`${OUT}${out}.webp`);
  await base.clone().jpeg({ quality: 88, mozjpeg: true }).toFile(`${OUT}${out}.jpg`);
  console.log(`${out}: ${region.width}x${region.height} → ${width}w (webp + jpg)`);
}
