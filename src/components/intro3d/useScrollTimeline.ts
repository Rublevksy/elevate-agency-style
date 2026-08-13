import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export type ProgressRef = RefObject<number>;

/**
 * Scroll IS the timeline. A GSAP ScrollTrigger scrubs a proxy value between 0
 * and 1 over the length of the tall scroll container; nothing autoplays and
 * everything reverses when the user scrolls back up.
 */
export function useScrollTimeline(
  wrapper: RefObject<HTMLElement | null>,
  onTick?: (p: number) => void,
) {
  const progress = useRef(0);
  const cb = useRef(onTick);
  cb.current = onTick;

  useEffect(() => {
    const el = wrapper.current;
    if (!el) return;

    const proxy = { value: 0 };
    const tween = gsap.to(proxy, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.55,
        invalidateOnRefresh: true,
      },
    });

    const tick = () => {
      progress.current = proxy.value;
      cb.current?.(proxy.value);
    };
    gsap.ticker.add(tick);
    tick();

    return () => {
      gsap.ticker.remove(tick);
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [wrapper]);

  return progress;
}
