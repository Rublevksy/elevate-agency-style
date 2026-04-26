import { createFileRoute } from "@tanstack/react-router";
import { LangProvider } from "@/components/LangProvider";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Portfolio } from "@/components/sections/Portfolio";
import { Pricing } from "@/components/sections/Pricing";
import { Testimonials } from "@/components/sections/Testimonials";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { Contact } from "@/components/sections/Contact";
import { Footer } from "@/components/sections/Footer";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "ELEVATE — Digitální agentura" },
      { name: "description", content: "Tvoříme weby, které vydělávají. Pomáháme firmám růst online." },
      { property: "og:title", content: "ELEVATE — Digitální agentura" },
      { property: "og:description", content: "Tvoříme weby, které vydělávají. Pomáháme firmám růst online." },
    ],
  }),
});

function Index() {
  return (
    <LangProvider>
      <div className="min-h-screen bg-background text-foreground">
        <Nav />
        <main>
          <Hero />
          <TrustBar />
          <Services />
          <WhyUs />
          <Process />
          <Portfolio />
          <Pricing />
          <Testimonials />
          <CtaBanner />
          <Contact />
        </main>
        <Footer />
      </div>
    </LangProvider>
  );
}
