import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FormattedMessage, useIntl } from "react-intl";
import "./CartPage.css";

function CartPage() {
  const { cartItems, addToCart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();
  const intl = useIntl();

  const handleCheckout = () => navigate("/checkout");

  // Empty cart design
  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container empty-cart">
        <header className="cart-page-header">
          <Link to="/" className="back-link" aria-label="Back">
            <span className="back-arrow">
              {intl.locale === "ar" ? "←" : "→"}
            </span>
          </Link>
          <h1>
            <FormattedMessage id="shopping_cart" />
          </h1>
        </header>
        <div className="empty-cart-content">
          <div className="empty-cart-icon">🛒</div>
          <h2>
            <FormattedMessage id="empty_cart_message" />
          </h2>
          <Link to="/" className="start-shopping-btn">
            <FormattedMessage id="start_shopping" />
          </Link>
        </div>
      </div>
    );
  }

  // Filled cart design
  return (
    <div className="cart-page-container">
      <header className="cart-page-header">
        <Link to="/" className="back-link" aria-label="Back">
          <span className="back-arrow">{intl.locale === "ar" ? "←" : "→"}</span>
        </Link>
        <h1>
          <FormattedMessage id="shopping_cart" />
        </h1>
      </header>
      <div className="cart-items-list">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">
                {Number(item.price * item.quantity).toFixed(2)}{" "}
                <FormattedMessage id="egp" />
              </span>
            </div>
            <div className="cart-item-quantity-controls">
              <button
                className="quantity-btn"
                onClick={() => removeFromCart(item.id)}
                aria-label="decrease"
              >
                −
              </button>
              <span>{item.quantity}</span>
              <button
                className="quantity-btn"
                onClick={() => addToCart(item)}
                aria-label="increase"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      <footer className="cart-footer">
        <div className="total-price-section">
          <span>
            <FormattedMessage id="total" />
          </span>
          <span>
            {totalPrice.toFixed(2)} <FormattedMessage id="egp" />
          </span>
        </div>
        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          <FormattedMessage id="confirm_order" />
        </button>
      </footer>
    </div>
  );
}

export default CartPage;
