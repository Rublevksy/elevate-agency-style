import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Results } from "@/components/sections/Results";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Portfolio } from "@/components/sections/Portfolio";
import { Guarantee } from "@/components/sections/Guarantee";
import { Testimonials } from "@/components/sections/Testimonials";
import { Faq } from "@/components/sections/Faq";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ELEVATE — Digitální agentura" },
      { name: "description", content: "Tvoříme weby, které vydělávají. Pomáháme firmám růst online." },
      { property: "og:title", content: "ELEVATE — Digitální agentura" },
      { property: "og:description", content: "Tvoříme weby, které vydělávají." },
    ],
  }),
});

function Index() {
  return (
    <>
      <Hero />
      <TrustBar />
      <About />
      <Services />
      <Results />
      <WhyUs />
      <Process />
      <Portfolio />
      <Guarantee />
      <Testimonials />
      <Faq />
      <CtaBanner />
    </>
  );
}
