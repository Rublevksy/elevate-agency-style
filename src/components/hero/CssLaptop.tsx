import type { RefObject } from "react";
import { ScreenUI } from "./ScreenUI";

/**
 * THE DEVICE — a product-render grade CSS 3D laptop.
 *
 * Materials are built from stacked static layers: milled aluminium body,
 * chamfered edge highlight, black bezel, glass sheet with a single controlled
 * reflection, hinge shadow, palmrest, keyboard well and trackpad. The display is
 * a DOM plane, so the interface is *inside* the screen by construction.
 * No canvas, no WebGL. Animation is written on the refs by the parent only.
 */

/** aluminium: cool grey with a warm milled band, not flat #333 */
const ALU_LID =
  "linear-gradient(163deg,#4b525d 0%,#31363f 18%,#22262e 46%,#1a1d24 72%,#0f1216 100%)";
const ALU_BASE =
  "linear-gradient(180deg,#3c424c 0%,#2a2f37 26%,#1c2027 62%,#111419 100%)";

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
    <div className="absolute inset-0 flex items-center justify-center pb-[11vh]" style={{ perspective: "2000px" }}>
      <div
        ref={stageRef}
        className="relative w-[min(88vw,540px)] md:w-[min(45vw,720px)]"
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
      >
        {/* ambient blue rim volume behind the device */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -z-10 h-[150%] w-[142%] -translate-x-1/2 -translate-y-1/2 rounded-[50%]"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.62 0.16 254 / 0.34) 0%, oklch(0.42 0.13 258 / 0.16) 46%, transparent 76%)",
            filter: "blur(34px)",
          }}
        />
        {/* a tight rim streak that reads as a hard light source top-right */}
        <div
          aria-hidden
          className="absolute -right-[8%] -top-[10%] -z-10 h-[42%] w-[52%] rounded-[50%]"
          style={{
            background: "radial-gradient(closest-side, oklch(0.9 0.07 240 / 0.3), transparent 72%)",
            filter: "blur(26px)",
          }}
        />

        {/* contact shadow on the environment floor */}
        <div
          ref={chassisRef}
          aria-hidden
          className="absolute left-1/2 top-full h-[30%] w-[116%] -translate-x-1/2 rounded-[50%] blur-2xl"
          style={{ background: "radial-gradient(closest-side, rgba(0,0,0,0.85), rgba(0,0,0,0.35) 52%, transparent 80%)" }}
        />

        {/* LID */}
        <div
          ref={lidRef}
          className="relative aspect-[16/10.4] w-full origin-bottom"
          style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        >
          {/* aluminium lid shell */}
          <div
            className="absolute inset-0 rounded-[1.25rem] p-[1.5%]"
            style={{
              background: ALU_LID,
              boxShadow:
                "inset 0 0 0 1px rgba(196,216,255,0.16), inset 0 1px 0 rgba(226,238,255,0.32), inset 0 -1px 0 rgba(0,0,0,0.65), 0 48px 100px -34px rgba(0,0,0,0.9)",
            }}
          >
            {/* chamfer: a 1px bright cut along the top-left of the shell */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-[1.25rem]"
              style={{
                background:
                  "linear-gradient(158deg, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.02) 9%, transparent 26%)",
              }}
            />
            {/* black bezel */}
            <div
              className="relative h-full w-full rounded-[0.95rem] p-[1.15%]"
              style={{
                background: "linear-gradient(180deg,#0a0d13 0%,#05070b 60%,#080b11 100%)",
                boxShadow: "inset 0 0 0 1px rgba(150,180,230,0.09), inset 0 2px 6px rgba(0,0,0,0.9)",
              }}
            >
              <span
                aria-hidden
                className="absolute left-1/2 top-[0.45%] h-[1.3%] w-[1.3%] -translate-x-1/2 rounded-full"
                style={{ background: "radial-gradient(circle at 35% 30%, #26303f, #0b0e14)" }}
              />
              {/* THE DISPLAY — content is clipped by the display itself */}
              <div ref={screenRef} className="relative h-full w-full overflow-hidden rounded-[0.7rem]">
                <ScreenUI />
                {/* glass sheet: one controlled reflection + edge darkening */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(116deg, rgba(214,232,255,0.10) 0%, rgba(214,232,255,0.03) 16%, transparent 34%), radial-gradient(120% 90% at 50% 120%, rgba(0,0,0,0.35), transparent 60%)",
                  }}
                />
              </div>
              {/* bezel bottom wordmark space */}
              <span
                aria-hidden
                className="absolute bottom-[0.4%] left-1/2 h-[2px] w-[7%] -translate-x-1/2 rounded-full"
                style={{ background: "rgba(170,195,235,0.14)" }}
              />
            </div>
          </div>
        </div>

        {/* HINGE — a dark recess where lid meets base */}
        <div
          aria-hidden
          className="absolute left-1/2 top-full h-[1.6%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "linear-gradient(180deg,#05070a,#1a1f27)", filter: "blur(0.4px)" }}
        />

        {/* BASE — hinged at the lid, laid back into the scene */}
        <div
          aria-hidden
          className="absolute left-0 top-full h-[58%] w-full origin-top"
          style={{ transform: "rotateX(73.5deg)", transformStyle: "preserve-3d" }}
        >
          <div
            className="relative h-full w-full rounded-b-[1.25rem] rounded-t-[0.4rem]"
            style={{
              background: ALU_BASE,
              boxShadow:
                "inset 0 1px 0 rgba(226,238,255,0.28), inset 0 -1px 0 rgba(0,0,0,0.7), inset 1px 0 0 rgba(200,220,255,0.1), inset -1px 0 0 rgba(200,220,255,0.1), 0 30px 60px -20px rgba(0,0,0,0.8)",
            }}
          >
            {/* screen light spill onto the palmrest */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-[46%]"
              style={{
                background:
                  "linear-gradient(180deg, oklch(0.7 0.14 250 / 0.16) 0%, oklch(0.7 0.14 250 / 0.04) 40%, transparent 100%)",
              }}
            />
            {/* keyboard well */}
            <div
              className="relative mx-[6.5%] mt-[6.5%] h-[45%] rounded-[0.35rem]"
              style={{
                background: "linear-gradient(180deg,#0b0e13 0%,#12161d 100%)",
                boxShadow: "inset 0 0 16px rgba(0,0,0,0.85), inset 0 1px 0 rgba(0,0,0,0.9)",
              }}
            >
              {/* chamfered keycaps — 5 rows of subtle key plates */}
              <div
                className="absolute inset-[3%]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(to right, rgba(158,182,222,0.11) 0 0.72%, rgba(0,0,0,0) 0.72% 1.9%), repeating-linear-gradient(to bottom, rgba(158,182,222,0.09) 0 4.6%, rgba(0,0,0,0) 4.6% 19.4%)",
                  maskImage: "linear-gradient(180deg,#000 0%,#000 84%,transparent 100%)",
                  WebkitMaskImage: "linear-gradient(180deg,#000 0%,#000 84%,transparent 100%)",
                }}
              />
              {/* speaker grilles either side */}
              <span
                aria-hidden
                className="absolute -left-[4.5%] top-[8%] h-[84%] w-[3%] rounded-full"
                style={{ background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.4) 0 1.6px, transparent 1.6px 3.4px)" }}
              />
              <span
                aria-hidden
                className="absolute -right-[4.5%] top-[8%] h-[84%] w-[3%] rounded-full"
                style={{ background: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.4) 0 1.6px, transparent 1.6px 3.4px)" }}
              />
            </div>
            {/* trackpad */}
            <div
              className="mx-auto mt-[4.5%] h-[31%] w-[33%] rounded-[0.3rem]"
              style={{
                background: "linear-gradient(180deg,#1b2027 0%,#242a34 62%,#1d222a 100%)",
                boxShadow:
                  "inset 0 0 0 1px rgba(178,202,242,0.12), inset 0 1px 0 rgba(0,0,0,0.5), 0 -1px 0 rgba(230,240,255,0.07)",
              }}
            />
            {/* front lip */}
            <div
              aria-hidden
              className="absolute inset-x-[14%] bottom-[1.5%] h-[3%] rounded-full"
              style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.6), rgba(210,228,255,0.09))" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
