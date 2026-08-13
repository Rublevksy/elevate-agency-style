/**
 * Hand-built interface compositions — one per ELEVATE discipline.
 * No stock imagery, no fake logos: these are abstracted views of the kind of
 * product the studio actually ships, drawn with design tokens only.
 */

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
        <span className="h-1.5 w-1.5 rounded-full bg-primary/70" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/15" />
        <span className="h-1.5 w-1.5 rounded-full bg-foreground/15" />
        <span className="ml-3 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
          {label}
        </span>
      </div>
      <div className="min-h-0 flex-1 p-4 md:p-6">{children}</div>
    </div>
  );
}

const bar = (w: string, tone = "bg-foreground/12") => (
  <div className={`h-2 rounded-full ${tone}`} style={{ width: w }} />
);

export function WebComposition() {
  return (
    <Frame label="Web / landing">
      <div className="flex h-full gap-5">
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3">
          {bar("38%", "bg-primary/50")}
          <div className="h-4 w-4/5 rounded-full bg-foreground/35" />
          <div className="h-4 w-3/5 rounded-full bg-foreground/20" />
          {bar("70%")}
          {bar("52%")}
          <div className="mt-3 flex gap-2">
            <div className="h-7 w-24 rounded-full bg-primary/80" />
            <div className="h-7 w-20 rounded-full border border-white/10" />
          </div>
        </div>
        <div className="hidden w-[38%] flex-col gap-2 sm:flex">
          <div className="flex-1 rounded-lg bg-gradient-to-br from-primary/25 via-primary/5 to-transparent" />
          <div className="h-1/3 rounded-lg border border-white/5 bg-white/[0.02]" />
        </div>
      </div>
    </Frame>
  );
}

export function CommerceComposition() {
  return (
    <Frame label="Commerce / checkout">
      <div className="grid h-full grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex flex-col overflow-hidden rounded-lg border border-white/5 bg-white/[0.015]">
            <div
              className={`flex-1 ${
                i % 3 === 0
                  ? "bg-gradient-to-br from-primary/25 to-transparent"
                  : "bg-gradient-to-br from-white/8 to-transparent"
              }`}
            />
            <div className="space-y-1.5 p-2">
              <div className="h-1.5 w-3/4 rounded-full bg-foreground/25" />
              <div className="h-1.5 w-1/3 rounded-full bg-primary/60" />
            </div>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function AppsComposition() {
  return (
    <Frame label="App / workflow">
      <div className="flex h-full gap-3">
        <div className="hidden w-14 flex-col gap-2 rounded-lg border border-white/5 p-2 sm:flex">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className={`h-2 rounded-full ${i === 0 ? "bg-primary/70" : "bg-foreground/12"}`} />
          ))}
        </div>
        <div className="grid min-w-0 flex-1 grid-cols-3 gap-3">
          {["Brief", "Build", "Live"].map((col, ci) => (
            <div key={col} className="flex flex-col gap-2 rounded-lg border border-white/5 bg-white/[0.015] p-2">
              <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-muted-foreground">{col}</span>
              {Array.from({ length: 3 - ci }).map((_, i) => (
                <div key={i} className="space-y-1.5 rounded-md border border-white/5 bg-white/[0.02] p-2">
                  <div className="h-1.5 w-full rounded-full bg-foreground/22" />
                  <div className={`h-1.5 w-1/2 rounded-full ${ci === 1 ? "bg-primary/60" : "bg-foreground/10"}`} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

export function ProductComposition() {
  const bars = [42, 68, 55, 82, 61, 94, 73];
  return (
    <Frame label="Dashboard / system">
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-white/5 bg-white/[0.015] p-3">
              <div className="h-1.5 w-1/2 rounded-full bg-foreground/15" />
              <div className={`mt-2 h-3 w-2/3 rounded-full ${i === 0 ? "bg-primary/70" : "bg-foreground/30"}`} />
            </div>
          ))}
        </div>
        <div className="flex min-h-0 flex-1 items-end gap-2 rounded-lg border border-white/5 bg-white/[0.015] p-3">
          {bars.map((h, i) => (
            <div
              key={i}
              className={`flex-1 rounded-t ${i === bars.length - 2 ? "bg-primary/70" : "bg-foreground/12"}`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </Frame>
  );
}

export function BrandComposition() {
  return (
    <Frame label="Identity / system">
      <div className="grid h-full grid-cols-4 grid-rows-2 gap-3">
        <div className="col-span-2 row-span-2 grid place-items-center rounded-lg border border-white/5 bg-white/[0.015]">
          <span className="text-2xl font-light tracking-[0.32em] text-foreground/80 md:text-3xl">E—</span>
        </div>
        <div className="rounded-lg bg-primary/70" />
        <div className="rounded-lg bg-foreground/12" />
        <div className="rounded-lg border border-white/5 bg-gradient-to-br from-primary/25 to-transparent" />
        <div className="grid place-items-center rounded-lg border border-white/5">
          <span className="font-mono text-[9px] tracking-[0.2em] text-muted-foreground">Aa</span>
        </div>
      </div>
    </Frame>
  );
}

export const COMPOSITIONS: Record<string, () => React.JSX.Element> = {
  web: WebComposition,
  commerce: CommerceComposition,
  apps: AppsComposition,
  product: ProductComposition,
  brand: BrandComposition,
};
