import React from "react";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import "./MenuItem.css";

function MenuItem({ item, onShowDetails }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(item);
    toast.success(`تمت إضافة "${item.name}" إلى السلة`);
  };

  const handleShowDetails = (e) => {
    e.stopPropagation();
    if (onShowDetails) {
      onShowDetails(item);
    }
  };

  return (
    <div className="menu-item-card" onClick={handleShowDetails}>
      <div className="item-image-container">
        <img src={item.image} alt={item.name} className="item-image" />
        <div className="item-add-corner">
          <button className="add-btn" onClick={handleAddToCart}>
            +
          </button>
        </div>
        {item.details && (
          <div className="item-details-overlay">
            <button className="details-btn" onClick={handleShowDetails}>
              تفاصيل
            </button>
          </div>
        )}
      </div>
      <div className="item-info">
        <h3 className="item-name">{item.name}</h3>
        <p className="item-price">{item.price.toFixed(2)} ج.م</p>
      </div>
    </div>
  );
}

export default MenuItem;
