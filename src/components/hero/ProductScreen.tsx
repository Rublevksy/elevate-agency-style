/**
 * PRODUCT SCREEN — the interfaces that rise out of the laptop display.
 *
 * Plain DOM: three flat panels built from design tokens, no images, no filters,
 * no animation loop. The pinned hero stage drives their reveal through CSS
 * variables, so every panel is one cheap composited transform.
 */

const PANELS = [
  {
    tag: "Weby",
    metric: "1.2 s",
    label: "Rychlost načtení",
    rows: [72, 46, 88],
  },
  {
    tag: "E-shopy",
    metric: "+38 %",
    label: "Konverze",
    rows: [58, 92, 40],
  },
  {
    tag: "Aplikace",
    metric: "24/7",
    label: "Provoz",
    rows: [84, 62, 51],
  },
];

export function ProductScreen() {
  return (
    <div
      aria-hidden
      className="absolute inset-0 flex items-center justify-center"
      style={{ opacity: "var(--film-reveal, 0)" }}
    >
      <div className="flex w-full max-w-[540px] gap-3 px-4">
        {PANELS.map((panel, index) => (
          <div
            key={panel.tag}
            className="flex-1 rounded-lg border border-border bg-surface/80 p-3"
            style={{
              transform: `translate3d(0, calc(var(--film-reveal, 0) * ${-6 - index * 5}%), 0)`,
            }}
          >
            <p className="text-[7px] uppercase tracking-[0.28em] text-primary">{panel.tag}</p>
            <p className="mt-2 text-base font-medium tracking-[-0.02em] text-foreground">{panel.metric}</p>
            <p className="text-[7px] uppercase tracking-[0.2em] text-muted-foreground">{panel.label}</p>
            <div className="mt-3 space-y-1.5">
              {panel.rows.map((row, rowIndex) => (
                <span
                  key={row}
                  className={`block h-[3px] rounded-full ${rowIndex === 0 ? "bg-primary" : "bg-border"}`}
                  style={{ width: `${row}%` }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
