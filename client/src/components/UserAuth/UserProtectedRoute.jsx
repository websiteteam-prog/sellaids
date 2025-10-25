import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

const UserProtectedRoute = () => {
  const { isAuthenticated } = useUserStore();

  console.log("UserProtectedRoute - isAuthenticated:", isAuthenticated);

  // ✅ Render child routes if authenticated, otherwise navigate to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/UserAuth/UserLogin" replace />;
};

export default UserProtectedRoute;