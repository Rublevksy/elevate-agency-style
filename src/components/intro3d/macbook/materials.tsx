/**
 * Shared premium product materials.
 *
 * The chassis is graphite aluminium — never pure black, never chrome. Metalness
 * stays high while roughness keeps reflections broad and soft, so the geometry
 * is revealed by long environmental highlights instead of mirror glare.
 */
export const ALUMINIUM = {
  color: "#2a2e34",
  metalness: 0.92,
  roughness: 0.28,
  envMapIntensity: 1.15,
  clearcoat: 0.45,
  clearcoatRoughness: 0.3,
  reflectivity: 0.45,
  sheen: 0.2,
  sheenColor: "#93aecd",
  sheenRoughness: 0.55,
} as const;

/** Machined chamfers and the hinge barrel: slightly darker, tighter reflection. */
export const ALUMINIUM_DARK = {
  color: "#1d2126",
  metalness: 0.92,
  roughness: 0.36,
  envMapIntensity: 0.85,
} as const;


/** Display glass: dark, smooth, with one restrained environmental reflection. */
export const GLASS_PANEL = {
  color: "#05070b",
  metalness: 0.35,
  roughness: 0.09,
  envMapIntensity: 0.7,
} as const;

export const KEY_CAP = {
  color: "#1e2228",
  metalness: 0.35,
  roughness: 0.62,
} as const;

/** Trackpad glass. */
export const TRACKPAD = {
  color: "#20242a",
  metalness: 0.55,
  roughness: 0.22,
} as const;
