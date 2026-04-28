import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const SERVICE_ROUTES = ["/services/web", "/services/eshop", "/services/branding", "/services/design"] as const;

function WebPreview() {
  return (
    <div className="rounded-lg border border-border bg-background/80 overflow-hidden">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border bg-surface/60">
        <span className="h-2 w-2 rounded-full bg-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-foreground/30" />
        <span className="h-2 w-2 rounded-full bg-foreground/30" />
      </div>
      <div className="p-4 space-y-2">
        <div className="h-2 w-2/3 rounded bg-foreground/30" />
        <div className="h-2 w-1/2 rounded bg-foreground/15" />
        <div className="grid grid-cols-3 gap-1.5 mt-3">
          <div className="h-10 rounded bg-primary/35" />
          <div className="h-10 rounded bg-foreground/10" />
          <div className="h-10 rounded bg-primary/20" />
        </div>
      </div>
    </div>
  );
}

function EshopPreview() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="rounded-lg border border-border bg-surface/40 overflow-hidden">
          <div className="aspect-square bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          <div className="p-2 space-y-1">
            <div className="h-1.5 w-3/4 rounded bg-foreground/20" />
            <div className="h-1.5 w-1/2 rounded bg-primary/60" />
          </div>
        </div>
      ))}
    </div>
  );
}

function BrandingPreview() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="aspect-square rounded-lg border border-border bg-background grid place-items-center text-2xl font-bold tracking-tighter text-foreground">N</div>
      <div className="aspect-square rounded-lg border border-border bg-foreground grid place-items-center text-2xl text-primary">◆</div>
      <div className="aspect-square rounded-lg border border-border bg-gradient-to-br from-primary/30 to-transparent grid place-items-center text-base italic font-bold text-foreground" style={{ fontFamily: "Georgia, serif" }}>Pa</div>
      <div className="aspect-square rounded-lg border border-border bg-background grid place-items-center">
        <div className="h-8 w-8 rounded-md bg-gradient-to-br from-primary to-primary/40" />
      </div>
    </div>
  );
}

function DesignPreview() {
  return (
    <div className="grid grid-cols-3 gap-2">
      <div className="col-span-2 aspect-[16/10] rounded-lg bg-gradient-to-br from-primary/40 via-primary/15 to-transparent border border-border" />
      <div className="aspect-square rounded-full bg-primary/30 border border-border" />
      <div className="aspect-square rounded-lg bg-foreground/10 border border-border" />
      <div className="col-span-2 aspect-[16/10] rounded-lg border border-border bg-surface/60 flex items-center px-3 gap-2">
        <div className="h-2 w-1/3 rounded bg-foreground/30" />
        <div className="h-2 w-1/4 rounded bg-primary/60" />
      </div>
    </div>
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
                className="reveal hover-lift group p-6 rounded-xl border border-border bg-surface/50 backdrop-blur-sm relative overflow-hidden block"
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
