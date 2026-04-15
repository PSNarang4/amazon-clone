import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProductById, toggleWishlist } from '../services/api';
import { useCart } from '../context/CartContext';
import StarRating from '../components/StarRating/StarRating';
import { toast } from 'react-toastify';
import './ProductDetailPage.css';

function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [specs, setSpecs] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchProductById(id)
      .then(res => {
        const data = res.data.data;
        setProduct(data);
        setImages(data.images || []);
        setSpecs(data.specs || []);
      })
      .catch(() => navigate('/products'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    setAdding(true);
    await addToCart(product.id, quantity);
    setAdding(false);
  };

  const handleBuyNow = async () => {
    setAdding(true);
    await addToCart(product.id, quantity);
    setAdding(false);
    navigate('/checkout');
  };

  const handleWishlist = async () => {
    try {
      const res = await toggleWishlist(product.id);
      setWishlisted(res.data.action === 'added');
      toast.info(res.data.message);
    } catch {
      toast.error('Wishlist update failed');
    }
  };

  const discount = product?.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : null;

  const displayImages = images.length > 0
    ? images
    : [{ image_url: 'https://via.placeholder.com/500?text=No+Image' }];

  if (loading) {
    return (
      <div className="pdp-skeleton container">
        <div className="skeleton" style={{ height: 400, borderRadius: 8 }} />
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="pdp-wrapper container">
      {/* Breadcrumb */}
      <div className="pdp-breadcrumb">
        <span onClick={() => navigate('/')}>Home</span>
        <span> › </span>
        <span onClick={() => navigate(`/products?category=${product.category_slug}`)}>
          {product.category_name}
        </span>
        <span> › </span>
        <span className="current">{product.name.slice(0, 50)}...</span>
      </div>

      <div className="pdp-main">
        {/* Image Section */}
        <div className="pdp-images">
          {/* Thumbnails */}
          <div className="img-thumbnails">
            {displayImages.map((img, i) => (
              <div
                key={i}
                className={`thumb ${activeImg === i ? 'active' : ''}`}
                onClick={() => setActiveImg(i)}
              >
                <img src={img.image_url} alt={`view ${i + 1}`} />
              </div>
            ))}
          </div>

          {/* Main image */}
          <div className="img-main-wrap">
            <img
              src={displayImages[activeImg]?.image_url}
              alt={product.name}
              className="img-main"
              onError={e => { e.target.src = 'https://via.placeholder.com/500?text=No+Image'; }}
            />
            {/* Carousel arrows */}
            {displayImages.length > 1 && (
              <>
                <button
                  className="img-arrow left"
                  onClick={() => setActiveImg(prev => (prev - 1 + displayImages.length) % displayImages.length)}
                >‹</button>
                <button
                  className="img-arrow right"
                  onClick={() => setActiveImg(prev => (prev + 1) % displayImages.length)}
                >›</button>
              </>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="pdp-info">
          <h1 className="pdp-title">{product.name}</h1>

          {product.brand && (
            <p className="pdp-brand">
              Brand: <a href="#!">{product.brand}</a>
            </p>
          )}

          <div className="pdp-rating">
            <StarRating rating={product.rating} reviewCount={product.review_count} size={15} />
          </div>

          <hr className="section-divider" />

          {/* Price block */}
          <div className="pdp-price-block">
            {discount && (
              <span className="pdp-deal-label">Deal</span>
            )}
            <div className="pdp-price-row">
              <span className="pdp-symbol">₹</span>
              <span className="pdp-price">{Number(product.price).toLocaleString('en-IN')}</span>
            </div>
            {product.original_price && (
              <div className="pdp-original">
                M.R.P.: <s>₹{Number(product.original_price).toLocaleString('en-IN')}</s>
                {discount && (
                  <span className="pdp-discount"> ({discount}% off)</span>
                )}
              </div>
            )}
            {product.is_prime && (
              <div className="pdp-prime">
                <span className="prime-badge">prime</span>
                <span className="pdp-free-delivery">FREE delivery on orders over ₹499</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="pdp-about">
            <h4>About this item</h4>
            <p>{product.description}</p>
          </div>
        </div>

        {/* Buy Box */}
        <div className="pdp-buybox">
          <div className="buybox-price">
            <span className="bb-symbol">₹</span>
            <span className="bb-price">{Number(product.price).toLocaleString('en-IN')}</span>
          </div>

          {product.is_prime && (
            <div className="bb-prime">
              <span className="prime-badge">prime</span>
              <span style={{ fontSize: 12 }}>FREE Delivery</span>
            </div>
          )}

          <div className="bb-stock">
            {product.stock > 0 ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-stock">Currently unavailable</span>
            )}
          </div>

          {product.stock > 0 && (
            <>
              <div className="bb-qty-row">
                <label>Qty:</label>
                <select
                  value={quantity}
                  onChange={e => setQuantity(Number(e.target.value))}
                  className="bb-qty-select"
                >
                  {[...Array(Math.min(product.stock, 10))].map((_, i) => (
                    <option key={i + 1} value={i + 1}>{i + 1}</option>
                  ))}
                </select>
              </div>

              <button
                className="btn-amazon-primary"
                onClick={handleAddToCart}
                disabled={adding}
              >
                {adding ? 'Adding...' : 'Add to Cart'}
              </button>

              <button
                className="btn-buy-now"
                onClick={handleBuyNow}
                disabled={adding}
              >
                Buy Now
              </button>
            </>
          )}

          <button
            className="bb-wishlist"
            onClick={handleWishlist}
          >
            {wishlisted ? '♥ Wishlisted' : '♡ Add to Wish List'}
          </button>

          <div className="bb-secure">
            🔒 Secure transaction
          </div>

          <div className="bb-seller">
            <div><span>Sold by</span> <strong>Amazon Retail India</strong></div>
            <div><span>Ships from</span> <strong>Amazon</strong></div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      {specs.length > 0 && (
        <div className="pdp-specs">
          <h3>Technical Specifications</h3>
          <table className="specs-table">
            <tbody>
              {specs.map((s, i) => (
                <tr key={i} className={i % 2 === 0 ? 'even' : 'odd'}>
                  <td className="spec-key">{s.spec_key}</td>
                  <td className="spec-val">{s.spec_value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default ProductDetailPage;
