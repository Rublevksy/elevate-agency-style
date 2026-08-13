import logo from "@/assets/elevate-logo.png";

/**
 * Placeholder ELEVATE digital interface. Rendered inside the laptop display
 * (compact) and fullscreen once the camera has entered the screen.
 * Deliberately minimal — real content lands in a later iteration.
 */
export function ScreenInterface({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#04060a]">
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 38%, oklch(0.32 0.07 250 / 0.28), transparent 66%)",
        }}
      />

      {/* interface chrome */}
      <div
        className={`relative flex items-center gap-2 border-b border-white/[0.06] ${compact ? "px-[2.5%] py-[1.6%]" : "px-6 py-4"}`}
      >
        <span className="rounded-full bg-white/20" style={{ width: compact ? "0.5%" : 6, height: compact ? "0.5%" : 6, aspectRatio: "1" }} />
        <span className="rounded-full bg-white/15" style={{ width: compact ? "0.5%" : 6, height: compact ? "0.5%" : 6, aspectRatio: "1" }} />
        <span className="rounded-full bg-white/10" style={{ width: compact ? "0.5%" : 6, height: compact ? "0.5%" : 6, aspectRatio: "1" }} />
      </div>

      <div className="relative grid h-full place-items-center px-[8%] pb-[10%]">
        <div className="text-center">
          <img
            src={logo}
            alt="ELEVATE"
            decoding="async"
            className="mx-auto opacity-95"
            style={{ width: compact ? "44%" : "min(36vw, 400px)", height: "auto" }}
          />
          <p
            className="mt-[6%] uppercase text-white/45"
            style={{
              fontSize: compact ? "0.9cqw" : 11,
              letterSpacing: compact ? "0.3em" : "0.45em",
            }}
          >
            Digital studio
          </p>
        </div>
      </div>
    </div>
  );
}
