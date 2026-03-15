import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const ProtectedRoute = () => {
  const { user, token } = useAuthStore();
  const location = useLocation();

  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (user && !user.isProfileComplete) {
    return <Navigate to="/complete-profile" replace />;
  }

  return <Outlet />;
};
