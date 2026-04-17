import React, { useEffect, useMemo, useState } from "react";
import { useSettingsStore, type WeightUnit } from "../../store/settingsStore";
import type { Language, TranslationKeys } from "../../types/i18n";
import { Globe, Save } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PreferenceSelect from "./PreferenceSelect";
import { useAccountUnsavedChanges } from "./AccountUnsavedChangesContext";
import { useAuthStore } from "../../store/authStore";
import { api } from "../../services/api";

const Preferences: React.FC = () => {
  const { lang, setLang, t, setWeightUnit, weightUnit } = useSettingsStore();
  const { setHasUnsavedChanges } = useAccountUnsavedChanges();
  const { user, updateProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const [draftLang, setDraftLang] = useState(lang);
  const [draftWeightUnit, setDraftWeightUnit] = useState(weightUnit);

  useEffect(() => {
    setDraftLang(lang);
    setDraftWeightUnit(weightUnit);
  }, [lang, weightUnit]);

  const isDirty = useMemo(
    () => draftLang !== lang || draftWeightUnit !== weightUnit,
    [draftLang, draftWeightUnit, lang, weightUnit],
  );

  useEffect(() => {
    setHasUnsavedChanges(isDirty);
    return () => setHasUnsavedChanges(false);
  }, [isDirty, setHasUnsavedChanges]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) return null;
      const response = await api.patch(`/users/${user.id}`, {
        language: draftLang,
      });
      return response.data;
    },
    onSuccess: (data) => {
      setLang(draftLang);
      setWeightUnit(draftWeightUnit);
      if (data) {
        updateProfile(data);
      }
      queryClient.invalidateQueries({ queryKey: ["me"] });
      setHasUnsavedChanges(false);
    },
  });

  const preferences: {
    title: TranslationKeys;
    subtitle: TranslationKeys;
    options: { label: string; value: string }[];
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  }[] = [
      {
        title: "account.preferences.language.title",
        subtitle: "account.preferences.language.subtitle",
        options: [
          { label: t("account.preferences.language.options.en"), value: "en" },
          { label: t("account.preferences.language.options.br"), value: "br" },
          { label: t("account.preferences.language.options.es"), value: "es" },
        ],
        value: draftLang,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
          setDraftLang(e.target.value as Language),
      },
      {
        title: "account.preferences.weight_unit.title",
        subtitle: "account.preferences.weight_unit.subtitle",
        options: [
          { label: "KG", value: "kg" },
          { label: "LBS", value: "lbs" },
        ],
        value: draftWeightUnit,
        onChange: (e: React.ChangeEvent<HTMLSelectElement>) =>
          setDraftWeightUnit(e.target.value as WeightUnit),
      },
    ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t("account.preferences.title")}</h2>
        <Globe className="text-neutral-300" size={30} />
      </div>
      <div className="space-y-4">
        {preferences.map((preference) => (
          <PreferenceSelect key={preference.title} {...preference} />
        ))}
        <button
          type="button"
          onClick={() => {
            saveMutation.mutate();
          }}
          disabled={!isDirty || saveMutation.isPending}
          className="flex w-fit items-center gap-2 rounded-xl bg-neutral-900 px-8 py-3 font-bold text-white transition-all enabled:hover:bg-brand-accent disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
        >
          <Save
            size={18}
            className="group-enabled:group-hover:scale-110 transition-transform"
          />
          {saveMutation.isPending
            ? t("account.preferences.saving")
            : t("account.save_updates")}
        </button>
      </div>
    </div>
  );
};

export default Preferences;
