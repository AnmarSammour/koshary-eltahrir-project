import React from "react";
import { useLocale } from "../i18n";
import { useIntl } from "react-intl";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();
  const intl = useIntl();
  const toggle = () => setLocale(locale === "ar" ? "en" : "ar");
  return (
    <button className="action-btn" onClick={toggle} aria-label="Switch language">
      {intl.formatMessage({ id: "language_button" })}
    </button>
  );
}
