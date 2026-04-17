import React, { useMemo, useState } from "react";
import { Pencil, Save, Search, Trash2, X } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useSettingsStore } from "../../store/settingsStore";
import type { BackendFood } from "../../types/food";
import type { BackendMeal } from "../../types/meal";
import MeasurementSelector from "./MeasurementSelector";

interface MealEditorModalProps {
  meal?: BackendMeal | null;
  onClose: () => void;
}

const getFoodName = (food: BackendFood, lang: "br" | "en" | "es") =>
  (lang === "br" ? food.brName : lang === "es" ? food.esName : food.enName) ||
  food.brName;

const MealEditorModal: React.FC<MealEditorModalProps> = ({ meal, onClose }) => {
  useBodyScrollLock(true);
  const { lang, t } = useSettingsStore();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [selectedFood, setSelectedFood] = useState<BackendFood | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: meal?.name || "",
    description: meal?.description || "",
    isPublic: meal?.isPublic ?? true,
  });
  const [items, setItems] = useState(
    (meal?.items || []).map((item) => ({
      foodId: item.foodId,
      quantity: item.quantity,
      food: item.food,
    })),
  );

  const { data: searchResults } = useQuery({
    queryKey: ["meal-editor-foods", search],
    queryFn: async () => {
      const { data } = await api.get(
        `/foods?search=${encodeURIComponent(search || "")}&take=20`,
      );
      return data as BackendFood[];
    },
  });

  const summary = useMemo(
    () =>
      items.reduce(
        (acc, item) => ({
          kcal: acc.kcal + ((item.food.kcal || 0) * item.quantity) / 100,
          protein:
            acc.protein + ((item.food.protein || 0) * item.quantity) / 100,
        }),
        { kcal: 0, protein: 0 },
      ),
    [items],
  );

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        name: form.name,
        description: form.description || null,
        isPublic: form.isPublic,
        items: items.map((item) => ({
          foodId: item.foodId,
          quantity: item.quantity,
        })),
      };

      if (meal?.id) {
        const { data } = await api.patch(`/meals/${meal.id}`, payload);
        return data;
      }

      const { data } = await api.post("/meals", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal-search"] });
      queryClient.invalidateQueries({ queryKey: ["meals-library"] });
      onClose();
    },
  });

  return (
    <>
      <div
        className="fixed inset-0 z-130 flex items-center justify-center bg-black/80 p-4"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-4xl bg-neutral-950 border border-white/10 p-6 sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-black text-white">
                {meal ? t("meals.editor.edit_meal") : t("meals.editor.new_meal")}
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
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                {t("meals.editor.name")}
              </span>
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((current) => ({ ...current, name: event.target.value }))
                }
                className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-brand-accent"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-neutral-500">
                {t("meals.editor.description")}
              </span>
              <input
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                className="w-full rounded-2xl border border-white/10 bg-neutral-900 px-4 py-3 text-white outline-none focus:border-brand-accent"
              />
            </label>
          </div>

          <label className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-neutral-900 px-4 py-4 text-white">
            <span>{t("meals.editor.public_toggle")}</span>
            <input
              type="checkbox"
              checked={form.isPublic}
              onChange={(event) =>
                setForm((current) => ({ ...current, isPublic: event.target.checked }))
              }
              className="h-5 w-5 accent-brand-accent"
            />
          </label>

          <div className="mt-8 rounded-4xl border border-white/10 bg-neutral-900/50 p-5">
            <div className="flex items-center gap-3">
              <Search size={18} className="text-neutral-500" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={t("meals.editor.search_foods")}
                className="w-full bg-transparent text-white outline-none"
              />
            </div>
            {searchResults?.length ? (
              <div className="mt-4 grid gap-2">
                {searchResults.map((food) => (
                  <button
                    key={food.id}
                    onClick={() => {
                      setSelectedFood(food);
                      setEditingIndex(null);
                    }}
                    className="cursor-pointer rounded-2xl border border-white/10 bg-neutral-950 px-4 py-3 text-left text-white hover:border-brand-accent"
                  >
                    <div className="font-bold">{getFoodName(food, lang)}</div>
                    <div className="text-xs text-neutral-500">
                      {Math.round(food.kcal)} kcal • {food.protein}g
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="mt-8 rounded-4xl border border-white/10 bg-neutral-900/50 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-white font-black">{t("meals.editor.meal_items")}</p>
                <p className="text-sm text-neutral-500">
                  {Math.round(summary.kcal)} kcal • {summary.protein.toFixed(1)}g
                </p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-white/10 p-4 text-sm text-neutral-500">
                {t("meals.editor.empty_items")}
              </div>
            ) : (
              <div className="mt-4 grid gap-3">
                {items.map((item, index) => (
                  <div
                    key={`${item.foodId}-${index}`}
                    className="rounded-2xl border border-white/10 bg-neutral-950 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-white">
                          {getFoodName(item.food, lang)}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {Math.round(item.quantity)}g
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedFood(item.food);
                            setEditingIndex(index);
                          }}
                          className="cursor-pointer rounded-2xl bg-neutral-900 p-3 text-brand-accent"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() =>
                            setItems((current) =>
                              current.filter((_, currentIndex) => currentIndex !== index),
                            )
                          }
                          className="cursor-pointer rounded-2xl bg-neutral-900 p-3 text-red-400"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
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

      {selectedFood ? (
        <MeasurementSelector
          foodName={getFoodName(selectedFood, lang)}
          selectedItem={selectedFood}
          confirmLabel={t("meals.editor.add_food")}
          onClose={() => {
            setSelectedFood(null);
            setEditingIndex(null);
          }}
          onConfirm={(data) => {
            setItems((current) => {
              if (editingIndex !== null) {
                return current.map((item, index) =>
                  index === editingIndex
                    ? { ...item, quantity: data.quantity, food: selectedFood }
                    : item,
                );
              }

              return [
                ...current,
                {
                  foodId: selectedFood.id,
                  quantity: data.quantity,
                  food: selectedFood,
                },
              ];
            });
            setSelectedFood(null);
            setEditingIndex(null);
          }}
        />
      ) : null}
    </>
  );
};

export default MealEditorModal;
