import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MenuItem from '../../components/menu/MenuItem';
import DetailsModal from '../../components/UI/DetailsModal';
import './CategoryPage.css';

function CategoryPage() {
  const { categoryName } = useParams();
  const [categoryItems, setCategoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/api/menu` )
      .then(res => res.json())
      .then(data => {
        const filtered = data.filter(item => item.category === categoryName);
        setCategoryItems(filtered);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch category items:", error);
        setIsLoading(false);
      });
  }, [categoryName]);

  const handleShowDetails = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  return (
    <div className="category-page-container">
      <header className="category-page-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">→</span>
        </Link>
        <h1>{categoryName}</h1>
      </header>

      {isLoading ? (
        <p className="loading-text">...جاري تحميل الأصناف</p>
      ) : (
        <div className="category-page-grid">
          {categoryItems.map(item => (
            <MenuItem key={item.id} item={item} onShowDetails={handleShowDetails} />
          ))}
        </div>
      )}

      <DetailsModal item={selectedItem} onClose={handleCloseDetails} />
    </div>
  );
}

export default CategoryPage;
