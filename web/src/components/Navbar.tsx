import { Flame, User } from "lucide-react";
import React from "react";
import Button from "./Button";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { useSettingsStore } from "../store/settingsStore";

const Navbar: React.FC<{ darkMode: boolean }> = ({ darkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useSettingsStore();

  const { user, token } = useAuthStore();

  const isAuthPage =
    location.pathname === "/sign-up" || location.pathname === "/sign-in";
  const isOnboarding = location.pathname === "/onboarding";
  const isHomePage = location.pathname === "/";

  const handleLogoRedirect = () => {
    if (token && user) navigate("/dashboard");
    else if (isOnboarding) return null;
    else navigate("/");
  };

  return (
    <header className="p-4 flex justify-between items-center max-w-7xl mx-auto w-full">
      <span
        className={`flex font-bold ${isHomePage ? "text-2xl" : "text-3xl"} items-center gap-2 ${!isOnboarding && "cursor-pointer"} ${darkMode ? "text-white" : "text-black"}`}
        onClick={handleLogoRedirect}
      >
        PinicoFit <Flame size={isHomePage ? 28 : 38} color="#aa3bff" />
      </span>

      <nav className="flex items-center gap-6">
        {!isAuthPage && !isOnboarding && (
          <>
            {token && user ? (
              <div className="flex items-center gap-6">
                <Link
                  to="/account"
                  className="flex items-center gap-2 text-zinc-400 hover:text-brand-accent transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">
                    {t("navbar.account")}
                  </span>
                </Link>
              </div>
            ) : (
              <div className="gap-4 flex">
                <Button onClick={() => navigate("/sign-in")}>
                  {t("navbar.sign_in")}
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/sign-up")}
                >
                  {t("navbar.sign_up")}
                </Button>
              </div>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
