import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

export function TopProgressBar() {
  const status = useRouterState({ select: (s) => s.status });
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf: number | null = null;
    let timeout: ReturnType<typeof setTimeout> | null = null;

    if (status === "pending") {
      setVisible(true);
      setProgress(10);
      const tick = () => {
        setProgress((p) => (p < 85 ? p + (85 - p) * 0.06 : p));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    } else {
      setProgress(100);
      timeout = setTimeout(() => {
        setVisible(false);
        setProgress(0);
      }, 250);
    }
    return () => {
      if (raf) cancelAnimationFrame(raf);
      if (timeout) clearTimeout(timeout);
    };
  }, [status]);

  if (!visible) return null;
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-[2px] bg-transparent pointer-events-none">
      <div
        className="h-full bg-primary shadow-[0_0_10px_oklch(0.65_0.18_255/0.8)] transition-[width] duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
