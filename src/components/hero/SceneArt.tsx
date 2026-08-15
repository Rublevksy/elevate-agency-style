import mark from "@/assets/elevate-a-mark.png.asset.json";

/**
 * ONE art-directed composition per service. Each is a *product shot*: a primary
 * device / frame, real micro-UI inside it, secondary layers offset in depth, and
 * a few precise measurement labels. Every element is absolutely positioned,
 * marked with data-float/data-depth and animated only by the parent rAF loop.
 */

const BLUE = "oklch(0.65 0.18 255)";
const edge = "oklch(0.7 0.14 252 / 0.36)";
const soft = "oklch(0.7 0.12 252 / 0.16)";
const ink = "oklch(0.94 0.02 255)";
const dim = "oklch(0.8 0.03 255 / 0.6)";

const PANEL = "linear-gradient(158deg, oklch(0.2 0.032 258 / 0.95), oklch(0.115 0.022 258 / 0.92))";
const SHADOW = "0 34px 70px oklch(0.02 0.008 258 / 0.72), inset 0 1px 0 oklch(0.85 0.05 255 / 0.12)";

function Panel({
  depth,
  className,
  radius = 14,
  tilt,
  children,
}: {
  depth: number;
  className: string;
  radius?: number;
  tilt?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      data-float
      data-depth={depth}
      className={`absolute ${className}`}
      style={{ perspective: tilt ? "900px" : undefined }}
    >
      <div
        className="h-full w-full overflow-hidden"
        style={{
          borderRadius: radius,
          border: `1px solid ${edge}`,
          background: PANEL,
          boxShadow: SHADOW,
          transform: tilt,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** browser chrome strip with traffic lights + url */
function Chrome({ url }: { url: string }) {
  return (
    <div
      className="flex h-8 items-center gap-1.5 px-3.5"
      style={{ borderBottom: `1px solid ${soft}`, background: "oklch(0.16 0.022 258 / 0.9)" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: edge }} />
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: soft }} />
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: soft }} />
      <span
        className="ml-2.5 flex-1 truncate rounded-full px-2.5 py-[3px] font-mono text-[8px] tracking-[0.2em]"
        style={{ background: "oklch(0.11 0.02 258 / 0.9)", border: `1px solid ${soft}`, color: dim }}
      >
        {url}
      </span>
    </div>
  );
}

function Bar({ w, top, left = "1rem", accent, h = 3 }: { w: string; top: string; left?: string; accent?: boolean; h?: number }) {
  return (
    <span
      className="absolute rounded-full"
      style={{ top, left, width: w, height: h, background: accent ? "oklch(0.74 0.13 254 / 0.85)" : soft }}
    />
  );
}

function Label({ text, depth, className }: { text: string; depth: number; className: string }) {
  return (
    <span
      data-float
      data-depth={depth}
      className={`absolute whitespace-nowrap font-mono text-[8px] uppercase tracking-[0.26em] ${className}`}
      style={{ color: dim }}
    >
      {text}
    </span>
  );
}

function Chip({ label, value, depth, className }: { label: string; value: string; depth: number; className: string }) {
  return (
    <span
      data-float
      data-depth={depth}
      className={`absolute flex items-center gap-2 rounded-full px-3 py-1.5 ${className}`}
      style={{ border: `1px solid ${edge}`, background: "oklch(0.14 0.024 258 / 0.92)", boxShadow: SHADOW }}
    >
      <span className="font-mono text-[8px] uppercase tracking-[0.22em]" style={{ color: dim }}>
        {label}
      </span>
      <span className="text-[11px] font-medium leading-none" style={{ color: ink }}>
        {value}
      </span>
    </span>
  );
}

/** thin measurement guide with ticks */
function Guide({ className, depth, vertical }: { className: string; depth: number; vertical?: boolean }) {
  return (
    <span data-float data-depth={depth} className={`absolute ${className}`}>
      <span
        className="absolute inset-0"
        style={{
          background: vertical
            ? `linear-gradient(180deg, transparent, ${edge}, transparent)`
            : `linear-gradient(90deg, transparent, ${edge}, transparent)`,
        }}
      />
    </span>
  );
}

