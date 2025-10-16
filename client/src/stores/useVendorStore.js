import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useVendorStore = create(
  persist(
    (set) => ({
      vendor: null,
      token: null,
      isLoggedIn: false,

      setVendorData: (vendor, token) =>
        set({
          vendor,
          token,
          isLoggedIn: true,
        }),

      logout: () =>
        set({
          vendor: null,
          token: null,
          isLoggedIn: false,
        }),
    }),
    {
      name: "vendor-store", // localStorage key name
    }
  )
);
