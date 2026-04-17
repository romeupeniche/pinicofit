import React, { useEffect, useMemo, useState } from "react";
import { Coffee, Flame, Moon, Plus, Settings, Sparkles, Sun, Utensils } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AddModal from "./AddModal";
import AppLoadingScreen from "../../components/AppLoadingScreen";
import FeatureTutorialModal from "../../components/FeatureTutorialModal";
import MacroBar from "./MacroBar";
import MealBucketModal from "./MealBucketModal";
import MealGroup from "./MealGroup";
import MeasurementSelector, { type AllowedMeasuresLabels } from "./MeasurementSelector";
import SuggestionCard from "./SuggestionCard";
import { api } from "../../services/api";
import { useAuthStore } from "../../store/authStore";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSettingsStore } from "../../store/settingsStore";
import type { BackendFood } from "../../types/food";
import type { BackendMeal } from "../../types/meal";
import { getLocalDateKey } from "../../utils/date";
import { useNavigate } from "react-router-dom";

type MealBucket = "breakfast" | "lunch" | "snack" | "dinner";

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

const bucketHourMap: Record<MealBucket, number> = {
  breakfast: 8,
  lunch: 13,
  snack: 17,
  dinner: 20,
};

const getBucketFromHour = (hour: number): MealBucket => {
  // 00:00 - 00:59
  if (hour < 1) return "dinner";

  // 01:00 - 03:59
  if (hour < 4) return "snack";

  // 04:00 - 10:59
  if (hour < 11) return "breakfast";

  // 11:00 - 15:59
  if (hour < 16) return "lunch";

  // 16:00 - 18:59
  if (hour < 19) return "snack";

  // 19:00 - 23:59
  return "dinner";
};

const getMealBucket = (date: string): MealBucket => {
  const hour = new Date(date).getHours();
  return getBucketFromHour(hour);
};

const MealPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedBucket, setSelectedBucket] = useState<MealBucket | null>(null);
  const [editingLog, setEditingLog] = useState<DailyMealLog | null>(null);
  const [addTargetDate, setAddTargetDate] = useState<string | undefined>();
  const [activeDateView, setActiveDateView] = useState<"today" | "yesterday">("today");
  const isMobile = useIsMobile();
  const { t, lang } = useSettingsStore();
  const { user, updateProfile } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const todayKey = getLocalDateKey();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);
  const yesterdayKey = getLocalDateKey(yesterdayDate);
  const selectedDateKey = activeDateView === "today" ? todayKey : yesterdayKey;
  const [showTutorial, setShowTutorial] = useState(!user?.tutorialState?.meals);
  const [currentBucketBasedOnHour, setCurrentBucketBasedOnHour] = useState<MealBucket | null>(null);

  useEffect(() => {
    setCurrentBucketBasedOnHour(getBucketFromHour(new Date().getHours()));
  }, [])

  const getFoodDisplayName = (food: BackendFood) =>
    (lang === "br" ? food.brName : lang === "es" ? food.esName : food.enName) ||
    food.brName;

  const mealDefinitions: Record<MealBucket, { title: string; icon: React.ReactNode; emptyLabel: string }> = {
    breakfast: {
      title: t("meals.buckets.breakfast"),
      icon: <Coffee size={18} />,
      emptyLabel: t("meals.buckets.breakfast_empty"),
    },
    lunch: {
      title: t("meals.buckets.lunch"),
      icon: <Sun size={18} />,
      emptyLabel: t("meals.buckets.lunch_empty"),
    },
    snack: {
      title: t("meals.buckets.snack"),
      icon: <Utensils size={18} />,
      emptyLabel: t("meals.buckets.snack_empty"),
    },
    dinner: {
      title: t("meals.buckets.dinner"),
      icon: <Moon size={18} />,
      emptyLabel: t("meals.buckets.dinner_empty"),
    },
  };

  const { data: mealLogs, isLoading: isLoadingMeals } = useQuery({
    queryKey: ["meals-log", selectedDateKey],
    queryFn: async () => {
      const { data } = await api.get(`/meals/log?date=${selectedDateKey}`);
      return data as DailyMealLog[];
    },
  });

  const { data: savedMeals } = useQuery({
    queryKey: ["meals-library-cards"],
    queryFn: async () => {
      const { data } = await api.get("/meals/library");
      return data as { created: BackendMeal[]; favorites: BackendMeal[] };
    },
  });

  const groupedMeals = useMemo(() => {
    const grouped: Record<MealBucket, DailyMealLog[]> = {
      breakfast: [],
      lunch: [],
      snack: [],
      dinner: [],
    };

    (mealLogs || []).forEach((log) => {
      grouped[getMealBucket(log.date)].push(log);
    });

    return grouped;
  }, [mealLogs]);

  const meta = useMemo(() => {
    return (mealLogs || []).reduce(
      (acc, log) => ({
        consumedKcal: acc.consumedKcal + log.kcal,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fat: acc.fat + log.fat,
        sugar: acc.sugar + ((log.food?.sugar || 0) * log.quantity) / 100,
        sodium: acc.sodium + ((log.food?.sodium || 0) * log.quantity) / 100,
      }),
      { consumedKcal: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, sodium: 0 },
    );
  }, [mealLogs]);

  const calorieGoal = user?.calorieGoal || 2200;
  const proteinGoal = user?.proteinGoal || 160;
  const carbsGoal = user?.carbsGoal || 250;
  const fatGoal = user?.fatGoal || 70;
  const sugarGoal = user?.sugarGoal || 50;
  const sodiumGoal = user?.sodiumGoal || 2300;

  const suggestionCards = useMemo(
    () => [...(savedMeals?.favorites || []), ...(savedMeals?.created || [])].slice(0, 6),
    [savedMeals],
  );

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meals/log/${id}`);
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["meals-log", selectedDateKey] });
      const previousLogs =
        queryClient.getQueryData<DailyMealLog[]>(["meals-log", selectedDateKey]) || [];
      queryClient.setQueryData<DailyMealLog[]>(["meals-log", selectedDateKey], (current = []) =>
        current.filter((log) => log.id !== id),
      );
      return { previousLogs };
    },
    onError: (_error, _id, context) => {
      queryClient.setQueryData(["meals-log", selectedDateKey], context?.previousLogs || []);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals-log", selectedDateKey] });
    },
  });

  const quickAddMutation = useMutation({
    mutationFn: async (mealId: string) => {
      await api.post(`/meals/${mealId}/log`, { date: selectedDateKey });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals-log", selectedDateKey] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (payload: {
      logId: string;
      foodId: string;
      quantity: number;
      measure: string;
      kcal: number;
      protein: number;
      carbs: number;
      fat: number;
      date: string;
    }) => {
      await api.patch(`/meals/log/${payload.logId}`, payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals-log", selectedDateKey] });
      setEditingLog(null);
    },
  });

  const closeTutorial = async (dontShowAgain: boolean) => {
    setShowTutorial(false);
    if (!dontShowAgain || !user?.id || user.tutorialState?.meals) return;

    const { data } = await api.patch(`/users/${user.id}`, {
      tutorialState: {
        ...user.tutorialState,
        meals: true,
      },
    });

    updateProfile(data);
  };

  if (isLoadingMeals) {
    return (
      <AppLoadingScreen
        title={t("meals.loading_title")}
        subtitle={t("meals.loading_subtitle")}
      />
    );
  }

  const buildBucketDate = (bucket: MealBucket) => {
    const date = new Date(`${selectedDateKey}T00:00:00`);
    date.setHours(bucketHourMap[bucket], 0, 0, 0);
    return `${selectedDateKey}T${String(bucketHourMap[bucket]).padStart(2, "0")}:00:00`;
  };

  const buildCurrentTimeTargetDate = () => {
    const currentHour = new Date().getHours();
    const bucket = getBucketFromHour(currentHour);
    return buildBucketDate(bucket);
  };

  return (
    <div className="min-h-screen pb-32">
      <section className="border border-white/5 rounded-[40px] p-6 mb-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6 gap-4">
          <div>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              {t("meals.remaining_calories")}
            </p>
            <h1 className="text-5xl font-black tracking-tighter">
              {Math.max(Math.round(calorieGoal - meta.consumedKcal), 0)}
              <span className="text-brand-accent text-lg ml-2 font-bold">kcal</span>
            </h1>
          </div>
          <div className="flex gap-4 items-start">
            <div className="md:flex hidden h-16 w-16 rounded-3xl bg-brand-accent/10 border border-brand-accent/20 items-center justify-center">
              <Flame size={30} className="text-brand-accent" />
            </div>
            <button onClick={() => navigate("/account", { state: { tab: "goals", section: "nutritionGoal" }, })} className="cursor-pointer hover:border-brand-accent hover:text-brand-accent text-zinc-400 rounded-2xl transition-colors">
              <Settings size={24} className="justify-self-center text-inherit" />
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-3">
          <MacroBar label="Prot" color="bg-blue-500" current={Number(meta.protein.toFixed(1))} goal={proteinGoal} />
          <MacroBar label="Carb" color="bg-orange-500" current={Number(meta.carbs.toFixed(1))} goal={carbsGoal} />
          <MacroBar label="Fat" color="bg-red-500" current={Number(meta.fat.toFixed(1))} goal={fatGoal} />
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              {t("meals.nutrients.sugar")}
            </p>
            <p className="mt-2 text-2xl font-black text-neutral-900">
              {Math.round(meta.sugar)}g
              <span className="ml-2 text-sm font-bold text-neutral-400">/ {sugarGoal}g</span>
            </p>
            <p className={`mt-2 text-xs font-semibold ${meta.sugar > sugarGoal ? "text-red-500" : "text-emerald-500"}`}>
              {meta.sugar > sugarGoal
                ? t("meals.nutrients.above_target")
                : t("meals.nutrients.within_target")}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              {t("meals.nutrients.sodium")}
            </p>
            <p className="mt-2 text-2xl font-black text-neutral-900">
              {Math.round(meta.sodium)}mg
              <span className="ml-2 text-sm font-bold text-neutral-400">/ {sodiumGoal}mg</span>
            </p>
            <p className={`mt-2 text-xs font-semibold ${meta.sodium > sodiumGoal ? "text-red-500" : "text-emerald-500"}`}>
              {meta.sodium > sodiumGoal
                ? t("meals.nutrients.above_target")
                : t("meals.nutrients.within_target")}
            </p>
          </div>
        </div>
      </section>

      <div className="mb-6">
        <h2 className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-2">
          {t("meals.saved_meals")}
        </h2>
        <div className={`flex gap-4 overflow-x-auto pb-2 ${isMobile ? "scrollbar-hide" : ""}`}>
          {suggestionCards.length > 0 ? (
            suggestionCards.map((meal) => {
              const kcal = Math.round(
                (meal.items || []).reduce(
                  (acc, item) => acc + ((item.food?.kcal || 0) * Number(item.quantity || 0)) / 100,
                  0,
                ),
              );
              const desc =
                meal.description ||
                meal.items
                  ?.slice(0, 2)
                  .map((item) => getFoodDisplayName(item.food))
                  .join(", ") ||
                t("meals.editor.no_description");

              return (
                <SuggestionCard
                  key={meal.id}
                  title={meal.name}
                  desc={desc}
                  kcal={kcal}
                  icon={<Sparkles size={18} />}
                  actionLabel={t("meals.quick_add")}
                  onClick={() => quickAddMutation.mutate(meal.id)}
                />
              );
            })
          ) : (
            <div className="w-full rounded-4xl border border-dashed border-neutral-200 bg-white/40 p-6 text-sm font-medium text-neutral-500">
              {t("meals.no_saved_meals")}
            </div>
          )}
        </div>
        <div className="mb-4 flex justify-self-center w-fit rounded-2xl bg-white/60 p-1">
          {(["today", "yesterday"] as const).map((view) => (
            <button
              key={view}
              onClick={() => setActiveDateView(view)}
              className={`cursor-pointer rounded-xl px-4 py-2 text-xs font-black uppercase tracking-[0.2em] transition-all ${activeDateView === view
                ? "bg-neutral-900 text-white"
                : "text-neutral-500"
                }`}
            >
              {view === "today" ? t("meals.history.today") : t("meals.history.yesterday")}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {(Object.keys(mealDefinitions) as MealBucket[]).map((bucket) => {
          const logs = groupedMeals[bucket];
          const kcal = logs.reduce((acc, item) => acc + item.kcal, 0);
          const items = logs.length
            ? logs.map((item) => getFoodDisplayName(item.food)).join(", ")
            : mealDefinitions[bucket].emptyLabel;

          return (
            <MealGroup
              key={bucket}
              title={mealDefinitions[bucket].title}
              icon={mealDefinitions[bucket].icon}
              kcal={kcal}
              items={items}
              pendingLabel={t("meals.buckets.pending")}
              isNext={logs.length === 0}
              isCurrentBucketBasedOnTime={bucket === currentBucketBasedOnHour}
              onClick={() => setSelectedBucket(bucket)}
            />
          );
        })}
      </div>

      <button
        onClick={() => {
          setAddTargetDate(buildCurrentTimeTargetDate());
          setIsAddModalOpen(true);
        }}
        className="fixed cursor-pointer bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-brand-accent rounded-full shadow-[0_0_50px_rgba(170,59,255,0.4)] items-center justify-center flex transition-transform active:scale-90 z-50"
      >
        <Plus size={36} className="text-black" strokeWidth={3} />
      </button>

      {isAddModalOpen ? (
        <AddModal
          onClose={() => {
            setIsAddModalOpen(false);
            setAddTargetDate(undefined);
          }}
          targetDate={addTargetDate || buildCurrentTimeTargetDate()}
          onLogged={() => {
            setSelectedBucket(null);
            setAddTargetDate(undefined);
          }}
        />
      ) : null}

      {selectedBucket ? (
        <MealBucketModal
          title={mealDefinitions[selectedBucket].title}
          logs={groupedMeals[selectedBucket]}
          onClose={() => setSelectedBucket(null)}
          onDelete={(id) => deleteMutation.mutate(id)}
          deletingId={deleteMutation.variables ?? null}
          onAdd={() => {
            setAddTargetDate(buildBucketDate(selectedBucket));
            setSelectedBucket(null);
            setIsAddModalOpen(true);
          }}
          onEdit={(log) => setEditingLog(log)}
        />
      ) : null}

      {editingLog ? (
        <MeasurementSelector
          foodName={getFoodDisplayName(editingLog.food)}
          selectedItem={editingLog.food}
          initialQuantity={editingLog.quantity}
          initialMeasure={editingLog.measure as AllowedMeasuresLabels}
          confirmLabel={t("meals.measurement.confirm_save")}
          onClose={() => setEditingLog(null)}
          onConfirm={(data) => {
            updateMutation.mutate({
              logId: editingLog.id,
              foodId: editingLog.food.id,
              quantity: data.quantity,
              measure: data.measure,
              kcal: data.kcal,
              protein: data.protein,
              carbs: data.carbs,
              fat: data.fat,
              date: editingLog.date,
            });
          }}
        />
      ) : null}

      {showTutorial ? (
        <FeatureTutorialModal
          title={t("tutorials.meals.title")}
          subtitle={t("tutorials.meals.subtitle")}
          closeLabel={t("tutorials.close")}
          dontShowAgainLabel={t("tutorials.do_not_show_again")}
          steps={[
            {
              title: t("tutorials.meals.steps.add.title"),
              description: t("tutorials.meals.steps.add.description"),
            },
            {
              title: t("tutorials.meals.steps.measure.title"),
              description: t("tutorials.meals.steps.measure.description"),
            },
            {
              title: t("tutorials.meals.steps.warning.title"),
              description: t("tutorials.meals.steps.warning.description"),
            },
            {
              title: t("tutorials.meals.steps.dashboard.title"),
              description: t("tutorials.meals.steps.dashboard.description"),
            },
          ]}
          onContinue={closeTutorial}
        />
      ) : null}
    </div>
  );
};

export default MealPage;
