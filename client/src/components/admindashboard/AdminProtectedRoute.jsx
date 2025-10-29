import { Navigate, Outlet } from "react-router-dom";
import { useAdminStore } from "../../stores/useAdminStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

const AdminProtectedRoute = () => {
  const { isAuthenticated } = useAdminStore();

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error("Please login to access admin panel");
    }
  }, [isAuthenticated]);

  // ✅ Agar login hai to child routes render karo
  return isAuthenticated ? <Outlet /> : <Navigate to="/admin-login" replace />;
};

export default AdminProtectedRoute;

// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAdminStore } from "../../stores/useAdminStore";
// import { useEffect, useRef } from "react";
// import toast from "react-hot-toast";

// const AdminProtectedRoute = () => {
//   const { isAuthenticated } = useAdminStore();
//   const location = useLocation();
//   const hasShownToast = useRef(false);

//   useEffect(() => {
//     if (!isAuthenticated && !hasShownToast.current) {
//       toast.error("Please login to access admin panel");
//       hasShownToast.current = true;
//     }
//   }, [isAuthenticated]);

//   if (!isAuthenticated) {
//     return <Navigate to="/admin-login" replace state={{ from: location }} />;
//   }

//   return <Outlet />;
// };

// export default AdminProtectedRoute;