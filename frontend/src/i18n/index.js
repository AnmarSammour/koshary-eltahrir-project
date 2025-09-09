import React, { useState, useEffect, createContext, useContext } from "react";
import { IntlProvider } from "react-intl";
import ar from "./ar.json";
import en from "./en.json";

const messages = { ar, en };

const LocaleContext = createContext();
export const useLocale = () => useContext(LocaleContext);

export function LocaleProvider({ children }) {
  const defaultLocale = (typeof window !== "undefined" && localStorage.getItem("locale")) || "ar";
  const [locale, setLocale] = useState(defaultLocale);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("locale", locale);
      document.documentElement.lang = locale;
      document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    }
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      <IntlProvider locale={locale} messages={messages[locale]} defaultLocale="ar">
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
}
