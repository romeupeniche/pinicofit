import React, { useEffect, useState } from "react";
// @ts-expect-error
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  workoutSchema,
  type WorkoutFormValues,
} from "../../schemas/WorkoutGoal";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useWorkoutStore,
  type ICycleStep,
} from "../../store/goals/workoutStore";
import { Library, Plus, Save, X, Loader2 } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import { EXERCISE_CATEGORIES } from "../../constants/workout-metrics";
import type { TranslationKeys } from "../../types/i18n";
import { convertFromKg, convertToKg } from "../../utils/weightUnitConverter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";

interface IProps {
  editingId: string | null;
  setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
  cycle: ICycleStep[];
  setCycle: (newCycle: ICycleStep[]) => void;
}

const EditWorkoutModal: React.FC<IProps> = ({
  editingId,
  setEditingId,
  cycle,
  setCycle,
}) => {
  const { addPreset, presets } = useWorkoutStore();
  const { t, weightUnit } = useSettingsStore();
  const queryClient = useQueryClient();
  useBodyScrollLock(true);

  const { register, control, handleSubmit, getValues, reset } =
    useForm<WorkoutFormValues>({
      resolver: zodResolver(workoutSchema),
      defaultValues: {
        name: "",
        exercises: [],
      },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "exercises",
  });

  const presetMutation = useMutation({
    mutationFn: async (newPreset: any) => {
      const { data } = await api.post("/workouts/presets", newPreset);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workoutSettings"] });
    },
  });

  const [showSameNameError, setShowSameNameError] = useState<boolean>(false);
  const activeWorkout = cycle.find((c) => c.id === editingId);
  const watchExercises = useWatch({ control, name: "exercises" });
  const watchName = useWatch({ control, name: "name" });

  const isPresetNameUnique = !presets.some(
    (p) => t(p.name as TranslationKeys) === watchName,
  );
  const canApply = watchExercises && watchExercises.length > 0 && watchName;

  useEffect(() => {
    if (activeWorkout) {
      const convertedExercises = activeWorkout.exercises.map((ex) => ({
        ...ex,
        weight: convertFromKg(Number(ex.weight), weightUnit).toFixed(0),
      }));

      reset({
        name: activeWorkout.name || "",
        exercises: convertedExercises,
      });
    }
  }, [editingId, activeWorkout, reset, weightUnit]);

  useEffect(() => {
    if (!editingId) {
      reset({
        name: "",
        exercises: [],
      });
    }
  }, [editingId, reset]);

  const prepareDataForStorage = (data: WorkoutFormValues) => {
    return {
      ...data,
      exercises: data.exercises.map((ex) => ({
        ...ex,
        weight: convertToKg(Number(ex.weight), weightUnit).toString(),
      })),
    };
  };

  const onSaveWorkout = (data: WorkoutFormValues) => {
    const formattedData = prepareDataForStorage(data);

    const newCycle = cycle.map((step) =>
      step.id === editingId
        ? {
          ...step,
          name: formattedData.name,
          exercises: formattedData.exercises,
          isConfigured: true,
        }
        : step,
    );
    setCycle(newCycle);
    setEditingId(null);
  };

  const handleSaveAsPreset = async () => {
    const data = getValues();
    if (!isPresetNameUnique) {
      setShowSameNameError(true);
      return;
    }

    if (canApply && isPresetNameUnique) {
      const formattedData = prepareDataForStorage(data);

      const newPreset = {
        id: crypto.randomUUID(),
        name: formattedData.name,
        exercises: formattedData.exercises,
      };

      addPreset(newPreset);

      presetMutation.mutate(newPreset);
    }
  };

  if (!activeWorkout) {
    return null;
  }

  const maskRestTime = (value: string) => {
    const digits = value.replace(/\D/g, "");
    const truncated = digits.slice(0, 4);
    if (truncated.length > 2) {
      return `${truncated.slice(0, truncated.length - 2)}:${truncated.slice(-2)}`;
    }
    return truncated;
  };
  const maskOnlyNumbers = (value: string) => value.replace(/\D/g, "");

  return (
    <div className="fixed inset-0 z-100 flex justify-end">
      <div
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
        onClick={() => setEditingId(null)}
      />
      <form
        onSubmit={handleSubmit(onSaveWorkout)}
        className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col rounded-l-[3rem] overflow-hidden"
      >
        <header className="p-8 border-b border-neutral-100 flex justify-between items-center bg-white">
          <div className="flex-1">
            <span
              className={`${showSameNameError ? "text-red-500" : "text-brand-accent"} text-[10px] font-black uppercase tracking-[0.2em]`}
            >
              {showSameNameError
                ? t(
                  "goals.workout.plan_window.edit_workout_modal.same_name_error",
                )
                : t("goals.workout.plan_window.edit_workout_modal.title", {
                  workout: t("goals.workout.workout_label", {
                    letter: activeWorkout.label,
                  }),
                })}
            </span>
            <input
              {...register("name")}
              autoFocus
              className="block text-2xl font-black text-neutral-900 uppercase italic outline-none focus:text-brand-accent w-full bg-transparent mt-1"
              placeholder={t(
                "goals.workout.plan_window.edit_workout_modal.workout_name",
              )}
              onFocus={() => setShowSameNameError(false)}
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleSaveAsPreset}
              disabled={presetMutation.isPending || !canApply}
              className={`p-3 bg-neutral-900 text-brand-accent rounded-2xl transition-all
                ${canApply && isPresetNameUnique && !presetMutation.isPending ? "cursor-pointer hover:scale-105 active:scale-95" : "cursor-not-allowed opacity-20"}
                `}
            >
              {presetMutation.isPending ? (
                <Loader2 size={24} className="animate-spin" />
              ) : (
                <Library size={24} />
              )}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="p-3 bg-neutral-100 rounded-2xl hover:bg-neutral-200 transition-colors cursor-pointer"
            >
              <X size={24} />
            </button>
          </div>
        </header>

        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              {t("goals.workout.plan_window.edit_workout_modal.exercise")}
            </h3>
            <button
              type="button"
              onClick={() =>
                append({
                  id: Math.random().toString(),
                  name: "",
                  sets: "3",
                  rest: "1:30",
                  category: "exercise",
                  group: "",
                  weight: "",
                  technique: "standard",
                })
              }
              className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-brand-accent text-neutral-900 rounded-xl text-[10px] font-black uppercase hover:scale-105 transition-all"
            >
              <Plus size={14} /> {t("goals.workout.plan_window.edit_workout_modal.add_exercises")}
            </button>
          </div>
          <div className="space-y-4">
            {fields.map((field: any, index: number) => (
              <div
                key={field.id}
                className="p-6 bg-neutral-50 rounded-4xl border border-neutral-100 space-y-4 relative group/item"
              >
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <label className="text-[8px] font-black text-neutral-400 uppercase ml-1">
                      {t(
                        "goals.workout.plan_window.edit_workout_modal.exercise",
                      )}
                    </label>
                    <input
                      {...register(`exercises.${index}.name`)}
                      className="w-full bg-white border border-neutral-200 p-3 rounded-xl text-sm font-bold outline-none focus:border-brand-accent"
                      placeholder={t(
                        "goals.workout.plan_window.edit_workout_modal.inputs.name",
                      )}
                    />
                  </div>
                  <div className="w-44 space-y-1">
                    <label
                      htmlFor="group"
                      className="text-[8px] font-black text-neutral-400 uppercase ml-1"
                    >
                      {t(
                        "goals.workout.plan_window.edit_workout_modal.inputs.group",
                      )}
                    </label>
                    <select
                      {...register(`exercises.${index}.group`)}
                      className="w-full bg-white border border-neutral-200 p-3 rounded-xl text-sm font-bold outline-none focus:border-brand-accent appearance-none cursor-pointer"
                      defaultValue=""
                      id="group"
                    >
                      <option value="" disabled>
                        {t(
                          "goals.workout.plan_window.edit_workout_modal.inputs.group_ph",
                        )}
                      </option>

                      {Object.entries(EXERCISE_CATEGORIES).map(
                        ([key, value]) => (
                          <option
                            key={key}
                            value={key}
                            className="font-medium"
                          >
                            {t(value.label)}
                          </option>
                        ),
                      )}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-neutral-400 uppercase ml-1">
                      {t(
                        "goals.workout.plan_window.edit_workout_modal.inputs.sets",
                      )}
                    </label>
                    <input
                      {...register(`exercises.${index}.sets`)}
                      inputMode="numeric"
                      placeholder="0"
                      className="w-full bg-white border border-neutral-200 p-3 rounded-xl md:text-sm text-xs md:font-bold font-semibold text-center"
                      onChange={(e) => {
                        e.target.value = maskOnlyNumbers(e.target.value);
                        register(`exercises.${index}.sets`).onChange(e);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-neutral-400 uppercase ml-1">
                      {t(
                        "goals.workout.plan_window.edit_workout_modal.inputs.reps",
                      )}
                    </label>
                    <input
                      {...register(`exercises.${index}.reps`)}
                      inputMode="numeric"
                      placeholder="0"
                      className="w-full bg-white border border-neutral-200 p-3 rounded-xl md:text-sm text-xs md:font-bold font-semibold text-center"
                      onChange={(e) => {
                        e.target.value = maskOnlyNumbers(e.target.value);
                        register(`exercises.${index}.reps`).onChange(e);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-neutral-400 uppercase ml-1">
                      {t(
                        "goals.workout.plan_window.edit_workout_modal.inputs.weight",
                      )}{" "}
                      ({weightUnit})
                    </label>
                    <input
                      {...register(`exercises.${index}.weight`)}
                      inputMode="decimal"
                      placeholder="0.0"
                      className="w-full bg-white border border-neutral-200 p-3 rounded-xl md:text-sm text-xs md:font-bold font-semibold text-center"
                      onChange={(e) => {
                        e.target.value = maskOnlyNumbers(e.target.value);
                        register(`exercises.${index}.weight`).onChange(e);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-neutral-400 uppercase ml-1">
                      {t(
                        "goals.workout.plan_window.edit_workout_modal.inputs.rest",
                      )}{" "}
                    </label>
                    <input
                      {...register(`exercises.${index}.rest`)}
                      placeholder="0:00"
                      title={t("goals.workout.plan_window.edit_workout_modal.inputs.rest_format")}
                      inputMode="numeric"
                      className="w-full bg-white border border-neutral-200 p-3 rounded-xl md:text-sm text-xs md:font-bold font-semibold text-center"
                      onChange={(e) => {
                        const masked = maskRestTime(e.target.value);
                        e.target.value = masked;
                        register(`exercises.${index}.rest`).onChange(e);
                      }}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-neutral-400 uppercase ml-1">
                      {t(
                        "goals.workout.plan_window.edit_workout_modal.inputs.type.title",
                      )}
                    </label>
                    <select
                      {...register(`exercises.${index}.category`)}
                      className="w-full bg-white border border-neutral-200 p-3 rounded-xl text-[9px] font-black uppercase outline-none appearance-none cursor-pointer"
                    >
                      <option value="exercise">
                        {t(
                          "goals.workout.plan_window.edit_workout_modal.inputs.type.exercise",
                        )}
                      </option>
                      <option value="warmup">
                        {t(
                          "goals.workout.plan_window.edit_workout_modal.inputs.type.warmup",
                        )}
                      </option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-neutral-400 uppercase ml-1">
                      {t(
                        "goals.workout.plan_window.edit_workout_modal.inputs.technique.title",
                      )}
                    </label>
                    <select
                      {...register(`exercises.${index}.technique`)}
                      className="w-full bg-white border border-neutral-200 p-3 rounded-xl text-[9px] font-black uppercase outline-none appearance-none cursor-pointer"
                    >
                      <option value="standard">
                        {t(
                          "goals.workout.plan_window.edit_workout_modal.inputs.technique.standard",
                        )}
                      </option>
                      <option value="Bi-set">{t("goals.workout.plan_window.edit_workout_modal.inputs.technique.bi_set")}</option>
                      <option value="Drop-set">{t("goals.workout.plan_window.edit_workout_modal.inputs.technique.drop_set")}</option>
                      <option value="Rest-Pause">{t("goals.workout.plan_window.edit_workout_modal.inputs.technique.rest_pause")}</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[8px] font-black text-neutral-400 uppercase ml-1">
                    {t(
                      "goals.workout.plan_window.edit_workout_modal.inputs.obs",
                    )}
                  </label>
                  <input
                    {...register(`exercises.${index}.obs`)}
                    className="w-full bg-white border border-neutral-200 p-3 rounded-xl text-sm font-semibold"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="cursor-pointer absolute -top-2 -right-2 bg-neutral-200 text-neutral-500 p-1.5 rounded-full opacity-0 group-hover/item:opacity-100 hover:bg-red-500 hover:text-white transition-all"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <footer className="p-8 bg-neutral-900">
          <button
            type="submit"
            disabled={!canApply}
            className={`w-full py-5 rounded-4xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all active:scale-95 shadow-xl ${canApply
              ? "bg-white text-neutral-900 hover:bg-brand-accent cursor-pointer"
              : "bg-neutral-800 text-neutral-500 cursor-not-allowed"
              }`}
          >
            <Save size={18} />{" "}
            {t("goals.workout.plan_window.edit_workout_modal.inputs.apply")}
          </button>
        </footer>
      </form>
    </div>
  );
};

export default EditWorkoutModal;




