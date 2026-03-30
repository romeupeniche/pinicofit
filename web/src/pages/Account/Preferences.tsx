import React from "react";
import { useSettingsStore, type WeightUnit } from "../../store/settingsStore";
import type { Language, TranslationKeys } from "../../types/i18n";
import { Globe } from "lucide-react";
import PreferenceSelect from "./PreferenceSelect";

const Preferences: React.FC = () => {
  const { lang, setLang, t, setWeightUnit, weightUnit } = useSettingsStore();

  const preferences: {
    title: TranslationKeys;
    subtitle: TranslationKeys;
    options: { label: string; value: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }[] = [
    {
      title: "account.preferences.language.title",
      subtitle: "account.preferences.language.subtitle",
      options: [
        { label: "English (US)", value: "en" },
        { label: "Português (BR)", value: "br" },
        // { label: "Español", value: "es" },
      ],
      value: lang,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
        setLang(e.target.value as Language),
    },
    {
      title: "account.preferences.weight_unit.title",
      subtitle: "account.preferences.weight_unit.subtitle",
      options: [
        { label: "KG", value: "kg" },
        { label: "LBS", value: "lbs" },
      ],
      value: weightUnit,
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
        setWeightUnit(e.target.value as WeightUnit),
    },
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("account.preferences.title")}</h2>
        <Globe className="text-neutral-300" size={30} />
      </div>
      <div className="space-y-4">
        {preferences.map((preference) => (
          <PreferenceSelect key={preference.title} {...preference} />
        ))}
      </div>
    </div>
  );
};

export default Preferences;
