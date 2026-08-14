import type { ReactNode } from "react";

/** anodised aluminium, machined edge, and a soft key highlight */
const ALU =
  "linear-gradient(158deg, #4a5260 0%, #23272f 18%, #14171d 46%, #1b1f26 72%, #3a414d 92%, #0e1116 100%)";
const ALU_SIDE =
  "linear-gradient(180deg, #333944 0%, #171a20 40%, #0c0e13 100%)";

/** the glass: a raking reflection plus a faint bloom from the panel itself */
function Glass({ radius = 6 }: { radius?: number }) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-screen"
        style={{
          borderRadius: radius,
          background:
            "linear-gradient(112deg, rgba(200,222,255,0.14) 0%, rgba(200,222,255,0.05) 18%, transparent 34%, transparent 66%, rgba(160,190,240,0.07) 92%)",
        }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          borderRadius: radius,
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06), inset 0 1px 0 rgba(255,255,255,0.09)",
        }}
      />
    </>
  );
}

function EdgeLight({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-700"
      style={{
        opacity: active ? 1 : 0,
        background:
          "linear-gradient(90deg, transparent 0%, transparent 34%, oklch(0.72 0.16 250 / 0.55) 50%, transparent 66%, transparent 100%)",
        backgroundSize: "260% 100%",
        WebkitMaskImage:
          "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
        WebkitMaskComposite: "xor",
        maskComposite: "exclude",
        padding: 1,
        animation: "edge-travel 5.5s linear infinite",
      }}
    />
  );
}

function Shadow({ blur = 60, width = "72%" }: { blur?: number; width?: string }) {
  return (
    <span
      aria-hidden
      className="absolute left-1/2 -translate-x-1/2"
      style={{
        bottom: -18,
        width,
        height: 26,
        borderRadius: "50%",
        background: "radial-gradient(50% 50% at 50% 50%, rgba(3,5,9,0.85), transparent 72%)",
        filter: `blur(${blur / 4}px)`,
      }}
    />
  );
}

type ShellProps = { children: ReactNode; active?: boolean; className?: string };

/** 27" studio display on a machined stand — the WEB stage */
export function Monitor({ children, active = false, className = "" }: ShellProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="relative rounded-[16px] p-[6px]"
        style={{
          background: ALU,
          boxShadow:
            "0 60px 130px -50px rgba(2,4,8,0.95), 0 2px 0 rgba(255,255,255,0.07) inset, 0 -2px 6px rgba(0,0,0,0.7) inset",
        }}
      >
        <div className="rounded-[11px] bg-[#04060a] p-[5px]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[7px] bg-[#05070c]">
            {children}
            <Glass radius={7} />
          </div>
        </div>
        <div className="flex items-center justify-center pt-[7px]">
          <span className="h-[3px] w-[52px] rounded-full bg-white/[0.07]" />
        </div>
        <EdgeLight active={active} />
      </div>
      {/* stand: neck then cast-aluminium foot */}
      <div
        className="mx-auto h-[7%] w-[9%] min-h-[16px]"
        style={{ background: ALU_SIDE, clipPath: "polygon(18% 0, 82% 0, 100% 100%, 0 100%)" }}
      />
      <div
        className="mx-auto h-[6px] w-[26%] rounded-[3px]"
        style={{ background: ALU_SIDE, boxShadow: "0 14px 30px -10px rgba(0,0,0,0.9)" }}
      />
      <Shadow width="60%" />
    </div>
  );
}

/** 14" notebook, lid open, deck in perspective — the E-COMMERCE stage */
export function Laptop({ children, active = false, className = "" }: ShellProps) {
  return (
    <div className={`relative ${className}`} style={{ transformStyle: "preserve-3d" }}>
      <div
        className="relative rounded-[12px] p-[5px]"
        style={{
          background: ALU,
          boxShadow: "0 50px 110px -45px rgba(2,4,8,0.95), 0 1px 0 rgba(255,255,255,0.08) inset",
        }}
      >
        <div className="rounded-[8px] bg-[#04060a] p-[4px]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[5px] bg-[#05070c]">
            {children}
            <Glass radius={5} />
          </div>
        </div>
        <EdgeLight active={active} />
      </div>
      {/* deck */}
      <div
        className="relative mx-auto"
        style={{
          width: "104%",
          marginLeft: "-2%",
          height: "7%",
          transform: "rotateX(72deg)",
          transformOrigin: "top center",
          background: ALU,
          borderRadius: "0 0 10px 10px",
          boxShadow: "0 -1px 0 rgba(255,255,255,0.1) inset, 0 30px 60px -20px rgba(0,0,0,0.9)",
        }}
      >
        <span
          aria-hidden
          className="absolute left-1/2 top-[22%] h-[42%] w-[46%] -translate-x-1/2 rounded-[3px]"
          style={{ background: "linear-gradient(180deg, #0b0d12, #12151b)" }}
        />
      </div>
      <Shadow width="80%" blur={80} />
    </div>
  );
}

/** flagship phone — the MOBILE stage */
export function Phone({ children, active = false, className = "" }: ShellProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="relative rounded-[13%] p-[3.2%]"
        style={{
          background: ALU,
          boxShadow:
            "0 60px 120px -40px rgba(2,4,8,0.95), 0 0 0 1px rgba(255,255,255,0.05), 0 1px 0 rgba(255,255,255,0.12) inset",
        }}
      >
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[11%] bg-[#05070c]">
          {children}
          <span
            aria-hidden
            className="absolute left-1/2 top-[1.4%] h-[2.6%] w-[30%] -translate-x-1/2 rounded-full bg-black"
          />
          <Glass radius={22} />
        </div>
        <EdgeLight active={active} />
      </div>
      {/* machined side keys */}
      <span aria-hidden className="absolute -left-[1.5%] top-[26%] h-[7%] w-[1.6%] rounded-l bg-[#2c313a]" />
      <span aria-hidden className="absolute -left-[1.5%] top-[36%] h-[10%] w-[1.6%] rounded-l bg-[#2c313a]" />
      <span aria-hidden className="absolute -right-[1.5%] top-[30%] h-[12%] w-[1.6%] rounded-r bg-[#2c313a]" />
      <Shadow width="66%" blur={70} />
    </div>
  );
}

/** pro tablet, landscape — the DIGITAL PRODUCT stage */
export function Tablet({ children, active = false, className = "" }: ShellProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className="relative rounded-[4.5%] p-[1.6%]"
        style={{
          background: ALU,
          boxShadow:
            "0 55px 120px -45px rgba(2,4,8,0.95), 0 0 0 1px rgba(255,255,255,0.05), 0 1px 0 rgba(255,255,255,0.1) inset",
        }}
      >
        <div className="relative aspect-[16/11] overflow-hidden rounded-[3%] bg-[#05070c]">
          {children}
          <Glass radius={10} />
        </div>
        <span aria-hidden className="absolute left-[0.9%] top-1/2 h-[1.4%] w-[1.4%] -translate-y-1/2 rounded-full bg-[#0c0f14]" />
        <EdgeLight active={active} />
      </div>
      <Shadow width="72%" blur={70} />
    </div>
  );
}
