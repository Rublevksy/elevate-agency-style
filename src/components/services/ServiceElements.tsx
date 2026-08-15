/**
 * Composed floating service elements — one distinct visual language per scene.
 * Every element carries:
 *   data-float        — marks it as a parallax element
 *   data-depth        — 0 = far (slow), 1 = near (fast). Drives mouse parallax,
 *                       scroll offset, entrance delay and blur.
 * Positions are hand-composed around the character/device — never a circle,
 * never an icon cloud, no continuous spinning.
 */

const BLUE = "oklch(0.65 0.18 255)";
const edge = "oklch(0.65 0.18 255 / 0.42)";
const edgeSoft = "oklch(0.65 0.18 255 / 0.22)";
const glass = "oklch(0.19 0.03 258 / 0.72)";
const ink = "oklch(0.86 0.06 255)";

function Chip({
  label,
  depth,
  className,
  strong,
}: {
  label: string;
  depth: number;
  className: string;
  strong?: boolean;
}) {
  return (
    <div
      data-float
      data-depth={depth}
      className={`absolute rounded-full px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em] backdrop-blur-sm md:text-[10px] ${className}`}
      style={{
        border: `1px solid ${strong ? edge : edgeSoft}`,
        background: glass,
        color: strong ? ink : "oklch(0.78 0.03 255 / 0.8)",
        boxShadow: strong
          ? `0 18px 34px oklch(0.04 0.01 258 / 0.6), 0 0 22px oklch(0.6 0.17 258 / 0.22)`
          : `0 14px 26px oklch(0.04 0.01 258 / 0.5)`,
      }}
    >
      {label}
    </div>
  );
}

function Panel({
  depth,
  className,
  children,
  radius = 12,
}: {
  depth: number;
  className: string;
  children?: React.ReactNode;
  radius?: number;
}) {
  return (
    <div
      data-float
      data-depth={depth}
      className={`absolute overflow-hidden backdrop-blur-[2px] ${className}`}
      style={{
        borderRadius: radius,
        border: `1px solid ${edge}`,
        background: "linear-gradient(160deg, oklch(0.24 0.04 258 / 0.85), oklch(0.14 0.03 258 / 0.7))",
        boxShadow: `0 30px 60px oklch(0.03 0.01 258 / 0.7), inset 0 1px 0 oklch(0.8 0.05 255 / 0.12), 0 0 28px oklch(0.6 0.17 258 / 0.16)`,
      }}
    >
      {children}
    </div>
  );
}

/** unframed thin-line construction layer — used to differentiate scenes */
function Wire({
  depth,
  className,
  children,
}: {
  depth: number;
  className: string;
  children: React.ReactNode;
}) {
  return (
    <div data-float data-depth={depth} className={`absolute ${className}`}>
      {children}
    </div>
  );
}

function Bar({ w, top, dim }: { w: string; top: string; dim?: boolean }) {
  return (
    <div
      className="absolute left-3 h-[3px] rounded-full"
      style={{ top, width: w, background: dim ? edgeSoft : "oklch(0.72 0.12 255 / 0.7)" }}
    />
  );
}

