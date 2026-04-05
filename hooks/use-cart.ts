import { create } from "zustand"
import { persist } from "zustand/middleware"
import { cartService } from "@/lib/services/cart-service"
import { API_CONFIG } from "@/lib/api-config"

const CART_TOKEN_STORAGE_KEY = "cart_token"

type CartStoredItem = {
  id?: number
  variation_id: number
  product_id?: number
  title: string
  price: number
  quantity: number
  image: string
  size?: string
  sku?: string
  subtotal?: number
  stock?: number
  product_slug?: string
}

interface CartStore {
  items: CartStoredItem[]
  cartToken: string | null
  isOpen: boolean
  initCart: () => Promise<void>
  addItem: (item: CartStoredItem) => Promise<void>
  removeItem: (variationId: number) => Promise<void>
  toggleCart: () => void
  clearCart: () => Promise<void>
}

function createCartToken() {
  if (typeof window === "undefined") return null
  const token = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `cart-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  window.localStorage.setItem(CART_TOKEN_STORAGE_KEY, token)
  return token
}

function getCartToken() {
  if (typeof window === "undefined") return null
  const existing = window.localStorage.getItem(CART_TOKEN_STORAGE_KEY)
  return existing || createCartToken()
}

function mapApiCartItem(item: any): CartStoredItem {
  const image = item.image?.startsWith("http")
    ? item.image
    : `${API_CONFIG.BASE_URL}/${item.image}`

  return {
    variation_id: item.variation_id,
    product_id: item.product_id,
    title: item.product_name,
    price: item.price,
    quantity: item.quantity,
    image,
    size: item.size,
    sku: item.sku,
    subtotal: item.subtotal,
    stock: item.stock,
    product_slug: item.product_slug,
  }
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      cartToken: null,
      isOpen: false,
      initCart: async () => {
        const cartToken = getCartToken()
        if (!cartToken) return

        try {
          const response = await cartService.getCartItems(cartToken)
          if (response.success && response.data?.cart) {
            set({
              items: response.data.cart.map(mapApiCartItem),
              cartToken,
            })
          }
        } catch (error) {
          console.error("Failed to initialize cart:", error)
        }
      },
      addItem: async (newItem) => {
        const cartToken = getCartToken()
        if (!cartToken) return

        try {
          const response = await cartService.addOrUpdateCartItem({
            cart_token: cartToken,
            variation_id: newItem.variation_id,
            quantity: newItem.quantity,
          })

          if (response.success && response.data?.cart) {
            set({
              items: response.data.cart.map(mapApiCartItem),
              cartToken,
            })
          }
        } catch (error) {
          console.error("Failed to add/update cart item:", error)
        }
      },
      removeItem: async (variationId) => {
        const cartToken = getCartToken()
        if (!cartToken) return

        try {
          const response = await cartService.removeCartItem(cartToken, variationId)
          if (response.success) {
            set((state) => ({
              items: state.items.filter((item) => item.variation_id !== variationId),
            }))
          }
        } catch (error) {
          console.error("Failed to remove cart item:", error)
        }
      },
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      clearCart: async () => {
        const cartToken = getCartToken()
        if (!cartToken) return

        try {
          const response = await cartService.clearCart(cartToken)
          if (response.success) {
            set({ items: [] })
          }
        } catch (error) {
          console.error("Failed to clear cart:", error)
        }
      },
    }),
    { name: "cart-storage" },
  ),
)
