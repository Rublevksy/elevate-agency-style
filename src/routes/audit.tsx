import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, Clock, ShieldCheck, Sparkles, AlertCircle } from "lucide-react";
import { sendAuditRequest } from "@/lib/audit.functions";
import { Events } from "@/lib/analytics";
import { useT } from "@/lib/i18n";

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

const PERK_ICONS = [Sparkles, ShieldCheck, CheckCircle2, Clock];

type FormValues = { name: string; email: string; website: string; goal: string };
type FieldErrors = Partial<Record<keyof FormValues, string>>;

// Permissive URL: accepts "example.com" or full URL; we prepend https:// on submit.
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[a-z]{2,}(\/.*)?$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function AuditPage() {
  const { t } = useT();
  const send = useServerFn(sendAuditRequest);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [values, setValues] = useState<FormValues>({ name: "", email: "", website: "", goal: "" });
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});

  const errors = useMemo<FieldErrors>(() => {
    const e: FieldErrors = {};
    const f = t.forms;
    if (!values.name.trim()) e.name = f.required;
    if (!values.email.trim()) e.email = f.required;
    else if (!EMAIL_RE.test(values.email.trim())) e.email = f.invalidEmail;
    if (!values.website.trim()) e.website = f.required;
    else if (!URL_RE.test(values.website.trim())) e.website = f.invalidUrl;
    if (values.goal.length > 2000) e.goal = f.tooLong;
    return e;
  }, [values, t.forms]);

  const showErr = (k: keyof FormValues) => Boolean(touched[k] && errors[k]);

  const onChange = (k: keyof FormValues) => (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValues((v) => ({ ...v, [k]: ev.target.value }));
  };
  const onBlur = (k: keyof FormValues) => () => setTouched((s) => ({ ...s, [k]: true }));

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ name: true, email: true, website: true, goal: true });
    if (Object.keys(errors).length > 0) return;

    setStatus("sending");
    setServerError(null);
    Events.formStart("audit");
    Events.auditCtaClick("audit_form_submit");

    const websiteRaw = values.website.trim();
    const website = /^https?:\/\//i.test(websiteRaw) ? websiteRaw : `https://${websiteRaw}`;

    try {
      await send({
        data: {
          name: values.name.trim(),
          email: values.email.trim(),
          website,
          goal: values.goal.trim(),
        },
      });
      Events.formSubmit("audit", true);
      setStatus("ok");
      setValues({ name: "", email: "", website: "", goal: "" });
      setTouched({});
    } catch {
      Events.formSubmit("audit", false);
      setStatus("error");
      setServerError(t.forms.genericError);
    }
  };

  const inputBase =
    "w-full h-12 rounded-lg border bg-background/60 px-4 text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200";
  const inputOk = "border-border focus:border-primary focus:ring-2 focus:ring-primary/20";
  const inputErr =
    "border-destructive/70 ring-2 ring-destructive/15 shadow-[0_0_0_3px_color-mix(in_oklab,var(--destructive)_18%,transparent)]";

  return (
    <>
      <section className="page-top pb-12 md:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_70%)]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[160px]" />
        <div className="container-luxe relative max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/10 text-[11px] uppercase tracking-[0.2em] text-primary mb-8">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            {t.audit.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.05] mb-8">
            {t.audit.h1a}
            <br />
            <span className="text-primary">{t.audit.h1b}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl">
            {t.audit.sub}
          </p>
        </div>
      </section>

      <section className="pb-28 md:pb-36">
        <div className="container-luxe max-w-5xl">
          <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-start">
            {/* Perks */}
            <div>
              <h2 className="text-[11px] uppercase tracking-[0.25em] text-primary mb-6">
                {t.audit.perksTitle}
              </h2>
              <ul className="space-y-6">
                {t.audit.perks.map((p, i) => {
                  const Icon = PERK_ICONS[i] ?? Sparkles;
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
                <p className="text-sm text-foreground font-medium mb-2">{t.audit.sideTitle}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.audit.sideDesc}</p>
                <Link
                  to="/contact"
                  onClick={() => Events.consultationCtaClick("audit_page_secondary")}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-foreground transition-colors"
                >
                  {t.audit.sideCta}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Form card */}
            <div className="p-8 md:p-10 rounded-2xl border border-primary/30 bg-surface/60 backdrop-blur-sm">
              {status === "ok" ? (
                <div className="text-center py-12 animate-[fade-in_0.5s_ease-out]">
                  <div className="mx-auto h-14 w-14 rounded-full bg-primary/15 grid place-items-center mb-6 animate-[scale-in_0.4s_cubic-bezier(0.22,1,0.36,1)]">
                    <CheckCircle2 className="h-7 w-7 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground mb-3">{t.audit.form.successTitle}</h2>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                    {t.audit.form.successDesc}
                  </p>
                </div>
              ) : (
                <form onSubmit={onSubmit} noValidate className="space-y-5">
                  {/* Name */}
                  <div>
                    <label htmlFor="audit-name" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      {t.audit.form.name}
                    </label>
                    <input
                      id="audit-name"
                      name="name"
                      autoComplete="name"
                      maxLength={100}
                      value={values.name}
                      onChange={onChange("name")}
                      onBlur={onBlur("name")}
                      aria-invalid={showErr("name") || undefined}
                      aria-describedby={showErr("name") ? "err-name" : undefined}
                      className={`${inputBase} ${showErr("name") ? inputErr : inputOk}`}
                      placeholder={t.audit.form.namePh}
                    />
                    {showErr("name") && (
                      <p id="err-name" className="mt-2 flex items-center gap-1.5 text-xs text-destructive animate-[fade-in_0.2s_ease-out]">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="audit-email" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      {t.audit.form.email}
                    </label>
                    <input
                      id="audit-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      maxLength={255}
                      value={values.email}
                      onChange={onChange("email")}
                      onBlur={onBlur("email")}
                      aria-invalid={showErr("email") || undefined}
                      aria-describedby={showErr("email") ? "err-email" : undefined}
                      className={`${inputBase} ${showErr("email") ? inputErr : inputOk}`}
                      placeholder={t.audit.form.emailPh}
                    />
                    {showErr("email") && (
                      <p id="err-email" className="mt-2 flex items-center gap-1.5 text-xs text-destructive animate-[fade-in_0.2s_ease-out]">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.email}
                      </p>
                    )}
                  </div>

                  {/* Website */}
                  <div>
                    <label htmlFor="audit-website" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      {t.audit.form.website}
                    </label>
                    <input
                      id="audit-website"
                      name="website"
                      inputMode="url"
                      maxLength={255}
                      value={values.website}
                      onChange={onChange("website")}
                      onBlur={onBlur("website")}
                      aria-invalid={showErr("website") || undefined}
                      aria-describedby={showErr("website") ? "err-website" : undefined}
                      className={`${inputBase} ${showErr("website") ? inputErr : inputOk}`}
                      placeholder={t.audit.form.websitePh}
                    />
                    {showErr("website") && (
                      <p id="err-website" className="mt-2 flex items-center gap-1.5 text-xs text-destructive animate-[fade-in_0.2s_ease-out]">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.website}
                      </p>
                    )}
                  </div>

                  {/* Goal */}
                  <div>
                    <label htmlFor="audit-goal" className="block text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                      {t.audit.form.goal} <span className="opacity-60">{t.audit.form.goalOpt}</span>
                    </label>
                    <textarea
                      id="audit-goal"
                      name="goal"
                      rows={4}
                      maxLength={2000}
                      value={values.goal}
                      onChange={onChange("goal")}
                      onBlur={onBlur("goal")}
                      aria-invalid={showErr("goal") || undefined}
                      className={`w-full rounded-lg border bg-background/60 px-4 py-3 text-foreground placeholder:text-muted-foreground/60 focus:outline-none transition-all duration-200 resize-y ${
                        showErr("goal") ? inputErr : inputOk
                      }`}
                      placeholder={t.audit.form.goalPh}
                    />
                    {showErr("goal") && (
                      <p className="mt-2 flex items-center gap-1.5 text-xs text-destructive animate-[fade-in_0.2s_ease-out]">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {errors.goal}
                      </p>
                    )}
                  </div>

                  {serverError && (
                    <div
                      role="alert"
                      className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 animate-[fade-in_0.25s_ease-out]"
                    >
                      <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                      <span>{serverError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="btn-primary w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === "sending" ? (
                      <>
                        <span className="inline-block h-4 w-4 rounded-full border-2 border-current border-r-transparent animate-spin" />
                        {t.audit.form.sending}
                      </>
                    ) : (
                      <>
                        {t.audit.form.submit}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-muted-foreground text-center pt-2">
                    {t.audit.form.privacy}
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
