import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchOrderById } from '../services/api';
import './OrderConfirmPage.css';

function OrderConfirmPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderById(orderId)
      .then(res => setOrder(res.data.data))
      .catch(err => console.error('Could not load order:', err))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="ocp-loading">
        <div className="skeleton" style={{ height: 300, borderRadius: 8 }} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="ocp-loading" style={{ textAlign: 'center', paddingTop: 60 }}>
        <h2>Order not found</h2>
        <Link to="/">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="ocp-wrapper container">
      {/* Success header */}
      <div className="ocp-success-banner">
        <div className="ocp-checkmark">✓</div>
        <div>
          <h1>Order Placed, Thank you!</h1>
          <p>Confirmation will be sent to your registered email address.</p>
        </div>
      </div>

      <div className="ocp-main">
        {/* Left: order details */}
        <div className="ocp-details">
          <div className="ocp-card">
            <div className="ocp-order-id-row">
              <div>
                <span className="ocp-label">Your order ID:</span>
                <strong className="ocp-order-id">{order.order_id}</strong>
              </div>
              <span className={`ocp-status status-${order.status}`}>{order.status.toUpperCase()}</span>
            </div>

            <div className="ocp-delivery-estimate">
              <span className="ocp-truck">🚚</span>
              <div>
                <strong>Estimated Delivery</strong>
                <p>
                  {(() => {
                    const d = new Date();
                    d.setDate(d.getDate() + 5);
                    return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
                  })()}
                </p>
              </div>
            </div>

            <hr className="section-divider" />

            <h3>Items in your order</h3>
            {order.items.map((item, i) => (
              <div key={i} className="ocp-item">
                <img
                  src={item.product_image || 'https://via.placeholder.com/80?text=X'}
                  alt={item.product_name}
                  onError={e => { e.target.src = 'https://via.placeholder.com/80?text=X'; }}
                />
                <div className="ocp-item-info">
                  <p className="ocp-item-name">{item.product_name}</p>
                  <p className="ocp-item-qty">Qty: {item.quantity}</p>
                  <p className="ocp-item-price">₹{Number(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Shipping address */}
          <div className="ocp-card">
            <h3>Delivery address</h3>
            <p><strong>{order.shipping_name}</strong></p>
            <p>{order.shipping_address}</p>
            <p>{order.shipping_city}, {order.shipping_state} – {order.shipping_pincode}</p>
            <p>{order.shipping_phone}</p>
          </div>
        </div>

        {/* Right: summary */}
        <div className="ocp-summary">
          <div className="ocp-card">
            <h3>Order Summary</h3>
            <div className="ocp-summary-row">
              <span>Items ({order.items.length}):</span>
              <span>₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="ocp-summary-row">
              <span>Delivery:</span>
              <span>
                {parseFloat(order.shipping_fee) === 0
                  ? <span style={{ color: '#007600' }}>FREE</span>
                  : `₹${Number(order.shipping_fee).toLocaleString('en-IN')}`}
              </span>
            </div>
            <hr />
            <div className="ocp-summary-row ocp-total">
              <span>Order Total:</span>
              <span>₹{Number(order.total).toLocaleString('en-IN')}</span>
            </div>
            <div className="ocp-summary-row">
              <span>Payment:</span>
              <span style={{ textTransform: 'uppercase', fontWeight: 600 }}>{order.payment_method}</span>
            </div>
          </div>

          <div className="ocp-actions">
            <Link to="/orders" className="ocp-btn-secondary">View all orders</Link>
            <Link to="/products" className="ocp-btn-primary">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmPage;
