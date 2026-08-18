import { createFileRoute } from "@tanstack/react-router";

import { Logo } from "@/components/Logo";
import { DESIGN_CONCEPTS } from "@/components/design-explore/concepts";

export const Route = createFileRoute("/design")({
  component: DesignIndexPage,
  head: () => ({
    meta: [
      { title: "Design exploration — ELEVATE" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function DesignIndexPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-4 py-20 text-white">
      <Logo className="h-8 w-auto mb-10" />
      <h1 className="min-w-0 text-3xl md:text-5xl font-extrabold tracking-tight text-center mb-3">
        Выберите направление
      </h1>
      <p className="min-w-0 text-white/50 text-sm md:text-base text-center mb-12 max-w-xl">
        Четыре самостоятельных визуальных направления для главной страницы. Каждое открывается
        отдельно и не влияет на прод-сайт.
      </p>
      <div className="grid w-full max-w-3xl grid-cols-1 gap-4 sm:grid-cols-2">
        {DESIGN_CONCEPTS.map((concept) => (
          <a
            key={concept.slug}
            href={`/${concept.slug}`}
            className="group min-w-0 rounded-2xl border border-white/10 bg-white/5 p-6 text-left transition-colors hover:border-primary/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-primary">
              V{concept.order}
            </span>
            <h2 className="mt-2 min-w-0 text-lg font-semibold text-white break-words">
              {concept.name}
            </h2>
            <p className="mt-2 min-w-0 text-sm text-white/50 break-words">{concept.oneLiner}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
