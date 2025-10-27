// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// export const useVendorStore = create(
//   persist(
//     (set) => ({
//       vendor: null,
//       token: null,
//       isLoggedIn: false,

//       setVendorData: (vendor, token) =>
//         set({
//           vendor,
//           token,
//           isLoggedIn: true,
//         }),

//       logout: () =>
//         set({
//           vendor: null,
//           token: null,
//           isLoggedIn: false,
//         }),
//     }),
//     {
//       name: "vendor-store", // localStorage key name
//     }
//   )
// );


import { create } from "zustand";
import { persist } from "zustand/middleware";
import Cookies from "js-cookie";

// Define the Zustand store
export const useVendorStore = create(
  persist(
    (set, get) => ({
      // Initial State
      vendor: null,         // Vendor data (can be an object with specific vendor fields)
      isAuthenticated: false,  // Boolean to check if the vendor is logged in
      loading: false,        // Boolean to show a loading state if necessary
      lastActivity: null,    // Timestamp of the last activity
      token: null,           // Store the authentication token (JWT or session token)

      // Method to set vendor data and token (for login)
      setVendorData: (vendor, token) => 
        set({
          vendor,
          token,
          isAuthenticated: true,  // Mark as logged in
          lastActivity: Date.now(),  // Set the last activity timestamp
        }),

      // Login method to set vendor info and authentication state
      login: (vendorData, token) => 
        set(() => {
          Cookies.set("session_cookie_name", token, { expires: 7 });  // Save token in cookies for 7 days
          return {
            vendor: vendorData,
            token,
            isAuthenticated: true,
            lastActivity: Date.now(),
          };
        }),

      // Logout method to clear cookies and reset state
      logout: () => {
        // Remove session cookie
        Cookies.remove("session_cookie_name");

        // Reset state to initial values
        return {
          vendor: null,
          token: null,
          isAuthenticated: false,
          lastActivity: null,
        };
      },

      // Update activity timestamp when vendor interacts
      updateActivity: () => {
        if (get().isAuthenticated) {
          set({ lastActivity: Date.now() });  // Update last activity time
        }
      },

      // Optional loading state to manage loading spinner or async operations
      setLoading: (isLoading) => set({ loading: isLoading }),
    }),
    {
      name: "vendor-store",  // LocalStorage key to persist the store
      getStorage: () => Cookies,  // Use cookies to persist the state
    }
  )
);
