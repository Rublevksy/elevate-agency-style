import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Instagram, X } from "lucide-react";
import { useT, type Lang } from "@/lib/i18n";

const TG: Record<Lang, string> = {
  CZ: "Napište na Telegram",
  EN: "Message on Telegram",
  RU: "Написать в Telegram",
  UA: "Написати в Telegram",
};
const IG: Record<Lang, string> = {
  CZ: "Sledujte nás",
  EN: "Follow us",
  RU: "Мы в Instagram",
  UA: "Ми в Instagram",
};
const TIP: Record<Lang, string> = {
  CZ: "Kontaktujte nás",
  EN: "Contact us",
  RU: "Связаться",
  UA: "Зв'язатися",
};

const TELEGRAM_URL = "https://t.me/elevateit"; // TODO owner: update
const INSTAGRAM_URL = "https://www.instagram.com/elevateit.cz/";

export function ContactWidget() {
  const { lang } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [open]);

  return (
    <div
      ref={ref}
      className="fixed z-40 bottom-24 right-4 md:bottom-6 md:right-6 flex flex-col items-end gap-3"
    >
      {open && (
        <div
          className="w-[260px] rounded-2xl border border-border bg-popover/95 backdrop-blur-xl p-2 shadow-2xl animate-fade-in"
          style={{ boxShadow: "0 30px 60px -20px oklch(0 0 0 / 0.6)" }}
          role="dialog"
          aria-label={TIP[lang]}
        >
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-accent/60 transition-colors"
            onClick={() => setOpen(false)}
          >
            <span className="grid place-items-center h-10 w-10 rounded-full bg-[#229ED9] text-white">
              <Send className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-foreground">{TG[lang]}</span>
          </a>
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-accent/60 transition-colors"
            onClick={() => setOpen(false)}
          >
            <span
              className="grid place-items-center h-10 w-10 rounded-full text-white"
              style={{
                background:
                  "linear-gradient(135deg,#feda75,#fa7e1e 25%,#d62976 55%,#962fbf 80%,#4f5bd5)",
              }}
            >
              <Instagram className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="text-sm font-medium text-foreground">{IG[lang]}</span>
          </a>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={TIP[lang]}
        aria-expanded={open}
        className="relative grid place-items-center h-14 w-14 min-h-[48px] min-w-[48px] rounded-full bg-primary text-primary-foreground shadow-[0_10px_30px_-8px_oklch(0.65_0.18_255/0.7)] hover:scale-105 transition-transform"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        {!open && (
          <>
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#229ED9] ring-2 ring-background" />
            <span className="absolute bottom-2.5 right-2 h-2 w-2 rounded-full bg-[#d62976] ring-2 ring-background" />
          </>
        )}
      </button>
    </div>
  );
}
