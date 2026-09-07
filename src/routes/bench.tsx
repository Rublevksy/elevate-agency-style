import { createFileRoute } from "@tanstack/react-router";
import { useT } from "@/lib/i18n";
import { useMotionCapability } from "@/components/cinematic";
import { benchColor, benchType, benchRail, benchSpacing } from "@/lib/bench-tokens";
import { PROJECTS_BASE } from "@/lib/projects";

/**
 * /bench — T2 foundation QA harness for "THE PRODUCTION STRIP", not a scene.
 *
 * This is not a homepage candidate — it renders none of the six scenes (those
 * start at T5) and none of BenchRail's actual mechanics (T3: perforation,
 * latch). It exists so T2's token layer — self-hosted type, bench-tokens.ts,
 * the rail's CSS custom properties, G1 grain — has somewhere to be looked at
 * in a real browser instead of trusted from source. `noindex`: it is
 * dev-facing, never linked from Nav, and carries no product content of its
 * own — copy that IS content (headline, domain) comes from useT()/PROJECTS_BASE
 * per the project's i18n rule; the section labels around it are instrumentation,
 * not copy, so they stay plain English on purpose.
 *
 * `.bench-slate`/`.bench-tick` (src/styles/bench-foundation.css) carry the
 * typographic shorthand, not inline style objects: the `<480px` tracking
 * reduction TYPOGRAPHY.md §6 documents only exists if a real media query
 * applies it, and a value sitting in bench-tokens.ts that nothing reads does
 * not count — found by render on this exact page (see that file's comment).
 *
 * Self-contained: no Nav/Footer (see __root.tsx SiteShell's isBench check).
 */
export const Route = createFileRoute("/bench")({
  component: BenchPage,
  head: () => ({
    meta: [
      { title: "T2 foundation QA — ELEVATE bench" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

const LANGS = ["CZ", "EN", "RU", "UA"] as const;

function BenchPage() {
  const { lang, setLang, t } = useT();
  const capability = useMotionCapability();
  const client = PROJECTS_BASE[0];

  return (
    <div
      className="relative min-h-screen w-full overflow-x-hidden"
      style={{ background: benchColor.stock, color: benchColor.wax }}
    >
      <div className="bench-grain" aria-hidden="true" />

      <div
        className="relative mx-auto flex flex-col gap-10 px-6 py-12 md:px-10"
        style={{ maxWidth: benchSpacing.containerMaxWidth }}
      >
        {/* Instrumentation strip — not product copy. */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
          <span className="bench-slate" style={{ color: benchColor.wax, opacity: 0.7 }}>
            T2 foundation QA — not a scene
          </span>
          <div className="flex items-center gap-3">
            {LANGS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLang(l)}
                className="bench-tick"
                style={{
                  color: lang === l ? benchColor.ink : benchColor.wax,
                  opacity: lang === l ? 1 : 0.55,
                }}
              >
                {l}
              </button>
            ))}
          </div>
          <span className="bench-tick" style={{ opacity: 0.55 }}>
            motion: {capability}
          </span>
        </div>

        {/* Display role — real headline copy via useT(), not invented. Two
            real lines (title1/title2) exercise the multi-line behavior
            TYPOGRAPHY.md §5/§6 measured. */}
        <h1
          style={{
            fontFamily: benchType.frameTitle.fontFamily,
            fontWeight: benchType.frameTitle.fontWeight,
            fontSize: benchType.frameTitle.fontSize,
            letterSpacing: benchType.frameTitle.letterSpacing,
            lineHeight: benchType.frameTitle.lineHeight,
            color: benchColor.wax,
            margin: 0,
          }}
        >
          {t.hero.title1}
          <br />
          {t.hero.title2}
        </h1>

        {/* Body role — real subtitle copy. */}
        <p
          style={{
            fontFamily: benchType.frameBody.fontFamily,
            fontWeight: benchType.frameBody.fontWeight,
            fontSize: benchType.frameBody.fontSize,
            lineHeight: benchType.frameBody.lineHeight,
            color: benchColor.wax,
            opacity: 0.85,
            maxWidth: "42rem",
            margin: 0,
          }}
        >
          {t.hero.subtitle}
        </p>

        {/* Tick role — a real client domain, tabular, never caps (TYPOGRAPHY.md
            §4). Color is `ink`, not `inkDeep`: measured contrast vs `stock` is
            6.11:1 for `ink` but only 3.56:1 for `inkDeep` (fails WCAG AA 4.5:1
            at this text's 12px size) — `inkDeep` is a background-fill role
            for text-on-paint (VISUAL_LANGUAGE §1: "text set on inkDeep only"),
            not a foreground-on-stock color. Found by computing exact OKLCH→sRGB
            contrast, not by eye. */}
        <span className="bench-tick" style={{ color: benchColor.ink }}>
          {client.domain}
        </span>

        {/* The empty rail — CAMERA_SYSTEM §3/§5 geometry tokens, no frames or
            marks inside it yet (that is T3's BenchRail, not this page). */}
        <div>
          <span className="bench-slate mb-2 block" style={{ opacity: 0.55 }}>
            Rail (empty — --bench-rail-height, --bench-ink)
          </span>
          <div
            role="presentation"
            style={{
              height: benchRail.height,
              width: "100%",
              background: benchColor.ink,
            }}
          />
        </div>

        {/* Text-on-inkDeep contrast check — CRITIQUE_01 P5: never on plain ink. */}
        <div>
          <span className="bench-slate mb-2 block" style={{ opacity: 0.55 }}>
            on-ink text on ink-deep (contrast ≈ 6.0:1)
          </span>
          <div
            style={{
              padding: "1.5rem",
              background: benchColor.inkDeep,
              color: benchColor.onInk,
              fontFamily: benchType.frameBody.fontFamily,
              fontSize: benchType.frameBody.fontSize,
              lineHeight: benchType.frameBody.lineHeight,
            }}
          >
            {t.hero.subtitle}
          </div>
        </div>
      </div>
    </div>
  );
}
