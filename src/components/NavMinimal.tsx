import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";
import { Logo } from "./Logo";

const LANGS: Lang[] = ["CZ", "EN", "RU", "UA"];

const LINKS = [
  { to: "/projects", label: "Projects" },
  { to: "/services", label: "Services" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

/**
 * Minimal premium navigation — thin, glassy, near-invisible until needed.
 */
export function NavMinimal() {
  const { lang, setLang } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const link =
    "text-[11px] uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/60 bg-background/70 backdrop-blur-2xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-5 md:h-20 md:px-10">
        <Link to="/" aria-label="ELEVATE" className="transition-opacity hover:opacity-70">
          <Logo className="h-6 w-auto md:h-7" />
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={link}
              activeProps={{ className: "text-foreground" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 sm:flex">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-[10px] tracking-[0.18em] transition-colors ${
                  lang === l ? "text-primary" : "text-muted-foreground/60 hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <Link
            to="/contact"
            className="hidden rounded-full border border-border px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-foreground transition-all hover:border-primary/60 hover:bg-primary/10 md:inline-flex"
          >
            Start project
          </Link>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Zavřít menu" : "Otevřít menu"}
            aria-expanded={open}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border/70 text-foreground transition-colors hover:border-primary/50 md:h-9 md:w-9"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Full menu overlay */}
      <div
        className={`fixed inset-0 top-16 md:top-20 z-40 bg-background/95 backdrop-blur-2xl transition-all duration-500 ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="mx-auto flex h-full max-w-[1400px] flex-col justify-center gap-2 px-8 md:px-10">
          {[...LINKS, { to: "/audit", label: "Audit" } as const].map((l, i) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="group flex items-baseline gap-4 py-2 text-[clamp(1.9rem,6vw,3.4rem)] font-semibold tracking-[-0.03em] text-foreground/80 transition-colors hover:text-primary"
              style={{ animation: open ? `fade-in 0.5s ease-out ${i * 60}ms both` : undefined }}
            >
              <span className="text-[10px] tracking-[0.3em] text-muted-foreground">
                0{i + 1}
              </span>
              {l.label}
            </Link>
          ))}
          <div className="mt-8 flex gap-4 sm:hidden">
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`text-xs tracking-[0.2em] ${
                  lang === l ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
