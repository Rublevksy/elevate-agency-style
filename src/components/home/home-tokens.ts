/**
 * The homepage's opening act — hero AND services — as one scroll budget.
 *
 * WHY ONE ACT. The prototype joined two pinned sections with a negative-margin
 * overlap, and however the join was tuned, a paused scroll at the seam showed
 * two browser windows at once: one leaving with the hero's stage, one rising
 * with the next section's (PROTO_GATE.md §3.1). The owner's condition is ONE
 * window. The robust way to guarantee that is structural rather than tuned: the
 * hero and the five services share one sticky stage, so the window is one DOM
 * element for the whole of it and there is no seam to hide.
 *
 * The budget is declared in viewports of scroll per beat and everything else —
 * the act length, the pin, every beat's position on `progress` — is derived
 * from it. A beat written as a raw fraction of `progress` would silently change
 * the scroll speed of every other beat the moment one of them is re-timed
 * (the same lesson as HeroCameraPlate's BEAT_* budget in the previous hero).
 */

/** The hero's own beat: copy leaves, window squares up and navigates. */
export const INTRO_VP = 0.95;
/** One service, from its page arriving to the next one's navigation. */
export const STOP_VP = 0.74;
/** A short hold on the last service before the stage releases. */
export const TAIL_VP = 0.35;
export const STOP_COUNT = 5;

/** Viewports the stage is actually pinned for. */
export const PINNED_VP = INTRO_VP + STOP_COUNT * STOP_VP + TAIL_VP;
/** Track length: a 100svh sticky stage in a V x 100svh track pins for V - 1. */
export const HERO_VIEWPORTS = PINNED_VP + 1;
/** `(V - 1) / V` — the declared pin must equal the physical one (PROTO_GATE §8). */
export const HERO_PIN = PINNED_VP / HERO_VIEWPORTS;

/** A position in the pinned window, in viewports, as `progress` (0..1). */
export const at = (vp: number) => vp / PINNED_VP;

/** Where service `i` begins, in viewports. */
export const stopStart = (i: number) => INTRO_VP + i * STOP_VP;

/**
 * One navigation of the window, in viewports relative to the moment the new
 * page begins: the address changes (hard cut, the way a real bar does), the load
 * bar runs, the old page blanks, the new one paints top-down.
 */
export const NAV = { lead: 0.08, swap: 0.05, paint: 0.14 } as const;
