/**
 * ONE scroll engine for the whole homepage film.
 *
 * A single passive scroll/resize listener and a single rAF read per frame
 * update every registered section's normalised 0 → 1 progress. Components never
 * add their own scroll listeners — they read a ref inside their paint loop.
 * Sections far from the viewport are skipped, so their progress stays pinned at
 * the nearest end state and costs nothing.
 */
type Entry = { el: HTMLElement; ref: { current: number } };

const entries = new Set<Entry>();
let raf = 0;
let bound = false;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function read() {
  raf = 0;
  const vh = window.innerHeight;
  for (const e of entries) {
    const rect = e.el.getBoundingClientRect();
    // cheap cull: nothing to compute for sections nowhere near the viewport
    if (rect.bottom < -vh) {
      e.ref.current = 1;
      continue;
    }
    if (rect.top > vh * 2) {
      e.ref.current = 0;
      continue;
    }
    const total = e.el.offsetHeight - vh;
    e.ref.current = total > 0 ? clamp01(-rect.top / total) : 0;
  }
}

function schedule() {
  if (!raf) raf = requestAnimationFrame(read);
}

function bind() {
  if (bound) return;
  bound = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
}

export function registerSection(el: HTMLElement, ref: { current: number }) {
  bind();
  const entry: Entry = { el, ref };
  entries.add(entry);
  read();
  return () => {
    entries.delete(entry);
  };
}
