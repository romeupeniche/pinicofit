import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar"; // Extraia a nav do código anterior

export function RootLayout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-[#f8f9ff] via-[#e8f4ff] to-[#fff0f5] p-4">
      <Navbar />
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  );
}
