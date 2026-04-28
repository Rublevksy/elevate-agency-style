/**
 * Hero3D — pure CSS 3D animated object (no extra deps).
 * A slow-rotating wireframe cube + floating sphere with brand-blue glow.
 * Designed to feel like a tech/digital agency without sci-fi heaviness.
 */
export function Hero3D() {
  return (
    <div className="relative aspect-square w-full max-w-[520px] mx-auto select-none">
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full bg-primary/20 blur-[120px]" />
      <div className="absolute inset-10 rounded-full bg-primary/15 blur-[90px]" />

      {/* Stage */}
      <div
        className="relative h-full w-full"
        style={{ perspective: "1200px" }}
      >
        {/* Rotating wireframe cube */}
        <div
          className="absolute left-1/2 top-1/2 h-[55%] w-[55%] -translate-x-1/2 -translate-y-1/2 hero3d-rotate"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[
            { t: "translateZ(140px)" },
            { t: "translateZ(-140px) rotateY(180deg)" },
            { t: "rotateY(90deg) translateZ(140px)" },
            { t: "rotateY(-90deg) translateZ(140px)" },
            { t: "rotateX(90deg) translateZ(140px)" },
            { t: "rotateX(-90deg) translateZ(140px)" },
          ].map((face, i) => (
            <div
              key={i}
              className="absolute inset-0 border border-primary/40"
              style={{
                transform: face.t,
                background:
                  "linear-gradient(135deg, oklch(0.65 0.18 255 / 0.10), oklch(0.20 0.02 260 / 0.05))",
                boxShadow:
                  "inset 0 0 40px oklch(0.65 0.18 255 / 0.15), 0 0 30px oklch(0.65 0.18 255 / 0.15)",
              }}
            />
          ))}

          {/* Inner core sphere */}
          <div
            className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 30% 30%, oklch(0.85 0.15 250), oklch(0.55 0.20 255) 60%, oklch(0.25 0.08 260) 100%)",
              boxShadow:
                "0 0 40px oklch(0.65 0.18 255 / 0.7), 0 0 80px oklch(0.65 0.18 255 / 0.4)",
            }}
          />
        </div>

        {/* Floating orbiting dot */}
        <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 hero3d-orbit pointer-events-none">
          <div
            className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-primary"
            style={{ boxShadow: "0 0 16px oklch(0.65 0.18 255 / 0.9)" }}
          />
        </div>

        {/* Subtle ring */}
        <div
          className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/15 hero3d-float"
        />
      </div>
    </div>
  );
}
