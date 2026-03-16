import { useNavigate } from "react-router-dom";
import StartButton from "./StartButton";
import { useState } from "react";
import { useSettingsStore } from "../../store/settingsStore";

export default function Home() {
  const navigate = useNavigate();
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const { t } = useSettingsStore();

  return (
    <main className="flex-1 flex items-center gap-8 min-h-0 overflow-hidden max-h-[70lvh] xl:m-8">
      <div className="xl:max-w-2xl">
        <h1 className="text-7xl md:text-8xl font-extrabold tracking-tighter leading-tighter text-slate-900">
          {t("home.title_0")}
          <br />
          <span className="bg-linear-to-r md:text-[6.5rem] text-8xl from-brand-accent to-brand-pink bg-clip-text text-transparent">
            {t("home.title_1")}
          </span>
          {t("home.title_2")}
        </h1>
        <p className="mt-4 md:text-lg text-md text-slate-600">
          {t("home.subtitle")}
        </p>
        <StartButton
          text={t("home.start_button")}
          onClick={() => navigate("/sign-in")}
        />
      </div>

      <section className="flex-1 w-full h-full xl:flex hidden items-center justify-center relative">
        <div className="relative w-full h-full flex items-center justify-center">
          <img
            src="/hero_home_tiny.webp"
            alt="Loading..."
            className={`
              absolute inset-0 w-full h-full object-contain
              transition-opacity duration-500
              ${isImageLoaded ? "opacity-0" : "opacity-100"}
            `}
          />
          <img
            src="hero_home.webp"
            alt="Hero"
            fetchPriority="high"
            loading="eager"
            onLoad={() => setIsImageLoaded(true)}
            className={`
          relative z-10 w-full h-full object-contain max-h-[70lvh] transition-opacity duration-500
          ${isImageLoaded ? "opacity-100" : "opacity-0"}
        `}
          />
        </div>
      </section>
    </main>
  );
}
