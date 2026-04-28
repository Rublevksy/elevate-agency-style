/**
 * Hero3D — Floating dashboard / website UI mockup.
 * Pure CSS + Tailwind, no external assets. Matches dark + blue brand.
 * Subtle 3D tilt, gentle float, glowing accents.
 */
export function Hero3D() {
  return (
    <div className="relative aspect-[4/3] w-full max-w-[560px] mx-auto select-none">
      {/* Ambient glow */}
      <div className="absolute -inset-10 rounded-[3rem] bg-primary/15 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-56 w-56 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />

      {/* Stage with perspective */}
      <div
        className="relative h-full w-full"
        style={{ perspective: "1600px" }}
      >
        {/* Back floating card (smaller, behind) */}
        <div
          className="hero-float-slow absolute right-0 top-2 w-[55%] rounded-2xl border border-border bg-surface/80 backdrop-blur-xl p-4 shadow-2xl"
          style={{
            transform: "rotateY(-12deg) rotateX(6deg) translateZ(-40px)",
            boxShadow:
              "0 30px 80px -30px oklch(0.65 0.18 255 / 0.45), 0 0 0 1px oklch(1 0 0 / 0.04) inset",
          }}
        >
          <div className="flex items-center gap-1.5 mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
          </div>
          <div className="space-y-2">
            <div className="h-2 w-2/3 rounded-full bg-foreground/20" />
            <div className="h-2 w-1/2 rounded-full bg-foreground/10" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-12 rounded-md border border-border bg-background/40"
              />
            ))}
          </div>
          <div className="mt-3 h-16 rounded-md bg-gradient-to-br from-primary/30 to-primary/5 border border-primary/20" />
        </div>

        {/* Main browser/dashboard window */}
        <div
          className="hero-float absolute left-0 bottom-0 w-[78%] rounded-2xl border border-border bg-surface/90 backdrop-blur-xl overflow-hidden shadow-2xl"
          style={{
            transform: "rotateY(8deg) rotateX(-4deg)",
            boxShadow:
              "0 50px 120px -30px oklch(0.65 0.18 255 / 0.55), 0 0 0 1px oklch(1 0 0 / 0.05) inset",
          }}
        >
          {/* Browser chrome */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-background/60">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
              <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
            </div>
            <div className="h-4 w-32 rounded-full bg-background/80 border border-border" />
            <div className="h-2 w-8 rounded-full bg-foreground/10" />
          </div>

          {/* Content */}
          <div className="p-5">
            {/* Top KPIs */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              {[
                { v: "+128%", label: "Conversion" },
                { v: "24.8k", label: "Visitors" },
                { v: "4.9", label: "Rating" },
              ].map((k, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-border bg-background/50 p-3"
                >
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
                    {k.label}
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    {k.v}
                  </div>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-lg border border-border bg-background/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="h-2 w-20 rounded-full bg-foreground/20" />
                <div className="h-2 w-10 rounded-full bg-primary/60" />
              </div>
              <svg viewBox="0 0 200 70" className="w-full h-16">
                <defs>
                  <linearGradient id="heroChartFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.18 255)" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="oklch(0.65 0.18 255)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,55 L20,48 L40,52 L60,38 L80,42 L100,28 L120,32 L140,18 L160,22 L180,10 L200,14 L200,70 L0,70 Z"
                  fill="url(#heroChartFill)"
                />
                <path
                  d="M0,55 L20,48 L40,52 L60,38 L80,42 L100,28 L120,32 L140,18 L160,22 L180,10 L200,14"
                  fill="none"
                  stroke="oklch(0.65 0.18 255)"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Rows */}
            <div className="mt-4 space-y-2">
              {[80, 60, 70].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-md bg-primary/15 border border-primary/20" />
                  <div className="flex-1 h-2 rounded-full bg-foreground/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary-glow"
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <div className="h-2 w-8 rounded-full bg-foreground/10" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Floating accent badge */}
        <div
          className="hero-float-fast absolute -top-2 left-[42%] flex items-center gap-2 rounded-full border border-primary/30 bg-background/80 backdrop-blur-md px-3 py-1.5 shadow-lg"
          style={{
            boxShadow: "0 10px 30px -10px oklch(0.65 0.18 255 / 0.6)",
          }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-medium tracking-wide text-foreground">
            LIVE
          </span>
        </div>
      </div>
    </div>
  );
}
