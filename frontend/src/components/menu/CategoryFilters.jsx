import React from "react";
import "./CategoryFilters.css";

function CategoryFilters({ categories, activeCategory, setActiveCategory }) {
  const handleFilterClick = (category) => {
    setActiveCategory(category);
    const section = document.getElementById(`category-${category}`);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="filters-container">
      {categories.map((category) => (
        <button
          key={category}
          className={`filter-button ${activeCategory === category ? 'active' : ''}`}
          onClick={() => handleFilterClick(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
export default CategoryFilters;
