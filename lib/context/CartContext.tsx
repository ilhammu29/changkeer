'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, OrderType, Voucher } from '@/types';

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'cart_item_id' | 'subtotal'>) => void;
  updateQuantity: (cart_item_id: string, delta: number) => void;
  removeFromCart: (cart_item_id: string) => void;
  clearCart: () => void;
  orderType: OrderType;
  setOrderType: (type: OrderType) => void;
  tableNumber: string;
  setTableNumber: (table: string) => void;
  pickupTime: string;
  setPickupTime: (time: string) => void;
  deliveryAddress: string;
  setDeliveryAddress: (address: string) => void;
  deliveryNotes: string;
  setDeliveryNotes: (notes: string) => void;
  appliedVoucher: Voucher | null;
  discountAmount: number;
  applyVoucher: (voucher: Voucher, discountAmount: number) => void;
  removeVoucher: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  totalItemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'changkeer_cafe_cart';

function generateItemKey(item: Omit<CartItem, 'cart_item_id' | 'subtotal'>): string {
  const addonIds = (item.selected_addons || [])
    .map(a => a.id)
    .sort()
    .join('_');
  return `${item.product_id}-${item.serving_size}-${item.temperature}-${item.sweetness_level}-${item.ice_level || 'norm'}-${addonIds}`;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [orderType, setOrderType] = useState<OrderType>('dine_in');
  const [tableNumber, setTableNumber] = useState<string>('Meja 01');
  const [pickupTime, setPickupTime] = useState<string>('15 Menit Lagi');
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryNotes, setDeliveryNotes] = useState<string>('');
  const [appliedVoucher, setAppliedVoucher] = useState<Voucher | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed.items)) setItems(parsed.items);
        if (parsed.orderType) setOrderType(parsed.orderType);
        if (parsed.tableNumber) setTableNumber(parsed.tableNumber);
        if (parsed.pickupTime) setPickupTime(parsed.pickupTime);
        if (parsed.deliveryAddress) setDeliveryAddress(parsed.deliveryAddress);
        if (parsed.deliveryNotes) setDeliveryNotes(parsed.deliveryNotes);
        if (parsed.appliedVoucher) setAppliedVoucher(parsed.appliedVoucher);
        if (typeof parsed.discountAmount === 'number') setDiscountAmount(parsed.discountAmount);
      }
    } catch (e) {
      console.warn('Failed to parse cart from localStorage:', e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const cartData = {
        items,
        orderType,
        tableNumber,
        pickupTime,
        deliveryAddress,
        deliveryNotes,
        appliedVoucher,
        discountAmount,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cartData));
    } catch (e) {
      console.warn('Failed to save cart to localStorage:', e);
    }
  }, [items, orderType, tableNumber, pickupTime, deliveryAddress, deliveryNotes, appliedVoucher, discountAmount, isInitialized]);

  // Recalculate voucher discount if items change
  useEffect(() => {
    if (!appliedVoucher) return;
    const currentSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    if (currentSubtotal < appliedVoucher.min_spend) {
      setAppliedVoucher(null);
      setDiscountAmount(0);
    } else {
      let disc = 0;
      if (appliedVoucher.discount_type === 'percentage') {
        disc = Math.round((currentSubtotal * appliedVoucher.discount_value) / 100);
        if (appliedVoucher.max_discount && appliedVoucher.max_discount > 0) {
          disc = Math.min(disc, appliedVoucher.max_discount);
        }
      } else {
        disc = Math.min(currentSubtotal, appliedVoucher.discount_value);
      }
      setDiscountAmount(disc);
    }
  }, [items, appliedVoucher]);

  const addToCart = (itemInput: Omit<CartItem, 'cart_item_id' | 'subtotal'>) => {
    const key = generateItemKey(itemInput);
    const itemSubtotal = itemInput.unit_price * itemInput.quantity;

    setItems(prevItems => {
      const existingIdx = prevItems.findIndex(i => i.cart_item_id === key);
      if (existingIdx > -1) {
        const updated = [...prevItems];
        const existing = updated[existingIdx];
        const newQty = existing.quantity + itemInput.quantity;
        updated[existingIdx] = {
          ...existing,
          quantity: newQty,
          subtotal: existing.unit_price * newQty,
          item_notes: itemInput.item_notes || existing.item_notes,
        };
        return updated;
      } else {
        return [
          ...prevItems,
          {
            ...itemInput,
            cart_item_id: key,
            subtotal: itemSubtotal,
          },
        ];
      }
    });

    setIsCartOpen(true);
  };

  const updateQuantity = (cart_item_id: string, delta: number) => {
    setItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.cart_item_id === cart_item_id) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: newQty,
              subtotal: item.unit_price * newQty,
            };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeFromCart = (cart_item_id: string) => {
    setItems(prevItems => prevItems.filter(i => i.cart_item_id !== cart_item_id));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedVoucher(null);
    setDiscountAmount(0);
  };

  const applyVoucher = (voucher: Voucher, discount: number) => {
    setAppliedVoucher(voucher);
    setDiscountAmount(discount);
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setDiscountAmount(0);
  };

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const deliveryFee = orderType === 'delivery' ? 12000 : 0;
  const totalAmount = Math.max(0, subtotal - discountAmount + deliveryFee);
  const totalItemCount = items.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        orderType,
        setOrderType,
        tableNumber,
        setTableNumber,
        pickupTime,
        setPickupTime,
        deliveryAddress,
        setDeliveryAddress,
        deliveryNotes,
        setDeliveryNotes,
        appliedVoucher,
        discountAmount,
        applyVoucher,
        removeVoucher,
        isCartOpen,
        setIsCartOpen,
        subtotal,
        deliveryFee,
        totalAmount,
        totalItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
