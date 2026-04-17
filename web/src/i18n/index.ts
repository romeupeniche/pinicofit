import { en } from "./locales/en";
import { br } from "./locales/br";
import { es } from "./locales/es";
import type { Language, TranslationKeys } from "../types/i18n";

export const translations: Record<Language, any> = { en, br, es };

export const translate = (
  lang: Language,
  key: TranslationKeys,
  vars: Record<string, string> = {},
): string => {
  if (!key) return "";
  const keys = key.split(".");
  let text: any = translations[lang];
  for (const k of keys) {
    text = text?.[k];
  }

  if (typeof text === "string") {
    Object.keys(vars).forEach((v) => {
      text = text.replace(`{{${v}}}`, vars[v]);
    });
    return text;
  }

  return key;
};
