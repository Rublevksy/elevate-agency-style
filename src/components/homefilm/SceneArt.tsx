import mark from "@/assets/elevate-a-mark.png.asset.json";

/**
 * ONE composed visual per service. Each scene has a different structure:
 *   web    → browser + responsive frame
 *   shop   → product grid + cart / checkout
 *   app    → one phone + store badges
 *   seo    → one search + performance graph
 *   brand  → typographic / identity construction
 *
 * Every element is absolutely positioned, marked with data-float/data-depth and
 * animated only by the single parent rAF loop (transform + opacity).
 */

const BLUE = "oklch(0.65 0.18 255)";
const edge = "oklch(0.65 0.18 255 / 0.34)";
const soft = "oklch(0.65 0.18 255 / 0.18)";
const ink = "oklch(0.9 0.04 255)";
const dim = "oklch(0.78 0.03 255 / 0.62)";

function Glass({
  depth,
  className,
  radius = 14,
  children,
}: {
  depth: number;
  className: string;
  radius?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      data-float
      data-depth={depth}
      className={`absolute overflow-hidden ${className}`}
      style={{
        borderRadius: radius,
        border: `1px solid ${edge}`,
        background: "linear-gradient(160deg, oklch(0.22 0.035 258 / 0.92), oklch(0.13 0.025 258 / 0.86))",
        boxShadow: "0 30px 60px oklch(0.03 0.01 258 / 0.65), inset 0 1px 0 oklch(0.8 0.05 255 / 0.1)",
      }}
    >
      {children}
    </div>
  );
}

function Row({ w, top, accent }: { w: string; top: string; accent?: boolean }) {
  return (
    <span
      className="absolute left-4 h-[3px] rounded-full"
      style={{ top, width: w, background: accent ? "oklch(0.72 0.13 255 / 0.8)" : soft }}
    />
  );
}

function Tag({ label, depth, className }: { label: string; depth: number; className: string }) {
  return (
    <span
      data-float
      data-depth={depth}
      className={`absolute rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] ${className}`}
      style={{ border: `1px solid ${edge}`, background: "oklch(0.18 0.03 258 / 0.8)", color: ink }}
    >
      {label}
    </span>
  );
}

