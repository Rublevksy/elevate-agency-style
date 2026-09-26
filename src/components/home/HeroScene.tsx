import { Link } from "@tanstack/react-router";
import { ArrowDownRight, ArrowRight } from "lucide-react";
import { motion, useTransform } from "framer-motion";
import character from "@/assets/refs/svc-seo.webp";
import { BEAT, EASE, useAct, useMotionCapability } from "@/components/cinematic";
import { useT } from "@/lib/i18n";
import { PragueMapScene } from "./PragueMapScene";

const HERO_VIEWPORTS = 2.2;
const HERO_PIN = 1.2 / HERO_VIEWPORTS;

export function HeroScene() {
  const { t } = useT();
  const reduced = useMotionCapability() === "still";
  const act = useAct("hero", { viewports: HERO_VIEWPORTS, pin: HERO_PIN });
  const copyY = useTransform(act.progress, [0, 1], [0, reduced ? 0 : -72]);
  const copyOpacity = useTransform(act.progress, [0, 0.72, 1], [1, 1, reduced ? 1 : 0]);
  const sceneY = useTransform(act.progress, [0, 1], [0, reduced ? 0 : -34]);
  const characterX = useTransform(act.progress, [0, 1], [0, reduced ? 0 : 44]);
  const characterOpacity = useTransform(act.progress, [0, 0.72, 1], [1, 1, reduced ? 1 : 0.35]);

  return (
    <section
      ref={act.ref}
      aria-labelledby="home-title"
      style={{ "--hero-track": `${HERO_VIEWPORTS * 100}svh` } as React.CSSProperties}
      className="relative isolate bg-background xl:h-[var(--hero-track)] motion-reduce:xl:h-auto"
    >
      <div className="relative min-h-[100svh] overflow-hidden xl:sticky xl:top-0 xl:h-[100svh]">
        <div className="absolute inset-0 grid-bg opacity-35 [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />
        <motion.div style={{ y: sceneY }} className="absolute inset-0">
          <PragueMapScene progress={act.progress} label={t.ui.mapSceneLabel} />
        </motion.div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,var(--background)_0%,color-mix(in_oklab,var(--background)_92%,transparent)_35%,transparent_69%),linear-gradient(to_bottom,var(--background)_0%,transparent_25%,transparent_72%,var(--background)_100%)]" />

        <motion.div
          style={{ y: copyY, opacity: copyOpacity }}
          className="container-luxe relative z-20 flex min-h-[100svh] items-center pt-24 pb-16"
        >
          <div className="max-w-[38rem]">
            <motion.p
              initial={reduced ? undefined : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: BEAT.kicker, ease: EASE }}
              className="label-micro flex items-center gap-4 text-muted-foreground"
            >
              <span aria-hidden className="h-px w-10 bg-primary/70" />
              {t.hero.sceneKicker}
            </motion.p>
            <h1 id="home-title" className="heading-scene mt-6 text-[clamp(2.35rem,5vw,5rem)] uppercase text-foreground">
              <span className="block">{t.hero.sceneLine1}</span>
              <span className="block">{t.hero.sceneLine2}</span>
              <span className="block text-primary">{t.hero.sceneAccent}</span>
            </h1>
            <p className="mt-7 max-w-[34rem] text-base leading-relaxed text-muted-foreground md:text-lg">
              {t.hero.sceneSubtitle}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <Link to="/contact" className="btn-primary">
                {t.hero.cta1}<ArrowRight className="size-4" aria-hidden />
              </Link>
              <a href="#work" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                {t.hero.cta2}<ArrowDownRight className="size-4" aria-hidden />
              </a>
            </div>
            <ul className="label-micro mt-10 flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground">
              {t.hero.sceneDisciplines.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </motion.div>

        <motion.div
          style={{ x: characterX, opacity: characterOpacity }}
          className="pointer-events-none absolute right-[-3rem] bottom-0 z-10 hidden h-[82%] w-[43%] max-w-[43rem] xl:block"
        >
          <img src={character} alt="" width={736} height={1146} fetchPriority="high" className="h-full w-full object-cover object-[58%_42%] [mask-image:linear-gradient(to_right,transparent_0%,black_18%,black_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_58%,var(--background)_100%)]" />
        </motion.div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 h-24 bg-gradient-to-t from-background to-transparent" />
      </div>
    </section>
  );
}

export default HeroScene;
