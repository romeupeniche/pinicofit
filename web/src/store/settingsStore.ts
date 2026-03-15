import { create } from "zustand";
import { persist } from "zustand/middleware";
import { translate } from "../i18n";
import type { Language, TranslationKeys } from "../types/i18n";

interface SettingsState {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKeys, vars?: Record<string, string>) => string;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      lang: "en",

      setLang: (lang: Language) => set({ lang }),

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
