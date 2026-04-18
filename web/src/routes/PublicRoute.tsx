import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import AppLoadingScreen from "../components/AppLoadingScreen";
import { useSettingsStore } from "../store/settingsStore";

export const PublicRoute = () => {
  const { user, token, _hasHydrated } = useAuthStore();
  const { t } = useSettingsStore();

  const storageRaw = localStorage.getItem("auth-storage");
  const hasTokenInStorage = storageRaw
    ? JSON.parse(storageRaw).state.token
    : null;

  if (!_hasHydrated || (!token && hasTokenInStorage)) {
    return (
      <AppLoadingScreen
        title={t("app_loading.syncing_title")}
        subtitle=""
      />
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
