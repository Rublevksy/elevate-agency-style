import { useState, type ReactNode } from "react";
import { LangContext, translations, type Lang, type Dict } from "@/lib/i18n";

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("CZ");
  const t = translations[lang] as unknown as Dict;
  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>;
}
