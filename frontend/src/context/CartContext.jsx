import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocale } from "../i18n";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem("cartItems");
      return localData ? JSON.parse(localData) : [];
    } catch {
      return [];
    }
  });

  const { locale } = useLocale();

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (cartItems.length === 0) return;

    const controller = new AbortController();

    async function relocalize() {
      try {
        const res = await fetch(
          `https://koshary-eltahrir-project-1.onrender.com/api/menu?lang=${locale}`,
          {
            signal: controller.signal,
          }
        );
        const data = await res.json();
        const byId = new Map(data.map((i) => [i.id, i]));
        setCartItems((prev) =>
          prev.map((ci) =>
            byId.has(ci.id) ? { ...ci, name: byId.get(ci.id).name } : ci
          )
        );
      } catch (err) {
        if (err?.name !== "AbortError") console.error(err);
      }
    }

    relocalize();
    return () => controller.abort();
  }, [locale, cartItems.length]);

  const addToCart = (itemToAdd) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === itemToAdd.id);
      if (existing) {
        return prevItems.map((i) =>
          i.id === itemToAdd.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
  };

  const removeFromCart = (itemIdToRemove) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((i) => i.id === itemIdToRemove);
      if (!existing) return prevItems;
      if (existing.quantity === 1) {
        return prevItems.filter((i) => i.id !== itemIdToRemove);
      }
      return prevItems.map((i) =>
        i.id === itemIdToRemove ? { ...i, quantity: i.quantity - 1 } : i
      );
    });
  };

  const clearCart = () => setCartItems([]);

  const totalPrice = cartItems.reduce((t, i) => t + i.price * i.quantity, 0);

  const value = { cartItems, addToCart, removeFromCart, clearCart, totalPrice };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
