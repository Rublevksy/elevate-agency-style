import mark from "@/assets/elevate-a-mark.png.asset.json";
import figure from "@/assets/scene-web.webp";

/**
 * THE SCREEN — a finished ELEVATE product living inside the laptop display.
 *
 * Art-directed as a product visual, not a text page: the character is the focal
 * point, everything else is precise micro-UI (nav, KPI, performance line, small
 * panels, alignment guides). Fully static (no per-frame work) and sized in
 * container units, so it stays pixel-correct at any display size.
 */

const INK = "rgba(233,241,255,0.94)";
const DIM = "rgba(196,214,245,0.5)";
const LINE = "rgba(126,164,232,0.16)";
const BLUE = "#4b8ef0";

export function ScreenUI() {
  return (
    <div className="h-full w-full" style={{ containerType: "inline-size" }}>
      <div className="relative h-full w-full overflow-hidden bg-[#04070d] text-white" style={{ fontSize: "2.5cqw" }}>
        {/* interior light */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(74% 66% at 78% -4%, #143567 0%, transparent 58%), radial-gradient(58% 60% at 2% 106%, #071426 0%, transparent 70%)",
          }}
        />
        {/* alignment grid — very faint, on a strict rhythm */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(to right, ${LINE} 1px, transparent 1px)`,
            backgroundSize: "12.5% 100%",
            opacity: 0.5,
            maskImage: "linear-gradient(180deg, transparent, #000 26%, #000 84%, transparent)",
            WebkitMaskImage: "linear-gradient(180deg, transparent, #000 26%, #000 84%, transparent)",
          }}
        />

        {/* navigation */}
        <div
          className="relative flex items-center justify-between px-[4.5%] py-[2.6%]"
          style={{ borderBottom: `1px solid ${LINE}` }}
        >
          <span className="flex items-center gap-[0.5em]">
            <img src={mark.url} alt="" className="h-[1.3em] w-auto" />
            <span className="text-[0.9em] font-medium tracking-[0.28em]">ELEVATE</span>
          </span>
          <span className="flex items-center gap-[1.15em] font-mono text-[0.58em] uppercase tracking-[0.22em]" style={{ color: DIM }}>
            <span>Weby</span>
            <span>E-shopy</span>
            <span>Aplikace</span>
            <span
              className="rounded-full px-[1.1em] py-[0.45em]"
              style={{ background: BLUE, color: "#fff", boxShadow: "0 0.4em 1.2em rgba(45,110,214,0.45)" }}
            >
              Poptat
            </span>
          </span>
        </div>

        {/* stage: editorial copy + KPI left, character right, micro panels layered */}
        <div className="relative grid h-[calc(100%-3.2em)] grid-cols-[1fr_0.94fr] items-end gap-[2%] px-[4.5%]">
          <div className="pb-[8%]">
            <span className="font-mono text-[0.56em] uppercase tracking-[0.34em]" style={{ color: "#8ab4f5" }}>
              Digitální studio · Praha
            </span>
            <h3 className="mt-[0.7em] text-[2em] font-medium leading-[1.02] tracking-[-0.04em]">
              Digitální
              <br />
              produkty, které
              <br />
              <span style={{ color: "#8ab4f5" }}>prodávají.</span>
            </h3>

            {/* KPI row */}
            <span className="mt-[1.4em] flex items-end gap-[1.7em]">
              {[
                ["98", "Performance"],
                ["2.4×", "Konverze"],
                ["100+", "Projektů"],
              ].map(([v, l]) => (
                <span key={l} className="flex flex-col">
                  <span className="text-[1.1em] font-medium leading-none">{v}</span>
                  <span className="mt-[0.45em] font-mono text-[0.46em] uppercase tracking-[0.24em]" style={{ color: DIM }}>
                    {l}
                  </span>
                </span>
              ))}
            </span>

            {/* performance line — a real mini chart */}
            <span
              className="mt-[1.4em] block w-[86%] rounded-[0.5em] px-[1em] py-[0.75em]"
              style={{ border: `1px solid ${LINE}`, background: "rgba(9,16,29,0.72)" }}
            >
              <span className="flex items-center justify-between font-mono text-[0.46em] uppercase tracking-[0.22em]" style={{ color: DIM }}>
                <span>Core Web Vitals</span>
                <span style={{ color: "#8ab4f5" }}>LCP 0.9s</span>
              </span>
              <svg viewBox="0 0 200 44" className="mt-[0.6em] block h-[2.4em] w-full" fill="none" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="screenArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(75,142,240,0.38)" />
                    <stop offset="100%" stopColor="rgba(75,142,240,0)" />
                  </linearGradient>
                </defs>
                <path d="M0 40 L34 33 L70 36 L104 21 L140 15 L200 4 L200 44 L0 44Z" fill="url(#screenArea)" />
                <path d="M0 40 L34 33 L70 36 L104 21 L140 15 L200 4" stroke={BLUE} strokeWidth="1.6" strokeLinecap="round" />
                <circle cx="200" cy="4" r="2.4" fill="#cfe2ff" />
              </svg>
            </span>
          </div>

          {/* the approved character — one sharp, unobstructed layer */}
          <div className="relative h-full">
            <div
              aria-hidden
              className="absolute bottom-0 left-1/2 h-[64%] w-[118%] -translate-x-1/2 rounded-t-full"
              style={{ background: "radial-gradient(closest-side, rgba(58,120,222,0.4), transparent 72%)" }}
            />
            <img
              src={figure}
              alt=""
              className="absolute bottom-0 right-[-4%] h-full w-auto max-w-none object-contain object-bottom"
              draggable={false}
              decoding="async"
            />

            {/* micro panel — live project status, offset in front of the figure */}
            <span
              className="absolute bottom-[16%] left-[-14%] flex items-center gap-[0.6em] rounded-[0.45em] px-[0.85em] py-[0.55em]"
              style={{
                border: `1px solid ${LINE}`,
                background: "rgba(7,13,24,0.86)",
                boxShadow: "0 1em 2.2em rgba(0,0,0,0.55)",
              }}
            >
              <span className="h-[0.4em] w-[0.4em] rounded-full" style={{ background: "#5cd7a0" }} />
              <span className="font-mono text-[0.44em] uppercase tracking-[0.22em]" style={{ color: INK }}>
                Build · deployed
              </span>
            </span>

            {/* micro panel — session graph, behind the shoulder */}
            <span
              className="absolute left-[-24%] top-[-2%] block w-[40%] rounded-[0.45em] px-[0.7em] py-[0.6em]"
              style={{ border: `1px solid ${LINE}`, background: "rgba(7,13,24,0.7)" }}
            >
              <span className="font-mono text-[0.42em] uppercase tracking-[0.2em]" style={{ color: DIM }}>
                Konverze
              </span>
              <span className="mt-[0.4em] flex h-[1.5em] items-end gap-[0.22em]">
                {[0.4, 0.55, 0.42, 0.7, 0.62, 0.86, 1].map((h, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-[1px]"
                    style={{ height: `${h * 100}%`, background: i > 4 ? BLUE : "rgba(126,164,232,0.3)" }}
                  />
                ))}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
