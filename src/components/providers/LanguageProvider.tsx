"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { Lang } from "@/data/content";
import type { Bilingual } from "@/data/projects";

type Ctx = {
  lang: Lang;
  toggle: () => void;
  /** Pull the active language out of any bilingual string pair. */
  t: (value: Bilingual | { en: string; ar: string }) => string;
};

const LanguageContext = createContext<Ctx>({
  lang: "en",
  toggle: () => {},
  t: (v) => v.en,
});

export const useLang = () => useContext(LanguageContext);

const STORAGE_KEY = "attia-lang";

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  // Read the stored choice after mount. Static export means the HTML ships as
  // English; flipping here avoids a hydration mismatch on the server output.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "ar" || stored === "en") {
      setLang(stored);
      return;
    }
    if (navigator.language?.startsWith("ar")) setLang("ar");
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.lang = lang;
    root.dir = lang === "ar" ? "rtl" : "ltr";
    window.localStorage.setItem(STORAGE_KEY, lang);
  }, [lang]);

  const toggle = useCallback(() => setLang((l) => (l === "en" ? "ar" : "en")), []);
  const t = useCallback((value: { en: string; ar: string }) => value[lang], [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
