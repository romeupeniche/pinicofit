import React, { useEffect, useState } from "react";
import {
  BedDouble,
  CheckSquare2,
  Dumbbell,
  Flame,
  GlassWater,
  Utensils,
} from "lucide-react";

interface AppLoadingScreenProps {
  title: string;
  subtitle: string;
  darkMode?: boolean;
}

const AppLoadingScreen: React.FC<AppLoadingScreenProps> = ({
  title,
  subtitle,
  darkMode = false
}) => {
  const icons = [Flame, Dumbbell, GlassWater, Utensils, BedDouble, CheckSquare2];
  const [activeIconIndex, setActiveIconIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIconIndex((current) => (current + 1) % icons.length);
    }, 500);

    return () => window.clearInterval(interval);
  }, [icons.length]);

  const ActiveIcon = icons[activeIconIndex];

  return (
    <div
      className={`flex-1 w-full flex items-center justify-center px-4`}
    >
      <div className="w-full max-w-xl rounded-[2.5rem] text-center">
        <div className="mx-auto mb-6 flex h-20 items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center">
            <ActiveIcon
              key={activeIconIndex}
              size={40}
              className="text-brand-accent"
            />
          </div>
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.35em] text-brand-accent mb-2">
          PinicoFit
        </p>
        <h2 className={`text-2xl text-center text-wrap w-full overflow-hidden text-ellipsis font-black tracking-tight ${darkMode ? "text-white" : "text-neutral-900"}`}>
          {title}
        </h2>
        <p className="mt-2 text-sm font-medium text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
};

export default AppLoadingScreen;
