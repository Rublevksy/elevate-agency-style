import { useT } from "@/lib/i18n";

export function TrustBar() {
  const { t } = useT();
  const items = [t.trust.years, t.trust.projects, t.trust.response ?? "Odpověď do 24 hodin"];
  return (
    <section className="border-y border-border bg-surface/40">
      <div className="container-luxe grid grid-cols-1 md:grid-cols-3 gap-px md:gap-0 py-2">
        {items.map((item, i) => (
          <div
            key={item}
            className={`py-8 md:py-10 text-center md:text-left flex items-center justify-center md:justify-start gap-3 ${
              i > 0 ? "md:border-l md:border-border md:pl-10" : ""
            }`}
          >
            <span className="h-1 w-6 bg-primary" />
            <p className="text-xs md:text-sm uppercase tracking-[0.25em] text-foreground font-medium">
              {item}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
