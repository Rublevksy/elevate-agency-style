import { createFileRoute } from "@tanstack/react-router";
import { Contact } from "@/components/sections/Contact";
import { Guarantee } from "@/components/sections/Guarantee";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Kontakt — ELEVATE" },
      { name: "description", content: "Pošlete nám poptávku. Odpovíme do 24 hodin." },
      { property: "og:title", content: "Kontakt — ELEVATE" },
      { property: "og:description", content: "Pošlete nám poptávku. Odpovíme do 24 hodin." },
    ],
  }),
});

function ContactPage() {
  const { t } = useT();
  return (
    <>
      <section className="page-top pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.contact.title}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-3xl">
            {t.contact.subtitle}
          </h1>
        </div>
      </section>
      <Contact />
      <Guarantee />
    </>
  );
}
