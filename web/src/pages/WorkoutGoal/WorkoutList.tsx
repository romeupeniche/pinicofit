import React, { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  Clock,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  type LucideIcon,
  CalendarClock,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import type { TranslationKeys } from "../../types/i18n";
import { EXERCISE_CATEGORIES } from "../../constants/workout-metrics";
import type { IExercise } from "../../schemas/WorkoutGoal";
import {
  useWorkoutStore,
  type ExerciseStatus,
  type ICycleStep,
} from "../../store/goals/workoutStore";
import { format, isAfter, isBefore, startOfDay } from "date-fns";
import { convertFromKg, convertToKg } from "../../utils/weightUnitConverter";
import processPendingSummaries, {
  type Summary,
} from "../../utils/processPendingSummaries";
import { useAuthStore } from "../../store/authStore";
import { api } from "../../services/api";
import { localizeExerciseName } from "../../utils/workoutLocalization";
import { useQueryClient } from "@tanstack/react-query";

interface WorkoutListProps {
  step: ICycleStep;
  date: Date;
  onFinish: (summary: Summary | null) => void;
}

const completionStatuses: {
  label: TranslationKeys;
  icon: LucideIcon;
  color: string;
  borderActive: string;
  value: ExerciseStatus;
}[] = [
  {
    label: "goals.workout.workout_window.details_modal.failed",
    icon: AlertTriangle,
    color: "border-red-100 text-red-500 hover:bg-red-50",
    borderActive: "border-red-500",
    value: "failed",
  },
  {
    label: "goals.workout.workout_window.details_modal.done",
    icon: CheckCircle2,
    color: "border-green-100 text-green-500 hover:bg-green-50",
    borderActive: "border-green-500",
    value: "done",
  },
  {
    label: "goals.workout.workout_window.details_modal.increased",
    icon: TrendingUp,
    color: "border-blue-100 text-blue-500 hover:bg-blue-50",
    borderActive: "border-blue-500",
    value: "increased",
  },
] as const;

const WorkoutList: React.FC<WorkoutListProps> = ({ step, date, onFinish }) => {
  const { user } = useAuthStore();
  const { t, weightUnit, lang } = useSettingsStore();
  const queryClient = useQueryClient();
  const saveExerciseLog = useWorkoutStore((state) => state.saveExerciseLog);
  const logs = useWorkoutStore((state) => state.logs);

  const [selectedExercise, setSelectedExercise] = useState<IExercise | null>(null);
  const [tempWeight, setTempWeight] = useState("");
  const [selectedCompletionStatus, setSelectedCompletionStatus] = useState<ExerciseStatus | null>(null);

  const exercises = step.exercises;
  const targetDateIso = format(date, "yyyy-MM-dd");
  const today = startOfDay(new Date());
  const targetDay = startOfDay(date);
  const isPast = isBefore(targetDay, today);
  const isFuture = isAfter(targetDay, today);
  const lastCompletedSyncKey = useRef<string | null>(null);
  const answeredLogs = useMemo(
    () =>
      logs.filter(
        (log) =>
          log.date === targetDateIso &&
          exercises.some((exercise) => exercise.id === log.exerciseId),
      ),
    [exercises, logs, targetDateIso],
  );

  const getLogForExercise = useCallback((exerciseId: string) => {
    return logs.find((l) => l.date === targetDateIso && l.exerciseId === exerciseId);
  }, [logs, targetDateIso]);
  useEffect(() => {
    if (answeredLogs.length === exercises.length && user) {
      const summary = processPendingSummaries({
        dateToProcess: targetDateIso,
        logs: logs,
        activeWorkout: step,
        userSettings: user,
      });

      const syncKey = JSON.stringify(
        answeredLogs.map((log) => ({
          exerciseId: log.exerciseId,
          status: log.status,
          actualWeight: log.actualWeight,
        })),
      );

      if (!isFuture && lastCompletedSyncKey.current !== syncKey) {
        lastCompletedSyncKey.current = syncKey;
        api.post("/workouts/log", {
          name: step.name || step.label,
          exercises: answeredLogs,
          duration: summary?.duration || 0,
          date: targetDateIso,
        }).catch(() => undefined);
      }

      onFinish(summary);
    } else {
      onFinish(null);
    }
  }, [answeredLogs, isFuture, logs, onFinish, step, targetDateIso, user]);

  const closeModal = () => {
    setSelectedExercise(null);
    setTempWeight("");
    setSelectedCompletionStatus(null);
  };

  const handleOpenModal = (ex: IExercise) => {
    if (isFuture) return;
    setSelectedExercise(ex);
    const existingLog = getLogForExercise(ex.id);

    if (existingLog) {
      setSelectedCompletionStatus(existingLog.status);
      setTempWeight(
        convertFromKg(Number(existingLog.actualWeight), weightUnit).toFixed(0) || ""
      );
    } else {
      setSelectedCompletionStatus(null);
      setTempWeight("");
    }
  };

  const handleComplete = (id: string) => {
    if (!selectedCompletionStatus || !selectedExercise) return;

    let weightToSave: string;

    if (selectedCompletionStatus === "increased" && tempWeight) {
      weightToSave = convertToKg(Number(tempWeight), weightUnit).toString();
    } else {
      weightToSave = selectedExercise.weight
    }

    saveExerciseLog({
      date: targetDateIso,
      exerciseId: id,
      status: selectedCompletionStatus,
      actualWeight: weightToSave,
    });

    const updatedLogs = [
      ...logs.filter(
        (log) => !(log.date === targetDateIso && log.exerciseId === id),
      ),
      {
        date: targetDateIso,
        exerciseId: id,
        status: selectedCompletionStatus,
        actualWeight: weightToSave,
      },
    ];

    api.patch("/workouts/settings", { logs: updatedLogs })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["workout-log", targetDateIso] });
      })
      .catch(() => undefined);

    closeModal();
  };

  const techniqueColors = {
    standard: "",
    "bi-set": "text-brand-accent",
    "drop-set": "text-blue-500",
    "rest-pause": "text-orange-500",
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {exercises.map((ex, index) => {
          const isBiSet = ex.technique.toLowerCase().includes("bi-set");
          const nextIsBiSet = exercises[index + 1]?.technique
            .toLowerCase()
            .includes("bi-set");
          const showConnector = isBiSet && nextIsBiSet;

          const completion = getLogForExercise(ex.id);
          const displayWeight = convertFromKg(Number(ex.weight), weightUnit);
          const completionWeight = (
            completion?.actualWeight
              ? convertFromKg(Number(completion.actualWeight), weightUnit)
              : displayWeight
          ).toFixed(0);

          return (
            <div key={ex.id} className="relative">
              {showConnector && (
                <div className="absolute left-8 -bottom-3.5 w-1 h-10 bg-brand-accent/20 z-0" />
              )}
              <div
                className={`relative z-10 border p-4 rounded-2xl flex items-center justify-between
                  ${!isPast && !isFuture && "hover:border-brand-accent/50 active:scale-[0.98] cursor-pointer transition-all"}
                  ${completion?.status === "done"
                    ? "bg-green-50/50 border-green-200"
                    : completion?.status === "increased"
                      ? "bg-blue-50/50 border-blue-200 shadow-md shadow-blue-100/50"
                      : completion?.status === "failed"
                        ? "bg-red-50/50 border-red-100 opacity-70"
                        : isPast || isFuture
                          ? "bg-neutral-50 border-neutral-100 opacity-60"
                          : "bg-white border-neutral-100 shadow-sm"
                  }
                  ${isBiSet && !completion ? "border-l-4 border-l-brand-accent" : ""}`}
                onClick={() => handleOpenModal(ex)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {completion?.status === "done" && <CheckCircle2 size={16} className="text-green-600" />}
                    {completion?.status === "increased" && <TrendingUp size={16} className="text-blue-600" />}
                    {completion?.status === "failed" && <AlertTriangle size={16} className="text-red-500" />}
                    {isPast && !completion && <CheckCircle2 size={16} className="text-neutral-400" />}
                    {isFuture && <CalendarClock size={16} className="text-neutral-400" />}

                    <h4 className={`font-bold ${completion || isPast ? "text-neutral-900" : "text-neutral-800"}`}>
                      {localizeExerciseName(ex.name, lang)}
                    </h4>
                  </div>
                  <p className={`text-[10px] font-bold ${completion?.actualWeight && Number(completion.actualWeight) !== Number(ex.weight) ? "text-brand-accent" : "text-neutral-400"} tracking-tight`}>
                    {completionWeight} {weightUnit} •
                    <span className={`${techniqueColors[ex.technique.toLowerCase() as keyof typeof techniqueColors] || ""} ml-1 uppercase text-neutral-400`}>
                      {ex.technique === "standard" ? t(`goals.workout.workout_window.details_modal.standard`) : ex.technique}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {completion && !isFuture ? (
                    <span className="text-[9px] font-black text-brand-accent bg-brand-accent/10 px-2 py-1 rounded-lg uppercase">
                      Edit
                    </span>
                  ) : (
                    <span className="text-sm font-black text-neutral-800 bg-neutral-100 px-2 py-1 rounded-lg">
                      {ex.sets} x {ex.reps}
                    </span>
                  )}
                  <ChevronRight className="text-neutral-300" size={18} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedExercise && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-neutral-900/80"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[3rem] p-8 shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full text-neutral-400 hover:bg-neutral-200 transition-colors hover:text-red-500 cursor-pointer"
            >
              <X size={20} />
            </button>

            <header className="mb-6">
              <span className="text-brand-accent font-black uppercase text-[10px] tracking-[0.2em]">
                {t(EXERCISE_CATEGORIES[selectedExercise.group].label)} • {selectedExercise.category}
              </span>
              <h2 className="text-3xl font-black text-neutral-900 leading-tight mt-1">
                {selectedExercise.name}
              </h2>
            </header>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {completionStatuses.map(({ color, icon: Icon, label, value, borderActive }) => (
                <button
                  key={value}
                  onClick={() => setSelectedCompletionStatus(selectedCompletionStatus === value ? null : value)}
                  className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${color} ${selectedCompletionStatus === value ? borderActive : "border-transparent"}`}
                >
                  <Icon size={24} />
                  <span className="text-[9px] font-black uppercase mt-2">{t(label)}</span>
                </button>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-neutral-100">
              <div className="flex justify-between items-start bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
                {selectedCompletionStatus === "increased" ? (
                  <div className="flex flex-col">
                    <label className="text-[9px] font-black uppercase text-neutral-400 ml-1">
                      {t("goals.workout.workout_window.details_modal.weight_done")}
                    </label>
                    <div className="flex items-center">
                      <input
                        autoFocus
                        placeholder={convertFromKg(Number(selectedExercise.weight), weightUnit).toFixed(0)}
                        value={tempWeight}
                        className="w-24 bg-white border-2 border-neutral-200 px-3 py-1 rounded-xl font-bold text-neutral-800 focus:border-brand-accent outline-none transition-colors"
                        inputMode="decimal"
                        onChange={(e) => setTempWeight(e.target.value.replace(/[^0-9.,]/g, ""))}
                      />
                      <span className="ml-2 text-neutral-500 font-bold text-sm">{weightUnit}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-4">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">Volume</span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-neutral-900">{selectedExercise.sets}</span>
                        <span className="text-xs font-bold text-neutral-400 uppercase">x</span>
                        <span className="text-2xl font-black text-neutral-900">{selectedExercise.reps}</span>
                      </div>
                    </div>
                    <div className="w-px h-8 bg-neutral-200 self-end mb-1" />
                    <div className="flex flex-col">
                      <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">
                        {t("goals.workout.workout_window.details_modal.rest")}
                      </span>
                      <span className="font-bold text-neutral-700 flex items-center gap-1 text-sm">
                        <Clock size={14} className="text-brand-accent" />
                        {selectedExercise.rest}
                      </span>
                    </div>
                  </div>
                )}

                <div className="text-right flex flex-col items-end">
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">
                    {t("goals.workout.workout_window.details_modal.technique")}
                  </span>
                  <span className="text-md font-bold">
                    {selectedExercise.technique === "standard"
                      ? t(`goals.workout.workout_window.details_modal.standard`)
                      : selectedExercise.technique}
                  </span>
                </div>
              </div>

              {selectedExercise.obs && selectedExercise.obs !== "-" && (
                <div className="bg-brand-accent/5 border-l-4 border-brand-accent p-4 rounded-r-2xl">
                  <p className="text-xs text-neutral-600 leading-relaxed italic font-medium">
                    {selectedExercise.obs}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => handleComplete(selectedExercise.id)}
              disabled={
                selectedCompletionStatus === "increased"
                  ? !tempWeight || convertFromKg(Number(selectedExercise.weight), weightUnit).toFixed(0) === tempWeight
                  : !selectedCompletionStatus
              }
              className="not-disabled:cursor-pointer w-full mt-8 py-5 bg-neutral-900 text-white disabled:bg-neutral-300 rounded-2xl font-black italic text-xl tracking-[0.2em] not-disabled:hover:bg-brand-accent transition-all not-disabled:active:scale-[0.95]"
            >
              {t("goals.workout.workout_window.details_modal.save_button")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutList;



