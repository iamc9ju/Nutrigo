import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { MenuItem } from "@/app/services/menu-items";

export interface CartItem extends MenuItem {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: MenuItem, quantity?: number) => void;
  removeItem: (menuItemId: number) => void;
  updateQuantity: (menuItemId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find(
          (item) => item.menuItemId === product.menuItemId,
        );

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.menuItemId === product.menuItemId
                ? { ...item, quantity: item.quantity + quantity }
                : item,
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity }] });
        }
      },

      removeItem: (menuItemId) => {
        set({
          items: get().items.filter((item) => item.menuItemId !== menuItemId),
        });
      },

      updateQuantity: (menuItemId, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item.menuItemId === menuItemId ? { ...item, quantity } : item,
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.price) * item.quantity,
          0,
        );
      },

      getTotal: () => {
        // Here we could add shipping or taxes later
        return get().getSubtotal();
      },
    }),
    {
      name: "nutrigo-cart-storage",
    },
  ),
);
