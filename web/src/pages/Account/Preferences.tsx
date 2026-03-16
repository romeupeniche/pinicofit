import React from "react";
import { useSettingsStore } from "../../store/settingsStore";
import type { Language } from "../../types/i18n";

const Preferences: React.FC = () => {
  const { lang, setLang, t } = useSettingsStore();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <h2 className="text-xl font-bold mb-6">
        {t("account.preferences.title")}
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-neutral-200 hover:border-brand-accent/50 transition-colors border">
          <div>
            <p className="font-bold">
              {t("account.preferences.language.title")}
            </p>
            <p className="text-sm text-neutral-500">
              {t("account.preferences.language.subtitle")}
            </p>
          </div>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as Language)}
            className="bg-white border border-neutral-200 rounded-lg px-3 py-1 outline-none cursor-pointer hover:border-brand-accent transition-colors"
          >
            <option className="cursor-pointer" value="br">
              Português (BR)
            </option>
            <option className="cursor-pointer" value="en">
              English (US)
            </option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
