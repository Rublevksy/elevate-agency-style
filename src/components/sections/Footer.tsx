import { Instagram, Mail, MapPin } from "lucide-react";
import { useT } from "@/lib/i18n";

export function Footer() {
  const { t } = useT();
  const scroll = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer className="border-t border-border bg-background">
      <div className="container-luxe py-20 grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-2">
          <p className="text-lg font-extrabold tracking-[0.2em] text-foreground mb-3">ELEVATE</p>
          <p className="text-sm text-muted-foreground max-w-xs">{t.hero.subtitle}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.footer.nav}</p>
          <ul className="space-y-2 text-sm">
            <li><button onClick={() => scroll("services")} className="text-foreground hover:text-primary transition-colors">{t.nav.services}</button></li>
            <li><button onClick={() => scroll("portfolio")} className="text-foreground hover:text-primary transition-colors">{t.nav.work}</button></li>
            <li><button onClick={() => scroll("pricing")} className="text-foreground hover:text-primary transition-colors">{t.nav.pricing}</button></li>
            <li><button onClick={() => scroll("contact")} className="text-foreground hover:text-primary transition-colors">{t.nav.contact}</button></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">{t.footer.contact}</p>
          <ul className="space-y-3 text-sm text-foreground">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary" strokeWidth={1.5} /> hello@elevate.studio</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} /> Praha, CZ</li>
            <li>
              <a href="#" className="inline-flex items-center gap-2 hover:text-primary transition-colors">
                <Instagram className="h-4 w-4 text-primary" strokeWidth={1.5} /> @elevate.studio
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="container-luxe py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ELEVATE. {t.footer.rights}</p>
          <p>Made with care.</p>
        </div>
      </div>
    </footer>
  );
}
