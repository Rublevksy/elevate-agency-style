/**
 * Composed, clearly visible floating service elements for each cinematic
 * service scene. Every element carries:
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
        color: strong ? "oklch(0.86 0.06 255)" : "oklch(0.78 0.03 255 / 0.8)",
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

function Bar({ w, top, dim }: { w: string; top: string; dim?: boolean }) {
  return (
    <div
      className="absolute left-3 h-[3px] rounded-full"
      style={{ top, width: w, background: dim ? edgeSoft : "oklch(0.72 0.12 255 / 0.7)" }}
    />
  );
}

export function ServiceElements({ kind }: { kind: "web" | "shop" | "app" | "seo" | "brand" }) {
  if (kind === "web") {
    return (
      <>
        {/* browser window, mid layer */}
        <Panel depth={0.55} className="left-[1%] top-[20%] h-[30%] w-[42%]">
          <div className="flex h-6 items-center gap-1.5 px-3" style={{ borderBottom: `1px solid ${edgeSoft}` }}>
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: edge }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: edgeSoft }} />
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: edgeSoft }} />
            <span className="ml-3 font-mono text-[8px] tracking-[0.2em]" style={{ color: "oklch(0.8 0.05 255 / 0.7)" }}>
              WWW
            </span>
          </div>
          <Bar w="55%" top="42%" />
          <Bar w="34%" top="56%" dim />
          <Bar w="22%" top="70%" dim />
        </Panel>
        {/* small responsive frame, nearer */}
        <Panel depth={0.9} className="left-[30%] top-[58%] h-[20%] w-[13%]" radius={10}>
          <Bar w="60%" top="24%" />
          <Bar w="40%" top="44%" dim />
        </Panel>
        <Chip label="UX / UI" depth={1} className="left-[6%] top-[57%]" strong />
        <Chip label="Responsive" depth={0.75} className="left-[3%] top-[72%]" />
      </>
    );
  }

  if (kind === "shop") {
    return (
      <>
        {/* product card emerging from the store screen */}
        <Panel depth={0.6} className="left-[2%] top-[22%] h-[28%] w-[22%]">
          <div className="absolute inset-x-3 top-3 h-[52%] rounded-md" style={{ background: "oklch(0.3 0.05 258 / 0.7)", border: `1px solid ${edgeSoft}` }} />
          <Bar w="50%" top="72%" />
          <Bar w="30%" top="85%" dim />
        </Panel>
        {/* cart bubble */}
        <div
          data-float
          data-depth={1}
          className="absolute left-[26%] top-[46%] flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-sm"
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
        </div>
        <Chip label="Checkout" depth={0.95} className="left-[8%] top-[60%]" strong />
        <Chip label="Payment" depth={0.7} className="left-[2%] top-[73%]" />
        <Chip label="Shopify" depth={0.45} className="left-[30%] top-[16%]" />
      </>
    );
  }

  if (kind === "app") {
    return (
      <>
        {/* store badges emerging from behind the phone */}
        <Panel depth={0.8} className="left-[6%] top-[26%] h-[13%] w-[30%]" radius={14}>
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
        <Panel depth={0.55} className="left-[2%] top-[47%] h-[13%] w-[31%]" radius={14}>
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
        {/* mobile UI fragments */}
        <Panel depth={1} className="left-[30%] top-[64%] h-[18%] w-[11%]" radius={12}>
          <Bar w="55%" top="18%" />
          <Bar w="70%" top="38%" dim />
          <Bar w="40%" top="58%" dim />
        </Panel>
        <Chip label="iOS" depth={0.9} className="left-[5%] top-[70%]" strong />
        <Chip label="Android" depth={0.65} className="left-[3%] top-[82%]" />
      </>
    );
  }

  if (kind === "seo") {
    return (
      <>
        {/* performance graph */}
        <Panel depth={0.6} className="left-[1%] top-[18%] h-[30%] w-[44%]">
          <div className="flex h-6 items-center px-3" style={{ borderBottom: `1px solid ${edgeSoft}` }}>
            <span className="font-mono text-[8px] tracking-[0.24em]" style={{ color: "oklch(0.8 0.05 255 / 0.72)" }}>
              PERFORMANCE
            </span>
          </div>
          <svg viewBox="0 0 200 90" className="absolute inset-x-0 bottom-0 h-[74%] w-full" fill="none" preserveAspectRatio="none">
            <defs>
              <linearGradient id="seoFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.65 0.18 255 / 0.35)" />
                <stop offset="100%" stopColor="oklch(0.65 0.18 255 / 0)" />
              </linearGradient>
            </defs>
            <path d="M0 78 L38 64 L74 68 L112 38 L150 26 L200 6 L200 90 L0 90Z" fill="url(#seoFill)" />
            <path
              data-seo-line
              d="M0 78 L38 64 L74 68 L112 38 L150 26 L200 6"
              stroke={BLUE}
              strokeWidth="1.8"
              strokeLinecap="round"
              pathLength={1}
            />
            <circle data-seo-dot cx="200" cy="6" r="3" fill={BLUE} />
          </svg>
        </Panel>
        {/* search field */}
        <Panel depth={0.9} className="left-[6%] top-[56%] h-[9%] w-[30%]" radius={999}>
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
        <Chip label="Core Web Vitals" depth={1} className="left-[2%] top-[70%]" strong />
        <Chip label="Speed" depth={0.7} className="left-[34%] top-[74%]" />
        <Chip label="Indexing" depth={0.5} className="left-[6%] top-[83%]" />
      </>
    );
  }

  return (
    <>
      {/* type specimen */}
      <Panel depth={0.55} className="left-[1%] top-[18%] h-[26%] w-[30%]">
        <div className="flex h-full flex-col justify-center px-4">
          <p className="text-4xl font-medium leading-none tracking-[-0.04em]" style={{ color: "oklch(0.9 0.04 255)" }}>
            Aa
          </p>
          <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.26em]" style={{ color: "oklch(0.78 0.04 255 / 0.7)" }}>
            Type
          </p>
        </div>
      </Panel>
      {/* logo geometry / construction lines */}
      <div data-float data-depth={0.85} className="absolute left-[26%] top-[42%] h-[22%] w-[22%]">
        <svg viewBox="0 0 100 100" className="h-full w-full" fill="none">
          <circle cx="50" cy="50" r="40" stroke={edgeSoft} strokeWidth="0.8" />
          <circle cx="50" cy="50" r="26" stroke={edgeSoft} strokeWidth="0.8" strokeDasharray="3 4" />
          <path d="M50 18 L74 76 H26L50 18Z" stroke={BLUE} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10 50h80M50 10v80" stroke={edgeSoft} strokeWidth="0.6" />
        </svg>
      </div>
      <Chip label="Logo" depth={1} className="left-[4%] top-[52%]" strong />
      <Chip label="Brand" depth={0.75} className="left-[2%] top-[65%]" />
      <Chip label="UX / UI" depth={0.5} className="left-[24%] top-[74%]" />
    </>
  );
}
