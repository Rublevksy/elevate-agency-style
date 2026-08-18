import { useEffect } from "react";
import { Events } from "@/lib/analytics";

const MARKS = [25, 50, 75, 100] as const;

/** Fires scroll_depth events at 25/50/75/100% once per page load. */
export function useScrollDepth() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const fired = new Set<number>();
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop + window.innerHeight;
      const total = h.scrollHeight;
      if (total <= window.innerHeight) return;
      const pct = Math.min(100, Math.round((scrolled / total) * 100));
      for (const m of MARKS) {
        if (pct >= m && !fired.has(m)) {
          fired.add(m);
          Events.scrollDepth(m);
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
}
