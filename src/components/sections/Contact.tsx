import { useState, type FormEvent } from "react";
import { z } from "zod";
import { ArrowRight, Globe, ShoppingBag, Sparkles, Shield, Check } from "lucide-react";
import { useT } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
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
      for (const issue of result.error.issues) {
        errs[issue.path[0] as string] = issue.message;
      }
    }

    if (!captcha) errs.captcha = "Potvrďte, že nejste robot";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      // ✅ TADY JE FIX (místo server importu)
      await fetch("/api/telegram", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          service,
          budget,
          message: data.message,
        }),
      });

      e.currentTarget.reset();
      setService("");
      setBudget(35000);
      setCaptcha(false);
      setSubmitted(true);

    } catch (err) {
      console.error(err);
      toast.error("Zprávu se nepodařilo odeslat.");
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

        <form onSubmit={onSubmit} className="space-y-6">

          <input name="name" placeholder="Jméno" />
          <input name="email" placeholder="Email" />
          <input name="phone" placeholder="Telefon" />

          <textarea name="message" placeholder="Zpráva" />

          <button type="submit" disabled={loading}>
            {loading ? sendingLabel[lang] : "Odeslat"}
          </button>

        </form>
      </div>
    </section>
  );
}
