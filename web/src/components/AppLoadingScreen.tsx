import React from "react";

interface AppLoadingScreenProps {
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
}

const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({
  title = "Carregando",
  subtitle = "Sincronizando suas informacoes...",
  fullScreen = false,
}) => {
  return (
    <div
      className={`${fullScreen ? "min-h-screen" : "min-h-[40vh]"} w-full flex items-center justify-center`}
    >
      <div className="w-full max-w-md rounded-[2.5rem] border border-neutral-200/60 bg-white/70 backdrop-blur-md p-8 text-center shadow-xl">
        <div className="mx-auto mb-6 flex h-18 w-18 items-center justify-center rounded-3xl bg-brand-accent/10">
          <div className="h-10 w-10 rounded-full border-4 border-brand-accent/20 border-t-brand-accent animate-spin" />
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-brand-accent mb-2">
          PinicoFit
        </p>
        <h2 className="text-2xl font-black tracking-tight text-neutral-900">
          {title}
        </h2>
        <p className="mt-2 text-sm font-medium text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
