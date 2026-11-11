import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export type Language = "bn" | "en" | "hi";
export type LocalizedText = Record<Language, string>;
export type TextValue = string | LocalizedText | null | undefined;

const languageNames: Record<Language, string> = {
  bn: "বাংলা",
  en: "English",
  hi: "हिन्दी",
};

const languageContext = createContext<{
  language: Language;
  setLanguage: (language: Language) => void;
} | null>(null);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("kiriteswari-language");
    return saved === "en" || saved === "hi" || saved === "bn" ? saved : "bn";
  });

  const setLanguage = (nextLanguage: Language) => {
    localStorage.setItem("kiriteswari-language", nextLanguage);
    setLanguageState(nextLanguage);
  };

  const value = useMemo(() => ({ language, setLanguage }), [language]);
  return <languageContext.Provider value={value}>{children}</languageContext.Provider>;
};

export const useLanguage = () => {
  const value = useContext(languageContext);
  if (!value) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return value;
};

export const languageLabel = (language: Language) => languageNames[language];

export const languageText = (
  language: Language,
  values: LocalizedText
): string => values[language] || values.bn || values.en || values.hi;

export const getLocalizedText = (value: TextValue, language: Language): string => {
  if (typeof value === "string") return value;
  if (!value) return "";
  return value[language]?.trim() || value.bn?.trim() || value.en?.trim() || value.hi?.trim() || "";
};

export const toLocalizedText = (value: TextValue): LocalizedText => {
  if (typeof value === "string") return { bn: value, en: "", hi: "" };
  return {
    bn: value?.bn || "",
    en: value?.en || "",
    hi: value?.hi || "",
  };
};
