import { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import backgroundImage from './assets/background.jpeg';
import SearchBar from './components/search/SearchBar';
import SearchResults from './components/search/SearchResults';
import { Toaster } from 'react-hot-toast'; 
import './MainLayout.css';

function MainLayout() {
  const leftPaneStyle = { backgroundImage: `url(${backgroundImage})` };
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [allItems, setAllItems] = useState([]);
  const location = useLocation();

  useEffect(() => {
    fetch('http://localhost:3000/api/menu' )
      .then(res => res.json())
      .then(data => setAllItems(data))
      .catch(error => console.error("Failed to fetch all items for search:", error));
  }, []);

  const filteredResults = searchQuery
    ? allItems.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    setIsSearchMode(false);
    setSearchQuery('');
  }, [location]);

  const handleSearchClick = () => {
    setIsSearchMode(true);
  };
  
  const closeSearch = () => {
    setIsSearchMode(false);
    setSearchQuery('');
  };

  return (
    <div className="main-container">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />

      <div className="right-pane">
        {isSearchMode ? (
          <>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              closeSearch={closeSearch}
            />
            <SearchResults results={filteredResults} />
          </>
        ) : (
          <Outlet />
        )}
      </div>

      <div className="left-pane" style={leftPaneStyle}>
        <div className="top-buttons">
          {!isSearchMode && (
             <button className="search-btn" onClick={handleSearchClick}>
               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
             </button>
            )}
        </div>
      </div>
    </div>
  );
}

export default MainLayout;
