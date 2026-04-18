import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ChevronUp,
  Globe,
  Pencil,
  Plus,
  Search,
  Star,
  TableProperties,
  Trash2,
  User,
  X,
} from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../services/api";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSettingsStore } from "../../store/settingsStore";
import type { BackendFood } from "../../types/food";
import type { BackendMeal } from "../../types/meal";
import { getLocalDateKey } from "../../utils/date";
import FoodResultItem from "./FoodResultItem";
import FoodEditorModal from "./FoodEditorModal";
import MealEditorModal from "./MealEditorModal";
import MeasurementSelector from "./MeasurementSelector";
import SourceFilter from "./SourceFilter";
import CustomLoadingSpinner from "../../components/CustomLoadingSpinner";

interface AddModalProps {
  onClose: () => void;
  targetDate?: string;
  onLogged?: () => void;
}

type ActiveType = "food" | "meal";
type FoodTab = "global" | "TACO" | "PINICODB" | "USER";
type MealTab = "global" | "USER";

const SEARCH_BATCH_SIZE = 120;

const normalizeSearchValue = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/,/g, " ")
    .toLowerCase()
    .trim();

const getFoodSearchNames = (food: BackendFood, lang: string) => {
  const localizedKey = `${lang}Name` as keyof BackendFood;
  const localizedName = (food[localizedKey] as string) || food.brName;

  return [localizedName, food.brName, food.enName, food.esName, food.brandName || ""]
    .filter(Boolean)
    .map(normalizeSearchValue);
};

const getFoodSearchRank = (food: BackendFood, term: string, lang: string) => {
  const searchableNames = getFoodSearchNames(food, lang);

  if (searchableNames.some((name) => name === term)) return 0;
  if (searchableNames.some((name) => name.startsWith(term))) return 1;
  if (searchableNames.some((name) => name.split(/\s+/).includes(term))) return 2;
  if (searchableNames.some((name) => name.includes(term))) return 3;

  return 4;
};

const sortFoods = (foods: BackendFood[], searchTerm: string, lang: string) => {
  if (!searchTerm.trim()) return foods;
  const term = normalizeSearchValue(searchTerm);
  return [...foods].sort((a, b) => {
    const rankA = getFoodSearchRank(a, term, lang);
    const rankB = getFoodSearchRank(b, term, lang);
    if (rankA !== rankB) return rankA - rankB;
    const primaryNameA = getFoodSearchNames(a, lang)[0] || "";
    const primaryNameB = getFoodSearchNames(b, lang)[0] || "";
    return primaryNameA.localeCompare(primaryNameB);
  });
};

const getMealSubtitle = (meal: BackendMeal) => {
  const kcal = Math.round(
    (meal.items || []).reduce(
      (sum, item) => sum + ((item.food?.kcal || 0) * Number(item.quantity || 0)) / 100,
      0,
    ),
  );
  return `${kcal} kcal • ${(meal.items || []).length} items`;
};

