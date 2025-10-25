import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "../../stores/useUserStore";

const UserPublicRoute = () => {
  const { isAuthenticated, isUserLoading } = useUserStore();

  console.log("UserPublicRoute - isAuthenticated:", isAuthenticated, "isUserLoading:", isUserLoading);

  // If user is loading, show a loading state
  if (isUserLoading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <p className="text-center mt-10">Loading user...</p>
      </div>
    );
  }

  // Always allow access to public routes (e.g., login, forgot password)
  return <Outlet />;
};

export default UserPublicRoute;