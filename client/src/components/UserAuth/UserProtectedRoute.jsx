import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const UserProtectedRoute = () => {
  const { isAuthenticated } = useUserStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access user panel");
    }
  }, [isAuthenticated]);

  // ✅ Agar login hai to child routes render karo
  return isAuthenticated ? <Outlet /> : <Navigate to="/UserAuth/UserLogin" replace />;
};

export default UserProtectedRoute;