/**
 * The one generated plate this prototype uses — candidate 6 from
 * `docs/creative-rebuild/WEB_VISUAL_PROOF.md` ("the browser-portal").
 *
 * A local sibling of `SceneImage`, not an addition to it: `SceneImage`'s
 * registry is generated exclusively by `scripts/extract-ref-assets.mjs` from
 * `/references/`, and this asset did not come through that pipeline — it is
 * an unreviewed prototype candidate, not a production plate. Keeping it in
 * its own component means promoting or discarding it later touches nothing
 * shared.
 */
import candidate6Webp from "@/assets/proto/candidate6.webp";
import candidate6Jpg from "@/assets/proto/candidate6.jpg";

export function ProtoCandidate6Image({
  className,
  imgClassName,
  priority = false,
}: {
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  return (
    <picture className={className}>
      <source type="image/webp" srcSet={candidate6Webp} />
      <img
        src={candidate6Jpg}
        alt=""
        width={2400}
        height={1340}
        decoding="async"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : undefined}
        className={imgClassName}
      />
    </picture>
  );
}
