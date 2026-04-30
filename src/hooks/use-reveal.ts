import { useEffect } from "react";

export function useReveal(key?: unknown) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    // Defer so newly-mounted route content is in the DOM before we observe it
    const id = window.requestAnimationFrame(() => {
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
        { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
      );
      els.forEach((el) => io.observe(el));
      // Safety net: anything still hidden after 1.2s gets revealed (avoids "empty section" bugs)
      const safety = window.setTimeout(() => {
        document
          .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
          .forEach((el) => el.classList.add("is-visible"));
      }, 1200);
      (window as unknown as { __revealCleanup?: () => void }).__revealCleanup = () => {
        io.disconnect();
        window.clearTimeout(safety);
      };
    });
    return () => {
      window.cancelAnimationFrame(id);
      const cleanup = (window as unknown as { __revealCleanup?: () => void }).__revealCleanup;
      if (cleanup) cleanup();
    };
  }, [key]);
}
