import { Link } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";
import { Logo } from "./Logo";

const LANGS: Lang[] = ["CZ", "EN", "RU", "UA"];

const SERVICE_LINKS = [
  { slug: "web", labels: { CZ: "Webové stránky", EN: "Websites", RU: "Веб-сайты", UA: "Веб-сайти" } },
  { slug: "eshop", labels: { CZ: "E-shopy", EN: "E-commerce", RU: "Интернет-магазины", UA: "Інтернет-магазини" } },
  { slug: "branding", labels: { CZ: "Branding", EN: "Branding", RU: "Брендинг", UA: "Брендинг" } },
  { slug: "design", labels: { CZ: "Grafika", EN: "Design", RU: "Дизайн", UA: "Дизайн" } },
] as const;

const PRICING_LINKS = [
  { hash: "weby", labels: { CZ: "Weby", EN: "Websites", RU: "Сайты", UA: "Сайти" } },
  { hash: "eshopy", labels: { CZ: "E-shopy", EN: "E-commerce", RU: "Магазины", UA: "Магазини" } },
  { hash: "design", labels: { CZ: "Design", EN: "Design", RU: "Дизайн", UA: "Дизайн" } },
] as const;

export function Nav() {
  const { lang, setLang, t } = useT();

  const linkCls = "nav-link text-muted-foreground hover:text-foreground transition-colors";
  const activeCls = "is-active text-foreground";
  const triggerCls = `${linkCls} inline-flex items-center gap-1`;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container-luxe flex h-18 md:h-20 items-center justify-between py-3">
        <Link
          to="/"
          className="flex items-center gap-2 transition-opacity hover:opacity-80"
          aria-label="ELEVATE — domů"
        >
          <Logo className="h-9 md:h-10 w-auto" />
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
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
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
                    key={p.hash}
                    to="/pricing"
                    hash={p.hash}
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

        <div className="flex items-center gap-1 text-xs font-medium">
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
      </div>
    </header>
  );
}
