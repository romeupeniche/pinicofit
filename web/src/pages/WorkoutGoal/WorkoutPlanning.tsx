import React, { useState } from "react";
import {
  Plus,
  Moon,
  CheckCircle2,
  Loader2,
  AlertCircle,
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
import EditWorkoutModal from "./EditWorkoutModal";
import PresetsModal from "./PresetsModal";
import { useIsMobile } from "../../hooks/useIsMobile";
import type { TranslationKeys } from "../../types/i18n";
import ConfirmExitModal from "./ConfirmExitModal";
import SortableStep from "./SortableStep";

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
  const { t } = useSettingsStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showPresets, setShowPresets] = useState(false);
  const isMobile = useIsMobile();

  const allWorkoutsConfigured = cycle.every(
    (step) => step.type === "rest" || step.isConfigured,
  );

  const today = startOfDay(new Date());
  const monthDays = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = cycle.findIndex((item) => item.id === active.id);
      const newIndex = cycle.findIndex((item) => item.id === over.id);

      const newOrder = arrayMove(cycle, oldIndex, newIndex);

      let workoutCount = 0;
      const updatedCycle = newOrder.map((step) => {
        if (step.type === "workout") {
          return { ...step, label: String.fromCharCode(65 + workoutCount++) };
        }
        return step;
      });

      setCycle(updatedCycle);
    }
  };

  const addStep = (type: "workout" | "rest") => {
    const id = crypto.randomUUID();
    if (type === "rest") {
      setCycle([
        ...cycle,
        {
          id,
          label: "goals.workout.plan_window.rest_label",
          type: "rest",
          name: "",
          exercises: [],
          isConfigured: true,
        },
      ]);
    } else {
      const nextLetter = String.fromCharCode(
        65 + cycle.filter((s) => s.type === "workout").length,
      );
      setCycle([
        ...cycle,
        {
          id,
          label: nextLetter,
          type: "workout",
          name: "",
          exercises: [],
          isConfigured: false,
        },
      ]);
    }
  };

  const removeStep = (id: string) => {
    const newCycle = cycle.filter((s) => s.id !== id);
    let workoutCount = 0;
    const updatedCycle = newCycle.map((step) => {
      if (step.type === "workout") {
        return { ...step, label: String.fromCharCode(65 + workoutCount++) };
      }
      return step;
    });
    setCycle(updatedCycle);
  };

  const getSaveButtonLabel = () => {
    if (isLoading) return t("goals.workout.plan_window.saving");

    if (!allWorkoutsConfigured) {
      return isMobile
        ? t(
            "goals.workout.plan_window.cycle_structure.actions.mobile_configure",
          )
        : t("goals.workout.plan_window.cycle_structure.actions.configure");
    }

    return isMobile
      ? t("goals.workout.plan_window.cycle_structure.actions.new_cycle_mobile")
      : t("goals.workout.plan_window.cycle_structure.actions.new_cycle");
  };

  return (
    <div className="space-y-12 pb-32 overflow-x-hidden">
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
                  {isLoading
                    ? t("goals.workout.plan_window.saving")
                    : t("goals.workout.plan_window.pending")}
                </span>
              </div>
            )}
            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">
              <span
                className={`${hasChanges() && allWorkoutsConfigured ? "relative text-blue-500 animate-pulse text-xs font-black" : ""}`}
              >
                {t("goals.workout.plan_window.changes_apply.0")}
                {hasChanges() && allWorkoutsConfigured && (
                  <Edit3
                    size={35}
                    className="md:block hidden absolute -top-3 opacity-30 mx-auto w-full"
                  />
                )}
              </span>
              {t("goals.workout.plan_window.changes_apply.or")}
              <span
                className={`${hasChanges() && allWorkoutsConfigured ? "relative text-brand-accent animate-pulse text-xs font-black" : ""}`}
              >
                {t("goals.workout.plan_window.changes_apply.1")}
                {hasChanges() && allWorkoutsConfigured && (
                  <Plus
                    size={50}
                    className="md:block hidden absolute -top-5 opacity-30 w-full right-0"
                  />
                )}
              </span>
            </p>
          </div>

          <button
            onClick={() => !isLoading && setShowPresets(true)}
            disabled={isLoading}
            className={`flex items-center gap-3 px-6 py-3 transition-all group rounded-2xl border-2 ${
              isLoading
                ? "bg-neutral-800 text-neutral-500 border-transparent cursor-not-allowed grayscale opacity-70"
                : "bg-neutral-900 text-brand-accent border-transparent hover:border-brand-accent hover:scale-105 active:scale-95 cursor-pointer"
            }`}
          >
            <Library
              size={20}
              className={`${!isLoading && "group-hover:-rotate-12"} transition-transform`}
            />
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
          <span className="text-[10px] font-bold bg-brand-accent/10 text-brand-accent px-3 py-1 rounded-full uppercase">
            {cycle.length}{" "}
            {t("goals.workout.plan_window.cycle_structure.length")}
          </span>
        </header>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="flex flex-wrap gap-3 p-6 rounded-[2.5rem] border border-neutral-100">
            <SortableContext
              items={cycle.map((s) => s.id)}
              strategy={horizontalListSortingStrategy}
            >
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
                onClick={() => !isLoading && addStep("workout")}
                disabled={isLoading}
                className={`h-12.5 flex items-center gap-2 px-4 py-2 transition-all group border-2 border-dashed rounded-2xl ${
                  isLoading
                    ? "bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed grayscale"
                    : "bg-white border-neutral-200 text-neutral-400 hover:border-brand-accent hover:text-brand-accent cursor-pointer active:scale-95"
                }`}
              >
                <Plus
                  size={18}
                  className={`${!isLoading && "group-hover:rotate-90"} transition-transform`}
                />
                <span className="text-[10px] font-black uppercase">
                  {t("goals.workout.plan_window.cycle_structure.workout_add")}
                </span>
              </button>

              <button
                onClick={() => !isLoading && addStep("rest")}
                disabled={isLoading}
                className={`h-12.5 flex items-center gap-2 px-4 py-2 transition-all border-2 border-dashed rounded-2xl ${
                  isLoading
                    ? "bg-neutral-50 border-neutral-100 text-neutral-300 cursor-not-allowed grayscale"
                    : "bg-white border-neutral-200 text-neutral-400 hover:border-neutral-900 hover:text-neutral-900 cursor-pointer active:scale-95"
                }`}
              >
                <Moon size={16} />
                <span className="text-[10px] font-black uppercase">Off</span>
              </button>
            </div>
          </div>
        </DndContext>
      </section>

      {(hasChanges() || isLoading) && (
        <div className="flex flex-row flex-1 justify-center gap-3 items-center fixed bottom-10 left-1/2 -translate-x-1/2 z-60 w-full px-4">
          <button
            onClick={() => saveChanges(true)}
            disabled={isLoading || !allWorkoutsConfigured}
            className={`flex items-center gap-3 px-8 py-4 rounded-full shadow-2xl border transition-all active:scale-95 group ${
              allWorkoutsConfigured
                ? "border border-brand-accent/10 bg-brand-accent/20 backdrop-blur-md text-brand-accent/70 hover:text-white hover:bg-brand-accent hover:scale-105 cursor-pointer"
                : "bg-neutral-800 text-neutral-500 border-neutral-700 cursor-not-allowed"
            } ${isLoading ? "opacity-80" : ""}`}
          >
            {isLoading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : !allWorkoutsConfigured ? (
              <AlertCircle size={18} />
            ) : (
              <Plus
                size={18}
                className="group-hover:rotate-90 transition-transform fill-brand-accent/20"
              />
            )}
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">
              {getSaveButtonLabel()}
            </span>
          </button>

          {!isLoading && allWorkoutsConfigured && (
            <button
              onClick={() => saveChanges(false)}
              className="flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl border border-blue-500/10 bg-blue-500/20 backdrop-blur-md text-blue-500/70 hover:text-white hover:bg-blue-500 hover:scale-105 transition-all active:scale-95 cursor-pointer group"
            >
              <Edit3
                size={18}
                className="group-hover:rotate-12 transition-transform"
              />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                {isMobile
                  ? t(
                      "goals.workout.plan_window.cycle_structure.actions.quick_edit_mobile",
                    )
                  : t(
                      "goals.workout.plan_window.cycle_structure.actions.quick_edit",
                    )}
              </span>
            </button>
          )}

          {!isLoading && (
            <button
              onClick={rollbackChanges}
              className="cursor-pointer flex items-center gap-3 px-6 py-4 rounded-full backdrop-blur-md shadow-xl border border-red-500/20 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 group order-3"
            >
              <RotateCcw
                size={16}
                className="transition-transform group-hover:-rotate-180 duration-300"
              />
              <span className="md:block hidden text-[10px] font-black uppercase tracking-[0.2em]">
                {t("goals.workout.plan_window.cycle_structure.actions.discard")}
              </span>
            </button>
          )}
        </div>
      )}

      <section className="space-y-6">
        <h2 className="text-[10px] font-black text-neutral-400 uppercase tracking-[0.2em] px-2 text-center">
          {t("goals.workout.plan_window.monthly_projection.title")}
        </h2>
        <div className="bg-white border border-neutral-100 rounded-[2.5rem] p-8 shadow-sm">
          <div className="grid grid-cols-7 gap-y-8">
            {t("goals.workout.plan_window.week_days")
              .split("")
              .map((d, i) => (
                <div
                  key={i}
                  className="text-center text-[10px] font-black text-neutral-300 uppercase"
                >
                  {d}
                </div>
              ))}
            {monthDays.map((day, i) => {
              const workoutStep = getWorkoutForDate(startOfDay(day));
              const isToday = isSameDay(day, today);
              const isPastDay = startOfDay(day) < today;

              return (
                <div
                  key={i}
                  className={`flex flex-col items-center gap-1.5 relative group transition-all duration-300 ${
                    isLoading ? "grayscale opacity-50" : ""
                  }`}
                >
                  <span
                    className={`text-xs ${
                      isToday
                        ? "text-brand-accent font-black"
                        : "text-neutral-400 font-bold"
                    }`}
                  >
                    {format(day, "d")}
                  </span>

                  <div
                    onClick={() =>
                      !isLoading &&
                      !isPastDay &&
                      workoutStep?.type === "workout" &&
                      setEditingId(workoutStep.id)
                    }
                    className={`w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-black transition-all ${
                      isToday ? "ring-2 ring-brand-accent ring-offset-2" : ""
                    } ${
                      isLoading
                        ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                        : workoutStep?.type === "rest"
                          ? "bg-neutral-100 text-neutral-500 border border-dashed border-neutral-300"
                          : workoutStep
                            ? `bg-neutral-900 text-brand-accent shadow-lg hover:scale-110 ${isPastDay ? "cursor-not-allowed" : "cursor-pointer"}`
                            : "bg-neutral-50 text-neutral-200"
                    }`}
                  >
                    {workoutStep?.type === "rest" ? (
                      <Moon size={12} />
                    ) : (
                      workoutStep?.label || "—"
                    )}
                  </div>

                  {workoutStep && !isMobile && !isLoading && (
                    <div className="absolute bottom-full mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 z-50 translate-y-2 group-hover:translate-y-0">
                      <div className="bg-neutral-900 text-white p-4 rounded-3xl shadow-2xl border border-white/10 w-48 overflow-hidden relative">
                        <div className="absolute -right-4 -top-4 opacity-10">
                          {workoutStep.type === "rest" ? (
                            <Moon size={110} />
                          ) : (
                            <div className="text-9xl font-black">
                              {workoutStep.label}
                            </div>
                          )}
                        </div>
                        <p className="text-[8px] font-black text-brand-accent uppercase tracking-widest">
                          {workoutStep.type === "rest"
                            ? t(workoutStep.label as TranslationKeys)
                            : t("goals.workout.workout_label", {
                                letter: workoutStep.label,
                              })}
                        </p>
                        <h4
                          className={`text-sm font-black uppercase leading-tight mt-1 ${
                            !workoutStep.name &&
                            workoutStep.type !== "rest" &&
                            "text-neutral-400 italic"
                          }`}
                        >
                          {workoutStep.name ||
                            (workoutStep.type === "rest" ? "OFF" : "No Name")}
                        </h4>
                        <div className="mt-3 flex items-center gap-2 opacity-60">
                          {workoutStep.type === "rest" ? (
                            <Coffee size={10} />
                          ) : (
                            <LayoutList size={10} />
                          )}
                          <span className="text-[9px] font-bold uppercase">
                            {workoutStep.type === "rest"
                              ? t(
                                  "goals.workout.plan_window.monthly_projection.recover_yourself",
                                )
                              : `${workoutStep.exercises.length} ${t("goals.workout.plan_window.monthly_projection.exercises")}`}
                          </span>
                        </div>
                      </div>
                      <div className="w-3 h-3 bg-neutral-900 rotate-45 absolute -bottom-1.5 left-1/2 -translate-x-1/2 border-r border-b border-white/10"></div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <PresetsModal
        cycle={cycle}
        setCycle={setCycle}
        setShowPresets={setShowPresets}
        showPresets={showPresets}
      />

      <EditWorkoutModal
        cycle={cycle}
        editingId={editingId}
        setCycle={setCycle}
        setEditingId={setEditingId}
      />

      <ConfirmExitModal
        hasChanges={hasChanges()}
        rollbackChanges={rollbackChanges}
        isLoading={isLoading}
      />
    </div>
  );
};

export default WorkoutPlanning;
