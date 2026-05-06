import { Link } from "@tanstack/react-router";
import { Instagram, Mail, MapPin, Send } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";
import { Logo } from "@/components/Logo";

const IG_LABEL: Record<Lang, string> = {
  CZ: "Sledujte nás na Instagramu",
  EN: "Follow us on Instagram",
  RU: "Мы в Instagram",
  UA: "Ми в Instagram",
};
const TG_LABEL: Record<Lang, string> = {
  CZ: "Napište nám na Telegramu",
  EN: "Message us on Telegram",
  RU: "Напишите нам в Telegram",
  UA: "Напишіть нам у Telegram",
};

export function Footer() {
  const { t, lang } = useT();
  return (
    <footer className="border-t border-border bg-background relative overflow-hidden">
      <div className="container-luxe py-24 grid grid-cols-1 md:grid-cols-4 gap-14 relative">
        <div className="md:col-span-2">
          <Logo className="h-10 md:h-11 w-auto mb-6" alt="ELEVATE logo" />
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
          </ul>
          <div className="mt-5">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">{t.footer.follow}</p>
            <div className="flex items-center gap-2">
              <a
                href="https://www.instagram.com/elevateit.cz/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={IG_LABEL[lang]}
                className="grid place-items-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <Instagram className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </a>
              <a
                href="https://t.me/elevateit"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={TG_LABEL[lang]}
                className="grid place-items-center h-9 w-9 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                <Send className="h-[18px] w-[18px]" strokeWidth={1.6} />
              </a>
            </div>
          </div>
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
