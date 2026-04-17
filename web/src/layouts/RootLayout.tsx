import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import ScrollToTop from "../utils/ScrollToTop";

export function RootLayout() {
  const location = useLocation();

  const isGoalsPage = location.pathname === "/goals";

  return (
    <div
      className={`min-h-screen p-4 flex flex-col transition-all duration-700 ease-in-out ${isGoalsPage
        ? "bg-[#09090b]"
        : "bg-linear-to-br from-[#f8f9ff] via-[#e8f4ff] to-[#fff0f5]"
        }`}
    >
      <div
        className={`fixed inset-0 z-0 transition-opacity duration-1000 ${isGoalsPage ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        style={{
          background: `
            radial-gradient(circle at 50% -20%, rgba(255, 70, 50, 0.15) 0%, rgba(255, 70, 50, 0) 50%),
            radial-gradient(circle at 100% 100%, rgba(255, 120, 50, 0.08) 0%, rgba(255, 120, 50, 0) 40%),
            radial-gradient(circle at 0% 100%, rgba(255, 70, 50, 0.05) 0%, rgba(255, 70, 50, 0) 30%)
          `
        }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        <Navbar darkMode={isGoalsPage} />
        <main className="p-4 lg:p-8 flex flex-col flex-1 min-h-0">
          <Outlet />
          <ScrollToTop />
        </main>
      </div>
    </div>
  );
}