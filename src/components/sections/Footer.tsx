import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-border bg-background relative overflow-hidden">
      <div className="container-luxe py-24 grid grid-cols-1 md:grid-cols-4 gap-14 relative">
        <div className="md:col-span-2">
          <Logo className="h-14 w-auto mb-6" />
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">{t.hero.subtitle}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">{t.footer.nav}</p>
          <ul className="space-y-3 text-sm">
            <li><Link to="/services" className="text-foreground hover:text-primary transition-colors">{t.nav.services}</Link></li>
            <li><Link to="/projects" className="text-foreground hover:text-primary transition-colors">{t.nav.work}</Link></li>
            <li><Link to="/pricing" className="text-foreground hover:text-primary transition-colors">{t.nav.pricing}</Link></li>
            <li><Link to="/about" className="text-foreground hover:text-primary transition-colors">{t.nav.about}</Link></li>
            <li><Link to="/contact" className="text-foreground hover:text-primary transition-colors">{t.nav.contact}</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-5">{t.footer.contact}</p>
          <ul className="space-y-3 text-sm text-foreground">
            <li>
              <a
                href="mailto:developer@elevateit.cz"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors story-link"
              >
                <Mail className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span>developer@elevateit.cz</span>
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <span>Praha, CZ</span>
            </li>
            <li>
              <a
                href="https://instagram.com/elevate.itcz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors story-link"
              >
                <Instagram className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span>@elevate.itcz</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border relative">
        <div className="container-luxe py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ELEVATE. {t.footer.rights}</p>
          <p>Made with care.</p>
        </div>
      </div>
    </footer>
  );
}
