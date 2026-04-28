import { useState, type FormEvent } from "react";
import { z } from "zod";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";

export function Contact() {
  const { t } = useT();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const schema = z.object({
    name: z.string().trim().min(1).max(100),
    email: z.string().trim().email().max(255),
    phone: z.string().trim().max(40).optional().or(z.literal("")),
    service: z.string().min(1),
    budget: z.string().min(1),
    message: z.string().trim().min(1).max(1000),
  });

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd) as Record<string, string>;
    const result = schema.safeParse(data);
    if (!result.success) {
      const errs: Record<string, string> = {};
      for (const issue of result.error.issues) errs[issue.path[0] as string] = issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setSubmitted(true);
  };

  const sendingLabel: Record<string, string> =
    { CZ: "Odesílám...", EN: "Sending...", RU: "Отправка...", UA: "Надсилаю..." };

  return (
    <section id="contact" className="py-28 md:py-36 border-t border-border">
      <div className="container-luxe">
        <SectionHeading eyebrow="07" title={t.contact.title} subtitle={t.contact.subtitle} />

        <div className="max-w-3xl">
          {submitted ? (
            <div className="p-12 rounded-2xl border border-primary/40 bg-surface text-center glow-primary">
              <p className="text-xl font-bold text-foreground">{t.contact.success}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{t.contact.name}</label>
                <input name="name" maxLength={100} className="field-input" />
                {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{t.contact.email}</label>
                <input name="email" type="email" maxLength={255} className="field-input" />
                {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{t.contact.phone}</label>
                <input name="phone" maxLength={40} className="field-input" />
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{t.contact.service}</label>
                <select name="service" className="field-input" defaultValue="">
                  <option value="" disabled>—</option>
                  {t.contact.services.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.service && <p className="text-xs text-destructive mt-1">{errors.service}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{t.contact.budget}</label>
                <select name="budget" className="field-input" defaultValue="">
                  <option value="" disabled>—</option>
                  {t.contact.budgets.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
                {errors.budget && <p className="text-xs text-destructive mt-1">{errors.budget}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">{t.contact.message}</label>
                <textarea name="message" rows={5} maxLength={1000} className="field-input resize-none" />
                {errors.message && <p className="text-xs text-destructive mt-1">{errors.message}</p>}
              </div>
              <div className="md:col-span-2 mt-2">
                <button type="submit" disabled={loading} className="btn-gradient">
                  {loading ? sendingLabel[t.contact.langCode ?? "CZ"] ?? "Odesílám..." : t.contact.submit}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
