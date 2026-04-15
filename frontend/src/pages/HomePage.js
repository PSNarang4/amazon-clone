import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/ProductCard/ProductCard';
import './HomePage.css';

const HERO_BANNERS = [
  {
    id: 1,
    title: "Great Indian Sale",
    subtitle: "Up to 70% off on Electronics",
    cta: "Shop Now",
    link: "/products?category=electronics",
    bg: "linear-gradient(135deg, #131921 0%, #232f3e 100%)",
    accent: "#ff9900"
  },
  {
    id: 2,
    title: "New Season Styles",
    subtitle: "Fashion for everyone",
    cta: "Explore Fashion",
    link: "/products?category=clothing",
    bg: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
    accent: "#febd69"
  },
  {
    id: 3,
    title: "Home Refresh",
    subtitle: "Upgrade your living space",
    cta: "Discover Deals",
    link: "/products?category=home-kitchen",
    bg: "linear-gradient(135deg, #1b1b1b 0%, #2d2d2d 100%)",
    accent: "#ff9900"
  }
];

function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      fetchProducts({ limit: 8, sort: 'rating' }),
      fetchCategories()
    ]).then(([prodRes, catRes]) => {
      setFeaturedProducts(prodRes.data.data);
      setCategories(catRes.data.data);
    }).finally(() => setLoading(false));
  }, []);

  // auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % HERO_BANNERS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="homepage">
      {/* Hero Banner Carousel */}
      <div className="hero-banner" style={{ background: HERO_BANNERS[currentBanner].bg }}>
        <div className="hero-content">
          <h1 style={{ color: HERO_BANNERS[currentBanner].accent }}>
            {HERO_BANNERS[currentBanner].title}
          </h1>
          <p>{HERO_BANNERS[currentBanner].subtitle}</p>
          <button
            className="hero-cta"
            style={{ borderColor: HERO_BANNERS[currentBanner].accent, color: HERO_BANNERS[currentBanner].accent }}
            onClick={() => navigate(HERO_BANNERS[currentBanner].link)}
          >
            {HERO_BANNERS[currentBanner].cta} →
          </button>
        </div>
        <div className="banner-dots">
          {HERO_BANNERS.map((_, i) => (
            <button
              key={i}
              className={`dot ${i === currentBanner ? 'active' : ''}`}
              onClick={() => setCurrentBanner(i)}
            />
          ))}
        </div>
      </div>

      {/* Category Cards Grid */}
      <div className="category-section container">
        <div className="category-grid">
          {categories.slice(0, 8).map(cat => (
            <Link to={`/products?category=${cat.slug}`} key={cat.id} className="category-card">
              <div className="cat-img-wrap">
                <img
                  src={cat.image_url}
                  alt={cat.name}
                  onError={e => { e.target.src = 'https://via.placeholder.com/150?text=' + cat.name; }}
                />
              </div>
              <p className="cat-name">{cat.name}</p>
              <span className="cat-link">Shop now &rsaquo;</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Prime Banner */}
      <div className="prime-banner container">
        <div className="prime-inner">
          <span className="prime-logo">prime</span>
          <div>
            <strong>Try Amazon Prime</strong>
            <p>FREE Delivery on eligible orders · Exclusive deals · Prime Video &amp; more</p>
          </div>
          <button className="prime-btn">Start 30-day free trial</button>
        </div>
      </div>

      {/* Best Sellers */}
      <div className="section container">
        <div className="section-header">
          <h2>Best Sellers</h2>
          <Link to="/products?sort=rating" className="see-all">See all &rsaquo;</Link>
        </div>
        {loading ? (
          <div className="products-grid">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="skeleton-card skeleton" />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {featuredProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>

      {/* Deals Banner */}
      <div className="deals-banner container">
        <div className="deal-card" onClick={() => navigate('/products?category=electronics')}>
          <h3>🔥 Lightning Deals</h3>
          <p>Up to 60% off on top electronics</p>
          <span>Shop Electronics &rsaquo;</span>
        </div>
        <div className="deal-card" onClick={() => navigate('/products?category=books')}>
          <h3>📚 Books & Reading</h3>
          <p>Expand your mind — bestsellers on sale</p>
          <span>Browse Books &rsaquo;</span>
        </div>
        <div className="deal-card" onClick={() => navigate('/products?category=sports-fitness')}>
          <h3>💪 Sports & Fitness</h3>
          <p>Build your home gym for less</p>
          <span>See Deals &rsaquo;</span>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
