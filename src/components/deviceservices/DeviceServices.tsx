import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { clamp01, easeFilm, lerp, useFilmProgress } from "@/components/devicefilm/film";
import { KineticGrid } from "./KineticGrid";
import { Laptop, Monitor, Phone, Tablet } from "./DeviceShells";
import { BrandScreen, DashboardScreen, MobileScreen, ShopScreen, WebScreen } from "./ServiceScreens";

type Stage = {
  n: string;
  kicker: string;
  title: string;
  desc: string;
  to: string;
  /** resting composition of the device (vw / vh / deg) */
  base: { x: number; y: number; ry: number; scale: number };
  /** where it comes in from, and where it goes when the camera leaves it */
  inX: number;
  inZ: number;
  outX: number;
  outZ: number;
  /** typography side */
  text: "left" | "right";
  Device: () => React.JSX.Element;
};

const W = (Comp: React.ComponentType, Shell: typeof Monitor, size: string, active = true) =>
  function DeviceNode() {
    return (
      <Shell active={active} className={size}>
        <Comp />
      </Shell>
    );
  };

const STAGES: Stage[] = [
  {
    n: "01",
    kicker: "Web development",
    title: "Web",
    desc: "Firemní weby, landing pages a digitální prezentace, které dávají vašemu podnikání profesionální tvář.",
    to: "/services/web",
    base: { x: 15, y: -1, ry: -9, scale: 1 },
    inX: 10,
    inZ: -1500,
    outX: 6,
    outZ: -900,
    text: "left",
    Device: W(WebScreen, Monitor, "w-[62vw] md:w-[42vw]"),
  },
  {
    n: "02",
    kicker: "E-commerce",
    title: "E-commerce",
    desc: "E-shopy navržené pro důvěru, jednoduchý nákup a skutečnou konverzi.",
    to: "/services/eshop",
    base: { x: -16, y: 2, ry: 10, scale: 1 },
    inX: -14,
    inZ: -1400,
    outX: -8,
    outZ: 700,
    text: "right",
    Device: W(ShopScreen, Laptop, "w-[64vw] md:w-[40vw]"),
  },
  {
    n: "03",
    kicker: "Mobilní aplikace",
    title: "Mobilní aplikace",
    desc: "Moderní aplikace pro iOS a Android, od konceptu po publikaci v App Store a Google Play.",
    to: "/services/design",
    base: { x: 20, y: 1, ry: -12, scale: 1 },
    inX: 8,
    inZ: 620,
    outX: 10,
    outZ: -1100,
    text: "left",
    Device: W(MobileScreen, Phone, "w-[42vw] md:w-[15vw]"),
  },
  {
    n: "04",
    kicker: "Digitální produkty",
    title: "Digitální produkty",
    desc: "Dashboardy, interní systémy a webové aplikace pro reálné procesy.",
    to: "/services/web",
    base: { x: -3, y: -5, ry: 6, scale: 1 },
    inX: -12,
    inZ: -1300,
    outX: 0,
    outZ: -1400,
    text: "right",
    Device: W(DashboardScreen, Tablet, "w-[70vw] md:w-[38vw]"),
  },
  {
    n: "05",
    kicker: "Brand & UX",
    title: "Brand & UX",
    desc: "Vizuální identita, UX/UI a digitální systém, který drží značku pohromadě.",
    to: "/services/branding",
    base: { x: 17, y: 0, ry: -4, scale: 1 },
    inX: 0,
    inZ: -1200,
    outX: 0,
    outZ: 1400,
    text: "left",
    Device: function Ecosystem() {
      return (
        <div className="relative w-[86vw] md:w-[52vw]" style={{ transformStyle: "preserve-3d" }}>
          <div className="relative" style={{ transform: "translateZ(-140px) translateX(-6%)" }}>
            <Monitor active className="w-[62%]">
              <BrandScreen />
            </Monitor>
          </div>
          <div className="absolute right-0 top-[16%] hidden w-[44%] md:block" style={{ transform: "translateZ(60px)" }}>
            <Laptop className="w-full">
              <WebScreen />
            </Laptop>
          </div>
          <div className="absolute bottom-[-6%] left-[26%] w-[13%] md:w-[11%]" style={{ transform: "translateZ(260px)" }}>
            <Phone className="w-full">
              <MobileScreen />
            </Phone>
          </div>
          <div
            className="absolute bottom-[2%] right-[8%] hidden w-[26%] md:block"
            style={{ transform: "translateZ(180px) rotateY(-14deg)" }}
          >
            <Tablet className="w-full">
              <DashboardScreen />
            </Tablet>
          </div>
        </div>
      );
    },
  },
];

