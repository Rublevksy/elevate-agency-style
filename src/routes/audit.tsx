import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { sendAuditRequest } from "@/server/audit.functions";
import { Events } from "@/lib/analytics";

export const Route = createFileRoute("/audit")({
  component: AuditPage,
  head: () => ({
    meta: [
      { title: "Audit zdarma — ElevateIT" },
      {
        name: "description",
        content:
          "Nezávazný audit vašeho webu. Konkrétní pohled na UX, výkon a konverzní potenciál do 48 hodin. Žádný spam, žádné šablonové reporty.",
      },
      { property: "og:title", content: "Audit zdarma — ElevateIT" },
      {
        property: "og:description",
        content:
          "Nezávazný audit vašeho webu — UX, výkon, konverzní potenciál. Odpovíme do 48 hodin.",
      },
      { property: "og:url", content: "https://elevateit.cz/audit" },
    ],
    links: [{ rel: "canonical", href: "https://elevateit.cz/audit" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Service",
          serviceType: "Audit webu",
          name: "Audit webu zdarma",
          provider: { "@type": "Organization", name: "ElevateIT" },
          areaServed: "CZ",
          description:
            "Nezávazný UX a konverzní audit webu. Výsledek do 48 hodin, doručeno písemně.",
          offers: { "@type": "Offer", price: "0", priceCurrency: "CZK" },
        }),
      },
    ],
  }),
});

const PERKS = [
  { icon: Sparkles, t: "UX a vizuální audit", d: "Hierarchie, CTA flow, čitelnost a důvěra na první pohled." },
  { icon: ShieldCheck, t: "Výkon a SEO", d: "Rychlost, Core Web Vitals, technické SEO základy." },
  { icon: CheckCircle2, t: "Konverzní příležitosti", d: "Konkrétní místa, kde web ztrácí návštěvníky a peníze." },
  { icon: Clock, t: "Výsledek do 48 hodin", d: "Strukturovaný report s prioritizovanými doporučeními." },
];

function AuditPage() {
  const send = useServerFn(sendAuditRequest);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    Events.formStart("audit");
    const form = e.currentTarget;
    const fd = new FormData(form);
    try {
      await send({
        data: {
          name: String(fd.get("name") ?? "").trim(),
          email: String(fd.get("email") ?? "").trim(),
          website: String(fd.get("website") ?? "").trim(),
          goal: String(fd.get("goal") ?? "").trim(),
        },
      });
      Events.formSubmit("audit", true);
      setStatus("ok");
      form.reset();
    } catch (err) {
      Events.formSubmit("audit", false);
      setStatus("error");
      setError(err instanceof Error ? err.message : "Něco se nepodařilo. Zkuste to prosím znovu.");
    }
  };

  return (
    <>
      <section className="page-top pb-12 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[160px]" />
        <div className="container-luxe relative max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-[11px] uppercase tracking-[0.2em] text-primary mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            Zdarma · bez závazku
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-8">
            Audit vašeho webu.
            <br />
            <span className="text-primary">Konkrétně, do 48 hodin.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            Pošlete URL — dostanete strukturovaný report s pohledem na UX, výkon a konverzní potenciál. Žádné generické PDF, žádný sales hovor, pokud o něj nepožádáte.
          </p>
        </div>
      </section>

      <section className="pb-28 md:pb-36">
        <div className="container-luxe max-w-5xl">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
            {/* Perks */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.25em] text-primary mb-6">
                Co v auditu řešíme
              </p>
              <ul className="space-y-6">
                {PERKS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <li key={p.t} className="flex gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-lg border border-border bg-surface/60 grid place-items-center text-primary">
                        <Icon className="h-5 w-5" strokeWidth={1.6} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground mb-1">{p.t}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{p.d}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <div className="mt-12 p-6 rounded-xl border border-border bg-surface/40">
                <p className="text-sm text-foreground font-medium mb-2">
                  Nehodí se vám audit? Pojďme si jen promluvit.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  30 minut nezávazné konzultace o vašem projektu — bez prezentací, bez tlaku.
                </p>
                <Link
                  to="/contact"
                  onClick={() => Events.consultationCtaClick("audit_page_secondary")}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-foreground transition-colors"
                >
                  Domluvit konzultaci
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Form */}
            <div className="p-8 md:p-10 rounded-2xl border border-primary/30 bg-surface/60 backdrop-blur-sm">
              {status === "ok" ? (
                <div className="text-center py-12">
                  <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 grid place-items-center mb-6">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">Děkujeme.</h2>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    Žádost máme. Ozveme se na zadaný e-mail s auditem nejpozději do 48 hodin (typicky dřív).
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} className="space-y-5">
                  <div>
                    <label htmlFor="audit-name" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Jméno
                    </label>
                    <input
                      id="audit-name"
                      name="name"
                      required
                      maxLength={100}
                      autoComplete="name"
                      className="w-full h-12 rounded-lg border border-border bg-background/60 px-4 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                      placeholder="Jan Novák"
                    />
                  </div>
                  <div>
                    <label htmlFor="audit-email" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      E-mail
                    </label>
                    <input
                      id="audit-email"
                      name="email"
                      type="email"
                      required
                      maxLength={255}
                      autoComplete="email"
                      className="w-full h-12 rounded-lg border border-border bg-background/60 px-4 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                      placeholder="vy@firma.cz"
                    />
                  </div>
                  <div>
                    <label htmlFor="audit-website" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      URL webu k auditu
                    </label>
                    <input
                      id="audit-website"
                      name="website"
                      required
                      maxLength={255}
                      inputMode="url"
                      className="w-full h-12 rounded-lg border border-border bg-background/60 px-4 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors"
                      placeholder="https://vasweb.cz"
                    />
                  </div>
                  <div>
                    <label htmlFor="audit-goal" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      Co od webu očekáváte? <span className="opacity-60">(volitelné)</span>
                    </label>
                    <textarea
                      id="audit-goal"
                      name="goal"
                      rows={4}
                      maxLength={2000}
                      className="w-full rounded-lg border border-border bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none transition-colors resize-y"
                      placeholder="Více poptávek, vyšší konverze, modernější vizuál…"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    onClick={() => Events.auditCtaClick("audit_form_submit")}
                    className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? "Odesílám…" : "Získat audit zdarma"}
                    {status !== "sending" && <ArrowRight className="h-4 w-4" />}
                  </button>

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    Žádný spam. Vaše data používáme jen pro odpověď na tuto žádost.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
