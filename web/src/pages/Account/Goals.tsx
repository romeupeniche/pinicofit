import React, { useEffect } from "react";
import { Save, Activity } from "lucide-react";
// @ts-expect-error - import is correct
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../store/authStore";
import { useSettingsStore } from "../../store/settingsStore";
import { api } from "../../services/api";

type GoalsFormData = {
  waterGoal: number;
  calorieGoal: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  sodiumGoal: number;
  sugarGoal: number;
  sleepGoal: number;
  stepsGoal: number;
};

const Goals: React.FC = () => {
  const { t } = useSettingsStore();
  const { user, updateProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isDirty, isSubmitting },
  } = useForm<GoalsFormData>();

  useEffect(() => {
    if (user) {
      reset({
        waterGoal: user.waterGoal || 2000,
        calorieGoal: user.calorieGoal || 2200,
        proteinGoal: user.proteinGoal || 160,
        carbsGoal: user.carbsGoal || 250,
        fatGoal: user.fatGoal || 70,
        sodiumGoal: user.sodiumGoal || 2300,
        sugarGoal: user.sugarGoal || 50,
        sleepGoal: user.sleepGoal || 8,
        stepsGoal: user.stepsGoal || 8000,
      });
    }
  }, [reset, user]);

  const saveMutation = useMutation({
    mutationFn: async (data: GoalsFormData) => {
      const response = await api.patch(`/users/${user?.id}`, {
        ...data,
        recalculateGoals: false,
      });
      return response.data;
    },
    onSuccess: (data) => {
      updateProfile(data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
    },
  });

  const onSubmit = handleSubmit(async (data: GoalsFormData) => {
    await saveMutation.mutateAsync(data);
  });

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold">{t("account.goals.title")}</h2>
          <p className="text-sm text-neutral-500">{t("account.goals.subtitle")}</p>
        </div>
        <Activity className="text-neutral-300" size={30} />
      </div>

      <form onSubmit={onSubmit} className="grid gap-8 max-w-3xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t("account.goals.fields.water")}
            </label>
            <input
              type="number"
              {...register("waterGoal", { valueAsNumber: true })}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t("account.goals.fields.calories")}
            </label>
            <input
              type="number"
              {...register("calorieGoal", { valueAsNumber: true })}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t("account.goals.fields.sleep")}
            </label>
            <input
              type="number"
              step="0.5"
              {...register("sleepGoal", { valueAsNumber: true })}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              {t("account.goals.fields.steps")}
            </label>
            <input
              type="number"
              {...register("stepsGoal", { valueAsNumber: true })}
              className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-6 pt-4">
          <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400">
            {t("account.goals.macro_title")}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2">
                {t("account.goals.fields.protein")}
              </label>
              <input
                type="number"
                {...register("proteinGoal", { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2">
                {t("account.goals.fields.carbs")}
              </label>
              <input
                type="number"
                {...register("carbsGoal", { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2">
                {t("account.goals.fields.fat")}
              </label>
              <input
                type="number"
                {...register("fatGoal", { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2">
                {t("account.goals.fields.sodium")}
              </label>
              <input
                type="number"
                {...register("sodiumGoal", { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-2">
                {t("account.goals.fields.sugar")}
              </label>
              <input
                type="number"
                {...register("sugarGoal", { valueAsNumber: true })}
                className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all text-sm"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isDirty}
          className="w-fit mt-4 px-8 py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-brand-accent transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 group"
        >
          <Save
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          {saveMutation.isPending
            ? t("account.goals.saving")
            : t("account.profile.save_updates")}
        </button>
      </form>
    </div>
  );
};

export default Goals;
