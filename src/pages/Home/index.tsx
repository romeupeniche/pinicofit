import { useNavigate } from "react-router-dom";
import StartButton from "./StartButton";
import HeroSvg from "./HeroSvg";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="flex-1 flex items-center gap-8 min-h-0 overflow-hidden m-8">
      <div className="max-w-2xl">
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tighter leading-tighter text-slate-900">
          Evolua sua <br />
          <span className="bg-linear-to-r from-brand-accent to-brand-pink bg-clip-text text-transparent">
            melhor
          </span>{" "}
          versão.
        </h1>
        <p className="mt-4 md:text-lg text-md text-slate-600">
          O PinicoFit organiza sua dieta e treinos para você focar no que
          importa: o shape dos sonhos. Sem complicações, direto ao ponto.
        </p>
        <StartButton text="Começar" onClick={() => navigate("/sign-in")} />
      </div>

      <section className="flex-1 relative flex items-center justify-center h-full min-h-0 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <HeroSvg className="max-h-full max-w-full w-auto h-auto object-contain" />
        </div>
      </section>
    </main>
  );
}
