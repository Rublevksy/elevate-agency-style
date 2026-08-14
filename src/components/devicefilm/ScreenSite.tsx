import logo from "@/assets/elevate-logo.png";
import shot1 from "@/assets/portfolio-1.jpg";
import shot2 from "@/assets/portfolio-2.jpg";
import shot3 from "@/assets/portfolio-3.jpg";

const WORK = [
  { img: shot1, name: "Biodent", kind: "Web · Klinika", metric: "+38 % poptávek" },
  { img: shot2, name: "InHome", kind: "E-shop · Interiér", metric: "+26 % obrat" },
  { img: shot3, name: "Nordic Studio", kind: "Brand · Identita", metric: "0,9 s LCP" },
];

/**
 * The ELEVATE interface that physically lives on the laptop display, and then
 * becomes the viewport itself at handoff — the same React tree, so nothing
 * visibly swaps. Deliberately a WORK view, so it never competes with the hero
 * headline: the visitor reads it as the studio's real output.
 * Type scales with the surface (container queries), so it reads at any size.
 */
export function ScreenSite() {
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden bg-[#06080d] text-foreground"
      style={{ containerType: "size" }}
    >
      {/* navigation */}
      <div className="flex items-center justify-between border-b border-white/[0.06] px-[4%] py-[2.2%]">
        <img src={logo} alt="" className="h-[2.4cqw] w-auto opacity-90" />
        <div className="flex items-center gap-[3.4%] text-[1.05cqw] tracking-[0.18em] text-muted-foreground">
          <span>Služby</span>
          <span className="text-foreground/85">Práce</span>
          <span>Studio</span>
          <span className="rounded-full bg-primary px-[1.3em] py-[0.5em] text-primary-foreground">Audit</span>
        </div>
      </div>

      {/* work index */}
      <div className="flex min-h-0 flex-1 flex-col px-[4%] py-[3%]">
        <div className="flex items-end justify-between">
          <div>
            <span className="font-mono text-[0.95cqw] uppercase tracking-[0.4em] text-primary">Vybraná práce</span>
            <h2 className="mt-[0.6cqw] text-[2.6cqw] font-medium leading-[1.05] tracking-[-0.03em] text-foreground">
              Digitální produkty, které měříme výsledky.
            </h2>
          </div>
          <span className="font-mono text-[0.9cqw] uppercase tracking-[0.26em] text-muted-foreground">2024 — 2026</span>
        </div>

        <div className="mt-[3%] grid min-h-0 flex-1 grid-cols-3 gap-[2.4%]">
          {WORK.map((w) => (
            <div
              key={w.name}
              className="flex min-h-0 flex-col overflow-hidden rounded-[0.7cqw] border border-white/[0.07] bg-white/[0.015]"
            >
              <div className="relative min-h-0 flex-1 overflow-hidden">
                <img src={w.img} alt="" className="h-full w-full object-cover opacity-70 grayscale" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#06080d] via-transparent to-transparent" />
              </div>
              <div className="flex items-center justify-between px-[7%] py-[6%]">
                <div>
                  <div className="text-[1.25cqw] font-medium text-foreground">{w.name}</div>
                  <div className="font-mono text-[0.85cqw] uppercase tracking-[0.22em] text-muted-foreground">
                    {w.kind}
                  </div>
                </div>
                <span className="text-[0.95cqw] text-primary">{w.metric}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-[2.6%] flex items-center justify-between border-t border-white/[0.06] pt-[2.2%]">
          <div className="flex items-center gap-[4%] text-[1cqw] text-muted-foreground">
            <span>Strategie</span>
            <span>UX / UI</span>
            <span>Vývoj</span>
            <span>Růst</span>
          </div>
          <span className="rounded-full bg-primary px-[1.6em] py-[0.55em] text-[1.05cqw] text-primary-foreground">
            Audit do 48 hodin
          </span>
        </div>
      </div>
    </div>
  );
}
