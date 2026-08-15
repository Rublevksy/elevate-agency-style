import type { RefObject } from "react";
import { ScreenUI } from "./ScreenUI";

/**
 * THE DEVICE — a real CSS 3D laptop.
 *
 * The display is a DOM plane, so the interface is *inside* the screen by
 * construction: same radius, same perspective, same clip. No overlay rectangle,
 * no misaligned corners, no WebGL cost. Animation is done by the parent writing
 * transforms on the refs below — nothing animates on its own.
 */
export function CssLaptop({
  stageRef,
  lidRef,
  chassisRef,
  screenRef,
}: {
  stageRef: RefObject<HTMLDivElement | null>;
  lidRef: RefObject<HTMLDivElement | null>;
  chassisRef: RefObject<HTMLDivElement | null>;
  screenRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="absolute inset-0 flex items-center justify-center pb-[13vh]" style={{ perspective: "1800px" }}>
      <div
        ref={stageRef}
        className="relative w-[min(86vw,520px)] md:w-[min(44vw,700px)]"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* blue ambient glow behind the device */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.55 0.15 256 / 0.3) 0%, oklch(0.4 0.12 258 / 0.14) 48%, transparent 78%)",
            filter: "blur(28px)",
          }}
        />

        {/* contact shadow on the environment floor */}
        <div
          ref={chassisRef}
          aria-hidden
          className="absolute left-1/2 top-full h-[26%] w-[112%] -translate-x-1/2 rounded-[50%] blur-2xl"
          style={{ background: "radial-gradient(closest-side, rgba(0,0,0,0.75), transparent 78%)" }}
        />


        {/* LID */}
        <div
          ref={lidRef}
          className="relative aspect-[16/10.3] w-full origin-bottom"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {/* aluminium lid shell */}
          <div
            className="absolute inset-0 rounded-[1.1rem] p-[1.6%] shadow-[0_40px_90px_-30px_rgba(0,0,0,0.9)]"
            style={{
              background: "linear-gradient(168deg, #3a3f49 0%, #22262e 34%, #14171d 100%)",
              boxShadow: "inset 0 0 0 1px rgba(180,205,255,0.12), 0 44px 90px -34px rgba(0,0,0,0.85)",
            }}
          >
            {/* black bezel */}
            <div className="relative h-full w-full rounded-[0.85rem] bg-[#070a0f] p-[1.1%]">
              <span
                aria-hidden
                className="absolute left-1/2 top-[0.5%] h-[1.5%] w-[1.5%] -translate-x-1/2 rounded-full bg-[#141a24]"
              />
              {/* THE DISPLAY — content is clipped by the display itself */}
              <div ref={screenRef} className="relative h-full w-full overflow-hidden rounded-[0.6rem]">
                <ScreenUI />
              </div>
            </div>
          </div>
        </div>

        {/* BASE — hinged at the lid, laid back into the scene */}
        <div
          aria-hidden
          className="absolute left-0 top-full h-[64%] w-full origin-top"
          style={{ transform: "rotateX(74deg)", transformStyle: "preserve-3d" }}
        >
          <div
            className="h-full w-full rounded-b-[1.1rem] rounded-t-[0.35rem]"
            style={{
              background: "linear-gradient(180deg, #2b3038 0%, #1d2128 42%, #12151a 100%)",
              boxShadow: "inset 0 1px 0 rgba(200,220,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.6)",
            }}
          >
            {/* keyboard well */}
            <div
              className="mx-[6%] mt-[7%] h-[46%] rounded-[0.3rem]"
              style={{
                background: "linear-gradient(180deg, #0d1015 0%, #14181f 100%)",
                boxShadow: "inset 0 0 14px rgba(0,0,0,0.8)",
                backgroundImage:
                  "linear-gradient(180deg, rgba(0,0,0,0.35), rgba(0,0,0,0.1)), repeating-linear-gradient(to right, rgba(150,175,215,0.16) 0 0.9%, transparent 0.9% 1.85%), repeating-linear-gradient(to bottom, rgba(150,175,215,0.14) 0 6%, transparent 6% 16.6%)",
              }}
            />
            {/* trackpad */}
            <div
              className="mx-auto mt-[4%] h-[30%] w-[34%] rounded-[0.28rem]"
              style={{
                background: "linear-gradient(180deg, #1a1e25 0%, #222731 100%)",
                boxShadow: "inset 0 0 0 1px rgba(170,195,235,0.1)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
