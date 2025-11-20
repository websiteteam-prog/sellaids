import { create } from "zustand"
import { persist } from "zustand/middleware"
import Cookies from "js-cookie";
import axios from "axios";
import toast from "react-hot-toast";

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
    // Check session validity from backend
    checkSession: async () => {
        try {
            const res = await axios.get(
                `${process.env.REACT_APP_API_URL}/api/admin/auth/check-session`,
                { withCredentials: true }
            );
            if (!res.data.loggedIn) {
                // session expired
                toast.success("Session expired. Please login again.");
                get().logout();
                localStorage.removeItem("admin-store");
                setTimeout(() => {
                    window.location.replace("/admin-login");
                }, 500);
            }
        } catch (err) {
            console.error("Session check failed:", err);
            get().logout();
            window.location.replace("/admin-login");
        }
    },
}),
    {
        name: "admin-store",
    }
))
