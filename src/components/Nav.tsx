import { Link } from "@tanstack/react-router";
import { useT, type Lang } from "@/lib/i18n";
import { Logo } from "./Logo";

const LANGS: Lang[] = ["CZ", "EN", "RU", "UA"];

export function Nav() {
  const { lang, setLang, t } = useT();

  const linkCls = "text-muted-foreground hover:text-foreground transition-colors";
  const activeCls = "text-foreground";

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
          <Link to="/services" className={linkCls} activeProps={{ className: activeCls }}>
            {t.nav.services}
          </Link>
          <Link to="/projects" className={linkCls} activeProps={{ className: activeCls }}>
            {t.nav.work}
          </Link>
          <Link to="/pricing" className={linkCls} activeProps={{ className: activeCls }}>
            {t.nav.pricing}
          </Link>
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
