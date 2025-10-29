import { Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../../stores/useAdminStore";

const AdminPublicRoute = () => {
  const { isAuthenticated } = useAdminStore();

  // ✅ Agar already login hai to /admin bhej do
  return isAuthenticated ? <Navigate to="/admin" replace /> : <Outlet />;
};

export default AdminPublicRoute;