import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FormattedMessage, useIntl } from "react-intl";
import { useLocale } from "../../i18n";
import "./BranchesPage.css";

function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { locale } = useLocale();
  const intl = useIntl();

  useEffect(() => {
    fetch(`http://localhost:3000/api/branches?lang=${locale}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch branches");
        return res.json();
      })
      .then((data) => {
        setBranches(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, [locale]);

  return (
    <div className="branches-page-container">
      <header className="branches-page-header">
        <Link to="/" className="back-link" aria-label="Back">
          <span className="back-arrow">{intl.locale === "ar" ? "←" : "→"}</span>{" "}
        </Link>
        <h1>
          <FormattedMessage id="branches_title" />
        </h1>
      </header>

      <div className="branches-list">
        {loading && (
          <p className="loading-text">
            <FormattedMessage id="loading_branches" />
          </p>
        )}
        {error && <p className="error-text">{error}</p>}

        {!loading &&
          !error &&
          branches.map((branch) => (
            <div key={branch.id} className="branch-card">
              <h3 className="branch-name">{branch.name}</h3>
              <p className="branch-address">{branch.address}</p>
            </div>
          ))}
      </div>
    </div>
  );
}

export default BranchesPage;
