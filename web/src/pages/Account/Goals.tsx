import React, { useEffect, useState, useCallback } from "react";
import {
  Save, Activity, Droplets, Utensils, Moon,
  CheckCircle2, Dumbbell,
} from "lucide-react";
// @ts-expect-error
import { useForm, Controller, useWatch, type ControllerRenderProps } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { useSettingsStore } from "../../store/settingsStore";
import { api } from "../../services/api";
import { useAccountUnsavedChanges } from "./AccountUnsavedChangesContext";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import GoalsConfirmSettingModal from "../../components/GoalsConfirmSettingModal";
import { formatTextWithHighlights } from "../../utils/formatTextWithHighlights";


type GoalsFormData = {
  waterGoal: number;
  waterTolerance: number;
  waterEnabled: boolean;

  nutritionTolerance: number;
  nutritionEnabled: boolean;

  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  sodiumGoal: number;
  sugarGoal: number;

  sleepGoal: number;
  sleepTolerance: number;
  sleepEnabled: boolean;

  workoutTolerance: number;
  workoutEnabled: boolean;

  tasksGoal: number;
  tasksEnabled: boolean;
};


const Toggle = ({
  checked,
  onChange,
  size = "md",
  disabled = false,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  size?: "sm" | "md";
  disabled?: boolean;
}) => {
  const sm = size === "sm";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative inline-flex shrink-0 items-center rounded-full transition-colors duration-200
        focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent/50
        disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer
        ${sm ? "w-8 h-4" : "w-11 h-6"}
        ${checked ? "bg-brand-accent" : "bg-neutral-200"}`}
    >
      <span
        className={`inline-block rounded-full bg-white shadow transition-transform duration-200
          ${sm ? "w-3 h-3" : "w-4 h-4"}
          ${checked
            ? sm ? "translate-x-4" : "translate-x-6"
            : sm ? "translate-x-0.5" : "translate-x-1"
          }`}
      />
    </button>
  );
};


type SliderProps = {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  label: string;
  unit?: string;
  step?: number;
  recommended?: { value: number; label: string };
  hint?: (val: number) => React.ReactNode;
  disabled?: boolean;
};

const SmartSlider = ({
  value,
  onChange,
  min,
  max,
  label,
  unit = "%",
  step = 1,
  recommended,
  hint,
  disabled = false,
}: SliderProps) => {
  const [draft, setDraft] = useState<string>(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const pct = ((value - min) / (max - min)) * 100;
  const recPct = recommended ? ((recommended.value - min) / (max - min)) * 100 : null;

  const commitDraft = useCallback(() => {
    const stripped = draft.replace(/[^0-9]/g, "");
    const num = stripped === "" ? min : Math.min(max, Math.max(min, Number(stripped)));
    setDraft(String(num));
    onChange(num);
  }, [draft, min, max, onChange]);

  return (
    <div
      className={`w-full space-y-2 transition-opacity duration-200 ${disabled ? "opacity-40 pointer-events-none select-none" : ""
        }`}
    >
      <div className="flex justify-between items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
          {label}
        </span>
        <div className="flex items-center gap-0.5 bg-brand-accent/10 rounded-full px-3 py-1">
          <input
            type="text"
            inputMode="numeric"
            value={draft}
            disabled={disabled}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9]/g, "");
              setDraft(raw);
            }}
            onBlur={commitDraft}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                commitDraft();
                (e.target as HTMLInputElement).blur();
              }
              if (
                !/[0-9]/.test(e.key) &&
                !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Enter"].includes(e.key)
              ) {
                e.preventDefault();
              }
            }}
            className="w-8 text-center text-sm font-black text-brand-accent bg-transparent outline-none tabular-nums"
          />
          <span className="text-sm font-black text-brand-accent">{unit}</span>
        </div>
      </div>

      <div className="relative flex items-center h-10">
        <div className="absolute w-full h-2 rounded-full bg-neutral-100" />
        <div
          className="absolute h-2 rounded-full bg-brand-accent pointer-events-none"
          style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        />
        {recPct !== null && (
          <div
            className="absolute w-0.5 h-3.5 bg-brand-accent/40 rounded-full pointer-events-none"
            style={{ left: `${recPct}%`, transform: "translateX(-50%)" }}
          />
        )}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          disabled={disabled}
          onChange={(e) => {
            const v = Number(e.target.value);
            onChange(v);
            setDraft(String(v));
          }}
          className="relative w-full appearance-none bg-transparent cursor-pointer z-10
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-accent
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:transition-transform
            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-brand-accent
            [&::-moz-range-thumb]:shadow-md"
        />
      </div>

      <div className="relative flex justify-between text-[10px] font-bold text-neutral-300 px-0.5">
        <span>{min}{unit}</span>
        {recommended && recPct !== null && (
          <span
            className="absolute text-brand-accent/50 font-black whitespace-nowrap"
            style={{ left: `${recPct}%`, transform: "translateX(-50%)" }}
          >
            {recommended.label}
          </span>
        )}
        <span>{max}{unit}</span>
      </div>

      {hint && (
        <div className="text-[11px] text-neutral-400 bg-neutral-50 rounded-xl px-3 py-2 border border-neutral-100">
          {hint(value)}
        </div>
      )}
    </div>
  );
};

const NumberInput = React.forwardRef<
  HTMLInputElement,
  { label: string; unit?: string; disabled?: boolean;[key: string]: any }
>(({ label, unit, disabled, ...props }, ref) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
      {label}
    </label>
    <div className="relative flex items-center">
      <input
        type="number"
        ref={ref}
        disabled={disabled}
        {...props}
        className="w-full px-4 py-3 pr-14 rounded-2xl border border-neutral-200 font-bold text-neutral-800 outline-none
          focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10
          transition-all bg-white text-base
          disabled:bg-neutral-50 disabled:text-neutral-400"
      />
      {unit && (
        <span className="absolute right-4 text-xs font-bold text-neutral-300 pointer-events-none select-none">
          {unit}
        </span>
      )}
    </div>
  </div>
));

const GoalCard = ({
  title, icon: Icon, children, id, description,
  highlighted, enabled, onToggle,
}: any) => (
  <div
    className={`relative transition-all duration-300 rounded-3xl border p-5 sm:p-6 ${highlighted === id
      ? "border-brand-accent bg-brand-accent/5 ring-4 ring-brand-accent/10"
      : "border-neutral-200 bg-white/60"
      }`}
  >
    <div className="flex items-center gap-3 mb-6">
      <div
        className={`p-2.5 rounded-xl shrink-0 transition-colors ${enabled === false ? "bg-neutral-100 text-neutral-300" : highlighted === id ? "bg-brand-accent text-white" : "bg-neutral-100 text-neutral-500"
          }`}
      >
        <Icon size={18} />
      </div>
      <div className="flex-1 min-w-0">
        <h3
          className={`font-bold text-sm sm:text-base transition-colors ${enabled === false ? "text-neutral-400" : "text-neutral-800"
            }`}
        >
          {title}
        </h3>
        <p className="text-xs text-neutral-400">{description}</p>
      </div>
      {onToggle !== undefined && (
        <Toggle checked={enabled ?? true} onChange={onToggle} />
      )}
    </div>
    {children}
  </div>
);

const getRemainingCooldownDays = (cooldownDate: string | Date | null) => {
  if (!cooldownDate) return 0;

  const now = new Date();
  const diffTime = new Date(cooldownDate).getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};

const cooldownKeys = {
  waterEnabled: "waterCooldownUntil",
  nutritionEnabled: "nutritionCooldownUntil",
  sleepEnabled: "sleepCooldownUntil",
  tasksEnabled: "tasksCooldownUntil",
  workoutEnabled: "workoutCooldownUntil"
} as const

const Goals: React.FC<{ focusedGoal?: string }> = ({ focusedGoal }) => {
  const { t } = useSettingsStore();
  const { user, updateProfile } = useAuthStore();
  const { setHasUnsavedChanges } = useAccountUnsavedChanges();
  const queryClient = useQueryClient();
  const [highlighted, setHightlighted] = useState<string | null>(focusedGoal ?? null);
  const [modalType, setModalType] = useState<"disable_goal" | "reactivate_goal" | "cooldown_active" | null>(null);
  const [pendingField, setPendingField] = useState<keyof GoalsFormData | null>(null);
  useBodyScrollLock(!!modalType);
  const handleToggleAttempt = (fieldName: keyof GoalsFormData, nextValue: boolean) => {
    setPendingField(fieldName);
    if (nextValue === false) {
      setModalType("disable_goal");
    } else {
      if (getRemainingCooldownDays(user!.preferences[cooldownKeys[fieldName as keyof typeof cooldownKeys]]) > 0) {
        setModalType("cooldown_active");
      } else {
        setModalType("reactivate_goal");
      }
    }
  };

  const onModalConfirm = () => {
    if (modalType === "cooldown_active") {
      setModalType(null);
    } else {
      if (pendingField) {
        setValue(pendingField, false, { shouldDirty: true });
        setModalType(null);
        setPendingField(null);
      }
    }
  }

  const {
    register, handleSubmit, watch, reset, control,
    setValue,
    formState: { isDirty, isSubmitting },
  } = useForm<GoalsFormData>();

  useEffect(() => {
    if (user && user.preferences) {
      const p = user.preferences;
      reset({
        nutritionEnabled: p.nutritionEnabled ?? true,
        nutritionTolerance: p.nutritionTolerance ?? 80,
        waterGoal: p.waterGoal ?? 2000,
        waterTolerance: p.waterTolerance ?? 80,
        waterEnabled: p.waterEnabled ?? true,
        calorieGoal: p.calorieGoal ?? 2200,
        proteinGoal: p.proteinGoal ?? 160,
        carbsGoal: p.carbsGoal ?? 250,
        fatGoal: p.fatGoal ?? 70,
        sleepGoal: p.sleepGoal ?? 8,
        sleepTolerance: p.sleepTolerance ?? 85,
        sleepEnabled: p.sleepEnabled ?? true,
        workoutTolerance: p.workoutTolerance ?? 80,
        workoutEnabled: p.workoutEnabled ?? true,
        tasksGoal: p.tasksGoal ?? 5,
        tasksEnabled: p.tasksEnabled ?? true,
      });
    }
  }, [user, reset]);

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
    return () => setHasUnsavedChanges(false);
  }, [isDirty, setHasUnsavedChanges]);

  const values = watch();
  console.log(values)

  const waterMin = values.waterGoal
    ? Math.min(50, Math.round((1500 / Number(values.waterGoal)) * 100))
    : 40;

  const saveMutation = useMutation({
    mutationFn: async (data: GoalsFormData) => {
      const response = await api.patch(`/users/preferences/goals`, data);
      return response.data;
    },
    onSuccess: (updatedPreferences) => {
      updateProfile({ preferences: updatedPreferences });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setHasUnsavedChanges(false);
    },
    onError: (error) => {
      console.error("Error saving goals:", error);
    }
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-xl font-bold">{t("account.goals.title")}</h2>
          <p className="text-sm text-neutral-500">{t("account.goals.subtitle")}</p>
        </div>
        <Activity className="text-neutral-300" size={30} />
      </div>
      <form
        onSubmit={handleSubmit((data: GoalsFormData) => {
          saveMutation.mutate(data);
          setHightlighted(null);
        })}
        className="space-y-5 max-w-4xl"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <GoalCard
            id="waterGoal" title={t("account.goals.water.title")}
            icon={Droplets} description={t("account.goals.water.subtitle")}
            highlighted={highlighted} enabled={values.waterEnabled}
            onToggle={(v: boolean) => handleToggleAttempt("waterEnabled", v)}
          >
            <div className="space-y-5">
              <NumberInput
                label={t("account.goals.water.goal")} unit="ml"
                {...register("waterGoal", { valueAsNumber: true })}
              />
              <Controller name="waterTolerance" control={control} render={({ field }: { field: ControllerRenderProps<GoalsFormData, "waterTolerance"> }) => (
                <SmartSlider
                  label={t("account.goals.streak_tolerance")}
                  value={field.value ?? 80}
                  onChange={field.onChange}
                  min={waterMin}
                  max={100}
                  disabled={!values.waterEnabled}
                  recommended={{ value: 80, label: "rec. 80%" }}
                  hint={(val) => (<>
                    <span className="font-semibold text-neutral-500">{formatTextWithHighlights(t("account.goals.water.tolerance_tip", { tolerance: String(Math.round((Number(values.waterGoal || 0) * val) / 100)) }), "text-brand-accent", "black")}</span>
                    <span className="text-neutral-300">{t("account.goals.water.min_tip", { min: String(Math.round(Number(values.waterGoal || 0) * waterMin / 100)) })}</span>
                  </>)}
                />
              )} />
            </div>
          </GoalCard>

          <GoalCard
            id="sleepGoal" title={t("account.goals.sleep.title")}
            icon={Moon} description={t("account.goals.sleep.subtitle")}
            highlighted={highlighted} enabled={values.sleepEnabled}
            onToggle={(v: boolean) => handleToggleAttempt("sleepEnabled", v)}
          >
            <div className="space-y-5">
              <NumberInput
                label={t("account.goals.sleep.duration")} unit="hrs" step="0.5"
                {...register("sleepGoal", { valueAsNumber: true })}
              />
              <Controller name="sleepTolerance" control={control} render={({ field }: { field: ControllerRenderProps<GoalsFormData, "sleepTolerance"> }) => (
                <SmartSlider
                  label={t("account.goals.streak_tolerance")}
                  value={field.value ?? 85}
                  onChange={field.onChange}
                  min={50} max={100}
                  disabled={!values.sleepEnabled}
                  recommended={{ value: 85, label: "rec. 85%" }}
                  hint={(val) => <span className="font-semibold text-neutral-500">{formatTextWithHighlights(t("account.goals.sleep.tolerance_tip", { tolerance: String(((Number(values.sleepGoal || 0) * val) / 100).toFixed(1)) }), "text-brand-accent", "black")}</span>}
                />
              )} />
            </div>
          </GoalCard>
        </div>

        <GoalCard
          id="nutritionGoal" title={t("account.goals.nutrition.title")}
          icon={Utensils} description={t("account.goals.nutrition.subtitle")}
          highlighted={highlighted} enabled={values.nutritionEnabled}
          onToggle={(v: boolean) => {
            handleToggleAttempt("nutritionEnabled", v)
          }}
        >
          <div className="space-y-6">
            <div className="flex items-end gap-3">
              <div className="flex-1">
                <NumberInput
                  label={t("account.goals.nutrition.calorie_goal")} unit="kcal"
                  {...register("calorieGoal", { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {([
                "protein",
                "carbs",
                "fat",
              ] as const).map((key) => (
                <div key={key} className="space-y-1">
                  <div className="flex items-center justify-between px-0.5 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">{t(`account.goals.nutrition.${key}`)}</span>
                  </div>
                  <div className="relative flex items-center">
                    <input
                      type="number"
                      {...register(`${key}Goal` as any, { valueAsNumber: true })}
                      className="w-full px-3 py-3 pr-8 rounded-2xl border border-neutral-200 font-bold text-neutral-800
                        outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/10
                        transition-all bg-white text-base"
                    />
                    <span className="absolute right-3 text-xs font-bold text-neutral-300 pointer-events-none">g</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100" />

            <Controller name="nutritionTolerance" control={control} render={({ field }: { field: ControllerRenderProps<GoalsFormData, "nutritionTolerance"> }) => (
              <SmartSlider
                label={t("account.goals.streak_tolerance")}
                value={field.value ?? 95}
                onChange={field.onChange}
                min={70} max={100}
                disabled={!values.nutritionEnabled}
                recommended={{ value: 90, label: "rec. 90%" }}
                hint={(val) => <span className="font-semibold text-neutral-500">{formatTextWithHighlights(t("account.goals.nutrition.tolerance_tip", { tolerance: String(((Number(values.calorieGoal || 0) * val) / 100).toFixed(1)) }), "text-brand-accent", "black")}</span>}
              />
            )} />

            <div className="flex items-start gap-2 bg-brand-accent/5 rounded-2xl px-4 py-3 border border-brand-accent/10">
              <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-accent/60" />
              <span className="text-[11px] text-brand-accent/70">{t("account.goals.nutrition.streak_tip")}</span>
            </div>
          </div>
        </GoalCard>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

          <GoalCard
            id="workoutGoal" title={t("account.goals.workout.title")}
            icon={Dumbbell} description={t("account.goals.workout.subtitle")}
            highlighted={highlighted} enabled={values.workoutEnabled}
            onToggle={(v: boolean) => handleToggleAttempt("workoutEnabled", v)}
          >
            <div className="space-y-5">
              <Controller name="workoutTolerance" control={control} render={({ field }: { field: ControllerRenderProps<GoalsFormData, "workoutTolerance"> }) => (
                <SmartSlider
                  label={t("account.goals.workout.minimum_completion")}
                  value={field.value ?? 80}
                  onChange={field.onChange}
                  min={70} max={100}
                  disabled={!values.workoutEnabled}
                  recommended={{ value: 80, label: "rec. 80%" }}
                  hint={(val) => <span className="font-semibold text-neutral-500">{formatTextWithHighlights(t("account.goals.workout.tolerance_tip", { tolerance: String(Math.floor(10 * (1 - val / 100))) }), "text-brand-accent", "black")}</span>}
                />
              )} />
            </div>
          </GoalCard>

          <GoalCard
            id="tasksGoal" title={t("account.goals.tasks.title")}
            icon={CheckCircle2} description={t("account.goals.tasks.subtitle")}
            highlighted={highlighted} enabled={values.tasksEnabled}
            onToggle={(v: boolean) => handleToggleAttempt("tasksEnabled", v)}
          >
            <div className="space-y-5">
              <NumberInput
                label={t("account.goals.tasks.input_label")} unit={t("account.goals.tasks.unit")}
                {...register("tasksGoal", { valueAsNumber: true })}
              />
            </div>
          </GoalCard>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-full sm:w-auto px-10 py-4 bg-neutral-900 text-white rounded-2xl font-bold
            enabled:hover:bg-brand-accent transition-all group
            flex items-center justify-center gap-3 cursor-pointer
            disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <Save size={18} className="group-enabled:group-hover:scale-110 transition-transform" />
          {saveMutation.isPending ? t("account.goals.saving") : t("account.save_updates")}
        </button>
      </form>
      {!!modalType && (
        <GoalsConfirmSettingModal modalType={modalType} onConfirm={onModalConfirm} setIsModalOpen={setModalType} cooldownDays={getRemainingCooldownDays(user!.preferences[cooldownKeys[pendingField as keyof typeof cooldownKeys]])} />
      )}
    </div>
  );
};

export default Goals;