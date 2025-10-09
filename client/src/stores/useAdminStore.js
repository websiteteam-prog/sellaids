import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useAdminStore = create(persist((set) => ({
    user: null,
    isAuthenticated: false,
    loading: false,

    login: (userData) =>
        set(() => ({
            user: userData,
            isAuthenticated: true
        })),
    logout: () =>
        set(() => ({
            user: null,
            isAuthenticated: false
        }))
})))
