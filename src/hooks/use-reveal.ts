import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";

export function useReveal() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Defer to next frame so newly mounted route content is in the DOM
    const raf = requestAnimationFrame(() => {
      const els = document.querySelectorAll<HTMLElement>(".reveal:not(.is-visible)");
      if (!("IntersectionObserver" in window)) {
        els.forEach((el) => el.classList.add("is-visible"));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              io.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
      );
      els.forEach((el) => io.observe(el));

      // Safety net: if anything is still hidden after 600ms (e.g. above the fold
      // didn't trigger an intersection on this viewport), force-show it.
      const timeout = setTimeout(() => {
        document
          .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
          .forEach((el) => el.classList.add("is-visible"));
        io.disconnect();
      }, 600);

      (window as unknown as { __revealCleanup?: () => void }).__revealCleanup = () => {
        clearTimeout(timeout);
        io.disconnect();
      };
    });

    return () => {
      cancelAnimationFrame(raf);
      const w = window as unknown as { __revealCleanup?: () => void };
      w.__revealCleanup?.();
      w.__revealCleanup = undefined;
    };
  }, [pathname]);
}
