import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import MenuItem from "./MenuItem";
import "./CategorySection.css";

function CategorySection({ categoryKey, categoryLabel, items, registerRef, onShowDetails }) {
  return (
    <section
      id={`category-${categoryKey}`} 
      className="category-section"
      ref={(el) => registerRef(el, categoryKey)}
      data-category={categoryKey}
    >
      <div className="category-header">
        <h2>{categoryLabel}</h2>
        <Link to={`/category/${categoryKey}`} className="more-link">
          <FormattedMessage id="view_more" />
        </Link>
      </div>

      <div className="items-carousel">
        {items.map((item) => (
          <MenuItem key={item.id} item={item} onShowDetails={onShowDetails} />
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
