import characterAsset from "@/assets/campaign-web.png.asset.json";
import logo from "@/assets/elevate-logo.png";

/**
 * The live interface shown on the MacBook display — real DOM, not an image.
 * Fixed 1600x1000 design canvas; the 3D layer scales it to the lid plane.
 */
export function ScreenUI() {
  return (
    <div
      className="relative select-none overflow-hidden bg-[#04070f] text-white"
      style={{ width: 1600, height: 1000, fontFamily: "var(--font-sans, Inter, sans-serif)" }}
    >
      {/* browser chrome */}
      <div className="flex h-[52px] items-center gap-3 border-b border-white/[0.07] bg-[#070b16] px-6">
        <span className="h-3 w-3 rounded-full bg-[#2c3550]" />
        <span className="h-3 w-3 rounded-full bg-[#2c3550]" />
        <span className="h-3 w-3 rounded-full bg-[#2c3550]" />
        <span className="ml-6 h-4 w-[260px] rounded-full bg-white/[0.05]" />
      </div>

      {/* mini site nav */}
      <div className="flex items-center justify-between px-12 pt-8">
        <img src={logo} alt="ELEVATE" className="h-6 w-auto" />
        <div className="flex items-center gap-9 text-[15px] uppercase tracking-[0.24em] text-white/60">
          <span>Weby</span>
          <span>E-shopy</span>
          <span>Aplikace</span>
          <span className="rounded-full bg-[#2563eb] px-5 py-2 text-white">Poptat</span>
        </div>
      </div>

      {/* headline + stats */}
      <div className="absolute left-12 top-[240px] w-[52%]">
        <p className="text-[13px] uppercase tracking-[0.4em] text-[#4f8dff]/70">Digitální studio</p>
        <h3 className="mt-7 text-[52px] font-semibold uppercase leading-[1.12] tracking-[-0.01em]">
          Tvoříme digitální
          <br />
          produkty,
          <br />
          které <span className="text-[#3b82f6]">prodávají.</span>
        </h3>

        <div className="mt-12 flex items-start gap-12">
          {[
            { v: "98", l: "Performance" },
            { v: "2.4×", l: "Konverze" },
            { v: "100+", l: "Spokojených klientů" },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-[34px] font-medium leading-none">{s.v}</div>
              <div className="mt-3 max-w-[150px] text-[12px] uppercase tracking-[0.22em] text-white/45">
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* brand character */}
      <img
        src={characterAsset.url}
        alt=""
        aria-hidden
        className="absolute bottom-0 right-0 h-[86%] w-auto object-contain"
        draggable={false}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(80% 70% at 78% 60%, rgba(37,99,235,0.22), rgba(4,7,15,0) 70%)",
        }}
      />
    </div>
  );
}