export function SceneArt({ kind }: { kind: "web" | "shop" | "app" | "seo" | "brand" }) {
  if (kind === "web") {
    return (
      <>
        {/* MAIN — the browser: a finished website taking shape */}
        <Glass depth={0.6} className="left-[0%] top-[16%] h-[46%] w-[56%]" radius={16}>
          <div className="flex h-8 items-center gap-1.5 px-4" style={{ borderBottom: `1px solid ${soft}` }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: edge }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: soft }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: soft }} />
            <span className="ml-3 font-mono text-[8px] tracking-[0.24em]" style={{ color: dim }}>
              ELEVATEIT.CZ
            </span>
          </div>
          <div className="absolute inset-x-4 top-12 flex items-center justify-between">
            <span className="font-mono text-[8px] tracking-[0.3em]" style={{ color: ink }}>
              ELEVATE
            </span>
            <span className="flex items-center gap-2">
              <span className="h-[3px] w-5 rounded-full" style={{ background: soft }} />
              <span className="h-[3px] w-5 rounded-full" style={{ background: soft }} />
              <span className="h-[3px] w-8 rounded-full" style={{ background: BLUE, opacity: 0.85 }} />
            </span>
          </div>
          <div
            className="absolute inset-x-4 rounded-lg"
            style={{
              top: "34%",
              height: "34%",
              background: "linear-gradient(150deg, oklch(0.4 0.11 258 / 0.75), oklch(0.16 0.03 258 / 0.7))",
              border: `1px solid ${soft}`,
            }}
          />
          <Row w="46%" top="78%" accent />
          <Row w="28%" top="88%" />
        </Glass>

        {/* SUPPORT — responsive preview */}
        <Glass depth={0.95} className="left-[41%] top-[58%] h-[30%] w-[15%]" radius={12}>
          <span className="mx-auto mt-2.5 block h-[3px] w-6 rounded-full" style={{ background: soft }} />
          <div
            className="absolute inset-x-2.5 rounded-md"
            style={{ top: "18%", height: "34%", background: "oklch(0.34 0.08 258 / 0.7)" }}
          />
          <Row w="55%" top="66%" accent />
          <Row w="35%" top="78%" />
        </Glass>

        {/* SUPPORT — layout guides */}
        <div data-float data-depth={0.25} className="absolute left-[6%] top-[8%] h-[34%] w-[40%] opacity-60">
          <svg viewBox="0 0 200 140" className="h-full w-full" fill="none">
            <rect x="2" y="2" width="196" height="136" stroke={soft} strokeWidth="0.7" strokeDasharray="5 6" />
            <path d="M2 40h196M68 2v136M134 2v136" stroke={soft} strokeWidth="0.6" />
          </svg>
        </div>

        <Tag label="UX / UI" depth={1} className="left-[3%] top-[68%]" />
      </>
    );
  }

  if (kind === "shop") {
    return (
      <>
        {/* MAIN — product grid */}
        <div data-float data-depth={0.55} className="absolute left-[1%] top-[14%] grid h-[44%] w-[52%] grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-xl"
              style={{
                border: `1px solid ${i === 1 ? edge : soft}`,
                background:
                  i === 1
                    ? "linear-gradient(160deg, oklch(0.3 0.08 258 / 0.95), oklch(0.14 0.03 258 / 0.9))"
                    : "linear-gradient(160deg, oklch(0.2 0.03 258 / 0.9), oklch(0.12 0.02 258 / 0.85))",
              }}
            >
              <div
                className="absolute inset-x-3 top-3 rounded-md"
                style={{ height: "48%", background: "oklch(0.38 0.09 258 / 0.6)" }}
              />
              <span className="absolute bottom-8 left-3 h-[3px] w-[55%] rounded-full" style={{ background: soft }} />
              <span className="absolute bottom-3 left-3 font-mono text-[9px]" style={{ color: ink }}>
                2 490 Kč
              </span>
            </div>
          ))}
        </div>

        {/* SUPPORT — cart / checkout */}
        <Glass depth={0.95} className="left-[10%] top-[64%] h-[13%] w-[36%]" radius={16}>
          <div className="flex h-full items-center gap-3 px-4">
            <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="none" stroke={BLUE} strokeWidth="1.4">
              <path d="M6 7h12l-1.2 11H7.2L6 7Z" />
              <path d="M9 7a3 3 0 0 1 6 0" />
            </svg>
            <div className="flex-1">
              <span className="block h-[3px] w-[64%] rounded-full" style={{ background: soft }} />
              <span className="mt-2 block h-[3px] w-[38%] rounded-full" style={{ background: soft }} />
            </div>
            <span
              className="rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em]"
              style={{ background: "oklch(0.6 0.17 258 / 0.45)", color: ink }}
            >
              Zaplatit
            </span>
          </div>
        </Glass>

        <Tag label="Checkout" depth={1} className="left-[2%] top-[80%]" />
        <Tag label="Konverze" depth={0.4} className="left-[40%] top-[6%]" />
      </>
    );
  }

  if (kind === "app") {
    return (
      <>
        {/* MAIN — one phone */}
        <div
          data-float
          data-depth={0.7}
          className="absolute left-[8%] top-[12%] h-[62%] w-[21%] overflow-hidden"
          style={{
            borderRadius: 30,
            border: `1px solid ${edge}`,
            background: "linear-gradient(165deg, oklch(0.24 0.045 258 / 0.97), oklch(0.1 0.02 258 / 0.94))",
            boxShadow: "0 44px 80px oklch(0.02 0.01 258 / 0.8), inset 0 1px 0 oklch(0.85 0.06 255 / 0.14)",
            transform: "rotate(-3deg)",
          }}
        >
          <span className="mx-auto mt-3 block h-[5px] w-10 rounded-full" style={{ background: "oklch(0.05 0 0 / 0.8)" }} />
          <div
            className="absolute inset-x-3 rounded-2xl"
            style={{
              top: "12%",
              height: "30%",
              background: "linear-gradient(150deg, oklch(0.48 0.13 258 / 0.85), oklch(0.18 0.03 258 / 0.7))",
            }}
          />
          <div className="absolute inset-x-3" style={{ top: "48%" }}>
            <span className="block h-[3px] w-[72%] rounded-full" style={{ background: "oklch(0.72 0.13 255 / 0.75)" }} />
            <span className="mt-2 block h-[3px] w-[48%] rounded-full" style={{ background: soft }} />
            <div className="mt-4 grid grid-cols-3 gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span
                  key={i}
                  className="block aspect-square rounded-lg"
                  style={{ background: i === 0 ? "oklch(0.6 0.17 258 / 0.4)" : "oklch(0.3 0.04 258 / 0.5)" }}
                />
              ))}
            </div>
          </div>
          <div className="absolute inset-x-4 bottom-4 flex items-center justify-between">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? BLUE : soft }} />
            ))}
          </div>
        </div>

        {/* SUPPORT — the two stores */}
        <Glass depth={1} className="left-[27%] top-[24%] h-[13%] w-[27%]" radius={14}>
          <div className="flex h-full items-center gap-3 px-4">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke={BLUE} strokeWidth="1.3">
              <path d="M16 3c-1 .1-2.2.8-2.9 1.7-.6.8-1.1 2-1 3.2 1.2.1 2.4-.6 3.1-1.5.7-.9 1.1-2.1.8-3.4Z" />
              <path d="M12 8.6c-1.6 0-3 .9-3.8.9-.9 0-2.2-.9-3.5-.8C3 8.7 1.4 10 1.4 13c0 1.8.7 3.7 1.6 5 .8 1.1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.3 0 1.7.7 2.7.7 1.1 0 1.8-1 2.6-2.1.6-.9 1-1.8 1.2-2.4-2.6-1-3-4.6-.4-6-.8-1.1-2.1-1.9-3.4-2Z" />
            </svg>
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.24em]" style={{ color: dim }}>
                Download on the
              </p>
              <p className="text-[13px] font-medium leading-tight" style={{ color: ink }}>
                App Store
              </p>
            </div>
          </div>
        </Glass>
        <Glass depth={0.85} className="left-[24%] top-[43%] h-[13%] w-[28%]" radius={14}>
          <div className="flex h-full items-center gap-3 px-4">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke={BLUE} strokeWidth="1.3">
              <path d="M4 3.2 15.8 12 4 20.8V3.2Z" />
              <path d="M4 3.2 20 12 4 20.8" />
            </svg>
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.24em]" style={{ color: dim }}>
                Get it on
              </p>
              <p className="text-[13px] font-medium leading-tight" style={{ color: ink }}>
                Google Play
              </p>
            </div>
          </div>
        </Glass>

        <Tag label="iOS · Android" depth={0.35} className="left-[6%] top-[80%]" />
      </>
    );
  }

  if (kind === "seo") {
    return (
      <>
        {/* MAIN — one strong performance visualisation */}
        <Glass depth={0.55} className="left-[0%] top-[20%] h-[42%] w-[54%]" radius={16}>
          <div className="flex items-center gap-3 px-4 pt-4">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={BLUE} strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <path d="M16.5 16.5 21 21" />
            </svg>
            <span
              className="flex-1 rounded-full px-3 py-1.5 font-mono text-[9px] tracking-[0.2em]"
              style={{ background: "oklch(0.17 0.03 258 / 0.9)", border: `1px solid ${soft}`, color: dim }}
            >
              tvorba webu praha
            </span>
          </div>
          <svg viewBox="0 0 240 100" className="absolute inset-x-4 bottom-4 h-[58%] w-[calc(100%-2rem)]" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="seoArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.18 255 / 0.36)" />
                <stop offset="100%" stopColor="oklch(0.65 0.18 255 / 0)" />
              </linearGradient>
            </defs>
            <path d="M0 84h240M0 56h240M0 28h240" stroke={soft} strokeWidth="0.5" strokeDasharray="3 7" />
            <path d="M0 88 L48 76 L92 80 L138 46 L184 30 L240 8 L240 100 L0 100Z" fill="url(#seoArea)" />
            <path d="M0 88 L48 76 L92 80 L138 46 L184 30 L240 8" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
            <circle cx="240" cy="8" r="3.4" fill={BLUE} />
          </svg>
        </Glass>

        {/* SUPPORT — core web vitals dial */}
        <div
          data-float
          data-depth={0.95}
          className="absolute left-[43%] top-[64%] flex h-24 w-24 items-center justify-center rounded-full"
          style={{ border: `1px solid ${soft}`, background: "oklch(0.16 0.03 258 / 0.9)" }}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" stroke={soft} strokeWidth="4" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke={BLUE}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="264"
              strokeDashoffset="52"
            />
          </svg>
          <p className="font-mono text-[8px] uppercase tracking-[0.2em]" style={{ color: ink }}>
            CWV
          </p>
        </div>

        <Tag label="Core Web Vitals" depth={0.4} className="left-[2%] top-[10%]" />
        <Tag label="Rychlost" depth={1} className="left-[6%] top-[70%]" />
      </>
    );
  }

  /* brand — typography / identity construction */
  return (
    <>
      {/* MAIN — the mark as a design artifact on a construction grid */}
      <div data-float data-depth={0.5} className="absolute left-[4%] top-[16%] h-[44%] w-[40%]">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" fill="none">
          <rect x="10" y="10" width="180" height="180" stroke={soft} strokeWidth="0.7" />
          <path d="M10 100h180M100 10v180M10 55h180M10 145h180M55 10v180M145 10v180" stroke={soft} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="72" stroke={edge} strokeWidth="0.7" strokeDasharray="4 6" />
        </svg>
        <img src={mark.url} alt="" className="absolute left-1/2 top-1/2 h-[46%] w-auto -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* SUPPORT — type specimen */}
      <div
        data-float
        data-depth={0.9}
        className="absolute left-[36%] top-[58%] w-[34%] rounded-xl px-5 py-4"
        style={{ border: `1px solid ${edge}`, background: "oklch(0.15 0.025 258 / 0.9)" }}
      >
        <p className="text-3xl font-medium leading-none tracking-[-0.04em]" style={{ color: ink }}>
          Aa
        </p>
        <p className="mt-3 font-mono text-[8px] uppercase tracking-[0.28em]" style={{ color: dim }}>
          Brand identity · Typografie
        </p>
        <div className="mt-4 flex gap-2">
          {["oklch(0.65 0.18 255)", "oklch(0.4 0.1 258)", "oklch(0.22 0.03 258)", "oklch(0.92 0.02 255)"].map((c) => (
            <span key={c} className="h-5 w-5 rounded-md" style={{ background: c }} />
          ))}
        </div>
      </div>

      <Tag label="Visual direction" depth={0.3} className="left-[7%] top-[8%]" />
    </>
  );
}
