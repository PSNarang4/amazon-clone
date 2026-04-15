import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { fetchCategories } from '../../services/api';
import './Navbar.css';

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState([]);
  const [showCategoryDrop, setShowCategoryDrop] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();
  const catRef = useRef(null);

  useEffect(() => {
    fetchCategories()
      .then(res => setCategories(res.data.data))
      .catch(() => {});
  }, []);

  // close dropdown if clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) {
        setShowCategoryDrop(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set('search', searchQuery.trim());
    if (selectedCategory !== 'All') params.set('category', selectedCategory);
    navigate(`/products?${params.toString()}`);
  };

  const totalItems = cart?.summary?.totalItems || 0;

  return (
    <header className="navbar-wrapper">
      {/* Top bar */}
      <div className="navbar-top">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-amazon">amazon</span>
          <span className="logo-in">.in</span>
        </Link>

        {/* Deliver to */}
        <div className="navbar-deliver">
          <span className="deliver-icon">📍</span>
          <div>
            <div className="deliver-label">Deliver to</div>
            <div className="deliver-loc">India</div>
          </div>
        </div>

        {/* Search bar */}
        <form className="navbar-search" onSubmit={handleSearch}>
          <div className="search-category-wrap" ref={catRef}>
            <button
              type="button"
              className="search-category-btn"
              onClick={() => setShowCategoryDrop(v => !v)}
            >
              {selectedCategory.length > 12 ? selectedCategory.slice(0, 10) + '…' : selectedCategory}
              <span style={{ marginLeft: 4 }}>▾</span>
            </button>
            {showCategoryDrop && (
              <div className="category-dropdown">
                <div
                  className={`cat-option ${selectedCategory === 'All' ? 'active' : ''}`}
                  onClick={() => { setSelectedCategory('All'); setShowCategoryDrop(false); }}
                >
                  All
                </div>
                {categories.map(c => (
                  <div
                    key={c.id}
                    className={`cat-option ${selectedCategory === c.slug ? 'active' : ''}`}
                    onClick={() => { setSelectedCategory(c.slug); setShowCategoryDrop(false); }}
                  >
                    {c.name}
                  </div>
                ))}
              </div>
            )}
          </div>
          <input
            type="text"
            className="search-input"
            placeholder="Search Amazon.in"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-submit-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
          </button>
        </form>

        {/* Right nav items */}
        <div className="navbar-right">
          <div className="nav-item">
            <span className="nav-item-top">Hello, Rahul</span>
            <span className="nav-item-bottom bold">Account &amp; Lists ▾</span>
          </div>

          <Link to="/orders" className="nav-item">
            <span className="nav-item-top">Returns</span>
            <span className="nav-item-bottom bold">&amp; Orders</span>
          </Link>

          <Link to="/wishlist" className="nav-item">
            <span className="nav-item-top">Your</span>
            <span className="nav-item-bottom bold">Wishlist ♡</span>
          </Link>

          <Link to="/cart" className="nav-cart">
            <div className="cart-icon-wrap">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="32" viewBox="0 0 40 36" fill="white">
                <path d="M15.5 27C14.1 27 13 28.1 13 29.5S14.1 32 15.5 32 18 30.9 18 29.5 16.9 27 15.5 27zM1 1h3.3l4.8 20.3c.3 1.2 1.3 2 2.5 2H31c1.2 0 2.2-.8 2.5-2L36 10H10"/>
              </svg>
              {totalItems > 0 && (
                <span className="cart-count">{totalItems > 99 ? '99+' : totalItems}</span>
              )}
            </div>
            <span className="nav-item-bottom bold">Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom nav strip */}
      <nav className="navbar-bottom">
        <Link to="/products" className="nav-strip-link">☰ All</Link>
        <Link to="/products?category=electronics" className="nav-strip-link">Electronics</Link>
        <Link to="/products?category=clothing" className="nav-strip-link">Fashion</Link>
        <Link to="/products?category=home-kitchen" className="nav-strip-link">Home &amp; Kitchen</Link>
        <Link to="/products?category=books" className="nav-strip-link">Books</Link>
        <Link to="/products?category=sports-fitness" className="nav-strip-link">Sports</Link>
        <Link to="/products?category=beauty" className="nav-strip-link">Beauty</Link>
        <Link to="/products?category=toys" className="nav-strip-link">Toys</Link>
        <Link to="/products" className="nav-strip-link highlight">Today's Deals</Link>
        <Link to="/orders" className="nav-strip-link">Customer Service</Link>
      </nav>
    </header>
  );
}

export default Navbar;
