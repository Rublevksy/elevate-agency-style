import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";
import { LangProvider } from "@/components/LangProvider";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { useReveal } from "@/hooks/use-reveal";
import { ContactWidget } from "@/components/ContactWidget";
import { CookieBanner } from "@/components/CookieBanner";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { TopProgressBar } from "@/components/TopProgressBar";
import { useT } from "@/lib/i18n";

const STRUCTURED_DATA = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ElevateIT",
    legalName: "ElevateIT",
    url: "https://elevateit.cz",
    logo: "https://elevateit.cz/android-chrome-512x512.png",
    email: "elevateitcz@gmail.com",
    sameAs: ["https://www.instagram.com/elevateit.cz/"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ElevateIT",
    url: "https://elevateit.cz",
    inLanguage: "cs-CZ",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://elevateit.cz/?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "ElevateIT",
    description: "Weby, e-shopy a digitální identita zaměřená na výkon.",
    url: "https://elevateit.cz",
    image: "https://elevateit.cz/android-chrome-512x512.png",
    email: "elevateitcz@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Praha",
      addressCountry: "CZ",
    },
    areaServed: "CZ",
    sameAs: ["https://www.instagram.com/elevateit.cz/"],
    serviceType: ["Web design", "E-commerce", "Branding"],
  },
]);

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
      { name: "theme-color", content: "#0b0f17" },
      { name: "application-name", content: "ElevateIT" },
      { name: "apple-mobile-web-app-title", content: "ElevateIT" },
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "author", content: "ElevateIT" },
      { property: "og:site_name", content: "ElevateIT" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "cs_CZ" },
      { property: "og:image", content: "https://elevateit.cz/og-image.png" },
      { property: "og:image:width", content: "512" },
      { property: "og:image:height", content: "512" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://elevateit.cz/og-image.png" },
      { name: "google-site-verification", content: "kzWWGfct_dpRjw9ivUmnzMG5nIGhvfp0OmnTb7wN1xM" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico?v=2" },
      { rel: "shortcut icon", type: "image/x-icon", href: "/favicon.ico?v=2" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png?v=2" },
      { rel: "icon", type: "image/png", sizes: "16x16", href: "/favicon-16x16.png?v=2" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=2" },
      { rel: "mask-icon", href: "/safari-pinned-tab.svg?v=2", color: "#1d4ed8" },
      { rel: "manifest", href: "/site.webmanifest" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: STRUCTURED_DATA,
      },
    ],
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
    // Instant scroll to top on route change
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  // Also scroll up immediately on click of any internal nav link (before the route resolves),
  // so the user sees instant feedback even if the next page is still loading.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href || !href.startsWith("/") || href.startsWith("//")) return;
      if (target.getAttribute("target") === "_blank") return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <TopProgressBar />
      <Nav />
      <main key={pathname} className="flex-1 animate-fade-in pb-20 md:pb-0">
        <Outlet />
      </main>
      <Footer />
      {pathname !== "/contact" && <FloatingCta />}
      <ContactWidget />
      <ExitIntentModal />
      <CookieBanner />
    </div>
  );
}

// Floating mobile CTA: only visible after scrolling past the hero (>=window height).
// Hidden on /contact. On /, only appears once user scrolls past the hero — so it
// never overlaps with the in-hero CTA at the top.
function FloatingCta() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const onScroll = () => {
      // Show after the user has scrolled roughly past the first viewport
      setVisible(window.scrollY > Math.max(window.innerHeight * 0.6, 400));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),12px)] pt-3 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none">
      <Link
        to="/contact"
        className="btn-primary w-full justify-center pointer-events-auto shadow-[0_10px_30px_-10px_oklch(0.65_0.18_255/0.6)]"
      >
        🚀 <FloatingCtaLabel />
      </Link>
    </div>
  );
}

function FloatingCtaLabel() {
  const { t } = useT();
  return <span>{t.hero.cta1}</span>;
}

function RootComponent() {
  return (
    <LangProvider>
      <SiteShell />
    </LangProvider>
  );
}
