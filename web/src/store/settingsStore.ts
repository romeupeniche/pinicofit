import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translate } from "../i18n";
import type { Language, TranslationKeys } from "../types/i18n";

export type WeightUnit = "kg" | "lbs";

interface SettingsState {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKeys, vars?: Record<string, string>) => string;
  weightUnit: WeightUnit;
  setWeightUnit: (unit: "kg" | "lbs") => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      lang: "en",
      weightUnit: "kg",
      setLang: (lang: Language) => set({ lang }),
      setWeightUnit: (weightUnit: "kg" | "lbs") => set({ weightUnit }),
      t: (key, vars = {}) => {
        const { lang } = get();
        return translate(lang, key, vars);
      },
    }),
    {
      name: "user-settings",
    },
  ),
);
