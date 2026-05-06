import { Instagram, ExternalLink, Image as ImageIcon } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

const TITLE: Record<Lang, string> = {
  CZ: "Sledujte náš Instagram",
  EN: "Follow our Instagram",
  RU: "Мы в Instagram",
  UA: "Ми в Instagram",
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
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-4">
            Instagram
          </p>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-2">
            {TITLE[lang]}
          </h2>
          <p className="text-sm text-muted-foreground">@elevateit.cz</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[0, 1, 2, 3].map((i) => (
            // TODO: replace placeholder with real Instagram post image
            <a
              key={i}
              href="https://www.instagram.com/elevateit.cz/"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden border border-border bg-surface transition-transform duration-300 hover:scale-[1.03]"
            >
              <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-surface via-background to-surface">
                <span className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground/30">
                  ELEVATE
                </span>
                <ImageIcon className="absolute bottom-3 right-3 h-4 w-4 text-muted-foreground/40" />
              </div>
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity grid place-items-center">
                <Instagram className="h-8 w-8 text-white" strokeWidth={1.6} />
              </div>
            </a>
          ))}
        </div>

        <div className="text-center mt-12">
          <a
            href="https://www.instagram.com/elevateit.cz/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline inline-flex"
          >
            {CTA[lang]}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
