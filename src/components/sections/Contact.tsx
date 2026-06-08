import { useState, useMemo } from "react";
import { z } from "zod";
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
} from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import { sendContactToTelegram } from "@/server/telegram.functions";
import { SocialIcons } from "@/components/Socials";
import { toast } from "sonner";

const SUCCESS_TITLE: Record<Lang, string> = {
  CZ: "Zpráva odeslána!",
  EN: "Message sent!",
  RU: "Сообщение отправлено!",
  UA: "Повідомлення надіслано!",
};
const SUCCESS_BODY: Record<Lang, string> = {
  CZ: "Ozveme se do 24 hodin.",
  EN: "We'll get back to you within 24 hours.",
  RU: "Ответим в течение 24 часов.",
  UA: "Відповімо протягом 24 годин.",
};
const SEND_AGAIN: Record<Lang, string> = {
  CZ: "Odeslat další zprávu",
  EN: "Send another message",
  RU: "Отправить ещё",
  UA: "Надіслати ще",
};

const PROJECT_TYPES = [
  { id: "Firemní web", icon: Globe },
  { id: "E-shop", icon: ShoppingBag },
  { id: "Webová aplikace", icon: AppWindow },
  { id: "Redesign webu", icon: RefreshCw },
  { id: "Nejsem si jistý", icon: HelpCircle },
] as const;

const BUDGETS = [
  { id: "do 20 000 Kč", value: 20000 },
  { id: "20 000–50 000 Kč", value: 50000 },
  { id: "50 000–100 000 Kč", value: 100000 },
  { id: "100 000+ Kč", value: 150000 },
] as const;

const STEP_TITLES_CZ = ["Jaký projekt řešíte?", "Jaký máte rozpočet?", "Kontaktní údaje"];

const schema = z.object({
  projectType: z.string().min(1, "Vyberte typ projektu"),
  budget: z.string().min(1, "Vyberte rozpočet"),
  name: z.string().trim().min(1, "Toto pole je povinné").max(100),
  email: z.string().trim().min(1, "Toto pole je povinné").email("Neplatný e-mail").max(255),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().min(1, "Popište prosím projekt").max(1000),
});

type StepKey = 1 | 2 | 3;

