/**
 * The interfaces that live on the device glass. Each one is an abstracted view
 * of real ELEVATE work for that discipline — drawn with design tokens, sized in
 * container units so it stays correct at any device scale.
 */
import aMark from "@/assets/elevate-a-mark.png.asset.json";



function Screen({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="absolute inset-0 bg-[linear-gradient(180deg,#070a11_0%,#05070c_100%)] text-foreground"
      style={{ containerType: "size" }}
    >
      {children}
    </div>
  );
}

const dot = "h-[0.9cqh] w-[0.9cqh] rounded-full";

/** 01 — corporate website / landing */
export function WebScreen() {
  return (
    <Screen>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-[2cqw] border-b border-white/[0.06] px-[4cqw] py-[3cqh]">
          <span className="font-mono text-[2.1cqw] uppercase tracking-[0.3em] text-primary">Elevate</span>
          <div className="ml-auto flex gap-[2.4cqw] text-[1.7cqw] text-muted-foreground">
            <span>Služby</span>
            <span>Práce</span>
            <span>Studio</span>
          </div>
          <span className="rounded-full bg-primary px-[2.4cqw] py-[1.2cqh] text-[1.6cqw] text-primary-foreground">
            Audit
          </span>
        </div>
        <div className="flex min-h-0 flex-1 gap-[3cqw] px-[4cqw] py-[5cqh]">
          <div className="flex min-w-0 flex-1 flex-col justify-center">
            <div className="text-[5.4cqw] font-medium leading-[1.05] tracking-[-0.03em]">
              Firemní web,
              <br />
              který prodává.
            </div>
            <div className="mt-[3cqh] h-[1.4cqh] w-[70%] rounded-full bg-foreground/12" />
            <div className="mt-[1.4cqh] h-[1.4cqh] w-[48%] rounded-full bg-foreground/8" />
            <div className="mt-[4cqh] flex gap-[2cqw]">
              <span className="rounded-full bg-primary px-[3cqw] py-[1.6cqh] text-[1.7cqw] text-primary-foreground">
                Poptat web
              </span>
              <span className="rounded-full border border-white/12 px-[3cqw] py-[1.6cqh] text-[1.7cqw] text-muted-foreground">
                Reference
              </span>
            </div>
          </div>
          <div className="w-[38%] rounded-[1.6cqw] border border-white/[0.07] bg-[linear-gradient(150deg,oklch(0.65_0.18_255/0.22),transparent_65%)]">
            <div className="grid h-full grid-rows-3 gap-[1cqh] p-[1.6cqw]">
              <div className="rounded-[1cqw] bg-white/[0.05]" />
              <div className="rounded-[1cqw] bg-primary/25" />
              <div className="rounded-[1cqw] bg-white/[0.04]" />
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/** 02 — e-commerce catalogue + cart */
export function ShopScreen() {
  return (
    <Screen>
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-[2cqw] border-b border-white/[0.06] px-[4cqw] py-[2.6cqh] text-[1.7cqw] text-muted-foreground">
          <span className="font-mono text-[2cqw] uppercase tracking-[0.3em] text-foreground">Shop</span>
          <span>Novinky</span>
          <span>Kolekce</span>
          <span className="ml-auto rounded-full border border-primary/40 px-[2.2cqw] py-[1cqh] text-primary">
            Košík · 3
          </span>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-4 gap-[1.8cqw] p-[3cqw]">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-[1.2cqw] border border-white/[0.07] bg-white/[0.02]">
              <div
                className="flex-1"
                style={{
                  background:
                    i === 1
                      ? "linear-gradient(150deg, oklch(0.65 0.18 255 / 0.5), transparent 70%)"
                      : "linear-gradient(150deg, rgba(255,255,255,0.08), transparent 70%)",
                }}
              />
              <div className="space-y-[0.8cqh] p-[1.2cqw]">
                <div className="h-[1.1cqh] w-[72%] rounded-full bg-foreground/22" />
                <div className="h-[1.1cqh] w-[40%] rounded-full bg-primary/70" />
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-[2cqw] border-t border-white/[0.06] px-[3cqw] py-[2.4cqh]">
          <span className="text-[1.7cqw] text-muted-foreground">Doprava zdarma</span>
          <span className="ml-auto rounded-full bg-primary px-[3cqw] py-[1.4cqh] text-[1.7cqw] text-primary-foreground">
            Do košíku
          </span>
        </div>
      </div>
    </Screen>
  );
}

/** 03 — iOS/Android product UI */
export function MobileScreen() {
  return (
    <Screen>
      <div className="flex h-full flex-col px-[7cqw] pb-[4cqh] pt-[7cqh]">
        <div className="flex items-center justify-between text-[3cqw] text-muted-foreground">
          <span>9:41</span>
          <div className="flex gap-[1.4cqw]">
            <span className={`${dot} bg-foreground/40`} />
            <span className={`${dot} bg-foreground/40`} />
          </div>
        </div>
        <span className="mt-[3cqh] font-mono text-[3cqw] uppercase tracking-[0.3em] text-primary">Elevate app</span>
        <div className="mt-[1cqh] text-[7.5cqw] font-medium leading-[1.05] tracking-[-0.02em]">
          Dnešní
          <br />
          přehled
        </div>
        <div className="mt-[3cqh] rounded-[4cqw] border border-white/[0.08] bg-[linear-gradient(150deg,oklch(0.65_0.18_255/0.3),transparent_70%)] p-[4cqw]">
          <div className="text-[3cqw] text-muted-foreground">Konverze</div>
          <div className="mt-[0.6cqh] text-[6cqw] font-medium">+38 %</div>
          <div className="mt-[1.6cqh] flex h-[6cqh] items-end gap-[1.4cqw]">
            {[40, 62, 48, 80, 66, 96].map((v, i) => (
              <span key={i} className="flex-1 rounded-t-[1cqw] bg-primary/70" style={{ height: `${v}%` }} />
            ))}
          </div>
        </div>
        <div className="mt-[2cqh] space-y-[1.4cqh]">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center gap-[3cqw] rounded-[3cqw] border border-white/[0.06] bg-white/[0.02] p-[3cqw]">
              <span className="h-[4cqh] w-[8cqw] rounded-[2cqw] bg-primary/25" />
              <span className="flex-1">
                <span className="block h-[1.2cqh] w-[70%] rounded-full bg-foreground/22" />
                <span className="mt-[0.7cqh] block h-[1.1cqh] w-[40%] rounded-full bg-foreground/10" />
              </span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-around border-t border-white/[0.06] pt-[2.4cqh] text-[3cqw]">
          <span className="text-primary">Přehled</span>
          <span className="text-muted-foreground">Data</span>
          <span className="text-muted-foreground">Profil</span>
        </div>
      </div>
    </Screen>
  );
}

/** 04 — SEO, speed & Core Web Vitals */
export function SeoScreen() {
  return (
    <Screen>
      <div className="flex h-full flex-col p-[3cqw]">
        <div className="flex items-center gap-[2cqw]">
          <span className="font-mono text-[1.8cqw] uppercase tracking-[0.32em] text-primary">Core Web Vitals</span>
          <span className="ml-auto rounded-full border border-white/10 px-[2cqw] py-[0.9cqh] text-[1.6cqw] text-muted-foreground">
            elevateit.cz
          </span>
        </div>
        <div className="mt-[2.4cqh] grid grid-cols-4 gap-[1.8cqw]">
          {[
            { k: "LCP", v: "1,2 s" },
            { k: "INP", v: "48 ms" },
            { k: "CLS", v: "0,01" },
            { k: "Index", v: "100 %" },
          ].map((c, i) => (
            <div
              key={c.k}
              className="rounded-[1.2cqw] border border-white/[0.07] p-[1.6cqw]"
              style={{
                background:
                  i === 0
                    ? "linear-gradient(150deg, oklch(0.65 0.18 255 / 0.28), transparent 70%)"
                    : "rgba(255,255,255,0.02)",
              }}
            >
              <div className="font-mono text-[1.5cqw] uppercase tracking-[0.2em] text-muted-foreground">{c.k}</div>
              <div className="mt-[0.6cqh] text-[3cqw] font-medium">{c.v}</div>
            </div>
          ))}
        </div>
        {/* performance curve — thin-line geometry, no stock iconography */}
        <div className="relative mt-[2.4cqh] min-h-0 flex-1 overflow-hidden rounded-[1.2cqw] border border-white/[0.07] bg-white/[0.015]">
          <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
            {[10, 20, 30].map((y) => (
              <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="currentColor" strokeWidth="0.15" className="text-white/10" />
            ))}
            <path
              d="M0 34 C 14 33, 22 30, 32 26 S 52 20, 64 13 S 84 6, 100 3"
              fill="none"
              stroke="oklch(0.65 0.18 255)"
              strokeWidth="0.7"
              strokeLinecap="round"
            />
            <path
              d="M0 34 C 14 33, 22 30, 32 26 S 52 20, 64 13 S 84 6, 100 3 L100 40 L0 40 Z"
              fill="oklch(0.65 0.18 255 / 0.14)"
            />
            <circle cx="100" cy="3" r="1" fill="oklch(0.72 0.16 250)" />
          </svg>
          <div className="absolute bottom-[1.6cqh] left-[2cqw] font-mono text-[1.5cqw] uppercase tracking-[0.24em] text-muted-foreground">
            Rychlost · pozice · indexace
          </div>
        </div>
      </div>
    </Screen>
  );
}

/** internal dashboard / analytics */
export function DashboardScreen() {

  return (
    <Screen>
      <div className="flex h-full">
        <div className="w-[18%] border-r border-white/[0.06] p-[2cqw]">
          <span className="font-mono text-[2cqw] uppercase tracking-[0.25em] text-primary">EL</span>
          <div className="mt-[3cqh] space-y-[1.6cqh]">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className={`h-[1.3cqh] rounded-full ${i === 1 ? "bg-primary/70" : "bg-foreground/10"}`}
                style={{ width: i === 1 ? "80%" : `${60 - i * 6}%` }}
              />
            ))}
          </div>
        </div>
        <div className="min-w-0 flex-1 p-[2.6cqw]">
          <div className="flex items-center gap-[2cqw]">
            <span className="text-[2.8cqw] font-medium">Provozní přehled</span>
            <span className="ml-auto rounded-full border border-white/10 px-[2cqw] py-[0.9cqh] text-[1.6cqw] text-muted-foreground">
              30 dní
            </span>
          </div>
          <div className="mt-[2.4cqh] grid grid-cols-3 gap-[1.8cqw]">
            {[
              { k: "Objednávky", v: "1 284" },
              { k: "Konverze", v: "4,7 %" },
              { k: "Marže", v: "38 %" },
            ].map((c) => (
              <div key={c.k} className="rounded-[1.2cqw] border border-white/[0.07] bg-white/[0.02] p-[1.6cqw]">
                <div className="text-[1.6cqw] text-muted-foreground">{c.k}</div>
                <div className="mt-[0.6cqh] text-[3.2cqw] font-medium">{c.v}</div>
              </div>
            ))}
          </div>
          <div className="mt-[2.4cqh] rounded-[1.2cqw] border border-white/[0.07] bg-white/[0.02] p-[1.8cqw]">
            <div className="flex h-[22cqh] items-end gap-[1.2cqw]">
              {[32, 48, 40, 62, 55, 78, 66, 88, 74, 96, 84, 92].map((v, i) => (
                <span
                  key={i}
                  className={`flex-1 rounded-t-[0.6cqw] ${i > 8 ? "bg-primary" : "bg-primary/35"}`}
                  style={{ height: `${v}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}

/** 05 — logo, visual identity & UI/UX */
export function BrandScreen() {
  return (
    <Screen>
      <div className="flex h-full flex-col p-[3.4cqw]">
        <span className="font-mono text-[1.8cqw] uppercase tracking-[0.34em] text-primary">Logo & design</span>
        <div className="mt-[2cqh] flex min-h-0 flex-1 gap-[2.4cqw]">
          <div className="relative flex w-[36%] flex-col justify-between overflow-hidden rounded-[1.4cqw] border border-white/[0.07] bg-white/[0.02] p-[2cqw]">
            {/* construction grid + the ELEVATE mark being built */}
            <div
              aria-hidden
              className="absolute inset-0 opacity-40"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
                backgroundSize: "8% 12%",
              }}
            />
            <img
              src={aMark.url}
              alt=""
              loading="lazy"
              decoding="async"
              className="relative mx-auto h-[46cqh] w-auto object-contain opacity-95"
            />
            <div className="relative space-y-[1cqh]">
              <div className="h-[1.2cqh] w-[80%] rounded-full bg-foreground/18" />
              <div className="h-[1.2cqh] w-[56%] rounded-full bg-foreground/10" />
            </div>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-[1.6cqh]">
            <div className="flex flex-1 gap-[1.2cqw]">
              {["oklch(0.65 0.18 255)", "oklch(0.72 0.16 250)", "oklch(0.30 0.03 258)", "oklch(0.13 0.02 258)"].map(
                (c) => (
                  <div key={c} className="flex-1 rounded-[1cqw] border border-white/[0.06]" style={{ background: c }} />
                ),
              )}
            </div>
            <div className="flex flex-[1.4] gap-[1.2cqw]">
              <div className="grid flex-1 place-items-center rounded-[1cqw] border border-white/[0.07] bg-white/[0.02] text-[4cqw] tracking-[-0.04em]">
                E<span className="text-primary">.</span>
              </div>
              <div className="flex-1 rounded-[1cqw] border border-white/[0.07] bg-[linear-gradient(150deg,oklch(0.65_0.18_255/0.35),transparent_70%)]" />
              <div className="flex flex-1 flex-col justify-center gap-[0.9cqh] rounded-[1cqw] border border-white/[0.07] p-[1.2cqw]">
                <div className="h-[1.1cqh] w-[70%] rounded-full bg-foreground/20" />
                <div className="h-[1.1cqh] w-[50%] rounded-full bg-primary/60" />
                <div className="h-[3cqh] w-[60%] rounded-full bg-primary/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Screen>
  );
}
