import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAdminStore = create(persist((set) => ({
    admin: null,
    isAuthenticated: false,
    loading: false,

    login: (adminData) =>
        set(() => ({
            admin: adminData,
            isAuthenticated: true
        })),
    logout: () =>
        set(() => ({
            admin: null,
            isAuthenticated: false
        }))
})))
