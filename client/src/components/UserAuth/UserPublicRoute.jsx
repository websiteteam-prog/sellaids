import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

const UserPublicRoute = () => {
  const { isAuthenticated } = useUserStore();

  console.log("UserPublicRoute - isAuthenticated:", isAuthenticated);

  // Allow access if not authenticated, or always allow for public routes like forgot password
  return !isAuthenticated ? <Outlet /> : <Navigate to="/user" replace />;
};

export default UserPublicRoute;