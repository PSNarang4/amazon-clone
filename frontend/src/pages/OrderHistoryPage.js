import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../services/api';
import './OrderHistoryPage.css';

function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders()
      .then(res => setOrders(res.data.data))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="ohp-wrapper container">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 140, borderRadius: 6, marginBottom: 14 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="ohp-wrapper container">
      <div className="ohp-header">
        <h1>Your Orders</h1>
        <span>{orders.length} order{orders.length !== 1 ? 's' : ''} placed</span>
      </div>

      {orders.length === 0 ? (
        <div className="ohp-empty">
          <h2>No orders yet</h2>
          <p>Looks like you haven't placed any orders. Start shopping!</p>
          <Link to="/products" className="btn-amazon-primary" style={{ display: 'inline-block', width: 'auto', padding: '10px 24px', marginTop: 16, textDecoration: 'none' }}>
            Shop Now
          </Link>
        </div>
      ) : (
        <div className="ohp-list">
          {orders.map(order => (
            <div key={order.order_id} className="ohp-order-card">
              {/* Card header */}
              <div className="ohp-card-header">
                <div className="ohp-header-col">
                  <span className="ohp-col-label">ORDER PLACED</span>
                  <span className="ohp-col-value">
                    {new Date(order.placed_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'long', year: 'numeric'
                    })}
                  </span>
                </div>
                <div className="ohp-header-col">
                  <span className="ohp-col-label">TOTAL</span>
                  <span className="ohp-col-value">₹{Number(order.total).toLocaleString('en-IN')}</span>
                </div>
                <div className="ohp-header-col">
                  <span className="ohp-col-label">PAYMENT</span>
                  <span className="ohp-col-value" style={{ textTransform: 'uppercase' }}>{order.payment_method}</span>
                </div>
                <div className="ohp-header-col ohp-order-id-col">
                  <span className="ohp-col-label">ORDER # {order.order_id}</span>
                  <Link to={`/order-confirm/${order.order_id}`} className="ohp-detail-link">
                    View order details
                  </Link>
                </div>
              </div>

              {/* Card body */}
              <div className="ohp-card-body">
                <div className="ohp-status-row">
                  <span className={`ohp-status status-${order.status}`}>
                    {order.status === 'delivered' ? '✓ ' : ''}
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>

                <div className="ohp-items-row">
                  {order.items.map((item, i) => (
                    <div key={i} className="ohp-item-thumb">
                      <img
                        src={item.product_image || 'https://via.placeholder.com/80?text=X'}
                        alt={item.product_name}
                        onError={e => { e.target.src = 'https://via.placeholder.com/80?text=X'; }}
                      />
                      <p className="ohp-item-name">{item.product_name.slice(0, 50)}{item.product_name.length > 50 ? '…' : ''}</p>
                      <p className="ohp-item-qty">Qty: {item.quantity}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderHistoryPage;