export function SceneArt({ kind }: { kind: "web" | "shop" | "app" | "seo" | "brand" }) {
  /* ─────────────────────────── WEB — case-study hero shot ─────────────────── */
  if (kind === "web") {
    return (
      <>
        {/* deep layer — layout construction */}
        <div data-float data-depth={0.18} className="absolute left-[2%] top-[6%] h-[38%] w-[46%] opacity-70">
          <svg viewBox="0 0 240 150" className="h-full w-full" fill="none">
            <rect x="1" y="1" width="238" height="148" stroke={soft} strokeWidth="0.6" strokeDasharray="5 7" />
            <path d="M1 38h238M80 1v148M160 1v148" stroke={soft} strokeWidth="0.5" />
            <path d="M20 1v148M220 1v148" stroke={edge} strokeWidth="0.5" strokeDasharray="2 5" />
          </svg>
        </div>

        {/* MAIN — the website in a premium browser frame */}
        <Panel depth={0.55} className="left-[0%] top-[14%] h-[54%] w-[60%]" radius={16}>
          <Chrome url="ELEVATEIT.CZ / WEBY" />
          {/* site header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: `1px solid ${soft}` }}
          >
            <span className="flex items-center gap-2">
              <img src={mark.url} alt="" className="h-3 w-auto" />
              <span className="font-mono text-[8px] tracking-[0.3em]" style={{ color: ink }}>
                ELEVATE
              </span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="h-[3px] w-5 rounded-full" style={{ background: soft }} />
              <span className="h-[3px] w-5 rounded-full" style={{ background: soft }} />
              <span className="rounded-full px-2 py-[3px] font-mono text-[7px] tracking-[0.2em]" style={{ background: BLUE, color: "#fff" }}>
                POPTAT
              </span>
            </span>
          </div>
          {/* hero module */}
          <div className="grid grid-cols-[1fr_0.8fr] gap-3 px-4 pt-4">
            <div>
              <span className="block h-[5px] w-[86%] rounded-full" style={{ background: "oklch(0.9 0.03 255 / 0.85)" }} />
              <span className="mt-2 block h-[5px] w-[62%] rounded-full" style={{ background: "oklch(0.74 0.13 254 / 0.85)" }} />
              <span className="mt-3 block h-[3px] w-[74%] rounded-full" style={{ background: soft }} />
              <span className="mt-1.5 block h-[3px] w-[54%] rounded-full" style={{ background: soft }} />
              <span
                className="mt-3 inline-block rounded-full px-3 py-1 font-mono text-[7px] tracking-[0.22em]"
                style={{ background: "oklch(0.55 0.16 256 / 0.5)", color: ink }}
              >
                ZAČÍT PROJEKT
              </span>
            </div>
            <div
              className="rounded-lg"
              style={{
                background: "linear-gradient(150deg, oklch(0.46 0.13 256 / 0.8), oklch(0.15 0.03 258 / 0.7))",
                border: `1px solid ${soft}`,
                boxShadow: "inset 0 1px 0 oklch(0.9 0.05 250 / 0.16)",
              }}
            />
          </div>
          {/* content blocks */}
          <div className="mt-4 grid grid-cols-3 gap-2.5 px-4">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="rounded-md p-2"
                style={{ border: `1px solid ${soft}`, background: "oklch(0.16 0.025 258 / 0.8)" }}
              >
                <span className="block h-[3px] w-[70%] rounded-full" style={{ background: i === 0 ? BLUE : soft }} />
                <span className="mt-1.5 block h-[2px] w-[90%] rounded-full" style={{ background: soft }} />
                <span className="mt-1 block h-[2px] w-[56%] rounded-full" style={{ background: soft }} />
              </div>
            ))}
          </div>
        </Panel>

        {/* SUPPORT — mobile preview, tucked behind the main frame edge */}
        <Panel depth={0.95} className="left-[46%] top-[52%] h-[38%] w-[13%]" radius={14} tilt="rotateY(-13deg)">
          <span className="mx-auto mt-2 block h-[3px] w-6 rounded-full" style={{ background: soft }} />
          <div
            className="absolute inset-x-2.5 rounded-md"
            style={{ top: "14%", height: "30%", background: "linear-gradient(150deg, oklch(0.44 0.12 256 / 0.8), oklch(0.16 0.03 258 / 0.7))" }}
          />
          <Bar w="60%" top="50%" left="0.625rem" accent />
          <Bar w="42%" top="58%" left="0.625rem" h={2} />
          <div className="absolute inset-x-2.5 bottom-3 grid grid-cols-2 gap-1.5">
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="block h-4 rounded" style={{ background: "oklch(0.26 0.04 258 / 0.8)" }} />
            ))}
          </div>
        </Panel>

        {/* SUPPORT — secondary UI: a design/spec sidebar */}
        <Panel depth={1.15} className="left-[8%] top-[68%] h-[20%] w-[32%]" radius={12} tilt="rotateX(7deg)">
          <div className="flex h-full items-center gap-3 px-3.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md" style={{ border: `1px solid ${edge}` }}>
              <span className="font-mono text-[9px]" style={{ color: BLUE }}>
                Aa
              </span>
            </span>
            <div className="flex-1">
              <span className="block h-[3px] w-[72%] rounded-full" style={{ background: soft }} />
              <span className="mt-2 block h-[3px] w-[46%] rounded-full" style={{ background: soft }} />
            </div>
            <span className="flex gap-1">
              {["oklch(0.65 0.18 255)", "oklch(0.4 0.1 258)", "oklch(0.9 0.02 255)"].map((c) => (
                <span key={c} className="h-3.5 w-3.5 rounded-sm" style={{ background: c }} />
              ))}
            </span>
          </div>
        </Panel>

        <Chip label="LCP" value="0.9s" depth={0.4} className="left-[44%] top-[8%]" />
        <Chip label="Konverze" value="+34%" depth={1.25} className="left-[0%] top-[46%]" />
        <Guide className="left-[2%] top-[13%] h-px w-[58%]" depth={0.3} />
        <Label text="1440 / 12 col" depth={0.3} className="left-[2%] top-[9%]" />
        <Label text="Baseline 8px" depth={1} className="left-[42%] top-[92%]" />
      </>
    );
  }

  /* ─────────────────────────── SHOP — commerce product shot ───────────────── */
  if (kind === "shop") {
    return (
      <>
        {/* MAIN — storefront */}
        <Panel depth={0.5} className="left-[0%] top-[12%] h-[52%] w-[56%]" radius={16}>
          <Chrome url="SHOP.ELEVATEIT.CZ" />
          <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: `1px solid ${soft}` }}>
            <span className="font-mono text-[8px] tracking-[0.3em]" style={{ color: ink }}>
              KOLEKCE
            </span>
            <span className="relative flex items-center gap-3">
              <span className="h-[3px] w-4 rounded-full" style={{ background: soft }} />
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={ink} strokeWidth="1.3">
                <path d="M6 7h12l-1.2 11H7.2L6 7Z" />
                <path d="M9 7a3 3 0 0 1 6 0" />
              </svg>
              <span
                className="absolute -right-1.5 -top-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full font-mono text-[7px]"
                style={{ background: BLUE, color: "#fff" }}
              >
                3
              </span>
            </span>
          </div>
          {/* product grid */}
          <div className="grid grid-cols-3 gap-2.5 px-4 pt-3.5">
            {[
              ["Studio Lamp", "2 490 Kč"],
              ["Chair 01", "5 900 Kč"],
              ["Desk Pro", "8 200 Kč"],
            ].map(([n, p], i) => (
              <div
                key={n}
                className="overflow-hidden rounded-lg"
                style={{
                  border: `1px solid ${i === 1 ? edge : soft}`,
                  background: i === 1 ? "oklch(0.22 0.04 258 / 0.95)" : "oklch(0.15 0.024 258 / 0.9)",
                }}
              >
                <div
                  className="h-12"
                  style={{
                    background:
                      i === 1
                        ? "linear-gradient(150deg, oklch(0.5 0.14 256 / 0.85), oklch(0.18 0.03 258 / 0.7))"
                        : "linear-gradient(150deg, oklch(0.32 0.06 258 / 0.8), oklch(0.14 0.02 258 / 0.7))",
                    borderBottom: `1px solid ${soft}`,
                  }}
                />
                <div className="px-2 py-2">
                  <p className="truncate text-[8px]" style={{ color: ink }}>
                    {n}
                  </p>
                  <p className="mt-1 font-mono text-[9px]" style={{ color: i === 1 ? BLUE : dim }}>
                    {p}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between px-4">
            <span className="font-mono text-[7px] tracking-[0.24em]" style={{ color: dim }}>
              48 PRODUKTŮ
            </span>
            <span className="flex gap-1">
              {[0, 1, 2].map((i) => (
                <span key={i} className="h-1 w-1 rounded-full" style={{ background: i === 0 ? BLUE : soft }} />
              ))}
            </span>
          </div>
        </Panel>

        {/* SUPPORT — checkout panel overlapping the storefront */}
        <Panel depth={1} className="left-[40%] top-[38%] h-[40%] w-[28%]" radius={14} tilt="rotateY(-10deg)">
          <div className="px-3.5 py-3">
            <p className="font-mono text-[7px] uppercase tracking-[0.26em]" style={{ color: dim }}>
              Souhrn objednávky
            </p>
            <div className="mt-3 space-y-2">
              {[
                ["Studio Lamp", "2 490"],
                ["Chair 01", "5 900"],
              ].map(([n, v]) => (
                <div key={n} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 rounded" style={{ background: "oklch(0.3 0.05 258 / 0.9)" }} />
                    <span className="text-[8px]" style={{ color: ink }}>
                      {n}
                    </span>
                  </span>
                  <span className="font-mono text-[8px]" style={{ color: dim }}>
                    {v}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-2.5" style={{ borderTop: `1px solid ${soft}` }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[7px] uppercase tracking-[0.24em]" style={{ color: dim }}>
                  Celkem
                </span>
                <span className="text-[12px] font-medium" style={{ color: ink }}>
                  8 390 Kč
                </span>
              </div>
              <span
                className="mt-3 block rounded-md py-1.5 text-center font-mono text-[8px] uppercase tracking-[0.24em]"
                style={{ background: BLUE, color: "#fff", boxShadow: "0 10px 22px oklch(0.5 0.16 256 / 0.4)" }}
              >
                Zaplatit
              </span>
              <span className="mt-2.5 flex items-center justify-center gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2.5 w-4 rounded-[2px]" style={{ border: `1px solid ${soft}` }} />
                ))}
              </span>
            </div>
          </div>
        </Panel>

        {/* SUPPORT — shipping / order state */}
        <Panel depth={1.25} className="left-[4%] top-[72%] h-[14%] w-[34%]" radius={12} tilt="rotateX(8deg)">
          <div className="flex h-full items-center gap-3 px-3.5">
            <span className="h-2 w-2 rounded-full" style={{ background: "oklch(0.78 0.15 158)" }} />
            <div className="flex-1">
              <p className="font-mono text-[7px] uppercase tracking-[0.24em]" style={{ color: dim }}>
                Objednávka #2841 · odesláno
              </p>
              <span className="mt-2 block h-[3px] w-full rounded-full" style={{ background: soft }}>
                <span className="block h-full w-[68%] rounded-full" style={{ background: BLUE }} />
              </span>
            </div>
          </div>
        </Panel>

        <Chip label="AOV" value="3 240 Kč" depth={0.35} className="left-[42%] top-[6%]" />
        <Label text="Checkout · 3 kroky" depth={1.3} className="left-[4%] top-[90%]" />
      </>
    );
  }

  /* ─────────────────────────── APP — mobile product shot ──────────────────── */
  if (kind === "app") {
    return (
      <>
        {/* MAIN — hero phone */}
        <div
          data-float
          data-depth={0.6}
          className="absolute left-[10%] top-[10%] h-[68%] w-[22%]"
          style={{ perspective: "900px" }}
        >
          <div
            className="relative h-full w-full overflow-hidden"
            style={{
              borderRadius: 32,
              border: "1px solid oklch(0.72 0.1 250 / 0.4)",
              background: "linear-gradient(165deg, oklch(0.26 0.045 258 / 0.98), oklch(0.09 0.018 258 / 0.96))",
              boxShadow:
                "0 50px 90px oklch(0.02 0.008 258 / 0.85), inset 0 1px 0 oklch(0.9 0.06 252 / 0.22), inset 0 0 0 3px oklch(0.05 0.01 258 / 0.9)",
              transform: "rotateY(9deg) rotateX(3deg) rotate(-2deg)",
            }}
          >
            <span
              className="absolute left-1/2 top-2 h-[5px] w-10 -translate-x-1/2 rounded-full"
              style={{ background: "oklch(0.05 0 0 / 0.9)" }}
            />
            {/* app header */}
            <div className="px-3 pt-6">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <img src={mark.url} alt="" className="h-3 w-auto" />
                  <span className="font-mono text-[7px] tracking-[0.24em]" style={{ color: ink }}>
                    ELEVATE
                  </span>
                </span>
                <span className="h-4 w-4 rounded-full" style={{ border: `1px solid ${soft}` }} />
              </div>
              {/* hero card */}
              <div
                className="mt-3 rounded-2xl p-2.5"
                style={{
                  background: "linear-gradient(150deg, oklch(0.5 0.14 256 / 0.9), oklch(0.18 0.03 258 / 0.7))",
                  border: `1px solid ${soft}`,
                }}
              >
                <p className="font-mono text-[6px] uppercase tracking-[0.24em]" style={{ color: "oklch(0.95 0.02 255 / 0.7)" }}>
                  Tento týden
                </p>
                <p className="mt-1 text-[15px] font-medium leading-none" style={{ color: "#fff" }}>
                  8 412
                </p>
              </div>
              {/* stats */}
              <div className="mt-3 grid grid-cols-2 gap-2">
                {[
                  ["+18%", "Retence"],
                  ["4.9", "Hodnocení"],
                ].map(([v, l]) => (
                  <div key={l} className="rounded-lg p-2" style={{ border: `1px solid ${soft}` }}>
                    <p className="text-[10px] font-medium leading-none" style={{ color: ink }}>
                      {v}
                    </p>
                    <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.2em]" style={{ color: dim }}>
                      {l}
                    </p>
                  </div>
                ))}
              </div>
              {/* list */}
              <div className="mt-3 space-y-2">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-md" style={{ background: i === 0 ? "oklch(0.55 0.15 256 / 0.6)" : "oklch(0.26 0.04 258 / 0.8)" }} />
                    <span className="flex-1">
                      <span className="block h-[3px] w-[70%] rounded-full" style={{ background: soft }} />
                      <span className="mt-1.5 block h-[2px] w-[44%] rounded-full" style={{ background: soft }} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
            {/* tab bar */}
            <div
              className="absolute inset-x-0 bottom-0 flex items-center justify-around py-2.5"
              style={{ borderTop: `1px solid ${soft}`, background: "oklch(0.1 0.02 258 / 0.9)" }}
            >
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? BLUE : soft }} />
              ))}
            </div>
          </div>
        </div>

        {/* SUPPORT — secondary phone behind */}
        <div
          data-float
          data-depth={0.3}
          className="absolute left-[2%] top-[22%] h-[46%] w-[15%] overflow-hidden opacity-80"
          style={{
            borderRadius: 22,
            border: `1px solid ${soft}`,
            background: "linear-gradient(165deg, oklch(0.19 0.03 258 / 0.9), oklch(0.09 0.015 258 / 0.9))",
            transform: "rotate(-9deg)",
            boxShadow: "0 30px 60px oklch(0.02 0.008 258 / 0.7)",
          }}
        >
          <div className="px-2 pt-4">
            <span className="block h-8 rounded-lg" style={{ background: "oklch(0.3 0.06 258 / 0.7)" }} />
            <span className="mt-2 block h-[3px] w-[70%] rounded-full" style={{ background: soft }} />
            <span className="mt-1.5 block h-[3px] w-[44%] rounded-full" style={{ background: soft }} />
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className="block h-5 rounded" style={{ background: "oklch(0.22 0.03 258 / 0.8)" }} />
              ))}
            </div>
          </div>
        </div>

        {/* SUPPORT — floating notification */}
        <Panel depth={1.3} className="left-[26%] top-[8%] h-[12%] w-[30%]" radius={14} tilt="rotateX(6deg)">
          <div className="flex h-full items-center gap-2.5 px-3.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: "oklch(0.5 0.15 256 / 0.55)" }}>
              <img src={mark.url} alt="" className="h-3 w-auto" />
            </span>
            <div className="flex-1">
              <p className="text-[9px] leading-none" style={{ color: ink }}>
                Nová objednávka
              </p>
              <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.2em]" style={{ color: dim }}>
                Právě teď
              </p>
            </div>
          </div>
        </Panel>

        {/* SUPPORT — store badges */}
        <Panel depth={1} className="left-[35%] top-[46%] h-[13%] w-[26%]" radius={14} tilt="rotateY(-9deg)">
          <div className="flex h-full items-center gap-3 px-4">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke={BLUE} strokeWidth="1.3">
              <path d="M16 3c-1 .1-2.2.8-2.9 1.7-.6.8-1.1 2-1 3.2 1.2.1 2.4-.6 3.1-1.5.7-.9 1.1-2.1.8-3.4Z" />
              <path d="M12 8.6c-1.6 0-3 .9-3.8.9-.9 0-2.2-.9-3.5-.8C3 8.7 1.4 10 1.4 13c0 1.8.7 3.7 1.6 5 .8 1.1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.3 0 1.7.7 2.7.7 1.1 0 1.8-1 2.6-2.1.6-.9 1-1.8 1.2-2.4-2.6-1-3-4.6-.4-6-.8-1.1-2.1-1.9-3.4-2Z" />
            </svg>
            <div>
              <p className="font-mono text-[7px] uppercase tracking-[0.24em]" style={{ color: dim }}>
                Download on the
              </p>
              <p className="text-[12px] font-medium leading-tight" style={{ color: ink }}>
                App Store
              </p>
            </div>
          </div>
        </Panel>
        <Panel depth={1.15} className="left-[32%] top-[63%] h-[13%] w-[27%]" radius={14} tilt="rotateY(-9deg)">
          <div className="flex h-full items-center gap-3 px-4">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke={BLUE} strokeWidth="1.3">
              <path d="M4 3.2 15.8 12 4 20.8V3.2Z" />
              <path d="M4 3.2 20 12 4 20.8" />
            </svg>
            <div>
              <p className="font-mono text-[7px] uppercase tracking-[0.24em]" style={{ color: dim }}>
                Get it on
              </p>
              <p className="text-[12px] font-medium leading-tight" style={{ color: ink }}>
                Google Play
              </p>
            </div>
          </div>
        </Panel>

        <Label text="iOS 17 · Android 14" depth={0.35} className="left-[3%] top-[74%]" />
      </>
    );
  }

  /* ─────────────────────────── SEO — data product shot ────────────────────── */
  if (kind === "seo") {
    return (
      <>
        {/* MAIN — analytics dashboard */}
        <Panel depth={0.5} className="left-[0%] top-[14%] h-[50%] w-[58%]" radius={16}>
          <div className="flex items-center justify-between px-4 pt-3.5">
            <div>
              <p className="font-mono text-[7px] uppercase tracking-[0.26em]" style={{ color: dim }}>
                Organický výkon · 90 dní
              </p>
              <p className="mt-1.5 text-[26px] font-medium leading-none tracking-[-0.03em]" style={{ color: ink }}>
                +182<span className="text-[14px]" style={{ color: BLUE }}>%</span>
              </p>
            </div>
            <span className="flex gap-1.5">
              {["7D", "30D", "90D"].map((t, i) => (
                <span
                  key={t}
                  className="rounded-full px-2 py-1 font-mono text-[7px] tracking-[0.18em]"
                  style={{
                    border: `1px solid ${i === 2 ? edge : soft}`,
                    background: i === 2 ? "oklch(0.5 0.15 256 / 0.4)" : "transparent",
                    color: i === 2 ? ink : dim,
                  }}
                >
                  {t}
                </span>
              ))}
            </span>
          </div>
          {/* graph: bars + line together */}
          <svg viewBox="0 0 300 110" className="mt-3 block h-[46%] w-full px-4" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="seoArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.18 255 / 0.4)" />
                <stop offset="100%" stopColor="oklch(0.65 0.18 255 / 0)" />
              </linearGradient>
            </defs>
            <path d="M0 92h300M0 62h300M0 32h300" stroke={soft} strokeWidth="0.5" strokeDasharray="3 8" />
            {[8, 42, 76, 110, 144, 178, 212, 246].map((x, i) => (
              <rect
                key={x}
                x={x}
                y={96 - (18 + i * 8)}
                width="12"
                height={18 + i * 8}
                rx="2"
                fill="oklch(0.55 0.12 256 / 0.22)"
              />
            ))}
            <path d="M0 96 L44 82 L88 86 L132 58 L176 44 L220 30 L300 10 L300 110 L0 110Z" fill="url(#seoArea)" />
            <path d="M0 96 L44 82 L88 86 L132 58 L176 44 L220 30 L300 10" stroke={BLUE} strokeWidth="2" strokeLinecap="round" />
            <circle cx="300" cy="10" r="3.4" fill="#dfeaff" />
          </svg>
          {/* Core Web Vitals pills */}
          <div className="mt-2 flex gap-2 px-4">
            {[
              ["LCP", "0.9s"],
              ["INP", "82ms"],
              ["CLS", "0.01"],
            ].map(([k, v]) => (
              <span
                key={k}
                className="flex items-center gap-1.5 rounded-full px-2.5 py-1"
                style={{ border: `1px solid ${soft}`, background: "oklch(0.13 0.02 258 / 0.9)" }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.78 0.15 158)" }} />
                <span className="font-mono text-[7px] tracking-[0.18em]" style={{ color: dim }}>
                  {k}
                </span>
                <span className="font-mono text-[8px]" style={{ color: ink }}>
                  {v}
                </span>
              </span>
            ))}
          </div>
        </Panel>

        {/* SUPPORT — SERP ranking card */}
        <Panel depth={1.05} className="left-[38%] top-[54%] h-[26%] w-[30%]" radius={14} tilt="rotateY(-10deg)">
          <div className="px-3.5 py-3">
            <span
              className="flex items-center gap-2 rounded-full px-2.5 py-1.5"
              style={{ border: `1px solid ${soft}`, background: "oklch(0.11 0.02 258 / 0.9)" }}
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke={BLUE} strokeWidth="1.6">
                <circle cx="11" cy="11" r="7" />
                <path d="M16.5 16.5 21 21" />
              </svg>
              <span className="font-mono text-[7px] tracking-[0.18em]" style={{ color: dim }}>
                tvorba webu praha
              </span>
            </span>
            <div className="mt-3 space-y-2">
              {[1, 2, 3].map((r) => (
                <div key={r} className="flex items-center gap-2">
                  <span
                    className="flex h-4 w-4 items-center justify-center rounded font-mono text-[7px]"
                    style={{ background: r === 1 ? BLUE : "oklch(0.22 0.03 258 / 0.9)", color: r === 1 ? "#fff" : dim }}
                  >
                    {r}
                  </span>
                  <span className="flex-1">
                    <span className="block h-[3px] rounded-full" style={{ width: `${86 - r * 16}%`, background: r === 1 ? "oklch(0.74 0.13 254 / 0.8)" : soft }} />
                    <span className="mt-1 block h-[2px] w-[56%] rounded-full" style={{ background: soft }} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        {/* SUPPORT — comparison metrics */}
        <Panel depth={1.3} className="left-[4%] top-[70%] h-[16%] w-[30%]" radius={12} tilt="rotateX(8deg)">
          <div className="grid h-full grid-cols-3 items-center px-3.5">
            {[
              ["Impr.", "1.2M"],
              ["CTR", "6.4%"],
              ["Pozice", "3.1"],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-[12px] font-medium leading-none" style={{ color: ink }}>
                  {v}
                </p>
                <p className="mt-1 font-mono text-[6px] uppercase tracking-[0.22em]" style={{ color: dim }}>
                  {l}
                </p>
              </div>
            ))}
          </div>
        </Panel>

        <Chip label="PSI" value="98 / 100" depth={0.35} className="left-[42%] top-[6%]" />
        <Guide className="left-[2%] top-[12%] h-px w-[56%]" depth={0.3} />
        <Label text="Real user monitoring" depth={1.35} className="left-[4%] top-[89%]" />
      </>
    );
  }

  /* ─────────────────────────── BRAND — visual system scene ────────────────── */
  return (
    <>
      {/* MAIN — the mark on a construction grid */}
      <div data-float data-depth={0.45} className="absolute left-[2%] top-[12%] h-[46%] w-[38%]">
        <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full" fill="none">
          <rect x="10" y="10" width="180" height="180" stroke={soft} strokeWidth="0.7" />
          <path d="M10 100h180M100 10v180M10 55h180M10 145h180M55 10v180M145 10v180" stroke={soft} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="72" stroke={edge} strokeWidth="0.7" strokeDasharray="4 6" />
          <path d="M28 100h-16M188 100h-16M100 28v-16M100 188v-16" stroke={edge} strokeWidth="0.8" />
        </svg>
        <img src={mark.url} alt="" className="absolute left-1/2 top-1/2 h-[44%] w-auto -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* SUPPORT — typographic specimen */}
      <Panel depth={0.85} className="left-[34%] top-[16%] h-[34%] w-[30%]" radius={14} tilt="rotateY(-8deg)">
        <div className="px-4 py-3">
          <p className="text-[38px] font-medium leading-none tracking-[-0.05em]" style={{ color: ink }}>
            Aa
          </p>
          <p className="mt-2 font-mono text-[7px] uppercase tracking-[0.26em]" style={{ color: dim }}>
            Display · Medium
          </p>
          <div className="mt-3 space-y-1.5" style={{ borderTop: `1px solid ${soft}`, paddingTop: 10 }}>
            <p className="text-[11px] tracking-[-0.02em]" style={{ color: ink }}>
              Elevate the ordinary
            </p>
            <p className="font-mono text-[8px] tracking-[0.14em]" style={{ color: dim }}>
              ABCDEFGHIJK · 0123456789
            </p>
          </div>
        </div>
      </Panel>

      {/* SUPPORT — palette */}
      <Panel depth={1.1} className="left-[38%] top-[56%] h-[16%] w-[26%]" radius={12} tilt="rotateX(7deg)">
        <div className="flex h-full items-center gap-2 px-3.5">
          {[
            ["oklch(0.65 0.18 255)", "#3F82E8"],
            ["oklch(0.4 0.1 258)", "#2A4A85"],
            ["oklch(0.2 0.03 258)", "#161B25"],
            ["oklch(0.94 0.02 255)", "#EDF2FA"],
          ].map(([c, hex]) => (
            <div key={hex} className="flex-1">
              <span className="block h-7 w-full rounded-md" style={{ background: c, boxShadow: "inset 0 1px 0 rgba(255,255,255,0.14)" }} />
              <p className="mt-1.5 font-mono text-[6px] tracking-[0.12em]" style={{ color: dim }}>
                {hex}
              </p>
            </div>
          ))}
        </div>
      </Panel>

      {/* SUPPORT — identity fragments: components + spacing */}
      <Panel depth={1.3} className="left-[6%] top-[64%] h-[20%] w-[28%]" radius={12} tilt="rotateX(8deg)">
        <div className="flex h-full items-center gap-3 px-3.5">
          <span
            className="rounded-full px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.22em]"
            style={{ background: BLUE, color: "#fff" }}
          >
            Button
          </span>
          <span
            className="rounded-full px-3 py-1.5 font-mono text-[7px] uppercase tracking-[0.22em]"
            style={{ border: `1px solid ${edge}`, color: ink }}
          >
            Ghost
          </span>
          <span className="flex flex-1 flex-col gap-1">
            {[100, 72, 48].map((w) => (
              <span key={w} className="h-[3px] rounded-full" style={{ width: `${w}%`, background: soft }} />
            ))}
          </span>
        </div>
      </Panel>

      <Guide className="left-[2%] top-[10%] h-px w-[62%]" depth={0.3} />
      <Guide className="left-[2%] top-[10%] h-[76%] w-px" depth={0.3} vertical />
      <Label text="Grid 8 · Radius 12" depth={0.3} className="left-[3%] top-[6%]" />
      <Label text="Identity system" depth={1.35} className="left-[36%] top-[76%]" />
    </>
  );
}
