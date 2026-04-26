import { MessagesSquare, PenTool, Code2, Rocket } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const ICONS = [MessagesSquare, PenTool, Code2, Rocket];

export function Process() {
  const { t } = useT();
  return (
    <section className="py-28 md:py-36 border-t border-border bg-surface/30">
      <div className="container-luxe">
        <SectionHeading eyebrow="03" title={t.process.title} />
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6">
          <div className="hidden md:block absolute top-7 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {t.process.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <div key={step} className="relative flex flex-col items-center text-center">
                <div className="relative h-14 w-14 rounded-full border border-border bg-background flex items-center justify-center mb-5">
                  <Icon className="h-5 w-5 text-primary" strokeWidth={1.5} />
                </div>
                <p className="text-xs text-muted-foreground mb-1">0{i + 1}</p>
                <h3 className="text-base font-bold text-foreground">{step}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
