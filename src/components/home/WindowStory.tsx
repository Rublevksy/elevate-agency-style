/**
 * THE WINDOW, for the stacked renderings — phones, tablets, laptops below xl,
 * and every width under prefers-reduced-motion.
 *
 * The first stacked build gave every item its own window. At 1024 and 390 that
 * put the bottom of one window and the top of the next in the same viewport —
 * two or three browsers competing, where the pinned desktop act shows one.
 * This is the same idea without a pinned act: ONE window holds still (CSS
 * `position: sticky`, never a scroll listener, so a phone's scroll is never
 * taken over), the copy scrolls past it, and the window navigates when an item
 * reaches the middle of the viewport — the same grammar as `window-nav.tsx`:
 * the address cuts, the load bar runs, the next page rises over the last one.
 * Scrolling back reverses it.
 *
 *   below md   the window sticks under the header; each item's copy scrolls
 *              up beneath it and is faded out where it passes under
 *   md and up  two columns; the window stands centred in its column
 *
 * Each page's `open` clock plays once, the first time its item becomes active
 * (the same beats the pinned act scrubs). Under reduced motion there is no
 * travel and no clock: pages cut and are drawn resolved.
 */
import { useEffect, useRef, useState } from "react";
import { animate, motion, useMotionValue, type MotionValue } from "framer-motion";
import { EASE, useReducedScene } from "@/components/cinematic";
import { BrowserWindow } from "./BrowserWindow";

/** One navigation, in seconds. */
const TRAVEL = 0.6;
/** How long a page takes to play its beats once it is first shown. */
const SCENE_SECONDS = 3.4;

type Role = "active" | "leaving" | "idle";

