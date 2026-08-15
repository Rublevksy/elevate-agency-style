import { Link } from "@tanstack/react-router";
import heroScene from "@/assets/elevate-hero-scene.png.asset.json";

const SERVICES = [
  { label: "Weby", to: "/services/web" as const },
  { label: "E-shopy", to: "/services/eshop" as const },
  { label: "Aplikace", to: "/services/web" as const },
  { label: "Design", to: "/services/design" as const },
  { label: "SEO", to: "/services/branding" as const },
];

const PAGES = ["01", "02", "03", "04"];

/**
 * ELEVATE HERO — one authoritative cinematic artwork (near-black environment,
 * blue/white light ribbons, realistic MacBook on the right with floor
 * reflection) with the real, selectable HTML typography overlaid on the left.
 * Compositionally stable: no scroll-driven geometry drift.
 */
export function Hero() {
  return (
    <section
      aria-label="ELEVATE — digitální studio Praha"
      className="relative isolate flex min-h-[100svh] w-full items-center overflow-hidden bg-[#010307]"
    >
      {/* ————— authoritative hero artwork ————— */}
      <img
        src={heroScene.url}
        alt="Cinematické studio ELEVATE — MacBook a světelné vlny"
        width={1536}
        height={1024}
        fetchPriority="high"
        decoding="async"
        draggable={false}
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover object-[68%_center] select-none"
      />

      {/* left vignette keeps the type clean */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(105% 95% at 2% 50%, rgba(1,3,7,0.96) 0%, rgba(1,3,7,0.7) 32%, rgba(1,3,7,0) 62%)",
        }}
      />

      <div className="relative mx-auto w-full max-w-[1536px] px-6 md:px-10">
        <div className="relative z-20 max-w-[42rem] py-24 pl-6 lg:py-28 lg:pl-10">
          {/* thin vertical blue light accent */}
          <span
            aria-hidden
            className="absolute left-0 top-[6%] hidden h-[78%] w-px md:block"
            style={{
              background:
                "linear-gradient(to bottom, rgba(45,116,255,0) 0%, rgba(120,180,255,0.9) 42%, rgba(45,116,255,0.55) 58%, rgba(45,116,255,0) 100%)",
              boxShadow: "0 0 26px 3px rgba(45,116,255,0.45)",
            }}
          />

          <h1 className="text-[clamp(1.35rem,2.1vw,2.15rem)] font-extralight uppercase leading-[1.4] tracking-[0.07em] text-foreground md:whitespace-nowrap">
            <span className="block">Digitální řešení,</span>
            <span className="block">která posouvají</span>
            <span className="block text-primary" style={{ textShadow: "0 0 40px rgba(45,116,255,0.55)" }}>
              vaše podnikání
            </span>
          </h1>

          <ul className="mt-12 flex flex-wrap items-center gap-x-3 gap-y-2 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
            {SERVICES.map((s, i) => (
              <li key={s.label} className="flex items-center gap-3">
                <Link to={s.to} className="transition-colors duration-300 hover:text-foreground">
                  {s.label}
                </Link>
                {i < SERVICES.length - 1 && <span className="text-primary/80">·</span>}
              </li>
            ))}
          </ul>

          {/* page indicator */}
          <ol className="mt-16 flex items-center gap-5 text-[10px] tracking-[0.34em]">
            {PAGES.map((n, i) => (
              <li key={n} className={i === 0 ? "text-primary" : "text-muted-foreground/45"}>
                {i === 0 ? (
                  <a href="#services" className="transition-colors hover:text-primary">
                    {n}
                  </a>
                ) : (
                  n
                )}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
