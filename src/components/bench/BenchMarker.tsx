import { benchColor } from "@/lib/bench-tokens";

export type BenchFrameState = "pending" | "active" | "completed";

export interface BenchMarkerProps {
  state: BenchFrameState;
  /** Independent of `state`: whether this frame is the visitor's explicit
   *  manual pick (click/Enter), not the one scroll happens to be nearest.
   *  Orthogonal on purpose — see BenchFrame.tsx's header comment. */
  selected: boolean;
  /** Real, existing UI strings — not a new i18n key. See BenchFrame.tsx. */
  labels: { pending: string; active: string; completed: string; selected: string };
}

/**
 * Four physical states, distinguished by shape and paint, not by four
 * unrelated colors (T3 §8). This is deliberately abstract geometry — the five
 * ornate marks (wax cross, ribbon, flag, pin, punched corner) are T4's job
 * per IMPLEMENTATION_PLAN; building them here would be scope creep into a
 * step that also has its own contrast/keyboard acceptance gate.
 *
 * The caption is real visible text at every width, not just on mobile
 * (VISUAL_LANGUAGE §5's rule is a floor, not a ceiling): a shape-only signal
 * is easy to misread at a glance, and the text IS the accessible name — no
 * separate `aria-label`/`sr-only` duplicate to fall out of sync with it.
 */
export function BenchMarker({ state, selected, labels }: BenchMarkerProps) {
  const label = selected ? labels.selected : labels[state];

  return (
    <span className="inline-flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className="shrink-0">
        {state === "completed" && (
          <path
            d="M3 7.5L5.7 10.2L11 4"
            fill="none"
            stroke={benchColor.ink}
            strokeWidth="1.6"
            strokeLinecap="square"
          />
        )}
        {state === "active" && <circle cx="7" cy="7" r="4.5" fill={benchColor.ink} />}
        {state === "pending" && (
          // stroke is white at 33% alpha, not `benchColor.edge` (14% —
          // the shared hairline token used for borders/perforation): at
          // 14% this ring measured 1.51:1 against `stockLift`, under the
          // 3:1 WCAG 1.4.11 floor for a graphical state indicator. 33% is
          // the measured minimum for 3:1; the shared `edge` token is left
          // alone since its other uses (borders, perforation) are not text
          // or state-carrying graphics.
          <circle cx="7" cy="7" r="4.5" fill="none" stroke="oklch(1 0 0 / 33%)" strokeWidth="1.4" />
        )}
        {selected && (
          <circle cx="7" cy="7" r="6.3" fill="none" stroke={benchColor.wax} strokeWidth="1" />
        )}
      </svg>
      <span className="bench-tick" style={{ opacity: 0.7 }}>
        {label}
      </span>
    </span>
  );
}
