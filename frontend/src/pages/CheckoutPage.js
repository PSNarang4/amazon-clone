import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { placeOrder } from '../services/api';
import { toast } from 'react-toastify';
import './CheckoutPage.css';

const PAYMENT_METHODS = [
  { id: 'cod', label: 'Cash on Delivery (COD)' },
  { id: 'upi', label: 'UPI (Pay after delivery simulation)' },
  { id: 'card', label: 'Credit / Debit Card (simulation)' },
];

function CheckoutPage() {
  const { cart, refreshCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shipping_name: '',
    shipping_address: '',
    shipping_city: '',
    shipping_state: '',
    shipping_pincode: '',
    shipping_phone: '',
    payment_method: 'cod'
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = address, 2 = payment, 3 = review

  const { items = [], summary = {} } = cart;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!form.shipping_name.trim()) newErrors.shipping_name = 'Full name is required';
    if (!form.shipping_address.trim()) newErrors.shipping_address = 'Address is required';
    if (!form.shipping_city.trim()) newErrors.shipping_city = 'City is required';
    if (!form.shipping_state.trim()) newErrors.shipping_state = 'State is required';
    if (!/^\d{6}$/.test(form.shipping_pincode)) newErrors.shipping_pincode = 'Valid 6-digit PIN required';
    if (!/^\d{10}$/.test(form.shipping_phone)) newErrors.shipping_phone = 'Valid 10-digit mobile number required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2) setStep(3);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const res = await placeOrder(form);
      await refreshCart();
      toast.success('Order placed successfully!');
      navigate(`/order-confirm/${res.data.data.order_id}`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong placing your order';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 60 }}>
        <h2>Your cart is empty</h2>
        <button onClick={() => navigate('/products')} className="btn-amazon-primary" style={{ width: 'auto', padding: '10px 24px', marginTop: 16 }}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-wrapper container">
      {/* Step Indicator */}
      <div className="checkout-steps">
        {['Shipping Address', 'Payment', 'Review Order'].map((label, i) => (
          <div key={i} className={`checkout-step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
            <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
            <span>{label}</span>
          </div>
        ))}
      </div>

      <div className="checkout-main">
        {/* Left: Form area */}
        <div className="checkout-form-area">

          {/* Step 1: Shipping address */}
          {step === 1 && (
            <div className="checkout-card">
              <h2>Add a new delivery address</h2>

              <div className="form-row">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input name="shipping_name" value={form.shipping_name} onChange={handleChange} placeholder="Rahul Sharma" />
                  {errors.shipping_name && <span className="field-error">{errors.shipping_name}</span>}
                </div>
                <div className="form-group">
                  <label>Mobile Number *</label>
                  <input name="shipping_phone" value={form.shipping_phone} onChange={handleChange} placeholder="10-digit mobile" maxLength={10} />
                  {errors.shipping_phone && <span className="field-error">{errors.shipping_phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label>Flat, House no., Building, Company, Apartment *</label>
                <input name="shipping_address" value={form.shipping_address} onChange={handleChange} placeholder="e.g. B-42, Anand Nagar" />
                {errors.shipping_address && <span className="field-error">{errors.shipping_address}</span>}
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Town/City *</label>
                  <input name="shipping_city" value={form.shipping_city} onChange={handleChange} placeholder="City" />
                  {errors.shipping_city && <span className="field-error">{errors.shipping_city}</span>}
                </div>
                <div className="form-group">
                  <label>State *</label>
                  <select name="shipping_state" value={form.shipping_state} onChange={handleChange}>
                    <option value="">Select State</option>
                    {['Andhra Pradesh','Delhi','Gujarat','Haryana','Karnataka','Kerala','Maharashtra','Punjab','Rajasthan','Tamil Nadu','Telangana','Uttar Pradesh','West Bengal'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.shipping_state && <span className="field-error">{errors.shipping_state}</span>}
                </div>
                <div className="form-group">
                  <label>PIN Code *</label>
                  <input name="shipping_pincode" value={form.shipping_pincode} onChange={handleChange} placeholder="6-digit PIN" maxLength={6} />
                  {errors.shipping_pincode && <span className="field-error">{errors.shipping_pincode}</span>}
                </div>
              </div>

              <button className="btn-amazon-primary" style={{ maxWidth: 240 }} onClick={handleNextStep}>
                Use this address
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="checkout-card">
              <h2>Select a payment method</h2>
              <div className="payment-options">
                {PAYMENT_METHODS.map(pm => (
                  <label key={pm.id} className={`payment-option ${form.payment_method === pm.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment_method"
                      value={pm.id}
                      checked={form.payment_method === pm.id}
                      onChange={handleChange}
                    />
                    <span>{pm.label}</span>
                  </label>
                ))}
              </div>
              <div className="checkout-nav">
                <button className="btn-amazon-secondary" style={{ maxWidth: 160 }} onClick={() => setStep(1)}>← Back</button>
                <button className="btn-amazon-primary" style={{ maxWidth: 240 }} onClick={handleNextStep}>Continue</button>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="checkout-card">
              <h2>Review your order</h2>

              <div className="review-section">
                <h4>Delivery address</h4>
                <p>{form.shipping_name}</p>
                <p>{form.shipping_address}</p>
                <p>{form.shipping_city}, {form.shipping_state} – {form.shipping_pincode}</p>
                <p>{form.shipping_phone}</p>
                <button className="change-btn" onClick={() => setStep(1)}>Change</button>
              </div>

              <div className="review-section">
                <h4>Payment method</h4>
                <p>{PAYMENT_METHODS.find(p => p.id === form.payment_method)?.label}</p>
                <button className="change-btn" onClick={() => setStep(2)}>Change</button>
              </div>

              <div className="review-items">
                <h4>Items ({items.length})</h4>
                {items.map(item => (
                  <div key={item.cart_item_id} className="review-item">
                    <img src={item.image_url || 'https://via.placeholder.com/60?text=X'} alt={item.name} />
                    <div>
                      <p className="review-item-name">{item.name}</p>
                      <p className="review-item-qty">Qty: {item.quantity}</p>
                    </div>
                    <strong>₹{(item.price * item.quantity).toLocaleString('en-IN')}</strong>
                  </div>
                ))}
              </div>

              <div className="checkout-nav">
                <button className="btn-amazon-secondary" style={{ maxWidth: 160 }} onClick={() => setStep(2)}>← Back</button>
                <button
                  className="btn-amazon-primary place-order-btn"
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  style={{ maxWidth: 260 }}
                >
                  {loading ? 'Placing Order...' : `Place your order – ₹${summary.total?.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Order summary */}
        <div className="checkout-sidebar">
          <div className="checkout-summary-box">
            <button
              className="btn-amazon-primary"
              onClick={step === 3 ? handlePlaceOrder : handleNextStep}
              disabled={loading}
            >
              {step === 3
                ? (loading ? 'Placing...' : 'Place your order')
                : 'Continue'}
            </button>
            <p className="checkout-legal">
              By placing your order, you agree to Amazon's privacy notice and conditions of use.
            </p>
            <hr />
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Items ({summary.totalItems}):</span>
              <span>₹{summary.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            <div className="summary-row">
              <span>Delivery:</span>
              <span>{summary.shipping === 0 ? <span style={{ color: '#007600' }}>FREE</span> : `₹${summary.shipping}`}</span>
            </div>
            <hr />
            <div className="summary-row total-row">
              <span>Order Total:</span>
              <span>₹{summary.total?.toLocaleString('en-IN')}</span>
            </div>
            {summary.subtotal < 499 && (
              <p className="summary-free-note">Add ₹{(499 - summary.subtotal).toFixed(0)} more for free delivery</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
