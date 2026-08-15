import { useEffect, useRef } from "react";
import { PHASE, clamp01, range } from "./film";

/**
 * THE ENVIRONMENT — a premium digital infrastructure, not a space scene.
 *
 * Four depth planes (FAR → NEAR) built from thin technical blue lines,
 * wireframe geometry, data points and blurred interface fragments. One rAF loop
 * writes three CSS variables on the root (--mx, --my, --p); every plane derives
 * its own parallax weight from them, so the depth is real but the cost is a
 * handful of transforms per frame.
 */
export function Atmosphere({
  progress,
  pointer,
  mobile,
}: {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
  mobile: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const smooth = { x: 0, y: 0 };
    const cursor = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, energy: 0 };
    let last = performance.now();
    const onMove = (e: PointerEvent) => {
      cursor.tx = e.clientX / window.innerWidth;
      cursor.ty = e.clientY / window.innerHeight;
      cursor.energy = 1;
      last = performance.now();
    };
    if (!reduced && !mobile) window.addEventListener("pointermove", onMove, { passive: true });

    const tick = () => {
      const el = root.current;
      if (el) {
        const m = pointer.current ?? { x: 0, y: 0 };
        const tx = reduced || mobile ? 0 : m.x;
        const ty = reduced || mobile ? 0 : m.y;
        smooth.x += (tx - smooth.x) * 0.045;
        smooth.y += (ty - smooth.y) * 0.045;
        const p = clamp01(progress.current ?? 0);
        el.style.setProperty("--mx", smooth.x.toFixed(4));
        el.style.setProperty("--my", smooth.y.toFixed(4));
        el.style.setProperty("--p", p.toFixed(4));
        // the cursor light: soft, slow, and it decays back to neutral on rest
        cursor.x += (cursor.tx - cursor.x) * 0.06;
        cursor.y += (cursor.ty - cursor.y) * 0.06;
        if (performance.now() - last > 220) cursor.energy += (0 - cursor.energy) * 0.03;
        el.style.setProperty("--cx", `${(cursor.x * 100).toFixed(2)}%`);
        el.style.setProperty("--cy", `${(cursor.y * 100).toFixed(2)}%`);
        el.style.setProperty("--ce", cursor.energy.toFixed(3));
        el.style.setProperty("--thin", (1 - range(PHASE.ENTER, PHASE.HANDOFF, p) * 0.85).toFixed(4));
      }
    };
    const stop = startFrameLoop(tick, root.current);
    return () => {
      stop();
      window.removeEventListener("pointermove", onMove);
    };
  }, [progress, pointer, mobile]);



  const plane = (depth: number) =>
    ({
      transform: `translate3d(calc(var(--mx) * ${depth * 34}px), calc(var(--my) * ${depth * -22}px), 0)`,
      willChange: "transform",
    }) as React.CSSProperties;

  return (
    <div
      ref={root}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
      style={
        {
          ["--mx" as string]: 0,
          ["--my" as string]: 0,
          ["--p" as string]: 0,
          ["--cx" as string]: "50%",
          ["--cy" as string]: "50%",
          ["--ce" as string]: 0,
          ["--thin" as string]: 1,
          opacity: "var(--thin)" as unknown as number,
        } as React.CSSProperties
      }
    >
      {/* the cursor's own light: extremely soft, it lifts the nearby atmosphere */}
      {!mobile && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(22vw 22vw at var(--cx) var(--cy), oklch(0.62 0.15 258 / 0.1) 0%, oklch(0.5 0.12 258 / 0.045) 38%, transparent 72%)",
            opacity: "calc(0.35 + var(--ce) * 0.65)" as unknown as number,
            mixBlendMode: "screen",
          }}
        />
      )}

      {/* FAR — soft blue light fields and atmospheric haze */}
      <div className="absolute inset-[-8%]" style={plane(0.18)}>
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(46% 42% at 30% 34%, oklch(0.36 0.1 258 / 0.2) 0%, transparent 72%), radial-gradient(52% 46% at 74% 66%, oklch(0.3 0.09 258 / 0.16) 0%, transparent 74%)",
            filter: "blur(14px)",
          }}
        />
      </div>

      {/* FAR — subtle grid structure, deep and slow */}
      <div className="absolute inset-[-10%]" style={plane(0.3)}>
        <div
          className="absolute inset-0 opacity-[0.5]"
          style={{
            backgroundImage:
              "linear-gradient(to right, oklch(0.72 0.14 258 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.72 0.14 258 / 0.035) 1px, transparent 1px)",
            backgroundSize: mobile ? "72px 72px" : "110px 110px",
            maskImage: "radial-gradient(72% 66% at 52% 46%, black 0%, transparent 82%)",
            WebkitMaskImage: "radial-gradient(72% 66% at 52% 46%, black 0%, transparent 82%)",
          }}
        />
      </div>

      {/* MID — wireframe geometry: thin technical frames at depth */}
      <div className="absolute inset-0" style={{ ...plane(0.62), perspective: "1600px" }}>
        {[
          { l: "8%", t: "18%", w: "26vw", h: "16vw", r: 16, o: 0.5 },
          { l: "66%", t: "26%", w: "22vw", h: "14vw", r: -14, o: 0.42 },
          { l: "16%", t: "62%", w: "18vw", h: "11vw", r: 11, o: 0.34 },
          { l: "72%", t: "68%", w: "15vw", h: "10vw", r: -18, o: 0.3 },
        ].map((f, i) => (
          <div
            key={i}
            className="absolute rounded-lg border border-primary/[0.16]"
            style={{
              left: f.l,
              top: f.t,
              width: f.w,
              height: f.h,
              opacity: f.o,
              transform: `rotateY(${f.r}deg) translate3d(0, calc(var(--p) * ${-8 - i * 4}vh), ${-120 - i * 60}px)`,
              boxShadow: "inset 0 0 40px oklch(0.5 0.14 258 / 0.05)",
            }}
          >
            {/* blurred interface fragment inside the wireframe */}
            <div className="absolute inset-3 space-y-2 blur-[2px]">
              <div className="h-1 w-2/3 rounded-full bg-primary/25" />
              <div className="h-1 w-1/3 rounded-full bg-white/10" />
              <div className="mt-4 h-1 w-1/2 rounded-full bg-white/[0.07]" />
            </div>
          </div>
        ))}
      </div>

      {/* MID — thin ELEVATE-blue technical lines that travel with scroll + cursor */}
      <div className="absolute inset-0" style={plane(0.8)}>
        {[
          { y: "22%", w: "34vw", from: "-30vw", dir: 1, o: 0.55 },
          { y: "41%", w: "22vw", from: "78vw", dir: -1, o: 0.4 },
          { y: "63%", w: "40vw", from: "-38vw", dir: 1, o: 0.45 },
          { y: "79%", w: "18vw", from: "84vw", dir: -1, o: 0.3 },
        ].map((l, i) => (
          <div
            key={i}
            className="absolute h-px"
            style={{
              top: l.y,
              left: l.from,
              width: l.w,
              opacity: `calc(${l.o} * (0.25 + var(--p) * 0.9))`,
              background:
                "linear-gradient(90deg, transparent 0%, oklch(0.68 0.17 258 / 0.55) 45%, oklch(0.8 0.14 258 / 0.8) 60%, transparent 100%)",
              transform: `translate3d(calc((var(--p) * ${l.dir * (58 + i * 9)}vw) + (var(--mx) * ${l.dir * 26}px)), 0, 0)`,
              willChange: "transform, opacity",
            }}
          />
        ))}
        {/* vertical light pulses, anchored to the device */}
        {[
          { x: "31%", h: "28vh", o: 0.35 },
          { x: "69%", h: "22vh", o: 0.28 },
        ].map((l, i) => (
          <div
            key={i}
            className="absolute w-px"
            style={{
              left: l.x,
              top: "16%",
              height: l.h,
              opacity: `calc(${l.o} * (0.2 + var(--p) * 1.1))`,
              background:
                "linear-gradient(180deg, transparent 0%, oklch(0.7 0.16 258 / 0.5) 55%, transparent 100%)",
              transform: `translate3d(calc(var(--mx) * ${(i ? -1 : 1) * 18}px), calc(var(--p) * ${i ? 12 : -14}vh), 0)`,
            }}
          />
        ))}
      </div>

      {/* NEAR — data points, the fastest plane */}
      {!mobile && (
        <div className="absolute inset-0" style={plane(1.15)}>
          {DOTS.map((d, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-primary/70"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                width: d.s,
                height: d.s,
                opacity: `calc(${d.o} * (0.35 + var(--p) * 0.8))`,
                transform: `translate3d(0, calc(var(--p) * ${d.d}vh), 0)`,
                boxShadow: "0 0 8px oklch(0.7 0.17 258 / 0.5)",
              }}
            />
          ))}
        </div>
      )}

      {/* NEAR — the rare events: a line that draws itself, a point travelling
          along it, a pulse. Long cycles, so the scene feels alive, never busy. */}
      {!mobile && (
        <div className="absolute inset-0" style={plane(1.32)}>
          {TRACES.map((t, i) => (
            <div
              key={i}
              className="absolute h-px atmo-draw origin-left"
              style={{
                top: t.y,
                left: t.x,
                width: t.w,
                animationDelay: `${t.delay}s`,
                animationDuration: `${t.dur}s`,
                background:
                  "linear-gradient(90deg, transparent 0%, oklch(0.72 0.16 258 / 0.5) 40%, oklch(0.86 0.1 258 / 0.75) 70%, transparent 100%)",
                opacity: "calc(0.35 + var(--ce) * 0.5)" as unknown as number,
              }}
            >
              <span
                className="absolute -top-[1.5px] h-1 w-1 rounded-full bg-primary atmo-travel"
                style={{ animationDelay: `${t.delay + 1.2}s`, animationDuration: `${t.dur}s`, boxShadow: "0 0 10px oklch(0.75 0.17 258 / 0.7)" }}
              />
            </div>
          ))}
          {PARTICLES.map((s, i) => (
            <span
              key={i}
              className="absolute rounded-full bg-primary/60 atmo-drift"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: "2px",
                height: "2px",
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.dur}s`,
                opacity: "calc(0.3 + var(--ce) * 0.45)" as unknown as number,
              }}
            />
          ))}
        </div>
      )}


      {/* grain keeps the gradients cinematic instead of digital */}
      <div
        className="absolute inset-0 opacity-[0.14] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

/** rare foreground events — long cycles, deterministic placement */
const TRACES = [
  { x: "6%", y: "34%", w: "18vw", delay: 0, dur: 22 },
  { x: "58%", y: "18%", w: "14vw", delay: 7, dur: 26 },
  { x: "40%", y: "82%", w: "22vw", delay: 13, dur: 24 },
] as const;

const PARTICLES = [
  { x: 18, y: 46, delay: 0, dur: 18 },
  { x: 34, y: 26, delay: 3, dur: 22 },
  { x: 52, y: 66, delay: 6, dur: 20 },
  { x: 76, y: 40, delay: 9, dur: 24 },
  { x: 90, y: 62, delay: 12, dur: 19 },
] as const;

/** deterministic near-plane data points — no randomness, no autoplay */
const DOTS = [
  { x: 12, y: 30, s: "3px", o: 0.5, d: -7 },
  { x: 24, y: 71, s: "2px", o: 0.4, d: -4 },
  { x: 38, y: 17, s: "2px", o: 0.35, d: -9 },
  { x: 47, y: 84, s: "3px", o: 0.3, d: -5 },
  { x: 58, y: 24, s: "2px", o: 0.45, d: -8 },
  { x: 71, y: 58, s: "3px", o: 0.4, d: -6 },
  { x: 82, y: 33, s: "2px", o: 0.3, d: -10 },
  { x: 88, y: 77, s: "2px", o: 0.35, d: -4 },
] as const;
