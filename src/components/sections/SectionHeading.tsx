export function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="max-w-2xl mb-16">
      {eyebrow && (
        <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{eyebrow}</p>
      )}
      <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
