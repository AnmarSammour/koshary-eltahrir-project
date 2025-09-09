import React from "react";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";
import { useIntl, FormattedMessage } from "react-intl";
import "./DetailsModal.css";

function DetailsModal({ item, onClose }) {
  const { addToCart } = useCart();
  const intl = useIntl();

  if (!item) return null;

  const handleAddToCart = () => {
    addToCart(item);
    toast.success(intl.formatMessage({ id: "item_added_to_cart" }, { itemName: item.name }));
    onClose();
  };

  const handleModalContentClick = (e) => e.stopPropagation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleModalContentClick}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
        <h2 className="modal-title">{item.name}</h2>
        <p className="modal-details-label">
          <FormattedMessage id="ingredients" />
        </p>
        <p className="modal-details-text">{item.details}</p>

        <div className="modal-actions">
          <button className="modal-btn-primary" onClick={handleAddToCart}>
            <FormattedMessage id="add_to_cart" /> ({item.price.toFixed(2)}{" "}
            {intl.formatMessage({ id: "egp" })})
          </button>
        </div>
      </div>
    </div>
  );
}

export default DetailsModal;
