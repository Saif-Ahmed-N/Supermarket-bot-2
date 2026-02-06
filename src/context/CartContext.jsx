import React, { createContext, useContext, useState } from 'react';
// import { PRODUCT_DB, DAILY_ESSENTIALS } from '../data/mockData'; // MOCK DATA REMOVED

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState(null);
  const [dietMode, setDietMode] = useState('all');

  const showToast = (message, type = 'success', action = null) => {
    setToast({ message, type, action });
    setTimeout(() => setToast(null), 4000);
  };

  // --- SMART RECOMMENDATION ENGINE (Simplified for now) ---
  const checkForMissedItems = (currentCart) => {
    // TODO: Connect this to Real API for "Recommendation Engine"
    // For now, we return empty list to avoid crashing without mock DB
    // We can add api.getEssentials() in future updates
    return [];
  };

  const updateQuantity = (product, qty) => {
    setCart(prev => {
      const variantId = `${product.id}-${product.selectedWeight || 'std'}`;
      if (qty <= 0) return prev.filter(p => `${p.id}-${p.selectedWeight || 'std'}` !== variantId);

      const existingIndex = prev.findIndex(p => `${p.id}-${p.selectedWeight || 'std'}` === variantId);
      let newCart = [...prev];

      if (existingIndex >= 0) {
        newCart[existingIndex] = { ...newCart[existingIndex], quantity: qty };
      } else {
        newCart = [...prev, { ...product, quantity: qty }];
        if (qty > 0) showToast(`Added ${product.name}`, 'success');
      }
      return newCart;
    });
  };

  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((a, b) => a + (b.quantity || 0), 0);
  const cartTotal = cart.reduce((a, b) => a + (b.price * (b.quantity || 1)), 0);

  return (
    <CartContext.Provider value={{
      cart, updateQuantity, clearCart,
      isCartOpen, setIsCartOpen,
      cartCount, cartTotal,
      toast, showToast,
      dietMode, setDietMode,
      checkForMissedItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);