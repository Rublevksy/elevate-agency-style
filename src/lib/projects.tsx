import p1 from "@/assets/portfolio-1.jpg";
import p2 from "@/assets/portfolio-2.jpg";
import p3 from "@/assets/portfolio-3.jpg";
import p4 from "@/assets/portfolio-4.jpg";

export type ProjectSlug =
  | "nordic-store"
  | "corvex"
  | "tinesort"
  | "patecura"
  | "lumen-studio"
  | "verda-market"
  | "northwind"
  | "pulse-crm";

export type ProjectCategory = "Web" | "E-shop" | "Branding" | "SaaS";

// Stable, language-independent project data.
// Localized name/description/result/problem/solution/work/results
// live in src/lib/projects-i18n.ts. Use useProjects() / getProjects(lang).
export type ProjectBase = {
  slug: ProjectSlug;
  name: string;
  category: ProjectCategory;
  image?: string;
  preview: "image" | "web" | "eshop" | "branding" | "saas";
};

export const PROJECTS_BASE: ProjectBase[] = [
  { slug: "nordic-store", name: "Nordic Store", category: "E-shop", image: p1, preview: "image" },
  { slug: "corvex", name: "Corvex", category: "Web", image: p2, preview: "image" },
  { slug: "tinesort", name: "Tinesort", category: "SaaS", image: p3, preview: "image" },
  { slug: "patecura", name: "Patecura", category: "Branding", image: p4, preview: "image" },
  { slug: "lumen-studio", name: "Lumen Studio", category: "Web", preview: "web" },
  { slug: "verda-market", name: "Verda Market", category: "E-shop", preview: "eshop" },
  { slug: "northwind", name: "Northwind", category: "Branding", preview: "branding" },
  { slug: "pulse-crm", name: "Pulse CRM", category: "SaaS", preview: "saas" },
];

export const PROJECT_SLUGS: ProjectSlug[] = PROJECTS_BASE.map((p) => p.slug);

type VisualProject = { name: string; preview: ProjectBase["preview"]; image?: string };

export function ProjectVisual({ project, mode = "card" }: { project: VisualProject; mode?: "card" | "hero" }) {
  if (project.preview === "image" && project.image) {
    return (
      <img
        src={project.image}
        alt={project.name}
        loading="lazy"
        decoding="async"
        width={mode === "hero" ? 1400 : 900}
        height={mode === "hero" ? 900 : 675}
        className="h-full w-full object-cover"
      />
    );
  }

  if (project.preview === "web") {
    return (
      <div className="absolute inset-0 p-6 md:p-10 flex flex-col gap-4 bg-gradient-to-br from-primary/18 via-surface to-background">
        <div className="rounded-lg border border-border bg-background/80 overflow-hidden shadow-2xl flex-1">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-surface/70">
            <span className="h-2 w-2 rounded-full bg-primary/70" />
            <span className="h-2 w-2 rounded-full bg-foreground/30" />
            <span className="h-2 w-2 rounded-full bg-foreground/20" />
          </div>
          <div className="p-6 space-y-4">
            <div className="h-4 w-2/3 rounded bg-foreground/25" />
            <div className="h-3 w-5/6 rounded bg-foreground/12" />
            <div className="grid grid-cols-3 gap-3 pt-4">
              <div className="h-24 rounded-md bg-primary/25" />
              <div className="h-24 rounded-md border border-border bg-surface/70" />
              <div className="h-24 rounded-md bg-primary/12" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (project.preview === "eshop") {
    return (
      <div className="absolute inset-0 p-6 md:p-10 grid grid-cols-2 md:grid-cols-3 gap-3 bg-gradient-to-br from-primary/16 via-surface to-background">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-border bg-background/75 overflow-hidden flex flex-col">
            <div className="flex-1 bg-gradient-to-br from-primary/25 to-transparent" />
            <div className="p-3 space-y-2">
              <div className="h-2 rounded bg-foreground/20" />
              <div className="h-2 w-1/2 rounded bg-primary/70" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (project.preview === "branding") {
    return (
      <div className="absolute inset-0 p-6 md:p-10 grid grid-cols-2 gap-4 bg-gradient-to-br from-primary/14 via-surface to-background">
        <div className="rounded-xl border border-border bg-background/75 grid place-items-center">
          <span className="text-7xl font-black tracking-tighter text-primary">N</span>
        </div>
        <div className="rounded-xl border border-primary/30 bg-primary/15 grid place-items-center">
          <span className="text-3xl font-bold text-foreground">north.</span>
        </div>
        <div className="col-span-2 rounded-xl border border-border bg-background/70 p-5 flex items-end gap-3">
          {["bg-primary", "bg-foreground/75", "bg-primary/45", "bg-foreground/20"].map((c) => (
            <div key={c} className={`${c} h-16 flex-1 rounded-md`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 p-6 md:p-10 bg-gradient-to-br from-primary/16 via-surface to-background">
      <div className="h-full rounded-xl border border-border bg-background/75 p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 rounded bg-foreground/25" />
          <div className="h-8 w-8 rounded-lg bg-primary/25" />
        </div>
        <div className="grid grid-cols-3 gap-3 flex-1">
          {[58, 82, 46].map((height, i) => (
            <div key={i} className="rounded-lg border border-border bg-surface/70 p-3 flex items-end">
              <div className="w-full rounded bg-primary/65" style={{ height: `${height}%` }} />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[85, 64, 48].map((width) => (
            <div key={width} className="h-2 rounded bg-foreground/15" style={{ width: `${width}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
