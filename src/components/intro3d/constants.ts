/**
 * Single source of truth for the cinematic intro.
 * Every camera position, hinge angle and phase boundary lives here so the
 * sequence can be tuned without touching component code.
 */

/** Scroll-timeline phase boundaries (0 → 1). */
export const CLOSED_END = 0.15;
export const ROTATION_END = 0.3;
export const OPEN_END = 0.55;
export const HOLD_END = 0.62;
/** the camera reaches the display plane only at the very end of the timeline */
export const SCREEN_APPROACH_END = 0.99;
/** the 3D display hands over to the fullscreen layer here (same content, same scale) */
export const HANDOFF_START = 0.9;
export const HANDOFF_END = 0.95;
export const CHASSIS_GONE = 0.94;
export const FULLSCREEN_END = 1;


/** Device geometry, in centimetres (1 world unit = 1 cm). */
export const DEVICE = {
  /** chassis width */
  W: 31,
  /** display height — 16:10 */
  H: 19.375,
  /** deck depth */
  D: 21.5,
  /** deck thickness */
  T: 1.15,
  /** lid thickness */
  LID_T: 0.52,
  /** hinge angle, degrees. 0 = closed flat on the deck. */
  LID_CLOSED_DEG: 0,
  LID_OPEN_DEG: -103,
} as const;

/** Camera. Radii are multiples of the distance at which the display exactly fills the viewport width. */
export const CAMERA_FOV = 30;

export type CamKey = {
  p: number;
  /** radius multiplier */
  k: number;
  /** yaw in degrees (0 = straight on) */
  yaw: number;
  /** elevation in degrees */
  elev: number;
};

export const CAM_TRACK: CamKey[] = [
  { p: 0.0, k: 1.62, yaw: -14, elev: 24 },
  { p: 0.15, k: 1.56, yaw: -6, elev: 20 },
  { p: 0.3, k: 1.52, yaw: 34, elev: 9 },
  { p: 0.45, k: 2.15, yaw: 18, elev: 14 },
  { p: 0.55, k: 2.2, yaw: 7, elev: 13 },
  { p: 0.62, k: 1.95, yaw: 0, elev: 9 },
  { p: 1.0, k: 1.95, yaw: 0, elev: 0 },
];

/** Mobile: same story, calmer camera. */
export const CAM_TRACK_MOBILE: CamKey[] = CAM_TRACK.map((k) => ({
  ...k,
  yaw: k.yaw * 0.35,
  elev: k.elev * 0.8,
  k: k.k * 1.06,
}));


/** Optional drop-in location for a real GLB product model. */
export const MACBOOK_MODEL_URL = "/models/macbook.glb";

/* ---------- math helpers ---------- */

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

/**
 * Cinematic dolly curve: very slow start, smooth acceleration, gentle
 * deceleration. Symmetric, so scrubbing backwards feels identical.
 */
export function easeCinematic(t: number) {
  const v = clamp01(t);
  return v < 0.5 ? 8 * v * v * v * v : 1 - Math.pow(-2 * v + 2, 4) / 2;
}

/** Normalised, clamped position of `v` inside [a, b]. */
export const range = (a: number, b: number, v: number) => clamp01((v - a) / (b - a));



export function smoothstep(edge0: number, edge1: number, v: number) {
  const t = clamp01((v - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

/** Samples a keyframe track with smooth easing between keys. */
export function sampleTrack(track: CamKey[], p: number): Omit<CamKey, "p"> {
  if (p <= track[0].p) return track[0];
  const last = track[track.length - 1];
  if (p >= last.p) return last;
  for (let i = 0; i < track.length - 1; i++) {
    const a = track[i];
    const b = track[i + 1];
    if (p >= a.p && p <= b.p) {
      const t = smoothstep(a.p, b.p, p);
      return { k: lerp(a.k, b.k, t), yaw: lerp(a.yaw, b.yaw, t), elev: lerp(a.elev, b.elev, t) };
    }
  }
  return last;
}
