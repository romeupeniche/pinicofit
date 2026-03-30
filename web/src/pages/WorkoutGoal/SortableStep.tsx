import React, { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Moon, X } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import type { TranslationKeys } from "../../types/i18n";
import type { ICycleStep } from "../../store/goals/workoutStore";

interface SortableStepProps {
  step: ICycleStep;
  isLoading: boolean;
  onEdit: (id: string) => void;
  onRemove: (id: string) => void;
}

const SortableStep: React.FC<SortableStepProps> = ({
  step,
  isLoading,
  onEdit,
  onRemove,
}) => {
  const { t } = useSettingsStore();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: step.id,
    disabled: isLoading,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
    willChange: isDragging ? "transform" : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative group transition-all duration-300 ease-out touch-none ${
        isDragging ? "opacity-30 scale-105" : "opacity-100 scale-100"
      } ${isLoading ? "cursor-not-allowed grayscale" : "cursor-grab"}`}
    >
      <button
        {...attributes}
        {...listeners}
        onClick={() => !isLoading && step.type === "workout" && onEdit(step.id)}
        disabled={isLoading}
        className={`flex items-center gap-3 p-2 md:pr-4 rounded-2xl transition-all border shadow-sm ${isDragging ? "cursor-grabbing" : step.type === "rest" ? "cursor-grab" : "cursor-pointer"}  ${
          isLoading
            ? "bg-neutral-100 border-neutral-200 text-neutral-400 opacity-50"
            : step.type === "rest"
              ? "bg-white border-neutral-200 text-neutral-300 active:scale-95"
              : step.isConfigured
                ? "bg-neutral-900 border-neutral-800 text-white hover:border-brand-accent active:scale-95"
                : "bg-white border-dashed border-brand-accent text-brand-accent animate-pulse active:scale-95"
        }`}
      >
        <div
          className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm ${
            isLoading
              ? "bg-neutral-200 text-neutral-500"
              : step.type === "rest"
                ? "bg-neutral-100 text-neutral-500"
                : "bg-brand-accent text-neutral-900"
          }`}
        >
          {step.type === "rest" ? <Moon size={14} /> : step.label}
        </div>

        <div className="text-left hidden md:block">
          <span
            className={`text-[10px] font-black uppercase block leading-none ${step.type === "rest" ? "text-neutral-500" : ""}`}
          >
            {step.type === "workout"
              ? t("goals.workout.workout_label", { letter: step.label })
              : t(step.label as TranslationKeys)}
          </span>
          {step.type === "workout" && (
            <span className="text-[8px] font-bold opacity-60 uppercase truncate max-w-20 block mt-0.5">
              {step.name ||
                t("goals.workout.plan_window.cycle_structure.configure")}
            </span>
          )}
        </div>
      </button>

      {!isLoading && !isDragging && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove(step.id);
          }}
          className="cursor-pointer absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10 hover:scale-110 active:scale-90"
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
};

export default memo(SortableStep);
