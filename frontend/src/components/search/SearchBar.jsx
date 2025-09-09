import React, { useEffect, useRef } from "react";
import { useIntl } from "react-intl";
import "./SearchBar.css";

function SearchBar({ searchQuery, setSearchQuery, closeSearch }) {
  const inputRef = useRef(null);
  const intl = useIntl();

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, []);

  return (
    <div className="search-bar-container">
      <input
        ref={inputRef}
        type="text"
        placeholder={intl.formatMessage({ id: "search_placeholder" })}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <button onClick={closeSearch} className="close-search-btn" aria-label="Close search">
        ×
      </button>
    </div>
  );
}

export default SearchBar;
