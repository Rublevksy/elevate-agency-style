import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, MessageCircle, Award, Users, Clock, Zap, ShieldCheck } from "lucide-react";
import { Results } from "@/components/sections/Results";
import { Testimonials } from "@/components/sections/Testimonials";
import { Guarantee } from "@/components/sections/Guarantee";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "O nás — ELEVATE" },
      { name: "description", content: "Digitální agentura zaměřená na výsledky. Tvoříme weby a digitální řešení, která pomáhají firmám růst." },
      { property: "og:title", content: "O nás — ELEVATE" },
      { property: "og:description", content: "Digitální agentura zaměřená na výsledky." },
    ],
  }),
});

const STATS = [
  { icon: Award, n: "4+", l: "let zkušeností" },
  { icon: Users, n: "50+", l: "realizovaných projektů" },
  { icon: Sparkles, n: "12+", l: "oborů a odvětví" },
];

const VALUES = [
  {
    icon: Sparkles,
    title: "Individuální přístup",
    desc: "Žádné šablony. Každý projekt řešíme od základu podle vašich cílů.",
  },
  {
    icon: Zap,
    title: "Rychlá komunikace",
    desc: "Odpovídáme do 24 hodin. Vždy víte, na čem jsme a co bude dál.",
  },
  {
    icon: ShieldCheck,
    title: "Důraz na kvalitu",
    desc: "Stavíme řešení, která dlouhodobě fungují — vizuálně i technicky.",
  },
];

function AboutPage() {
  return (
    <>
      {/* HERO */}
      <section className="page-top pb-16 md:pb-24 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="container-luxe relative">
          <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">O nás</p>
          <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight leading-[1.05] max-w-4xl">
            Jsme digitální agentura zaměřená na výsledky.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Tvoříme webové stránky a digitální řešení, která reálně pomáhají firmám růst — ne jen vypadat dobře.
          </p>
        </div>
      </section>

      {/* STATS */}
      <section className="pb-20 md:pb-28">
        <div className="container-luxe">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STATS.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.l}
                  className="rounded-2xl border border-border bg-surface p-8 hover:border-primary/40 transition-colors"
                >
                  <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center mb-6">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">{s.n}</div>
                  <p className="mt-2 text-sm text-muted-foreground uppercase tracking-widest">{s.l}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STORY */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-luxe grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Náš přístup</p>
            <div className="h-px w-12 bg-primary" />
          </div>
          <div className="lg:col-span-8 space-y-6 text-lg text-muted-foreground leading-relaxed">
            <p>
              Spojujeme strategii, design a technologii do jednoho celku, který pracuje pro vaše podnikání. Nejde nám
              o líbivý vizuál — jde nám o měřitelné výsledky.
            </p>
            <p>
              Pracujeme s klienty z různých oborů — od profesionálních služeb a B2B firem až po e-commerce značky.
              Každý projekt začíná pochopením byznysu, ne výběrem barev.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="py-20 md:py-28 border-t border-border bg-surface/30">
        <div className="container-luxe">
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="text-xs uppercase tracking-[0.25em] text-primary mb-4">Naše hodnoty</p>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">
              V čem jsme jiní
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="rounded-2xl border border-border bg-surface p-8 hover:border-primary/40 transition-colors"
                >
                  <div className="h-11 w-11 rounded-lg bg-primary/10 border border-primary/20 grid place-items-center mb-6">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-3">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* EXCLUSIVITY / TRUST */}
      <section className="py-20 md:py-28 border-t border-border">
        <div className="container-luxe">
          <div className="rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/10 via-surface to-transparent p-10 md:p-16 text-center relative overflow-hidden">
            <div className="absolute inset-0 grid-bg opacity-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
            <div className="relative max-w-3xl mx-auto">
              <p className="text-xs uppercase tracking-[0.25em] text-primary mb-5">Limitovaná spolupráce</p>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-tight mb-6">
                Pracujeme pouze s omezeným počtem klientů.
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                Abychom každému projektu mohli věnovat maximální pozornost, přijímáme jen několik nových
                spoluprací měsíčně.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-8 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                  <Clock className="h-3.5 w-3.5 text-primary" /> Odpovíme do 24 hodin
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                  <MessageCircle className="h-3.5 w-3.5 text-primary" /> Nezávazná konzultace zdarma
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-4 py-2">
                  <Sparkles className="h-3.5 w-3.5 text-primary" /> Individuální přístup
                </span>
              </div>
              <Link to="/contact" className="btn-primary">
                Domluvit konzultaci
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Results />
      <Guarantee />
      <Testimonials />
      <CtaBanner />
    </>
  );
}
