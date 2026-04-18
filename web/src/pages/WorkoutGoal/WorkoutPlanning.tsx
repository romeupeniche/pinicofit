import React, { useState, useMemo, useCallback } from "react";
import {
  Plus,
  Moon,
  CheckCircle2,
  Coffee,
  LayoutList,
  Library,
  RotateCcw,
  Edit3,
} from "lucide-react";
import {
  format,
  startOfDay,
  eachDayOfInterval,
  endOfMonth,
  startOfMonth,
  isSameDay,
  getDay,
} from "date-fns";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSettingsStore } from "../../store/settingsStore";
import { useWorkoutStore } from "../../store/goals/workoutStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import EditWorkoutModal from "./EditWorkoutModal";
import PresetsModal from "./PresetsModal";
import ConfirmExitModal from "./ConfirmExitModal";
import SortableStep from "./SortableStep";
import type { TranslationKeys } from "../../types/i18n";
import { localizeWorkoutName } from "../../utils/workoutLocalization";
import CustomLoadingSpinner from "../../components/CustomLoadingSpinner";

const getWorkoutLabel = (index: number): string => {
  let label = "";
  let n = index;
  while (n >= 0) {
    label = String.fromCharCode((n % 26) + 65) + label;
    n = Math.floor(n / 26) - 1;
  }
  return label;
};

