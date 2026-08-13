import { useEffect, useRef, useState } from "react";

type Props = {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  className?: string;
};

export function Counter({ end, suffix = "", prefix = "", duration = 1500, className }: Props) {
  const [val, setVal] = useState(end);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVal(end);
      return;
    }

    const run = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setVal(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(tick);
        else setVal(end);
      };
      requestAnimationFrame(tick);
    };

    // start from zero only once we know the number is about to be watched —
    // and never leave a stale 0 on screen if the observer never fires
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            setVal(0);
            run();
            io.disconnect();
          }
        });
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

