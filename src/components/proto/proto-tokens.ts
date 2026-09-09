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
/** Fraction of that pinned for the scene (the remainder is physical travel-out). */
export const PROTO_HERO_PIN = 1.8 / PROTO_HERO_VIEWPORTS;

/** Where, as a fraction of the pinned window, the hero starts fading its set. */
export const PROTO_TAIL_MASK_START = 0.6;
export const PROTO_TAIL_MASK_END = 0.94;

/** How much of the hero's physical departure the next section rises through. */
export const PROTO_JOIN_OF_DEPARTURE = 1 - PROTO_TAIL_MASK_START;

export const PROTO_SERVICE_VIEWPORTS = 1.7;
export const PROTO_SERVICE_PIN = 0.62;
