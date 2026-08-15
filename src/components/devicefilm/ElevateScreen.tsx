import mark from "@/assets/elevate-a-mark.png.asset.json";
import figure from "@/assets/scene-web.webp";

/**
 * THE SCREEN — a finished ELEVATE digital product living on the display plane.
 *
 * Completely static: the display sits inside a 3D plane, so any per-frame work
 * here forces layout/paint each frame and makes the device stutter. It renders
 * once, stays sharp, and the camera does all the acting.
 */
export function ElevateScreen() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070d] text-white">
      {/* interior light — gradients only, no blur stacks */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 78% 4%, #163a6d 0%, transparent 62%), radial-gradient(60% 60% at 6% 100%, #0a1a33 0%, transparent 70%)",
        }}
      />

      {/* site navigation */}
      <div className="relative flex items-center justify-between px-[4%] pt-[3.4%]">
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

      {/* the interface: copy left, the ELEVATE character right */}
      <div className="relative mt-[4%] grid h-[74%] grid-cols-[1.05fr_0.95fr] items-end gap-[3%] px-[4%]">
        <div className="pb-[6%]">
          <span className="font-mono text-[0.75em] uppercase tracking-[0.34em] text-[#7fabf0]">
            Digitální studio · Praha
          </span>
          <h3 className="mt-[0.7em] text-[2.5em] font-medium leading-[1.02] tracking-[-0.035em]">
            Weby, e-shopy
            <br />
            a aplikace na <span className="text-[#7fabf0]">míru</span>.
          </h3>
          <span className="mt-[1.4em] inline-flex items-center gap-[0.7em] rounded-full bg-[#2f6fd6] px-[1.5em] py-[0.65em] text-[0.85em] font-medium">
            Chci projekt
          </span>
          <span className="mt-[1.6em] flex flex-wrap gap-x-[1.6em] gap-y-[0.5em] font-mono text-[0.7em] uppercase tracking-[0.24em] text-white/40">
            <span>UX / UI</span>
            <span>Vývoj</span>
            <span>Optimalizace</span>
          </span>
        </div>

        {/* the approved character, clean and unobstructed */}
        <div className="relative h-full">
          <div
            aria-hidden
            className="absolute bottom-0 left-1/2 h-[70%] w-[110%] -translate-x-1/2 rounded-t-full"
            style={{ background: "radial-gradient(closest-side, rgba(53,113,214,0.4), transparent 72%)" }}
          />
          <img
            src={figure}
            alt=""
            className="absolute bottom-0 right-0 h-[100%] w-auto max-w-none object-contain object-bottom"
            draggable={false}
          />
        </div>
      </div>

      {/* one restrained glass reflection */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(112deg, rgba(255,255,255,0.06) 0%, transparent 34%)" }}
      />
    </div>
  );
}
