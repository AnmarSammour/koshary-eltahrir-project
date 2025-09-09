import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

function Footer() {
  return (
    <footer className="site-footer">
      
      <div className="footer-section">
        <span>كشري التحرير</span>
        <Link to="/branches" className="footer-link-icon">
          <span>الفروع</span>
          <span className="location-icon">📍</span>
        </Link>
      </div>

      <div className="footer-section">
        <Link to="/" className="footer-link">سياسة الخصوصية</Link>
        <Link to="/" className="footer-link">سياسة الشحن والإسترجاع</Link>
      </div>

      <div className="footer-powered-by">
        <span>مدعم من زيدا®</span>
      </div>

    </footer>
  );
}

export default Footer;
