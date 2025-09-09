import React from "react";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import "./DetailsModal.css";

function DetailsModal({ item, onClose }) {
  const { addToCart } = useCart();

  if (!item) {
    return null;
  }

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(`تمت إضافة "${item.name}" إلى السلة`);
    onClose();
  };

  const handleModalContentClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <h2 className="modal-title">{item.name}</h2>
        <p className="modal-details-label">المكونات:</p>
        <p className="modal-details-text">{item.details}</p>

        <div className="modal-actions">
          <button className="modal-btn-primary" onClick={handleAddToCart}>
            أضف إلى السلة ({item.price.toFixed(2)} ج.م)
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;
