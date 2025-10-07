import { create } from "zustand"

export const useCartStore = create((set, get) => ({
  cart: [],

  addToCart: (item) => {
    const cart = get().cart
    set({ cart: [...cart, item] })
  },

  removeFromCart: (id) => {
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    }))
  },

  clearCart: () => set({ cart: [] }),
}))