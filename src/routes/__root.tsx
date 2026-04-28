import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";

import appCss from "../styles.css?url";
import { LangProvider } from "@/components/LangProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { useReveal } from "@/hooks/use-reveal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ELEVATE — Digitální agentura" },
      { name: "description", content: "Tvoříme weby, které vydělávají. Pomáháme firmám růst online." },
      { name: "author", content: "ELEVATE" },
      { property: "og:title", content: "ELEVATE — Digitální agentura" },
      { property: "og:description", content: "Tvoříme weby, které vydělávají. Pomáháme firmám růst online." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "ELEVATE — Digitální agentura" },
      { name: "twitter:description", content: "Tvoříme weby, které vydělávají. Pomáháme firmám růst online." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7c8aa125-3a10-46cb-a0b7-54bd47b7fa1a/id-preview-0bb11058--8909fd69-7455-4ab1-9c3a-d6cf0cfb51c8.lovable.app-1777372763384.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/7c8aa125-3a10-46cb-a0b7-54bd47b7fa1a/id-preview-0bb11058--8909fd69-7455-4ab1-9c3a-d6cf0cfb51c8.lovable.app-1777372763384.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function SiteShell() {
  useReveal();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, left: 0, behavior: prefersReduced ? "auto" : "smooth" });
  }, [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Nav />
      <main key={pathname} className="flex-1 animate-fade-in">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

function RootComponent() {
  return (
    <LangProvider>
      <SiteShell />
    </LangProvider>
  );
}
