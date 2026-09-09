import { createFileRoute } from "@tanstack/react-router";
import { ProtoHero } from "@/components/proto/ProtoHero";
import { ProtoFirstService } from "@/components/proto/ProtoFirstService";

/**
 * /proto — candidate 6 ("the browser-portal", WEB_VISUAL_PROOF.md) proved
 * inside a real page: hero, hero -> first-service handoff, first service.
 *
 * Not a homepage candidate and not wired into `src/routes/index.tsx` — an
 * isolated prototype (same pattern as `/design`, `/bench`: no Nav/Footer, see
 * __root.tsx SiteShell's `isProto` check) built to answer one question in a
 * real browser rather than in another document: does this now look like an
 * exceptionally designed ELEVATE website, not a generated image sitting on
 * an ordinary page.
 *
 * `noindex`: prototype, never linked from Nav, carries no content of its own
 * beyond the real `t.hero.*` / `pages.servicesWeb` strings the two sections
 * read directly.
 */
export const Route = createFileRoute("/proto")({
  component: ProtoPage,
  head: () => ({
    meta: [
      { title: "Candidate 6 prototype — ELEVATE" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

function ProtoPage() {
  return (
    <>
      <ProtoHero />
      <ProtoFirstService />
    </>
  );
}
