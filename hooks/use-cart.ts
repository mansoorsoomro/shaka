import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface CartItem {
  id: number
  title: string
  price: number
  quantity: number
  image: string
  size?: string
}

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: number) => void
  toggleCart: () => void
  clearCart: () => void
}

export const useCart = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,
      addItem: (newItem) =>
        set((state) => {
          const existingItem = state.items.find((item) => item.id === newItem.id && item.size === newItem.size)
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id && item.size === newItem.size
                  ? { ...item, quantity: item.quantity + newItem.quantity }
                  : item,
              ),
              isOpen: true,
            }
          }
          return { items: [...state.items, newItem], isOpen: true }
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "cart-storage" },
  ),
)
