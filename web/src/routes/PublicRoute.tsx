import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export const PublicRoute = () => {
  const { user, token, _hasHydrated } = useAuthStore();

  const storageRaw = localStorage.getItem("auth-storage");
  const hasTokenInStorage = storageRaw
    ? JSON.parse(storageRaw).state.token
    : null;

  if (!_hasHydrated || (!token && hasTokenInStorage)) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (token && user) {
    return (
      <Navigate
        to={user.isProfileComplete ? "/dashboard" : "/onboarding"}
        replace
      />
    );
  }

  return <Outlet />;
};
