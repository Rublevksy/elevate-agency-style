import { useState, useMemo } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Check,
  Globe,
  ShoppingBag,
  AppWindow,
  RefreshCw,
  HelpCircle,
  Wallet,
  Sparkles,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import { sendContactToTelegram } from "@/lib/telegram.functions";
import { SocialIcons } from "@/components/Socials";
import { toast } from "sonner";

const PROJECT_ICONS = [Globe, ShoppingBag, AppWindow, RefreshCw, HelpCircle];
// Stable numeric budget values (CZK) per BUDGETS index — language-independent
const BUDGET_VALUES = [20000, 50000, 100000, 150000, 0];

type StepKey = 1 | 2 | 3;

export function Contact() {
  const { t } = useT();
  const f = t.contact.form;

  const [step, setStep] = useState<StepKey>(1);
  const [projectTypeIdx, setProjectTypeIdx] = useState<number | null>(null);
  const [budgetIdx, setBudgetIdx] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => (submitted ? 100 : (step / 3) * 100), [step, submitted]);

  const validateContactDetails = (): boolean => {
    const errs: Record<string, string> = {};
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) errs.name = f.errors.required;
    else if (trimmedName.length > 100) errs.name = f.errors.nameMax;
    if (!trimmedEmail) errs.email = f.errors.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) errs.email = f.errors.invalidEmail;
    if (!message.trim()) errs.message = f.errors.describeProject;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    setErrors({});
    if (step === 1) {
      if (projectTypeIdx === null) {
        setErrors({ projectType: f.errors.projectType });
        return;
      }
      setStep(2);
      return;
    }
    if (step === 2) {
      if (!validateContactDetails()) return;
      setStep(3);
      return;
    }
  };

  const goPrev = () => setStep((s) => (s > 1 ? ((s - 1) as StepKey) : s));

  const onSubmit = async () => {
    if (hp) return;
    if (projectTypeIdx === null) {
      setErrors({ projectType: f.errors.projectType });
      setStep(1);
      return;
    }
    if (budgetIdx === null) {
      setErrors({ budget: f.errors.budget });
      return;
    }
    if (!validateContactDetails()) {
      setStep(2);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const projectTypeLabel = f.projectTypes[projectTypeIdx];
      const budgetLabel = f.budgets[budgetIdx];
      const budgetNum = BUDGET_VALUES[budgetIdx] ?? 0;
      await sendContactToTelegram({
        data: {
          name,
          email,
          phone: phone || "",
          service: projectTypeLabel,
          budget: budgetNum,
          message: `[${budgetLabel}]\n${message}`,
        },
      });
      setSubmitted(true);
      toast.success(`${f.successTitle} ${f.successBody}`);
    } catch (err) {
      console.error(err);
      toast.error(f.errors.sendFailed);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setStep(1);
    setProjectTypeIdx(null);
    setBudgetIdx(null);
    setName("");
    setEmail("");
    setPhone("");
    setMessage("");
    setErrors({});
  };

  return (
    <section id="contact" className="py-28 md:py-36 border-t border-border relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-[140px] pointer-events-none" />

      <div className="container-luxe relative">
        <SectionHeading eyebrow="07" title={t.contact.title} subtitle={t.contact.subtitle} />

        <div className="max-w-3xl">
          {submitted ? (
            <div className="relative p-12 md:p-16 rounded-3xl border border-primary/40 bg-surface text-center glow-primary overflow-hidden animate-scale-in">
              <div className="pointer-events-none absolute inset-0 grid place-items-center">
                <span className="absolute h-40 w-40 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                <span
                  className="absolute h-72 w-72 rounded-full border border-primary/30 opacity-60"
                  style={{ animation: "scale-in 700ms ease-out both" }}
                />
                <span
                  className="absolute h-96 w-96 rounded-full border border-primary/15 opacity-40"
                  style={{ animation: "scale-in 900ms ease-out both" }}
                />
              </div>
              <Sparkles
                className="absolute top-8 left-10 h-5 w-5 text-primary/70 animate-pulse"
                strokeWidth={1.5}
              />
              <Sparkles
                className="absolute bottom-12 right-12 h-4 w-4 text-primary/60 animate-pulse"
                strokeWidth={1.5}
                style={{ animationDelay: "400ms" }}
              />

              <div className="relative">
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/15 ring-4 ring-primary/30 animate-scale-in">
                  <Check className="h-12 w-12 text-primary" strokeWidth={3} />
                </div>
                <p className="text-2xl md:text-3xl font-bold text-foreground mb-3 animate-fade-in">
                  {f.successTitle}
                </p>
                <p
                  className="text-sm md:text-base text-muted-foreground mb-8 max-w-md mx-auto animate-fade-in"
                  style={{ animationDelay: "120ms" }}
                >
                  {f.successBody}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="text-xs uppercase tracking-widest text-primary hover:text-foreground transition-colors story-link"
                >
                  {f.sendAgain}
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-3xl border border-border/60 bg-surface/40 backdrop-blur p-6 md:p-10 shadow-2xl animate-fade-in">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground gap-3">
                  <span>
                    {f.stepLabel} <span className="text-primary font-semibold">{step}</span> {f.stepOf}
                  </span>
                  <span className="text-foreground/70 text-right">{f.stepTitles[step - 1]}</span>
                </div>
                <div className="relative h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-primary/60 shadow-[0_0_18px_oklch(0.72_0.18_250/0.7)] transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Step 1 — project type */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in" key="step-1">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 grid place-items-center rounded-full bg-primary/15 text-primary font-bold">
                      1
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{f.stepTitles[0]}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {f.projectTypes.map((label, i) => {
                      const Icon = PROJECT_ICONS[i] ?? HelpCircle;
                      const active = projectTypeIdx === i;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setProjectTypeIdx(i);
                            setErrors({});
                          }}
                          className={`group relative flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all duration-300 ${
                            active
                              ? "border-primary bg-primary/10 text-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_250/0.6)]"
                              : "border-border bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5"
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.6} />
                          <span className="font-medium text-sm">{label}</span>
                          {active && (
                            <span className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground animate-scale-in">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.projectType && <p className="text-xs text-destructive">{errors.projectType}</p>}
                </div>
              )}

              {/* Step 2 — contact info */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in" key="step-2">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 grid place-items-center rounded-full bg-primary/15 text-primary font-bold">
                      2
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{f.stepTitles[1]}</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                        {t.contact.name}
                      </label>
                      <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={100}
                        placeholder={f.namePlaceholder}
                        className={`field-input-pro ${errors.name ? "border-destructive ring-1 ring-destructive/40" : ""}`}
                      />
                      {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                        {t.contact.email}
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        maxLength={255}
                        placeholder={f.emailPlaceholder}
                        className={`field-input-pro ${errors.email ? "border-destructive ring-1 ring-destructive/40" : ""}`}
                      />
                      {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                        {t.contact.phone}
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        maxLength={40}
                        placeholder={f.phonePlaceholder}
                        className="field-input-pro"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                        {f.messageLabel}
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        maxLength={1000}
                        placeholder={f.messagePlaceholder}
                        className={`field-input-pro resize-none ${errors.message ? "border-destructive ring-1 ring-destructive/40" : ""}`}
                      />
                      {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
                    </div>
                  </div>

                  {/* honeypot */}
                  <input
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                    aria-hidden="true"
                  />

                  {/* summary chip */}
                  {projectTypeIdx !== null && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border bg-background/40 text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {f.projectTypes[projectTypeIdx]}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Step 3 — budget */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in" key="step-3">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 grid place-items-center rounded-full bg-primary/15 text-primary font-bold">
                      3
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{f.stepTitles[2]}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground -mt-2">{f.budgetHelp}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {f.budgets.map((label, i) => {
                      const active = budgetIdx === i;
                      const isUnsure = i === f.budgets.length - 1;
                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => {
                            setBudgetIdx(i);
                            setErrors({});
                          }}
                          className={`group relative flex items-center gap-3 px-5 py-5 rounded-xl border text-left transition-all duration-300 ${
                            active
                              ? "border-primary bg-primary/10 text-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_250/0.6)]"
                              : "border-border bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5"
                          }`}
                        >
                          {isUnsure ? (
                            <HelpCircle className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.6} />
                          ) : (
                            <Wallet className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.6} />
                          )}
                          <span className="font-semibold text-foreground tabular-nums">{label}</span>
                          {active && (
                            <span className="absolute top-2 right-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground animate-scale-in">
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {errors.budget && <p className="text-xs text-destructive">{errors.budget}</p>}

                  {/* Summary chips */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-border/60">
                    {projectTypeIdx !== null && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border bg-background/40 text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {f.projectTypes[projectTypeIdx]}
                      </span>
                    )}
                    {name && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border bg-background/40 text-muted-foreground">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {name}
                      </span>
                    )}
                    {budgetIdx !== null && (
                      <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-primary/40 bg-primary/10 text-foreground tabular-nums">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                        {f.budgets[budgetIdx]}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Nav buttons */}
              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 mt-10 pt-6 border-t border-border/60">
                <button
                  type="button"
                  onClick={goPrev}
                  disabled={step === 1}
                  className="inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-muted-foreground border border-border bg-background/40 hover:text-foreground hover:border-primary/50 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {f.back}
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="group inline-flex items-center justify-center gap-3 rounded-xl px-7 py-4 text-base font-bold bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.72_0.18_250/0.6)] hover:shadow-[0_20px_60px_-10px_oklch(0.72_0.18_250/0.8)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {f.next}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className="group inline-flex items-center justify-center gap-3 rounded-xl px-7 py-4 text-base font-bold bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.72_0.18_250/0.6)] hover:shadow-[0_20px_60px_-10px_oklch(0.72_0.18_250/0.8)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? f.sending : f.submit}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">{f.noSpam}</p>
            </div>
          )}

          {/* Direct contact / socials */}
          <div className="mt-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-surface/30 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  {f.directEyebrow}
                </p>
                <p className="text-sm text-foreground/80">{f.directText}</p>
              </div>
              <SocialIcons size="md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
