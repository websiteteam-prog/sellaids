import { Navigate, Outlet } from "react-router-dom";
import { useVendorStore } from "../../stores/useVendorStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const VendorProtectedRoute = () => {
  const { isAuthenticated } = useVendorStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access vendor panel");
    }
  }, [isAuthenticated]);

  // ✅ Agar login hai to child routes render karo
  return isAuthenticated ? <Outlet /> : <Navigate to="/vendor/login" replace />;
};

export default VendorProtectedRoute;