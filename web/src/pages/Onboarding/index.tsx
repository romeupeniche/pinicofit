// @ts-expect-error
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import {
  completeProfileSchema,
  type CompleteProfileFormData,
} from "../../schemas/Auth.ts";
import type { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useSettingsStore } from "../../store/settingsStore.ts";
import CustomLoadingSpinner from "../../components/CustomLoadingSpinner.tsx";

export function Onboarding() {
  const { user, token, _hasHydrated, updateProfile, logout } = useAuthStore();
  const [step, setStep] = useState(1);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useSettingsStore();
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    getValues,
    trigger
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      activityLevel: "moderate",
    },
  });

  useEffect(() => {
    if (_hasHydrated) {
      if (!token) {
        navigate("/sign-in");
      } else if (user?.isProfileComplete) {
        navigate("/dashboard");
      }
    }
  }, [_hasHydrated, token, user, navigate]);

  const handleGoToReview = async () => {
    const isValid = await trigger();
    if (!isValid) return;

    setIsLoading(true);
    try {
      const formData = getValues();
      const response = await api.post('/users/onboarding/preview', formData);
      setPreviewData(response.data);
      setStep(2);
    } catch (error) {
      alert("Erro ao calcular metas. Verifique se a rota de preview existe no backend.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: CompleteProfileFormData) => {
    setIsLoading(true);
    try {
      if (!user?.id) {
        alert(t("onboarding.user_missing"));
        return navigate("/sign-in");
      }

      const response = await api.patch(`/users/${user.id}`, {
        ...data,
        isProfileComplete: true,
        recalculateGoals: true,
      });

      updateProfile(response.data);
      navigate("/dashboard");
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      const errorMessage = err.response?.data?.message || t("onboarding.unexpected_error");
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!_hasHydrated)
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-950">
        <CustomLoadingSpinner />
      </div>
    );

  if (step === 2 && previewData) {
    const LIMITS = {
      calorieGoal: 10000,
      proteinGoal: 999,
      carbsGoal: 999,
      fatGoal: 999,
      waterGoal: 15000,
    };

    const errors_preview = {
      calorieGoal: previewData.calorieGoal > LIMITS.calorieGoal,
      proteinGoal: previewData.proteinGoal > LIMITS.proteinGoal,
      carbsGoal: previewData.carbsGoal > LIMITS.carbsGoal,
      fatGoal: previewData.fatGoal > LIMITS.fatGoal,
      waterGoal: previewData.waterGoal > LIMITS.waterGoal,
    };

    const hasError = Object.values(errors_preview).some(Boolean);

    const handleNumberChange = (key: string, value: string) => {
      const cleanValue = value.replace(/\D/g, "");
      if (cleanValue === "") {
        setPreviewData({ ...previewData, [key]: 0 });
        return;
      }
      const numValue = parseInt(cleanValue, 10);
      setPreviewData({ ...previewData, [key]: numValue });
    };

    return (
      <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white/20 p-8 rounded-2xl shadow-sm border border-white backdrop-blur-sm">
          <header className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-neutral-900">
              {t("onboarding.review_title")}
            </h1>
            <p className="text-neutral-500 mt-2">
              {t("onboarding.review_subtitle")}
            </p>
          </header>

          <div className="flex flex-col gap-5 mb-8">
            <div className={`p-5 bg-neutral-50 border rounded-xl flex flex-col items-center transition-colors ${errors_preview.calorieGoal ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}>
              <label className="block text-sm font-medium text-neutral-700 mb-1 uppercase tracking-wider">
                {t("onboarding.calories_label")}
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={previewData.calorieGoal}
                onChange={(e) => handleNumberChange('calorieGoal', e.target.value)}
                className={`text-4xl font-black bg-transparent text-center outline-none w-full ${errors_preview.calorieGoal ? 'text-red-600' : 'text-brand-accent'}`}
              />
              {errors_preview.calorieGoal && (
                <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                  {t("onboarding.max_limit", { max: String(LIMITS.calorieGoal) })}
                </p>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { label: t("onboarding.protein_label"), key: 'proteinGoal' },
                { label: t("onboarding.carbs_label"), key: 'carbsGoal' },
                { label: t("onboarding.fat_label"), key: 'fatGoal' }
              ].map((item) => {
                const isInvalid = errors_preview[item.key as keyof typeof errors_preview];
                return (
                  <div key={item.key} className={`bg-neutral-50 p-3 rounded-xl border text-center transition-colors ${isInvalid ? 'border-red-500 bg-red-50' : 'border-neutral-300'}`}>
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">{item.label}</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={previewData[item.key as keyof typeof previewData]}
                      onChange={(e) => handleNumberChange(item.key, e.target.value)}
                      className={`text-xl font-bold bg-transparent text-center w-full outline-none ${isInvalid ? 'text-red-600' : 'text-neutral-800'}`}
                    />
                    {isInvalid && (
                      <p className="text-[8px] text-red-500 font-bold leading-tight uppercase">
                        {t("onboarding.max_limit", { max: String(LIMITS[item.key as keyof typeof LIMITS]) })}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className={`p-4 border rounded-xl flex justify-between items-center px-6 transition-colors ${errors_preview.waterGoal ? 'border-red-500 bg-red-50' : 'border-blue-200 bg-blue-50/50'}`}>
              <div className="flex flex-col">
                <label className="text-sm font-bold text-blue-700 uppercase tracking-wide">
                  {t("onboarding.water_label")}
                </label>
                {errors_preview.waterGoal && (
                  <p className="text-[10px] text-red-500 font-bold uppercase">
                    {t("onboarding.max_limit", { max: String(LIMITS.waterGoal) })}
                  </p>
                )}
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={previewData.waterGoal}
                onChange={(e) => handleNumberChange('waterGoal', e.target.value)}
                className={`text-2xl font-black bg-transparent text-right outline-none w-28 ${errors_preview.waterGoal ? 'text-red-600' : 'text-blue-700'}`}
              />
            </div>
          </div>

          <div className="flex items-center flex-col gap-3 px-4">
            <button
              onClick={() => {
                if (hasError) return;
                const finalData = { ...getValues(), ...previewData };
                onSubmit(finalData);
              }}
              disabled={isLoading || hasError}
              className={`w-full p-3 rounded-xl font-bold transition-all shadow-lg cursor-pointer ${hasError
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed shadow-none'
                : 'bg-brand-accent hover:bg-brand-accent/90 text-white shadow-brand-accent/20'
                }`}
            >
              {isLoading ? t("onboarding.loading") : t("onboarding.finalize_button")}
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-neutral-400 text-sm hover:text-neutral-600 transition-colors py-2 cursor-pointer"
            >
              {t("onboarding.back_button")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md bg-white/20 p-8 rounded-2xl shadow-sm border border-white">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-neutral-900">
            {t("onboarding.title")}
          </h1>
          <p className="text-neutral-500 mt-2">{t("onboarding.subtitle")}</p>
        </header>

        <form className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {t("onboarding.age")}
            </label>
            <input
              type="number"
              {...register("age", { valueAsNumber: true })}
              placeholder={t("onboarding.placeholders.age")}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-brand-accent transition-all"
            />
            {errors.age && (
              <p className="text-red-500 text-xs mt-1">
                {t(errors.age.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {t("onboarding.weight")} (kg)
            </label>
            <input
              type="number"
              step="0.1"
              {...register("weight", { valueAsNumber: true })}
              placeholder={t("onboarding.placeholders.weight")}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-brand-accent transition-all"
            />
            {errors.weight && (
              <p className="text-red-500 text-xs mt-1">
                {t(errors.weight.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {t("onboarding.height")} (cm)
            </label>
            <input
              type="number"
              {...register("height", { valueAsNumber: true })}
              placeholder={t("onboarding.placeholders.height")}
              className="w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-brand-accent transition-all"
            />
            {errors.height && (
              <p className="text-red-500 text-xs mt-1">
                {t(errors.height.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {t("onboarding.gender")}
            </label>
            <select
              {...register("gender")}
              className="cursor-pointer w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-brand-accent transition-all"
            >
              <option value="">{t("onboarding.select_placeholder")}</option>
              <option value="male">{t("onboarding.gender_options.male")}</option>
              <option value="female">{t("onboarding.gender_options.female")}</option>
              <option value="other">{t("onboarding.gender_options.other")}</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-xs mt-1">
                {t(errors.gender.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-accent mb-1">
              {t("onboarding.goal")}
            </label>
            <select
              {...register("goal")}
              className="cursor-pointer w-full p-2.5 bg-neutral-50 border border-brand-accent/50 rounded-lg outline-none focus:border-brand-accent text-brand-accent transition-all"
            >
              <option value="">{t("onboarding.select_placeholder")}</option>
              <option value="bulk">{t("onboarding.goal_options.bulk")}</option>
              <option value="cut">{t("onboarding.goal_options.cut")}</option>
              <option value="maintain">{t("onboarding.goal_options.maintain")}</option>
            </select>
            {errors.goal && (
              <p className="text-red-500 text-xs mt-1">
                {t(errors.goal.message)}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              {t("onboarding.activity_level.title")}
            </label>
            <select
              {...register("activityLevel")}
              className="cursor-pointer w-full p-2.5 bg-neutral-50 border border-neutral-300 rounded-lg outline-none focus:border-brand-accent transition-all"
            >
              <option value="">{t("onboarding.select_placeholder")}</option>
              <option value="sedentary">{t("onboarding.activity_level.options.sedentary")}</option>
              <option value="light">{t("onboarding.activity_level.options.light")}</option>
              <option value="moderate">{t("onboarding.activity_level.options.moderate")}</option>
              <option value="active">{t("onboarding.activity_level.options.active")}</option>
              <option value="intense">{t("onboarding.activity_level.options.intense")}</option>
            </select>
            <p className="text-xs text-neutral-400 mt-1">
              {t("onboarding.activity_level.helper")}
            </p>
            {errors.activityLevel && (
              <p className="text-red-500 text-xs mt-1">
                {t(errors.activityLevel.message)}
              </p>
            )}
          </div>

          <div className="flex items-center flex-col gap-3 mt-4 px-4">
            <button
              type="button"
              onClick={handleGoToReview}
              disabled={isLoading}
              className="w-full bg-brand-accent hover:bg-brand-accent/90 text-white p-3 rounded-xl font-bold transition-colors shadow-lg shadow-brand-accent/20 cursor-pointer"
            >
              {isLoading ? t("onboarding.loading") : t("onboarding.calculate_button")}
            </button>

            <button
              type="button"
              onClick={() => logout()}
              className="text-neutral-400 text-sm hover:text-red-500 transition-colors py-2 cursor-pointer"
            >
              {t("onboarding.logout_button")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}