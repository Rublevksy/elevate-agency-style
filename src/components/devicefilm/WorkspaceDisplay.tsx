import { useEffect, useRef } from "react";
import { PHASE, clamp01, easeFilm, range } from "./film";

/**
 * THE DISPLAY — a cinematic digital workspace.
 *
 * The device shows a digital product being made: IDEA → DESIGN → BUILD → LIVE.
 * Scroll is the only driver. The whole sequence is expressed through four CSS
 * variables written once per frame on the root (--s1 … --s4), so every child
 * interpolates on the GPU through opacity / transform only — no per-element
 * DOM writes, no autoplay, and scrubbing back reverses exactly.
 */

/** beat centres on the local 0 → 1 display timeline */
const BEATS = [0.1, 0.38, 0.64, 0.88];
/** how wide a beat owns the frame */
const HOLD = 0.3;

function beat(u: number, i: number) {
  const d = Math.abs(u - BEATS[i]!);
  if (i === 0 && u < BEATS[0]!) return 1;
  if (i === BEATS.length - 1 && u > BEATS[i]!) return 1;
  return easeFilm(clamp01(1 - d / HOLD));
}

export function WorkspaceDisplay({ progress }: { progress?: React.RefObject<number> }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = root.current;
      if (el) {
        const p = progress?.current ?? 0;
        const u = clamp01(range(0.02, PHASE.HANDOFF, p));
        el.style.setProperty("--u", u.toFixed(4));
        for (let i = 0; i < 4; i++) el.style.setProperty(`--s${i + 1}`, beat(u, i).toFixed(4));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <div
      ref={root}
      className="relative h-full w-full overflow-hidden bg-[#06080d] text-foreground"
      style={
        {
          containerType: "size",
          ["--u" as string]: 0,
          ["--s1" as string]: 1,
          ["--s2" as string]: 0,
          ["--s3" as string]: 0,
          ["--s4" as string]: 0,
        } as React.CSSProperties
      }
    >
      {/* the workspace atmosphere inside the glass */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 70% at 22% 12%, oklch(0.32 0.09 258 / 0.24) 0%, transparent 70%), radial-gradient(60% 60% at 88% 96%, oklch(0.26 0.07 258 / 0.2) 0%, transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: "calc(0.45 + var(--s2) * 0.5)" as unknown as number,
          backgroundImage:
            "linear-gradient(to right, oklch(0.7 0.15 258 / 0.07) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.7 0.15 258 / 0.05) 1px, transparent 1px)",
          backgroundSize: "6cqw 6cqw",
          maskImage: "radial-gradient(80% 80% at 50% 45%, black 0%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(80% 80% at 50% 45%, black 0%, transparent 85%)",
        }}
      />

      {/* chrome — the workspace label morphs from a file into a live domain */}
      <div className="relative flex items-center gap-[1.6cqw] border-b border-white/[0.06] px-[3.4%] py-[2%]">
        <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-white/12" />
        <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-white/[0.08]" />
        <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-white/[0.08]" />
        <div className="relative ml-[1.4cqw] h-[1.6cqw] flex-1">
          {[
            { t: "brief · elevate", v: "calc(var(--s1) + var(--s2) * 0.2)" },
            { t: "build · components", v: "var(--s3)" },
            { t: "elevate.cz · live", v: "var(--s4)" },
          ].map((s) => (
            <span
              key={s.t}
              className="absolute inset-0 font-mono text-[1cqw] uppercase tracking-[0.24em] text-muted-foreground/70"
              style={{ opacity: s.v as unknown as number }}
            >
              {s.t}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-[0.6cqw]">
          <span
            className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-primary"
            style={{ opacity: "var(--s4)" as unknown as number }}
          />
          <span
            className="font-mono text-[0.95cqw] uppercase tracking-[0.3em] text-primary"
            style={{ opacity: "var(--s4)" as unknown as number }}
          >
            live
          </span>
        </div>
      </div>

      {/* ============ the four states, stacked and cross-faded ============ */}
      <div className="relative h-[calc(100%-5.6cqw)] w-full">
        {/* 01 — IDEA: the brief */}
        <div
          className="absolute inset-0 flex flex-col justify-center px-[7%]"
          style={{
            opacity: "var(--s1)" as unknown as number,
            transform: "translate3d(0,0,0) scale(calc(1 - (1 - var(--s1)) * 0.03))",
          }}
        >
          <span className="font-mono text-[0.95cqw] uppercase tracking-[0.42em] text-primary">idea</span>
          <div className="mt-[3cqw] space-y-[2.4cqw]">
            {[
              { k: "projekt", v: "Nová digitální prezentace" },
              { k: "cíl", v: "Z návštěvníků klienti" },
            ].map((r) => (
              <div key={r.k} className="flex items-baseline gap-[3cqw]">
                <span className="w-[9cqw] shrink-0 font-mono text-[0.9cqw] uppercase tracking-[0.24em] text-muted-foreground/60">
                  {r.k}
                </span>
                <span className="text-[2.2cqw] font-medium leading-[1.1] tracking-[-0.03em] text-foreground">
                  {r.v}
                </span>
              </div>
            ))}
          </div>
          {/* interface fragments beginning to gather */}
          <div className="mt-[4cqw] flex items-center gap-[1.4cqw]">
            {["web", "e-shop", "produkt"].map((t, i) => (
              <span
                key={t}
                className="rounded-full border px-[1.6cqw] py-[0.55cqw] font-mono text-[0.85cqw] uppercase tracking-[0.2em]"
                style={{
                  borderColor: i === 0 ? "oklch(0.62 0.19 258 / 0.55)" : "oklch(1 0 0 / 0.09)",
                  color: i === 0 ? "oklch(0.78 0.13 258)" : "oklch(1 0 0 / 0.32)",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* 02 — DESIGN: the composition assembles */}
        <div
          className="absolute inset-0 p-[4%]"
          style={{
            opacity: "var(--s2)" as unknown as number,
            transform: "translate3d(0,0,0) scale(calc(0.98 + var(--s2) * 0.02))",
          }}
        >
          <div className="flex h-full flex-col">
            <div
              className="flex items-center justify-between"
              style={{ transform: "translate3d(0, calc((1 - var(--s2)) * -2cqw), 0)" }}
            >
              <span className="font-mono text-[1cqw] uppercase tracking-[0.4em] text-primary">elevate</span>
              <div className="flex items-center gap-[2cqw] font-mono text-[0.85cqw] uppercase tracking-[0.2em] text-muted-foreground/60">
                <span>služby</span>
                <span>práce</span>
                <span className="rounded-full bg-primary/90 px-[1.4cqw] py-[0.45cqw] text-primary-foreground">audit</span>
              </div>
            </div>

            <div className="mt-[3cqw] grid flex-1 grid-cols-5 gap-[2.4cqw]">
              <div
                className="col-span-3 flex flex-col justify-center"
                style={{ transform: "translate3d(calc((1 - var(--s2)) * -2cqw), 0, 0)" }}
              >
                <span className="font-mono text-[0.85cqw] uppercase tracking-[0.36em] text-primary">design</span>
                <h3 className="mt-[1.2cqw] text-[2.7cqw] font-medium leading-[1.03] tracking-[-0.035em] text-foreground">
                  Digitální produkt,
                  <br />
                  který prodává.
                </h3>
                <div className="mt-[1.8cqw] space-y-[0.9cqw]">
                  <div className="h-[0.55cqw] w-[62%] rounded-full bg-white/[0.13]" />
                  <div className="h-[0.55cqw] w-[44%] rounded-full bg-white/[0.09]" />
                </div>
                <div className="mt-[2.2cqw] flex items-center gap-[1.4cqw]">
                  <span className="rounded-full bg-primary px-[2cqw] py-[0.7cqw] text-[0.95cqw] text-primary-foreground">
                    Poptat projekt
                  </span>
                  <span className="font-mono text-[0.85cqw] uppercase tracking-[0.22em] text-muted-foreground/60">
                    reference
                  </span>
                </div>
              </div>
              <div
                className="col-span-2 overflow-hidden rounded-[0.8cqw]"
                style={{
                  transform: "translate3d(calc((1 - var(--s2)) * 2.4cqw), 0, 0)",
                  background:
                    "linear-gradient(150deg, oklch(0.36 0.1 258) 0%, oklch(0.19 0.05 258) 55%, oklch(0.12 0.02 258) 100%)",
                  boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.12)",
                }}
              />
            </div>

            <div className="mt-[2.4cqw] grid grid-cols-3 gap-[2cqw]">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="rounded-[0.7cqw] border border-white/[0.07] bg-white/[0.02] p-[1.4cqw]"
                  style={{ transform: `translate3d(0, calc((1 - var(--s2)) * ${2 + i}cqw), 0)` }}
                >
                  <div className="h-[0.5cqw] w-[58%] rounded-full bg-white/[0.16]" />
                  <div className="mt-[0.9cqw] h-[0.45cqw] w-[36%] rounded-full bg-white/[0.08]" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 03 — BUILD: the design becomes a working interface */}
        <div
          className="absolute inset-0 flex"
          style={{
            opacity: "var(--s3)" as unknown as number,
            transform: "translate3d(0,0,0) scale(calc(0.99 + var(--s3) * 0.01))",
          }}
        >
          <div className="hidden w-[20%] flex-col gap-[0.9cqw] border-r border-white/[0.06] p-[1.6cqw] md:flex">
            {["layout", "hero", "cards", "commerce", "footer"].map((t, i) => (
              <span
                key={t}
                className="flex items-center gap-[0.7cqw] rounded-[0.4cqw] px-[0.8cqw] py-[0.55cqw] font-mono text-[0.8cqw] uppercase tracking-[0.16em]"
                style={{
                  background: i === 1 ? "oklch(0.62 0.19 258 / 0.14)" : "transparent",
                  color: i === 1 ? "oklch(0.8 0.12 258)" : "oklch(1 0 0 / 0.28)",
                }}
              >
                <span className="h-[0.35cqw] w-[0.35cqw] rounded-full bg-current" />
                {t}
              </span>
            ))}
          </div>
          <div className="relative flex-1 p-[2.4cqw]">
            <div className="grid h-full grid-cols-3 grid-rows-3 gap-[1.4cqw]">
              <div className="col-span-2 row-span-2 rounded-[0.7cqw] border border-primary/30 bg-white/[0.02] p-[1.6cqw]">
                <span className="font-mono text-[0.8cqw] uppercase tracking-[0.24em] text-primary">component</span>
                <div className="mt-[1.4cqw] space-y-[0.8cqw]">
                  <div className="h-[0.5cqw] w-[70%] rounded-full bg-white/[0.18]" />
                  <div className="h-[0.5cqw] w-[52%] rounded-full bg-white/[0.09]" />
                  <div className="h-[0.5cqw] w-[36%] rounded-full bg-white/[0.07]" />
                </div>
              </div>
              {/* the mobile view slides in beside the desktop build */}
              <div
                className="row-span-2 overflow-hidden rounded-[0.9cqw] border border-white/[0.1] bg-[#06080d] p-[1cqw]"
                style={{ transform: "translate3d(calc((1 - var(--s3)) * 3cqw), 0, 0)" }}
              >
                <div className="mx-auto h-[0.3cqw] w-[26%] rounded-full bg-white/15" />
                <div className="mt-[1cqw] h-[3.4cqw] rounded-[0.5cqw] bg-gradient-to-br from-primary/40 to-transparent" />
                <div className="mt-[0.8cqw] space-y-[0.6cqw]">
                  <div className="h-[0.4cqw] w-[80%] rounded-full bg-white/[0.14]" />
                  <div className="h-[0.4cqw] w-[55%] rounded-full bg-white/[0.08]" />
                </div>
              </div>
              <div className="col-span-3 flex items-center gap-[1.2cqw] rounded-[0.7cqw] border border-white/[0.07] bg-white/[0.015] px-[1.4cqw]">
                <span className="h-[0.5cqw] w-[0.5cqw] rounded-full bg-primary" />
                <div className="h-[0.4cqw] w-[28%] rounded-full bg-white/[0.1]" />
                <div className="ml-auto h-[0.4cqw] w-[12%] rounded-full bg-white/[0.06]" />
              </div>
            </div>
          </div>
        </div>

        {/* 04 — LIVE: the finished product */}
        <div
          className="absolute inset-0 flex flex-col"
          style={{
            opacity: "var(--s4)" as unknown as number,
            transform: "translate3d(0,0,0) scale(calc(0.995 + var(--s4) * 0.005))",
          }}
        >
          <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-[7%]">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: "radial-gradient(70% 90% at 82% 18%, oklch(0.42 0.12 258 / 0.32) 0%, transparent 70%)",
              }}
            />
            <span className="relative font-mono text-[0.95cqw] uppercase tracking-[0.42em] text-primary">live</span>
            <h3 className="relative mt-[1.4cqw] text-[3cqw] font-medium leading-[1.02] tracking-[-0.04em] text-foreground">
              Digitální produkt
              <br />
              v reálném provozu.
            </h3>
            <div className="relative mt-[2.4cqw] flex items-center gap-[1.6cqw]">
              <span className="rounded-full bg-primary px-[2.2cqw] py-[0.75cqw] text-[1cqw] text-primary-foreground">
                Poptat projekt
              </span>
              <span className="font-mono text-[0.9cqw] uppercase tracking-[0.24em] text-muted-foreground/60">
                elevate.cz
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-px border-t border-white/[0.06] bg-white/[0.05]">
            {["web", "e-shop", "produkt"].map((t) => (
              <div key={t} className="flex items-center gap-[0.8cqw] bg-[#06080d] px-[1.6cqw] py-[1.2cqw]">
                <span className="h-[0.4cqw] w-[0.4cqw] rounded-full bg-primary" />
                <span className="font-mono text-[0.85cqw] uppercase tracking-[0.22em] text-muted-foreground/60">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* the timeline rail: IDEA → DESIGN → BUILD → LIVE, read at a glance */}
      <div className="absolute bottom-[2.4%] left-[4%] right-[4%] flex items-center gap-[1.2cqw]">
        {["idea", "design", "build", "live"].map((t, i) => (
          <div key={t} className="flex flex-1 items-center gap-[0.8cqw]">
            <span
              className="font-mono text-[0.75cqw] uppercase tracking-[0.28em]"
              style={{
                color: "oklch(1 0 0 / 0.3)",
                opacity: `calc(0.4 + var(--s${i + 1}) * 0.6)` as unknown as number,
              }}
            >
              {t}
            </span>
            <div className="h-px flex-1 bg-white/[0.07]">
              <div
                className="h-px bg-primary/70"
                style={{ width: `calc(var(--s${i + 1}) * 100%)` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