const AddModal: React.FC<AddModalProps> = ({ onClose, targetDate, onLogged }) => {
  useBodyScrollLock(true);
  const { lang, t } = useSettingsStore();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeType, setActiveType] = useState<ActiveType>("food");
  const [currentTab, setCurrentTab] = useState<FoodTab | MealTab>("global");
  const [page, setPage] = useState(0);
  const [items, setItems] = useState<Array<BackendFood | BackendMeal>>([]);
  const [selectedFood, setSelectedFood] = useState<BackendFood | null>(null);
  const [editingFood, setEditingFood] = useState<BackendFood | null>(null);
  const [editingMeal, setEditingMeal] = useState<BackendMeal | null>(null);
  const [showFoodEditor, setShowFoodEditor] = useState(false);
  const [showMealEditor, setShowMealEditor] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({
    created: true,
    saved: true,
  });
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const todayKey = getLocalDateKey();
  const targetDateKey = targetDate ? getLocalDateKey(new Date(targetDate)) : todayKey;

  const applyFavoriteState = (
    id: string,
    type: ActiveType,
    nextFavorite: boolean,
  ) => {
    setItems((current) =>
      current.map((entry) =>
        entry.id === id ? { ...entry, isFavorite: nextFavorite } : entry,
      ),
    );

    queryClient.setQueryData(
      [`${type}s-library`, type],
      (current:
        | {
          created: Array<BackendFood | BackendMeal>;
          favorites: Array<BackendFood | BackendMeal>;
        }
        | undefined) => {
        if (!current) return current;

        const created = current.created.map((entry) =>
          entry.id === id ? { ...entry, isFavorite: nextFavorite } : entry,
        );
        const allEntries = [...current.created, ...current.favorites];
        const targetEntry = allEntries.find((entry) => entry.id === id);
        const nextFavoritesBase = current.favorites.filter((entry) => entry.id !== id);

        const favorites =
          nextFavorite && targetEntry
            ? [{ ...targetEntry, isFavorite: true }, ...nextFavoritesBase]
            : nextFavoritesBase;

        return { created, favorites };
      },
    );
  };

  const foodTabs = useMemo(
    () => [
      {
        id: "global" as const,
        label: t("meals.modal.global"),
        icon: Globe,
      },
      {
        id: "TACO" as const,
        label: t("meals.modal.taco"),
        icon: TableProperties,
      },
      {
        id: "PINICODB" as const,
        label: t("meals.modal.database"),
        icon: BookOpen,
      },
      {
        id: "USER" as const,
        label: t("meals.modal.my_items"),
        icon: User,
      },
    ],
    [t],
  );

  const mealTabs = useMemo(
    () => [
      {
        id: "global" as const,
        label: t("meals.modal.global"),
        icon: Globe,
      },
      {
        id: "USER" as const,
        label: t("meals.modal.my_items"),
        icon: User,
      },
    ],
    [t],
  );

  const libraryQuery = useQuery({
    queryKey: [`${activeType}s-library`, activeType],
    queryFn: async () => {
      const endpoint = activeType === "food" ? "/foods/library" : "/meals/library";
      const { data } = await api.get(endpoint);
      return data as {
        created: Array<BackendFood | BackendMeal>;
        favorites: Array<BackendFood | BackendMeal>;
      };
    },
  });

  useEffect(() => {
    setItems([]);
    setPage(0);
    setHasMore(true);
    if (scrollContainerRef.current) scrollContainerRef.current.scrollTop = 0;
  }, [searchTerm, currentTab, activeType]);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      if (currentTab === "USER") return;
      if (searchTerm.length > 0 && searchTerm.length < 2) {
        setItems([]);
        setHasMore(false);
        return;
      }

      setLoading(true);

      try {
        if (activeType === "food") {
          const { data } = await api.get("/foods", {
            params: {
              skip: searchTerm.trim() ? 0 : page * 30,
              take: searchTerm.trim() ? SEARCH_BATCH_SIZE : 30,
              search: searchTerm.trim() || undefined,
              source: currentTab !== "global" ? currentTab : undefined,
            },
          });

          const sortedData = sortFoods(data as BackendFood[], searchTerm, lang);
          if (!cancelled) {
            setItems((previous) =>
              page === 0 || searchTerm.trim() ? sortedData : [...previous, ...sortedData],
            );
            setHasMore(sortedData.length >= (searchTerm.trim() ? SEARCH_BATCH_SIZE : 30));
          }
        } else {
          const { data } = await api.get("/meals", {
            params: {
              search: searchTerm.trim() || undefined,
              source: currentTab !== "global" ? currentTab : undefined,
            },
          });

          if (!cancelled) {
            setItems(data as BackendMeal[]);
            setHasMore(false);
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void run();

    return () => {
      cancelled = true;
    };
  }, [activeType, currentTab, lang, page, searchTerm]);

  const toggleFoodFavorite = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/foods/${id}/favorite`);
      return data;
    },
    onMutate: async (id: string) => {
      const target =
        items.find((entry) => entry.id === id) ||
        library.created.find((entry) => entry.id === id) ||
        library.favorites.find((entry) => entry.id === id);
      const previousFavorite = Boolean(target?.isFavorite);
      applyFavoriteState(id, "food", !previousFavorite);
      return { previousFavorite };
    },
    onError: (_error, id, context) => {
      applyFavoriteState(id, "food", Boolean(context?.previousFavorite));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["foods-library", "food"] });
      libraryQuery.refetch();
    },
  });

  const toggleMealFavorite = useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.post(`/meals/${id}/favorite`);
      return data;
    },
    onMutate: async (id: string) => {
      const target =
        items.find((entry) => entry.id === id) ||
        library.created.find((entry) => entry.id === id) ||
        library.favorites.find((entry) => entry.id === id);
      const previousFavorite = Boolean(target?.isFavorite);
      applyFavoriteState(id, "meal", !previousFavorite);
      return { previousFavorite };
    },
    onError: (_error, id, context) => {
      applyFavoriteState(id, "meal", Boolean(context?.previousFavorite));
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["meals-library", "meal"] });
      libraryQuery.refetch();
    },
  });

  const deleteFoodMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/foods/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["foods-library"] });
      libraryQuery.refetch();
    },
  });

  const deleteMealMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meals/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals-library"] });
      libraryQuery.refetch();
    },
  });

  const logFoodMutation = useMutation({
    mutationFn: async (payload: {
      foodId: string;
      quantity: number;
      measure: string;
      kcal: number;
      protein: number;
      carbs: number;
      fat: number;
      date?: string;
      optimisticFood?: BackendFood;
    }) => {
      const { optimisticFood, ...requestPayload } = payload;
      const { data } = await api.post("/meals/log", requestPayload);
      return data;
    },
    onMutate: async (payload) => {
      const dateKey = payload.date ? getLocalDateKey(new Date(payload.date)) : todayKey;
      await queryClient.cancelQueries({ queryKey: ["meals-log", dateKey] });
      const previousLogs =
        queryClient.getQueryData<any[]>(["meals-log", dateKey]) || [];
      const food = payload.optimisticFood;

      if (food) {
        queryClient.setQueryData<any[]>(["meals-log", dateKey], (current = []) => [
          {
            id: `optimistic-${Date.now()}`,
            quantity: payload.quantity,
            measure: payload.measure,
            kcal: payload.kcal,
            protein: payload.protein,
            carbs: payload.carbs,
            fat: payload.fat,
            date: payload.date || `${dateKey}T12:00:00`,
            food,
          },
          ...current,
        ]);
      }

      return { previousLogs, dateKey };
    },
    onError: (_error, _payload, context) => {
      if (context?.dateKey) {
        queryClient.setQueryData(
          ["meals-log", context.dateKey],
          context.previousLogs || [],
        );
      }
    },
    onSuccess: (_data, payload) => {
      const dateKey = payload.date ? getLocalDateKey(new Date(payload.date)) : todayKey;
      queryClient.invalidateQueries({ queryKey: ["meals-log", dateKey] });
      onLogged?.();
      setSelectedFood(null);
      onClose();
    },
  });

  const logMealMutation = useMutation({
    mutationFn: async (mealId: string) => {
      const { data } = await api.post(`/meals/${mealId}/log`, {
        date: targetDate,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals-log", targetDateKey] });
      onLogged?.();
      onClose();
    },
  });

  const handleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    if (currentTab === "USER" || activeType === "meal") return;
    const { scrollTop, scrollHeight, clientHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight + 150 && !loading && hasMore) {
      setPage((current) => current + 1);
    }
  };

  const getFoodName = (food: BackendFood) =>
    (lang === "br" ? food.brName : lang === "es" ? food.esName : food.enName) ||
    food.brName;

  const searchPlaceholder =
    activeType === "food"
      ? t("meals.modal.search_placeholder_food")
      : t("meals.modal.search_placeholder_meal");

  const renderActionButtons = (
    item: BackendFood | BackendMeal,
    type: ActiveType,
    isCreated: boolean,
  ) => {
    const isFavorite = Boolean(item.isFavorite);
    const favoriteAction =
      type === "food"
        ? () => toggleFoodFavorite.mutate(item.id)
        : () => toggleMealFavorite.mutate(item.id);
    const deleteAction =
      type === "food"
        ? () => deleteFoodMutation.mutate(item.id)
        : () => deleteMealMutation.mutate(item.id);
    const editAction =
      type === "food"
        ? () => {
          setEditingFood(item as BackendFood);
          setShowFoodEditor(true);
        }
        : () => {
          setEditingMeal(item as BackendMeal);
          setShowMealEditor(true);
        };

    return (
      <>
        <button
          onClick={favoriteAction}
          aria-label={isFavorite ? t("meals.modal.unfavorite") : t("meals.modal.favorite")}
          className={`cursor-pointer rounded-2xl p-3 transition-colors ${isFavorite ? "bg-amber-500/20 text-amber-300" : "bg-neutral-800 text-neutral-400"
            }`}
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
        {isCreated ? (
          <>
            <button
              onClick={editAction}
              aria-label={t("meals.modal.edit")}
              className="cursor-pointer rounded-2xl bg-neutral-800 p-3 text-brand-accent"
            >
              <Pencil size={16} />
            </button>
            <button
              onClick={deleteAction}
              aria-label={t("meals.modal.delete")}
              className="cursor-pointer rounded-2xl bg-neutral-800 p-3 text-red-400"
            >
              <Trash2 size={16} />
            </button>
          </>
        ) : null}
      </>
    );
  };

  const library = libraryQuery.data || { created: [], favorites: [] };
  const tabs = activeType === "food" ? foodTabs : mealTabs;

  return (
    <>
      <div className="fixed inset-0 z-60 flex items-end justify-center">
        <div className="absolute w-full inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        <div className="bg-neutral-900 w-full max-w-xl rounded-t-[40px] px-8 pt-6 border-t border-white/10 z-70 h-[90lvh] flex flex-col overflow-hidden">
          <div className="w-12 h-1.5 bg-neutral-800 rounded-full mx-auto mb-6" />

          <div className="flex justify-between items-center mb-6 gap-4">
            <h2 className="text-2xl font-black text-white leading-none">
              {t("meals.modal.add_title")}
            </h2>

            <div className="flex bg-neutral-950 p-1 rounded-2xl border border-white/5 relative w-44">
              <div
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-brand-accent rounded-xl transition-all duration-300 ${activeType === "food" ? "left-1" : "left-[calc(50%)]"
                  }`}
              />
              {(["food", "meal"] as ActiveType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setActiveType(type);
                    setCurrentTab("global");
                  }}
                  className={`flex-1 py-2 z-10 text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer ${activeType === type ? "text-black" : "text-neutral-500"
                    }`}
                >
                  {type === "food" ? t("meals.modal.food") : t("meals.modal.meal")}
                </button>
              ))}
            </div>

            <button
              onClick={onClose}
              className="cursor-pointer bg-neutral-800 p-2 rounded-full hover:bg-red-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 h-full my-auto text-neutral-500" size={20} />
            <input
              className="w-full bg-neutral-950 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white font-medium focus:border-brand-accent/50 outline-none"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>

          <div className={`flex gap-2 mb-6 overflow-x-auto pb-2 ${isMobile ? "scrollbar-hide" : ""}`}>
            {tabs.map((tab) => (
              <SourceFilter
                key={tab.id}
                icon={<tab.icon size={14} />}
                label={tab.label}
                onClick={() => setCurrentTab(tab.id)}
                active={tab.id === currentTab}
              />
            ))}
            <button
              onClick={() => {
                if (activeType === "food") {
                  setEditingFood(null);
                  setShowFoodEditor(true);
                } else {
                  setEditingMeal(null);
                  setShowMealEditor(true);
                }
              }}
              className="cursor-pointer bg-brand-accent rounded-full w-8 h-8 shrink-0 flex items-center justify-center"
            >
              <Plus size={24} className="text-black" />
            </button>
          </div>

          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="space-y-3 mb-2 overflow-y-auto flex-1 pr-1 overscroll-contain"
          >
            {currentTab === "USER" ? (
              <>
                {[
                  {
                    key: "created" as const,
                    title:
                      activeType === "food"
                        ? t("meals.modal.created_foods")
                        : t("meals.modal.created_meals"),
                    items: library.created,
                    isCreated: true,
                  },
                  {
                    key: "saved" as const,
                    title:
                      activeType === "food"
                        ? t("meals.modal.favorite_foods")
                        : t("meals.modal.favorite_meals"),
                    items: library.favorites,
                    isCreated: false,
                  },
                ].map((section) => (
                  <div key={section.key} className="rounded-4xl border border-white/5 bg-neutral-950/60 p-4">
                    <button
                      onClick={() =>
                        setSectionsOpen((current) => ({
                          ...current,
                          [section.key]: !current[section.key],
                        }))
                      }
                      className="cursor-pointer w-full flex items-center justify-between"
                    >
                      <span className="text-[11px] font-black uppercase tracking-[0.2em] text-neutral-400">
                        {section.title}
                      </span>
                      {sectionsOpen[section.key] ? (
                        <ChevronUp size={16} className="text-neutral-500" />
                      ) : (
                        <ChevronDown size={16} className="text-neutral-500" />
                      )}
                    </button>

                    {sectionsOpen[section.key] ? (
                      <div className="mt-4 space-y-3">
                        {section.items.length ? (
                          section.items.map((entry) =>
                            activeType === "food" ? (
                              <FoodResultItem
                                key={entry.id}
                                name={getFoodName(entry as BackendFood)}
                                badge={(entry as BackendFood).brandName || ""}
                                subtitle={`${Math.round((entry as BackendFood).kcal)} kcal • ${(entry as BackendFood).protein}g`}
                                onClick={() => setSelectedFood(entry as BackendFood)}
                                addLabel={t("meals.measurement.confirm_add")}
                                actions={renderActionButtons(entry, "food", section.isCreated)}
                              />
                            ) : (
                              <FoodResultItem
                                key={entry.id}
                                name={(entry as BackendMeal).name}
                                badge={section.isCreated ? t("meals.modal.created_section") : t("meals.modal.saved_section")}
                                subtitle={getMealSubtitle(entry as BackendMeal)}
                                onClick={() => logMealMutation.mutate(entry.id)}
                                addLabel={t("meals.measurement.confirm_add")}
                                actions={renderActionButtons(entry, "meal", section.isCreated)}
                              />
                            ),
                          )
                        ) : (
                          <div className="text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest py-6">
                            {t("meals.modal.no_results")}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                ))}
              </>
            ) : (
              <>
                {items.map((entry) =>
                  activeType === "food" ? (
                    <FoodResultItem
                      key={entry.id}
                      name={getFoodName(entry as BackendFood)}
                      badge={(entry as BackendFood).brandName || ""}
                      subtitle={`${Math.round((entry as BackendFood).kcal)} kcal • ${(entry as BackendFood).protein}g`}
                      onClick={() => setSelectedFood(entry as BackendFood)}
                      addLabel={t("meals.measurement.confirm_add")}
                      actions={renderActionButtons(entry, "food", false)}
                      icon={currentTab === "global" ? Globe : null}
                    />
                  ) : (
                    <FoodResultItem
                      key={entry.id}
                      name={(entry as BackendMeal).name}
                      badge={undefined}
                      subtitle={getMealSubtitle(entry as BackendMeal)}
                      onClick={() => logMealMutation.mutate(entry.id)}
                      addLabel={t("meals.measurement.confirm_add")}
                      actions={renderActionButtons(entry, "meal", false)}
                    />
                  ),
                )}

                {loading ? (
                  <div className="flex justify-center py-6">
                    <CustomLoadingSpinner />
                  </div>
                ) : null}

                {!loading && !items.length ? (
                  <div className="text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest py-8">
                    {t("meals.modal.no_results")}
                  </div>
                ) : null}

                {!loading && !hasMore && items.length > 30 ? (
                  <div className="text-center text-[10px] text-neutral-600 font-bold uppercase tracking-widest py-8">
                    {t("meals.modal.end_results")}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </div>

      {selectedFood ? (
        <MeasurementSelector
          foodName={getFoodName(selectedFood)}
          selectedItem={selectedFood}
          onConfirm={(data) => {
            logFoodMutation.mutate({
              foodId: selectedFood.id,
              quantity: data.quantity,
              measure: data.measure,
              kcal: data.kcal,
              protein: data.protein,
              carbs: data.carbs,
              fat: data.fat,
              date: targetDate,
              optimisticFood: selectedFood,
            });
            setSelectedFood(null);
          }}
          onClose={() => setSelectedFood(null)}
        />
      ) : null}

      {showFoodEditor ? (
        <FoodEditorModal
          food={editingFood}
          onClose={() => {
            setEditingFood(null);
            setShowFoodEditor(false);
          }}
        />
      ) : null}

      {showMealEditor ? (
        <MealEditorModal
          meal={editingMeal}
          onClose={() => {
            setEditingMeal(null);
            setShowMealEditor(false);
          }}
        />
      ) : null}
    </>
  );
};

export default AddModal;