export function Contact() {
  const { t, lang } = useT();
  const [step, setStep] = useState<StepKey>(1);
  const [projectType, setProjectType] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const progress = useMemo(() => (submitted ? 100 : ((step - 1) / 3) * 100 + 33), [step, submitted]);

  const goNext = () => {
    setErrors({});
    if (step === 1 && !projectType) {
      setErrors({ projectType: "Vyberte typ projektu" });
      return;
    }
    if (step === 2 && !budget) {
      setErrors({ budget: "Vyberte rozpočet" });
      return;
    }
    setStep((s) => (s < 3 ? ((s + 1) as StepKey) : s));
  };

  const goPrev = () => setStep((s) => (s > 1 ? ((s - 1) as StepKey) : s));

  const onSubmit = async () => {
    if (hp) return;
    const data = { projectType, budget, name, email, phone, message };
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      const budgetNum = BUDGETS.find((b) => b.id === budget)?.value ?? 0;
      await sendContactToTelegram({
        data: {
          name,
          email,
          phone: phone || "",
          service: projectType,
          budget: budgetNum,
          message: `[${budget}]\n${message}`,
        },
      });
      setSubmitted(true);
      toast.success(`${SUCCESS_TITLE[lang]} ${SUCCESS_BODY[lang]}`);
    } catch (err) {
      console.error(err);
      toast.error("Nepodařilo se odeslat. Zkuste to prosím znovu.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setSubmitted(false);
    setStep(1);
    setProjectType("");
    setBudget("");
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
            <div className="p-12 md:p-16 rounded-3xl border border-primary/40 bg-surface text-center glow-primary animate-scale-in">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 ring-4 ring-primary/30">
                <Check className="h-10 w-10 text-primary animate-scale-in" strokeWidth={3} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">{SUCCESS_TITLE[lang]}</p>
              <p className="text-sm text-muted-foreground mb-8">{SUCCESS_BODY[lang]}</p>
              <button
                type="button"
                onClick={reset}
                className="text-xs uppercase tracking-widest text-primary hover:text-foreground transition-colors story-link"
              >
                {SEND_AGAIN[lang]}
              </button>
            </div>
          ) : (
            <div className="rounded-3xl border border-border/60 bg-surface/40 backdrop-blur p-6 md:p-10 shadow-2xl animate-fade-in">
              {/* Progress bar */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-3 text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                  <span>
                    Krok <span className="text-primary font-semibold">{step}</span> ze 3
                  </span>
                  <span className="text-foreground/70">{STEP_TITLES_CZ[step - 1]}</span>
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
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 grid place-items-center rounded-full bg-primary/15 text-primary font-bold">
                      1
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{STEP_TITLES_CZ[0]}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {PROJECT_TYPES.map(({ id, icon: Icon }) => {
                      const active = projectType === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setProjectType(id);
                            setErrors({});
                          }}
                          className={`group relative flex items-center gap-3 px-5 py-4 rounded-xl border text-left transition-all duration-300 ${
                            active
                              ? "border-primary bg-primary/10 text-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_250/0.6)]"
                              : "border-border bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5"
                          }`}
                        >
                          <Icon className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.6} />
                          <span className="font-medium text-sm">{id}</span>
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

              {/* Step 2 — budget */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 grid place-items-center rounded-full bg-primary/15 text-primary font-bold">
                      2
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{STEP_TITLES_CZ[1]}</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {BUDGETS.map(({ id }) => {
                      const active = budget === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            setBudget(id);
                            setErrors({});
                          }}
                          className={`group relative flex items-center gap-3 px-5 py-5 rounded-xl border text-left transition-all duration-300 ${
                            active
                              ? "border-primary bg-primary/10 text-foreground shadow-[0_10px_30px_-10px_oklch(0.72_0.18_250/0.6)]"
                              : "border-border bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5"
                          }`}
                        >
                          <Wallet className="h-5 w-5 shrink-0 text-primary" strokeWidth={1.6} />
                          <span className="font-semibold text-foreground tabular-nums">{id}</span>
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
                </div>
              )}

              {/* Step 3 — contact info */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <span className="h-8 w-8 grid place-items-center rounded-full bg-primary/15 text-primary font-bold">
                      3
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{STEP_TITLES_CZ[2]}</h3>
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
                        placeholder="Jan Novák"
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
                        placeholder="jan@firma.cz"
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
                        placeholder="+420 777 123 456"
                        className="field-input-pro"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                        Popis projektu
                      </label>
                      <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={5}
                        maxLength={1000}
                        placeholder="Napište nám pár vět o vašem projektu a cílech."
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
                  <div className="flex flex-wrap gap-2 pt-2">
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border bg-background/40 text-muted-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {projectType}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest px-3 py-1.5 rounded-full border border-border bg-background/40 text-muted-foreground tabular-nums">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {budget}
                    </span>
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
                  Zpět
                </button>
                {step < 3 ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="group inline-flex items-center justify-center gap-3 rounded-xl px-7 py-4 text-base font-bold bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.72_0.18_250/0.6)] hover:shadow-[0_20px_60px_-10px_oklch(0.72_0.18_250/0.8)] hover:-translate-y-0.5 transition-all duration-300"
                  >
                    Pokračovat
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={onSubmit}
                    disabled={loading}
                    className="group inline-flex items-center justify-center gap-3 rounded-xl px-7 py-4 text-base font-bold bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.72_0.18_250/0.6)] hover:shadow-[0_20px_60px_-10px_oklch(0.72_0.18_250/0.8)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? "Odesílám..." : "Odeslat poptávku"}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                )}
              </div>

              <p className="text-xs text-center text-muted-foreground mt-4">{t.ui.contactNoSpam}</p>
            </div>
          )}

          {/* Direct contact / socials */}
          <div className="mt-10 p-6 md:p-8 rounded-2xl border border-border/60 bg-surface/30 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground mb-2">
                  Nebo nás kontaktujte přímo
                </p>
                <p className="text-sm text-foreground/80">Telefon, e-mail nebo sociální sítě — odpovídáme rychle.</p>
              </div>
              <SocialIcons size="md" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
