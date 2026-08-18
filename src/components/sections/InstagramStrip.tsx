import { Instagram, ExternalLink } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

const TITLE: Record<Lang, string> = {
  CZ: "Sledujte náš Instagram",
  EN: "Follow us on Instagram",
  RU: "Подписывайтесь на Instagram",
  UA: "Стежте за нами в Instagram",
};
const CTA: Record<Lang, string> = {
  CZ: "Otevřít Instagram",
  EN: "Open Instagram",
  RU: "Открыть Instagram",
  UA: "Відкрити Instagram",
};

export function InstagramStrip() {
  const { lang } = useT();
  return (
    <section className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-14 md:p-20 text-center max-w-3xl mx-auto">
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-primary/15 blur-[140px]" />
          <div className="relative">
            <Instagram className="h-8 w-8 text-primary mx-auto mb-6" strokeWidth={1.6} />
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-3">
              {TITLE[lang]}
            </h2>
            <p className="text-sm text-muted-foreground mb-10">@elevateit.cz</p>
            <a
              href="https://www.instagram.com/elevateit.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              <Instagram className="h-4 w-4" strokeWidth={1.8} />
              {CTA[lang]}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
