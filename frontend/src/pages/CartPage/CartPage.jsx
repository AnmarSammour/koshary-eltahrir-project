import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FormattedMessage } from "react-intl";
import "./CartPage.css";

function CartPage() {
  const { cartItems, addToCart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => navigate("/checkout");

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container empty-cart">
        <header className="cart-page-header">
          <Link to="/" className="back-link" aria-label="Back">
            <span className="back-arrow">→</span>
          </Link>
          <h1>
            <FormattedMessage id="shopping_cart" />
          </h1>
        </header>
        <div className="empty-cart-content">
          <p>
            <FormattedMessage id="empty_cart_message" />
          </p>
          <Link to="/" className="start-shopping-btn">
            <FormattedMessage id="start_shopping" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <header className="cart-page-header">
        <Link to="/" className="back-link" aria-label="Back">
          <span className="back-arrow">→</span>
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
              <button onClick={() => addToCart(item)}>+</button>
              <span>{item.quantity}</span>
              <button onClick={() => removeFromCart(item.id)}>−</button>
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
        <button className="checkout-btn" onClick={handleCheckout} disabled={cartItems.length === 0}>
          <FormattedMessage id="confirm_order" />
        </button>
      </footer>
    </div>
  );
}

export default CartPage;
