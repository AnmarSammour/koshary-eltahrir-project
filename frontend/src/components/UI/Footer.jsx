import React from "react";
import { Link } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import "./Footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-left">
          <h3 className="footer-title"><FormattedMessage id="koshary_tahrir" /></h3>
          <Link to="/branches" className="footer-link">
            📍 <FormattedMessage id="branches" />
          </Link>
        </div>
        <div className="footer-right">
          <Link to="/legal/privacy-policy" className="footer-link">
            <FormattedMessage id="privacy_policy" />
          </Link>
          <Link to="/legal/shipping-returns" className="footer-link">
            <FormattedMessage id="shipping_policy" />
          </Link>
        </div>
      </div>
      <div className="footer-note">
        © {new Date().getFullYear()} <FormattedMessage id="koshary_tahrir" />. <FormattedMessage id="powered_by" />
      </div>
    </footer>
  );
}

export default Footer;
