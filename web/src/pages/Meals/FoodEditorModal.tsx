import React, { useMemo, useState } from "react";
import { Save, X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useSettingsStore } from "../../store/settingsStore";
import type { BackendFood } from "../../types/food";

const categories = [
  "beverage",
  "fast_food",
  "dessert",
  "fruit",
  "side_dish",
  "protein",
  "powders_flours",
  "vegetables_greens",
  "sauces_condiments",
  "dairy",
  "snack",
] as const;

interface FoodEditorModalProps {
  food?: BackendFood | null;
  onClose: () => void;
}

const FoodEditorModal: React.FC<FoodEditorModalProps> = ({ food, onClose }) => {
  useBodyScrollLock(true);
  const { t } = useSettingsStore();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    brName: food?.brName || "",
    enName: food?.enName || "",
    esName: food?.esName || "",
    brandName: food?.brandName || "",
    kcal: String(food?.kcal ?? 0),
    protein: String(food?.protein ?? 0),
    carbs: String(food?.carbs ?? 0),
    fat: String(food?.fat ?? 0),
    fiber: String(food?.fiber ?? 0),
    sodium: String(food?.sodium ?? 0),
    sugar: String(food?.sugar ?? 0),
    category: food?.category || "snack",
    density: String(food?.density ?? 1),
    unitWeight: String(food?.allowedMeasures?.unit ?? 100),
    useML: Boolean(food?.useML),
    isPublic: food?.isPublic ?? true,
  });

  const payload = useMemo(
    () => ({
      brandName: form.brandName,
      brName: form.brName,
      enName: form.enName || form.brName,
      esName: form.esName || form.brName,
      kcal: Number(form.kcal),
      protein: Number(form.protein),
      carbs: Number(form.carbs),
      fat: Number(form.fat),
      fiber: Number(form.fiber),
      sodium: Number(form.sodium),
      sugar: Number(form.sugar),
      allowedMeasures: {
        metric: 1,
        unit: Number(form.unitWeight) || 100,
      },
      category: form.category,
      useML: form.useML,
      density: Number(form.density) || 1,
      source: "USER",
      isPublic: form.isPublic,
    }),
    [form],
  );

  const mutation = useMutation({
    mutationFn: async () => {
      if (food?.id) {
        const { data } = await api.patch(`/foods/${food.id}`, payload);
        return data;
      }

      const { data } = await api.post("/foods", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-search"] });
      queryClient.invalidateQueries({ queryKey: ["foods-library"] });
      onClose();
    },
  });

  const updateField = (key: keyof typeof form, value: string | boolean) =>
    setForm((current) => ({ ...current, [key]: value }));

  return (
    <div
      className="fixed inset-0 z-130 flex items-center justify-center bg-black/80 p-4"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-4xl bg-neutral-950 border border-white/10 p-6 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-black text-white">
              {food ? t("meals.editor.edit_food") : t("meals.editor.new_food")}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="cursor-pointer rounded-2xl bg-neutral-900 p-3 text-neutral-400 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {[
            ["brName", t("meals.editor.name")],
            ["enName", t("meals.editor.english_name")],
            ["esName", t("meals.editor.spanish_name")],
            ["brandName", t("meals.editor.brand")],
            ["kcal", t("meals.editor.calories")],
            ["protein", t("meals.editor.protein")],
            ["carbs", t("meals.editor.carbs")],
            ["fat", t("meals.editor.fat")],
            ["fiber", t("meals.editor.fiber")],
            ["sodium", t("meals.editor.sodium")],
            ["sugar", t("meals.editor.sugar")],
            ["density", t("meals.editor.density")],
            ["unitWeight", t("meals.editor.quantity")],
          ].map(([key, label]) => (
            <label key={key} className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                {label}
              </span>
              <input
                value={String(form[key as keyof typeof form])}
                onChange={(event) =>
                  updateField(key as keyof typeof form, event.target.value)
                }
                className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-brand-accent"
              />
            </label>
          ))}

          <label className="space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
              {t("meals.editor.category")}
            </span>
            <select
              value={form.category}
              onChange={(event) => updateField("category", event.target.value)}
              className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-brand-accent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-900 px-4 py-4 text-white">
            <span>{t("meals.editor.uses_ml")}</span>
            <input
              type="checkbox"
              checked={form.useML}
              onChange={(event) => updateField("useML", event.target.checked)}
              className="h-5 w-5 accent-brand-accent"
            />
          </label>
          <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-900 px-4 py-4 text-white">
            <span>{t("meals.editor.public_toggle")}</span>
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(event) => updateField("isPublic", event.target.checked)}
              className="h-5 w-5 accent-brand-accent"
            />
          </label>
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-2xl border border-white/10 px-5 py-3 text-sm font-bold text-white"
          >
            {t("meals.editor.cancel")}
          </button>
          <button
            onClick={() => mutation.mutate()}
            className="cursor-pointer rounded-2xl bg-brand-accent px-5 py-3 text-sm font-black text-black inline-flex items-center gap-2"
          >
            <Save size={16} />
            {t("meals.editor.save")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FoodEditorModal;
