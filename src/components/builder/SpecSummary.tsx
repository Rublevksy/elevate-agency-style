/**
 * A concept's design system, shown without jargon: its real palette (with hex
 * values), its display and body faces set in themselves, and its hero layout
 * as a small schematic. Language-free on purpose — the enum names are the
 * renderer's vocabulary, not the visitor's.
 */
import type { DesignSpec } from "@/lib/builder/spec";
import { resolveTheme } from "./renderer/theme";

export function Swatches({ spec, size = "sm" }: { spec: DesignSpec; size?: "sm" | "lg" }) {
  const p = spec.palette;
  const colors = [p.background, p.surface, p.text, p.muted, p.accent];
  const dim = size === "lg" ? "size-9" : "size-5";
  return (
    <span className="inline-flex -space-x-1.5" aria-hidden>
      {colors.map((c, i) => (
        <span
          key={`${c}-${i}`}
          className={`${dim} rounded-full border border-white/20`}
          style={{ background: c }}
        />
      ))}
    </span>
  );
}

export function TypeSample({ spec }: { spec: DesignSpec }) {
  const t = resolveTheme(spec);
  return (
    <span aria-hidden className="inline-flex items-baseline gap-3 text-white">
      <span style={{ ...t.display, fontSize: "1.9rem", lineHeight: 1 }}>Aa</span>
      <span style={{ fontFamily: t.fonts.body, fontSize: "1rem", color: "rgb(255 255 255 / 0.6)" }}>
        Aa
      </span>
    </span>
  );
}

/** The hero layout as a 48×32 schematic. */
export function HeroGlyph({ hero }: { hero: DesignSpec["layout"]["hero"] }) {
  const ink = "bg-white/55";
  const media = "bg-primary/45";
  const box = "absolute rounded-[2px]";
  return (
    <span
      aria-hidden
      className="relative inline-block h-8 w-12 overflow-hidden rounded-[4px] border border-white/20 bg-white/[0.03]"
    >
      {hero === "split-media" && (
        <>
          <span className={`${box} ${ink} top-[30%] left-[10%] h-[10%] w-[34%]`} />
          <span className={`${box} ${ink} top-[48%] left-[10%] h-[8%] w-[24%] opacity-60`} />
          <span className={`${box} ${media} top-[18%] right-[8%] h-[64%] w-[38%]`} />
        </>
      )}
      {hero === "full-bleed-media" && (
        <>
          <span className={`${box} ${media} inset-0 rounded-none`} />
          <span className={`${box} bg-white/80 bottom-[22%] left-[10%] h-[10%] w-[46%]`} />
        </>
      )}
      {hero === "typographic" && (
        <>
          <span className={`${box} ${ink} top-[18%] left-[10%] h-[18%] w-[80%]`} />
          <span className={`${box} ${ink} top-[42%] left-[10%] h-[18%] w-[56%]`} />
          <span className={`${box} ${media} bottom-[10%] left-[10%] h-[14%] w-[80%]`} />
        </>
      )}
      {hero === "centered-statement" && (
        <>
          <span className={`${box} ${ink} top-[16%] left-[22%] h-[12%] w-[56%]`} />
          <span className={`${box} ${ink} top-[34%] left-[32%] h-[8%] w-[36%] opacity-60`} />
          <span className={`${box} ${media} bottom-[8%] left-[14%] h-[34%] w-[72%]`} />
        </>
      )}
      {hero === "offset-collage" && (
        <>
          <span className={`${box} ${ink} top-[34%] left-[8%] h-[12%] w-[30%]`} />
          <span className={`${box} ${media} top-[12%] left-[48%] h-[48%] w-[28%]`} />
          <span className={`${box} bg-primary/70 top-[46%] left-[66%] h-[40%] w-[24%]`} />
        </>
      )}
      {hero === "product-stage" && (
        <>
          <span className={`${box} ${ink} top-[14%] left-[10%] h-[12%] w-[36%]`} />
          <span className={`${box} bg-white/15 bottom-[10%] left-[10%] h-[44%] w-[80%]`} />
          <span
            className={`${box} ${media} bottom-[16%] left-[42%] h-[32%] w-[16%] rounded-t-[6px]`}
          />
        </>
      )}
    </span>
  );
}
