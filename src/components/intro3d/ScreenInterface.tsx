import logo from "@/assets/elevate-logo.png";

/**
 * The ELEVATE interface shown on the display — real HTML, rendered both inside
 * the 3D screen and as the fullscreen layer after the camera enters it.
 * Deliberately minimal placeholder; final homepage content lands later.
 */
export function ScreenInterface() {
  return (
    <div
      className="relative flex h-full w-full flex-col bg-[#05070a] text-white"
      style={{ containerType: "size" }}
    >

      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 30%, oklch(0.3 0.05 250 / 0.35), transparent 65%)",
        }}
      />

      {/* minimal interface navigation */}
      <div className="relative flex items-center justify-between border-b border-white/[0.07] px-[4%] py-[2.4%]">
        <img src={logo} alt="ELEVATE" className="h-[3.2cqh] w-auto opacity-90" style={{ height: "2.4%" }} />
        <div className="flex items-center gap-[3%] text-white/40" style={{ fontSize: "1.05cqw", letterSpacing: "0.28em" }}>
          <span>STUDIO</span>
          <span>WORK</span>
          <span>CONTACT</span>
        </div>
      </div>

      {/* minimal headline */}
      <div className="relative flex flex-1 flex-col justify-center px-[7%]">
        <p
          className="uppercase text-primary/80"
          style={{ fontSize: "0.95cqw", letterSpacing: "0.45em" }}
        >
          Digital studio
        </p>
        <h2
          className="mt-[2.5%] max-w-[74%] font-light leading-[1.05] tracking-[-0.03em] text-white"
          style={{ fontSize: "5.2cqw" }}
        >
          We build the
          <br />
          digital presence
          <br />
          <span className="text-white/40">of ambitious brands.</span>
        </h2>
        <div
          aria-hidden
          className="mt-[5%] h-px w-[42%] bg-gradient-to-r from-primary/60 to-transparent"
        />
      </div>
    </div>
  );
}
