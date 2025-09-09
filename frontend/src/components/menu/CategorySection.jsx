import React from 'react';
import { Link } from 'react-router-dom';
import MenuItem from './MenuItem';
import './CategorySection.css';

function CategorySection({ category, items, registerRef, onShowDetails }) {
  return (
    <section 
      id={`category-${category}`}
      className="category-section"
      ref={(el) => registerRef(el, category)} 
      data-category={category}
    >
      <div className="category-header">
        <h2>{category}</h2>
        <Link to={`/category/${category}`} className="more-link">المزيد &gt;</Link>
      </div>
      
      <div className="items-carousel">
        {items.map(item => (
          <MenuItem 
            key={item.id} 
            item={item} 
            onShowDetails={onShowDetails}
          />
        ))}
      </div>
    </section>
  );
}

export default CategorySection;
