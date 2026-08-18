import { Link } from "@tanstack/react-router";
import { Mail, MapPin } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Logo } from "@/components/Logo";
import { SocialIcons, CONTACT_PHONE, CONTACT_PHONE_HREF } from "@/components/Socials";

export function Footer() {
  const { t } = useT();
  return (
    <footer className="border-t border-border bg-background relative overflow-hidden">
      <div className="container-luxe py-24 grid grid-cols-1 md:grid-cols-4 gap-14 relative">
        <div className="md:col-span-2">
          <Logo className="h-10 md:h-11 w-auto mb-6" alt="ELEVATE logo" />
          <p className="text-sm text-muted-foreground max-w-xs leading-relaxed mb-8">{t.hero.subtitle}</p>
          <SocialIcons size="md" />
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
                href={CONTACT_PHONE_HREF}
                className="inline-flex items-center gap-2 hover:text-primary transition-colors story-link tabular-nums"
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary" />
                {CONTACT_PHONE}
              </a>
            </li>
            <li>
              <a
                href="mailto:elevateitcz@gmail.com"
                className="inline-flex items-center gap-2 hover:text-primary transition-colors story-link"
              >
                <Mail className="h-4 w-4 text-primary" strokeWidth={1.5} />
                <span>elevateitcz@gmail.com</span>
              </a>
            </li>
            <li className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" strokeWidth={1.5} />
              <span>Praha, CZ</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border relative">
        <div className="container-luxe py-6 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} ELEVATE. {t.footer.rights}</p>
        </div>
      </div>
    </footer>
  );
}
