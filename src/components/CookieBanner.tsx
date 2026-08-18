import { useEffect, useState } from "react";
import { useT, type Lang } from "@/lib/i18n";
import { grantAnalyticsConsent } from "@/lib/analytics";

const KEY = "elevate-cookies";

const COPY: Record<Lang, { text: string; accept: string; decline: string }> = {
  CZ: { text: "Používáme cookies pro analýzu návštěvnosti.", accept: "Přijmout", decline: "Odmítnout" },
  EN: { text: "We use cookies for traffic analytics.", accept: "Accept", decline: "Decline" },
  RU: { text: "Мы используем cookies для аналитики посещаемости.", accept: "Принять", decline: "Отклонить" },
  UA: { text: "Ми використовуємо cookies для аналітики відвідуваності.", accept: "Прийняти", decline: "Відхилити" },
};

export function CookieBanner() {
  const { lang } = useT();
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {/* ignore */}
  }, []);

  const choose = (v: "accept" | "decline") => {
    try { localStorage.setItem(KEY, v); } catch {/* ignore */}
    if (v === "accept") grantAnalyticsConsent();
    setShow(false);
  };

  if (!show) return null;
  const c = COPY[lang];
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-[max(env(safe-area-inset-bottom),12px)]">
      <div className="mx-auto max-w-3xl rounded-xl border border-border bg-background/95 backdrop-blur-xl p-4 md:p-5 shadow-2xl flex flex-col md:flex-row items-center gap-3 md:gap-5">
        <p className="text-sm text-muted-foreground flex-1">{c.text}</p>
        <div className="flex gap-2 shrink-0">
          <button onClick={() => choose("decline")} className="rounded-md border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-accent/40 transition-colors">{c.decline}</button>
          <button onClick={() => choose("accept")} className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors">{c.accept}</button>
        </div>
      </div>
    </div>
  );
}
