import { useLayoutEffect, useState } from "react";

export type IntroGeometry = {
  mobile: boolean;
  /** lid / display width */
  W: number;
  /** display height (16:10) */
  H: number;
  /** base depth */
  D: number;
  /** body thickness */
  T: number;
  perspective: number;
};

/**
 * Viewport-derived laptop dimensions. The device is sized so it occupies
 * 70–85% of the viewport width on desktop while still fitting vertically.
 */
export function useIntroGeometry(): IntroGeometry {
  const [vp, setVp] = useState({ w: 1280, h: 800 });

  useLayoutEffect(() => {
    const read = () => setVp({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    window.addEventListener("orientationchange", read);
    return () => {
      window.removeEventListener("resize", read);
      window.removeEventListener("orientationchange", read);
    };
  }, []);

  const mobile = vp.w < 768;
  const W = Math.min(
    mobile ? vp.w * 0.94 : vp.w * 0.82,
    mobile ? 460 : 1180,
    vp.h * (mobile ? 1.05 : 0.95),
  );

  return {
    mobile,
    W,
    H: W * 0.625,
    D: W * 0.68,
    T: Math.max(6, W * 0.011),
    perspective: mobile ? 1500 : 2300,
  };
}
