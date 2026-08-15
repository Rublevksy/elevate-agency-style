import { Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

import laptopAsset from "@/assets/elevate-laptop.webp.asset.json";
import markAsset from "@/assets/elevate-a-mark.png.asset.json";
import { RibbonField } from "@/components/hero/RibbonField";

const SERVICES = [
  { label: "Weby", to: "/services/web" as const },
  { label: "E-shopy", to: "/services/eshop" as const },
  { label: "Aplikace", to: "/services/web" as const },
  { label: "Design", to: "/services/design" as const },
  { label: "SEO", to: "/services/branding" as const },
];

export function Hero() {
  const deviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const device = deviceRef.current;
    if (!device || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / 720));
      device.style.transform = `translate3d(${(progress * 5).toFixed(2)}vw, ${(progress * 13).toFixed(2)}vh, 0) rotate(${(progress * 2).toFixed(2)}deg) scale(${(1 - progress * 0.05).toFixed(3)})`;
      device.style.opacity = String(1 - progress * 0.82);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section aria-label="ELEVATE — digitální studio Praha" className="relative isolate min-h-[100svh] overflow-hidden bg-[#010204]">
      <RibbonField />

      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_54%_72%_at_76%_55%,rgba(5,18,42,0.34),transparent_74%)]" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-[2] w-[58%] bg-[linear-gradient(90deg,#010204_0%,rgba(1,2,4,0.97)_34%,rgba(1,2,4,0.64)_70%,transparent_100%)]" />

      <div ref={deviceRef} className="pointer-events-none absolute bottom-[3.8vh] right-[1%] z-[3] w-[59vw] max-w-[940px] min-w-[660px] origin-bottom-right will-change-transform">
        <div aria-hidden className="absolute bottom-[7%] left-[8%] right-[3%] h-[13%] rounded-[50%] bg-primary/20 blur-3xl" />
        <img
          src={laptopAsset.url}
          alt="Space Black MacBook zobrazený zezadu v tříčtvrtečním pohledu"
          width={780}
          height={514}
          fetchPriority="high"
          decoding="async"
          className="relative h-auto w-full object-contain drop-shadow-[0_30px_42px_rgba(0,0,0,0.95)]"
        />
        <img src={markAsset.url} alt="" aria-hidden className="absolute right-[27.8%] top-[43%] h-auto w-[3.7%] opacity-90 drop-shadow-[0_0_12px_rgba(34,112,255,0.7)]" />
        <div aria-hidden className="mx-auto -mt-[3.4%] h-[10vh] w-[76%] origin-top scale-y-[-1] bg-[linear-gradient(to_bottom,rgba(66,142,255,0.13),transparent_75%)] opacity-60 blur-xl" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] w-full max-w-[1536px] items-end px-7 pb-[9vh] pt-32 md:px-12 lg:px-[6.4vw] lg:pb-[8.8vh]">
        <div className="relative w-full max-w-[590px] pl-6 md:pl-8">
          <span aria-hidden className="absolute bottom-[4%] left-0 top-[3%] hidden w-px bg-[linear-gradient(to_bottom,transparent,#82b6ff_35%,#236fff_64%,transparent)] shadow-[0_0_18px_rgba(43,118,255,0.8)] md:block" />

          <h1 className="text-[clamp(1.2rem,1.85vw,1.78rem)] font-extralight uppercase leading-[1.48] tracking-[0.09em] text-foreground">
            <span className="block">Digitální řešení,</span>
            <span className="block">která posouvají</span>
            <span className="block text-primary drop-shadow-[0_0_20px_rgba(40,114,255,0.48)]">vaše podnikání</span>
          </h1>

          <ul className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2 text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
            {SERVICES.map((service, index) => (
              <li key={service.label} className="flex items-center gap-3">
                <Link to={service.to} className="transition-colors hover:text-foreground">{service.label}</Link>
                {index < SERVICES.length - 1 && <span className="text-primary">·</span>}
              </li>
            ))}
          </ul>

          <ol className="mt-12 flex gap-5 text-[9px] tracking-[0.3em]">
            {["01", "02", "03", "04"].map((number, index) => (
              <li key={number} className={index === 0 ? "text-primary" : "text-muted-foreground/35"}>
                {index === 0 ? <a href="#services">{number}</a> : number}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-[8] h-20 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}