import React from "react";
import "./CategoryFilters.css";

function CategoryFilters({ categories, activeCategory, setActiveCategory }) {
  const handleFilterClick = (value) => {
    setActiveCategory(value);
    const section = document.getElementById(`category-${value}`);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="filters-container">
      {categories.map((c) => (
        <button
          key={c.value}
          className={`filter-button ${
            activeCategory === c.value ? "active" : ""
          }`}
          onClick={() => handleFilterClick(c.value)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
export default CategoryFilters;
