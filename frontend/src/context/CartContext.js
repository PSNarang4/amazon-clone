import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchCart, addToCart as apiAddToCart, updateCartItem, removeCartItem } from '../services/api';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], summary: { totalItems: 0, subtotal: 0, shipping: 0, total: 0 } });
  const [loading, setLoading] = useState(false);

  const loadCart = useCallback(async () => {
    try {
      const res = await fetchCart();
      setCart(res.data.data);
    } catch (err) {
      console.error('Failed to load cart:', err);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const addToCart = async (productId, qty = 1) => {
    setLoading(true);
    try {
      await apiAddToCart(productId, qty);
      await loadCart();
      toast.success('Added to cart!', { autoClose: 1500 });
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add to cart';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const updateQty = async (cartItemId, quantity) => {
    try {
      await updateCartItem(cartItemId, quantity);
      await loadCart();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await removeCartItem(cartItemId);
      await loadCart();
      toast.info('Item removed from cart');
    } catch (err) {
      toast.error('Remove failed');
    }
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQty, removeItem, refreshCart: loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
