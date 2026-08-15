import { useEffect, useRef } from "react";
import { PHASE, clamp01, range } from "./film";

/**
 * THE DISPLAY — a visual mini product presentation.
 *
 * Inside the device a real website is being made: a wireframe (IDEA) turns into
 * a composed visual design (DESIGN), becomes an interactive interface (BUILD)
 * and finally a polished live site (LIVE). Scroll is the only driver: four CSS
 * variables (--s1 … --s4) are written once per frame on the root, so every
 * child interpolates on the GPU through opacity / transform only. Each stage
 * gets a long HOLD and only a short crossfade window, and scrubbing back
 * reverses exactly.
 */

const STAGES = 4;
/** share of each stage's slice spent transforming — the rest is HOLD */
const TRANSITION = 0.34;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** u (0→1) → stage position (0→3) with long plateaus on each stage */
function holdStage(u: number) {
  const raw = clamp01(u) * (STAGES - 1);
  const i = Math.min(STAGES - 2, Math.floor(raw));
  const fr = raw - i;
  const start = (1 - TRANSITION) / 2;
  return i + smoothstep(clamp01((fr - start) / TRANSITION));
}

export function WorkspaceDisplay({
  progress,
  chrome = true,
}: {
  progress?: React.RefObject<number>;
  /** the device shows the workspace chrome; the fullscreen takeover does not */
  chrome?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = root.current;
      if (el) {
        const p = progress?.current ?? 0;
        const u = clamp01(range(0.02, PHASE.HANDOFF, p));
        const s = holdStage(u);
        el.style.setProperty("--u", u.toFixed(4));
        el.style.setProperty("--stage", s.toFixed(4));
        for (let i = 0; i < STAGES; i++) {
          el.style.setProperty(`--s${i + 1}`, clamp01(1 - Math.abs(s - i)).toFixed(4));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [progress]);

  return (
    <div
      ref={root}
      className="relative h-full w-full overflow-hidden bg-[#04070c] text-foreground"
      style={
        {
          containerType: "size",
          ["--u" as string]: 0,
          ["--stage" as string]: 0,
          ["--s1" as string]: 1,
          ["--s2" as string]: 0,
          ["--s3" as string]: 0,
          ["--s4" as string]: 0,
        } as React.CSSProperties
      }
    >
      {/* atmosphere behind the interface */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 70% at 22% 10%, oklch(0.38 0.1 258 / 0.34) 0%, transparent 70%), radial-gradient(60% 60% at 88% 96%, oklch(0.3 0.08 258 / 0.28) 0%, transparent 72%)",
        }}
      />
      {/* the wireframe blueprint grid — strongest at IDEA, fades as design lands */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: "calc(0.25 + var(--s1) * 0.75)" as unknown as number,
          backgroundImage:
            "linear-gradient(to right, oklch(0.7 0.15 258 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.7 0.15 258 / 0.07) 1px, transparent 1px)",
          backgroundSize: "4cqw 4cqw",
          maskImage: "radial-gradient(85% 85% at 50% 45%, black 0%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(85% 85% at 50% 45%, black 0%, transparent 90%)",
        }}
      />

      {/* chrome — the workspace label morphs from a file into a live domain */}
      {chrome && (
        <div className="relative flex items-center gap-[1.6cqw] border-b border-white/[0.06] px-[3.4%] py-[2%]">
          <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-white/12" />
          <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-white/[0.08]" />
          <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-white/[0.08]" />
          <div className="relative ml-[1.4cqw] h-[1.6cqw] flex-1">
            {[
              { t: "wireframe · v01", v: "var(--s1)" },
              { t: "design · elevate", v: "var(--s2)" },
              { t: "build · components", v: "var(--s3)" },
              { t: "elevate.cz", v: "var(--s4)" },
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
              elevate / live
            </span>
          </div>
        </div>
      )}

      {/* ============ the four states of one website, cross-faded ============ */}
      <div
        className="relative w-full"
        style={{ height: chrome ? "calc(100% - 5.6cqw)" : "100%", perspective: "160cqw" }}
      >
        <IdeaWireframe />
        <DesignComposition />
        <BuildInterface />
        <LiveSite />
      </div>

      {/* glass: reflections, edge highlight and blue rim inside the panel */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(118deg, oklch(1 0 0 / 0.075) 0%, oklch(1 0 0 / 0.018) 26%, transparent 44%), linear-gradient(0deg, oklch(0.6 0.17 258 / 0.07) 0%, transparent 30%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          boxShadow:
            "inset 0 1px 0 oklch(1 0 0 / 0.14), inset 0 0 3cqw oklch(0.6 0.17 258 / 0.12), inset 0 -1px 0 oklch(0.6 0.17 258 / 0.16)",
        }}
      />

      {/* the timeline rail: IDEA → DESIGN → BUILD → LIVE, read at a glance */}
      {chrome && (
        <div className="absolute bottom-[2.4%] left-[4%] right-[4%] flex items-center gap-[1.2cqw]">
          {["idea", "design", "build", "live"].map((t, i) => (
            <div key={t} className="flex flex-1 items-center gap-[0.8cqw]">
              <span
                className="font-mono text-[0.75cqw] uppercase tracking-[0.28em]"
                style={{
                  color: "oklch(1 0 0 / 0.32)",
                  opacity: `calc(0.4 + var(--s${i + 1}) * 0.6)` as unknown as number,
                }}
              >
                {t}
              </span>
              <div className="h-px flex-1 bg-white/[0.07]">
                <div className="h-px bg-primary/70" style={{ width: `calc(var(--s${i + 1}) * 100%)` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* helpers                                                             */
/* ------------------------------------------------------------------ */

function State({
  v,
  children,
  className = "",
  style,
}: {
  /** the CSS expression selecting this state's weight */
  v: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        opacity: v as unknown as number,
        transform: `translate3d(0,0,0) scale(calc(0.985 + ${v} * 0.015))`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/** thin wireframe box */
function Box({ className, label }: { className?: string; label?: string }) {
  return (
    <div
      className={`relative rounded-[0.4cqw] border border-dashed ${className ?? ""}`}
      style={{ borderColor: "oklch(0.7 0.13 258 / 0.34)", background: "oklch(0.6 0.17 258 / 0.04)" }}
    >
      {label && (
        <span className="absolute left-[0.6cqw] top-[0.5cqw] font-mono text-[0.7cqw] uppercase tracking-[0.24em] text-primary/60">
          {label}
        </span>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 01 — IDEA: an early website wireframe                               */
/* ------------------------------------------------------------------ */

function IdeaWireframe() {
  return (
    <State v="var(--s1)" className="flex flex-col gap-[1.2cqw] p-[3.4%]">
      {/* header */}
      <div className="flex h-[2.6cqw] shrink-0 items-center gap-[1cqw]">
        <Box className="h-full w-[8cqw]" />
        <div className="ml-auto flex gap-[0.8cqw]">
          {[0, 1, 2].map((i) => (
            <Box key={i} className="h-full w-[4.4cqw]" />
          ))}
          <Box className="h-full w-[6cqw]" />
        </div>
      </div>
      {/* hero + image placeholder */}
      <div className="flex flex-1 gap-[1.2cqw]">
        <Box className="flex-1" label="hero">
          <div className="flex h-full flex-col justify-center gap-[0.8cqw] px-[1.4cqw]">
            <div className="h-[1cqw] w-[76%] rounded-full bg-white/[0.12]" />
            <div className="h-[1cqw] w-[54%] rounded-full bg-white/[0.09]" />
            <div className="mt-[0.6cqw] h-[0.5cqw] w-[62%] rounded-full bg-white/[0.06]" />
            <div className="mt-[0.8cqw] h-[1.9cqw] w-[9cqw] rounded-full border border-dashed border-primary/40" />
          </div>
        </Box>
        <Box className="w-[34%]" label="image">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full" fill="none">
            <path d="M0 0 L100 100 M100 0 L0 100" stroke="oklch(0.7 0.13 258 / 0.24)" strokeWidth="0.5" />
          </svg>
        </Box>
      </div>
      {/* content cards */}
      <div className="flex h-[7cqw] shrink-0 gap-[1.2cqw]">
        {[0, 1, 2].map((i) => (
          <Box key={i} className="flex-1">
            <div className="flex h-full flex-col justify-end gap-[0.6cqw] p-[1cqw]">
              <div className="h-[0.5cqw] w-[62%] rounded-full bg-white/[0.1]" />
              <div className="h-[0.45cqw] w-[40%] rounded-full bg-white/[0.06]" />
            </div>
          </Box>
        ))}
      </div>
      {/* CTA strip */}
      <Box className="h-[3.2cqw] shrink-0">
        <div className="flex h-full items-center justify-between px-[1.4cqw]">
          <div className="h-[0.5cqw] w-[22%] rounded-full bg-white/[0.1]" />
          <div className="h-[1.7cqw] w-[8cqw] rounded-full border border-dashed border-primary/40" />
        </div>
      </Box>
    </State>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — DESIGN: the wireframe becomes a composed visual design         */
/* ------------------------------------------------------------------ */

function DesignComposition() {
  return (
    <State v="var(--s2)" className="flex flex-col p-[3.4%]">
      {/* navigation */}
      <div
        className="flex shrink-0 items-center justify-between"
        style={{ transform: "translate3d(0, calc((1 - var(--s2)) * -2cqw), 0)" }}
      >
        <span className="font-mono text-[1cqw] uppercase tracking-[0.4em] text-primary">elevate</span>
        <div className="flex items-center gap-[1.8cqw] font-mono text-[0.85cqw] uppercase tracking-[0.2em] text-muted-foreground/65">
          <span>služby</span>
          <span>práce</span>
          <span>o nás</span>
          <span className="rounded-full bg-primary px-[1.4cqw] py-[0.45cqw] text-primary-foreground">audit</span>
        </div>
      </div>

      {/* hero composition */}
      <div className="mt-[2.6cqw] grid flex-1 grid-cols-5 gap-[2cqw]">
        <div
          className="col-span-3 flex flex-col justify-center"
          style={{ transform: "translate3d(calc((1 - var(--s2)) * -2.4cqw), 0, 0)" }}
        >
          <span className="font-mono text-[0.8cqw] uppercase tracking-[0.36em] text-primary">digitální studio</span>
          <h3 className="mt-[1cqw] text-[2.8cqw] font-medium leading-[1.02] tracking-[-0.035em] text-foreground">
            Digitální produkt,
            <br />
            který prodává.
          </h3>
          <p className="mt-[1.2cqw] max-w-[26cqw] text-[0.95cqw] leading-relaxed text-muted-foreground/75">
            Weby, e-shopy a aplikace navržené pro důvěru, výkon a růst.
          </p>
          <div className="mt-[1.8cqw] flex items-center gap-[1.4cqw]">
            <span className="rounded-full bg-primary px-[2cqw] py-[0.7cqw] text-[0.95cqw] text-primary-foreground">
              Poptat projekt
            </span>
            <span className="font-mono text-[0.85cqw] uppercase tracking-[0.22em] text-muted-foreground/60">
              reference
            </span>
          </div>
        </div>
        <div
          className="relative col-span-2 overflow-hidden rounded-[0.9cqw]"
          style={{
            transform: "translate3d(calc((1 - var(--s2)) * 3cqw), 0, 0)",
            background:
              "linear-gradient(150deg, oklch(0.42 0.12 258) 0%, oklch(0.2 0.05 258) 58%, oklch(0.11 0.02 258) 100%)",
            boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.14), 0 2cqw 4cqw oklch(0.02 0 0 / 0.5)",
          }}
        >
          <div
            aria-hidden
            className="absolute inset-0"
            style={{ background: "linear-gradient(120deg, oklch(1 0 0 / 0.1), transparent 46%)" }}
          />
        </div>
      </div>

      {/* three cards assembling in */}
      <div className="mt-[2cqw] grid shrink-0 grid-cols-3 gap-[1.6cqw]">
        {["web", "e-shop", "aplikace"].map((t, i) => (
          <div
            key={t}
            className="rounded-[0.7cqw] border border-white/[0.08] bg-white/[0.025] p-[1.2cqw]"
            style={{ transform: `translate3d(0, calc((1 - var(--s2)) * ${2 + i * 1.4}cqw), 0)` }}
          >
            <span className="font-mono text-[0.7cqw] uppercase tracking-[0.24em] text-primary/80">{t}</span>
            <div className="mt-[0.8cqw] h-[0.45cqw] w-[64%] rounded-full bg-white/[0.14]" />
            <div className="mt-[0.6cqw] h-[0.4cqw] w-[40%] rounded-full bg-white/[0.07]" />
          </div>
        ))}
      </div>
    </State>
  );
}

/* ------------------------------------------------------------------ */
/* 03 — BUILD: the design becomes a working, reacting interface        */
/* ------------------------------------------------------------------ */

function BuildInterface() {
  return (
    <State v="var(--s3)" className="flex">
      {/* component rail */}
      <div className="hidden w-[19%] flex-col gap-[0.8cqw] border-r border-white/[0.06] p-[1.4cqw] md:flex">
        {["layout", "hero", "cards", "commerce", "footer"].map((t, i) => (
          <span
            key={t}
            className="flex items-center gap-[0.7cqw] rounded-[0.4cqw] px-[0.8cqw] py-[0.55cqw] font-mono text-[0.8cqw] uppercase tracking-[0.16em]"
            style={{
              background: i === 1 ? "oklch(0.62 0.19 258 / 0.16)" : "transparent",
              color: i === 1 ? "oklch(0.82 0.12 258)" : "oklch(1 0 0 / 0.3)",
            }}
          >
            <span className="h-[0.35cqw] w-[0.35cqw] rounded-full bg-current" />
            {t}
          </span>
        ))}
      </div>

      <div className="relative flex-1 p-[2cqw]">
        {/* the live canvas: the designed hero, now selected and interactive */}
        <div className="flex h-full flex-col gap-[1.4cqw]">
          <div className="relative flex-1 overflow-hidden rounded-[0.8cqw] border border-primary/35 bg-white/[0.02] p-[1.6cqw]">
            <span className="absolute -top-[0.1cqw] left-[1.4cqw] -translate-y-1/2 rounded-full bg-primary px-[0.9cqw] py-[0.2cqw] font-mono text-[0.6cqw] uppercase tracking-[0.2em] text-primary-foreground">
              hero
            </span>
            {/* navigation sliding into place */}
            <div
              className="flex items-center justify-between"
              style={{ transform: "translate3d(calc(var(--s3) * 0.6cqw - 0.6cqw), 0, 0)" }}
            >
              <span className="font-mono text-[0.8cqw] uppercase tracking-[0.32em] text-primary">elevate</span>
              <div className="flex gap-[0.7cqw]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-[0.35cqw] w-[2.6cqw] rounded-full"
                    style={{ background: i === 2 ? "oklch(0.65 0.18 258 / 0.8)" : "oklch(1 0 0 / 0.12)" }}
                  />
                ))}
              </div>
            </div>
            <div className="mt-[1.6cqw] h-[0.6cqw] w-[70%] rounded-full bg-white/[0.18]" />
            <div className="mt-[0.7cqw] h-[0.6cqw] w-[48%] rounded-full bg-white/[0.1]" />
            {/* button in a hover state */}
            <div
              className="mt-[1.4cqw] inline-flex items-center gap-[0.7cqw] rounded-full px-[1.8cqw] py-[0.7cqw] text-[0.85cqw]"
              style={{
                background: "oklch(0.65 0.18 258 / calc(0.35 + var(--s3) * 0.55))",
                boxShadow: "0 0 2.6cqw oklch(0.6 0.17 258 / calc(var(--s3) * 0.45))",
                color: "oklch(0.96 0.02 255)",
                transform: "translate3d(0, calc(var(--s3) * -0.3cqw), 0)",
              }}
            >
              Poptat projekt
              <span className="h-[0.35cqw] w-[0.35cqw] rounded-full bg-current" />
            </div>
            {/* cursor sitting on the button */}
            <svg
              viewBox="0 0 24 24"
              className="absolute h-[1.8cqw] w-[1.8cqw]"
              style={{
                left: "13cqw",
                top: "13.6cqw",
                opacity: "var(--s3)" as unknown as number,
                transform: "translate3d(calc((1 - var(--s3)) * 3cqw), calc((1 - var(--s3)) * 2cqw), 0)",
                filter: "drop-shadow(0 0.4cqw 0.6cqw oklch(0.02 0 0 / 0.6))",
              }}
              fill="oklch(0.97 0.01 255)"
            >
              <path d="M5 3l14 8-6 1.6L9.6 19 5 3Z" />
            </svg>
          </div>

          {/* responsive breakpoints + component row */}
          <div className="flex h-[26%] shrink-0 gap-[1.4cqw]">
            <div
              className="w-[16%] overflow-hidden rounded-[0.7cqw] border border-white/[0.1] bg-[#05080e] p-[0.7cqw]"
              style={{ transform: "translate3d(calc((1 - var(--s3)) * 3cqw), 0, 0)" }}
            >
              <div className="mx-auto h-[0.25cqw] w-[40%] rounded-full bg-white/15" />
              <div className="mt-[0.7cqw] h-[42%] rounded-[0.4cqw] bg-gradient-to-br from-primary/45 to-transparent" />
              <div className="mt-[0.6cqw] h-[0.35cqw] w-[80%] rounded-full bg-white/[0.14]" />
              <div className="mt-[0.4cqw] h-[0.35cqw] w-[52%] rounded-full bg-white/[0.07]" />
            </div>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex-1 rounded-[0.7cqw] border border-white/[0.07] bg-white/[0.02] p-[1cqw]"
                style={{ transform: `translate3d(0, calc((1 - var(--s3)) * ${1.4 + i}cqw), 0)` }}
              >
                <div className="h-[0.4cqw] w-[56%] rounded-full bg-white/[0.15]" />
                <div className="mt-[0.6cqw] h-[0.35cqw] w-[34%] rounded-full bg-white/[0.07]" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </State>
  );
}

/* ------------------------------------------------------------------ */
/* 04 — LIVE: the finished, premium website                            */
/* ------------------------------------------------------------------ */

function LiveSite() {
  return (
    <State v="var(--s4)" className="flex flex-col">
      {/* real site navigation */}
      <div className="flex shrink-0 items-center justify-between px-[3.6%] pt-[2.6%]">
        <span className="font-mono text-[1cqw] uppercase tracking-[0.42em] text-foreground">elevate</span>
        <div className="flex items-center gap-[1.8cqw] font-mono text-[0.82cqw] uppercase tracking-[0.2em] text-muted-foreground/65">
          <span>služby</span>
          <span>práce</span>
          <span>kontakt</span>
          <span className="rounded-full bg-primary px-[1.4cqw] py-[0.45cqw] text-primary-foreground">audit</span>
        </div>
      </div>

      {/* full-bleed hero */}
      <div className="relative mt-[2%] flex flex-1 items-center overflow-hidden px-[3.6%]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(80% 100% at 84% 14%, oklch(0.46 0.13 258 / 0.4) 0%, transparent 68%), radial-gradient(60% 80% at 8% 90%, oklch(0.3 0.08 258 / 0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative grid w-full grid-cols-5 items-center gap-[2cqw]">
          <div className="col-span-3">
            <h3 className="text-[3cqw] font-medium leading-[1.02] tracking-[-0.04em] text-foreground">
              Digitální produkt
              <br />
              v reálném provozu.
            </h3>
            <p className="mt-[1.2cqw] max-w-[26cqw] text-[0.95cqw] leading-relaxed text-muted-foreground/75">
              Navrženo, postaveno a spuštěno studiem ELEVATE.
            </p>
            <div className="mt-[1.8cqw] flex items-center gap-[1.4cqw]">
              <span className="rounded-full bg-primary px-[2.2cqw] py-[0.75cqw] text-[0.95cqw] text-primary-foreground">
                Poptat projekt
              </span>
              <span className="font-mono text-[0.85cqw] uppercase tracking-[0.24em] text-muted-foreground/60">
                elevate.cz
              </span>
            </div>
          </div>
          {/* the polished hero visual */}
          <div
            className="relative col-span-2 aspect-[4/5] overflow-hidden rounded-[1cqw]"
            style={{
              background:
                "linear-gradient(155deg, oklch(0.5 0.14 258) 0%, oklch(0.24 0.06 258) 52%, oklch(0.1 0.02 258) 100%)",
              boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.16), 0 2.4cqw 5cqw oklch(0.02 0 0 / 0.6)",
            }}
          >
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "linear-gradient(118deg, oklch(1 0 0 / 0.14), transparent 44%)" }}
            />
            <div className="absolute inset-x-[1.2cqw] bottom-[1.2cqw]">
              <div className="h-[0.4cqw] w-[62%] rounded-full bg-white/25" />
              <div className="mt-[0.5cqw] h-[0.35cqw] w-[38%] rounded-full bg-white/12" />
            </div>
          </div>
        </div>
      </div>

      {/* footer strip */}
      <div className="grid shrink-0 grid-cols-3 gap-px border-t border-white/[0.06] bg-white/[0.05]">
        {["web", "e-shop", "aplikace"].map((t) => (
          <div key={t} className="flex items-center gap-[0.8cqw] bg-[#04070c] px-[1.6cqw] py-[1.1cqw]">
            <span className="h-[0.4cqw] w-[0.4cqw] rounded-full bg-primary" />
            <span className="font-mono text-[0.82cqw] uppercase tracking-[0.22em] text-muted-foreground/60">{t}</span>
          </div>
        ))}
      </div>
    </State>
  );
}
