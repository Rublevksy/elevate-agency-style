import { Link } from "@tanstack/react-router";
import { LayoutTemplate, ShoppingCart, Smartphone, TrendingUp, PenTool } from "lucide-react";

export const HERO_SERVICES = [
  { n: "01", label: "Weby", to: "/services/web", Icon: LayoutTemplate, x: 8, y: 2 },
  { n: "02", label: "E-shopy", to: "/services/eshop", Icon: ShoppingCart, x: 0, y: 20 },
  { n: "03", label: "Aplikace", to: "/services/web", Icon: Smartphone, x: 4, y: 38 },
  { n: "04", label: "SEO", to: "/services/branding", Icon: TrendingUp, x: 12, y: 56 },
  { n: "05", label: "Design", to: "/services/design", Icon: PenTool, x: 2, y: 74 },
] as const;

/**
 * The wireframe service panels of the reference: thin blue outlined windows
 * floating out of the device toward the right. Real links, real labels.
 */
export function ServicePanels() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[42%] lg:block">
      {HERO_SERVICES.map(({ n, label, to, Icon, x, y }, i) => (
        <Link
          key={n}
          to={to}
          aria-label={`${n} — ${label}`}
          className="pointer-events-auto group absolute w-[46%] max-w-[230px] transition-transform duration-500 hover:-translate-y-1"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            transform: `perspective(1200px) rotateY(-19deg) rotateX(${i % 2 ? 3 : -3}deg)`,
          }}
        >
          <div
            className="relative rounded-[10px] border px-4 py-4"
            style={{
              borderColor: "rgba(90,155,255,0.42)",
              background:
                "linear-gradient(140deg, rgba(20,58,140,0.22), rgba(6,14,32,0.12) 60%, rgba(6,14,32,0))",
              boxShadow:
                "0 0 34px -10px rgba(45,116,255,0.6), inset 0 0 24px -12px rgba(120,180,255,0.55)",
            }}
          >
            <p className="text-[9px] uppercase tracking-[0.34em] text-[#9cc4ff] transition-colors group-hover:text-white">
              {n} / {label}
            </p>
            <div className="mt-4 flex h-[64px] items-center justify-center">
              <Icon className="h-9 w-9 text-[#7fb2ff]" strokeWidth={1} />
            </div>
            <div className="mt-2 space-y-1.5">
              <span className="block h-px w-full bg-[#5a9bff]/25" />
              <span className="block h-px w-2/3 bg-[#5a9bff]/20" />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
