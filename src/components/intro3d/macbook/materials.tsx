import { useMemo } from "react";
import type { Texture } from "three";
import { aluminiumRoughnessMap } from "./geometry";

/**
 * Shared premium product materials.
 *
 * The chassis is graphite aluminium — never pure black, never chrome. Metalness
 * stays high while roughness keeps reflections broad and soft, so the geometry
 * is revealed by long environmental highlights instead of mirror glare.
 */
export const ALUMINIUM = {
  color: "#272b31",
  metalness: 0.9,
  roughness: 0.31,
  envMapIntensity: 0.95,
  clearcoat: 0.4,
  clearcoatRoughness: 0.32,
  reflectivity: 0.45,
  sheen: 0.1,
  sheenColor: "#98a0aa",
  sheenRoughness: 0.55,
} as const;

/** Machined chamfers and the hinge barrel: slightly darker, tighter reflection. */
export const ALUMINIUM_DARK = {
  color: "#1d2126",
  metalness: 0.92,
  roughness: 0.36,
  envMapIntensity: 0.85,
} as const;

/** Bead-blasted underside: same alloy, softer and less reflective. */
export const ALUMINIUM_MATTE = {
  color: "#23272d",
  metalness: 0.85,
  roughness: 0.52,
  envMapIntensity: 0.6,
} as const;

/** Anodised black inside milled recesses (keyboard well, port cavities). */
export const ANODISED_BLACK = {
  color: "#0a0c10",
  metalness: 0.45,
  roughness: 0.78,
  envMapIntensity: 0.35,
} as const;

/** Display glass: dark, smooth, with one restrained environmental reflection. */
export const GLASS_PANEL = {
  color: "#05070b",
  metalness: 0.35,
  roughness: 0.09,
  envMapIntensity: 0.7,
} as const;

export const KEY_CAP = {
  color: "#181c21",
  metalness: 0.3,
  roughness: 0.66,
  envMapIntensity: 0.4,
} as const;

/** Trackpad glass. */
export const TRACKPAD = {
  color: "#1e2228",
  metalness: 0.5,
  roughness: 0.2,
  envMapIntensity: 0.75,
} as const;

/**
 * Micro-surface variation, generated once per session. Applied as a roughness
 * map so anodised aluminium shows fine grain and faint brushed streaks under
 * the key light instead of a flat, plastic sheen.
 */
export function useMicroSurface(): { roughnessMap?: Texture } {
  const map = useMemo(() => aluminiumRoughnessMap(256), []);
  return map ? { roughnessMap: map } : {};
}
