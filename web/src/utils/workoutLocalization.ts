import { translations } from "../i18n";
import type { Language } from "../types/i18n";

const presetTitles = Object.keys(translations.en.goals.workout.presets);

export const localizeWorkoutName = (name: string | undefined, lang: Language) => {
  if (!name) return name;

  for (const presetKey of presetTitles) {
    for (const sourceLang of Object.keys(translations) as Language[]) {
      const sourceTitle =
        translations[sourceLang].goals.workout.presets[presetKey].title;
      if (sourceTitle === name) {
        return translations[lang].goals.workout.presets[presetKey].title;
      }
    }
  }

  return name;
};

export const localizeExerciseName = (
  name: string | undefined,
  lang: Language,
) => {
  if (!name) return name;

  for (const presetKey of presetTitles) {
    const entries = Object.entries(
      translations.en.goals.workout.presets[presetKey],
    ).filter(([entryKey]) => entryKey !== "title");

    for (const [entryKey] of entries) {
      for (const sourceLang of Object.keys(translations) as Language[]) {
        const sourceValue =
          translations[sourceLang].goals.workout.presets[presetKey][entryKey];
        const [sourceName] = String(sourceValue).split(";");
        if (sourceName === name) {
          const targetValue =
            translations[lang].goals.workout.presets[presetKey][entryKey];
          const [targetName] = String(targetValue).split(";");
          return targetName;
        }
      }
    }
  }

  return name;
};
