import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { db } from '../lib/firebase';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // cart state: { [productId]: { quantity, price, name } }
  const [cart, setCart] = useState({});
  const [catalog, setCatalog] = useState({});

  useEffect(() => {
    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      if (snapshot.exists()) {
        setCatalog(snapshot.val());
      }
    });
    return () => unsubscribe();
  }, []);

  const increment = (id, price, name) => {
    setCart(prev => {
      const currentQty = prev[id]?.quantity || 0;
      
      // Prevent incrementing beyond available quantity in catalog
      const available = catalog[id]?.quantity ?? 999;
      if (currentQty >= available) return prev;

      return {
        ...prev,
        [id]: { quantity: currentQty + 1, price, name }
      };
    });
  };

  const decrement = (id) => {
    setCart(prev => {
      if (!prev[id]) return prev;
      const newQty = prev[id].quantity - 1;
      
      if (newQty <= 0) {
        const newCart = { ...prev };
        delete newCart[id];
        return newCart;
      }
      
      return {
        ...prev,
        [id]: { ...prev[id], quantity: newQty }
      };
    });
  };

  const getQuantity = (id) => cart[id]?.quantity || 0;

  const totalItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate total price strictly using the cart item price (which we set to 6)
  const totalPrice = Object.entries(cart).reduce((sum, [id, item]) => {
    return sum + (item.quantity * item.price);
  }, 0);

  // Expose catalog so components can render progress bars and live prices
  return (
    <CartContext.Provider value={{ cart, increment, decrement, getQuantity, totalItems, totalPrice, catalog }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
