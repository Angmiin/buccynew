// context/CartContext.tsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Product = {
  id: string;
  name: string;
  price: number;
  image?: string;
  size?: string;
  color?: string;
};

export type CartItem = Product & { quantity: number };

type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  updateQuantity: (
    id: string,
    size: string | undefined,
    color: string | undefined,
    qty: number
  ) => void;
  clearCart: () => void;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prev) => {
      // Check if item (same id, size, color) already in cart
      const found = prev.find(
        (item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
      );
      if (found) {
        // Increase quantity of existing item
        return prev.map((item) =>
          item.id === product.id &&
          item.size === product.size &&
          item.color === product.color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      // Add new item to cart
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (id: string, size?: string, color?: string) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            (size ? item.size === size : true) &&
            (color ? item.color === color : true)
          )
      )
    );
  };

  const updateQuantity = (
    id: string,
    size: string | undefined,
    color: string | undefined,
    qty: number
  ) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id &&
        (size ? item.size === size : true) &&
        (color ? item.color === color : true)
          ? { ...item, quantity: Math.max(1, qty) }
          : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const total = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
};
