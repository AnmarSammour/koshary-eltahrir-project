import React, { useEffect, useRef } from "react";
import "./SearchBar.css";

function SearchBar({ searchQuery, setSearchQuery, closeSearch }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className="search-bar-container">
      <input
        ref={inputRef}
        type="text"
        placeholder="...ابحث عن صنف"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      <button onClick={closeSearch} className="close-search-btn">
        ×
      </button>
    </div>
  );
}

export default SearchBar;
