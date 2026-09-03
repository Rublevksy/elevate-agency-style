/**
 * The page's motion vocabulary — one home for the numbers that were being
 * copied from file to file.
 *
 * Nothing here is new: every value below already exists somewhere in
 * `src/components/home/`. What is new is that there is now exactly one of each.
 * A curve or a camera constant that lives in five files is five curves the
 * moment one of them is nudged, and the whole point of a single continuous film
 * is that the five sections are shot through the same lens.
 */
import type { CSSProperties } from "react";

/**
 * The project's one easing curve.
 *
 * Declared once and only once on purpose — see the note beside `.hover-lift` in
 * `src/styles.css`: alternative curves are not introduced in new motion code.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Beats of the arrival, in seconds. The whole sequence is capped at about a
 * second: a focal entrance may be authored, but a visitor must not be made to
 * wait through choreography before they can read.
 */
export const BEAT = {
  scene: 0,
  kicker: 0.18,
  headline: 0.3,
  headlineStep: 0.11,
  support: 0.68,
  supportStep: 0.07,
} as const;

/**
 * The camera. `PERSPECTIVE` is the focal length; the Z values are where the
 * planes stand in front of it. `depth()` returns the transform that puts a
 * plane at a depth and pre-scales it by the exact inverse of the projection at
 * that depth, so a plane placed with it renders identically to no transform at
 * all until the rig moves — and then separates on its own, because one
 * translation of the rig displaces a near plane further across the screen than
 * a far one. That is real parallax rather than four hand-tuned speeds.
 */
export const PERSPECTIVE = 1400;
export const Z_ATMO = -900;
export const Z_LIGHT_BACK = -560;
export const Z_PLATE = -250;
export const Z_LIGHT_FRONT = -60;

export const depth = (z: number): CSSProperties => ({
  transform: `translateZ(${z}px) scale(${(PERSPECTIVE - z) / PERSPECTIVE})`,
});
