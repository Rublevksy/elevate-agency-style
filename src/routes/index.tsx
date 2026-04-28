import { createFileRoute } from "@tanstack/react-router";
import { Hero } from "@/components/sections/Hero";
import { TrustBar } from "@/components/sections/TrustBar";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
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
      <Services />
      <Portfolio />
      <CtaBanner />
    </>
  );
}
