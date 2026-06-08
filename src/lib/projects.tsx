// Stable, language-independent project data.
// Localized content lives in src/lib/projects-i18n.ts.

export type ProjectSlug =
  | "biodent-clinic"
  | "nhome-praha"
  | "exclusive-beauty"
  | "euromotors";

export type ProjectCategory = "Web" | "E-shop" | "Branding" | "SaaS";

export type ProjectBase = {
  slug: ProjectSlug;
  name: string;
  category: ProjectCategory;
  url: string;
  domain: string;
  preview: "site";
};

export const PROJECTS_BASE: ProjectBase[] = [
  { slug: "biodent-clinic",   name: "Biodent Clinic",    category: "Web",    url: "https://biodentclinic.cz",   domain: "biodentclinic.cz",   preview: "site" },
  { slug: "exclusive-beauty", name: "Exclusive Beauty",  category: "E-shop", url: "https://exclusivebeauty.cz", domain: "exclusivebeauty.cz", preview: "site" },
  { slug: "nhome-praha",      name: "N Home Praha",      category: "Web",    url: "https://inhomepraha.cz",     domain: "inhomepraha.cz",     preview: "site" },
  { slug: "euromotors",       name: "EuroMotors",        category: "Web",    url: "https://euromotors.cz",      domain: "euromotors.cz",      preview: "site" },
];

export const PROJECT_SLUGS: ProjectSlug[] = PROJECTS_BASE.map((p) => p.slug);

export function screenshotUrl(siteUrl: string, w = 1600, h = 1000) {
  return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(siteUrl)}?w=${w}&h=${h}`;
}

type VisualProject = { name: string; url?: string; domain?: string; preview: ProjectBase["preview"] };

/**
 * Renders a premium browser-chrome mockup with a live screenshot of the project's
 * site. `mode="card"` is the compact grid variant, `mode="hero"` is the large
 * featured / detail-page variant.
 */
export function ProjectVisual({ project, mode = "card" }: { project: VisualProject; mode?: "card" | "hero" }) {
  const url = project.url ?? "https://example.com";
  const domain = project.domain ?? new URL(url).hostname;
  const w = mode === "hero" ? 1800 : 1400;
  const h = mode === "hero" ? 1125 : 900;
  const src = screenshotUrl(url, w, h);

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-primary/12 via-surface to-background p-3 md:p-5 flex flex-col">
      <div className="flex-1 rounded-lg md:rounded-xl border border-border/70 bg-background overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)] flex flex-col">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 border-b border-border/70 bg-surface/80 backdrop-blur">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/15" />
          </div>
          <div className="flex-1 mx-2 md:mx-4 hidden sm:flex items-center justify-center">
            <span className="text-[10px] md:text-[11px] text-muted-foreground tracking-wide truncate font-mono">
              {domain}
            </span>
          </div>
        </div>
        {/* Live screenshot with graceful fallback layer behind it */}
        <div className="relative flex-1 bg-gradient-to-br from-surface via-background to-surface overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pointer-events-none">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Live preview</div>
            <div className="text-lg md:text-2xl font-semibold text-foreground/80 tracking-tight">{project.name}</div>
            <div className="text-[11px] text-muted-foreground font-mono mt-1">{domain}</div>
          </div>
          <img
            src={src}
            alt={`${project.name} — náhled webu`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * Stand-alone phone mockup that mirrors the desktop screenshot at a narrower
 * width — used in the featured hero of the portfolio.
 */
export function PhoneMockup({ project, className = "" }: { project: VisualProject; className?: string }) {
  const url = project.url ?? "https://example.com";
  const src = screenshotUrl(url, 480, 1040);
  return (
    <div className={`relative aspect-[9/19] w-full max-w-[220px] md:max-w-[260px] ${className}`}>
      <div className="absolute inset-0 rounded-[2.2rem] md:rounded-[2.5rem] border border-border/80 bg-background p-1.5 md:p-2 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.85)]">
        <div className="absolute left-1/2 -translate-x-1/2 top-1.5 md:top-2 h-4 md:h-5 w-20 md:w-24 rounded-full bg-background z-10" />
        <div className="relative h-full w-full overflow-hidden rounded-[1.7rem] md:rounded-[2rem] bg-surface">
          <img
            src={src}
            alt={`${project.name} — mobilní náhled`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover object-top"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        </div>
      </div>
    </div>
  );
}
