import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useIntl } from 'react-intl'; 
import { useLocale } from '../../i18n';
import MenuItem from '../../components/menu/MenuItem';
import DetailsModal from '../../components/UI/DetailsModal';
import './CategoryPage.css';

const categoryTranslationIds = {
  "الكشري": "cat_koshary",
  "الإضافات": "cat_addons",
  "المشروبات": "cat_drinks",
  "الحلويات": "cat_desserts"
};

function CategoryPage() {
  const { categoryName } = useParams(); 
  const { locale } = useLocale();
  const intl = useIntl();
  const [categoryItems, setCategoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);

  const translationId = categoryTranslationIds[categoryName] || categoryName;
  const pageTitle = intl.formatMessage({ id: translationId });

  useEffect(() => {
    setIsLoading(true);
    fetch(`http://localhost:3000/api/menu?lang=${locale}` )
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
  }, [categoryName, locale]);

  const handleShowDetails = (item) => setSelectedItem(item);
  const handleCloseDetails = () => setSelectedItem(null);

  return (
    <div className="category-page-container">
      <header className="category-page-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">→</span>
        </Link>
        <h1>{pageTitle}</h1>
      </header>

      {isLoading ? (
        <p className="loading-text">{intl.formatMessage({ id: "loading_items" })}</p>
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
