import StartButton from "./StartButton";

export default function Home() {
  return (
    <main className="flex-1 flex items-center gap-8 min-h-0 overflow-hidden">
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
        <StartButton text="Começar" />
      </div>

      <div className="flex-1 hidden xl:flex items-center justify-center h-full min-h-0 overflow-hidden">
        <img
          src="hero.png"
          alt="Hero"
          className="max-h-full w-auto object-contain"
        />
      </div>
    </main>
  );
}
