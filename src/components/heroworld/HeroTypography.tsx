/**
 * HeroTypography — editorial, minimal. Three elements only: eyebrow, statement,
 * one supporting line. No paragraphs, no oversized SaaS type.
 */
export function HeroTypography() {
  return (
    <div className="w-full max-w-[26rem] md:max-w-[30rem]">
      <p className="cine-in mb-6 flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.4em] text-primary/70 md:mb-8">
        <span aria-hidden className="h-px w-9 bg-primary/40" />
        Digitální studio · Praha
      </p>

      <h1 className="text-[clamp(2rem,3.4vw,3rem)] font-light leading-[1.12] tracking-[-0.03em] text-foreground/92">
        <span className="cine-clip block">
          <span className="cine-clip-in block">Váš byznys.</span>
        </span>
        <span className="cine-clip block">
          <span className="cine-clip-in block" style={{ animationDelay: "0.3s" }}>
            Náš <span className="text-primary/90">digitální svět</span>.
          </span>
        </span>
      </h1>

      <div className="cine-in mt-8 flex items-start gap-4 md:mt-10" style={{ animationDelay: "0.6s" }}>
        <span aria-hidden className="mt-2 h-8 w-px shrink-0 bg-gradient-to-b from-primary/55 to-transparent" />
        <p className="max-w-sm text-[0.8rem] leading-[1.75] text-muted-foreground md:text-sm">
          Weby, e-shopy a digitální produkty navržené tak, aby přinášely výsledky.
        </p>
      </div>
    </div>
  );
}
