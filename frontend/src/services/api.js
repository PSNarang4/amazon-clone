import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
});

// ---- Products ----
export const fetchProducts = (params = {}) => API.get('/products', { params });
export const fetchProductById = (id) => API.get(`/products/${id}`);

// ---- Categories ----
export const fetchCategories = () => API.get('/categories');

// ---- Cart ----
export const fetchCart = () => API.get('/cart');
export const addToCart = (product_id, quantity = 1) => API.post('/cart', { product_id, quantity });
export const updateCartItem = (cartItemId, quantity) => API.patch(`/cart/${cartItemId}`, { quantity });
export const removeCartItem = (cartItemId) => API.delete(`/cart/${cartItemId}`);
export const clearCart = () => API.delete('/cart');

// ---- Orders ----
export const fetchOrders = () => API.get('/orders');
export const fetchOrderById = (orderId) => API.get(`/orders/${orderId}`);
export const placeOrder = (shippingData) => API.post('/orders', shippingData);

// ---- Wishlist ----
export const fetchWishlist = () => API.get('/users/wishlist');
export const toggleWishlist = (product_id) => API.post('/users/wishlist', { product_id });

export default API;
