import { useState, type FormEvent } from "react";
import { z } from "zod";
import { ArrowRight, Globe, ShoppingBag, Sparkles, Shield, Check } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import { sendContactToTelegram } from "@/server/telegram.functions";
import { toast } from "sonner";

const SERVICES = [
  { id: "Web", label: "Web", icon: Globe },
  { id: "E-shop", label: "E-shop", icon: ShoppingBag },
  { id: "Branding", label: "Branding", icon: Sparkles },
] as const;

const BUDGET_MIN = 10000;
const BUDGET_MAX = 100000;
const BUDGET_STEP = 5000;

const formatCZK = (n: number) =>
  new Intl.NumberFormat("cs-CZ", { maximumFractionDigits: 0 }).format(n) + " Kč";

export function Contact() {
  const { t, lang } = useT();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [service, setService] = useState<string>("");
  const [budget, setBudget] = useState<number>(35000);
  const [captcha, setCaptcha] = useState(false);

  const schema = z.object({
    name: z.string().trim().min(1, "Zadejte jméno").max(100),
    email: z.string().trim().email("Neplatný e-mail").max(255),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    service: z.string().min(1, "Vyberte službu"),
    message: z.string().trim().min(1, "Napište zprávu").max(1000),
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    data.service = service;
    const result = schema.safeParse(data);
    const errs: Record<string, string> = {};
    if (!result.success) {
      for (const issue of result.error.issues) errs[issue.path[0] as string] = issue.message;
    }
    if (!captcha) errs.captcha = "Potvrďte, že nejste robot";
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    try {
      await sendContactToTelegram({
        data: {
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone || "",
          service,
          budget,
          message: result.data.message,
        },
      });
      e.currentTarget.reset();
      setService("");
      setBudget(35000);
      setCaptcha(false);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast.error("Zprávu se nepodařilo odeslat. Zkuste to prosím znovu.");
    } finally {
      setLoading(false);
    }
  };

  const sendingLabel: Record<string, string> = {
    CZ: "Odesílám...",
    EN: "Sending...",
    RU: "Отправка...",
    UA: "Надсилаю...",
  };

  const budgetPct = ((budget - BUDGET_MIN) / (BUDGET_MAX - BUDGET_MIN)) * 100;

  return (
    <section id="contact" className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="07" title={t.contact.title} subtitle={t.contact.subtitle} />

        <div className="max-w-3xl">
          {submitted ? (
            <div className="p-12 md:p-16 rounded-3xl border border-primary/40 bg-surface text-center glow-primary animate-scale-in">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-primary/15 ring-4 ring-primary/30">
                <Check className="h-10 w-10 text-primary animate-scale-in" strokeWidth={3} />
              </div>
              <p className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Zpráva byla odeslána
              </p>
              <p className="text-sm text-muted-foreground">
                Ozveme se vám do 24 hodin.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="mt-8 text-xs uppercase tracking-widest text-primary hover:text-foreground transition-colors story-link"
              >
                Odeslat další zprávu
              </button>
            </div>
          ) : (
            <>
            <p className="text-sm md:text-base text-muted-foreground mb-6 flex items-center gap-2">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Ozveme se do 24 hodin. Nezávazně a zdarma.
            </p>
            <form
              onSubmit={onSubmit}
              className="rounded-3xl border border-border/60 bg-surface/40 backdrop-blur p-6 md:p-10 space-y-10 shadow-2xl"
            >
              {/* Group: Contact */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    01 — Kontakt
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="group">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      {t.contact.name}
                    </label>
                    <input
                      name="name"
                      maxLength={100}
                      placeholder="Jan Novák"
                      className="field-input-pro"
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive mt-1">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      {t.contact.email}
                    </label>
                    <input
                      name="email"
                      type="email"
                      maxLength={255}
                      placeholder="jan@firma.cz"
                      className="field-input-pro"
                    />
                    {errors.email && (
                      <p className="text-xs text-destructive mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                      {t.contact.phone}
                    </label>
                    <input
                      name="phone"
                      maxLength={40}
                      placeholder="+420 777 123 456"
                      className="field-input-pro"
                    />
                  </div>
                </div>
              </div>

              {/* Group: Service */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    02 — Služba
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {SERVICES.map(({ id, label, icon: Icon }) => {
                    const active = service === id;
                    return (
                      <button
                        type="button"
                        key={id}
                        onClick={() => setService(id)}
                        className={`relative flex items-center justify-center gap-2 px-5 py-4 rounded-xl border transition-all duration-300 ${
                          active
                            ? "border-primary bg-primary/10 text-foreground glow-primary"
                            : "border-border bg-background/40 text-muted-foreground hover:border-primary/50 hover:text-foreground hover:-translate-y-0.5"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="font-medium">{label}</span>
                        {active && (
                          <Check className="h-4 w-4 text-primary absolute top-2 right-2" />
                        )}
                      </button>
                    );
                  })}
                </div>
                {errors.service && (
                  <p className="text-xs text-destructive">{errors.service}</p>
                )}
              </div>

              {/* Group: Budget */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    03 — Rozpočet
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div className="rounded-2xl border border-border bg-background/40 p-6">
                  <div className="flex items-baseline justify-between mb-5">
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">
                      Orientační rozpočet
                    </span>
                    <span className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                      {formatCZK(budget)}
                    </span>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-border overflow-hidden pointer-events-none">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-primary/60 transition-all"
                        style={{ width: `${budgetPct}%` }}
                      />
                    </div>
                    <input
                      type="range"
                      name="budget"
                      min={BUDGET_MIN}
                      max={BUDGET_MAX}
                      step={BUDGET_STEP}
                      value={budget}
                      onChange={(e) => setBudget(Number(e.target.value))}
                      className="range-pro relative w-full"
                    />
                  </div>
                  <div className="flex justify-between mt-3 text-xs text-muted-foreground tabular-nums">
                    <span>{formatCZK(BUDGET_MIN)}</span>
                    <span>{formatCZK(BUDGET_MAX)}+</span>
                  </div>
                </div>
              </div>

              {/* Group: Message */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-border" />
                  <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                    04 — Projekt
                  </span>
                  <span className="h-px flex-1 bg-border" />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">
                    {t.contact.message}
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    maxLength={1000}
                    placeholder="Stručně popište váš projekt, cíle a termíny…"
                    className="field-input-pro resize-none"
                  />
                  {errors.message && (
                    <p className="text-xs text-destructive mt-1">{errors.message}</p>
                  )}
                </div>
              </div>

              {/* Captcha */}
              <div>
                <label
                  className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                    captcha
                      ? "border-primary bg-primary/5"
                      : "border-border bg-background/40 hover:border-primary/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={captcha}
                    onChange={(e) => setCaptcha(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-all ${
                      captcha
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    }`}
                  >
                    {captcha && <Check className="h-4 w-4" />}
                  </span>
                  <span className="text-sm text-foreground flex-1">Nejsem robot</span>
                  <Shield className="h-5 w-5 text-muted-foreground" />
                </label>
                {errors.captcha && (
                  <p className="text-xs text-destructive mt-2">{errors.captcha}</p>
                )}
              </div>

              {/* CTA */}
              <button
                type="submit"
                disabled={loading}
                className="group w-full inline-flex items-center justify-center gap-3 rounded-xl px-8 py-5 text-base md:text-lg font-bold bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground shadow-[0_10px_40px_-10px_oklch(0.72_0.18_250/0.6)] hover:shadow-[0_20px_60px_-10px_oklch(0.72_0.18_250/0.8)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>
                  {loading
                    ? sendingLabel[lang] ?? "Odesílám..."
                    : "Získat nezávaznou nabídku"}
                </span>
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              <p className="text-xs text-center text-muted-foreground">
                Žádný spam. Jen konkrétní nabídka.
              </p>
            </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
