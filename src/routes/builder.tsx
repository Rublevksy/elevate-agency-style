import { createFileRoute } from "@tanstack/react-router";
import { BuilderApp } from "@/components/builder/BuilderApp";
import { BUILDER_COPY } from "@/lib/builder/copy";

const META = BUILDER_COPY.CZ.meta;

export const Route = createFileRoute("/builder")({
  component: BuilderApp,
  head: () => ({
    meta: [
      { title: META.title },
      { name: "description", content: META.description },
      { property: "og:title", content: META.title },
      { property: "og:description", content: META.description },
      { property: "og:url", content: "https://elevateit.cz/builder" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/builder" }],
  }),
});
