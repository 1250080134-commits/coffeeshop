/**
 * context/CartContext.tsx
 *
 * In-memory shopping cart. Products are typed against ApiProduct from
 * the real backend. The cart is NOT persisted to localStorage intentionally
 * so it always reflects current stock.
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { ApiProduct } from '../services/api';

export interface CartItem {
  cartKey:        string;       // `${product.id}_${grindSize||''}_${selectedWeight||''}`
  product:        ApiProduct;
  quantity:       number;
  grindSize?:     string;
  selectedWeight?: string;
  unitPrice:      number;       // price at time of adding (numeric)
}

export interface AddToCartOptions {
  grindSize?:      string;
  selectedWeight?: string;
  unitPrice?:      number;
}

interface CartContextType {
  items:          CartItem[];
  addToCart:      (product: ApiProduct, quantity?: number, options?: AddToCartOptions) => void;
  removeFromCart: (cartKey: string) => void;
  updateQuantity: (cartKey: string, quantity: number) => void;
  clearCart:      () => void;
  totalItems:     number;
  subtotal:       number;
}

const CartContext = createContext<CartContextType | null>(null);

function makeCartKey(productId: number, grindSize?: string, selectedWeight?: string) {
  return `${productId}_${grindSize || ''}_${selectedWeight || ''}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback(
    (product: ApiProduct, quantity = 1, options: AddToCartOptions = {}) => {
      const cartKey  = makeCartKey(product.id, options.grindSize, options.selectedWeight);
      const unitPrice = options.unitPrice ?? parseFloat(product.price);

      setItems(prev => {
        const existing = prev.find(i => i.cartKey === cartKey);
        if (existing) {
          return prev.map(i =>
            i.cartKey === cartKey
              ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) }
              : i,
          );
        }
        return [
          ...prev,
          {
            cartKey,
            product,
            quantity:       Math.min(quantity, product.stock),
            grindSize:      options.grindSize,
            selectedWeight: options.selectedWeight,
            unitPrice,
          },
        ];
      });
    },
    [],
  );

  const removeFromCart = useCallback((cartKey: string) => {
    setItems(prev => prev.filter(i => i.cartKey !== cartKey));
  }, []);

  const updateQuantity = useCallback((cartKey: string, quantity: number) => {
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => i.cartKey !== cartKey));
    } else {
      setItems(prev =>
        prev.map(i =>
          i.cartKey === cartKey
            ? { ...i, quantity: Math.min(quantity, i.product.stock) }
            : i,
        ),
      );
    }
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal   = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
