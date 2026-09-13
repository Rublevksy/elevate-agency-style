import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";
import { sendContactToTelegram } from "@/lib/telegram.functions";

const KEY = "elevate-exit-intent";

const COPY: Record<Lang, { title: string; sub: string; submit: string }> = {
  CZ: { title: "Čekejte! Nabídka zdarma za 24 hodin.", sub: "Pošlete nám projekt a dostanete konkrétní návrh bez závazku.", submit: "Chci nabídku" },
  EN: { title: "Wait! Free quote within 24 hours.", sub: "Send us your project and get a concrete proposal — no obligation.", submit: "Get a quote" },
  RU: { title: "Постойте! Бесплатное предложение за 24 часа.", sub: "Отправьте проект — получите конкретное предложение без обязательств.", submit: "Хочу предложение" },
  UA: { title: "Зачекайте! Безкоштовна пропозиція за 24 години.", sub: "Надішліть нам проєкт — отримайте конкретну пропозицію без зобов'язань.", submit: "Хочу пропозицію" },
};

/**
 * The success state is shown only after `sendContactToTelegram` resolves — the
 * same server function and payload shape as the contact stepper. A failed send
 * says so and points to the full contact page; nothing pretends to have sent.
 */
type Status = "idle" | "sending" | "sent" | "failed";

export function ExitIntentModal() {
  const { t, lang } = useT();
  const f = t.contact.form;
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const firstField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 767px)").matches) return;
    try { if (sessionStorage.getItem(KEY)) return; } catch {/* ignore */}

    const onLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && e.relatedTarget === null) {
        setOpen(true);
        try { sessionStorage.setItem(KEY, "1"); } catch {/* ignore */}
        document.removeEventListener("mouseout", onLeave);
      }
    };
    const t = setTimeout(() => document.addEventListener("mouseout", onLeave), 5000);
    return () => { clearTimeout(t); document.removeEventListener("mouseout", onLeave); };
  }, []);

  useEffect(() => {
    if (!open) return;
    firstField.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  const c = COPY[lang];
  const sending = status === "sending";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || hp) return;
    setStatus("sending");
    try {
      await sendContactToTelegram({
        data: {
          name: name.trim(),
          email: email.trim(),
          phone: "",
          service: f.projectTypes[f.projectTypes.length - 1],
          budget: 0,
          message: message.trim(),
        },
      });
      setStatus("sent");
    } catch (err) {
      console.error(err);
      setStatus("failed");
    }
  };

  const field =
    "w-full rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary disabled:opacity-60";

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center px-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="exit-intent-title">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-2xl">
        <button onClick={() => setOpen(false)} aria-label="Close" className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/40">
          <X className="h-4 w-4" />
        </button>
        {status === "sent" ? (
          <div className="py-6 text-center" role="status">
            <h2 id="exit-intent-title" className="text-lg font-semibold text-foreground">{f.successTitle}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{f.successBody}</p>
          </div>
        ) : (
          <>
            <h2 id="exit-intent-title" className="text-2xl font-bold text-foreground mb-3">{c.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{c.sub}</p>
            <form onSubmit={onSubmit} className="space-y-3">
              <input
                ref={firstField}
                required
                maxLength={100}
                value={name}
                disabled={sending}
                onChange={(e) => setName(e.target.value)}
                placeholder={f.namePlaceholder}
                aria-label={t.contact.name}
                autoComplete="name"
                className={field}
              />
              <input
                type="email"
                required
                maxLength={255}
                value={email}
                disabled={sending}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={f.emailPlaceholder}
                aria-label={t.contact.email}
                autoComplete="email"
                className={field}
              />
              <textarea
                required
                rows={3}
                maxLength={2000}
                value={message}
                disabled={sending}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={f.messagePlaceholder}
                aria-label={f.messageLabel}
                className={`${field} resize-none`}
              />
              {/* Honeypot, as in the contact stepper. */}
              <input
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                value={hp}
                onChange={(e) => setHp(e.target.value)}
                className="absolute -left-[9999px] h-0 w-0 opacity-0"
              />
              {status === "failed" && (
                <p role="alert" className="text-sm text-destructive">
                  {f.errors.sendFailed}{" "}
                  <Link to="/contact" onClick={() => setOpen(false)} className="underline underline-offset-2 text-foreground">
                    {f.directEyebrow}
                  </Link>
                </p>
              )}
              <button type="submit" disabled={sending} className="btn-primary w-full justify-center disabled:opacity-70">
                {sending ? f.sending : c.submit}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
