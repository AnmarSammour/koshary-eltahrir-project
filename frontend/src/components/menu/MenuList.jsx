import React from 'react';
import CategorySection from './CategorySection';

function MenuList({ items, categories, registerRef, onShowDetails }) {
  return (
    <div className="menu-list-container">
      {categories.map(category => {
        const categoryItems = items.filter(item => item.category === category);
        if (categoryItems.length === 0) return null;

        const displayedItems = categoryItems.slice(0, 4);

        return (
          <CategorySection
            key={category}
            category={category}
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
