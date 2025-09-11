import React, { useEffect, useRef, useState } from "react";
import { useLocale } from "../i18n";
import "./LanguageSwitcher.css";

function LanguageSwitcher({ setIsFading }) {
  const { locale, setLocale } = useLocale();
  const [bgStyle, setBgStyle] = useState({});
  const arRef = useRef(null);
  const enRef = useRef(null);

  useEffect(() => {
    const activeRef = locale === "ar" ? arRef : enRef;
    if (activeRef.current) {
      setBgStyle({
        width: `${activeRef.current.offsetWidth}px`,
        left: `${activeRef.current.offsetLeft}px`,
      });
    }
  }, [locale]);

  const handleLocaleChange = (newLocale) => {
    if (locale === newLocale) return;
    setIsFading(true);
    setTimeout(() => {
      setLocale(newLocale);
      setIsFading(false);
    }, 300);
  };

  return (
    <div className="language-switcher">
      <div className="active-lang-bg" style={bgStyle}></div>
      <button
        ref={arRef}
        className={`lang-btn ${locale === "ar" ? "active" : "inactive"}`}
        onClick={() => handleLocaleChange("ar")}
      >
        ع
      </button>
      <button
        ref={enRef}
        className={`lang-btn ${locale === "en" ? "active" : "inactive"}`}
        onClick={() => handleLocaleChange("en")}
      >
        EN
      </button>
    </div>
  );
}

export default LanguageSwitcher;
