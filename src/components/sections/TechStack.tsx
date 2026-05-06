import { useT, type Lang } from "@/lib/i18n";

const TITLE: Record<Lang, string> = {
  CZ: "Používáme prověřené technologie",
  EN: "We use proven technologies",
  RU: "Мы используем проверенные технологии",
  UA: "Ми використовуємо перевірені технології",
};

const STACK = ["React", "Next.js", "Webflow", "Shopify", "Figma", "Framer"];

export function TechStack() {
  const { lang } = useT();
  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div className="container-luxe text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">{TITLE[lang]}</p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {STACK.map((s) => (
            <span key={s} className="text-base md:text-lg font-semibold text-muted-foreground/70 hover:text-foreground transition-colors">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
