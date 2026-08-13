import { screenshotUrl } from "@/lib/projects";
import type { Discipline } from "@/lib/cinematic-copy";
import mark from "@/assets/elevate-mark-transparent.png.asset.json";

type Slide = {
  shot: string;
  domain: string;
  kind: "web" | "commerce" | "app" | "product";
};

const SLIDES: Slide[] = [
  { shot: screenshotUrl("https://biodentclinic.cz", 1600, 1000), domain: "biodentclinic.cz", kind: "web" },
  { shot: screenshotUrl("https://exclusivebeauty.cz", 1600, 1000), domain: "exclusivebeauty.cz", kind: "commerce" },
  { shot: screenshotUrl("https://wrestlinggympraha.cz", 1600, 1000), domain: "wrestlinggympraha.cz", kind: "app" },
  { shot: screenshotUrl("https://inhomepraha.cz", 1600, 1000), domain: "inhomepraha.cz", kind: "product" },
];

/**
 * The interface living inside the laptop screen — and later filling the viewport.
 * `index` is a continuous float (0..3): slides morph through each other with
 * depth, horizontal drift, scale and masking rather than switching like a slideshow.
 */
export function ScreenShowcase({
  disciplines,
  index,
  compact = false,
}: {
  disciplines: Discipline[];
  index: number;
  compact?: boolean;
}) {
  const items = SLIDES.map((s, i) => ({ ...s, d: disciplines[i] }));
  const current = Math.max(0, Math.min(items.length - 1, Math.round(index)));

  return (
    <div className="relative h-full w-full overflow-hidden bg-[oklch(0.13_0.015_255)] text-foreground">
      {/* stage */}
      <div className="absolute inset-0" style={{ perspective: 1400 }}>
        {items.map((it, i) => {
          const d = index - i;
          const a = Math.abs(d);
          const visible = a < 0.9;
          return (
            <div
              key={it.domain}
              aria-hidden={!visible}
              className="absolute inset-0 will-change-transform"
              style={{
                opacity: visible ? Math.max(0, 1 - Math.pow(a, 1.4) * 1.9) : 0,
                transform: `translate3d(${d * -10}%,0,${-a * 180}px) scale(${1 - a * 0.05})`,
                filter: `blur(${Math.min(5, a * 5)}px)`,
                transformStyle: "preserve-3d",
                transition: "none",
              }}
            >
              <Frame slide={it} compact={compact} />
            </div>
          );
        })}
      </div>

      {/* chrome: brand + progress rail */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-center justify-between px-4 py-3 md:px-8 md:py-5">
        <img src={mark.url} alt="" className="h-3 w-auto opacity-60 md:h-4" />
        <span className="font-mono text-[8px] tracking-[0.24em] text-muted-foreground md:text-[10px]">
          {items[current].domain}
        </span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-4 pb-4 md:px-8 md:pb-7">
        <div>
          <p className="font-mono text-[8px] tracking-[0.3em] text-primary md:text-[10px]">
            {items[current].d?.index}
          </p>
          <p
            className={`mt-1 tracking-[-0.02em] text-foreground ${
              compact ? "text-[13px]" : "text-[clamp(1.2rem,3.4vw,2.4rem)] font-medium"
            }`}
          >
            {items[current].d?.label}
          </p>
        </div>
        <div className="flex items-center gap-1.5 md:gap-2">
          {items.map((it, i) => (
            <span
              key={it.domain}
              className="h-[2px] rounded-full transition-all duration-500"
              style={{
                width: i === current ? 28 : 12,
                background:
                  i === current ? "oklch(0.65 0.18 255)" : "oklch(0.8 0.02 255 / 0.25)",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function Frame({ slide, compact }: { slide: Slide & { d?: Discipline }; compact: boolean }) {
  const pad = compact ? "p-4" : "p-8 md:p-16";

  if (slide.kind === "app") {
    return (
      <div className={`flex h-full w-full items-center gap-3 ${pad}`}>
        <div className="hidden h-[78%] w-[14%] shrink-0 flex-col gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 md:flex">
          {Array.from({ length: 6 }).map((_, i) => (
            <span
              key={i}
              className="h-1.5 rounded-full"
              style={{
                width: `${58 + ((i * 13) % 34)}%`,
                background: i === 1 ? "oklch(0.65 0.18 255 / 0.8)" : "oklch(0.8 0.02 255 / 0.16)",
              }}
            />
          ))}
        </div>
        <Shot slide={slide} className="h-[78%] flex-1" />
      </div>
    );
  }

  if (slide.kind === "commerce") {
    return (
      <div className={`flex h-full w-full flex-col items-center justify-center gap-3 ${pad}`}>
        <Shot slide={slide} className="h-[62%] w-full" />
        <div className="grid w-full grid-cols-4 gap-2 md:gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[4/3] overflow-hidden rounded-lg border border-white/[0.07] bg-white/[0.02]"
            >
              <img
                src={slide.shot}
                alt=""
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
                style={{ objectPosition: `${18 + i * 22}% ${20 + i * 16}%`, transform: "scale(1.6)" }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (slide.kind === "product") {
    return (
      <div className={`grid h-full w-full place-items-center ${pad}`}>
        <div className="relative w-full">
          <Shot slide={slide} className="aspect-[16/9] w-full" />
          <div className="absolute -bottom-4 left-[6%] hidden gap-3 md:flex">
            {["+128%", "0.9s", "24/7"].map((m) => (
              <div
                key={m}
                className="rounded-lg border border-white/[0.08] bg-[oklch(0.15_0.015_255)]/90 px-4 py-2 font-mono text-[11px] text-foreground backdrop-blur"
              >
                {m}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid h-full w-full place-items-center ${pad}`}>
      <Shot slide={slide} className="aspect-[16/9] w-full" browser />
    </div>
  );
}

function Shot({
  slide,
  className,
  browser = false,
}: {
  slide: Slide;
  className?: string;
  browser?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/[0.09] bg-[oklch(0.1_0.01_255)] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.9)] ${className ?? ""}`}
    >
      {browser && (
        <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-3 py-2">
          {["oklch(0.5 0.02 255)", "oklch(0.45 0.02 255)", "oklch(0.4 0.02 255)"].map((c) => (
            <span key={c} className="h-1.5 w-1.5 rounded-full" style={{ background: c }} />
          ))}
          <span className="ml-3 truncate font-mono text-[8px] text-muted-foreground md:text-[9px]">
            {slide.domain}
          </span>
        </div>
      )}
      <img
        src={slide.shot}
        alt=""
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover object-top"
      />
    </div>
  );
}
