import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

/**
 * The decision beat between the cinematic device film and the service system.
 * Instead of a service list, the visitor picks the problem they need solved —
 * each option previews a continuation of the device interface on hover.
 */

type Option = {
  id: string;
  label: string;
  to: string;
  Preview: () => React.JSX.Element;
};

const Frame = ({ children, bar }: { children: React.ReactNode; bar?: string }) => (
  <div className="h-full w-full overflow-hidden rounded-lg border border-border/70 bg-[oklch(0.13_0.02_258)]">
    <div className="flex items-center gap-1.5 border-b border-border/60 px-2.5 py-1.5">
      <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
      <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
      <span className="ml-2 font-mono text-[7px] uppercase tracking-[0.3em] text-muted-foreground/60">
        {bar ?? "elevate"}
      </span>
    </div>
    <div className="p-2.5">{children}</div>
  </div>
);

const Line = ({ w, tone = "muted" }: { w: string; tone?: "muted" | "accent" | "fore" }) => (
  <div
    className={`h-1 rounded-full ${
      tone === "accent" ? "bg-primary/70" : tone === "fore" ? "bg-foreground/45" : "bg-muted-foreground/20"
    }`}
    style={{ width: w }}
  />
);

function WebPreview() {
  return (
    <Frame bar="web">
      <div className="space-y-1.5">
        <Line w="62%" tone="fore" />
        <Line w="40%" />
        <div className="mt-2 grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-8 rounded border border-border/60 bg-primary/5" />
          ))}
        </div>
        <div className="mt-2 h-2.5 w-16 rounded-full bg-primary/70" />
      </div>
    </Frame>
  );
}

function ShopPreview() {
  return (
    <Frame bar="checkout">
      <div className="grid grid-cols-2 gap-2">
        <div className="h-14 rounded border border-border/60 bg-primary/10" />
        <div className="space-y-1.5">
          <Line w="80%" tone="fore" />
          <Line w="45%" tone="accent" />
          <div className="mt-3 h-2.5 w-full rounded-full bg-primary/70" />
          <Line w="60%" />
        </div>
      </div>
    </Frame>
  );
}

function AppPreview() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-full w-[42%] overflow-hidden rounded-[0.9rem] border border-border/70 bg-[oklch(0.13_0.02_258)] p-2">
        <div className="mx-auto mb-2 h-1 w-6 rounded-full bg-muted-foreground/30" />
        <div className="space-y-1.5">
          <Line w="70%" tone="fore" />
          <div className="h-8 rounded border border-border/60 bg-primary/10" />
          <Line w="50%" tone="accent" />
          <Line w="80%" />
        </div>
      </div>
    </div>
  );
}

function PerfPreview() {
  return (
    <Frame bar="core web vitals">
      <div className="space-y-2">
        <div className="flex gap-2">
          {["LCP", "INP", "CLS"].map((k) => (
            <div key={k} className="flex-1 rounded border border-border/60 px-1.5 py-1">
              <span className="font-mono text-[6px] uppercase tracking-[0.2em] text-muted-foreground/70">{k}</span>
              <div className="mt-1 h-1 rounded-full bg-primary/70" />
            </div>
          ))}
        </div>
        <svg viewBox="0 0 100 26" className="h-8 w-full" aria-hidden>
          <path d="M0 24 L22 18 L44 20 L66 9 L100 3" fill="none" stroke="oklch(0.65 0.18 255)" strokeWidth="1.2" />
        </svg>
      </div>
    </Frame>
  );
}

const OPTIONS: Option[] = [
  { id: "web", label: "Potřebuji nový web", to: "/services/web", Preview: WebPreview },
  { id: "shop", label: "Chci prodávat online", to: "/services/eshop", Preview: ShopPreview },
  { id: "app", label: "Potřebuji vlastní aplikaci", to: "/contact", Preview: AppPreview },
  { id: "perf", label: "Chci zlepšit svůj současný web", to: "/audit", Preview: PerfPreview },
];

export function ServiceDecision() {
  const [active, setActive] = useState<string>("web");
  const current = OPTIONS.find((o) => o.id === active) ?? OPTIONS[0];

  return (
    <section className="relative py-[14vh] md:py-[18vh]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 50% 30%, oklch(0.34 0.08 258 / 0.14) 0%, transparent 72%)",
        }}
      />
      <div className="container-luxe relative">
        <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary">Co potřebujete vyřešit?</p>
        <h2 className="mt-6 max-w-2xl text-3xl font-medium leading-[1.06] tracking-[-0.035em] text-foreground md:text-[3.4vw]">
          Vyřešíme digitální část vašeho byznysu.
        </h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="border-t border-border/70">
            {OPTIONS.map((o) => {
              const on = o.id === active;
              return (
                <Link
                  key={o.id}
                  to={o.to}
                  onMouseEnter={() => setActive(o.id)}
                  onFocus={() => setActive(o.id)}
                  className="group flex items-center justify-between gap-6 border-b border-border/70 py-5 transition-colors"
                >
                  <span className="flex items-center gap-4">
                    <span
                      className="h-px transition-all duration-500"
                      style={{
                        width: on ? 34 : 14,
                        background: on
                          ? "oklch(0.65 0.18 255)"
                          : "oklch(0.65 0.18 255 / 0.3)",
                      }}
                    />
                    <span
                      className={`text-base transition-colors md:text-xl ${
                        on ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                      }`}
                    >
                      {o.label}
                    </span>
                  </span>
                  <ArrowUpRight
                    className={`h-4 w-4 shrink-0 transition-all duration-500 ${
                      on ? "text-primary opacity-100" : "text-muted-foreground opacity-40"
                    }`}
                  />
                </Link>
              );
            })}
          </div>

          <div className="relative hidden aspect-[4/3] lg:block" style={{ perspective: "1200px" }}>
            <div
              aria-hidden
              className="absolute inset-x-6 bottom-2 h-24 rounded-[50%] blur-2xl"
              style={{ background: "oklch(0.65 0.18 255 / 0.12)" }}
            />
            {OPTIONS.map((o) => {
              const on = o.id === active;
              const P = o.Preview;
              return (
                <div
                  key={o.id}
                  className="absolute inset-0 transition-all duration-700 ease-out"
                  style={{
                    opacity: on ? 1 : 0,
                    transform: `rotateY(${on ? -7 : -12}deg) translate3d(0, ${on ? 0 : 14}px, 0) scale(${on ? 1 : 0.97})`,
                    filter: on ? "none" : "blur(8px)",
                    pointerEvents: "none",
                  }}
                >
                  <P />
                </div>
              );
            })}
            <span className="sr-only">{current.label}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
