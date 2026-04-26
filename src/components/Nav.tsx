import { useT, type Lang } from "@/lib/i18n";

const LANGS: Lang[] = ["CZ", "EN", "RU", "UA"];

export function Nav() {
  const { lang, setLang, t } = useT();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border">
      <div className="container-luxe flex h-16 items-center justify-between">
        <a href="#top" onClick={(e) => { e.preventDefault(); scrollTo("top"); }}
          className="text-lg font-extrabold tracking-[0.2em] text-foreground">
          ELEVATE
        </a>

        <nav className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <button onClick={() => scrollTo("services")} className="hover:text-foreground transition-colors">{t.nav.services}</button>
          <button onClick={() => scrollTo("portfolio")} className="hover:text-foreground transition-colors">{t.nav.work}</button>
          <button onClick={() => scrollTo("pricing")} className="hover:text-foreground transition-colors">{t.nav.pricing}</button>
          <button onClick={() => scrollTo("contact")} className="hover:text-foreground transition-colors">{t.nav.contact}</button>
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
