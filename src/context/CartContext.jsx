import React, { createContext, useContext, useState } from 'react';
import { PRODUCT_DB, DAILY_ESSENTIALS } from '../data/mockData';

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

  // --- SMART RECOMMENDATION ENGINE (Robust) ---
  const checkForMissedItems = (currentCart) => {
      let suggestions = [];
      const cartIds = new Set(currentCart.map(i => i.id));
      const cartCategories = new Set(currentCart.map(i => i.category));
      
      // 1. HARD PAIRINGS (Specific logic)
      // Checks pairingTags (e.g. Cereal -> Milk)
      currentCart.forEach(item => {
          if (item.pairingTags) {
              item.pairingTags.forEach(tag => {
                  // Find a product that matches this tag (e.g. tag 'milk' -> Product 'Whole Milk')
                  const match = PRODUCT_DB.find(p => p.baseName.toLowerCase().includes(tag) || p.cat === tag);
                  if (match && !cartIds.has(match.id)) {
                      suggestions.push(match);
                  }
              });
          }
      });

      // 2. CATEGORY COMPLEMENTS (Broad logic)
      // If user bought Snacks but no Drinks, suggest Drinks
      if (cartCategories.has('snacks') && !cartCategories.has('beverages')) {
          suggestions.push(...PRODUCT_DB.filter(p => p.category === 'beverages').slice(0, 2));
      }
      // If user bought Bakery but no Dairy, suggest Butter/Cheese
      if (cartCategories.has('bakery') && !cartCategories.has('dairy')) {
          suggestions.push(...PRODUCT_DB.filter(p => p.baseName.includes('Butter') || p.baseName.includes('Cheese')).slice(0, 2));
      }
      // If user bought Pantry items (Rice/Pasta), suggest Veggies
      if (cartCategories.has('pantry') && !cartCategories.has('produce')) {
          suggestions.push(...PRODUCT_DB.filter(p => p.category === 'produce').slice(0, 2));
      }

      // 3. FILLER (Ensure at least 5 items)
      // If we still don't have 5 suggestions, fill with "Daily Essentials" or Popular items
      if (suggestions.length < 5) {
          const fillers = DAILY_ESSENTIALS.filter(p => !cartIds.has(p.id));
          suggestions = [...suggestions, ...fillers];
      }

      // 4. Deduplicate and Filter
      // Remove items already in cart and duplicates in suggestions
      const uniqueSuggestions = [];
      const seenIds = new Set(cartIds); // Start with items already in cart to exclude them
      
      suggestions.forEach(item => {
          if (!seenIds.has(item.id)) {
              seenIds.add(item.id);
              uniqueSuggestions.push(item);
          }
      });

      // Return top 5
      return uniqueSuggestions.slice(0, 5);
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