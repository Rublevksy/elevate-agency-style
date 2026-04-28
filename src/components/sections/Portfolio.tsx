import { ArrowUpRight } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

const IMAGES = [p1, p2, p3, p4];

export function Portfolio() {
  const { t } = useT();
  const projects = t.portfolio.items.map((p, i) => ({ ...p, img: IMAGES[i] }));
  return (
    <section id="portfolio" className="py-32 md:py-40 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="04" title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((p, i) => (
            <div
              key={p.name}
              className="reveal group relative overflow-hidden rounded-xl border border-border bg-surface hover-lift"
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <div className="aspect-[4/3] overflow-hidden relative">
                <img
                  src={p.img}
                  alt={p.name}
                  loading="lazy"
                  width={1024}
                  height={768}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                {/* hover dark overlay */}
                <div className="absolute inset-0 bg-background/85 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col items-center justify-center gap-5">
                  <button className="btn-primary text-sm">
                    {t.portfolio.view}
                    <ArrowUpRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 md:p-7 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-primary mb-2">{p.tag}</p>
                  <h3 className="text-lg md:text-xl font-bold text-foreground">{p.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-foreground">{p.result}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
