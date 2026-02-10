import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
// import { PRODUCT_DB, DAILY_ESSENTIALS } from '../data/mockData'; // MOCK DATA REMOVED

const CartContext = createContext();

export const CartProvider = ({ children, userId }) => {
  const [cart, setCart] = useState([]);
  const [isFetched, setIsFetched] = useState(false);
  const isInitialMount = useRef(true);
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

  // --- PERSISTENCE LOGIC ---

  // 1. Fetch Cart on Mount
  useEffect(() => {
    if (userId) {
      const fetchCart = async () => {
        try {
          const response = await fetch(`http://localhost:8000/cart/${userId}`);
          if (response.ok) {
            const data = await response.json();
            // Transform backend keys to frontend if necessary (they are same here)
            const loadedCart = data.map(item => ({
              id: item.product_id,
              name: item.product_name,
              quantity: item.quantity,
              price: item.price,
              weight: item.weight,
              image_url: item.image_url
            }));
            setCart(loadedCart);
          }
        } catch (err) {
          console.error("Failed to fetch cart:", err);
        } finally {
          setIsFetched(true);
        }
      };
      fetchCart();
    }
  }, [userId]);

  // 2. Sync Cart on Change
  useEffect(() => {
    if (isFetched && userId) {
      // Debounce sync slightly to avoid too many requests
      const timeout = setTimeout(async () => {
        try {
          await fetch('http://localhost:8000/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: userId,
              items: cart.map(item => ({
                product_id: item.id,
                product_name: item.name,
                quantity: item.quantity,
                price: item.price,
                weight: item.weight,
                image_url: item.image_url
              }))
            })
          });
        } catch (err) {
          console.error("Failed to sync cart:", err);
        }
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [cart, userId, isFetched]);

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