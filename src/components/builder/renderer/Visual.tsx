/**
 * An image area in a concept — deliberately NOT an image.
 *
 * A concept has no real photography of the client, and a generated or stock
 * photo would read as a promise of it. So every image slot is an art-directed
 * placeholder built from the concept's own palette and imagery direction
 * (photography / illustration / abstract / product / texture / type-only),
 * carrying a caption that says what the image would show. It reads as design,
 * and it is unmistakably a placeholder.
 */
import type { CSSProperties } from "react";
import { seeded, type Theme } from "./theme";

export function Visual({
  theme,
  slot,
  brand,
  caption,
  label,
  className = "",
  style,
}: {
  theme: Theme;
  /** Distinguishes slots within one concept, so compositions vary but never reshuffle. */
  slot: string;
  brand: string;
  /** Show the "what this image would be" caption. */
  caption?: boolean;
  label: string;
  className?: string;
  style?: CSSProperties;
}) {
  const { spec } = theme;
  const rnd = seeded(`${spec.id}:${slot}`);
  const r = () => rnd();
  const filter =
    spec.imagery.treatment === "monochrome"
      ? "grayscale(1)"
      : spec.imagery.treatment === "high-contrast"
        ? "contrast(1.22) saturate(1.15)"
        : undefined;

  return (
    <div
      aria-hidden
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: theme.mediaRadius, background: "var(--c-surface)", ...style }}
    >
      <div className="absolute inset-0" style={{ filter }}>
        {spec.imagery.style === "photography" && (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${150 + r() * 40}deg, var(--c-surface) 0%, var(--c-accent-soft) 55%, ${theme.alpha(spec.palette.text, 0.28)} 100%)`,
              }}
            />
            <div
              className="absolute rounded-full"
              style={{
                width: "70%",
                aspectRatio: "1",
                left: `${10 + r() * 40}%`,
                top: `${-20 + r() * 20}%`,
                background: `radial-gradient(circle, ${theme.alpha("#ffffff", 0.35)}, transparent 65%)`,
              }}
            />
            <div
              className="absolute inset-x-0 bottom-0"
              style={{
                height: `${30 + r() * 20}%`,
                background: `linear-gradient(to top, ${theme.alpha(spec.palette.text, 0.35)}, transparent)`,
              }}
            />
            <div
              className="absolute"
              style={{
                left: `${15 + r() * 35}%`,
                bottom: "18%",
                width: `${22 + r() * 18}%`,
                height: `${38 + r() * 22}%`,
                borderRadius: theme.mediaRadius ? "40% 40% 8% 8%" : 0,
                background: `linear-gradient(to bottom, ${theme.alpha(spec.palette.text, 0.22)}, ${theme.alpha(spec.palette.text, 0.42)})`,
              }}
            />
            <div
              className="absolute inset-0 opacity-60"
              style={{
                backgroundImage: `repeating-linear-gradient(0deg, ${theme.alpha("#000000", 0.03)} 0 1px, transparent 1px 3px)`,
              }}
            />
          </>
        )}

        {spec.imagery.style === "illustration" && (
          <>
            <div
              className="absolute rounded-full"
              style={{
                width: "62%",
                aspectRatio: "1",
                right: `${-8 + r() * 10}%`,
                top: `${-10 + r() * 14}%`,
                background: "var(--c-accent)",
              }}
            />
            <div
              className="absolute"
              style={{
                width: "48%",
                aspectRatio: "2 / 1",
                left: `${4 + r() * 12}%`,
                bottom: "-2%",
                borderRadius: "999px 999px 0 0",
                background: theme.alpha(spec.palette.text, 0.85),
              }}
            />
            <div
              className="absolute"
              style={{
                width: "22%",
                aspectRatio: "1",
                left: `${40 + r() * 20}%`,
                top: `${30 + r() * 20}%`,
                transform: `rotate(${r() * 40 - 20}deg)`,
                borderRadius: theme.radius > 10 ? 12 : 0,
                background: "var(--c-muted)",
              }}
            />
          </>
        )}

        {spec.imagery.style === "abstract-shapes" && (
          <>
            <div className="absolute inset-0" style={{ background: "var(--c-bg)" }} />
            <div
              className="absolute rounded-full blur-2xl"
              style={{
                width: "80%",
                aspectRatio: "1",
                left: `${-10 + r() * 30}%`,
                top: `${-10 + r() * 30}%`,
                background: "var(--c-accent)",
                opacity: 0.75,
              }}
            />
            <div
              className="absolute rounded-full blur-xl"
              style={{
                width: "46%",
                aspectRatio: "1",
                right: "-6%",
                bottom: "-10%",
                background: "var(--c-muted)",
                opacity: 0.55,
              }}
            />
            <div
              className="absolute"
              style={{
                width: "38%",
                aspectRatio: "1",
                left: "34%",
                top: "30%",
                transform: `rotate(${12 + r() * 30}deg)`,
                border: `1.5px solid ${theme.alpha(spec.palette.text, 0.55)}`,
                borderRadius: theme.radius > 10 ? "30%" : 0,
              }}
            />
          </>
        )}

        {spec.imagery.style === "product-cutout" && (
          <>
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(120% 90% at 50% 20%, var(--c-surface), ${theme.alpha(spec.palette.text, 0.12)})`,
              }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2 rounded-[50%] blur-md"
              style={{
                bottom: "12%",
                width: "46%",
                height: "8%",
                background: theme.alpha("#000000", 0.3),
              }}
            />
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{
                bottom: "16%",
                width: `${24 + r() * 10}%`,
                height: `${52 + r() * 12}%`,
                borderRadius: `${18 + r() * 30}% ${18 + r() * 30}% 14% 14%`,
                background: `linear-gradient(120deg, var(--c-accent), ${theme.alpha(spec.palette.text, 0.55)})`,
                boxShadow: `inset 8px 0 18px ${theme.alpha("#ffffff", 0.25)}`,
              }}
            />
          </>
        )}

        {spec.imagery.style === "texture" && (
          <>
            <div className="absolute inset-0" style={{ background: "var(--c-accent-soft)" }} />
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  r() > 0.5
                    ? `repeating-linear-gradient(${30 + r() * 90}deg, ${theme.alpha(spec.palette.text, 0.14)} 0 1px, transparent 1px 11px)`
                    : `radial-gradient(${theme.alpha(spec.palette.text, 0.22)} 1.2px, transparent 1.4px)`,
                backgroundSize: "auto, 14px 14px",
              }}
            />
            <div
              className="absolute"
              style={{
                inset: "18%",
                border: `1px solid ${theme.alpha(spec.palette.text, 0.3)}`,
                borderRadius: theme.mediaRadius,
              }}
            />
          </>
        )}

        {spec.imagery.style === "type-only" &&
          (() => {
            // Three compositions of the brand's initial, chosen per slot, so a
            // row of type-only tiles is a set and not one letter repeated.
            const variant = Math.floor(r() * 3);
            const letter = brand.trim().charAt(0) || "·";
            return (
              <>
                <div className="absolute inset-0" style={{ background: "var(--c-surface)" }} />
                {variant === 0 && (
                  <span
                    className="absolute right-[-4%] bottom-[-18%] leading-none select-none"
                    style={{
                      ...theme.display,
                      fontSize: "min(150cqi, 22em)",
                      color: "var(--c-accent)",
                      opacity: 0.9,
                    }}
                  >
                    {letter}
                  </span>
                )}
                {variant === 1 && (
                  <span
                    className="absolute inset-0 grid place-items-center leading-none select-none"
                    style={{
                      ...theme.display,
                      fontSize: "min(90cqi, 14em)",
                      color: "transparent",
                      WebkitTextStroke: `1.5px ${spec.palette.accent}`,
                    }}
                  >
                    {letter}
                  </span>
                )}
                {variant === 2 && (
                  <>
                    <span
                      className="absolute top-[8%] left-[8%] leading-none select-none"
                      style={{
                        ...theme.display,
                        fontSize: "min(60cqi, 9em)",
                        color: "var(--c-text)",
                        opacity: 0.85,
                      }}
                    >
                      {letter}
                    </span>
                    <span
                      className="absolute right-[8%] bottom-[10%] left-[8%] h-px"
                      style={{ background: "var(--c-accent)" }}
                    />
                  </>
                )}
              </>
            );
          })()}
      </div>

      {spec.imagery.treatment === "duotone" && (
        <div
          className="absolute inset-0 mix-blend-color"
          style={{ background: "var(--c-accent)", opacity: 0.55 }}
        />
      )}

      {caption && (
        <span
          className="absolute bottom-[4%] left-[4%] max-w-[88%] truncate"
          style={{
            fontFamily: theme.fonts.body,
            fontSize: theme.size.small,
            padding: "0.35em 0.7em",
            borderRadius: Math.min(theme.radius, 8),
            color: "var(--c-text)",
            background: theme.alpha(spec.palette.background, 0.78),
          }}
        >
          {label} · {spec.imagery.subject}
        </span>
      )}
    </div>
  );
}
