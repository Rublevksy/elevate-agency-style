import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronDown, Menu, X } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";
import { Logo } from "./Logo";

const LANGS: Lang[] = ["CZ", "EN", "RU", "UA"];

const SERVICE_LINKS = [
  { to: "/services/web", labels: { CZ: "Webové stránky", EN: "Websites", RU: "Веб-сайты", UA: "Веб-сайти" } },
  { to: "/services/eshop", labels: { CZ: "E-shopy", EN: "E-commerce", RU: "Интернет-магазины", UA: "Інтернет-магазини" } },
  { to: "/services/branding", labels: { CZ: "Branding", EN: "Branding", RU: "Брендинг", UA: "Брендинг" } },
  { to: "/services/design", labels: { CZ: "Grafika", EN: "Design", RU: "Дизайн", UA: "Дизайн" } },
] as const;

const PRICING_LINKS = [
  { to: "/pricing/web", labels: { CZ: "Weby", EN: "Websites", RU: "Сайты", UA: "Сайти" } },
  { to: "/pricing/eshop", labels: { CZ: "E-shopy", EN: "E-commerce", RU: "Магазины", UA: "Магазини" } },
  { to: "/pricing/branding", labels: { CZ: "Branding", EN: "Branding", RU: "Брендинг", UA: "Брендинг" } },
] as const;

export function Nav() {
  const { lang, setLang, t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [mobileOpen]);

  const linkCls = "nav-link text-muted-foreground hover:text-foreground transition-colors";
  const activeCls = "is-active text-foreground";
  const triggerCls = `${linkCls} inline-flex items-center gap-1`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? "backdrop-blur-2xl bg-background/85 border-border shadow-[0_8px_30px_-12px_oklch(0_0_0/0.6)]"
          : "backdrop-blur-xl bg-background/60 border-transparent"
      }`}
    >
      <div className="container-luxe flex h-20 md:h-24 items-center justify-between py-3">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="ELEVATE — domů"
        >
          <Logo className="h-9 md:h-11 w-auto" />
        </Link>

        <nav className="hidden md:flex items-center gap-9 text-sm">
          <Link to="/" className={linkCls} activeProps={{ className: activeCls }} activeOptions={{ exact: true }}>
            {t.nav.home}
          </Link>

          {/* Services dropdown */}
          <div className="nav-item relative">
            <Link to="/services" className={triggerCls} activeProps={{ className: activeCls }}>
              {t.nav.services}
              <ChevronDown className="h-3.5 w-3.5 opacity-70 group-hover:rotate-180 transition-transform" />
            </Link>
            <div className="nav-dropdown absolute left-1/2 -translate-x-1/2 top-full pt-3">
              <div
                className="min-w-[220px] rounded-xl border border-border bg-popover/95 backdrop-blur-xl p-2 shadow-2xl"
                style={{ boxShadow: "0 30px 60px -20px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.65 0.18 255 / 0.08) inset" }}
              >
                {SERVICE_LINKS.map((s) => (
                  <Link
                    key={s.to}
                    to={s.to}
                    className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                  >
                    {s.labels[lang]}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link to="/projects" className={linkCls} activeProps={{ className: activeCls }}>
            {t.nav.work}
          </Link>

          {/* Pricing dropdown */}
          <div className="nav-item relative">
            <Link to="/pricing" className={triggerCls} activeProps={{ className: activeCls }}>
              {t.nav.pricing}
              <ChevronDown className="h-3.5 w-3.5 opacity-70" />
            </Link>
            <div className="nav-dropdown absolute left-1/2 -translate-x-1/2 top-full pt-3">
              <div
                className="min-w-[200px] rounded-xl border border-border bg-popover/95 backdrop-blur-xl p-2 shadow-2xl"
                style={{ boxShadow: "0 30px 60px -20px oklch(0 0 0 / 0.6), 0 0 0 1px oklch(0.65 0.18 255 / 0.08) inset" }}
              >
                {PRICING_LINKS.map((p) => (
                  <Link
                    key={p.to}
                    to={p.to}
                    className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors"
                  >
                    {p.labels[lang]}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link to="/about" className={linkCls} activeProps={{ className: activeCls }}>
            {t.nav.about}
          </Link>
          <Link to="/contact" className={linkCls} activeProps={{ className: activeCls }}>
            {t.nav.contact}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 text-xs font-medium">
            {LANGS.map((l, i) => (
              <div key={l} className="flex items-center">
                <button
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 transition-colors ${
                    lang === l ? "text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {l}
                </button>
                {i < LANGS.length - 1 && <span className="text-border">|</span>}
              </div>
            ))}
          </div>

          {/* Hamburger button — mobile only */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Otevřít menu"
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-border/60 bg-background/40 backdrop-blur-md text-foreground hover:bg-accent/60 transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile slide-in menu */}
      <div
        className={`md:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Backdrop — dark, lightly blurred so content stays visible */}
        <div
          onClick={() => setMobileOpen(false)}
          className={`absolute inset-0 bg-black/50 backdrop-blur-[3px] transition-opacity duration-300 ${
            mobileOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Slide-in panel — ~78% width, capped */}
        <div
          className={`absolute right-0 top-0 h-full w-[78%] max-w-[320px] bg-background/95 backdrop-blur-xl border-l border-border flex flex-col transform transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            mobileOpen ? "translate-x-0" : "translate-x-full"
          }`}
          style={{ boxShadow: "-20px 0 60px -20px oklch(0 0 0 / 0.6)" }}
        >
          {/* Header with close */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-border/50">
            <Logo className="h-7 w-auto" />
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Zavřít menu"
              className="inline-flex items-center justify-center h-10 w-10 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/60 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Links */}
          <nav className="flex-1 overflow-y-auto px-5 py-6 flex flex-col gap-1">
            {[
              { to: "/services", label: t.nav.services },
              { to: "/projects", label: t.nav.work },
              { to: "/pricing", label: t.nav.pricing },
              { to: "/about", label: t.nav.about },
              { to: "/contact", label: t.nav.contact },
            ].map((item, idx) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="group flex items-center justify-between py-3.5 px-2 rounded-lg text-base text-foreground/90 hover:text-primary hover:bg-accent/40 transition-colors"
                style={{
                  animation: mobileOpen ? `fade-in 0.4s ease-out ${idx * 50}ms both` : undefined,
                }}
                activeProps={{ className: "is-active text-primary" }}
              >
                <span className="font-medium tracking-tight">{item.label}</span>
                <ChevronDown className="h-4 w-4 -rotate-90 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}

            {/* Language switch */}
            <div className="mt-6 flex items-center justify-center gap-1 text-xs font-medium">
              {LANGS.map((l, i) => (
                <div key={l} className="flex items-center">
                  <button
                    onClick={() => setLang(l)}
                    className={`px-3 py-1.5 transition-colors ${
                      lang === l ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {l}
                  </button>
                  {i < LANGS.length - 1 && <span className="text-border">|</span>}
                </div>
              ))}
            </div>
          </nav>

          {/* Pinned CTA */}
          <div className="px-5 py-4 border-t border-border/50 pb-[max(env(safe-area-inset-bottom),16px)]">
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center"
            >
              🚀 Získat nabídku
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
