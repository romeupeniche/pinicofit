import React from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import type { BackendFood } from "../../types/food";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useSettingsStore } from "../../store/settingsStore";
import CustomLoadingSpinner from "../../components/CustomLoadingSpinner";

interface DailyMealLog {
  id: string;
  quantity: number;
  measure: string;
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
  food: BackendFood;
}

interface MealBucketModalProps {
  title: string;
  logs: DailyMealLog[];
  onClose: () => void;
  onEdit: (log: DailyMealLog) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  deletingId?: string | null;
}

const MealBucketModal: React.FC<MealBucketModalProps> = ({
  title,
  logs,
  onClose,
  onEdit,
  onDelete,
  onAdd,
  deletingId,
}) => {
  useBodyScrollLock(true);
  const { lang, t } = useSettingsStore();
  const getName = (food: BackendFood) =>
    (lang === "br" ? food.brName : lang === "es" ? food.esName : food.enName) ||
    food.brName;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-4 sm:items-center"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-2xl rounded-4xl bg-white p-6 shadow-2xl max-h-[85vh] overflow-y-auto overscroll-contain">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-400">
              {t("meals.bucket_modal.meal_label")}
            </p>
            <h2 className="mt-2 text-2xl font-black text-neutral-900">{title}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onAdd}
              className="rounded-2xl bg-neutral-900 px-4 py-3 text-white cursor-pointer flex items-center gap-2"
            >
              <Plus size={16} />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                {t("meals.bucket_modal.add")}
              </span>
            </button>
            <button
              onClick={onClose}
              className="rounded-2xl bg-neutral-100 p-3 text-neutral-500 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {logs.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-neutral-200 bg-neutral-50 p-6 text-sm text-neutral-500">
              {t("meals.bucket_modal.empty")}
            </div>
          ) : (
            logs.map((log) => (
              <div
                key={log.id}
                className="rounded-3xl border border-neutral-200 bg-neutral-50 px-4 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-neutral-900">
                      {getName(log.food)}
                    </p>
                    <p className="mt-1 text-sm text-neutral-500">
                      {t("meals.bucket_modal.amount_and_kcal", {
                        amount: String(Math.round(log.quantity)),
                        kcal: String(log.kcal),
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onEdit(log)}
                      className="rounded-2xl bg-white p-3 text-brand-accent cursor-pointer"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(log.id)}
                      disabled={deletingId === log.id}
                      className="rounded-2xl bg-white p-3 text-red-500 cursor-pointer"
                    >
                      {deletingId === log.id ? (
                        <CustomLoadingSpinner className="w-4 h-4 text-zinc-400" />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MealBucketModal;