export function WindowStory({
  count,
  label,
  address,
  page,
  companion,
  copy,
  screenClass = "bg-[#0b0f18]",
}: {
  count: number;
  /** Accessible name of the list of items. */
  label: string;
  address: (i: number) => string;
  /** The page shown in the window for item `i`. Depicted UI — rendered aria-hidden. */
  page: (i: number, open: MotionValue<number>) => React.ReactNode;
  /** An optional second, smaller surface (the same site at phone width). */
  companion?: (i: number) => React.ReactNode;
  copy: (i: number) => React.ReactNode;
  screenClass?: string;
}) {
  const reduced = useReducedScene();
  const [{ active, prev }, setNav] = useState<{ active: number; prev: number | null }>({
    active: 0,
    prev: null,
  });
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const root = useRef<HTMLDivElement>(null);
  // The window is on screen only while the story is: it appears once the list
  // has reached the middle of the viewport, and goes while the last item is
  // still being read — before the next section's own window (the builder's)
  // can come up from below. Without this the edge of the hero's or the
  // builder's window shared the screen with this one at the seams.
  const [engaged, setEngaged] = useState(false);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const end = window.matchMedia("(min-width: 768px)").matches ? 80 : 75;
    let started = false;
    let ending = false;
    const sync = () => setEngaged(started && !ending);
    // Root top above 55% of the viewport (and not scrolled entirely past).
    const start = new IntersectionObserver(
      ([e]) => {
        started = e.isIntersecting;
        sync();
      },
      { rootMargin: "0px 0px -45% 0px" },
    );
    // Root bottom still below the end line.
    const finish = new IntersectionObserver(
      ([e]) => {
        ending = !e.isIntersecting;
        sync();
      },
      { rootMargin: `-${end}% 0px 0px 0px` },
    );
    start.observe(el);
    finish.observe(el);
    return () => {
      start.disconnect();
      finish.disconnect();
    };
  }, []);

  // The item crossing the reading line is the one the window shows: the middle
  // of the viewport in two columns, a little lower under a sticky phone window
  // so an item's heading is in view below the window when its page arrives.
  // Items are contiguous, so one of them always covers that line.
  useEffect(() => {
    const line = window.matchMedia("(min-width: 768px)").matches ? 50 : 60;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = items.current.indexOf(e.target as HTMLLIElement);
          if (i < 0) continue;
          setNav((nav) => (nav.active === i ? nav : { active: i, prev: nav.active }));
        }
      },
      { rootMargin: `-${line}% 0px -${99 - line}% 0px` },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [count]);

  const dir = prev === null ? 0 : active > prev ? 1 : -1;
  const role = (i: number): Role => (i === active ? "active" : i === prev ? "leaving" : "idle");

  return (
    <div
      ref={root}
      className="relative grid grid-cols-1 md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-10 lg:gap-16"
    >
      {/* The window. Sticky itself below md, sticky inside a full-height column above. */}
      <div
        aria-hidden
        data-engaged={engaged}
        className="sticky top-20 z-10 -mx-6 bg-[#0A0D13] px-6 pt-3 pb-6 transition-opacity duration-700 data-[engaged=false]:pointer-events-none data-[engaged=false]:opacity-0 motion-reduce:transition-none after:pointer-events-none after:absolute after:inset-x-0 after:top-full after:h-10 after:bg-gradient-to-b after:from-[#0A0D13] after:to-transparent md:static md:order-2 md:mx-0 md:bg-transparent md:p-0 md:after:hidden"
      >
        <div
          data-engaged={engaged}
          className="transition-[translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] data-[engaged=false]:translate-y-6 motion-reduce:transition-none md:sticky md:top-24 md:flex md:h-[calc(100svh-6rem)] md:items-center"
        >
          <div className={`relative w-full ${companion ? "md:pr-[6%] md:pb-[8%]" : ""}`}>
            <BrowserWindow compact address={address(active)}>
              <div className={`relative aspect-[16/10] overflow-hidden ${screenClass}`}>
                {Array.from({ length: count }, (_, i) => (
                  <StoryLayer
                    key={i}
                    role={role(i)}
                    dir={dir}
                    reduced={reduced}
                    play={engaged}
                    render={(open) => page(i, open)}
                  />
                ))}
                {!reduced && prev !== null && (
                  <motion.span
                    key={`bar-${active}`}
                    initial={{ scaleX: 0, opacity: 1 }}
                    animate={{ scaleX: 1, opacity: 0 }}
                    transition={{
                      scaleX: { duration: TRAVEL + 0.15, ease: EASE },
                      opacity: { duration: 0.3, delay: TRAVEL + 0.15 },
                    }}
                    className="absolute inset-x-0 top-0 z-30 block h-[2px] origin-left bg-primary"
                  />
                )}
              </div>
            </BrowserWindow>
            {companion && (
              <div className="absolute right-0 bottom-0 hidden aspect-[1/2] w-[20%] overflow-hidden rounded-[0.9rem] border-4 border-[#05070c] bg-white shadow-[0_24px_60px_-18px_oklch(0_0_0/0.95)] md:block">
                {Array.from({ length: count }, (_, i) => (
                  <StoryLayer
                    key={i}
                    role={role(i)}
                    dir={dir}
                    reduced={reduced}
                    play={false}
                    render={() => companion(i)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <ol aria-label={label} className="md:order-1">
        {Array.from({ length: count }, (_, i) => (
          <li
            key={i}
            ref={(el) => {
              items.current[i] = el;
            }}
            className="flex flex-col pt-10 pb-20 md:min-h-[calc(100svh-6rem)] md:justify-center md:py-16"
          >
            {copy(i)}
          </li>
        ))}
      </ol>
    </div>
  );
}

/**
 * One page in the window. Forward: it rises over the page before it, which
 * falls back into shadow. Back: the page above slides away and this one comes
 * up out of the shadow. Only the two pages in a navigation are ever drawn.
 */
function StoryLayer({
  role,
  dir,
  reduced,
  play,
  render,
}: {
  role: Role;
  dir: number;
  reduced: boolean;
  /** Whether the story is on screen — a page's clock waits for the visitor. */
  play: boolean;
  render: (open: MotionValue<number>) => React.ReactNode;
}) {
  const y = useMotionValue(role === "active" ? "0%" : "100%");
  const shade = useMotionValue(0);
  const open = useMotionValue(0);
  const played = useRef(false);

  useEffect(() => {
    const runs: { stop: () => void }[] = [];
    const go = (mv: MotionValue<string> | MotionValue<number>, to: string | number) =>
      runs.push(animate(mv as MotionValue<number>, to as number, { duration: TRAVEL, ease: EASE }));

    if (reduced || dir === 0) {
      y.set(role === "active" ? "0%" : "100%");
      shade.set(0);
    } else if (role === "active" && dir > 0) {
      y.set("100%");
      shade.set(0);
      go(y, "0%");
    } else if (role === "active") {
      y.set("0%");
      shade.set(0.55);
      go(shade, 0);
    } else if (role === "leaving" && dir > 0) {
      y.set("0%");
      go(shade, 0.55);
    } else if (role === "leaving") {
      shade.set(0);
      go(y, "100%");
    }

    return () => runs.forEach((r) => r.stop());
  }, [role, dir, reduced, y, shade]);

  // The page's clock is not part of a navigation: scrolling on before it has
  // finished must not leave it half-played, so only unmounting stops it.
  const clock = useRef<{ stop: () => void } | null>(null);
  useEffect(() => {
    if (reduced) {
      clock.current?.stop();
      open.set(1);
    } else if (role === "active" && play && !played.current) {
      played.current = true;
      clock.current = animate(open, 1, { duration: SCENE_SECONDS, ease: EASE, delay: 0.3 });
    }
  }, [role, play, reduced, open]);
  useEffect(() => () => clock.current?.stop(), []);

  const z = role === "active" ? (dir < 0 ? 1 : 2) : role === "leaving" ? (dir < 0 ? 2 : 1) : 0;
  return (
    <div
      className="absolute inset-0"
      style={{ zIndex: z, visibility: role === "idle" ? "hidden" : "visible" }}
    >
      <motion.div style={{ opacity: shade }} className="absolute inset-0 z-[1] bg-[#05070c]" />
      <motion.div style={{ y }} className="absolute inset-0">
        <div className="pointer-events-none absolute inset-x-0 -top-[12%] h-[12%] bg-gradient-to-t from-[#05070c]/45 to-transparent" />
        {render(open)}
      </motion.div>
    </div>
  );
}

export default WindowStory;
