import React, { useEffect, useMemo, useState } from "react";
import type { User } from "../../types/auth";
import { Camera, Save, User as UserIcon } from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useAccountUnsavedChanges } from "./AccountUnsavedChangesContext";

type ActivityLevel = "sedentary" | "light" | "moderate" | "active" | "intense";
type Gender = "male" | "female" | "other";
type Goal = "bulk" | "cut" | "maintain";

type ProfileFormState = {
  name: string;
  age: string;
  weight: string;
  height: string;
  gender: Gender;
  goal: Goal;
  activityLevel: ActivityLevel;
  avatar: string;
};

const buildFormState = (user: User): ProfileFormState => ({
  name: user?.name || "",
  age: String(user?.age || ""),
  weight: String(user?.weight || ""),
  height: String(user?.height || ""),
  gender: (user?.gender as Gender) || "other",
  goal: (user?.goal as Goal) || "maintain",
  activityLevel: (user?.activityLevel as ActivityLevel) || "moderate",
  avatar: user?.avatar || "",
});

const Profile: React.FC<{ user: User }> = ({ user }) => {
  const { t } = useSettingsStore();
  const { updateProfile } = useAuthStore();
  const { setHasUnsavedChanges, hasUnsavedChanges } = useAccountUnsavedChanges();
  const queryClient = useQueryClient();
  const [form, setForm] = useState<ProfileFormState>(buildFormState(user));

  const activityOptions: Array<{ value: ActivityLevel; label: string }> = [
    { value: "sedentary", label: t("onboarding.activity_level.options.sedentary") },
    { value: "light", label: t("onboarding.activity_level.options.light") },
    { value: "moderate", label: t("onboarding.activity_level.options.moderate") },
    { value: "active", label: t("onboarding.activity_level.options.active") },
    { value: "intense", label: t("onboarding.activity_level.options.intense") },
  ];

  useEffect(() => {
    setForm(buildFormState(user));
  }, [user]);

  useEffect(() => {
    const initial = buildFormState(user);
    const isDirty = JSON.stringify(form) !== JSON.stringify(initial);
    setHasUnsavedChanges(isDirty);
    return () => setHasUnsavedChanges(false);
  }, [form, setHasUnsavedChanges, user]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.patch(`/users/${user.id}`, {
        name: form.name,
        age: Number(form.age),
        weight: Number(form.weight),
        height: Number(form.height),
        gender: form.gender,
        goal: form.goal,
        activityLevel: form.activityLevel,
        avatar: form.avatar,
        recalculateGoals: true,
      });
      return data;
    },
    onSuccess: (data) => {
      updateProfile(data);
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setHasUnsavedChanges(false);
    },
  });

  const previewAvatar = useMemo(() => {
    if (form.avatar) return form.avatar;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      user?.name || t("account.profile.unknown_user"),
    )}&background=random`;
  }, [form.avatar, t, user?.name]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("account.profile.title")}</h2>
        <UserIcon className="text-neutral-300" size={30} />
      </div>

      <section className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-8 pb-8 border-b border-neutral-100">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-white shadow-xl">
            <img
              src={previewAvatar}
              alt={t("account.profile.title")}
              className="w-full h-full object-cover"
            />
          </div>
          <label className="absolute bottom-0 right-0 p-2 bg-brand-accent text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer">
            <Camera size={14} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                const reader = new FileReader();
                reader.onload = () => {
                  setForm((current) => ({
                    ...current,
                    avatar: String(reader.result || ""),
                  }));
                };
                reader.readAsDataURL(file);
              }}
            />
          </label>
        </div>
        <div>
          <h3 className="text-lg font-bold">
            {user?.name || t("account.profile.unknown_user")}
          </h3>
          <p className="text-neutral-500 text-sm mb-4">{user?.email}</p>
          <p className="text-sm text-neutral-500">
            {t("account.profile.warning_recalculate")}
          </p>
        </div>
      </section>

      <div className="grid gap-6 max-w-3xl md:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("account.profile.name")}
          </label>
          <input
            type="text"
            value={form.name}
            maxLength={30}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
            onBlur={(event) => setForm((current) => ({ ...current, name: event.target.value.trim() }))}
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("account.profile.age")}
          </label>
          <input
            type="number"
            value={form.age}
            onChange={(event) =>
              setForm((current) => ({ ...current, age: event.target.value }))
            }
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("account.profile.weight")}
          </label>
          <input
            type="number"
            value={form.weight}
            onChange={(event) =>
              setForm((current) => ({ ...current, weight: event.target.value }))
            }
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("account.profile.height")}
          </label>
          <input
            type="number"
            value={form.height}
            onChange={(event) =>
              setForm((current) => ({ ...current, height: event.target.value }))
            }
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("account.profile.gender")}
          </label>
          <select
            value={form.gender}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                gender: event.target.value as Gender,
              }))
            }
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
          >
            <option value="male">{t("onboarding.gender_options.male")}</option>
            <option value="female">{t("onboarding.gender_options.female")}</option>
            <option value="other">{t("onboarding.gender_options.other")}</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("account.profile.goal")}
          </label>
          <select
            value={form.goal}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                goal: event.target.value as Goal,
              }))
            }
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
          >
            <option value="bulk">{t("onboarding.goal_options.bulk")}</option>
            <option value="cut">{t("onboarding.goal_options.cut")}</option>
            <option value="maintain">{t("onboarding.goal_options.maintain")}</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            {t("account.profile.activity_level")}
          </label>
          <select
            value={form.activityLevel}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                activityLevel: event.target.value as ActivityLevel,
              }))
            }
            className="w-full px-4 py-2 rounded-xl border border-neutral-200 bg-white/50 focus:border-brand-accent outline-none transition-all"
          >
            {activityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => saveMutation.mutate()}
        disabled={saveMutation.isPending || !hasUnsavedChanges}
        className="w-fit mt-8 px-8 py-3 bg-neutral-900 disabled:opacity-50 text-white rounded-xl font-bold enabled:hover:bg-brand-accent transition-all enabled:cursor-pointer disabled:cursor-not-allowed flex items-center gap-2 group"
      >
        <Save
          size={18}
          className="group-enabled:group-hover:scale-110 transition-transform"
        />
        {saveMutation.isPending
          ? t("account.profile.saving")
          : t("account.save_updates")}
      </button>
    </div>
  );
};

export default Profile;
