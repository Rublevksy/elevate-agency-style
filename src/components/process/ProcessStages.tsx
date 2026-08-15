/**
 * The four states of the central project canvas: brief → design → build → launch.
 * Each stage is a real interface fragment, not an illustration; they are stacked
 * and cross-faded by the scroll timeline so the object appears to transform.
 */

const Bar = ({ w, dim = false }: { w: string; dim?: boolean }) => (
  <div
    className="h-1.5 rounded-full"
    style={{ width: w, background: dim ? "oklch(1 0 0 / 0.1)" : "oklch(1 0 0 / 0.22)" }}
  />
);

/** 01 — a plain brief: handwritten notes, requirements, nothing designed yet */
export function BriefStage() {
  return (
    <div className="h-full w-full p-6 md:p-8">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-primary">brief.txt</span>
        <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground/50">01</span>
      </div>
      <div className="mt-6 space-y-3 md:mt-8">
        {["Cíl projektu", "Cílová skupina", "Konkurence", "Rozsah"].map((k, i) => (
          <div key={k} className="flex items-center gap-4">
            <span className="w-24 shrink-0 font-mono text-[9px] uppercase tracking-[0.16em] text-muted-foreground/70 md:w-28">
              {k}
            </span>
            <div className="flex-1 space-y-2">
              <Bar w={`${88 - i * 11}%`} />
              {i < 2 && <Bar w={`${54 - i * 8}%`} dim />}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex gap-2">
        {["Web", "E-shop", "Aplikace"].map((t, i) => (
          <span
            key={t}
            className="rounded-full border px-3 py-1 font-mono text-[9px] uppercase tracking-[0.16em]"
            style={{
              borderColor: i === 0 ? "oklch(0.62 0.19 258 / 0.5)" : "oklch(1 0 0 / 0.1)",
              color: i === 0 ? "oklch(0.75 0.14 258)" : "oklch(1 0 0 / 0.35)",
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

/** 02 — the polished concept: real layout, real hierarchy, the client sees the product */
export function DesignStage() {
  return (
    <div className="h-full w-full">
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
        <span className="h-2 w-2 rounded-full bg-white/15" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="h-2 w-2 rounded-full bg-white/10" />
        <span className="ml-3 font-mono text-[9px] tracking-[0.18em] text-muted-foreground/50">koncept · v1</span>
      </div>
      <div className="grid h-[calc(100%-2.6rem)] grid-cols-5">
        <div className="col-span-3 flex flex-col justify-center px-6 md:px-8">
          <span className="font-mono text-[9px] uppercase tracking-[0.32em] text-primary">Studio</span>
          <h4 className="mt-3 text-[1.35rem] font-medium leading-[1.05] tracking-[-0.03em] text-foreground md:text-[2vw]">
            Nový web,
            <br />
            který prodává.
          </h4>
          <div className="mt-4 space-y-2">
            <Bar w="78%" dim />
            <Bar w="60%" dim />
          </div>
          <div className="mt-6 flex items-center gap-3">
            <span className="rounded-full bg-primary px-4 py-1.5 text-[10px] font-medium text-primary-foreground">
              Poptat projekt
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/60">Reference</span>
          </div>
        </div>
        <div className="col-span-2 relative overflow-hidden">
          <div
            className="absolute inset-3 rounded-lg"
            style={{
              background:
                "linear-gradient(150deg, oklch(0.34 0.09 258) 0%, oklch(0.18 0.05 258) 55%, oklch(0.12 0.02 258) 100%)",
              boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.12)",
            }}
          />
          <div className="absolute bottom-6 left-6 right-6 space-y-2">
            <Bar w="70%" />
            <Bar w="45%" dim />
          </div>
        </div>
      </div>
    </div>
  );
}

/** 03 — the build: structure, components, real state */
export function BuildStage() {
  return (
    <div className="flex h-full w-full">
      <div className="hidden w-[26%] flex-col gap-2 border-r border-white/[0.06] p-4 md:flex">
        {["Layout", "Hero", "Services", "Pricing", "Footer"].map((t, i) => (
          <div
            key={t}
            className="flex items-center gap-2 rounded-md px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em]"
            style={{
              background: i === 1 ? "oklch(0.62 0.19 258 / 0.12)" : "transparent",
              color: i === 1 ? "oklch(0.8 0.12 258)" : "oklch(1 0 0 / 0.3)",
            }}
          >
            <span className="h-1 w-1 rounded-full bg-current" />
            {t}
          </div>
        ))}
      </div>
      <div className="relative flex-1 p-4 md:p-6">
        <div className="absolute inset-0 opacity-[0.5]">
          <div className="grid h-full w-full grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border-l border-primary/[0.07]" />
            ))}
          </div>
        </div>
        <div className="relative grid h-full grid-cols-3 grid-rows-3 gap-3">
          <div className="col-span-2 row-span-2 rounded-lg border border-primary/25 bg-white/[0.02] p-4">
            <span className="font-mono text-[9px] uppercase tracking-[0.24em] text-primary">component</span>
            <div className="mt-3 space-y-2">
              <Bar w="72%" />
              <Bar w="52%" dim />
              <Bar w="38%" dim />
            </div>
            <div className="absolute" />
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.015] p-3">
            <Bar w="64%" dim />
            <div className="mt-2" />
            <Bar w="40%" dim />
          </div>
          <div className="rounded-lg border border-white/[0.07] bg-white/[0.015] p-3">
            <Bar w="50%" dim />
          </div>
          <div className="col-span-3 rounded-lg border border-white/[0.07] bg-white/[0.015] p-3">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <Bar w="30%" dim />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** 04 — the finished product, live */
export function LaunchStage() {
  return (
    <div className="h-full w-full">
      <div className="flex items-center gap-3 border-b border-white/[0.06] px-5 py-3">
        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="font-mono text-[9px] tracking-[0.18em] text-muted-foreground/60">
          elevate.cz · live
        </span>
      </div>
      <div className="grid h-[calc(100%-2.6rem)] grid-rows-[1.35fr_1fr]">
        <div className="relative flex flex-col justify-center overflow-hidden px-6 md:px-8">
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(70% 90% at 80% 20%, oklch(0.4 0.12 258 / 0.35) 0%, transparent 70%)",
            }}
          />
          <span className="relative font-mono text-[9px] uppercase tracking-[0.32em] text-primary">
            spuštěno
          </span>
          <h4 className="relative mt-3 text-[1.4rem] font-medium leading-[1.03] tracking-[-0.035em] text-foreground md:text-[2.1vw]">
            Váš web
            <br />
            v reálném provozu.
          </h4>
        </div>
        <div className="grid grid-cols-3 gap-px border-t border-white/[0.06] bg-white/[0.04]">
          {["Web", "Obsah", "Měření"].map((t) => (
            <div key={t} className="flex flex-col justify-center gap-2 bg-[#05070c] px-4 py-3">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/55">{t}</span>
              <div className="flex items-center gap-2">
                <span className="h-1 w-1 rounded-full bg-primary" />
                <Bar w="60%" dim />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
