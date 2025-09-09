import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './BranchesPage.css';

function BranchesPage() {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3000/api/branches' )
      .then(res => {
        if (!res.ok) {
          throw new Error('فشل في جلب بيانات الفروع');
        }
        return res.json();
      })
      .then(data => {
        setBranches(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="branches-page-container">
      <header className="branches-page-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">→</span>
        </Link>
        <h1>فروعنا</h1>
      </header>

      <div className="branches-list">
        {loading && <p className="loading-text">...جاري تحميل الفروع</p>}
        {error && <p className="error-text">{error}</p>}
        
        {!loading && !error && branches.map(branch => (
          <div key={branch.id} className="branch-card">
            <h3 className="branch-name">{branch.name}</h3>
            <p className="branch-address">{branch.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BranchesPage;
