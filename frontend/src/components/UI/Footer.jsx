import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-section">
        <span><FormattedMessage id="koshary_tahrir" /></span>
        <Link to="/branches" className="footer-link-icon">
          <span><FormattedMessage id="branches" /></span>
          <span className="location-icon">📍</span>
        </Link>
      </div>

      <div className="footer-section">
        <Link to="/" className="footer-link"><FormattedMessage id="privacy_policy" /></Link>
        <Link to="/" className="footer-link"><FormattedMessage id="shipping_policy" /></Link>
      </div>

      <div className="footer-powered-by">
        <span><FormattedMessage id="powered_by" /></span>
      </div>
    </footer>
  );
}

export default Footer;
