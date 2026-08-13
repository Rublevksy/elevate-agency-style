import logo from "@/assets/elevate-logo.png";

/**
 * Placeholder ELEVATE digital interface shown inside the laptop display and,
 * after the camera enters the screen, fullscreen. Intentionally minimal —
 * real content comes later.
 */
export function ElevateScreen({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#05070a]">
      {/* subtle ambient light */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, oklch(0.34 0.09 250 / 0.35), transparent 65%)",
        }}
      />
      <div aria-hidden className="absolute inset-0 grid-bg opacity-[0.12]" />

      {/* thin interface chrome */}
      <div
        className={`relative flex items-center gap-2 border-b border-white/5 ${compact ? "px-3 py-2" : "px-6 py-4"}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/10" />
      </div>

      <div className="relative grid h-full place-items-center px-[8%] pb-[8%]">
        <div className="text-center">
          <img
            src={logo}
            alt="ELEVATE"
            className={`mx-auto w-auto ${compact ? "h-[7%] max-h-8" : "h-14"} opacity-95`}
            style={{ width: compact ? "46%" : "min(38vw, 420px)", height: "auto" }}
            decoding="async"
          />
          <p
            className={`mt-[6%] uppercase text-muted-foreground ${compact ? "text-[0.45vw] tracking-[0.35em]" : "text-[11px] tracking-[0.45em]"}`}
          >
            Digital studio
          </p>
        </div>
      </div>
    </div>
  );
}
