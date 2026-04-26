import { useT } from "@/lib/i18n";

export function TrustBar() {
  const { t } = useT();
  const items = [t.trust.years, t.trust.projects, t.trust.clients];
  return (
    <section className="border-y border-border bg-surface/30">
      <div className="container-luxe grid grid-cols-1 md:grid-cols-3 gap-8 py-10">
        {items.map((item) => (
          <div key={item} className="text-center md:text-left">
            <p className="text-sm uppercase tracking-widest text-muted-foreground">{item}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
