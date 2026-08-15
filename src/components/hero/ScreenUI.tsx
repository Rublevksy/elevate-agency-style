import mark from "@/assets/elevate-a-mark.png.asset.json";
import figure from "@/assets/scene-web.webp";

/**
 * THE SCREEN — a finished ELEVATE product living inside the laptop display.
 *
 * Fully static (no per-frame work) and sized in container units, so it stays a
 * pixel-correct interface at any display size. The parent clips it with the
 * display's own radius, so there is never a rectangle floating over the laptop.
 */
export function ScreenUI() {
  return (
    <div className="h-full w-full" style={{ containerType: "inline-size" }}>
      <div className="relative h-full w-full overflow-hidden bg-[#04070d] text-white" style={{ fontSize: "2.5cqw" }}>
        {/* interior light — gradients only */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(78% 68% at 76% 2%, #12315e 0%, transparent 60%), radial-gradient(62% 62% at 4% 104%, #081527 0%, transparent 70%)",
          }}
        />

        {/* navigation */}
        <div className="relative flex items-center justify-between px-[4.5%] pt-[3.6%]">
          <span className="flex items-center gap-[0.5em]">
            <img src={mark.url} alt="" className="h-[1.35em] w-auto" />
            <span className="text-[0.95em] font-medium tracking-[0.26em]">ELEVATE</span>
          </span>
          <span className="flex items-center gap-[1.2em] font-mono text-[0.62em] uppercase tracking-[0.22em] text-white/45">
            <span>Weby</span>
            <span>E-shopy</span>
            <span>Aplikace</span>
            <span className="rounded-full bg-[#2f6fd6] px-[1.1em] py-[0.45em] text-white/95">Poptat</span>
          </span>
        </div>

        {/* interface: copy left, the ELEVATE character right */}
        <div className="relative mt-[3.4%] grid h-[76%] grid-cols-[1fr_0.9fr] items-end gap-[3%] px-[4.5%]">
          <div className="pb-[7%]">
            <span className="font-mono text-[0.6em] uppercase tracking-[0.34em] text-[#7fabf0]">
              Digitální studio · Praha
            </span>
            <h3 className="mt-[0.7em] text-[2.1em] font-medium leading-[1.03] tracking-[-0.035em]">
              Tvoříme digitální
              <br />
              produkty, které
              <br />
              <span className="text-[#7fabf0]">prodávají.</span>
            </h3>

            <span className="mt-[1.5em] flex items-end gap-[2em]">
              {[
                ["98", "Performance"],
                ["2.4x", "Konverze"],
                ["100+", "Projektů"],
              ].map(([v, l]) => (
                <span key={l} className="flex flex-col">
                  <span className="text-[1.15em] font-medium leading-none">{v}</span>
                  <span className="mt-[0.5em] font-mono text-[0.5em] uppercase tracking-[0.24em] text-white/40">
                    {l}
                  </span>
                </span>
              ))}
            </span>
          </div>

          {/* the approved character — one sharp, unobstructed layer */}
          <div className="relative h-full">
            <div
              aria-hidden
              className="absolute bottom-0 left-1/2 h-[66%] w-[115%] -translate-x-1/2 rounded-t-full"
              style={{ background: "radial-gradient(closest-side, rgba(53,113,214,0.38), transparent 72%)" }}
            />
            <img
              src={figure}
              alt=""
              className="absolute bottom-0 right-[-4%] h-full w-auto max-w-none object-contain object-bottom"
              draggable={false}
              decoding="async"
            />
          </div>
        </div>

        {/* one restrained glass reflection */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(112deg, rgba(255,255,255,0.055) 0%, transparent 32%)" }}
        />
      </div>
    </div>
  );
}
