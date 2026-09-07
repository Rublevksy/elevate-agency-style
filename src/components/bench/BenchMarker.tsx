import { useReducedScene } from "@/components/cinematic";
import { CrossMark, FlagMark, PinMark } from "./marks";

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
 * T4: the four marker states read through marks.tsx's five-mark system, not
 * ad-hoc shapes (T3's placeholder circles/checkmark are gone). Per that
 * file's semantic mapping, `active` and `selected` share one mark family
 * (FLAG) rather than each owning a separate glyph — `active` (the scroll-
 * derived ground truth) takes priority and renders it filled; `selected`
 * alone renders the outline variant. `completed`/`pending` render CROSS/PIN
 * exactly as mapped. This priority rule means one glyph is ever shown at a
 * time — the visible text caption is what carries the exact state name
 * (SELECTED vs ACTIVE) when a frame happens to be both.
 *
 * The caption is real visible text at every width, not just on mobile
 * (VISUAL_LANGUAGE §5's rule is a floor, not a ceiling): a shape-only signal
 * is easy to misread at a glance, and the text IS the accessible name — no
 * separate `aria-label`/`sr-only` duplicate to fall out of sync with it.
 */
export function BenchMarker({ state, selected, labels }: BenchMarkerProps) {
  const label = selected ? labels.selected : labels[state];
  const reducedScene = useReducedScene();

  return (
    <span className="inline-flex items-center gap-1.5">
      {state === "active" || selected ? (
        <FlagMark filled={state === "active"} className="shrink-0" instant />
      ) : state === "completed" ? (
        <CrossMark className="shrink-0" instant={reducedScene} />
      ) : (
        <PinMark className="shrink-0" />
      )}
      <span className="bench-tick" style={{ opacity: 0.7 }}>
        {label}
      </span>
    </span>
  );
}
