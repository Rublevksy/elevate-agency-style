/**
 * Step 05 — the five directions, each given the room of a spread.
 *
 * A row per concept rather than a grid of five tiles: at tile size every
 * concept reads as "a website thumbnail" and the differences between them
 * disappear. Each row shows the concept's desktop composition in THE WINDOW
 * (laid out at 1280px and scaled, so it is the real layout in miniature),
 * with its name, positioning, rationale and design system in real type
 * beside it, and the three actions the brief asks for.
 */
import { motion } from "framer-motion";
import { Check, Maximize2, RefreshCw, Wand2 } from "lucide-react";
import { EASE } from "@/components/cinematic";
import { BrowserWindow } from "@/components/home/BrowserWindow";
import type { BriefDraft } from "@/lib/builder/brief";
import type { BuilderCopy } from "@/lib/builder/copy";
import type { DesignSpec } from "@/lib/builder/spec";
import { ScaledPreview } from "./renderer/ScaledPreview";
import { HeroGlyph, Swatches, TypeSample } from "./SpecSummary";

export function ConceptGallery({
  concepts,
  brief,
  copy,
  selectedId,
  reduced,
  fixture,
  onOpen,
  onSelect,
  onRegenerate,
}: {
  concepts: DesignSpec[];
  brief: BriefDraft;
  copy: BuilderCopy;
  selectedId: string | null;
  reduced: boolean;
  fixture: boolean;
  onOpen: (id: string, focusRefine?: boolean) => void;
  onSelect: (id: string) => void;
  onRegenerate: () => void;
}) {
  const c = copy.concepts;
  return (
    <div>
      <header className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:items-end">
        <div>
          <p className="label-micro flex items-center gap-3 text-white/60">
            <span aria-hidden className="h-px w-8 bg-primary" />
            {c.eyebrow}
          </p>
          <h1
            tabIndex={-1}
            data-step-heading
            className="heading-scene mt-5 max-w-[18ch] text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] text-white outline-none"
          >
            {c.title}
          </h1>
        </div>
        <div className="lg:pb-2">
          <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-white/65">{c.lead}</p>
          {fixture && (
            <p className="mt-3 inline-block rounded-md border border-amber-300/40 bg-amber-300/10 px-3 py-1.5 text-xs text-amber-100">
              Development fixture — hand-written sample concepts, not AI output.
            </p>
          )}
        </div>
      </header>

      {/* Index: jump straight to a direction. */}
      <nav
        aria-label={c.eyebrow}
        className="mt-10 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none]"
      >
        {concepts.map((spec, i) => (
          <a
            key={spec.id}
            href={`#concept-${spec.id}`}
            className={`inline-flex min-h-10 shrink-0 items-center gap-2.5 rounded-full border px-4 text-sm transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${
              selectedId === spec.id
                ? "border-primary/70 bg-primary/10 text-white"
                : "border-white/12 text-white/70 hover:text-white"
            }`}
          >
            <span className="label-micro text-primary tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            {spec.name}
          </a>
        ))}
      </nav>

      <ol className="mt-10 space-y-20 lg:mt-16 lg:space-y-28">
        {concepts.map((spec, i) => {
          const selected = selectedId === spec.id;
          return (
            <motion.li
              key={spec.id}
              id={`concept-${spec.id}`}
              initial={reduced ? false : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10% 0px" }}
              transition={{ duration: 0.7, ease: EASE }}
              className="scroll-mt-32"
              aria-labelledby={`concept-${spec.id}-name`}
            >
              <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-14">
                <div
                  className={`group relative transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 motion-reduce:transform-none ${
                    i % 2 ? "lg:order-2" : ""
                  }`}
                >
                  <BrowserWindow
                    address={
                      <>
                        elevateit.cz/builder{" "}
                        <span className="text-white/40">· {String(i + 1).padStart(2, "0")}</span>
                      </>
                    }
                    className={selected ? "ring-2 ring-primary" : undefined}
                  >
                    <ScaledPreview
                      spec={spec}
                      brand={brief.project.company}
                      tagline={brief.project.industry}
                      copy={copy.renderer}
                      width={1280}
                      crop={800}
                      variant="thumbnail"
                    />
                  </BrowserWindow>
                  <button
                    type="button"
                    onClick={() => onOpen(spec.id)}
                    aria-label={`${c.open}: ${spec.name}`}
                    className="absolute inset-0 rounded-xl focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-[#0A0D13] focus-visible:outline-none"
                  >
                    <span className="pointer-events-none absolute right-4 bottom-4 inline-flex items-center gap-2 rounded-full bg-[#0A0D13]/85 px-3.5 py-2 text-xs text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                      <Maximize2 className="size-3.5" aria-hidden />
                      {c.open}
                    </span>
                  </button>
                </div>

                <div className={i % 2 ? "lg:order-1" : undefined}>
                  <p className="label-micro flex items-baseline gap-3">
                    <span className="text-primary tabular-nums">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-white/40 tabular-nums">
                      / {String(concepts.length).padStart(2, "0")}
                    </span>
                    {spec.revision > 0 && (
                      <span className="text-white/50">· {copy.viewer.revision(spec.revision)}</span>
                    )}
                    {selected && (
                      <span className="ml-auto inline-flex items-center gap-1.5 text-primary">
                        <Check className="size-3.5" aria-hidden />
                        {c.selected}
                      </span>
                    )}
                  </p>
                  <h2
                    id={`concept-${spec.id}-name`}
                    className="heading-scene mt-4 text-[clamp(1.75rem,1.2rem+1.6vw,2.5rem)] text-white"
                  >
                    {spec.name}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-white/85">{spec.positioning}</p>
                  <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/60">
                    {spec.rationale}
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-white/10 pt-5">
                    <Swatches spec={spec} />
                    <TypeSample spec={spec} />
                    <HeroGlyph hero={spec.layout.hero} />
                    <ul className="flex flex-wrap gap-1.5">
                      {spec.keywords.map((k) => (
                        <li
                          key={k}
                          className="rounded-full border border-white/12 px-2.5 py-0.5 text-xs text-white/65"
                        >
                          {k}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => onSelect(spec.id)}
                      className={
                        selected
                          ? "inline-flex min-h-11 items-center gap-2 rounded-[0.625rem] border border-primary bg-primary/15 px-5 text-sm font-semibold text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                          : "btn-primary text-sm"
                      }
                    >
                      {selected && <Check className="size-4" aria-hidden />}
                      {selected ? c.selected : c.select}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpen(spec.id)}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/80 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <Maximize2 className="size-4" aria-hidden />
                      {c.open}
                    </button>
                    <button
                      type="button"
                      onClick={() => onOpen(spec.id, true)}
                      className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/80 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    >
                      <Wand2 className="size-4" aria-hidden />
                      {c.refine}
                    </button>
                  </div>
                </div>
              </div>
            </motion.li>
          );
        })}
      </ol>

      <div className="mt-20 flex justify-center border-t border-white/10 pt-10">
        <button
          type="button"
          onClick={onRegenerate}
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-white/60 underline-offset-8 hover:text-white hover:underline focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
        >
          <RefreshCw className="size-4" aria-hidden />
          {c.regenerate}
        </button>
      </div>
    </div>
  );
}
