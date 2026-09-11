/**
 * THE WINDOW — the one object the homepage is built around.
 *
 * ELEVATE builds websites, so the page's recurring object is a real browser
 * window: in the hero it shows the studio's actual client sites; as the visitor
 * scrolls it navigates — address, load bar, the next page painting in — through
 * the five services; the cases hand it to each client site in turn; the builder
 * sketches the visitor's own project in it; the closing frame leaves it standing
 * empty in the portal. Transitions between states are web grammar (navigate,
 * load, scroll, resize), never film dissolves.
 *
 * Rules carried over from the prototype gate (docs/creative-rebuild/PROTO_GATE.md):
 *  - Opaque chrome. Glass over a lit plate measured 2.55:1 on the address text.
 *  - Neutral, dim, inert dots. One accent colour on the page; and DOM dots that
 *    look clickable and do nothing are a broken promise.
 *  - The address shows a real domain or a real route, never an invented URL.
 *  - Everything in the chrome is `aria-hidden` depiction except where a caller
 *    passes real, readable content — the page's own headings carry the meaning.
 */
import { Lock } from "lucide-react";

export function BrowserWindow({
  address,
  tab,
  children,
  className,
  compact = false,
}: {
  /** A node, not a string: the address changes while the window navigates. */
  address: React.ReactNode;
  /** The page's own title, as a tab. Omitted in `compact`, where it would not fit. */
  tab?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  /** Phone-width cut: one chrome row, smaller type. */
  compact?: boolean;
}) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-white/12 bg-[#0b0f18] shadow-[0_50px_140px_-50px_oklch(0_0_0/0.9),0_0_0_1px_oklch(1_0_0/0.03)] ${className ?? ""}`}
    >
      <div aria-hidden className="select-none bg-[#0f1420]">
        {tab && !compact && (
          <div className="flex h-8 items-end gap-2 px-3 pt-1.5">
            <span className="mb-2.5 flex gap-1.5 pr-2">
              <span className="size-1.5 rounded-full bg-white/18" />
              <span className="size-1.5 rounded-full bg-white/18" />
              <span className="size-1.5 rounded-full bg-white/18" />
            </span>
            <span className="relative flex h-full w-[58%] min-w-0 items-center gap-2 rounded-t-lg bg-[#161c2b] px-3">
              <span className="size-2 shrink-0 rounded-[3px] bg-primary/80" />
              <span className="relative block h-3.5 min-w-0 flex-1 truncate text-[10.5px] leading-3.5 text-white/70">
                {tab}
              </span>
            </span>
          </div>
        )}
        <div
          className={`flex items-center gap-2 border-b border-white/8 ${
            tab && !compact ? "bg-[#161c2b] px-3 py-2" : "px-3.5 py-2.5"
          }`}
        >
          {(!tab || compact) && (
            <span className="flex gap-1.5 pr-1">
              <span className="size-1.5 rounded-full bg-white/18" />
              <span className="size-1.5 rounded-full bg-white/18" />
              <span className="size-1.5 rounded-full bg-white/18" />
            </span>
          )}
          <div
            className={`relative flex flex-1 items-center gap-2 rounded-full bg-black/45 ${
              compact ? "h-6 px-2.5" : "h-7 px-3"
            }`}
          >
            <Lock className="size-3 shrink-0 text-white/40" strokeWidth={2.2} />
            <span
              className={`relative block h-4 w-full truncate font-mono leading-4 tracking-wide text-white/80 ${
                compact ? "text-[10px]" : "text-[11.5px]"
              }`}
            >
              {address}
            </span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}

export default BrowserWindow;
