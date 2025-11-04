// src/components/UserAuth/UserProtectedRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { useEffect, useState } from "react";

const UserProtectedRoute = () => {
  const { isAuthenticated } = useUserStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const hydrate = useUserStore.getState().hydrate;
    hydrate();
    setHydrated(true);
  }, []);

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600"></div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/UserAuth/UserLogin" replace />;
};

export default UserProtectedRoute;