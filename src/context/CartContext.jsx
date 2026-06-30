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
      
      // Allow backorders up to a maximum limit per order
      const maxQty = 50;
      if (currentQty >= maxQty) return prev;

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
  
  // Calculate total price using live catalog prices, falling back to the snapshotted price
  const totalPrice = Object.entries(cart).reduce((sum, [id, item]) => {
    const currentPrice = catalog[id]?.price ?? item.price;
    return sum + (item.quantity * currentPrice);
  }, 0);

  const clearCart = () => {
    setCart({});
  };

  // Expose catalog so components can render progress bars and live prices
  return (
    <CartContext.Provider value={{ cart, increment, decrement, getQuantity, totalItems, totalPrice, catalog, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
