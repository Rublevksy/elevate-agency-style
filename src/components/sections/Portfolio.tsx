import { ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

const PROJECTS = [
  { img: p1, name: "Nordic Store", tag: "E-commerce" },
  { img: p2, name: "Corvex", tag: "Corporate" },
  { img: p3, name: "Tinesort", tag: "SaaS" },
  { img: p4, name: "Patecura", tag: "Portfolio" },
];

export function Portfolio() {
  const { t } = useT();
  return (
    <section id="portfolio" className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="04" title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {PROJECTS.map((p) => (
            <div key={p.name} className="group relative overflow-hidden rounded-xl border border-border bg-surface hover-lift">
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-primary mb-1">{p.tag}</p>
                    <h3 className="text-xl font-bold text-foreground">{p.name}</h3>
                  </div>
                  <button className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    {t.portfolio.view}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-5 flex items-center justify-between group-hover:opacity-0 transition-opacity">
                <div>
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">{p.tag}</p>
                  <h3 className="text-base font-bold text-foreground mt-1">{p.name}</h3>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
