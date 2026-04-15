import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchWishlist, toggleWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating/StarRating';
import { toast } from 'react-toastify';
import './WishlistPage.css';

function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  const loadWishlist = () => {
    fetchWishlist()
      .then(res => setItems(res.data.data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadWishlist(); }, []);

  const handleRemove = async (productId) => {
    await toggleWishlist(productId);
    toast.info('Removed from wishlist');
    loadWishlist();
  };

  const handleMoveToCart = async (productId) => {
    await addToCart(productId, 1);
    await toggleWishlist(productId);
    loadWishlist();
  };

  return (
    <div className="wl-wrapper container">
      <div className="wl-header">
        <h1>Your Wish List</h1>
        <span>{items.length} item{items.length !== 1 ? 's' : ''}</span>
      </div>

      {loading ? (
        <div className="wl-grid">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 300, borderRadius: 6 }} />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="wl-empty">
          <div className="wl-empty-icon">♡</div>
          <h2>Your Wish List is empty</h2>
          <p>Add items you want to buy later by clicking the heart icon on product pages.</p>
          <Link to="/products" className="wl-browse-btn">Browse products</Link>
        </div>
      ) : (
        <div className="wl-grid">
          {items.map(item => {
            const discount = item.original_price
              ? Math.round(((item.original_price - item.price) / item.original_price) * 100)
              : null;

            return (
              <div key={item.wishlist_id} className="wl-card">
                <button
                  className="wl-remove-btn"
                  onClick={() => handleRemove(item.product_id)}
                  title="Remove from wishlist"
                >
                  ✕
                </button>

                <Link to={`/products/${item.product_id}`} className="wl-img-link">
                  <img
                    src={item.image_url || 'https://via.placeholder.com/200?text=No+Image'}
                    alt={item.name}
                    className="wl-img"
                    onError={e => { e.target.src = 'https://via.placeholder.com/200?text=No+Image'; }}
                  />
                </Link>

                <div className="wl-card-body">
                  <Link to={`/products/${item.product_id}`} className="wl-name">
                    {item.name}
                  </Link>

                  <div className="wl-rating">
                    <StarRating rating={item.rating || 0} reviewCount={item.review_count} size={12} />
                  </div>

                  <div className="wl-price-row">
                    <span className="wl-price">₹{Number(item.price).toLocaleString('en-IN')}</span>
                    {discount && <span className="wl-discount">-{discount}%</span>}
                  </div>
                  {item.original_price && (
                    <p className="wl-original">M.R.P: <s>₹{Number(item.original_price).toLocaleString('en-IN')}</s></p>
                  )}

                  {item.is_prime && (
                    <div className="wl-prime-row">
                      <span className="prime-badge">prime</span>
                      <span style={{ fontSize: 11, color: '#007600' }}>FREE Delivery</span>
                    </div>
                  )}

                  <div className="wl-actions">
                    <button
                      className="wl-add-cart-btn"
                      onClick={() => handleMoveToCart(item.product_id)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default WishlistPage;
