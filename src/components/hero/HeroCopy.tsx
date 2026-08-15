import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

const SERVICES = ["Weby", "E-shopy", "Aplikace", "Design", "SEO"];

/**
 * HERO COPY — editorial typography block owning the left of the frame.
 * Grotesk uppercase headline, monospace micro-labels, one restrained CTA.
 */
export function HeroCopy() {
  return (
    <div className="max-w-[40rem]">
      <span className="block font-mono text-[10px] uppercase tracking-[0.42em] text-primary md:text-[11px]">
        Digitální studio · Praha
      </span>

      <h1 className="mt-6 text-[2.15rem] font-medium uppercase leading-[1.03] tracking-[-0.035em] text-foreground sm:text-[3rem] md:mt-8 md:text-[clamp(2.3rem,3.3vw,3.6rem)]">
        Digitální řešení,
        <br />
        která posouvají
        <br />
        <span className="text-primary">vaše podnikání.</span>
      </h1>

      <p className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/80 md:mt-9 md:text-[11px]">
        {SERVICES.map((s, i) => (
          <span key={s} className="flex items-center gap-3">
            {i > 0 && <span className="h-1 w-1 rounded-full bg-primary/70" />}
            {s}
          </span>
        ))}
      </p>

      <Link
        to="/contact"
        className="group pointer-events-auto mt-9 inline-flex items-center gap-2 rounded-full border border-primary/40 px-6 py-3 font-mono text-[10px] uppercase tracking-[0.3em] text-foreground transition-all duration-300 hover:border-primary hover:bg-primary/10 md:mt-11"
      >
        Chci projekt
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </div>
  );
}

/** the tiny numbered index with horizontal ticks, hugging the left edge */
export function HeroIndex({ active }: { active: number }) {
  return (
    <div className="pointer-events-none absolute left-[1.6vw] top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 md:flex">
      {["01", "02", "03", "04", "05"].map((n, i) => {
        const on = i === active;
        return (
          <span key={n} className="flex items-center gap-2">
            <span
              className="font-mono text-[9px] tracking-[0.24em] transition-colors duration-500"
              style={{ color: on ? "oklch(0.7 0.17 255)" : "oklch(0.78 0.02 258 / 0.32)" }}
            />
            <span
              className="h-px transition-all duration-500"
              style={{
                width: on ? 20 : 8,
                background: on ? "oklch(0.68 0.18 255)" : "oklch(0.68 0.18 255 / 0.22)",
              }}
            />
            <span
              className={`font-mono text-[9px] tracking-[0.24em] transition-colors duration-500 ${
                on ? "text-primary" : "text-muted-foreground/40"
              }`}
            >
              {n}
            </span>
          </span>
        );
      })}
    </div>
  );
}
