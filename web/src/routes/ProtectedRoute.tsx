import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const ProtectedRoute = () => {
  const { user, token, _hasHydrated } = useAuthStore();
  const location = useLocation();

  if (!_hasHydrated)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );

  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  if (user && !user.isProfileComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
};
