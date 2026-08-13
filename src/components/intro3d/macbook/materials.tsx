/**
 * Shared premium product materials.
 *
 * The chassis is graphite aluminium — never pure black, never chrome. Metalness
 * stays high while roughness keeps reflections broad and soft, so the geometry
 * is revealed by long environmental highlights instead of mirror glare.
 */
export const ALUMINIUM = {
  color: "#33383f",
  metalness: 0.88,
  roughness: 0.36,
  envMapIntensity: 1.55,
  clearcoat: 0.35,
  clearcoatRoughness: 0.42,
  reflectivity: 0.4,
  sheen: 0.25,
  sheenColor: "#8fa8c8",
  sheenRoughness: 0.6,
} as const;

/** Machined chamfers and the hinge barrel: slightly darker, tighter reflection. */
export const ALUMINIUM_DARK = {
  color: "#262a30",
  metalness: 0.9,
  roughness: 0.44,
  envMapIntensity: 1.05,
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
