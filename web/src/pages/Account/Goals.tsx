import { Activity } from "lucide-react";
import React from "react";
import { useSettingsStore } from "../../store/settingsStore";

const Goals: React.FC = () => {
  const { t } = useSettingsStore();
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 text-center py-20">
      <Activity className="mx-auto text-neutral-300 mb-4" size={48} />
      <h2 className="text-xl font-bold">{t("account.goals.title")}</h2>
      <p className="text-neutral-500">{t("account.goals.subtitle")}</p>
      <button className="mt-6 px-6 py-2 bg-neutral-900 hover:bg-brand-accent text-white rounded-full font-bold transition-colors cursor-pointer">
        {t("account.goals.adjust_button")}
      </button>
    </div>
  );
};

export default Goals;
