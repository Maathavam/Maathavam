"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Lang = "ta" | "en";

interface LanguageContextType {
  lang: Lang;
  toggle: () => void;
  isTamil: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ta",
  toggle: () => {},
  isTamil: true,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("ta");

  // Persist language preference
  useEffect(() => {
    const stored = localStorage.getItem("maathavam-lang") as Lang | null;
    if (stored === "en" || stored === "ta") setLang(stored);
  }, []);

  const toggle = () => {
    setLang((prev) => {
      const next = prev === "ta" ? "en" : "ta";
      localStorage.setItem("maathavam-lang", next);
      return next;
    });
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, isTamil: lang === "ta" }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
