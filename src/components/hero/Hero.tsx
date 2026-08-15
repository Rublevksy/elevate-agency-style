import heroArtwork from "@/assets/elevate-hero.png.asset.json";

/**
 * ELEVATE HERO — the approved reference artwork, shipped as a single static
 * image. No WebGL, no CSS recreation, no overlays: the artwork is the hero.
 */
export function Hero() {
  return (
    <section className="relative w-full" aria-label="ELEVATE">
      <img
        src={heroArtwork.url}
        alt="ELEVATE — digitální studio: weby, e-shopy a aplikace"
        width={1536}
        height={1024}
        fetchPriority="high"
        decoding="async"
        className="block h-auto w-full"
      />
    </section>
  );
}
