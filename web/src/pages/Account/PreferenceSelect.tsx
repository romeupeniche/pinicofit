import React from "react";
import type { TranslationKeys } from "../../types/i18n";
import { useSettingsStore } from "../../store/settingsStore";

interface PreferenceSelectProps {
  title: TranslationKeys;
  subtitle: TranslationKeys;
  options: { label: string; value: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const PreferenceSelect: React.FC<PreferenceSelectProps> = ({
  value,
  title,
  subtitle,
  onChange,
  options,
}) => {
  const { t } = useSettingsStore();
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl border-neutral-200 hover:border-brand-accent/50 transition-colors border">
      <div>
        <p className="font-bold">{t(title)}</p>
        <p className="text-sm text-neutral-500">{t(subtitle)}</p>
      </div>
      <select
        value={value}
        onChange={onChange}
        className="bg-white border border-neutral-200 rounded-lg px-3 py-1 outline-none cursor-pointer hover:border-brand-accent transition-colors"
      >
        {options.map((option) => (
          <option
            className="cursor-pointer"
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PreferenceSelect;
