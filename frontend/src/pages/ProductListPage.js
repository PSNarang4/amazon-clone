import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts, fetchCategories } from '../services/api';
import ProductCard from '../components/ProductCard/ProductCard';
import './ProductListPage.css';

const SORT_OPTIONS = [
  { value: '', label: 'Featured' },
  { value: 'rating', label: 'Avg. Customer Review' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest Arrivals' },
];

function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('search') || '';
  const categoryFilter = searchParams.get('category') || '';
  const sortBy = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (searchQuery) params.search = searchQuery;
      if (categoryFilter) params.category = categoryFilter;
      if (sortBy) params.sort = sortBy;

      const res = await fetchProducts(params);
      setProducts(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, sortBy, page]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    fetchCategories().then(res => setCategories(res.data.data));
  }, []);

  const handleCategoryClick = (slug) => {
    const p = new URLSearchParams(searchParams);
    if (slug) p.set('category', slug);
    else p.delete('category');
    p.delete('page');
    setSearchParams(p);
  };

  const handleSortChange = (e) => {
    const p = new URLSearchParams(searchParams);
    if (e.target.value) p.set('sort', e.target.value);
    else p.delete('sort');
    p.delete('page');
    setSearchParams(p);
  };

  const handlePageChange = (newPage) => {
    const p = new URLSearchParams(searchParams);
    p.set('page', newPage);
    setSearchParams(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resultText = searchQuery
    ? `Results for "${searchQuery}"`
    : categoryFilter
    ? categories.find(c => c.slug === categoryFilter)?.name || 'Products'
    : 'All Products';

  return (
    <div className="plp-wrapper">
      {/* Sidebar */}
      <aside className="plp-sidebar">
        <div className="sidebar-section">
          <h4>Department</h4>
          <ul>
            <li
              className={!categoryFilter ? 'active' : ''}
              onClick={() => handleCategoryClick('')}
            >
              All Departments
            </li>
            {categories.map(c => (
              <li
                key={c.id}
                className={categoryFilter === c.slug ? 'active' : ''}
                onClick={() => handleCategoryClick(c.slug)}
              >
                {c.name}
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h4>Customer Review</h4>
          <ul>
            {[4, 3, 2, 1].map(stars => (
              <li key={stars}>
                {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                <span> &amp; Up</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="sidebar-section">
          <h4>Availability</h4>
          <ul>
            <li>Include Out of Stock</li>
          </ul>
        </div>
      </aside>

      {/* Main content */}
      <div className="plp-main">
        {/* Header bar */}
        <div className="plp-header">
          <div>
            <h1 className="plp-title">{resultText}</h1>
            {pagination.total !== undefined && (
              <span className="plp-count">
                {Math.min((page - 1) * 20 + 1, pagination.total)}–
                {Math.min(page * 20, pagination.total)} of {pagination.total.toLocaleString()} results
              </span>
            )}
          </div>
          <div className="plp-sort">
            <label>Sort by: </label>
            <select value={sortBy} onChange={handleSortChange}>
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="plp-grid">
            {[...Array(12)].map((_, i) => (
              <div key={i} className="skeleton-card skeleton" style={{ height: 320 }} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="plp-empty">
            <h2>No results found</h2>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
          </div>
        ) : (
          <div className="plp-grid">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="plp-pagination">
            {[...Array(pagination.pages)].map((_, i) => (
              <button
                key={i + 1}
                className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductListPage;
