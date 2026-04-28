import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

export function Faq() {
  const { t } = useT();
  return (
    <section className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe max-w-3xl">
        <SectionHeading eyebrow={t.faq.eyebrow} title={t.faq.title} />
        <Accordion type="single" collapsible className="w-full">
          {t.faq.items.map((it, i) => (
            <AccordionItem key={it.q} value={`item-${i}`} className="border-border">
              <AccordionTrigger className="text-base md:text-lg text-foreground py-6 font-bold">
                {it.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed pb-6 text-base">
                {it.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
