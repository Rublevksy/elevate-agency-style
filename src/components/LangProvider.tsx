import { useEffect, useState, type ReactNode } from "react";
import { LangContext, translations, type Lang, type Dict } from "@/lib/i18n";

const STORAGE_KEY = "elevate-lang";
const VALID: Lang[] = ["CZ", "EN", "RU", "UA"];

function readInitial(): Lang {
  if (typeof window === "undefined") return "CZ";
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved && (VALID as string[]).includes(saved)) return saved as Lang;
  } catch {
    // ignore
  }
  return "CZ";
}

export function LangProvider({ children }: { children: ReactNode }) {
  // Always start with CZ on first render to match SSR; hydrate from
  // localStorage in useEffect after mount to avoid hydration mismatches.
  const [lang, setLangState] = useState<Lang>("CZ");

  useEffect(() => {
    const initial = readInitial();
    if (initial !== lang) setLangState(initial);
    if (typeof document !== "undefined") {
      document.documentElement.lang = initial.toLowerCase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      window.localStorage.setItem(STORAGE_KEY, l);
    } catch {
      // ignore
    }
    if (typeof document !== "undefined") {
      document.documentElement.lang = l.toLowerCase();
    }
  };

  const t = translations[lang] as unknown as Dict;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}
