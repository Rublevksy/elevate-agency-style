/**
 * Where the visitor is, and where they can go back to. The scene-rail idea from
 * the homepage (a progress line that is also navigation): completed steps are
 * real buttons, the current one is marked `aria-current="step"`, steps not yet
 * reached are inert.
 */
export function StepRail({
  labels,
  current,
  reachable,
  onJump,
  stepOf,
}: {
  labels: readonly string[];
  current: number;
  /** Highest step index the visitor may jump to. */
  reachable: number;
  onJump: (i: number) => void;
  stepOf: (n: number, total: number) => string;
}) {
  const total = labels.length;
  const shown = Math.min(current, total - 1);
  return (
    <nav aria-label={stepOf(shown + 1, total)}>
      {/* Phone and tablet: a compact line of segments. */}
      <div className="lg:hidden">
        <p className="label-micro text-white/60">
          <span className="text-primary">{stepOf(shown + 1, total)}</span>
          <span className="mx-2 text-white/30">·</span>
          {labels[shown]}
        </p>
        <div
          className="mt-3 grid gap-1.5"
          style={{ gridTemplateColumns: `repeat(${total}, minmax(0, 1fr))` }}
          aria-hidden
        >
          {labels.map((l, i) => (
            <span
              key={l}
              className={`h-[3px] rounded-full ${i <= current ? "bg-primary" : "bg-white/12"}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop: labelled rail. */}
      <ol className="hidden grid-cols-6 gap-3 lg:grid">
        {labels.map((label, i) => {
          const done = i < current;
          const here = i === current;
          const canJump = i <= reachable && !here;
          const body = (
            <>
              <span
                aria-hidden
                className={`block h-[2px] w-full rounded-full transition-colors duration-500 ${
                  here ? "bg-primary" : done ? "bg-white/45" : "bg-white/10"
                }`}
              />
              <span className="mt-3 flex items-baseline gap-2">
                <span
                  className={`label-micro tabular-nums ${here ? "text-primary" : "text-white/40"}`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-sm ${here ? "text-white" : done ? "text-white/70" : "text-white/40"}`}
                >
                  {label}
                </span>
              </span>
            </>
          );
          return (
            <li key={label}>
              {canJump ? (
                <button
                  type="button"
                  onClick={() => onJump(i)}
                  className="block w-full rounded-sm pb-1 text-left transition-opacity hover:opacity-100 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0D13] focus-visible:outline-none"
                >
                  {body}
                </button>
              ) : (
                <div aria-current={here ? "step" : undefined} className="pb-1">
                  {body}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
