"use client";
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Lazy initialization: This ensures we get data from localStorage before the first render
  const [cart, setCart] = useState(() => {
    if (typeof window !== "undefined") {
      const localCart = localStorage.getItem("foodCart");
      return localCart ? JSON.parse(localCart) : [];
    }
    return [];
  });

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i._id === item._id);
      if (existingItem) {
        return prevCart.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== itemId));
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Save to localStorage whenever the cart updates
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("foodCart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, total }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
