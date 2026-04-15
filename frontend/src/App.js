import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmPage from './pages/OrderConfirmPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import WishlistPage from './pages/WishlistPage';

import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductListPage />} />
              <Route path="/products/:id" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-confirm/:orderId" element={<OrderConfirmPage />} />
              <Route path="/orders" element={<OrderHistoryPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <ToastContainer position="top-right" theme="light" />
      </Router>
    </CartProvider>
  );
}

export default App;
