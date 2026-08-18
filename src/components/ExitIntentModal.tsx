import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

const KEY = "elevate-exit-intent";

const COPY: Record<Lang, { title: string; sub: string; placeholder: string; submit: string; thanks: string }> = {
  CZ: { title: "Čekejte! Nabídka zdarma za 24 hodin.", sub: "Pošlete nám projekt a dostanete konkrétní návrh bez závazku.", placeholder: "Váš e-mail", submit: "Chci nabídku", thanks: "Děkujeme, brzy se ozveme." },
  EN: { title: "Wait! Free quote within 24 hours.", sub: "Send us your project and get a concrete proposal — no obligation.", placeholder: "Your email", submit: "Get a quote", thanks: "Thanks, we'll be in touch soon." },
  RU: { title: "Постойте! Бесплатное предложение за 24 часа.", sub: "Отправьте проект — получите конкретное предложение без обязательств.", placeholder: "Ваш e-mail", submit: "Хочу предложение", thanks: "Спасибо, мы скоро свяжемся." },
  UA: { title: "Зачекайте! Безкоштовна пропозиція за 24 години.", sub: "Надішліть нам проєкт — отримайте конкретну пропозицію без зобов'язань.", placeholder: "Ваш e-mail", submit: "Хочу пропозицію", thanks: "Дякуємо, скоро зв'яжемося." },
};

export function ExitIntentModal() {
  const { lang } = useT();
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [email, setEmail] = useState("");

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

  if (!open) return null;
  const c = COPY[lang];

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center px-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-background p-8 shadow-2xl">
        <button onClick={() => setOpen(false)} aria-label="Close" className="absolute top-3 right-3 grid place-items-center h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent/40">
          <X className="h-4 w-4" />
        </button>
        {done ? (
          <p className="text-lg font-semibold text-foreground py-6 text-center">{c.thanks}</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold text-foreground mb-3">{c.title}</h2>
            <p className="text-sm text-muted-foreground mb-6">{c.sub}</p>
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
              className="space-y-3"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={c.placeholder}
                aria-label={c.placeholder}
                className="w-full rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none focus:border-primary"
              />
              <button type="submit" className="btn-primary w-full justify-center">{c.submit}</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
