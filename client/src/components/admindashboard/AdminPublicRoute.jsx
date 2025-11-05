import { Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../../stores/useAdminStore";
import { useVendorStore } from "../../stores/useVendorStore";

const AdminPublicRoute = () => {
  const { isAuthenticated: isAdminAuth } = useAdminStore();
  const { isAuthenticated: isVendorAuth } = useVendorStore();

  // ✅ Agar already login hai to /admin bhej do
  if (isVendorAuth) return <Navigate to="/vendor" replace />;
  return isAdminAuth ? <Navigate to="/admin" replace /> : <Outlet />;
};

export default AdminPublicRoute;
