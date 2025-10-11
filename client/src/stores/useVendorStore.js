// src/stores/useVendorStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useVendorStore = create(
  persist(
    (set) => ({
      vendor: null,
      isAuthenticated: false,
      loading: false,

      login: (vendorData) =>
        set(() => ({
          vendor: vendorData,
          isAuthenticated: true,
        })),

      logout: () =>
        set(() => ({
          vendor: null,
          isAuthenticated: false,
        })),
    }),
    {
      name: "vendor-storage", // localStorage me key
    }
  )
);
