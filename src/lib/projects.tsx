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

export type ProjectCase = {
  slug: ProjectSlug;
  name: string;
  category: "Web" | "E-shop" | "Branding" | "SaaS";
  description: string;
  result: string;
  image?: string;
  preview: "image" | "web" | "eshop" | "branding" | "saas";
  problem: string;
  solution: string;
  work: string[];
  results: { value: string; label: string }[];
};

export const PROJECTS: ProjectCase[] = [
  {
    slug: "nordic-store",
    name: "Nordic Store",
    category: "E-shop",
    description: "Redesign módního e-shopu s důrazem na rychlejší nákup a vyšší konverze.",
    result: "+120% konverze",
    image: p1,
    preview: "image",
    problem: "E-shop měl vysokou návštěvnost, ale zákazníci odcházeli z produktových stránek a nedokončovali objednávky.",
    solution: "Zjednodušili jsme kategorii, produktový detail i checkout. Přidali jsme jasné signály důvěry a rychlejší cestu k nákupu.",
    work: ["UX audit a nákupní cesta", "Redesign produktových stránek", "Vývoj rychlého e-shopu", "Konverzní optimalizace checkoutu"],
    results: [
      { value: "+120%", label: "konverze" },
      { value: "+80%", label: "organická návštěvnost" },
      { value: "−38%", label: "opuštěných košíků" },
    ],
  },
  {
    slug: "corvex",
    name: "Corvex",
    category: "Web",
    description: "Firemní web pro technologickou společnost, který jasně vysvětluje nabídku a generuje leady.",
    result: "+45% poptávek",
    image: p2,
    preview: "image",
    problem: "Původní web působil nejasně, nepředával důvěru a návštěvníci nerozuměli hodnotě služby.",
    solution: "Postavili jsme nový obsahový tok, silnější vizuální hierarchii a kontaktní body na klíčových místech webu.",
    work: ["Informační architektura", "UX/UI web design", "Frontend vývoj", "SEO základ a měření poptávek"],
    results: [
      { value: "+45%", label: "poptávek" },
      { value: "<2s", label: "načtení stránky" },
      { value: "+32%", label: "čas na webu" },
    ],
  },
  {
    slug: "tinesort",
    name: "Tinesort",
    category: "SaaS",
    description: "Produktové UI a onboarding pro B2B platformu, která potřebovala rychleji aktivovat nové uživatele.",
    result: "+40% retence",
    image: p3,
    preview: "image",
    problem: "Noví uživatelé se ztráceli v produktu a aktivace po registraci byla příliš nízká.",
    solution: "Navrhli jsme přehlednější dashboard, onboarding kroky a UI systém pro další rozvoj produktu.",
    work: ["Produktový UX výzkum", "SaaS dashboard", "Onboarding flow", "Design systém"],
    results: [
      { value: "+40%", label: "retence" },
      { value: "−30%", label: "churn" },
      { value: "+50%", label: "aktivace" },
    ],
  },
  {
    slug: "patecura",
    name: "Patecura",
    category: "Branding",
    description: "Kompletní identita pro prémiovou wellness značku — logo, barvy, typografie a brand manuál.",
    result: "Kompletní identita",
    image: p4,
    preview: "image",
    problem: "Značka působila nekonzistentně a v digitální komunikaci nebyla snadno rozpoznatelná.",
    solution: "Vytvořili jsme jednotný vizuální systém s jasnými pravidly pro web, tisk i sociální sítě.",
    work: ["Strategie značky", "Logo systém", "Barevná paleta a typografie", "Brand manuál"],
    results: [
      { value: "100%", label: "konzistence" },
      { value: "+ důvěra", label: "při prvním kontaktu" },
      { value: "ready", label: "pro web i tisk" },
    ],
  },
  {
    slug: "lumen-studio",
    name: "Lumen Studio",
    category: "Web",
    description: "Prezentační web pro architektonické studio s důrazem na portfolio, důvěru a poptávky.",
    result: "+95% poptávek",
    preview: "web",
    problem: "Studio mělo kvalitní práci, ale web nepůsobil prémiově a nevedl návštěvníky ke konzultaci.",
    solution: "Navrhli jsme vizuální portfolio systém, jasné služby a kontaktní CTA v návaznosti na typ projektu.",
    work: ["UX struktura portfolia", "Prémiový web design", "Rychlý frontend", "SEO pro lokální služby"],
    results: [
      { value: "+95%", label: "poptávek" },
      { value: "+52%", label: "zobrazení projektů" },
      { value: "<2s", label: "rychlost" },
    ],
  },
  {
    slug: "verda-market",
    name: "Verda Market",
    category: "E-shop",
    description: "Bio e-shop optimalizovaný pro mobilní nákupy, opakované objednávky a rychlý checkout.",
    result: "+60% obrat",
    preview: "eshop",
    problem: "Mobilní zákazníci nedokončovali nákup a produktová nabídka byla špatně filtrovatelná.",
    solution: "Zjednodušili jsme katalog, filtry, produktové karty i checkout s důrazem na opakovaný nákup.",
    work: ["Mobilní UX e-shopu", "Produktový grid", "Filtry a vyhledávání", "Měření objednávek"],
    results: [
      { value: "+60%", label: "obrat" },
      { value: "+34%", label: "mobilní konverze" },
      { value: "−28%", label: "opuštění košíku" },
    ],
  },
  {
    slug: "northwind",
    name: "Northwind",
    category: "Branding",
    description: "Rebrand logistické firmy, který sjednotil vizuální styl napříč webem, prezentacemi a obchodem.",
    result: "Kompletní rebrand",
    preview: "branding",
    problem: "Firma rostla, ale její vizuální komunikace působila roztříštěně a neodpovídala velikosti byznysu.",
    solution: "Vytvořili jsme moderní identitu, systém loga a jasná pravidla pro obchodní materiály i web.",
    work: ["Brand audit", "Logo a symbol", "Vizuální systém", "Obchodní prezentace"],
    results: [
      { value: "1 systém", label: "pro všechny kanály" },
      { value: "+ důvěra", label: "u B2B klientů" },
      { value: "30+", label: "brand assetů" },
    ],
  },
  {
    slug: "pulse-crm",
    name: "Pulse CRM",
    category: "SaaS",
    description: "Dashboard a onboarding flow pro CRM produkt, který potřeboval rychlejší aktivaci týmů.",
    result: "+50% aktivace",
    preview: "saas",
    problem: "Uživatelé po registraci neviděli jasný další krok a týmy produkt nasazovaly příliš pomalu.",
    solution: "Navrhli jsme nový dashboard, onboarding checklist a metriky, které vedou uživatele k první hodnotě.",
    work: ["UX audit aplikace", "Dashboard UI", "Onboarding checklist", "Design komponent"],
    results: [
      { value: "+50%", label: "aktivace" },
      { value: "−35%", label: "čas k první hodnotě" },
      { value: "+22%", label: "týmové přijetí" },
    ],
  },
];

export const PROJECT_SLUGS = PROJECTS.map((project) => project.slug);

export function ProjectVisual({ project, mode = "card" }: { project: ProjectCase; mode?: "card" | "hero" }) {
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
