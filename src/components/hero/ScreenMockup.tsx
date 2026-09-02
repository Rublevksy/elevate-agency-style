/**
 * Compact, real UI-shaped content for the device screen frames (hero + service preview) —
 * replaces plain logo/text with something that reads as an actual digital product, per
 * service, without baking untranslated text into the graphics themselves: the only words
 * shown are the real i18n `title`/`tag` strings, everything else is numbers/bars/icons.
 */
export function ScreenMockup({ index, title, tag }: { index: number; title: string; tag?: string }) {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      <div className="flex items-center gap-1.5 border-b border-white/5 px-[7%] py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/15" />
      </div>
      <div className="flex flex-1 flex-col justify-center gap-2.5 px-[7%] py-2">
        <span className="text-[9px] uppercase tracking-[0.3em] text-primary">0{index}</span>
        <p className="max-w-[85%] text-sm font-semibold leading-tight text-foreground md:text-base">
          {title}
        </p>
        {tag && (
          <p className="max-w-[80%] text-[10px] leading-snug text-muted-foreground md:text-[11px]">
            {tag}
          </p>
        )}
        <div className="pt-1.5">
          {index === 1 && <WebMock />}
          {index === 2 && <SeoMock />}
          {index === 3 && <EshopMock />}
        </div>
      </div>
    </div>
  );
}

function WebMock() {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="h-1.5 w-[70%] rounded-full bg-white/12" />
      <div className="h-1.5 w-[45%] rounded-full bg-white/8" />
      <div className="mt-1 h-4 w-[38%] rounded-full bg-primary/70" />
    </div>
  );
}

function SeoMock() {
  return (
    <div className="flex items-end gap-3">
      {["+220%", "+180%", "+150%"].map((stat) => (
        <div key={stat} className="flex flex-col gap-0.5">
          <span className="text-[11px] font-bold text-primary md:text-xs">{stat}</span>
          <span className="h-px w-6 bg-white/10" />
        </div>
      ))}
      <svg viewBox="0 0 60 20" className="h-4 w-12 opacity-80" aria-hidden>
        <polyline
          points="0,16 12,14 22,10 32,12 44,5 60,2"
          fill="none"
          stroke="var(--primary-glow-strong)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function EshopMock() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="h-8 w-8 shrink-0 rounded-md bg-gradient-to-br from-white/15 to-white/5 md:h-10 md:w-10" />
      <div className="flex flex-col gap-1">
        <div className="h-1.5 w-14 rounded-full bg-white/12" />
        <div className="h-3.5 w-10 rounded-full bg-primary/70" />
      </div>
    </div>
  );
}
