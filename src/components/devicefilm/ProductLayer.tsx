import { useEffect, useRef } from "react";
import {
  BrandComposition,
  CommerceComposition,
  WebComposition,
} from "@/components/cinematic/ServicePreviews";
import { startFrameLoop } from "@/lib/raf";
import { PHASE, clamp01, easeFilm, lerp, range } from "./film";


type Product = {
  id: string;
  label: string;
  /** where the product travels to, in viewport-relative units */
  to: { x: number; y: number; z: number; ry: number; rx: number };
  /** entry window on the master timeline */
  from: number;
  /** pointer parallax weight */
  par: number;
  w: string;
  h: string;
  Body: () => React.JSX.Element;
};

/** Every product leaves the display centre and settles in its own depth plane. */
const PRODUCTS: Product[] = [
  {
    id: "web",
    label: "Web",
    to: { x: -34, y: -4, z: 40, ry: 17, rx: 2 },
    from: PHASE.PRODUCTS_IN,
    par: 1,
    w: "34vw",
    h: "23vw",
    Body: WebComposition,
  },
  {
    id: "commerce",
    label: "E-commerce",
    to: { x: 33, y: 3, z: 20, ry: -18, rx: -1 },
    from: PHASE.PRODUCTS_IN + 0.03,
    par: 0.85,
    w: "30vw",
    h: "21vw",
    Body: CommerceComposition,
  },
  {

    id: "brand",
    label: "Branding",
    to: { x: -28, y: 22, z: -90, ry: 12, rx: -3 },
    from: PHASE.PRODUCTS_IN + 0.09,
    par: 0.5,
    w: "18vw",
    h: "12vw",
    Body: BrandComposition,
  },
];

/**
 * PHASE 03 — the digital products escape the display.
 *
 * Each interface starts at the display centre, small and dim, then travels out
 * along its own axis into its own depth plane. Scroll-driven only; scrubbing
 * back pulls every product straight back into the screen.
 */
export function ProductLayer({
  progress,
  pointer,
}: {
  progress: React.RefObject<number>;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const phone = useRef<HTMLDivElement>(null);
  const smooth = useRef({ mx: 0, my: 0 });

  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return startFrameLoop(() => {
      const p = progress.current ?? 0;
      const m = pointer.current ?? { x: 0, y: 0 };
      smooth.current.mx += (m.x - smooth.current.mx) * 0.05;
      smooth.current.my += (m.y - smooth.current.my) * 0.05;

      // everything is absorbed again as the camera commits to the display
      const absorb = easeFilm(range(PHASE.ENTER, PHASE.HANDOFF, p));

      PRODUCTS.forEach((prod, i) => {
        const el = items.current[i];
        if (!el) return;
        const t = easeFilm(range(prod.from, prod.from + 0.16, p));
        const out = t * (1 - absorb);
        const px = smooth.current.mx * 34 * prod.par;
        const py = smooth.current.my * -20 * prod.par;
        el.style.transform = `translate3d(calc(-50% + ${prod.to.x * out}vw + ${px}px), calc(-50% + ${prod.to.y * out}vh + ${py}px), ${lerp(-40, prod.to.z, out)}px) rotateX(${prod.to.rx * out}deg) rotateY(${prod.to.ry * out}deg) scale(${lerp(0.34, 1, out)})`;
        el.style.opacity = String(clamp01(t * 1.4) * (1 - absorb));
      });

      const ph = phone.current;
      if (ph) {
        const t = easeFilm(range(PHASE.PRODUCTS_IN + 0.12, PHASE.PRODUCTS_HOLD + 0.06, p));
        const out = t * (1 - absorb);
        ph.style.transform = `translate3d(calc(-50% + ${-13 * out}vw + ${smooth.current.mx * 52}px), calc(-50% + ${19 * out}vh + ${smooth.current.my * -30}px), ${lerp(-20, 190, out)}px) rotateY(${11 * out}deg) rotateX(${-3 * out}deg) scale(${lerp(0.4, 1, out)})`;
        ph.style.opacity = String(clamp01(t * 1.5) * (1 - absorb));
      }
    }, stage.current);
  }, [progress, pointer]);


  return (
    <div
      ref={stage}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20"
      style={{ perspective: "1400px", perspectiveOrigin: "50% 46%" }}
    >

      <div className="absolute left-1/2 top-[46%]" style={{ transformStyle: "preserve-3d" }}>
        {PRODUCTS.map((prod, i) => (
          <div
            key={prod.id}
            ref={(el) => {
              items.current[i] = el;
            }}
            className="absolute overflow-hidden rounded-xl border border-white/[0.08] bg-[#070a10]/95 opacity-0 shadow-[0_40px_120px_-40px_oklch(0.05_0.02_258/0.9)] backdrop-blur-[2px]"
            style={{ width: prod.w, height: prod.h, willChange: "transform, opacity" }}
          >
            <prod.Body />
            <span className="absolute bottom-2 right-3 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground/70">
              {prod.label}
            </span>
          </div>
        ))}

        {/* PHASE 03b — the mobile experience, secondary to the laptop */}
        <div
          ref={phone}
          className="absolute h-[26vw] w-[12.5vw] min-h-[210px] min-w-[104px] overflow-hidden rounded-[1.6vw] border border-white/12 bg-[#06080d] opacity-0 shadow-[0_50px_140px_-40px_oklch(0.05_0.02_258/0.95)]"
          style={{ willChange: "transform, opacity" }}
        >
          <div className="flex h-full flex-col p-[7%]" style={{ containerType: "size" }}>
            <div className="mx-auto mb-[6%] h-[3%] w-[28%] rounded-full bg-white/15" />
            <span className="font-mono text-[3.4cqw] uppercase tracking-[0.3em] text-primary">Elevate</span>
            <div className="mt-[5%] text-[7cqw] font-medium leading-[1.1] tracking-[-0.02em] text-foreground">
              Mobilní
              <br />
              zážitek
            </div>
            <div className="mt-[7%] space-y-[4%]">
              {[0, 1, 2].map((i) => (
                <div key={i} className="rounded-lg border border-white/[0.07] bg-white/[0.02] p-[7%]">
                  <div className={`h-[6px] w-2/3 rounded-full ${i === 0 ? "bg-primary/70" : "bg-foreground/18"}`} />
                  <div className="mt-[6%] h-[5px] w-1/3 rounded-full bg-foreground/10" />
                </div>
              ))}
            </div>
            <div className="mt-auto rounded-full bg-primary py-[6%] text-center text-[4cqw] text-primary-foreground">
              Chci audit
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
