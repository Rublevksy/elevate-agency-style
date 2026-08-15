/**
 * HERO LIGHT — the cinematic environment behind the product.
 *
 * Pure SVG: eight thin light filaments with a blue halo and a white-hot core.
 * There is no animation loop here at all — the parent stage translates the whole
 * group through a CSS variable while the visitor scrolls, so this layer costs
 * one paint and nothing per frame.
 */

const FILAMENTS = [
  { d: "M-80 620 C 320 470, 700 520, 1640 250", width: 1.5, opacity: 0.9 },
  { d: "M-80 716 C 360 560, 660 700, 1640 420", width: 2, opacity: 1 },
  { d: "M100 856 C 460 640, 900 700, 1640 540", width: 1.2, opacity: 0.75 },
  { d: "M-80 420 C 300 540, 760 290, 1640 372", width: 1.1, opacity: 0.62 },
  { d: "M200 980 C 520 760, 800 930, 1640 660", width: 2.2, opacity: 0.9 },
  { d: "M360 80 C 640 220, 760 500, 1640 190", width: 1.3, opacity: 0.7 },
  { d: "M520 -60 C 700 240, 900 280, 1640 130", width: 0.9, opacity: 0.5 },
  { d: "M-60 560 C 340 340, 720 610, 1640 470", width: 1.4, opacity: 0.8 },
];

export function HeroLight({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 1536 1024"
      preserveAspectRatio="xMidYMid slice"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <defs>
        <linearGradient id="hero-filament" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.65 0.18 255)" stopOpacity="0" />
          <stop offset="26%" stopColor="oklch(0.65 0.18 255)" stopOpacity="0.75" />
          <stop offset="62%" stopColor="oklch(0.78 0.14 250)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="oklch(0.65 0.18 255)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-core" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="oklch(0.985 0 0)" stopOpacity="0" />
          <stop offset="34%" stopColor="oklch(0.985 0 0)" stopOpacity="0.85" />
          <stop offset="70%" stopColor="oklch(0.985 0 0)" stopOpacity="0.95" />
          <stop offset="100%" stopColor="oklch(0.985 0 0)" stopOpacity="0" />
        </linearGradient>
      </defs>

      <g style={{ transform: "translate3d(calc(var(--film-light, 0) * -3.5%), calc(var(--film-light, 0) * -2%), 0)" }}>
        {FILAMENTS.map((filament) => (
          <g key={filament.d} opacity={filament.opacity}>
            <path
              d={filament.d}
              fill="none"
              stroke="url(#hero-filament)"
              strokeWidth={filament.width * 9}
              strokeLinecap="round"
              opacity={0.16}
            />
            <path
              d={filament.d}
              fill="none"
              stroke="url(#hero-filament)"
              strokeWidth={filament.width * 2.6}
              strokeLinecap="round"
              opacity={0.55}
            />
            <path
              d={filament.d}
              fill="none"
              stroke="url(#hero-core)"
              strokeWidth={Math.max(0.7, filament.width * 0.55)}
              strokeLinecap="round"
            />
          </g>
        ))}
      </g>
    </svg>
  );
}
