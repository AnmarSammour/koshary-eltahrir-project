import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import MenuItem from "./MenuItem";
import "./CategorySection.css";

function CategorySection({
  categoryKey,
  categoryLabel,
  items,
  registerRef,
  onShowDetails,
}) {
  const isKoshary = categoryKey === "الكشري";

  return (
    <section
      id={`category-${categoryKey}`}
      className="category-section"
      ref={(el) => registerRef(el, categoryKey)}
      data-category={categoryKey}
    >
      <div className="category-header-line">
        <h2 className="category-title">{categoryLabel}</h2>
        <Link
          to={`/category/${categoryKey}`}
          className="more-link-with-arrow"
          aria-label={`View more ${categoryLabel}`}
        >
          <FormattedMessage id="view_more" />
        </Link>
      </div>
      <div className="category-divider" />
      <div className="items-carousel">
        {items.map((item) =>
          <MenuItem
            key={item.id}
            item={item}
            onShowDetails={isKoshary ? onShowDetails : undefined}
          />
        )}
      </div>
    </section>
  );
}

export default CategorySection;
