import { useEffect, useRef } from "react";
import { startFrameLoop } from "@/lib/raf";
import characterWeb from "@/assets/scene-web.webp";
import aMark from "@/assets/elevate-a-mark.png.asset.json";
import { PHASE, clamp01, range } from "./film";

/**
 * THE DISPLAY — the ELEVATE workspace, building one website.
 *
 * Three states only, so nothing reads as a generic dashboard:
 *   01 BLUEPRINT — a browser frame and a bare layout skeleton
 *   02 LAYOUT    — navigation, hero, cards and CTA take their place
 *   03 WEB       — the finished, ELEVATE-branded website with the character
 *
 * The last state is deliberately the same visual world as service 01 / WEBY, so
 * the camera travelling out of the display lands inside that scene without a cut.
 * Scroll is the only driver: three CSS variables are written once per frame on
 * the root and every child interpolates on the GPU (opacity / transform only).
 */

const STAGES = 3;
/** share of each stage's slice spent transforming — the rest is HOLD */
const TRANSITION = 0.3;

const smoothstep = (t: number) => t * t * (3 - 2 * t);

/** u (0→1) → stage position (0→2) with long plateaus on each stage */
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
  /** the device shows the browser chrome; the fullscreen takeover does not */
  chrome?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return startFrameLoop(() => {
      const el = root.current;
      if (!el) return;
      const p = progress?.current ?? 0;
      const u = clamp01(range(0.02, PHASE.HANDOFF, p));
      const s = holdStage(u);
      el.style.setProperty("--u", u.toFixed(4));
      for (let i = 0; i < STAGES; i++) {
        el.style.setProperty(`--s${i + 1}`, clamp01(1 - Math.abs(s - i)).toFixed(4));
      }
    });
  }, [progress]);

  return (
    <div
      ref={root}
      className="relative h-full w-full overflow-hidden bg-[#04070c] text-foreground"
      style={
        {
          containerType: "size",
          ["--u" as string]: 0,
          ["--s1" as string]: 1,
          ["--s2" as string]: 0,
          ["--s3" as string]: 0,
        } as React.CSSProperties
      }
    >
      {/* atmosphere behind the interface */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 70% at 24% 8%, oklch(0.38 0.1 258 / 0.32) 0%, transparent 70%), radial-gradient(60% 60% at 88% 96%, oklch(0.3 0.08 258 / 0.26) 0%, transparent 72%)",
        }}
      />
      {/* blueprint grid — strongest at 01, thins out as the site resolves */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          opacity: "calc(0.14 + var(--s1) * 0.86)" as unknown as number,
          backgroundImage:
            "linear-gradient(to right, oklch(0.7 0.15 258 / 0.1) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.7 0.15 258 / 0.07) 1px, transparent 1px)",
          backgroundSize: "4cqw 4cqw",
          maskImage: "radial-gradient(85% 85% at 50% 45%, black 0%, transparent 90%)",
          WebkitMaskImage: "radial-gradient(85% 85% at 50% 45%, black 0%, transparent 90%)",
        }}
      />

      {/* browser chrome: the address bar resolves into the real domain */}
      {chrome && (
        <div className="relative flex items-center gap-[1.6cqw] border-b border-white/[0.06] px-[3.4%] py-[2%]">
          <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-white/12" />
          <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-white/[0.08]" />
          <span className="h-[0.7cqw] w-[0.7cqw] rounded-full bg-white/[0.08]" />
          <div className="relative ml-[1.4cqw] h-[1.6cqw] flex-1">
            {[
              { t: "www / layout", v: "var(--s1)" },
              { t: "www / elevate", v: "var(--s2)" },
              { t: "elevate.cz", v: "var(--s3)" },
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
          <span
            className="font-mono text-[0.95cqw] uppercase tracking-[0.3em] text-primary"
            style={{ opacity: "var(--s3)" as unknown as number }}
          >
            live
          </span>
        </div>
      )}

      {/* ============ the three states of one website, cross-faded ============ */}
      <div
        className="relative w-full"
        style={{ height: chrome ? "calc(100% - 5.6cqw)" : "100%", perspective: "160cqw" }}
      >
        <Blueprint />
        <Layout />
        <FinishedWeb />
      </div>

      {/* glass: reflection, edge highlight and a blue rim inside the panel */}
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
}: {
  /** the CSS expression selecting this state's weight */
  v: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 ${className}`}
      style={{
        opacity: v as unknown as number,
        transform: `translate3d(0,0,0) scale(calc(0.985 + ${v} * 0.015))`,
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
/* 01 — BLUEPRINT: the bare layout skeleton                            */
/* ------------------------------------------------------------------ */

function Blueprint() {
  return (
    <State v="var(--s1)" className="flex flex-col gap-[1.2cqw] p-[3.4%]">
      <div className="flex h-[2.6cqw] shrink-0 items-center gap-[1cqw]">
        <Box className="h-full w-[8cqw]" />
        <div className="ml-auto flex h-full gap-[0.8cqw]">
          {[0, 1, 2].map((i) => (
            <Box key={i} className="h-full w-[4.4cqw]" />
          ))}
          <Box className="h-full w-[6cqw]" />
        </div>
      </div>
      <div className="flex flex-1 gap-[1.2cqw]">
        <Box className="flex-1" label="hero" />
        <Box className="w-[34%]" label="visual" />
      </div>
      <div className="flex h-[7cqw] shrink-0 gap-[1.2cqw]">
        {[0, 1, 2].map((i) => (
          <Box key={i} className="flex-1" />
        ))}
      </div>
      <Box className="h-[3.2cqw] shrink-0" label="cta" />
    </State>
  );
}

/* ------------------------------------------------------------------ */
/* 02 — LAYOUT: navigation, hero, cards and CTA take their place       */
/* ------------------------------------------------------------------ */

function Layout() {
  return (
    <State v="var(--s2)" className="flex flex-col p-[3.4%]">
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

      <div className="mt-[2.6cqw] grid flex-1 grid-cols-5 gap-[2cqw]">
        <div
          className="col-span-3 flex flex-col justify-center"
          style={{ transform: "translate3d(calc((1 - var(--s2)) * -2.4cqw), 0, 0)" }}
        >
          <span className="font-mono text-[0.8cqw] uppercase tracking-[0.36em] text-primary">digitální studio</span>
          <h3 className="mt-[1cqw] text-[2.8cqw] font-medium leading-[1.02] tracking-[-0.035em] text-foreground">
            Web, který
            <br />
            přesvědčí.
          </h3>
          <div className="mt-[1.4cqw] h-[0.5cqw] w-[62%] rounded-full bg-white/[0.12]" />
          <div className="mt-[0.7cqw] h-[0.5cqw] w-[42%] rounded-full bg-white/[0.07]" />
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
            boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.14)",
          }}
        />
      </div>

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
/* 03 — WEB: the finished, ELEVATE-branded website                     */
/* ------------------------------------------------------------------ */

function FinishedWeb() {
  return (
    <State v="var(--s3)" className="flex flex-col">
      {/* site navigation with the ELEVATE mark */}
      <div className="flex shrink-0 items-center justify-between px-[3.6%] pt-[2.6%]">
        <span className="flex items-center gap-[0.9cqw]">
          <img src={aMark.url} alt="" className="h-[1.5cqw] w-[1.5cqw] object-contain" decoding="async" />
          <span className="font-mono text-[1cqw] uppercase tracking-[0.42em] text-foreground">elevate</span>
        </span>
        <div className="flex items-center gap-[1.8cqw] font-mono text-[0.82cqw] uppercase tracking-[0.2em] text-muted-foreground/65">
          <span>weby</span>
          <span>e-shopy</span>
          <span>kontakt</span>
          <span className="rounded-full bg-primary px-[1.4cqw] py-[0.45cqw] text-primary-foreground">audit</span>
        </div>
      </div>

      {/* full-bleed hero with the ELEVATE character */}
      <div className="relative mt-[1%] flex flex-1 items-end overflow-hidden px-[3.6%]">
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(70% 100% at 78% 20%, oklch(0.46 0.13 258 / 0.42) 0%, transparent 66%), radial-gradient(60% 80% at 6% 92%, oklch(0.3 0.08 258 / 0.3) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex w-full items-end justify-between gap-[2cqw] pb-[2%]">
          <div className="max-w-[58%] pb-[2cqw]">
            <h3 className="text-[3cqw] font-medium leading-[1.02] tracking-[-0.04em] text-foreground">
              Weby, které
              <br />
              posouvají byznys.
            </h3>
            <div className="mt-[1.6cqw] flex items-center gap-[1.4cqw]">
              <span className="rounded-full bg-primary px-[2.2cqw] py-[0.75cqw] text-[0.95cqw] text-primary-foreground">
                Poptat projekt
              </span>
              <span className="font-mono text-[0.85cqw] uppercase tracking-[0.24em] text-muted-foreground/60">
                elevate.cz
              </span>
            </div>
          </div>
          {/* the character, unchanged, lit into the finished page */}
          <img
            src={characterWeb}
            alt=""
            width={1024}
            height={1024}
            decoding="async"
            className="h-[68%] w-auto max-w-none self-end object-contain"
            style={{
              filter: "drop-shadow(0 1.4cqw 2cqw oklch(0.03 0.01 258 / 0.7))",
              maskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, #000 78%, transparent 100%)",
            }}
          />
        </div>
      </div>

      {/* footer strip */}
      <div className="grid shrink-0 grid-cols-3 gap-px border-t border-white/[0.06] bg-white/[0.05]">
        {["weby", "e-shopy", "aplikace"].map((t) => (
          <div key={t} className="flex items-center gap-[0.8cqw] bg-[#04070c] px-[1.6cqw] py-[1.1cqw]">
            <span className="h-[0.4cqw] w-[0.4cqw] rounded-full bg-primary" />
            <span className="font-mono text-[0.82cqw] uppercase tracking-[0.22em] text-muted-foreground/60">{t}</span>
          </div>
        ))}
      </div>
    </State>
  );
}
