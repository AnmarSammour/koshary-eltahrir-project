import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useLocale } from '../../i18n'; 
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
  const { locale } = useLocale(); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://koshary-eltahrir-project-1.onrender.com/api/branches?lang=${locale}`)
      .then(res => res.json())
      .then(data => setBranches(data))
      .catch(err => console.error("Failed to fetch branches:", err));
  }, [locale]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error(locale === 'en' ? 'You cannot confirm an empty order!' : 'لا يمكنك تأكيد طلب فارغ!');
      return;
    }
    setIsSubmitting(true);

    const orderData = {
      userInfo: formData,
      cartItems: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      totalPrice: totalPrice.toFixed(2),
      lang: locale 
    };

    try {
      const response = await fetch(`https://koshary-eltahrir-project-1.onrender.com/api/orders?lang=${locale}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) throw new Error('Network response was not ok.');

      toast.custom((t) => (
        <div className={`success-toast ${t.visible ? 'animate-enter' : 'animate-leave'}`}>
          <h3>{locale === 'en' ? 'Order Confirmed Successfully!' : 'تم تأكيد الطلب بنجاح!'}</h3>
          <p>{locale === 'en' ? 'Your order will arrive soon.' : 'سيصلك الطلب قريباً.'}</p>
          <button onClick={() => {
            toast.dismiss(t.id);
            navigate('/');
          }}>
            {locale === 'en' ? 'Back to Home' : 'العودة للرئيسية'}
          </button>
        </div>
      ), { duration: 60000 });

      clearCart();
    } catch (error) {
      console.error('Failed to submit order:', error);
      toast.error(locale === 'en'
        ? 'Failed to submit order. Please try again.'
        : 'حدث خطأ أثناء تأكيد الطلب. يرجى المحاولة مرة أخرى.');
      setIsSubmitting(false);
    }
  };

  return (
     <div className="checkout-page-container">
      <div className="checkout-header-row">
        <Link to="/cart" className="back-link">
          <span className="back-arrow">{locale === "ar" ? "←" : "→"}</span>
        </Link>
        <h1 className="checkout-page-title">
          {locale === 'en' ? 'Delivery Information' : 'معلومات التوصيل'}
        </h1>
      </div>
      <form className="checkout-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">{locale === 'en' ? 'Full Name' : 'الاسم الكامل'}</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">{locale === 'en' ? 'Phone Number' : 'رقم الهاتف'}</label>
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="address">{locale === 'en' ? 'Detailed Address' : 'العنوان بالتفصيل'}</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="branch">{locale === 'en' ? 'Choose the nearest branch for pickup' : 'اختر أقرب فرع للاستلام'}</label>
          <select id="branch" name="branch" value={formData.branch} onChange={handleChange} required>
            <option value="" disabled>{locale === 'en' ? '-- Choose a branch --' : '-- اختر الفرع --'}</option>
            {branches.map(branch => (
              <option key={branch.id} value={branch.name}>{branch.name}</option>
            ))}
          </select>
        </div>

        <div className="form-notice">
          <p>{locale === 'en' ? 'Information cannot be changed after confirming the order.' : 'لا يمكن تغيير المعلومات بعد تأكيد الطلب.'}</p>
        </div>

        <button type="submit" className="submit-order-btn" disabled={isSubmitting || cartItems.length === 0}>
          {isSubmitting
            ? (locale === 'en' ? 'Submitting...' : '...جاري التأكيد')
            : (locale === 'en'
                ? `Confirm Final Order (${totalPrice.toFixed(2)} EGP)`
                : `تأكيد الطلب النهائي (${totalPrice.toFixed(2)} ج.م)`)}
        </button>
      </form>
    </div>
  );
}

export default CheckoutPage;
