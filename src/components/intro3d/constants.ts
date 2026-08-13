/**
 * Single source of truth for the cinematic intro.
 * Every camera position, hinge angle and phase boundary lives here so the
 * sequence can be tuned without touching component code.
 */

/**
 * ONE master scroll progress (0 → 1) drives the whole story:
 *   0.00 closed → ENTER_END fullscreen ELEVATE → EXIT_START camera exit → 1.00 closed.
 *
 * Between ENTER_END and EXIT_START the camera is inside the display and the
 * fullscreen interface plays the discipline sequence. The exit is the exact
 * mirror of the entrance, so the device re-forms and the lid closes.
 */
export const ENTER_END = 0.72;
export const EXIT_START = 0.88;

/** Phase boundaries expressed on the STAGE timeline (0 → 1, mirrored on exit). */
export const CLOSED_END = 0.16;
export const ROTATION_END = 0.32;
export const OPEN_END = 0.6;
export const HOLD_END = 0.68;
/** the camera reaches the display plane only at the very end of the stage */
export const SCREEN_APPROACH_END = 1;
/** the 3D display hands over to the fullscreen layer here (same content, same scale) */
export const HANDOFF_START = 0.93;
export const HANDOFF_END = 0.965;
export const CHASSIS_GONE = 0.97;
export const FULLSCREEN_END = 1;

/** where the discipline sequence lives on the MASTER timeline */
export const SERVICES_START = 0.73;
export const SERVICES_END = 0.87;

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
  { p: 0.0, k: 1.42, yaw: -10, elev: 16 },
  { p: 0.16, k: 1.34, yaw: -4, elev: 13 },
  { p: 0.32, k: 1.3, yaw: 20, elev: 11 },
  { p: 0.48, k: 1.5, yaw: 11, elev: 12 },
  { p: 0.6, k: 1.44, yaw: 4, elev: 10 },
  { p: 0.68, k: 1.3, yaw: 0, elev: 8 },
  { p: 1.0, k: 1.0, yaw: 0, elev: 0 },
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

/**
 * Master progress → STAGE progress. The device story runs forward until
 * ENTER_END, holds while the interface owns the viewport, then plays in exact
 * reverse from EXIT_START so the MacBook re-forms and closes at 1.00.
 */
export function stageProgress(p: number) {
  if (p <= ENTER_END) return clamp01(p / ENTER_END);
  if (p >= EXIT_START) return clamp01((1 - p) / (1 - EXIT_START));
  return 1;
}
