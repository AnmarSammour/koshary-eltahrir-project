import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useIntl } from "react-intl";
import { useLocale } from "../../i18n";
import Footer from "../../components/UI/Footer";
import "./LegalPage.css";

export default function LegalPage() {
  const { pageKey } = useParams();
  const { locale } = useLocale();
  const intl = useIntl();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetch(`http://localhost:3000/api/legal/${pageKey}?lang=${locale}`)
      .then((res) => {
        if (!res.ok)
          return res.json().then((e) => {
            throw new Error(e.message);
          });
        return res.json();
      })
      .then((data) => {
        setTitle(data.title);
        setContent(data.content);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
    window.scrollTo(0, 0);
  }, [pageKey, locale]);

  return (
    <>
      <div className="legal-page-container">
        <header className="legal-page-header">
          <Link to="/" className="legal-back-link" aria-label="Back to Home">
            <span className="legal-back-arrow">
              {locale === "ar" ? "←" : "→"}
            </span>
          </Link>
          <h1 className="legal-page-title">{isLoading ? "..." : title}</h1>
        </header>
        <main className="legal-page-content">
          {isLoading && (
            <p className="status-message">
              {intl.formatMessage({ id: "loading" })}
            </p>
          )}
          {error && <p className="status-message error">{error}</p>}
          {!isLoading && !error && (
            <div
              dangerouslySetInnerHTML={{
                __html: content.replace(/\n/g, "<br/>"),
              }}
            />
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}
