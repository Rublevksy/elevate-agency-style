import { useEffect, useState } from "react";

/** `(min-width: 1024px)` — the same breakpoint `useMotionCapability` uses to
 *  gate the hero's footage, and the same one Tailwind's `lg:` prefix means
 *  everywhere else in this codebase. Starts `false` (mirrors
 *  `useDetectedCapability`'s "quietest answer first" rule) and resolves after
 *  mount, since the server has no viewport. */
export function useIsDesktopRail(): boolean {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setIsDesktop(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return isDesktop;
}
