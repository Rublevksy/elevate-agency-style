import { useEffect, useRef, useState } from "react";
import { ScreenUI } from "./ScreenUI";

/**
 * Maps the live DOM interface onto the device display: a CSS-3D plane aligned
 * with the lid of the 3D MacBook, scaled to the 1600x1000 design canvas.
 * Resize-safe (ResizeObserver, transform only).
 */
export function ScreenFrame() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      if (r.width > 0) setScale(r.width / 1600);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden={false}
      className="absolute overflow-hidden rounded-[4px]"
      style={{
        left: "14.3%",
        top: "1.4%",
        width: "65.4%",
        height: "45.6%",
        transform: "perspective(1400px) rotateX(1.1deg)",
        transformOrigin: "top center",
        boxShadow: "0 0 60px -20px rgba(60,130,255,0.45)",
      }}
    >
      <div
        style={{
          width: 1600,
          height: 1000,
          transform: `scale(${scale || 0.001})`,
          transformOrigin: "top left",
        }}
      >
        <ScreenUI />
      </div>
      {/* glass sheen */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(122deg, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0) 38%, rgba(255,255,255,0) 100%)",
        }}
      />
    </div>
  );
}
