// src/stores/useUserStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

const TOKEN_KEY = "user_session_token"; // ← Same as login

const cookieStorage = {
  getItem: (name) => {
    try {
      const value = Cookies.get(name);
      return value ? value : null;
    } catch (error) {
      console.error("Error reading cookie:", error);
      return null;
    }
  },
  setItem: (name, value) => {
    try {
      Cookies.set(name, value, { expires: 7, secure: true, sameSite: "strict" });
    } catch (error) {
      console.error("Error setting cookie:", error);
    }
  },
  removeItem: (name) => {
    try {
      Cookies.remove(name);
    } catch (error) {
      console.error("Error removing cookie:", error);
    }
  },
};

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      lastActivity: null,

      login: (userData, token) => {
        Cookies.set(TOKEN_KEY, token, { expires: 7, secure: true, sameSite: "strict" });
        set({
          user: userData,
          token,
          isAuthenticated: true,
          lastActivity: Date.now(),
        });
      },

      hydrate: () => {
        const token = Cookies.get(TOKEN_KEY);
        if (token && !get().token) {
          set({ token, isAuthenticated: true });
        }
      },

      logout: () => {
        Cookies.remove(TOKEN_KEY);
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          lastActivity: null,
        });
      },

      updateActivity: () => {
        if (get().isAuthenticated) {
          set({ lastActivity: Date.now() });
        }
      },
    }),
    {
      name: "user-store",
      getStorage: () => cookieStorage,
    }
  )
);