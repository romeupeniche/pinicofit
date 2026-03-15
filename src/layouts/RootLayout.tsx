import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
export function RootLayout() {
  return (
    <div className="h-screen p-4 flex flex-col bg-linear-to-br from-[#f8f9ff] via-[#e8f4ff] to-[#fff0f5]">
      <Navbar />
      <main className="p-4 md:p-8 flex flex-col flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  );
}
