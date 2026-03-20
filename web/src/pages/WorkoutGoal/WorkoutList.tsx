import React, { useState } from "react";
import {
  Clock,
  ChevronRight,
  X,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import type { TranslationKeys } from "../../types/i18n";

interface Exercise {
  id: string;
  category: string;
  name: string;
  weight: string;
  technique: string;
  sets: string;
  rest: string;
  obs: string;
  group: string;
}

interface CompletionData {
  status: "done" | "failed" | "increased";
  actualWeight?: string;
  repsDone?: string;
}

interface WorkoutListProps {
  exercises: Exercise[];
  isPast?: boolean;
}

const completionStatuses: {
  label: TranslationKeys;
  icon: LucideIcon;
  color: string;
  borderActive: string;
  value: CompletionData["status"];
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

const WorkoutList: React.FC<WorkoutListProps> = ({
  exercises,
  isPast = false,
}) => {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(
    null,
  );
  const [completedData, setCompletedData] = useState<
    Record<string, CompletionData>
  >({});
  const { t } = useSettingsStore();
  const [tempWeight, setTempWeight] = useState("");
  const [tempReps, setTempReps] = useState("");
  const [selectedCompletionStatus, setSelectedCompletionStatus] = useState<
    CompletionData["status"] | null
  >(null);

  const handleComplete = (id: string) => {
    if (!selectedCompletionStatus) return;
    setCompletedData((prev) => ({
      ...prev,
      [id]: {
        status: selectedCompletionStatus,
        actualWeight: tempWeight || selectedExercise?.weight,
        repsDone: tempReps,
      },
    }));
    closeModal();
  };

  const closeModal = () => {
    setSelectedExercise(null);
    setTempWeight("");
    setTempReps("");
    setSelectedCompletionStatus(null);
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

          const completion = completedData[ex.id];

          return (
            <div key={ex.id} className="relative">
              {showConnector && (
                <div className="absolute left-8 -bottom-3.5 w-1 h-10 bg-brand-accent/20 z-0" />
              )}

              <div
                className={`relative z-10 hover:border-brand-accent/50 border p-4 rounded-2xl flex items-center justify-between transition-all active:scale-[0.98] cursor-pointer
                ${
                  completion?.status === "done"
                    ? "bg-green-50/50 border-green-200"
                    : completion?.status === "increased"
                      ? "bg-blue-50/50 border-blue-200 shadow-md shadow-blue-100/50"
                      : completion?.status === "failed"
                        ? "bg-red-50/50 border-red-100 opacity-70"
                        : isPast
                          ? "bg-neutral-50 border-neutral-100 opacity-60"
                          : "bg-white border-neutral-100 shadow-sm"
                }
                ${isBiSet && !completion ? "border-l-4 border-l-brand-accent" : ""}`}
                onClick={() => setSelectedExercise(ex)}
              >
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    {completion?.status === "done" && (
                      <CheckCircle2 size={16} className="text-green-600" />
                    )}
                    {completion?.status === "increased" && (
                      <TrendingUp size={16} className="text-blue-600" />
                    )}
                    {completion?.status === "failed" && (
                      <AlertTriangle size={16} className="text-red-500" />
                    )}
                    {isPast && !completion && (
                      <CheckCircle2 size={16} className="text-neutral-400" />
                    )}

                    <h4
                      className={`font-bold ${completion || isPast ? "text-neutral-900" : "text-neutral-800"}`}
                    >
                      {ex.name}
                    </h4>
                  </div>

                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight">
                    {completion?.actualWeight || ex.weight} •
                    <span
                      className={isBiSet ? "text-brand-accent ml-1" : "ml-1"}
                    >
                      {ex.technique === "standard"
                        ? t(
                            `goals.workout.workout_window.details_modal.${ex.technique}` as TranslationKeys,
                          )
                        : ex.technique}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {completion ? (
                    <span className="text-[9px] font-black text-brand-accent bg-brand-accent/10 px-2 py-1 rounded-lg uppercase">
                      Edit
                    </span>
                  ) : (
                    <span className="text-sm font-black text-neutral-800 bg-neutral-100 px-2 py-1 rounded-lg uppercase">
                      {ex.sets} Sets
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
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-neutral-900/80">
          <div className="bg-white w-full max-w-lg rounded-t-[2.5rem] md:rounded-[3rem] p-8 shadow-2xl relative">
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 p-2 bg-neutral-100 rounded-full text-neutral-400 hover:bg-neutral-200 transition-colors hover:text-red-500 cursor-pointer"
            >
              <X size={20} />
            </button>

            <header className="mb-6">
              <span className="text-brand-accent font-black uppercase text-[10px] tracking-[0.2em]">
                {selectedExercise.group} • {selectedExercise.category}
              </span>
              <h2 className="text-3xl font-black text-neutral-900 leading-tight mt-1">
                {selectedExercise.name}
              </h2>
            </header>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {completionStatuses.map(
                ({ color, icon: Icon, label, value, borderActive }) => (
                  <button
                    key={value}
                    onClick={() =>
                      setSelectedCompletionStatus(
                        selectedCompletionStatus === value ? null : value,
                      )
                    }
                    className={`cursor-pointer flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${color} ${
                      selectedCompletionStatus === value ? borderActive : ""
                    }`}
                  >
                    <Icon size={24} />
                    <span className="text-[9px] font-black uppercase mt-2">
                      {t(label)}
                    </span>
                  </button>
                ),
              )}
            </div>

            {selectedCompletionStatus === "increased" && (
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">
                    {t(
                      "goals.workout.workout_window.details_modal.weight_done",
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder={selectedExercise.weight}
                    value={tempWeight}
                    onChange={(e) => setTempWeight(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-neutral-100 p-4 rounded-2xl font-bold text-neutral-800 focus:border-brand-accent outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-neutral-400 ml-1">
                    {t("goals.workout.workout_window.details_modal.reps")}
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 12/10/8"
                    value={tempReps}
                    onChange={(e) => setTempReps(e.target.value)}
                    className="w-full bg-neutral-50 border-2 border-neutral-100 p-4 rounded-2xl font-bold text-neutral-800 focus:border-brand-accent outline-none transition-colors"
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 pt-6 border-t border-neutral-100">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-neutral-900 text-white p-2 px-4 rounded-xl font-mono font-bold text-lg">
                    {selectedExercise.sets}x
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                      {t("goals.workout.workout_window.details_modal.rest")}
                    </span>
                    <span className="font-bold text-neutral-700 flex items-center gap-1">
                      <Clock size={14} className="text-brand-accent" />{" "}
                      {selectedExercise.rest}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    {t("goals.workout.workout_window.details_modal.technique")}
                  </span>
                  <p className="font-bold text-neutral-700 italic">
                    {selectedExercise.technique === "standard"
                      ? t(
                          `goals.workout.workout_window.details_modal.${selectedExercise.technique}` as TranslationKeys,
                        )
                      : selectedExercise.technique}
                  </p>
                </div>
              </div>

              {selectedExercise.obs && selectedExercise.obs !== "-" && (
                <div className="bg-brand-accent/3 border-l-4 border-brand-accent p-4 rounded-r-2xl">
                  <p className="text-xs text-neutral-600 leading-relaxed italic font-medium">
                    {selectedExercise.obs}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => handleComplete(selectedExercise.id)}
              disabled={!selectedCompletionStatus}
              className="not-disabled:cursor-pointer w-full mt-8 py-5 bg-neutral-900 text-white disabled:bg-neutral-400 rounded-2xl font-black italic text-xl tracking-[0.2em] not-disabled:hover:bg-brand-accent transition-all not-disabled:active:scale-[0.98]"
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
