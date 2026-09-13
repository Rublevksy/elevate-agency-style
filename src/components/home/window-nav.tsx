/**
 * How THE WINDOW navigates, on a scroll clock — shared by every act that
 * drives it (the hero's services phase, the cases).
 *
 * A navigation is three things a real browser does, in order: the address
 * changes (a hard cut — address bars do not dissolve), the old page unloads to
 * a blank screen, and the new page paints top-down while a load bar runs. It is
 * never a cross-fade between two pictures. Every value is a `useTransform` of
 * the act's progress, so scrolling back up un-navigates exactly (R21).
 */
import { motion, useMotionTemplate, useTransform, type MotionValue } from "framer-motion";
import { SCREEN } from "./window-pages";

const EDGE = 0.0004;

/**
 * One page loading into the window, stacked above the previous page.
 * `swap` is when the address changes; the paint runs from `swap` to `painted`.
 */
export function NavLayer({
  p,
  swap,
  painted,
  blank: blankClass = SCREEN,
  children,
}: {
  p: MotionValue<number>;
  swap: number;
  painted: number;
  /** The screen the old page unloads to — the NEW page's own background, the
   *  way a browser blanks to white before a white site paints. */
  blank?: string;
  children: React.ReactNode;
}) {
  const blank = useTransform(p, [swap - EDGE, swap], [0, 1]);
  const reveal = useTransform(p, [swap, painted], [100, 0]);
  const clip = useMotionTemplate`inset(0 0 ${reveal}% 0)`;
  // A page the window has not reached is kept out of the compositor entirely.
  const visibility = useTransform(p, (v) => (v >= swap - EDGE ? "visible" : "hidden"));
  return (
    <motion.div style={{ visibility }} className="absolute inset-0">
      <motion.div
        aria-hidden
        style={{ opacity: blank }}
        className={`absolute inset-0 ${blankClass}`}
      />
      <motion.div style={{ clipPath: clip }} className="absolute inset-0">
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Text that is on from `from` to `to` and cuts, never fades (address, tab). */
export function CutText({
  p,
  from,
  to,
  className,
  children,
}: {
  p: MotionValue<number>;
  from: number;
  to: number;
  className?: string;
  children: React.ReactNode;
}) {
  // Ends one EDGE before `to`, where the next address begins — the two used to
  // share a 2*EDGE window and a paused scroll caught both addresses drawn at once.
  const opacity = useTransform(p, [from - EDGE, from, to - EDGE, to], [0, 1, 1, 0]);
  return (
    <motion.span style={{ opacity }} className={className}>
      {children}
    </motion.span>
  );
}

/**
 * One load bar for a whole act's navigations. `runs` are [start, end] pairs on
 * progress; the bar fills across each run and is invisible between them.
 */
export function useLoadBar(p: MotionValue<number>, runs: [number, number][], reduced: boolean) {
  const input: number[] = [];
  runs.forEach(([a, b]) => input.push(a - 0.001, a, b, b + 0.03));
  const scaleX = useTransform(
    p,
    input,
    input.map((_, k) => [0, 0.05, 1, 1][k % 4]),
  );
  const opacity = useTransform(
    p,
    input,
    input.map((_, k) => (reduced ? 0 : [0, 1, 1, 0][k % 4])),
  );
  return { scaleX, opacity };
}

/** The load bar element itself. */
export function LoadBar({ bar }: { bar: ReturnType<typeof useLoadBar> }) {
  return (
    <motion.span
      aria-hidden
      style={bar}
      className="absolute inset-x-0 top-0 z-30 block h-[2px] origin-left bg-primary shadow-[0_0_10px_oklch(0.65_0.18_255/0.8)]"
    />
  );
}
