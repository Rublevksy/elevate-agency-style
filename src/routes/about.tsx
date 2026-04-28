import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/sections/About";
import { Results } from "@/components/sections/Results";
import { WhyUs } from "@/components/sections/WhyUs";
import { Testimonials } from "@/components/sections/Testimonials";
import { Guarantee } from "@/components/sections/Guarantee";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "O nás — ELEVATE" },
      { name: "description", content: "Digitální agentura zaměřená na výkon. Strategie, design a technologie v jednom." },
      { property: "og:title", content: "O nás — ELEVATE" },
      { property: "og:description", content: "Digitální agentura zaměřená na výkon." },
    ],
  }),
});

function AboutPage() {
  const { t } = useT();
  return (
    <>
      <section className="page-top pb-12 md:pb-16 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">{t.about.eyebrow}</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight max-w-4xl">
            {t.about.title}
          </h1>
        </div>
      </section>
      <About />
      <Results />
      <WhyUs />
      <Guarantee />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
