/**
 * The ELEVATE wordmark.
 *
 * The source PNG is 268 KB — measured as the single heaviest asset on the
 * homepage, heavier than the 2400px portal plate (111 KB), and it is eager and
 * above the fold on every page. It is served through a <picture> with a webp
 * cut of the same artwork, so the mark is byte-for-byte the same design while
 * costing a fraction of the bytes. The PNG stays as the fallback source.
 *
 * `elevate-logo.svg` exists in the tree but draws a different (stencil)
 * treatment of the mark, so it is deliberately NOT used here: swapping it in
 * would change the brand, not just the file size.
 */
import logoWebp from "@/assets/elevate-logo.webp";
import logoPng from "@/assets/elevate-logo.png";

export function Logo({
  className = "h-8 w-auto",
  alt = "ELEVATE — Digital Studio",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <picture>
      <source type="image/webp" srcSet={logoWebp} />
      <img
        src={logoPng}
        alt={alt}
        width={700}
        height={140}
        className={className}
        loading="eager"
        decoding="async"
      />
    </picture>
  );
}

export default Logo;
