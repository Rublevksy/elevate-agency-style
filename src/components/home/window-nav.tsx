/**
 * How THE WINDOW navigates, on a scroll clock — shared by every act that
 * drives it (the hero's services phase, the cases).
 *
 * A navigation is: the address changes (a hard cut — address bars do not
 * dissolve), the load bar runs, and the new page arrives the way the visitor is
 * already moving — it rises from under the fold over the old one, which falls
 * back into shadow beneath it. It is never a cross-fade between two pictures,
 * and the window is never blank or half-painted: at every scroll position both
 * layers are complete pages. (The first build blanked to white and painted
 * top-down like a literal browser; the review read that as a page that had
 * failed to load.) Every value is a `useTransform` of the act's progress, so
 * scrolling back up un-navigates exactly (R21).
 */
import { cubicBezier, motion, useTransform, type MotionValue } from "framer-motion";
import { EASE } from "@/components/cinematic";

const EDGE = 0.0004;
const settle = cubicBezier(...EASE);

/**
 * One page arriving in the window, stacked above the previous page.
 * `swap` is when the address changes; the page travels from `swap` to `painted`.
 */
export function NavLayer({
  p,
  swap,
  painted,
  children,
}: {
  p: MotionValue<number>;
  swap: number;
  painted: number;
  children: React.ReactNode;
}) {
  const y = useTransform(p, [swap, painted], ["100%", "0%"], { ease: settle });
  // The page underneath recedes as the new one covers it.
  const shade = useTransform(p, [swap, painted], [0, 0.55], { ease: settle });
  // A page the window has not reached is kept out of the compositor entirely.
  const visibility = useTransform(p, (v) => (v >= swap - EDGE ? "visible" : "hidden"));
  return (
    <motion.div style={{ visibility }} className="absolute inset-0">
      <motion.div
        aria-hidden
        style={{ opacity: shade }}
        className="absolute inset-0 bg-[#05070c]"
      />
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform">
        {/* The leading edge casts a contact shadow onto the page below; at rest
            it sits above the window's top edge, clipped away. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-[12%] h-[12%] bg-gradient-to-t from-[#05070c]/45 to-transparent"
        />
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
