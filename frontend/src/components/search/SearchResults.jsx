import React, { useState } from 'react';
import MenuItem from '../menu/MenuItem';
import DetailsModal from '../UI/DetailsModal';
import './SearchResults.css';

function SearchResults({ results }) {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleShowDetails = (item) => {
    setSelectedItem(item);
  };

  const handleCloseDetails = () => {
    setSelectedItem(null);
  };

  if (results.length === 0) {
    return <p className="no-results">.لا توجد نتائج بحث مطابقة</p>;
  }

  return (
    <>
      <div className="search-results-container">
        <div className="search-results-grid">
          {results.map(item => (
            <MenuItem key={item.id} item={item} onShowDetails={handleShowDetails} />
          ))}
        </div>
      </div>
      <DetailsModal item={selectedItem} onClose={handleCloseDetails} />
    </>
  );
}

export default SearchResults;
