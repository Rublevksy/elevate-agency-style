import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import heroMaster from "@/assets/elevate-hero-master.png.asset.json";
import { setCinematicActive } from "@/lib/cinematic-state";

const services: { label: string; to: string; left: number; width: number }[] = [
  { label: "Weby", to: "/services/web", left: 8.4, width: 3.5 },
  { label: "E-shopy", to: "/services/eshop", left: 13.6, width: 5.4 },
  { label: "Aplikace", to: "/services", left: 20.7, width: 6.0 },
  { label: "Design", to: "/services/design", left: 28.3, width: 4.7 },
  { label: "SEO", to: "/services", left: 34.5, width: 2.7 },
];

export function Hero() {
  useEffect(() => {
    setCinematicActive(true);
    return () => setCinematicActive(false);
  }, []);

  return (
    <section aria-label="ELEVATE — digitální studio" className="hero-reference relative h-[100svh] overflow-hidden bg-background">
      <h1 className="sr-only">Digitální řešení, která posouvají vaše podnikání</h1>
      <img
        src={heroMaster.url}
        alt="ELEVATE — digitální studio, MacBook ve světelné scéně"
        width={1536}
        height={1024}
        fetchPriority="high"
        decoding="sync"
        className="hero-master absolute inset-0 h-full w-full object-cover object-center"
      />
      {/* živá fiber-optic světelná vrstva — proudí za MacBookem (silueta je vymaskovaná) */}
      <FiberField className="pointer-events-none absolute inset-0 h-full w-full" />


      <nav aria-label="Hlavní navigace" className="absolute inset-0 z-10 hidden md:block">
        <Link to="/" aria-label="ELEVATE — domů" className="hero-hotspot left-[4.8%] top-[12.4%] h-[6.2%] w-[18.2%]" />
        {services.map((service) => (
          <Link
            key={service.label}
            to={service.to}
            aria-label={service.label}
            className="hero-hotspot top-[59.2%] h-[3%]"
            style={{ left: `${service.left}%`, width: `${service.width}%` }}
          />
        ))}
        <Link
          to="/contact"
          aria-label="Chci projekt"
          className="hero-hotspot left-[8.4%] top-[36%] h-[17%] w-[28%]"
        />
      </nav>
    </section>
  );
}

