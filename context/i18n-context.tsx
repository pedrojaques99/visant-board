"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { messages as enMessages } from "../locales/en";
import { messages as ptBrMessages } from "../locales/pt-br";

type Messages = typeof enMessages;

interface I18nContextType {
  locale: string;
  messages: Messages;
  setLocale: (locale: string) => void;
}

const I18nContext = createContext<I18nContextType | null>(null);

const locales: Record<string, Messages> = {
  en: enMessages,
  "pt-br": ptBrMessages,
};

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState<Messages>(enMessages);

  useEffect(() => {
    // Initialize with saved preference or browser language
    const savedLocale = localStorage.getItem("language");
    const browserLocale = navigator.language.startsWith("pt") ? "pt-br" : "en";
    const initialLocale = savedLocale || browserLocale;
    
    setLocale(initialLocale);
    setMessages(locales[initialLocale] || enMessages);
  }, []);

  const changeLocale = (newLocale: string) => {
    setLocale(newLocale);
    setMessages(locales[newLocale] || enMessages);
    localStorage.setItem("language", newLocale);
  };

  return (
    <I18nContext.Provider value={{ locale, messages, setLocale: changeLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
} 