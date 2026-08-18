import { useT, type Lang } from "@/lib/i18n";

const TITLE: Record<Lang, string> = {
  CZ: "Pracujeme s firmami z různých oborů",
  EN: "We work with businesses across industries",
  RU: "Работаем с компаниями из разных отраслей",
  UA: "Працюємо з компаніями різних галузей",
};

const ITEMS = ["E-commerce", "SaaS", "Real estate", "Healthcare", "B2B", "Retail"];

export function IndustryStrip() {
  const { lang } = useT();
  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div className="container-luxe text-center">
        <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-8">
          {TITLE[lang]}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
          {ITEMS.map((it) => (
            <span
              key={it}
              className="inline-flex items-center px-4 py-2 rounded-full border border-border bg-surface/40 text-[11px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors"
            >
              {it}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
