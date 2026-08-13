import { PROJECTS_BASE, screenshotUrl } from "@/lib/projects";
import type { Discipline } from "@/lib/cinematic-copy";
import mark from "@/assets/elevate-mark-transparent.png.asset.json";

const SHOTS: Record<string, string> = {
  web: screenshotUrl("https://biodentclinic.cz", 1400, 900),
  commerce: screenshotUrl("https://exclusivebeauty.cz", 1400, 900),
  apps: screenshotUrl("https://wrestlinggympraha.cz", 1400, 900),
  product: screenshotUrl("https://inhomepraha.cz", 1400, 900),
  brand: screenshotUrl("https://euromotors.cz", 1400, 900),
};

/**
 * The UI that lives inside the laptop screen and later fills the viewport.
 * Visual-first: a large live preview, a thin discipline rail, minimal metadata.
 */
export function ScreenInterface({
  disciplines,
  active,
  onSelect,
  label,
  compact = false,
}: {
  disciplines: Discipline[];
  active: number;
  onSelect?: (i: number) => void;
  label: string;
  compact?: boolean;
}) {
  const current = disciplines[active] ?? disciplines[0];
  const project = PROJECTS_BASE[active] ?? PROJECTS_BASE[0];

  return (
    <div className="flex h-full w-full flex-col bg-[oklch(0.16_0.02_250)] text-foreground">
      {/* top bar */}
      <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-3 py-2 md:px-5 md:py-3">
        <div className="flex items-center gap-2">
          <img src={mark.url} alt="" className="h-3.5 w-auto md:h-4" />
          <span className="text-[8px] uppercase tracking-[0.34em] text-muted-foreground md:text-[9px]">
            {label}
          </span>
        </div>
        <span className="font-mono text-[8px] text-muted-foreground md:text-[9px]">{project.domain}</span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* discipline rail */}
        <div className="hidden w-[26%] shrink-0 flex-col justify-center gap-1 border-r border-white/[0.06] px-4 md:flex">
          {disciplines.map((d, i) => (
            <button
              key={d.id}
              type="button"
              onMouseEnter={() => onSelect?.(i)}
              onFocus={() => onSelect?.(i)}
              onClick={() => onSelect?.(i)}
              className={`group flex items-baseline gap-2 rounded-md px-2 py-2 text-left transition-colors ${
                i === active ? "bg-white/[0.05]" : "hover:bg-white/[0.03]"
              }`}
            >
              <span
                className={`font-mono text-[9px] transition-colors ${
                  i === active ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {d.index}
              </span>
              <span
                className={`text-[11px] tracking-tight transition-colors md:text-[13px] ${
                  i === active ? "text-foreground" : "text-muted-foreground"
                }`}
              >
                {d.label}
              </span>
            </button>
          ))}
        </div>

        {/* preview */}
        <div className="relative min-h-0 flex-1 overflow-hidden">
          {disciplines.map((d, i) => (
            <img
              key={d.id}
              src={SHOTS[d.id]}
              alt={`${d.label} — ${project.name}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
              className={`absolute inset-0 h-full w-full object-cover object-top transition-all duration-700 ${
                i === active ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
              }`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.16_0.02_250)] via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-3 md:p-6">
            <div>
              <p className="text-[9px] uppercase tracking-[0.3em] text-primary md:text-[10px]">
                {current.index} / {current.label}
              </p>
              {!compact && (
                <p className="mt-1 max-w-sm text-[11px] text-muted-foreground md:text-sm">{current.note}</p>
              )}
            </div>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground md:block">
              {project.name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
