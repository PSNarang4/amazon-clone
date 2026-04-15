import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './CartPage.css';

function CartPage() {
  const { cart, updateQty, removeItem } = useCart();
  const navigate = useNavigate();
  const { items = [], summary = {} } = cart;

  if (items.length === 0) {
    return (
      <div className="cart-empty-wrapper">
        <div className="cart-empty-inner">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your Amazon Cart is empty</h2>
          <p>Your shopping cart is waiting. Give it purpose – fill it with groceries, clothing, household supplies, electronics, and more.</p>
          <Link to="/products" className="btn-amazon-primary" style={{ display: 'inline-block', textDecoration: 'none', marginTop: 16, width: 'auto', padding: '10px 24px' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-wrapper container">
      <div className="cart-left">
        <div className="cart-header-bar">
          <h1>Shopping Cart</h1>
          <span className="cart-header-price">Price</span>
        </div>

        {items.map(item => (
          <div key={item.cart_item_id} className="cart-item">
            <img
              src={item.image_url || 'https://via.placeholder.com/100?text=No+Image'}
              alt={item.name}
              className="cart-item-img"
              onError={e => { e.target.src = 'https://via.placeholder.com/100?text=No+Image'; }}
            />
            <div className="cart-item-details">
              <Link to={`/products/${item.product_id}`} className="cart-item-name">
                {item.name}
              </Link>
              <p className="cart-item-brand">{item.brand}</p>
              {item.is_prime && (
                <div className="cart-prime-row">
                  <span className="prime-badge">prime</span>
                  <span style={{ fontSize: 12, color: '#007600' }}>FREE Delivery</span>
                </div>
              )}
              {item.stock <= 5 && item.stock > 0 && (
                <p className="low-stock">Only {item.stock} left in stock</p>
              )}
              <div className="cart-item-actions">
                <div className="qty-controls">
                  <button
                    onClick={() => updateQty(item.cart_item_id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="qty-btn"
                  >
                    −
                  </button>
                  <span className="qty-display">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.cart_item_id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="qty-btn"
                  >
                    +
                  </button>
                </div>
                <span className="action-divider">|</span>
                <button
                  className="cart-action-btn"
                  onClick={() => removeItem(item.cart_item_id)}
                >
                  Delete
                </button>
                <span className="action-divider">|</span>
                <button className="cart-action-btn">Save for later</button>
              </div>
            </div>
            <div className="cart-item-price">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </div>
          </div>
        ))}

        <div className="cart-subtotal-row">
          Subtotal ({summary.totalItems} item{summary.totalItems !== 1 ? 's' : ''}):
          <strong> ₹{summary.subtotal?.toLocaleString('en-IN')}</strong>
        </div>
      </div>

      {/* Order summary sidebar */}
      <div className="cart-right">
        <div className="cart-summary-box">
          {summary.subtotal >= 499 && (
            <div className="cart-summary-eligible">
              ✓ Your order is eligible for FREE Delivery.
            </div>
          )}
          <div className="cart-summary-subtotal">
            Subtotal ({summary.totalItems} item{summary.totalItems !== 1 ? 's' : ''}):
            <br/>
            <strong style={{ fontSize: 20 }}>₹{summary.subtotal?.toLocaleString('en-IN')}</strong>
          </div>
          {summary.shipping > 0 && (
            <div className="cart-summary-shipping">
              + ₹{summary.shipping} shipping
            </div>
          )}
          <div className="cart-gift-row">
            <input type="checkbox" id="gift" />
            <label htmlFor="gift"> This order contains a gift</label>
          </div>
          <button
            className="btn-amazon-primary"
            onClick={() => navigate('/checkout')}
          >
            Proceed to Buy
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
