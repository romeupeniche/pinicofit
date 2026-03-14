import { Flame, Play, ArrowRight } from "lucide-react";
import React from "react";
import Button from "./Button";

const Navbar: React.FC = () => {
  return (
    <header className="p-2 flex justify-between items-center max-w-7xl mx-auto">
      <span className="flex font-bold text-2xl items-center gap-2">
        PinicoFit <Flame size={28} color="#aa3bff" />
      </span>
      <nav></nav>
      <span className="flex gap-8">
        <Button>Entrar</Button>
        <Button variant="secondary">Cadastrar</Button>
      </span>
    </header>
  );
};

export default Navbar;
