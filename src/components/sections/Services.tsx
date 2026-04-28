import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const SERVICE_ROUTES = ["/services/web", "/services/eshop", "/services/branding", "/services/design"] as const;

function PreviewFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative aspect-[4/3] rounded-lg border border-border bg-gradient-to-br from-surface/80 to-background/95 p-4 overflow-hidden shadow-[0_10px_40px_-15px_rgba(59,130,246,0.35)]">
      <div aria-hidden className="pointer-events-none absolute -top-16 -right-10 h-40 w-40 rounded-full bg-primary/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-10 h-40 w-40 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative h-full">{children}</div>
    </div>
  );
}

function WebPreview() {
  return (
    <PreviewFrame>
      <div className="rounded-md border border-border bg-background/90 overflow-hidden h-full flex flex-col">
        <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-surface/60">
          <span className="h-2 w-2 rounded-full bg-red-400/70" />
          <span className="h-2 w-2 rounded-full bg-yellow-400/70" />
          <span className="h-2 w-2 rounded-full bg-green-400/70" />
          <div className="ml-3 h-2 flex-1 rounded bg-foreground/10" />
        </div>
        <div className="p-3 space-y-2 flex-1">
          <div className="h-2.5 w-2/3 rounded bg-foreground/40" />
          <div className="h-2 w-1/2 rounded bg-foreground/15" />
          <div className="h-6 w-20 rounded bg-primary mt-2 shadow-[0_0_20px_rgba(59,130,246,0.5)]" />
          <div className="grid grid-cols-3 gap-1.5 mt-3">
            <div className="h-10 rounded bg-gradient-to-br from-primary/50 to-primary/10" />
            <div className="h-10 rounded bg-foreground/10" />
            <div className="h-10 rounded bg-gradient-to-br from-primary/30 to-transparent" />
          </div>
        </div>
      </div>
    </PreviewFrame>
  );
}

function EshopPreview() {
  return (
    <PreviewFrame>
      <div className="grid grid-cols-2 gap-2 h-full">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="rounded-md border border-border bg-surface/60 overflow-hidden flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-primary/40 via-primary/15 to-transparent relative">
              <div className="absolute top-1 right-1 text-[8px] font-mono text-primary-foreground bg-primary px-1 rounded">NEW</div>
            </div>
            <div className="p-1.5 space-y-1">
              <div className="h-1.5 w-3/4 rounded bg-foreground/25" />
              <div className="h-1.5 w-1/2 rounded bg-primary/70" />
            </div>
          </div>
        ))}
      </div>
    </PreviewFrame>
  );
}

function BrandingPreview() {
  return (
    <PreviewFrame>
      <div className="grid grid-cols-2 gap-2 h-full">
        <div className="rounded-md border border-border bg-background grid place-items-center text-2xl font-bold tracking-tighter text-foreground">N<span className="text-primary">.</span></div>
        <div className="rounded-md border border-border bg-foreground grid place-items-center text-2xl text-primary">◆</div>
        <div className="rounded-md border border-border bg-gradient-to-br from-primary/30 to-transparent grid place-items-center text-base italic font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>Pa</div>
        <div className="rounded-md border border-border bg-background grid place-items-center">
          <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary/40 shadow-[0_0_20px_rgba(59,130,246,0.6)]" />
        </div>
      </div>
    </PreviewFrame>
  );
}

function DesignPreview() {
  return (
    <PreviewFrame>
      <div className="grid grid-cols-3 gap-2 h-full">
        <div className="col-span-2 rounded-md bg-gradient-to-br from-primary/50 via-primary/20 to-transparent border border-border shadow-[inset_0_0_30px_rgba(59,130,246,0.3)]" />
        <div className="rounded-full bg-primary/40 border border-border shadow-[0_0_25px_rgba(59,130,246,0.4)]" />
        <div className="rounded-md bg-foreground/10 border border-border" />
        <div className="col-span-2 rounded-md border border-border bg-surface/60 flex items-center px-3 gap-2">
          <div className="h-2 w-1/3 rounded bg-foreground/30" />
          <div className="h-2 w-1/4 rounded bg-primary/70" />
        </div>
      </div>
    </PreviewFrame>
  );
}

const PREVIEWS = [WebPreview, EshopPreview, BrandingPreview, DesignPreview];

const RESULT_HEADLINES = [
  "Weby, které přivádí klienty",
  "E-shopy, které vydělávají",
  "Značka, kterou si lidé zapamatují",
  "Vizuály, které prodávají",
];

export function Services() {
  const { t } = useT();
  return (
    <section id="services" className="py-32 md:py-40 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="01" title={t.services.title} subtitle={t.services.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
          {t.services.items.map((s, i) => {
            const Preview = PREVIEWS[i];
            const to = SERVICE_ROUTES[i];
            return (
              <Link
                key={s.title}
                to={to}
                className="reveal hover-lift group p-6 rounded-xl border border-border bg-surface/50 backdrop-blur-sm relative overflow-hidden block transition-all duration-300 hover:border-primary/50 hover:shadow-[0_20px_60px_-20px_rgba(59,130,246,0.45)]"
              >
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <div className="transition-transform duration-500 group-hover:scale-110">
                    <Preview />
                  </div>
                  <div className="absolute inset-0 bg-primary/70 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 grid place-items-center">
                    <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-primary-foreground">
                      Zobrazit službu <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2 relative">{RESULT_HEADLINES[i] ?? s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed relative">{s.desc}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
