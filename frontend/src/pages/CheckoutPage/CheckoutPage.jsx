import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

function CheckoutPage() {
  const [branches, setBranches] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    branch: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { cartItems, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3000/api/branches' )
      .then(res => res.json())
      .then(data => setBranches(data))
      .catch(err => console.error("Failed to fetch branches:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error('لا يمكنك تأكيد طلب فارغ!');
      return;
    }
    setIsSubmitting(true);

    const orderData = {
      userInfo: formData,
      cartItems: cartItems.map(item => ({ id: item.id, name: item.name, quantity: item.quantity, price: item.price })),
      totalPrice: totalPrice.toFixed(2)
    };

    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData )
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      toast.custom((t) => (
        <div className={`success-toast ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
          <h3>تم تأكيد الطلب بنجاح!</h3>
          <p>سيصلك الطلب قريباً.</p>
          <button onClick={() => {
            toast.dismiss(t.id);
            navigate('/');
          }}>
            العودة للرئيسية
          </button>
        </div>
      ), { duration: 60000 });

      clearCart();

    } catch (error) {
      console.error('Failed to submit order:', error);
      toast.error('حدث خطأ أثناء تأكيد الطلب. يرجى المحاولة مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page-container">
      <header className="checkout-page-header">
        <Link to="/cart" className="back-link">
          <span className="back-arrow">→</span>
        </Link>
        <h1>معلومات التوصيل</h1>
      </header>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">الاسم الكامل</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">رقم الهاتف</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">العنوان بالتفصيل</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="branch">اختر أقرب فرع للاستلام</label>
          <select id="branch" name="branch" value={formData.branch} onChange={handleChange} required>
            <option value="" disabled>-- اختر الفرع --</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.name}>{branch.name}</option>
            ))}
          </select>
        </div>

        <div className="form-notice">
          <p>لا يمكن تغيير المعلومات بعد تأكيد الطلب.</p>
        </div>

        <button type="submit" className="submit-order-btn" disabled={isSubmitting || cartItems.length === 0}>
          {isSubmitting ? '...جاري التأكيد' : `تأكيد الطلب النهائي (${totalPrice.toFixed(2)} ج.م)`}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
