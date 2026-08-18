/**
 * Hero3DCube — lightweight pure-CSS 3D tech element.
 * Rotating wireframe cube + orbital ring + floating tech nodes.
 * No external libraries. Optimized for performance.
 */
export function Hero3DCube() {
  const faces = [
    { t: "rotateY(0deg) translateZ(80px)" },
    { t: "rotateY(90deg) translateZ(80px)" },
    { t: "rotateY(180deg) translateZ(80px)" },
    { t: "rotateY(-90deg) translateZ(80px)" },
    { t: "rotateX(90deg) translateZ(80px)" },
    { t: "rotateX(-90deg) translateZ(80px)" },
  ];

  return (
    <div className="relative aspect-square w-full max-w-[480px] mx-auto select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full bg-primary/15 blur-[120px] pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-48 w-48 rounded-full bg-primary/25 blur-[80px] pointer-events-none" />

      {/* Stage */}
      <div
        className="absolute inset-0"
        style={{ perspective: "1200px" }}
      >
        {/* Outer orbit ring */}
        <div
          className="hero3d-orbit absolute left-1/2 top-1/2 h-[78%] w-[78%] rounded-full border border-primary/20"
          style={{ transformOrigin: "center" }}
        >
          <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-3 w-3 rounded-full bg-primary shadow-[0_0_20px_rgba(59,130,246,0.9)]" />
          <span className="absolute top-1/2 -right-1.5 -translate-y-1/2 h-2 w-2 rounded-full bg-primary/80 shadow-[0_0_14px_rgba(59,130,246,0.7)]" />
        </div>

        {/* Inner orbit ring (counter-feel via dashed) */}
        <div
          className="hero3d-orbit absolute left-1/2 top-1/2 h-[55%] w-[55%] rounded-full border border-dashed border-primary/25"
          style={{ animationDuration: "18s", animationDirection: "reverse" }}
        >
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 h-2 w-2 rounded-full bg-primary-glow shadow-[0_0_14px_rgba(96,165,250,0.8)]" />
        </div>

        {/* Rotating wireframe cube */}
        <div
          className="hero3d-rotate absolute left-1/2 top-1/2 h-40 w-40"
          style={{ transformStyle: "preserve-3d" }}
        >
          {faces.map((f, i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-md border border-primary/40 bg-primary/[0.04] backdrop-blur-[1px]"
              style={{
                transform: f.t,
                boxShadow:
                  "inset 0 0 30px rgba(59,130,246,0.18), 0 0 24px rgba(59,130,246,0.12)",
              }}
            >
              {/* tech grid lines */}
              <div
                className="absolute inset-2 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(59,130,246,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.35) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              {/* corner accents */}
              <span className="absolute top-1 left-1 h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="absolute bottom-1 right-1 h-1.5 w-1.5 rounded-full bg-primary/60" />
            </div>
          ))}
        </div>

        {/* Center pulsing core */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-primary shadow-[0_0_30px_rgba(59,130,246,1)] animate-pulse" />

        {/* Floating tech badges */}
        <div className="hero3d-float absolute left-[8%] top-[18%] flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 backdrop-blur-md px-3 py-1.5 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)]">
          <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-medium tracking-wide text-foreground">
            UX
          </span>
        </div>
        <div
          className="hero3d-float absolute right-[6%] top-[28%] flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 backdrop-blur-md px-3 py-1.5 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)]"
          style={{ animationDelay: "-2s" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary-glow" />
          <span className="text-[10px] font-medium tracking-wide text-foreground">
            CODE
          </span>
        </div>
        <div
          className="hero3d-float absolute right-[12%] bottom-[14%] flex items-center gap-2 rounded-full border border-primary/30 bg-background/70 backdrop-blur-md px-3 py-1.5 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)]"
          style={{ animationDelay: "-4s" }}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-medium tracking-wide text-foreground">
            +128%
          </span>
        </div>
      </div>
    </div>
  );
}
