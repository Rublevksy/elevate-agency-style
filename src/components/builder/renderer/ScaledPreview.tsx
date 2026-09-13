/**
 * A concept rendered at a real device width and scaled to fit its frame.
 *
 * The renderer lays out by container width, so a thumbnail rendered at its
 * on-screen size (~400px) would show the PHONE layout. Instead the concept is
 * laid out at `width` (1280 = a laptop) and scaled with a transform: the
 * gallery shows the desktop composition, in miniature, exactly as it lays out
 * full size.
 *
 * `crop` clips to a viewport-shaped window (a thumbnail); without it the
 * whole page is shown and the frame takes the scaled page's height.
 *
 * The preview is depiction: it is `aria-hidden`, and whatever shows it must
 * describe the concept in text alongside.
 */
import { useLayoutEffect, useRef, useState } from "react";
import type { DesignSpec } from "@/lib/builder/spec";
import { ConceptRenderer, type RendererCopy } from "./ConceptRenderer";

export function ScaledPreview({
  spec,
  brand,
  tagline,
  copy,
  width = 1280,
  crop,
  variant = "page",
  animate = false,
  className = "",
}: {
  spec: DesignSpec;
  brand: string;
  tagline: string;
  copy: RendererCopy;
  width?: number;
  /** Height of the visible window at `width`, e.g. 800 for a 16:10 laptop screen. */
  crop?: number;
  variant?: "page" | "thumbnail";
  animate?: boolean;
  className?: string;
}) {
  const outer = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const [height, setHeight] = useState(crop ?? 0);

  useLayoutEffect(() => {
    const o = outer.current;
    const i = inner.current;
    if (!o || !i) return;
    const sync = () => {
      setScale(o.clientWidth / width);
      if (!crop) setHeight(i.scrollHeight);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(o);
    ro.observe(i);
    return () => ro.disconnect();
  }, [width, crop]);

  return (
    <div
      ref={outer}
      aria-hidden
      className={`relative w-full overflow-hidden ${className}`}
      style={{
        height: scale ? height * scale : undefined,
        aspectRatio: scale ? undefined : `${width} / ${crop ?? width * 0.625}`,
      }}
    >
      <div
        ref={inner}
        className="absolute top-0 left-0 origin-top-left"
        style={{
          width,
          transform: `scale(${scale || 0.0001})`,
          visibility: scale ? "visible" : "hidden",
        }}
      >
        <ConceptRenderer
          spec={spec}
          brand={brand}
          tagline={tagline}
          copy={copy}
          variant={variant}
          animate={animate}
        />
      </div>
    </div>
  );
}
