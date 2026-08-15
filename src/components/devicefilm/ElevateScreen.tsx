import { useEffect, useRef } from "react";
import mark from "@/assets/elevate-a-mark.png.asset.json";
import { startFrameLoop } from "@/lib/raf";
import { clamp01, easeFilm, range } from "./film";

/**
 * THE SCREEN — a finished ELEVATE digital product, live from the first frame.
 *
 * No wireframes, no skeletons, no dashboard: a real premium website interface
 * (browser chrome, navigation, hero, capability cards, a responsive preview and
 * two quiet metrics). Scroll gives it depth — the layers separate slightly
 * toward the lens as the camera commits, which is exactly the move that hands
 * the frame over to the first service scene.
 */
export function ElevateScreen({
  progress,
  chrome = true,
}: {
  progress: React.RefObject<number>;
  chrome?: boolean;
}) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    return startFrameLoop(() => {
      const p = progress.current ?? 0;
      // depth separation of the interface layers as the camera approaches
      const d = easeFilm(range(0.35, 1, p));
      el.style.setProperty("--d", d.toFixed(4));
      el.style.setProperty("--lift", clamp01(range(0.05, 0.4, p)).toFixed(4));
    }, el);
  }, [progress]);

  return (
    <div
      ref={root}
      className="relative h-full w-full overflow-hidden bg-[#05070d] text-white"
      style={{ ["--d" as string]: 0, ["--lift" as string]: 0 }}
    >
      {/* interior light — a gradient, not a blur stack */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(85% 70% at 82% 6%, #14315e 0%, transparent 62%), radial-gradient(60% 60% at 8% 100%, #0a1930 0%, transparent 70%)",
        }}
      />

      {chrome && (
        <div className="relative flex items-center gap-2 border-b border-white/[0.07] px-[3.2%] py-[2%]">
          <span className="h-[0.5vh] w-[0.5vh] min-h-[3px] min-w-[3px] rounded-full bg-white/20" />
          <span className="h-[0.5vh] w-[0.5vh] min-h-[3px] min-w-[3px] rounded-full bg-white/14" />
          <span className="h-[0.5vh] w-[0.5vh] min-h-[3px] min-w-[3px] rounded-full bg-white/14" />
          <span className="ml-[2%] rounded-full bg-white/[0.05] px-[1.6%] py-[0.5%] font-mono text-[0.75em] tracking-[0.14em] text-white/45">
            elevateit.cz
          </span>
        </div>
      )}

      {/* site navigation */}
      <div className="relative flex items-center justify-between px-[4%] pt-[3%]">
        <span className="flex items-center gap-[0.6em]">
          <img src={mark.url} alt="" className="h-[1.5em] w-auto" />
          <span className="text-[1.05em] font-medium tracking-[0.22em]">ELEVATE</span>
        </span>
        <span className="flex items-center gap-[1.4em] font-mono text-[0.78em] uppercase tracking-[0.22em] text-white/45">
          <span>Weby</span>
          <span>E-shopy</span>
          <span>Aplikace</span>
          <span className="rounded-full bg-[#2f6fd6] px-[1em] py-[0.4em] text-white/95">Poptat</span>
        </span>
      </div>

      {/* hero */}
      <div
        className="relative px-[4%] pt-[5%]"
        style={{ transform: "translate3d(0, calc(var(--lift) * -1.5%), 0)" }}
      >
        <span className="font-mono text-[0.75em] uppercase tracking-[0.34em] text-[#7fabf0]">
          Digitální studio · Praha
        </span>
        <h3 className="mt-[1.6%] max-w-[68%] text-[2.6em] font-medium leading-[1.03] tracking-[-0.035em]">
          Weby, e-shopy a aplikace, které <span className="text-[#7fabf0]">prodávají</span>.
        </h3>
      </div>

      {/* capability cards — separate toward the lens with scroll */}
      <div
        className="relative mt-[4%] grid grid-cols-3 gap-[2%] px-[4%]"
        style={{
          transform: "perspective(900px) translate3d(0, calc(var(--d) * -2%), 0) scale(calc(1 + var(--d) * 0.06))",
        }}
      >
        {[
          { t: "Weby", s: "UX · výkon" },
          { t: "E-shopy", s: "konverze" },
          { t: "Aplikace", s: "iOS · Android" },
        ].map((c, i) => (
          <div
            key={c.t}
            className="rounded-[0.6em] border border-white/[0.09] px-[6%] py-[6%]"
            style={{
              background:
                i === 0
                  ? "linear-gradient(155deg, #23508f 0%, #10203a 70%)"
                  : "linear-gradient(155deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 70%)",
              transform: `translate3d(0, calc(var(--d) * ${-1.5 - i * 1.2}%), 0)`,
            }}
          >
            <span className="block text-[1em] font-medium tracking-[-0.01em]">{c.t}</span>
            <span className="mt-[0.4em] block font-mono text-[0.72em] uppercase tracking-[0.2em] text-white/45">
              {c.s}
            </span>
            <span className="mt-[1.2em] block h-px w-full bg-gradient-to-r from-[#4d86e0]/70 to-transparent" />
          </div>
        ))}
      </div>

      {/* responsive preview + quiet metrics */}
      <div className="relative mt-[4%] flex items-end justify-between px-[4%] pb-[4%]">
        <div className="flex items-end gap-[1.4em] font-mono text-[0.75em] uppercase tracking-[0.2em] text-white/45">
          <span>
            <span className="block text-[1.9em] tracking-[-0.03em] text-white">98</span>
            performance
          </span>
          <span>
            <span className="block text-[1.9em] tracking-[-0.03em] text-white">2.4×</span>
            konverze
          </span>
        </div>
        <div
          className="flex items-end gap-[0.7em]"
          style={{ transform: "translate3d(calc(var(--d) * 2%), 0, 0)" }}
        >
          <span
            className="block h-[3.4em] w-[2em] rounded-[0.35em] border border-white/15"
            style={{ background: "linear-gradient(160deg, rgba(80,140,225,0.4), rgba(10,20,36,0.9))" }}
          />
          <span
            className="block h-[2.4em] w-[3.6em] rounded-[0.3em] border border-white/10"
            style={{ background: "linear-gradient(160deg, rgba(255,255,255,0.09), rgba(10,20,36,0.85))" }}
          />
        </div>
      </div>

      {/* one restrained glass reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background: "linear-gradient(112deg, rgba(255,255,255,0.07) 0%, transparent 34%, transparent 100%)",
        }}
      />
    </div>
  );
}
