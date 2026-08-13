import { useEffect, useRef } from "react";
import logo from "@/assets/elevate-logo.png";
import { COMPOSITIONS } from "@/components/cinematic/ServicePreviews";
import { CINEMATIC } from "@/lib/cinematic-copy";
import { useT } from "@/lib/i18n";
import { SERVICES_END, SERVICES_START, clamp01, range } from "./constants";

/**
 * The ELEVATE interface. It lives INSIDE the 3D display first, then becomes the
 * viewport itself — the very same React tree, so nothing swaps at handoff.
 * Layout is container-query based, so it is identical at any physical size.
 */
export function ScreenInterface({ progress }: { progress?: React.RefObject<number> }) {
  const { lang } = useT();
  const c = CINEMATIC[lang];
  const items = c.disciplines;

  const headRef = useRef<HTMLDivElement>(null);
  const slides = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!progress) return;
    let raf = 0;
    const tick = () => {
      const p = progress.current ?? 0;
      // 0 → items.length, one unit per discipline
      const seq = range(SERVICES_START, SERVICES_END, p) * items.length;

      if (headRef.current) headRef.current.style.opacity = String(clamp01(1 - seq * 2.2));

      slides.current.forEach((el, i) => {
        if (!el) return;
        const d = seq - i; // <0 upcoming, ~0.5 dominant, >1 gone
        // one discipline is dominant at a time: it resolves, holds, then clears
        const o = d < -0.2 || d > 1.2 ? 0 : Math.min(clamp01((d + 0.2) / 0.4), clamp01((1.2 - d) / 0.4));
        el.style.opacity = String(o);
        const dc = clamp01(d);
        // subtle depth: upcoming slides sit slightly back and softly defocused
        el.style.filter = `blur(${(1 - o) * 3.4}px)`;
        el.style.transform = `translate3d(0, ${(0.5 - dc) * 5}cqh, 0) scale(${0.955 + dc * 0.06})`;
        el.style.visibility = o < 0.01 ? "hidden" : "visible";
      });
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [progress, items.length]);

  return (
    <div
      className="relative flex h-full w-full flex-col overflow-hidden bg-[#05070a] text-white"
      style={{ containerType: "size" }}
    >
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 22%, oklch(0.32 0.05 250 / 0.28), transparent 62%)",
        }}
      />

      {/* interface navigation */}
      <div className="relative flex items-center justify-between border-b border-white/[0.07] px-[5%] py-[2.6%]">
        <img src={logo} alt="ELEVATE" className="w-auto opacity-90" style={{ height: "2.3cqh" }} />
        <div
          className="flex items-center gap-[3.2cqw] text-white/40"
          style={{ fontSize: "0.95cqw", letterSpacing: "0.3em" }}
        >
          <span>{c.disciplinesEyebrow.toUpperCase()}</span>
          <span>{c.workEyebrow.toUpperCase()}</span>
          <span>{c.ctaAction.toUpperCase()}</span>
        </div>
      </div>

      <div className="relative flex-1">
        {/* opening statement */}
        <div ref={headRef} className="absolute inset-0 flex flex-col justify-center px-[7%]">
          <p className="uppercase text-primary/80" style={{ fontSize: "0.9cqw", letterSpacing: "0.45em" }}>
            {c.kicker}
          </p>
          <h2
            className="mt-[2.5cqh] max-w-[76%] font-light leading-[1.06] tracking-[-0.03em] text-white"
            style={{ fontSize: "4.6cqw" }}
          >
            {c.headline1}
            <br />
            <span className="text-white/40">{c.headline2}</span>
          </h2>
          <div aria-hidden className="mt-[5cqh] h-px w-[40%] bg-gradient-to-r from-primary/60 to-transparent" />
        </div>

        {/* disciplines — editorial motion, one dominant at a time */}
        {items.map((it, i) => (
          <div
            key={it.id}
            ref={(el) => {
              slides.current[i] = el;
            }}
            className="absolute inset-0 flex flex-col justify-center px-[7%]"
            style={{ opacity: 0, visibility: "hidden", willChange: "opacity, transform" }}
          >
            <span className="text-primary/70" style={{ fontSize: "0.95cqw", letterSpacing: "0.4em" }}>
              {it.index}
            </span>
            <h3
              className="mt-[2cqh] max-w-[52%] font-light uppercase leading-[0.98] tracking-[-0.02em] text-white"
              style={{ fontSize: "4.1cqw" }}
            >
              {it.label}
            </h3>
            <p
              className="mt-[3cqh] max-w-[38%] font-light leading-[1.35] text-white/45"
              style={{ fontSize: "1.5cqw" }}
            >
              {it.note}
            </p>
            <div aria-hidden className="mt-[4cqh] h-px w-[22%] bg-gradient-to-r from-primary/50 to-transparent" />

            {/* the same interface composition the floating windows use — one system */}
            <div
              aria-hidden
              className="absolute right-[7%] top-1/2 -translate-y-1/2 overflow-hidden rounded-[0.6cqw] border border-white/[0.07] bg-[#070b12]"
              style={{ width: "38cqw", height: "52cqh" }}
            >
              {(() => {
                const Composition = COMPOSITIONS[it.id];
                return Composition ? <Composition /> : null;
              })()}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(118deg, rgba(160,195,240,0.10) 0%, rgba(160,195,240,0) 45%), radial-gradient(120% 90% at 50% 115%, rgba(5,7,10,0.8), transparent 62%)",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
