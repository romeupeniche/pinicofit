import React from "react";
import type { TranslationKeys } from "../../types/i18n";
import {
  useWorkoutStore,
  type ICycleStep,
  type IWorkoutPreset,
} from "../../store/goals/workoutStore";
import { useSettingsStore } from "../../store/settingsStore";
import { Library, Plus, Trash2, X, Zap } from "lucide-react";

interface IProps {
  cycle: ICycleStep[];
  setCycle: (newCycle: ICycleStep[]) => void;
  showPresets: boolean;
  setShowPresets: (show: boolean) => void;
}

const PresetsModal: React.FC<IProps> = ({
  cycle,
  setCycle,
  showPresets,
  setShowPresets,
}) => {
  const { presets, removePreset } = useWorkoutStore();
  const { t } = useSettingsStore();

  const addWorkoutFromPreset = (data: IWorkoutPreset) => {
    const id = crypto.randomUUID();
    const nextLetter = String.fromCharCode(
      65 + cycle.filter((s) => s.type === "workout").length,
    );

    const presetTranslationKey = data.presetTranslationKey;
    const translatedExercises = data.exercises.map((e) => {
      const translationArr = t(
        (presetTranslationKey + "." + e.id) as TranslationKeys,
      ).split(";");

      const [name, obs] = translationArr;

      return {
        ...e,
        name,
        obs,
      };
    });
    const translatedName = t(data.name as TranslationKeys);

    setCycle([
      ...cycle,
      {
        id,
        label: nextLetter,
        type: "workout",
        name: translatedName,
        exercises: translatedExercises,
        isConfigured: true,
      },
    ]);
  };

  if (!showPresets) return null;
  return (
    <div className="fixed inset-0 z-110 flex justify-end">
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
        onClick={() => setShowPresets(false)}
      />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col rounded-l-[3rem] overflow-hidden">
        <header className="p-8 border-b border-neutral-100 flex justify-between items-center bg-white">
          <div>
            <span className="text-brand-accent text-[10px] font-black uppercase tracking-[0.2em]">
              {t("goals.workout.plan_window.presets_modal.title")}
            </span>
            <h2 className="text-2xl font-black text-neutral-900 italic uppercase">
              {t("goals.workout.plan_window.presets_modal.subtitle")}
            </h2>
          </div>
          <button
            onClick={() => setShowPresets(false)}
            className="p-3 bg-neutral-100 rounded-2xl hover:bg-neutral-200 cursor-pointer"
          >
            <X size={24} />
          </button>
        </header>
        <div className="flex-1 p-8 overflow-y-auto space-y-4">
          {presets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-30">
              <Library size={48} />
              <p className="text-[10px] font-black uppercase tracking-widest">
                {t("goals.workout.plan_window.presets_modal.no_workouts")}
              </p>
            </div>
          ) : (
            presets.map((p, idx) => (
              <div
                key={idx}
                className={`group relative overflow-hidden flex items-center justify-between gap-4 p-4 border-2 border-brand-accent ${p.presetTranslationKey ? "border-2 bg-neutral-900" : "bg-neutral-50"} rounded-3xl hover:scale-102 transition-all`}
              >
                {!!p.presetTranslationKey && (
                  <div className="absolute right-0 -top-4 opacity-25 z-1 text-brand-accent">
                    <Zap size={110} />
                  </div>
                )}
                <span>
                  <h4
                    className={`font-black ${p.presetTranslationKey ? "text-brand-accent" : "text-neutral-900"} uppercase text-sm italic`}
                  >
                    {t(p.name as TranslationKeys)}
                  </h4>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase">
                    {t("goals.workout.plan_window.presets_modal.exercises", {
                      qty: p.exercises.length.toString(),
                    })}
                  </p>
                </span>
                <nav className="flex items-center gap-2 z-2">
                  <button
                    onClick={() => {
                      addWorkoutFromPreset(p);
                      setShowPresets(false);
                    }}
                    className="p-2 text-neutral-300 hover:text-brand-accent transition-colors cursor-pointer"
                  >
                    <Plus size={20} />
                  </button>
                  {!p.presetTranslationKey && (
                    <button
                      onClick={() => removePreset(idx)}
                      className="p-2 text-neutral-300 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </nav>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default PresetsModal;
