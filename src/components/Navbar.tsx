import { Flame } from "lucide-react";
import React from "react";
import Button from "./Button";
import { useLocation, useNavigate } from "react-router-dom";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isNotAuthPage =
    location.pathname !== "/sign-up" && location.pathname !== "/sign-in";

  return (
    <header className="p-2 flex justify-between items-center max-w-7xl mx-auto w-full">
      <span
        className={`flex font-bold ${isNotAuthPage ? "text-2xl" : "text-3xl"} items-center gap-2 cursor-pointer`}
        onClick={() => navigate("/")}
      >
        PinicoFit <Flame size={isNotAuthPage ? 28 : 38} color="#aa3bff" />
      </span>
      <nav></nav>
      {isNotAuthPage && (
        <span className="flex gap-8">
          <Button onClick={() => navigate("sign-in")}>Entrar</Button>
          <Button variant="secondary" onClick={() => navigate("sign-up")}>
            Cadastrar
          </Button>
        </span>
      )}
    </header>
  );
};

export default Navbar;
