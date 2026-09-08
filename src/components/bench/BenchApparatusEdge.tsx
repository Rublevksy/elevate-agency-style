import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { benchColor } from "@/lib/bench-tokens";
import { BenchPerforation } from "./BenchPerforation";

const LANGS = ["CZ", "EN", "RU", "UA"] as const;

export interface BenchApparatusEdgeProps {
  activeIndex: number;
  frameCount: number;
  pitchPx: number;
}

/**
 * SCENE 00 — THE APPARATUS (STORYBOARD.md). Not a scene in the sense the
 * other five are: "не сцена, а кромка рельса поверх всех шести" — the top
 * edge of the rail itself, persistent across everything below it, carrying
 * the page's only navigational chrome. Same material as the rail (paint +
 * perforation), never a panel or a card floating above it — L4 (no card
 * anywhere in this world) applies to this exactly as much as to a frame.
 *
 * STORYBOARD's full spec also asks for a phone number (`tel:`) and an action
 * link to a builder scene. Both are cut here, disclosed, not silently
 * dropped: no real studio phone number exists anywhere in this codebase —
 * PRODUCT.md explicitly lists phone numbers among the business facts this
 * project never fabricates, and the only string matching that shape
 * anywhere in i18n is a form-field *placeholder* ("+420 777 123 456"), not a
 * real contact number. The builder scene doesn't exist yet on this lab route
 * either. Logo, language, and position all come from data that already
 * exists — the two cuts are the two cells with nothing real to put in them.
 *
 * Position is a readout, not yet a control: STORYBOARD calls the clickable
 * version "the incumbent's best invention, brought back," but only scenes
 * 00/01 exist to jump between right now — wiring real jump-navigation before
 * there is a scene 02-06 to jump to is exactly the "не финальный дизайн"
 * over-build T5's own brief warns against.
 */
export function BenchApparatusEdge({ activeIndex, frameCount, pitchPx }: BenchApparatusEdgeProps) {
  const { lang, setLang } = useT();

  return (
    <div
      className="absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-4 px-4 py-2.5 sm:px-6"
      style={{ background: benchColor.stock }}
    >
      <span className="bench-label-text shrink-0">
        <Logo className="h-4 w-auto sm:h-5" />
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
      <span className="bench-tick shrink-0" style={{ color: benchColor.wax, opacity: 0.7 }}>
        {String(activeIndex + 1).padStart(2, "0")} / {String(frameCount).padStart(2, "0")}
      </span>
      {pitchPx > 0 && (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 overflow-hidden"
          style={{ height: pitchPx * 0.16 }}
        >
          <BenchPerforation orientation="horizontal" pitchPx={pitchPx} count={24} />
        </div>
      )}
    </div>
  );
}