const N = STAGES.length;

/**
 * ELEVATE — DEVICE SERVICE GALLERY.
 *
 * The next scene of the hero film: one continuous camera shot through five
 * physical products. Scroll is the only driver, it reverses exactly, and the
 * final beat assembles every device into one ecosystem the camera passes through.
 */
export function DeviceServices() {
  const wrap = useRef<HTMLDivElement>(null);
  const progress = useFilmProgress(wrap);
  const cam = useRef<HTMLDivElement>(null);
  const devices = useRef<(HTMLDivElement | null)[]>([]);
  const texts = useRef<(HTMLDivElement | null)[]>([]);
  const nums = useRef<(HTMLSpanElement | null)[]>([]);
  const grid = useRef<HTMLDivElement>(null);
  const [mobile, setMobile] = useState(false);

  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = { x: 0, y: 0 };
    const smooth = { x: 0, y: 0 };
    const onMove = (e: PointerEvent) => {
      pointer.x = e.clientX / window.innerWidth - 0.5;
      pointer.y = 0.5 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    let raf = 0;
    let active = -1;
    const tick = () => {
      const p = clamp01(progress.current ?? 0);
      smooth.x += ((reduced ? 0 : pointer.x) - smooth.x) * 0.06;
      smooth.y += ((reduced ? 0 : pointer.y) - smooth.y) * 0.06;
      const s = p * N;

      // the camera: lateral travel, a slow push-in, and a whisper of parallax
      if (cam.current) {
        const push = 1 + Math.sin(clamp01(p) * Math.PI) * 0.04;
        const exit = easeFilm(clamp01((p - 0.94) / 0.06));
        cam.current.style.transform = `translate3d(${(-(s - N / 2) * 1.6 + smooth.x * 2.2).toFixed(3)}vw, ${(smooth.y * -1.2).toFixed(3)}vh, ${exit * 900}px) scale(${push})`;
        cam.current.style.opacity = String(1 - exit * 0.9);
      }
      if (grid.current) {
        grid.current.style.transform = `translate3d(${smooth.x * -1.4}vw, ${smooth.y * 1}vh, 0)`;
      }

      let nearest = 0;
      let nearestD = 99;
      STAGES.forEach((st, i) => {
        const u = s - i - 0.5;
        const au = Math.abs(u);
        if (au < nearestD) {
          nearestD = au;
          nearest = i;
        }
        const vis = clamp01(1 - (au - 0.4) / 0.45);
        const el = devices.current[i];
        if (el) {
          const inbound = u < 0;
          const k = Math.min(1, au * 2);
          const e = easeFilm(k);
          const x = st.base.x + (inbound ? st.inX : st.outX) * e + smooth.x * 0.6;
          const z = (inbound ? st.inZ : st.outZ) * e;
          const y = st.base.y + smooth.y * -0.8 + (inbound ? 2 : -2) * e;
          const scale = st.base.scale * lerp(1, 0.86, e);
          const ry = st.base.ry + (inbound ? -6 : 6) * e;
          el.style.transform = `translate3d(calc(-50% + ${x}vw), calc(-50% + ${y}vh), ${z}px) rotateY(${ry}deg) rotateX(${(smooth.y * 2).toFixed(2)}deg) scale(${scale})`;
          el.style.opacity = String(vis);
          el.style.filter = `blur(${((1 - vis) * 7).toFixed(2)}px)`;
          el.style.visibility = vis < 0.01 ? "hidden" : "visible";
        }
        const tx = texts.current[i];
        if (tx) {
          const tv = clamp01(1 - (au - 0.18) / 0.3);
          tx.style.opacity = String(tv);
          tx.style.transform = `translate3d(0, ${(1 - tv) * (u < 0 ? 26 : -26)}px, 0)`;
          tx.style.visibility = tv < 0.01 ? "hidden" : "visible";
        }
      });

      if (nearest !== active) {
        active = nearest;
        nums.current.forEach((el, i) => {
          if (el) el.style.color = i === active ? "var(--color-primary)" : "";
        });
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", check);
      window.removeEventListener("pointermove", onMove);
    };
  }, [progress]);

  return (
    <section id="services" ref={wrap} className="relative h-[500vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* the physical digital field the products sit in */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(65% 60% at 50% 42%, oklch(0.3 0.07 258 / 0.26) 0%, transparent 72%), linear-gradient(180deg, oklch(0.09 0.014 258 / 0.55) 0%, transparent 40%, transparent 62%, oklch(0.09 0.014 258 / 0.4) 100%)",
          }}
        />
        <div ref={grid} aria-hidden className="absolute inset-[-4%]">
          <KineticGrid mobile={mobile} />
        </div>

        {/* one camera, five products */}
        <div
          className="absolute inset-0"
          style={{ perspective: mobile ? "1100px" : "1700px", perspectiveOrigin: "50% 48%" }}
        >
          <div
            ref={cam}
            className="absolute inset-0"
            style={{ transformStyle: "preserve-3d", willChange: "transform, opacity" }}
          >
            {STAGES.map((st, i) => (
              <div
                key={st.n}
                ref={(el) => {
                  devices.current[i] = el;
                }}
                className="absolute left-1/2 top-[48%]"
                style={{ transformStyle: "preserve-3d", willChange: "transform, opacity, filter", opacity: 0 }}
              >
                <st.Device />
              </div>
            ))}
          </div>
        </div>

        {/* editorial type — only the active service speaks */}
        {STAGES.map((st, i) => (
          <div
            key={st.n}
            ref={(el) => {
              texts.current[i] = el;
            }}
            className={`absolute inset-x-0 z-30 px-7 md:px-[6vw] ${
              mobile ? "bottom-[9vh]" : "top-1/2 -translate-y-1/2"
            }`}
            style={{ opacity: 0, willChange: "transform, opacity" }}
          >
            <div
              className={`max-w-[26rem] ${
                st.text === "right" && !mobile ? "ml-auto text-right" : ""
              }`}
            >
              <span className="block font-mono text-[10px] uppercase tracking-[0.4em] text-primary">
                {st.n} / {st.kicker}
              </span>
              <h3 className="mt-4 text-3xl font-medium leading-[1.03] tracking-[-0.035em] text-foreground md:text-[3.4vw]">
                {st.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-[0.95rem]">{st.desc}</p>
              <Link
                to={st.to}
                className={`group mt-6 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground/80 transition-colors hover:text-primary`}
              >
                Detail služby
                <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        ))}

        {/* minimal progress: 01 / 05 */}
        <div className="absolute bottom-6 left-1/2 z-30 -translate-x-1/2 font-mono text-[10px] tracking-[0.35em] text-muted-foreground/60">
          {STAGES.map((st, i) => (
            <span
              key={st.n}
              ref={(el) => {
                nums.current[i] = el;
              }}
              className="px-1 transition-colors duration-500"
            >
              {st.n}
            </span>
          ))}
          <span className="pl-2 text-muted-foreground/35">/ 05</span>
        </div>
      </div>
    </section>
  );
}