const WorkoutPlanning: React.FC = () => {
  const {
    cycle,
    setCycle,
    hasChanges,
    saveChanges,
    rollbackChanges,
    isLoading,
    getWorkoutForDate,
  } = useWorkoutStore();

  const { t, lang } = useSettingsStore();
  const isMobile = useIsMobile();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);

  const today = useMemo(() => startOfDay(new Date()), []);
  const monthDays = useMemo(() =>
    eachDayOfInterval({
      start: startOfMonth(today),
      end: endOfMonth(today),
    }), [today]
  );
  const leadingEmptyDays = useMemo(
    () => Array.from({ length: getDay(startOfMonth(today)) }),
    [today],
  );

  const allWorkoutsConfigured = useMemo(() =>
    cycle.every((step) => step.type === "rest" || step.isConfigured),
    [cycle]
  );

  const updateCycleAndLabels = useCallback((newCycle: typeof cycle) => {
    let workoutCount = 0;
    const updated = newCycle.map((step) => {
      if (step.type === "workout") {
        return { ...step, label: getWorkoutLabel(workoutCount++) };
      }
      return step;
    });
    setCycle(updated);
  }, [setCycle]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = cycle.findIndex((item) => item.id === active.id);
      const newIndex = cycle.findIndex((item) => item.id === over.id);
      updateCycleAndLabels(arrayMove(cycle, oldIndex, newIndex));
    }
  };

  const addStep = (type: "workout" | "rest") => {
    const id = crypto.randomUUID();
    const newStep = type === "rest"
      ? {
        id,
        label: "goals.workout.plan_window.rest_label",
        type: "rest" as const,
        name: "",
        exercises: [],
        isConfigured: true,
      }
      : {
        id,
        label: "",
        type: "workout" as const,
        name: "",
        exercises: [],
        isConfigured: false,
      };

    updateCycleAndLabels([...cycle, newStep]);
  };

  const removeStep = (id: string) => {
    updateCycleAndLabels(cycle.filter((s) => s.id !== id));
  };

  const clearCycle = () => {
    updateCycleAndLabels([]);
  }

  return (
    <div className="space-y-12 overflow-x-hidden">
      <section className="space-y-6">
        <div className="max-w-xl mx-auto flex flex-col gap-6 p-8 items-center justify-center text-center">
          <div className="space-y-2">
            {!hasChanges() && !isLoading ? (
              <div className="h-5 flex items-center justify-center gap-2 text-emerald-500">
                <CheckCircle2 size={20} />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                  {t("goals.workout.plan_window.synchronized")}
                </span>
              </div>
            ) : (
              <div className="h-5 text-amber-500 animate-pulse flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                  {isLoading ? t("goals.workout.plan_window.saving") : t("goals.workout.plan_window.pending")}
                </span>
              </div>
            )}
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
              <span className={hasChanges() && allWorkoutsConfigured ? "text-blue-500 font-black" : ""}>
                {t("goals.workout.plan_window.changes_apply.0")}
              </span>
              {" "}{t("goals.workout.plan_window.changes_apply.or")}{" "}
              <span className={hasChanges() && allWorkoutsConfigured ? "text-brand-accent font-black" : ""}>
                {t("goals.workout.plan_window.changes_apply.1")}
              </span>
            </p>
          </div>

          <button
            onClick={() => !isLoading && setShowPresets(true)}
            disabled={isLoading}
            className="enabled:cursor-pointer disabled:cursor-not-allowed flex items-center gap-3 px-6 py-3 transition-all group rounded-2xl border-2 bg-neutral-900 text-brand-accent border-transparent enabled:hover:border-brand-accent enabled:hover:scale-105 enabled:active:scale-95 disabled:opacity-50 disabled:grayscale"
          >
            <Library size={20} className="group-enabled:group-hover:-rotate-12 transition-transform" />
            <span className="text-xs font-black uppercase tracking-widest">
              {t("goals.workout.plan_window.explore_presets")}
            </span>
          </button>
        </div>

        <header className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em]">
              {t("goals.workout.plan_window.cycle_structure.title")}
            </h2>
            <p className="text-[11px] text-neutral-500 font-medium">
              {t("goals.workout.plan_window.cycle_structure.subtitle")}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button disabled={isLoading} onClick={clearCycle} className="enabled:cursor-pointer disabled:cursor-not-allowed text-[10px] font-bold uppercase text-red-500 enabled:hover:bg-red-200 transition-colors bg-red-100 px-3 py-1 rounded-full disabled:grayscale-75">
              {t("goals.workout.plan_window.cycle_structure.clear_btn")}
            </button>
            <span className="text-[10px] font-bold bg-brand-accent/10 text-brand-accent px-3 py-1 rounded-full uppercase">
              {cycle.length} {t("goals.workout.plan_window.cycle_structure.length")}
            </span>
          </div>
        </header>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="flex flex-wrap gap-3 p-6 rounded-[2.5rem] border border-neutral-100 bg-white/50">
            <SortableContext items={cycle.map((s) => s.id)} strategy={horizontalListSortingStrategy}>
              {cycle.map((step) => (
                <SortableStep
                  key={step.id}
                  step={step}
                  isLoading={isLoading}
                  onEdit={setEditingId}
                  onRemove={removeStep}
                />
              ))}
            </SortableContext>

            <div className="flex gap-2">
              <button
                onClick={() => addStep("workout")}
                disabled={isLoading}
                className="enabled:cursor-pointer disabled:cursor-not-allowed h-12.5 flex items-center gap-2 px-4 py-2 transition-all group border-2 border-dashed border-neutral-200 rounded-2xl enabled:hover:border-brand-accent enabled:hover:text-brand-accent text-neutral-400"
              >
                <Plus size={18} className="group-enabled:group-hover:rotate-90 transition-transform" />
                <span className="text-[10px] font-black uppercase">{t("goals.workout.plan_window.cycle_structure.workout_add")}</span>
              </button>

              <button
                onClick={() => addStep("rest")}
                disabled={isLoading}
                className="enabled:cursor-pointer disabled:cursor-not-allowed h-12.5 flex items-center gap-2 px-4 py-2 transition-all border-2 border-dashed border-neutral-200 rounded-2xl enabled:hover:border-neutral-900 enabled:hover:text-neutral-900 text-neutral-400"
              >
                <Moon size={16} />
                <span className="text-[10px] font-black uppercase">OFF</span>
              </button>
            </div>
          </div>
        </DndContext>
      </section>
      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-2 text-center">
          {t("goals.workout.plan_window.monthly_projection.title")}
        </h2>
        <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="grid grid-cols-7 gap-y-8">
            {t("goals.workout.plan_window.week_days").split("").map((d, i) => (
              <div key={i} className="text-center text-[10px] font-black text-neutral-300 uppercase">{d}</div>
            ))}
            {leadingEmptyDays.map((_, index) => (
              <div key={`empty-${index}`} aria-hidden="true" />
            ))}
            {monthDays.map((day, i) => {
              const workoutStep = getWorkoutForDate(day);
              const isToday = isSameDay(day, today);
              const isPastDay = day < today;

              return (
                <div key={i} className={`flex flex-col items-center gap-1.5 relative group ${isLoading ? "opacity-50" : ""}`}>
                  <span className={`text-xs ${isToday ? "text-brand-accent font-black" : "text-neutral-400 font-bold"}`}>
                    {format(day, "d")}
                  </span>

                  <div
                    onClick={() => !isLoading && !isPastDay && workoutStep?.type === "workout" && setEditingId(workoutStep.id)}
                    className={`w-6 h-6 md:w-9 md:h-9 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${isToday ? "ring-2 ring-brand-accent ring-offset-2" : ""
                      } ${workoutStep?.type === "rest"
                        ? "bg-neutral-100 text-neutral-500 border border-dashed border-neutral-300"
                        : workoutStep
                          ? `bg-neutral-900 text-brand-accent shadow-lg ${isPastDay ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:scale-110"}`
                          : "bg-neutral-50 text-neutral-200"
                      }`}
                  >
                    {workoutStep?.type === "rest" ? <Moon size={12} /> : workoutStep?.label || "-"}
                  </div>

                  {workoutStep && !isMobile && !isLoading && (
                    <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 translate-y-2 group-hover:translate-y-0">
                      <div className="bg-neutral-900 text-white p-4 rounded-3xl shadow-2xl border border-white/10 w-48 overflow-hidden relative">
                        <p className="text-[8px] font-black text-brand-accent uppercase tracking-widest">
                          {workoutStep.type === "rest" ? t(workoutStep.label as TranslationKeys) : t("goals.workout.workout_label", { letter: workoutStep.label })}
                        </p>
                        <h4 className="text-sm font-black uppercase truncate mt-1">
                          {localizeWorkoutName(workoutStep.name, lang) || (workoutStep.type === "rest" ? "OFF" : t("goals.workout.plan_window.unnamed_workout"))}
                        </h4>
                        <div className="mt-3 flex items-center gap-2 opacity-60">
                          {workoutStep.type === "rest" ? <Coffee size={10} /> : <LayoutList size={10} />}
                          <span className="text-[9px] font-bold uppercase">
                            {workoutStep.type === "rest" ? t("goals.workout.plan_window.monthly_projection.recovery") : t("goals.workout.plan_window.monthly_projection.exercise_count", { count: String(workoutStep.exercises.length) })}
                          </span>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-neutral-900 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-white/10" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {(hasChanges() || isLoading) && (
        <div className="flex flex-row justify-center gap-3 items-center fixed bottom-10 left-1/2 -translate-x-1/2 z-60 w-full px-4 max-w-2xl">
          <button
            onClick={() => saveChanges(true)}
            disabled={isLoading || !allWorkoutsConfigured}
            className={`flex shrink-0 items-center gap-3 px-8 py-4 rounded-full shadow-2xl border transition-all active:scale-95 group ${allWorkoutsConfigured
              ? "bg-brand-accent text-white border-transparent hover:scale-105 cursor-pointer shadow-brand-accent/20"
              : "bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed"
              }`}
          >
            {isLoading ? <CustomLoadingSpinner className="w-4.5 h-4.5 text-white" /> : <Plus size={18} className="group-hover:rotate-90 transition-transform" />}
            <span className="md:block hidden text-[10px] font-black uppercase tracking-[0.2em]">
              {isLoading ? t("goals.workout.plan_window.saving") : t("goals.workout.plan_window.cycle_structure.actions.new_cycle")}
            </span>
          </button>

          {!isLoading && allWorkoutsConfigured && (
            <button
              onClick={() => saveChanges(false)}
              className="flex shrink-0 items-center gap-3 px-6 py-4 rounded-full shadow-2xl border border-blue-500/10 bg-blue-500/20 backdrop-blur-md text-blue-500 hover:bg-blue-500 hover:text-white transition-all active:scale-95 cursor-pointer"
            >
              <Edit3 size={18} />
              <span className="md:block hidden text-[10px] font-black uppercase tracking-[0.2em]">{t("goals.workout.plan_window.cycle_structure.actions.quick_edit")}</span>
            </button>
          )}

          {!isLoading && (
            <button
              onClick={rollbackChanges}
              className="cursor-pointer shrink-0 flex items-center gap-3 px-6 py-4 rounded-full backdrop-blur-md shadow-xl border border-red-500/20 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 group"
            >
              <RotateCcw size={16} className="group-hover:-rotate-180 duration-300 transition-transform" />
              <span className="md:block hidden text-[10px] font-black uppercase tracking-[0.2em]">{t("goals.workout.plan_window.cycle_structure.actions.discard")}</span>
            </button>
          )}
        </div>
      )}

      {showPresets && <PresetsModal cycle={cycle} setCycle={setCycle} setShowPresets={setShowPresets} />}
      {editingId && <EditWorkoutModal cycle={cycle} editingId={editingId} setCycle={setCycle} setEditingId={setEditingId} />}
      <ConfirmExitModal hasChanges={hasChanges()} rollbackChanges={rollbackChanges} isLoading={isLoading} />
    </div>
  );
};

export default WorkoutPlanning;


