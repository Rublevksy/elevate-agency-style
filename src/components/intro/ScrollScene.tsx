import { useRef, type ReactNode } from "react";
import { useScroll, useSpring, type MotionValue } from "framer-motion";

/**
 * Long scroll container + pinned stage. Scroll position IS the timeline: the
 * animation never autoplays, stops when the user stops and reverses on scroll-up.
 */
export function ScrollScene({
  height = "h-[640vh] md:h-[760vh]",
  children,
}: {
  height?: string;
  children: (p: MotionValue<number>, raw: MotionValue<number>) => ReactNode;
}) {
  const wrap = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 130, damping: 32, mass: 0.32 });

  return (
    <div ref={wrap} className={`relative ${height}`}>
      <div className="sticky top-0 h-[100svh] overflow-hidden bg-[#030508]">
        {children(p, scrollYProgress)}
      </div>
    </div>
  );
}
