import { MessagesSquare, PenTool, Code2, Rocket } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

const ICONS = [MessagesSquare, PenTool, Code2, Rocket];

export function Process() {
  const { t } = useT();
  return (
    <section className="py-32 md:py-40 border-t border-border bg-surface/30">
      <div className="container-luxe">
        <SectionHeading eyebrow="03" title={t.process.title} />
        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-14 md:gap-10">
          <div className="hidden md:block absolute top-3 left-[12%] right-[12%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />
          {t.process.steps.map((step, i) => {
            const Icon = ICONS[i];
            return (
              <div
                key={step}
                className="reveal relative flex flex-col items-start text-left"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-xs font-mono text-primary tracking-widest">0{i + 1}</span>
                  <span className="h-px w-8 bg-border" />
                </div>
                <Icon className="h-5 w-5 text-primary mb-6" strokeWidth={1.5} />
                <h3 className="text-base font-bold text-foreground">{step}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
