import { Link } from "@tanstack/react-router";
import { useEffect } from "react";

import heroMaster from "@/assets/elevate-hero.png.asset.json";
import { setCinematicActive } from "@/lib/cinematic-state";
import { useT, type Lang } from "@/lib/i18n";

const languages: Lang[] = ["CZ", "EN", "RU", "UA"];

export function Hero() {
  const { setLang } = useT();

  useEffect(() => {
    setCinematicActive(true);
    return () => setCinematicActive(false);
  }, []);

  return (
    <section aria-label="ELEVATE — digitální studio" className="hero-reference relative h-[100svh] overflow-hidden bg-background">
      <h1 className="sr-only">Digitální řešení, která posouvají vaše podnikání</h1>
      <img
        src={heroMaster.url}
        alt="ELEVATE — digitální studio, MacBook a světelný portál"
        width={1536}
        height={1024}
        fetchPriority="high"
        decoding="sync"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />

      <nav aria-label="Hlavní navigace" className="absolute inset-0 z-10 hidden md:block">
        <Link to="/" aria-label="ELEVATE — domů" className="hero-hotspot left-[3.8%] top-[2.2%] h-[5.3%] w-[11.4%]" />
        <Link to="/projects" aria-label="Projekty" className="hero-hotspot left-[24.8%] top-[2.2%] h-[5.3%] w-[6.8%]" />
        <Link to="/services" aria-label="Služby" className="hero-hotspot left-[32.6%] top-[2.2%] h-[5.3%] w-[6.6%]" />
        <Link to="/pricing" aria-label="Ceník" className="hero-hotspot left-[40.5%] top-[2.2%] h-[5.3%] w-[5.8%]" />
        <Link to="/about" aria-label="O nás" className="hero-hotspot left-[47.5%] top-[2.2%] h-[5.3%] w-[5.2%]" />
        <Link to="/contact" aria-label="Kontakt" className="hero-hotspot left-[54%] top-[2.2%] h-[5.3%] w-[6.2%]" />
        <Link to="/contact" aria-label="Začít projekt" className="hero-hotspot left-[79.7%] top-[2%] h-[5.6%] w-[12.3%]" />
        {languages.map((language, index) => (
          <button
            key={language}
            type="button"
            aria-label={`Přepnout jazyk na ${language}`}
            onClick={() => setLang(language)}
            className="hero-hotspot top-[2.2%] h-[5.3%] w-[2.1%]"
            style={{ left: `${69.1 + index * 2.4}%` }}
          />
        ))}
      </nav>

      <Link
        to="/contact"
        aria-label="Chci projekt"
        className="hero-hotspot z-10 left-[8.1%] top-[56.8%] h-[6.4%] w-[12.5%]"
      />
    </section>
  );
}
