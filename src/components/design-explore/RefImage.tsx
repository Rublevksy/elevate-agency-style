/**
 * Shared presentation layer for the reference artwork in src/assets/refs/.
 *
 * All four exploration directions render reference imagery through this one
 * component so that <picture>/webp/lazy-loading/intrinsic sizing are not
 * reinvented four different ways. It knows nothing about any direction's
 * layout — sizing is overridden from above via className/imgClassName.
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

export type RefName =
  | "hero-macbook"
  | "hero-iphone"
  | "svc-web"
  | "svc-eshop"
  | "svc-app"
  | "svc-seo"
  | "svc-branding";

interface RefAsset {
  webp: string;
  jpg: string;
  /** Natural pixel size of the emitted file (crop aspect × output width). */
  width: number;
  height: number;
}

/**
 * Natural sizes come from the crop regions in scripts/extract-ref-assets.mjs,
 * scaled to that asset's output width. They are stamped onto the <img> so the
 * browser reserves the right box before the file arrives (no CLS).
 */
const REF_ASSETS: Record<RefName, RefAsset> = {
  // 876×830 crop → 1200w
  "hero-macbook": { webp: heroMacbookWebp, jpg: heroMacbookJpg, width: 1200, height: 1137 },
  // 386×483 crop → 700w
  "hero-iphone": { webp: heroIphoneWebp, jpg: heroIphoneJpg, width: 700, height: 876 },
  // 606×1010 crop → 820w
  "svc-web": { webp: svcWebWebp, jpg: svcWebJpg, width: 820, height: 1367 },
  // 648×1010 crop → 820w
  "svc-eshop": { webp: svcEshopWebp, jpg: svcEshopJpg, width: 820, height: 1278 },
  // 644×1010 crop → 820w
  "svc-app": { webp: svcAppWebp, jpg: svcAppJpg, width: 820, height: 1286 },
  // 654×784 crop → 820w
  "svc-seo": { webp: svcSeoWebp, jpg: svcSeoJpg, width: 820, height: 983 },
  // 634×1010 crop → 820w
  "svc-branding": { webp: svcBrandingWebp, jpg: svcBrandingJpg, width: 820, height: 1306 },
};

export interface RefImageProps {
  name: RefName;
  /** Describe the depicted scene; these images carry no baked-in text. */
  alt: string;
  /** Applied to the <picture> wrapper. */
  className?: string;
  /** Applied to the <img> itself — use it to override the rendered size. */
  imgClassName?: string;
  /** Above the fold: eager + high fetch priority. Everything else stays lazy. */
  priority?: boolean;
  sizes?: string;
}

export function RefImage({
  name,
  alt,
  className,
  imgClassName,
  priority = false,
  sizes,
}: RefImageProps) {
  const asset = REF_ASSETS[name];
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={asset.webp} sizes={sizes} />
      <img
        src={asset.jpg}
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

export default RefImage;
