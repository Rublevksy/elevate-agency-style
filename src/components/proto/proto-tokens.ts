/**
 * Local motion constants for the /proto prototype only.
 *
 * These are NOT added to `src/components/cinematic/motion-tokens.ts` on
 * purpose: that file's constants (HERO_TAIL_MASK_START etc.) are load-bearing
 * for the real, shipping hero and services join — two files depend on each of
 * them staying exactly as documented. This prototype needs the same *kind* of
 * number (where does the hero start handing off, how much of its departure
 * does the next section rise through) but for its own, different act length,
 * so it gets its own copy rather than perturbing the shared one.
 */

/** Total scroll length of the hero act, in viewports. */
export const PROTO_HERO_VIEWPORTS = 2.4;
/**
 * Fraction of that length the stage is ACTUALLY pinned for.
 *
 * It used to read `1.8 / VIEWPORTS`, which is not what a sticky stage does:
 * a 100svh stage inside a (V x 100svh) track pins for exactly (V - 1)
 * viewports and spends its last viewport physically travelling up. So the
 * declared pin was 1.8 viewports against a real 1.4 — measured in the
 * browser by the independent critique: the stage released at scroll 1260
 * while `act.progress` did not reach 1 until 1620. Every beat timed near
 * the end of `progress` (the panel fade, the last roll cards) was running
 * while the stage was already leaving, on tall screens `progress` never
 * reached 1 at all, and the join below was sized off a departure length
 * that did not exist. This is the same formula `ServicesShowcase.tsx`
 * uses (`SERVICES_PIN`) for the same reason.
 */
export const PROTO_HERO_PIN = (PROTO_HERO_VIEWPORTS - 1) / PROTO_HERO_VIEWPORTS;

/** Where, as a fraction of the pinned window, the hero starts fading its set. */
export const PROTO_TAIL_MASK_START = 0.6;
export const PROTO_TAIL_MASK_END = 0.94;

/** How much of the hero's physical departure the next section rises through. */
export const PROTO_JOIN_OF_DEPARTURE = 1 - PROTO_TAIL_MASK_START;

export const PROTO_SERVICE_VIEWPORTS = 1.7;
export const PROTO_SERVICE_PIN = 0.62;
