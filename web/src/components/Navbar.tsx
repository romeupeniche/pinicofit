import { Flame, User, LayoutDashboard, LogOut } from "lucide-react";
import React from "react";
import Button from "./Button";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, token, logout } = useAuthStore();

  const isAuthPage =
    location.pathname === "/sign-up" || location.pathname === "/sign-in";
  const isOnboarding = location.pathname === "/onboarding";
  const isHomePage = location.pathname === "/";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLogoRedirect = () => {
    if (token && user) navigate("/dashboard");
    else if (isOnboarding) return null;
    else navigate("/");
  };

  return (
    <header className="p-4 flex justify-between items-center max-w-7xl mx-auto w-full">
      <span
        className={`flex font-bold ${isHomePage ? "text-2xl" : "text-3xl"} items-center gap-2 ${!isOnboarding && "cursor-pointer"}`}
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
                  to="/dashboard"
                  className="flex items-center gap-2 text-zinc-400 hover:text-brand-accent transition-colors"
                >
                  <LayoutDashboard size={20} />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>

                <Link
                  to="/account"
                  className="flex items-center gap-2 text-zinc-400 hover:text-brand-accent transition-colors"
                >
                  <User size={20} />
                  <span className="hidden sm:inline">Minha Conta</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-zinc-400 hover:text-red-500 transition-colors ml-4 cursor-pointer"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Sair</span>
                </button>
              </div>
            ) : (
              <div className="gap-4 flex">
                <Button onClick={() => navigate("/sign-in")}>Entrar</Button>
                <Button
                  variant="secondary"
                  onClick={() => navigate("/sign-up")}
                >
                  Cadastrar
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
