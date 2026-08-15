import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { DeviceFilm } from "@/components/devicefilm/DeviceFilm";
import { CinematicServices } from "@/components/services/CinematicServices";

import { CaseFilm } from "@/components/cinematic/CaseFilm";
import { Results } from "@/components/sections/Results";
import { ProcessFilm } from "@/components/process/ProcessFilm";
import { StudioPhilosophy } from "@/components/sections/StudioPhilosophy";
import { TrustBar } from "@/components/sections/TrustBar";
import { CINEMATIC } from "@/lib/cinematic-copy";
import { useT } from "@/lib/i18n";
import glbAsset from "@/assets/macbook-pro-14-m5.glb.asset.json";
import aMarkAsset from "@/assets/elevate-a-mark.png.asset.json";


export const Route = createFileRoute("/")({
  component: Home,
  head: () => ({
    meta: [
      { title: "ELEVATE — Webdesign, UX a vývoj moderních webů" },
      { name: "description", content: "Moderní weby a UX strategie pro firmy, které chtějí růst online. Audit zdarma do 48 hodin." },
      { property: "og:title", content: "ELEVATE — Webdesign, UX a vývoj moderních webů" },
      { property: "og:description", content: "Moderní weby a UX strategie pro firmy, které chtějí růst online. Audit zdarma do 48 hodin." },
      { property: "og:url", content: "https://elevateit.cz/" },
      { name: "twitter:title", content: "ELEVATE — Webdesign, UX a vývoj moderních webů" },
      { name: "twitter:description", content: "Moderní weby a UX strategie pro firmy, které chtějí růst online. Audit zdarma do 48 hodin." },
    ],
    links: [
      { rel: "canonical", href: "https://elevateit.cz/" },
      // the hero device is the critical above-the-fold asset
      { rel: "preload", as: "fetch", href: glbAsset.url, crossOrigin: "anonymous" },
      { rel: "preload", as: "image", href: aMarkAsset.url },
    ],

  }),
});

function Home() {
  const { lang, t } = useT();
  const c = CINEMATIC[lang];

  return (
    <>
      {/* 01 — cinematic device film: product → camera → digital products → website */}
      <DeviceFilm />

      {/* 02 — cinematic service sequence: five campaign chapters */}
      <CinematicServices />


      {/* 03 — how we work + studio point of view */}
      <StudioPhilosophy />

      <ProcessFilm />

      {/* 04 — proof */}
      <Results />
      <TrustBar />

      {/* 05 — projects as case previews */}
      <CaseFilm />

      {/* 06 — CTA */}
      <section className="border-t border-border py-24 md:py-36">
        <div className="container-luxe">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground md:text-5xl">{c.ctaTitle}</h2>
            <p className="mx-auto mt-5 max-w-lg text-base text-muted-foreground">{c.ctaSub}</p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.28em] text-primary">{t.trust.response}</p>
            <Link to="/contact" className="btn-primary group mx-auto mt-10 inline-flex">
              {c.ctaAction}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
