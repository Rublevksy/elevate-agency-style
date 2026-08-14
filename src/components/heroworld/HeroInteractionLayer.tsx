import { Link } from "@tanstack/react-router";

/**
 * HeroInteractionLayer — the entry point to the future interactive experience.
 * Deliberately not a conventional CTA button: a quiet interface prompt that
 * lights up on cursor proximity. Phase 1 links to the existing audit route.
 */
export function HeroInteractionLayer() {
  return (
    <div className="cine-in mt-12 md:mt-14" style={{ animationDelay: "0.85s" }}>
      <Link
        to="/audit"
        className="group inline-flex items-center gap-4 rounded-full border border-foreground/12 bg-foreground/[0.03] px-5 py-3 backdrop-blur-sm transition-colors duration-500 hover:border-primary/40 hover:bg-primary/[0.06]"
      >
        <span aria-hidden className="relative flex h-2 w-2 items-center justify-center">
          <span className="absolute h-2 w-2 rounded-full bg-primary/25 transition-transform duration-700 group-hover:scale-[2.2]" />
          <span className="h-1 w-1 rounded-full bg-primary" />
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.34em] text-foreground/70 transition-colors group-hover:text-foreground">
          Co potřebujete vyřešit?
        </span>
        <span
          aria-hidden
          className="h-px w-6 bg-foreground/20 transition-all duration-500 group-hover:w-10 group-hover:bg-primary/60"
        />
      </Link>
    </div>
  );
}
