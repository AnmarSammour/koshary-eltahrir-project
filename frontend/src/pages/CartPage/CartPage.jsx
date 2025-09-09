import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { cartItems, addToCart, removeFromCart, totalPrice } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page-container empty-cart">
        <header className="cart-page-header">
          <Link to="/" className="back-link">
            <span className="back-arrow">→</span>
          </Link>
          <h1>سلة المشتريات</h1>
        </header>
        <div className="empty-cart-content">
          <p>سلتك فارغة حالياً.</p>
          <Link to="/" className="start-shopping-btn">ابدأ التسوق</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-container">
      <header className="cart-page-header">
        <Link to="/" className="back-link">
          <span className="back-arrow">→</span>
        </Link>
        <h1>سلة المشتريات</h1>
      </header>

      <div className="cart-items-list">
        {cartItems.map(item => (
          <div key={item.id} className="cart-item">
            <img src={item.image} alt={item.name} className="cart-item-image" />
            <div className="cart-item-details">
              <span className="cart-item-name">{item.name}</span>
              <span className="cart-item-price">{(item.price * item.quantity).toFixed(2)} ج.م</span>
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
          <span>المجموع الكلي</span>
          <span>{totalPrice.toFixed(2)} ج.م</span>
        </div>
        <button
          className="checkout-btn"
          onClick={handleCheckout}
          disabled={cartItems.length === 0}
        >
          تأكيد الطلب
        </button>
      </footer>
    </div>
  );
}

export default CartPage;
