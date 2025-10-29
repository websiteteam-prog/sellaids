import { create } from "zustand"
import { persist } from "zustand/middleware"
import Cookies from "js-cookie";

export const useAdminStore = create(persist((set, get) => ({
    admin: null,
    isAuthenticated: false,
    loading: false,
    lastActivity: null,

    login: (adminData) =>
        set(() => {
            return {
                admin: adminData,
                isAuthenticated: true,
                lastActivity: Date.now(),
            };
        }),
    logout: () => {
        // remove cookie
        Cookies.remove("session_cookie_name");

        // reset state
        return {
            admin: null,
            isAuthenticated: false,
            lastActivity: null,
        };
    },
    updateActivity: () => {
        if (get().isAuthenticated) {
            set({ lastActivity: Date.now() })
        }
    },
}),
    {
        name: "admin-store",
    }
))
