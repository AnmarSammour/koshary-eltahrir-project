import React from "react";
import CategorySection from "./CategorySection";

function MenuList({
  items,
  categories,
  categoriesForUI,
  registerRef,
  onShowDetails,
}) {
  const categoryLabels = new Map(
    categoriesForUI.map((c) => [c.value, c.label])
  );

  return (
    <div className="menu-list-container">
      {categories.map((categoryKey) => {
        const categoryItems = items.filter(
          (item) => item.category === categoryKey
        );
        if (categoryItems.length === 0) return null;

        const displayedItems = categoryItems.slice(0, 4);
        const translatedLabel = categoryLabels.get(categoryKey) || categoryKey;

        return (
          <CategorySection
            key={categoryKey}
            categoryKey={categoryKey}
            categoryLabel={translatedLabel} 
            items={displayedItems}
            registerRef={registerRef}
            onShowDetails={onShowDetails}
          />
        );
      })}
    </div>
  );
}

export default MenuList;
