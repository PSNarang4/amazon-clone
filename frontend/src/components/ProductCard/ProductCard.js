import React from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating/StarRating';
import { useCart } from '../../context/CartContext';
import './ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="card-img-wrap">
        <img
          src={product.primary_image || `https://via.placeholder.com/300x300?text=No+Image`}
          alt={product.name}
          className="card-img"
          loading="lazy"
          onError={e => { e.target.src = 'https://via.placeholder.com/300x300?text=No+Image'; }}
        />
        {discount && discount > 0 && (
          <span className="card-discount-badge">-{discount}%</span>
        )}
      </div>

      <div className="card-body">
        <p className="card-name">{product.name}</p>

        {product.brand && (
          <p className="card-brand">by {product.brand}</p>
        )}

        <div className="card-rating">
          <StarRating rating={product.rating || 0} reviewCount={product.review_count} size={13} />
        </div>

        <div className="card-price-row">
          <span className="card-price">
            <span className="price-symbol">₹</span>
            {Number(product.price).toLocaleString('en-IN')}
          </span>
          {product.original_price && (
            <span className="card-original-price">
              M.R.P: <s>₹{Number(product.original_price).toLocaleString('en-IN')}</s>
            </span>
          )}
        </div>

        {product.is_prime && (
          <div className="card-prime">
            <span className="prime-text">prime</span>
            <span className="free-delivery">FREE Delivery</span>
          </div>
        )}

        {product.stock === 0 && (
          <p className="out-of-stock-label">Out of Stock</p>
        )}

        {product.stock > 0 && (
          <button className="card-add-btn" onClick={handleAddToCart}>
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
}

export default ProductCard;
