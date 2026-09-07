/**
 * Presentation layer for the art-direction scenes in src/assets/refs/.
 *
 * These are photographic plates cut from the approved references by
 * scripts/extract-ref-assets.mjs. They carry no typography at all — every
 * headline, label and CTA on top of them is live DOM, so the same plate serves
 * CZ/EN/RU/UA. Never render a whole reference poster instead of one of these.
 *
 * Imports are static on purpose: a runtime-built path string would not be
 * picked up by Vite's asset graph and would 404 in a production build.
 */
import heroMacbookWebp from "@/assets/refs/hero-macbook.webp";
import heroMacbookJpg from "@/assets/refs/hero-macbook.jpg";
import heroIphoneWebp from "@/assets/refs/hero-iphone.webp";
import heroIphoneJpg from "@/assets/refs/hero-iphone.jpg";
import svcWebWebp from "@/assets/refs/svc-web.webp";
import svcWebJpg from "@/assets/refs/svc-web.jpg";
import svcEshopWebp from "@/assets/refs/svc-eshop.webp";
import svcEshopJpg from "@/assets/refs/svc-eshop.jpg";
import svcAppWebp from "@/assets/refs/svc-app.webp";
import svcAppJpg from "@/assets/refs/svc-app.jpg";
import svcSeoWebp from "@/assets/refs/svc-seo.webp";
import svcSeoJpg from "@/assets/refs/svc-seo.jpg";
import svcBrandingWebp from "@/assets/refs/svc-branding.webp";
import svcBrandingJpg from "@/assets/refs/svc-branding.jpg";
import heroLightWebp from "@/assets/refs/hero-light.webp";
import heroAtmoWebp from "@/assets/refs/hero-atmo.webp";
import heroAtmoJpg from "@/assets/refs/hero-atmo.jpg";

export type SceneName =
  | "hero-macbook"
  | "hero-iphone"
  | "svc-web"
  | "svc-eshop"
  | "svc-app"
  | "svc-seo"
  | "svc-branding"
  /* Depth layers pulled from the hero frame — see scripts/extract-ref-assets.mjs. */
  | "hero-light"
  | "hero-atmo";

interface SceneAsset {
  webp: string;
  /** Omitted for layers that carry alpha and ship webp-only. */
  jpg?: string;
  /** Natural pixel size of the emitted file (crop aspect x output width). */
  width: number;
  height: number;
}

/**
 * Natural sizes come from the crop regions in scripts/extract-ref-assets.mjs.
 * They are stamped onto the <img> so the browser reserves the right box before
 * the file arrives (no CLS). The five svc-* plates share one size on purpose —
 * that is what makes switching between them read as a camera cut in one room.
 */
const SCENES: Record<SceneName, SceneAsset> = {
  "hero-macbook": { webp: heroMacbookWebp, jpg: heroMacbookJpg, width: 1400, height: 1738 },
  "hero-iphone": { webp: heroIphoneWebp, jpg: heroIphoneJpg, width: 720, height: 1290 },
  "svc-web": { webp: svcWebWebp, jpg: svcWebJpg, width: 900, height: 1342 },
  "svc-seo": { webp: svcSeoWebp, jpg: svcSeoJpg, width: 900, height: 1342 },
  "svc-eshop": { webp: svcEshopWebp, jpg: svcEshopJpg, width: 900, height: 1342 },
  "svc-branding": { webp: svcBrandingWebp, jpg: svcBrandingJpg, width: 900, height: 1342 },
  "svc-app": { webp: svcAppWebp, jpg: svcAppJpg, width: 900, height: 1342 },
  "hero-light": { webp: heroLightWebp, width: 900, height: 1117 },
  "hero-atmo": { webp: heroAtmoWebp, jpg: heroAtmoJpg, width: 420, height: 521 },
};

export interface SceneImageProps {
  name: SceneName;
  /** Describe the depicted scene; these plates carry no baked-in text. */
  alt: string;
  /** Applied to the <picture> wrapper. */
  className?: string;
  /** Applied to the <img> itself — use it to override the rendered size. */
  imgClassName?: string;
  /** Above the fold: eager + high fetch priority. Everything else stays lazy. */
  priority?: boolean;
  sizes?: string;
  style?: React.CSSProperties;
}

export function SceneImage({
  name,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes,
  style,
}: SceneImageProps) {
  const asset = SCENES[name];
  return (
    <picture className={className} style={style}>
      {asset.jpg ? <source type="image/webp" srcSet={asset.webp} sizes={sizes} /> : null}
      <img
        src={asset.jpg ?? asset.webp}
        alt={alt}
        width={asset.width}
        height={asset.height}
        sizes={sizes}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={imgClassName}
      />
    </picture>
  );
}

export default SceneImage;
