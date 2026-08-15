/**
 * One shared way to run a scroll/pointer driven animation frame loop.
 *
 * The loop only runs while the owning element is near the viewport and the tab
 * is visible, so off-screen cinematic sections cost nothing. Callers write
 * transforms / CSS variables inside the callback — never layout properties.
 */
export function startFrameLoop(cb: () => void, target?: Element | null) {
  let raf = 0;
  let visible = document.visibilityState !== "hidden";
  let onScreen = true;
  let running = false;

  const tick = () => {
    cb();
    raf = requestAnimationFrame(tick);
  };
  const sync = () => {
    const should = visible && onScreen;
    if (should === running) return;
    running = should;
    if (should) raf = requestAnimationFrame(tick);
    else cancelAnimationFrame(raf);
  };

  const onVis = () => {
    visible = document.visibilityState !== "hidden";
    sync();
  };
  document.addEventListener("visibilitychange", onVis);

  let io: IntersectionObserver | undefined;
  if (target) {
    onScreen = false;
    io = new IntersectionObserver(
      ([entry]) => {
        onScreen = !!entry?.isIntersecting;
        // paint one last frame so the section rests in a correct state
        if (!onScreen) cb();
        sync();
      },
      { rootMargin: "10% 0px" },
    );
    io.observe(target);
  }
  sync();

  return () => {
    cancelAnimationFrame(raf);
    running = false;
    io?.disconnect();
    document.removeEventListener("visibilitychange", onVis);
  };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
