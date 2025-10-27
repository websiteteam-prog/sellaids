import { create } from 'zustand';
import axios from 'axios';

const useCartStore = create((set) => ({
  cart: [],
  setCart: (cart) => set({ cart }),
  clearCart: () => set({ cart: [] }),
  fetchCart: async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/cart`, {
        withCredentials: true,
      });
      set({ cart: res.data.data || [] });
    } catch (err) {
      console.error('Failed to fetch cart:', err);
    }
  },
  removeFromCart: async (productId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/user/cart/${productId}`, {
        withCredentials: true,
      });
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/cart`, {
        withCredentials: true,
      });
      set({ cart: res.data.data || [] });
    } catch (err) {
      console.error('Failed to remove item from cart:', err);
    }
  },
}));

export default useCartStore;