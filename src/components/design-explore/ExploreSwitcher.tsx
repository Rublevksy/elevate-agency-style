import { Link } from "@tanstack/react-router";

import { DESIGN_CONCEPTS, type DesignConcept } from "./concepts";

/**
 * Fixed (not sticky) badge/bar rendered by each /design-vN page itself —
 * not mounted globally from __root.tsx. Lets a visitor jump between all
 * four directions and back to the real site without typing a URL.
 *
 * Deliberately does not reuse Nav.tsx: different visual register, and Nav
 * drags in the production menu/language switcher/dropdowns that would be
 * visual noise on top of an experimental composition.
 *
 * Plain <a> is used for the /design-vN links on purpose: those routes are
 * built by separate tickets and may not exist yet in this build's route
 * tree, so this component stays decoupled from their build order.
 */
export function ExploreSwitcher({ active }: { active: DesignConcept["slug"] }) {
  return (
    <nav
      aria-label="Design direction switcher"
      className="fixed left-1/2 top-4 z-[100] flex -translate-x-1/2 items-center gap-1 rounded-full border border-white/10 bg-black/70 px-2 py-1.5 text-xs text-white shadow-lg backdrop-blur-md"
    >
      <Link
        to="/"
        className="rounded-full px-3 py-1.5 font-medium tracking-wide text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        ← ELEVATE.CZ
      </Link>
      <span aria-hidden="true" className="h-4 w-px bg-white/15" />
      {DESIGN_CONCEPTS.map((concept) => {
        const isActive = concept.slug === active;
        if (isActive) {
          return (
            <span
              key={concept.slug}
              aria-current="page"
              className="rounded-full bg-primary px-3 py-1.5 font-semibold text-primary-foreground"
            >
              V{concept.order}
            </span>
          );
        }
        return (
          <a
            key={concept.slug}
            href={`/${concept.slug}`}
            className="rounded-full px-3 py-1.5 font-medium text-white/60 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            V{concept.order}
          </a>
        );
      })}
    </nav>
  );
}