export function ServiceElements({ kind }: { kind: "web" | "shop" | "app" | "seo" | "brand" }) {
  /* ---------------------------------------------------------------- */
  /* 01 WEBY — a website being assembled: browser, layout grid, nav   */
  /* ---------------------------------------------------------------- */
  if (kind === "web") {
    return (
      <>
        {/* layout wireframe grid, far layer */}
        <Wire depth={0.2} className="left-[-2%] top-[12%] h-[46%] w-[46%] opacity-70">
          <svg viewBox="0 0 200 160" className="h-full w-full" fill="none">
            <rect x="4" y="4" width="192" height="152" stroke={edgeSoft} strokeWidth="0.7" strokeDasharray="4 5" />
            <path d="M4 30h192M4 96h192M68 30v126M132 30v126" stroke={edgeSoft} strokeWidth="0.6" />
            <rect x="10" y="36" width="52" height="54" stroke={edgeSoft} strokeWidth="0.6" />
            <rect x="74" y="36" width="52" height="54" stroke={edgeSoft} strokeWidth="0.6" />
          </svg>
        </Wire>

        {/* the browser window — the site taking shape */}
        <Panel depth={0.55} className="left-[1%] top-[18%] h-[32%] w-[44%]">
          <div className="flex h-6 items-center gap-1.5 px-3" style={{ borderBottom: `1px solid ${edgeSoft}` }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: edge }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: edgeSoft }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: edgeSoft }} />
            <span className="ml-3 font-mono text-[8px] tracking-[0.2em]" style={{ color: "oklch(0.8 0.05 255 / 0.7)" }}>
              WWW
            </span>
          </div>
          {/* hero block + nav inside the browser */}
          <div className="absolute inset-x-3 top-9 flex items-center justify-between">
            <span className="font-mono text-[7px] tracking-[0.3em]" style={{ color: ink }}>
              ELEVATE
            </span>
            <span className="flex gap-1.5">
              <span className="h-[3px] w-4 rounded-full" style={{ background: edgeSoft }} />
              <span className="h-[3px] w-4 rounded-full" style={{ background: edgeSoft }} />
              <span className="h-[3px] w-6 rounded-full" style={{ background: BLUE, opacity: 0.8 }} />
            </span>
          </div>
          <Bar w="55%" top="52%" />
          <Bar w="34%" top="66%" dim />
          <div
            className="absolute left-3 h-4 w-14 rounded-full"
            style={{ top: "78%", background: "oklch(0.6 0.17 258 / 0.5)", border: `1px solid ${edge}` }}
          />
        </Panel>

        {/* the responsive frame */}
        <Panel depth={0.9} className="left-[31%] top-[57%] h-[22%] w-[13%]" radius={10}>
          <div className="mx-auto mt-2 h-[3px] w-5 rounded-full" style={{ background: edgeSoft }} />
          <div className="absolute inset-x-2 top-6 h-8 rounded" style={{ background: "oklch(0.32 0.07 258 / 0.7)" }} />
          <Bar w="60%" top="72%" />
          <Bar w="40%" top="85%" dim />
        </Panel>

        {/* detached UI fragments: a button and a nav bar */}
        <div
          data-float
          data-depth={1}
          className="absolute left-[20%] top-[8%] rounded-full px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] backdrop-blur-sm"
          style={{ border: `1px solid ${edge}`, background: "oklch(0.6 0.17 258 / 0.28)", color: ink }}
        >
          Poptat projekt
        </div>
        <Chip label="UX / UI" depth={1} className="left-[6%] top-[57%]" strong />
        <Chip label="Responsive" depth={0.75} className="left-[2%] top-[70%]" />
        <Chip label="Layout" depth={0.4} className="left-[34%] top-[38%]" />
      </>
    );
  }

  /* ---------------------------------------------------------------- */
  /* 02 E-SHOPY — commerce: product cards, cart, checkout, payment     */
  /* ---------------------------------------------------------------- */
  if (kind === "shop") {
    return (
      <>
        {/* two product cards, staggered depth */}
        <Panel depth={0.35} className="left-[9%] top-[13%] h-[24%] w-[19%]">
          <div
            className="absolute inset-x-3 top-3 h-[50%] rounded-md"
            style={{ background: "oklch(0.34 0.06 258 / 0.7)", border: `1px solid ${edgeSoft}` }}
          />
          <Bar w="46%" top="70%" dim />
          <Bar w="28%" top="84%" dim />
        </Panel>
        <Panel depth={0.65} className="left-[1%] top-[26%] h-[27%] w-[22%]">
          <div
            className="absolute inset-x-3 top-3 h-[50%] rounded-md"
            style={{ background: "linear-gradient(150deg, oklch(0.42 0.1 258 / 0.85), oklch(0.2 0.04 258 / 0.7))", border: `1px solid ${edge}` }}
          />
          <Bar w="52%" top="70%" />
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span className="font-mono text-[9px] tracking-[0.1em]" style={{ color: ink }}>
              2 490 Kč
            </span>
            <span
              className="rounded-full px-2 py-[3px] font-mono text-[7px] uppercase tracking-[0.18em]"
              style={{ background: "oklch(0.6 0.17 258 / 0.4)", color: ink }}
            >
              Do košíku
            </span>
          </div>
        </Panel>

        {/* checkout / payment strip emerging from the store interface */}
        <Panel depth={0.85} className="left-[24%] top-[62%] h-[11%] w-[26%]" radius={14}>
          <div className="flex h-full items-center gap-2 px-3">
            <span className="h-4 w-6 rounded-[3px]" style={{ background: "oklch(0.6 0.17 258 / 0.5)", border: `1px solid ${edge}` }} />
            <div className="flex-1">
              <div className="h-[3px] w-[70%] rounded-full" style={{ background: edgeSoft }} />
              <div className="mt-1.5 h-[3px] w-[40%] rounded-full" style={{ background: edgeSoft }} />
            </div>
            <span className="font-mono text-[8px] uppercase tracking-[0.22em]" style={{ color: ink }}>
              Pay
            </span>
          </div>
        </Panel>

        {/* cart bubble with a live count */}
        <div
          data-float
          data-depth={1}
          className="absolute left-[27%] top-[44%] flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm"
          style={{
            border: `1px solid ${edge}`,
            background: glass,
            boxShadow: `0 20px 40px oklch(0.03 0.01 258 / 0.65), 0 0 26px oklch(0.6 0.17 258 / 0.25)`,
          }}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke={BLUE} strokeWidth="1.4">
            <path d="M6 7h12l-1.2 11H7.2L6 7Z" />
            <path d="M9 7a3 3 0 0 1 6 0" />
          </svg>
          <span
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full font-mono text-[8px]"
            style={{ background: BLUE, color: "oklch(0.14 0.03 258)" }}
          >
            3
          </span>
        </div>

        <Chip label="Checkout" depth={0.95} className="left-[7%] top-[59%]" strong />
        <Chip label="Conversion" depth={0.7} className="left-[2%] top-[72%]" />
        <Chip label="Shopify" depth={0.45} className="left-[32%] top-[24%]" />
      </>
    );
  }

  /* ---------------------------------------------------------------- */
  /* 03 APLIKACE — the phone is the hero: stores, notifications, chart */
  /* ---------------------------------------------------------------- */
  if (kind === "app") {
    return (
      <>
        {/* the phone: main visual object of this scene */}
        <div
          data-float
          data-depth={0.7}
          className="absolute left-[7%] top-[20%] h-[52%] w-[20%] overflow-hidden"
          style={{
            borderRadius: 26,
            border: `1px solid ${edge}`,
            background: "linear-gradient(165deg, oklch(0.26 0.05 258 / 0.95), oklch(0.11 0.02 258 / 0.9))",
            boxShadow: `0 40px 80px oklch(0.02 0.01 258 / 0.8), inset 0 1px 0 oklch(0.85 0.06 255 / 0.16), 0 0 40px oklch(0.6 0.17 258 / 0.2)`,
            transform: "rotate(-4deg)",
          }}
        >
          <div className="mx-auto mt-2.5 h-[4px] w-8 rounded-full" style={{ background: "oklch(0.05 0 0 / 0.8)" }} />
          <div
            className="absolute inset-x-3 top-8 h-[30%] rounded-xl"
            style={{ background: "linear-gradient(150deg, oklch(0.5 0.14 258 / 0.8), oklch(0.2 0.04 258 / 0.6))" }}
          />
          <div className="absolute inset-x-3" style={{ top: "48%" }}>
            <div className="h-[3px] w-[70%] rounded-full" style={{ background: "oklch(0.72 0.12 255 / 0.7)" }} />
            <div className="mt-2 h-[3px] w-[46%] rounded-full" style={{ background: edgeSoft }} />
          </div>
          {/* bottom tab bar */}
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: i === 0 ? BLUE : edgeSoft }}
              />
            ))}
          </div>
        </div>

        {/* store badges appearing from around the phone */}
        <Panel depth={1} className="left-[24%] top-[26%] h-[13%] w-[29%]" radius={14}>
          <div className="flex h-full items-center gap-3 px-4">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke={BLUE} strokeWidth="1.3">
              <path d="M16 3c-1 .1-2.2.8-2.9 1.7-.6.8-1.1 2-1 3.2 1.2.1 2.4-.6 3.1-1.5.7-.9 1.1-2.1.8-3.4Z" />
              <path d="M12 8.6c-1.6 0-3 .9-3.8.9-.9 0-2.2-.9-3.5-.8C3 8.7 1.4 10 1.4 13c0 1.8.7 3.7 1.6 5 .8 1.1 1.5 2.1 2.6 2.1 1 0 1.4-.7 2.7-.7 1.3 0 1.7.7 2.7.7 1.1 0 1.8-1 2.6-2.1.6-.9 1-1.8 1.2-2.4-2.6-1-3-4.6-.4-6-.8-1.1-2.1-1.9-3.4-2Z" />
            </svg>
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase tracking-[0.24em]" style={{ color: "oklch(0.78 0.04 255 / 0.7)" }}>
                Download on the
              </p>
              <p className="text-[13px] font-medium leading-tight" style={{ color: "oklch(0.9 0.04 255)" }}>
                App Store
              </p>
            </div>
          </div>
        </Panel>
        <Panel depth={0.9} className="left-[21%] top-[45%] h-[13%] w-[30%]" radius={14}>
          <div className="flex h-full items-center gap-3 px-4">
            <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0" fill="none" stroke={BLUE} strokeWidth="1.3">
              <path d="M4 3.2 15.8 12 4 20.8V3.2Z" />
              <path d="M4 3.2 20 12 4 20.8" />
            </svg>
            <div className="min-w-0">
              <p className="font-mono text-[8px] uppercase tracking-[0.24em]" style={{ color: "oklch(0.78 0.04 255 / 0.7)" }}>
                Get it on
              </p>
              <p className="text-[13px] font-medium leading-tight" style={{ color: "oklch(0.9 0.04 255)" }}>
                Google Play
              </p>
            </div>
          </div>
        </Panel>

        {/* push notification */}
        <Panel depth={0.5} className="left-[2%] top-[10%] h-[10%] w-[24%]" radius={12}>
          <div className="flex h-full items-center gap-2 px-3">
            <span className="h-6 w-6 rounded-md" style={{ background: "oklch(0.6 0.17 258 / 0.45)" }} />
            <div className="flex-1">
              <div className="h-[3px] w-[60%] rounded-full" style={{ background: "oklch(0.72 0.12 255 / 0.7)" }} />
              <div className="mt-1.5 h-[3px] w-[85%] rounded-full" style={{ background: edgeSoft }} />
            </div>
          </div>
        </Panel>

        {/* tiny in-app chart */}
        <Panel depth={0.35} className="left-[30%] top-[70%] h-[14%] w-[20%]">
          <svg viewBox="0 0 100 40" className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="none">
            {[10, 26, 42, 58, 74, 90].map((x, i) => (
              <rect key={x} x={x - 4} y={34 - i * 5} width="8" height={i * 5 + 4} fill={BLUE} opacity={0.25 + i * 0.1} />
            ))}
          </svg>
        </Panel>

        <Chip label="iOS" depth={0.95} className="left-[4%] top-[68%]" strong />
        <Chip label="Android" depth={0.6} className="left-[1%] top-[80%]" />
      </>
    );
  }

  /* ---------------------------------------------------------------- */
  /* 04 SEO — measurement: a rising line, score dial, index rows       */
  /* ---------------------------------------------------------------- */
  if (kind === "seo") {
    return (
      <>
        {/* the rising performance line, unframed and wide across the scene */}
        <Wire depth={0.3} className="left-[-4%] top-[14%] h-[42%] w-[58%]">
          <svg viewBox="0 0 240 110" className="h-full w-full" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="seoFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.18 255 / 0.34)" />
                <stop offset="100%" stopColor="oklch(0.65 0.18 255 / 0)" />
              </linearGradient>
            </defs>
            <path d="M0 96h240M0 64h240M0 32h240" stroke={edgeSoft} strokeWidth="0.5" strokeDasharray="3 6" />
            <path d="M0 96 L44 82 L86 86 L130 48 L176 32 L240 6 L240 110 L0 110Z" fill="url(#seoFill)" />
            <path
              data-seo-line
              d="M0 96 L44 82 L86 86 L130 48 L176 32 L240 6"
              stroke={BLUE}
              strokeWidth="2"
              strokeLinecap="round"
              pathLength={1}
            />
            <circle data-seo-dot cx="240" cy="6" r="3.4" fill={BLUE} />
          </svg>
        </Wire>

        {/* score dial */}
        <div
          data-float
          data-depth={0.85}
          className="absolute left-[5%] top-[46%] flex h-24 w-24 items-center justify-center rounded-full backdrop-blur-sm"
          style={{ border: `1px solid ${edgeSoft}`, background: glass, boxShadow: `0 0 34px oklch(0.6 0.17 258 / 0.2)` }}
        >
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="50" cy="50" r="42" stroke={edgeSoft} strokeWidth="4" fill="none" />
            <circle
              cx="50"
              cy="50"
              r="42"
              stroke={BLUE}
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="264"
              strokeDashoffset="26"
            />
          </svg>
          <div className="text-center">
            <p className="text-lg font-medium leading-none" style={{ color: ink }}>
              98
            </p>
            <p className="mt-1 font-mono text-[7px] uppercase tracking-[0.22em]" style={{ color: "oklch(0.78 0.04 255 / 0.6)" }}>
              CWV
            </p>
          </div>
        </div>

        {/* index rows — search results being crawled */}
        <Panel depth={0.6} className="left-[24%] top-[54%] h-[22%] w-[27%]">
          <div className="flex h-full flex-col justify-center gap-2.5 px-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: i === 0 ? BLUE : edgeSoft }} />
                <div className="flex-1">
                  <div className="h-[3px] rounded-full" style={{ width: `${70 - i * 14}%`, background: i === 0 ? "oklch(0.72 0.12 255 / 0.75)" : edgeSoft }} />
                  <div className="mt-1.5 h-[2px] w-[46%] rounded-full" style={{ background: edgeSoft }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>

        {/* search field */}
        <Panel depth={1} className="left-[8%] top-[24%] h-[9%] w-[28%]" radius={999}>
          <div className="flex h-full items-center gap-2 px-4">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke={BLUE} strokeWidth="1.4">
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 4 4" />
            </svg>
            <span className="font-mono text-[9px] uppercase tracking-[0.24em]" style={{ color: "oklch(0.8 0.05 255 / 0.75)" }}>
              elevate
            </span>
          </div>
        </Panel>

        <Chip label="Core Web Vitals" depth={0.95} className="left-[1%] top-[72%]" strong />
        <Chip label="Speed" depth={0.7} className="left-[32%] top-[82%]" />
        <Chip label="Indexing" depth={0.45} className="left-[6%] top-[84%]" />
      </>
    );
  }

  /* ---------------------------------------------------------------- */
  /* 05 LOGO & DESIGN — construction grid, type specimen, identity     */
  /* ---------------------------------------------------------------- */
  return (
    <>
      {/* design construction grid, far layer */}
      <Wire depth={0.2} className="left-[0%] top-[10%] h-[52%] w-[48%] opacity-80">
        <svg viewBox="0 0 200 200" className="h-full w-full" fill="none">
          <path d="M0 40h200M0 100h200M0 160h200M40 0v200M100 0v200M160 0v200" stroke={edgeSoft} strokeWidth="0.5" />
          <circle cx="100" cy="100" r="70" stroke={edgeSoft} strokeWidth="0.6" strokeDasharray="4 6" />
          <circle cx="100" cy="100" r="44" stroke={edgeSoft} strokeWidth="0.6" />
        </svg>
      </Wire>

      {/* type specimen */}
      <Panel depth={0.55} className="left-[1%] top-[16%] h-[26%] w-[28%]">
        <div className="flex h-full flex-col justify-center px-4">
          <p className="text-4xl font-medium leading-none tracking-[-0.04em]" style={{ color: "oklch(0.9 0.04 255)" }}>
            Aa
          </p>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.26em]" style={{ color: "oklch(0.78 0.04 255 / 0.7)" }}>
            Typography
          </p>
        </div>
      </Panel>

      {/* the arrow mark redrawn as construction geometry (not the real logo) */}
      <div data-float data-depth={0.85} className="absolute left-[26%] top-[38%] h-[24%] w-[22%]">
        <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
          <path d="M6 92h88M50 4v92" stroke={edgeSoft} strokeWidth="0.5" strokeDasharray="3 5" />
          <path d="M50 16 L78 84 H22L50 16Z" stroke={BLUE} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M50 16 L50 84" stroke={edgeSoft} strokeWidth="0.7" />
          <circle cx="50" cy="16" r="2.4" fill={BLUE} />
          <circle cx="78" cy="84" r="2" fill={edge} />
          <circle cx="22" cy="84" r="2" fill={edge} />
        </svg>
      </div>

      {/* brand palette swatches */}
      <Panel depth={0.95} className="left-[7%] top-[62%] h-[10%] w-[26%]" radius={12}>
        <div className="flex h-full items-center gap-2 px-3">
          {["oklch(0.65 0.18 255)", "oklch(0.45 0.12 258)", "oklch(0.26 0.05 258)", "oklch(0.9 0.02 255)"].map((c) => (
            <span key={c} className="h-6 flex-1 rounded" style={{ background: c, opacity: 0.85 }} />
          ))}
        </div>
      </Panel>

      <Chip label="Logo" depth={1} className="left-[2%] top-[50%]" strong />
      <Chip label="Identity" depth={0.7} className="left-[30%] top-[70%]" />
      <Chip label="UX / UI" depth={0.4} className="left-[4%] top-[78%]" />
    </>
  );
}
