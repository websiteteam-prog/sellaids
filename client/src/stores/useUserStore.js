import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

// Define the Zustand store
export const useUserStore = create(
  persist(
    (set, get) => ({
      // Initial State
      user: null,         // User authentication data
      isAuthenticated: false,  // Boolean to check if the user is logged in
      loading: false,        // Boolean to show a loading state if necessary
      lastActivity: null,    // Timestamp of the last activity
      token: null,           // Store the authentication token (JWT or session token)

      // Method to set user data and token (for login)
      setUserData: (user, token) =>
        set({
          user,
          token,
          isAuthenticated: true,  // Mark as logged in
          lastActivity: Date.now(),  // Set the last activity timestamp
        }),

      // Login method to set user info and authentication state
      login: (userData, token) =>
        set(() => {
          Cookies.set("session_cookie_name", token, { expires: 7 });  // Save token in cookies for 7 days
          return {
            user: userData,
            token,
            isAuthenticated: true,
            lastActivity: Date.now(),
          };
        }),

      // Logout method to clear cookies and reset state
      logout: () =>
        set(() => {
          Cookies.remove("session_cookie_name");  // Remove session cookie
          return {
            user: null,
            token: null,
            isAuthenticated: false,
            lastActivity: null,
          };
        }),

      // Update activity timestamp when user interacts
      updateActivity: () => {
        if (get().isAuthenticated) {
          set({ lastActivity: Date.now() });  // Update last activity time
        }
      },

      // Optional loading state to manage loading spinner or async operations
      setLoading: (isLoading) => set({ loading: isLoading }),
    }),
    {
      name: "user-store",  // LocalStorage key to persist the store
      getStorage: () => localStorage,  // Use localStorage for persistence
    }
  )
);