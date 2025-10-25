import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

const UserPublicRoute = () => {
  const { isAuthenticated } = useUserStore();

  // ✅ Agar already login hai to /user bhej do
  return isAuthenticated ? <Navigate to="/user" replace /> : <Outlet />;
};

export default UserPublicRoute;