import { useTransform, type MotionValue } from "framer-motion";
import type { IntroGeometry } from "./useIntroGeometry";

/**
 * Derives every camera + part value from a single scroll progress value.
 * Timeline: 0–.15 closed · .15–.30 orbit · .30–.55 opening · .55–.65 open
 * · .65–.80 camera enters the display · .80–1 fullscreen interface.
 */
export function useCamera(p: MotionValue<number>, geo: IntroGeometry, reduced: boolean) {
  const { H, D, mobile } = geo;

  const tilt = useTransform(
    p,
    [0, 0.15, 0.3, 0.55, 0.65, 0.8],
    reduced ? [-70, -70, -72, -74, -76, -80] : [-50, -55, -63, -71, -77, -86],
  );
  const yaw = useTransform(
    p,
    [0, 0.15, 0.3, 0.45, 0.6, 0.72],
    reduced || mobile ? [0, 0, 4, 2, 0, 0] : [-15, -9, 17, 7, 2, 0],
  );
  const zoom = useTransform(
    p,
    [0, 0.15, 0.3, 0.55, 0.65, 0.8],
    reduced ? [0.9, 0.9, 0.92, 0.94, 0.94, 0.96] : [0.95, 0.97, 0.95, 0.83, 0.92, 4.1],
  );

  // Framing: the closed device sits centred on its deck, then the display is
  // tracked to the viewport centre so the zoom lands exactly inside the screen.
  const frameY = useTransform([p, zoom] as never, (v) => {
    const [pp, z] = v as unknown as number[];
    const closed = -D * 0.26;
    const tracked = H * 0.5 * z;
    const b = Math.min(1, Math.max(0, (pp - 0.3) / 0.28));
    const e = b * b * (3 - 2 * b);
    return closed * (1 - e) + tracked * e;
  });

  // 178.6° rather than a flat 180° keeps the two lid faces unambiguously sorted
  const lidRotate = useTransform(
    useTransform(p, [0.3, 0.55, 0.65, 0.8], [178.6, 68, 64, 86]),
    (a) => `rotateX(${a}deg)`,
  );

  // Chassis peels away in layers: deck first, then bezel/shell, screen last.
  const baseOpacity = useTransform(p, [0.645, 0.695], [1, 0]);
  const bezelOpacity = useTransform(p, [0.665, 0.71], [1, 0]);
  // the lid's outer shell leaves first so it can never bleed through the panel
  const shellOpacity = useTransform(p, [0.6, 0.645], [1, 0]);
  // the display is off while the lid is shut, lights up as it opens, and is
  // fully gone before the fullscreen layer arrives (no double image)
  const screenOpacity = useTransform(p, [0.34, 0.5, 0.66, 0.7], [0, 1, 1, 0]);
  const chassis = useTransform(p, [0.7, 0.74], [1, 0]);
  const takeover = useTransform(p, [0.7, 0.745, 0.96, 1], [0, 1, 1, 0]);
  const hint = useTransform(p, [0, 0.07], [1, 0]);
  const ambient = useTransform(p, [0, 0.5, 0.82], [0.5, 0.68, 0.2]);


  return {
    tilt, yaw, zoom, frameY, lidRotate,
    baseOpacity, bezelOpacity, shellOpacity, screenOpacity, chassis, takeover, hint, ambient,
  };
}
