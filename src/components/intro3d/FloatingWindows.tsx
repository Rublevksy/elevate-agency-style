import { useEffect, useRef } from "react";
import { CINEMATIC } from "@/lib/cinematic-copy";
import { useT } from "@/lib/i18n";
import { COMPOSITIONS } from "@/components/cinematic/ServicePreviews";
import { CLOSED_END, OPEN_END, clamp01, smoothstep } from "./constants";

/**
 * Digital product windows suspended in the space BEHIND the MacBook.
 *
 * Each window is one ELEVATE discipline drawn as a real interface composition.
 * They live at three depth bands, drift on their own slow orbit, and are driven
 * by the same cinematic scroll progress as the device: as the camera closes in
 * they recede and dissolve, and everything reverses on the way back out. Mouse
 * parallax is depth-weighted and measured in a handful of pixels.
 */

type Slot = {
  /** left / top in %, depth in px (negative = further away) */
  x: number;
  y: number;
  z: number;
  w: number;
  rotY: number;
  rotX: number;
  rotZ: number;
  /** parallax weight */
  k: number;
};

const SLOTS: Slot[] = [
  { x: 62, y: 22, z: -520, w: 30, rotY: -19, rotX: 6, rotZ: -1.5, k: 0.35 }, // far
  { x: 16, y: 46, z: -300, w: 26, rotY: 22, rotX: 4, rotZ: 1.5, k: 0.55 }, // mid left
  { x: 78, y: 58, z: -170, w: 32, rotY: -24, rotX: -3, rotZ: 1, k: 0.85 }, // near right
  { x: 34, y: 14, z: -640, w: 23, rotY: 12, rotX: 8, rotZ: -1, k: 0.25 }, // far left top
  { x: 50, y: 76, z: -420, w: 27, rotY: -6, rotX: -8, rotZ: 0.5, k: 0.45 }, // low centre
];

export function FloatingWindows({
  stage,
  mobile,
}: {
  stage: React.RefObject<number>;
  mobile: boolean;
}) {
  const { lang } = useT();
  const items = CINEMATIC[lang].disciplines;
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const mouse = useRef({ x: 0, y: 0, tx: 0, ty: 0 });

  useEffect(() => {
    let raf = 0;
    let t = 0;

    const onMove = (e: PointerEvent) => {
      mouse.current.tx = e.clientX / window.innerWidth - 0.5;
      mouse.current.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const p = stage.current ?? 0;
      t += 0.004;
      const m = mouse.current;
      m.x += (m.tx - m.x) * 0.045;
      m.y += (m.ty - m.y) * 0.045;

      // windows present themselves early, then withdraw as the camera commits
      // to the display — the mirror on the way out comes free from `stage`
      const enter = smoothstep(0, CLOSED_END * 1.6, p);
      const exit = smoothstep(OPEN_END * 0.92, 0.995, p);
      const presence = clamp01(0.55 + enter * 0.45) * (1 - exit);
      /** which window is currently dominant, cycling with the timeline */
      const focus = p * (items.length - 0.001);

      refs.current.forEach((el, i) => {
        if (!el) return;
        const s = SLOTS[i]!;
        const d = Math.abs(focus - i);
        const dom = clamp01(1 - d); // 1 when dominant
        const drift = Math.sin(t * (0.6 + i * 0.17) + i) * (mobile ? 4 : 11);
        const driftY = Math.cos(t * (0.5 + i * 0.13) + i * 2) * (mobile ? 3 : 8);
        const z = s.z + dom * 130 - exit * 420;
        const px = m.x * s.k * (mobile ? 6 : 22);
        const py = m.y * s.k * (mobile ? 4 : 14);

        el.style.opacity = String(presence * (0.2 + dom * 0.5));
        el.style.filter = `blur(${(1 - dom) * 2.6 + (1 - presence) * 3}px) saturate(${0.65 + dom * 0.35})`;
        el.style.transform =
          `translate3d(${drift + px}px, ${driftY + py - exit * 40}px, ${z}px) ` +
          `rotateX(${s.rotX + m.y * s.k * 1.4}deg) rotateY(${s.rotY - m.x * s.k * 3}deg) rotateZ(${s.rotZ}deg) ` +
          `scale(${0.94 + dom * 0.1})`;
      });

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [stage, mobile, items.length]);

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={{ perspective: mobile ? "900px" : "1500px", perspectiveOrigin: "50% 46%" }}
    >
      {items.map((it, i) => {
        const s = SLOTS[i];
        const Composition = COMPOSITIONS[it.id];
        if (!s || !Composition) return null;
        return (
          <div
            key={it.id}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="absolute will-change-transform"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: `${s.w}vw`,
              marginLeft: `${-s.w / 2}vw`,
              opacity: 0,
              transformStyle: "preserve-3d",
            }}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-white/[0.07] bg-[#070b12] shadow-[0_50px_120px_-50px_rgba(10,20,40,0.9)]">
              <Composition />
              {/* screen reflection + vignette so it reads as glass, not a card */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(118deg, rgba(160,195,240,0.10) 0%, rgba(160,195,240,0) 42%), radial-gradient(120% 90% at 50% 110%, rgba(5,7,11,0.85), transparent 60%)",
                }}
              />
            </div>
            <div className="mt-2 flex items-baseline gap-2 px-1">
              <span className="font-mono text-[9px] tracking-[0.3em] text-primary/70">{it.index}</span>
              <span className="text-[10px] uppercase tracking-[0.3em] text-foreground/35">{it.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
