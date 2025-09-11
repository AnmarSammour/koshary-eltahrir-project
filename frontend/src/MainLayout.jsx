import React, { useState, useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import backgroundImage from "./assets/background.jpeg";
import SearchBar from "./components/search/SearchBar";
import SearchResults from "./components/search/SearchResults";
import { Toaster } from "react-hot-toast";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useLocale } from "./i18n";
import "./MainLayout.css";

const SearchIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CloseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function MainLayout() {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allItems, setAllItems] = useState([]);
  const location = useLocation();
  const { locale } = useLocale();
  const isRtl = locale === "ar";
  const menuPaneRef = useRef(null);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!isFading) {
      fetch(`http://localhost:3000/api/menu?lang=${locale}`)
        .then((res) => res.json())
        .then((data) => setAllItems(data))
        .catch((error) =>
          console.error("Failed to fetch all items for search:", error)
        );
    }
  }, [locale, isFading]);

  useEffect(() => {
    if (menuPaneRef.current) {
      menuPaneRef.current.scrollTop = 0;
    }
    setIsSearchMode(false);
    setSearchQuery("");
  }, [location]);

  const filteredResults = searchQuery
    ? allItems.filter((item) =>
        (item.name || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearchClick = () => setIsSearchMode(true);
  const closeSearch = () => {
    setIsSearchMode(false);
    setSearchQuery("");
  };

  return (
    <div
      className={`main-container ${isRtl ? "rtl" : "ltr"} ${
        isFading ? "content-fading" : ""
      }`}
    >
      <Toaster
        position="bottom-center"
        toastOptions={{ style: { background: "#333", color: "#fff" } }}
      />

      <div className="pane menu-pane" ref={menuPaneRef}>
        <div className="menu-content">
          {isSearchMode ? (
            <>
              <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                closeSearch={closeSearch}
              />
              <SearchResults results={filteredResults} />
            </>
          ) : (
            <Outlet />
          )}
        </div>
        <footer className="menu-footer">
          <p className="footer-text">
            © {new Date().getFullYear()}{" "}
            <FormattedMessage id="koshary_tahrir" />.{" "}
            <FormattedMessage id="powered_bya" />
          </p>
          <p className="footer-text">
            <FormattedMessage
              id="developed_by"
              values={{
                name: (
                  <a
                    href="https://github.com/AnmarSammour"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <FormattedMessage id="name_AnmarSammour" />
                  </a>
                ),
              }}
            />
          </p>
        </footer>
      </div>

      <div
        className="pane image-pane"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="top-controls">
          <LanguageSwitcher setIsFading={setIsFading} />
          <button
            className="action-btn"
            onClick={isSearchMode ? closeSearch : handleSearchClick}
            aria-label={isSearchMode ? "Close Search" : "Search"}
          >
            {isSearchMode ? <CloseIcon /> : <SearchIcon />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
