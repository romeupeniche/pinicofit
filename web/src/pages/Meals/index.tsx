import React, { useMemo, useState } from "react";
import { Plus, Utensils, Flame, Coffee, Sun, Moon, Sparkles } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MealGroup from "./MealGroup";
import SuggestionCard from "./SuggestionCard";
import MacroBar from "./MacroBar";
import AddModal from "./AddModal";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useSettingsStore } from "../../store/settingsStore";
import { api } from "../../services/api";
import AppLoadingScreen from "../../components/AppLoadingScreen";
import type { BackendFood } from "../../types/food";
import { useAuthStore } from "../../store/authStore";
import FeatureTutorialModal from "../../components/FeatureTutorialModal";

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

const mealDefinitions: Record<
  MealBucket,
  { title: string; icon: React.ReactNode; emptyLabel: string }
> = {
  breakfast: {
    title: "Cafe da Manha",
    icon: <Coffee size={18} />,
    emptyLabel: "Nada registrado pela manha",
  },
  lunch: {
    title: "Almoco",
    icon: <Sun size={18} />,
    emptyLabel: "Nada registrado no almoco",
  },
  snack: {
    title: "Lanche",
    icon: <Utensils size={18} />,
    emptyLabel: "Nada registrado no lanche",
  },
  dinner: {
    title: "Jantar",
    icon: <Moon size={18} />,
    emptyLabel: "Nada registrado no jantar",
  },
};

const getMealBucket = (date: string): MealBucket => {
  const hour = new Date(date).getHours();

  if (hour < 11) return "breakfast";
  if (hour < 16) return "lunch";
  if (hour < 20) return "snack";
  return "dinner";
};

const getFoodDisplayName = (food: BackendFood) =>
  food.brName || food.enName || food.esName;

const MealPage: React.FC = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const isMobile = useIsMobile();
  const { t } = useSettingsStore();
  const { user, updateProfile } = useAuthStore();
  const todayKey = new Date().toISOString().slice(0, 10);
  const [showTutorial, setShowTutorial] = useState(!user?.tutorialState?.meals);

  const { data: mealLogs, isLoading: isLoadingMeals } = useQuery({
    queryKey: ["meals-log", todayKey],
    queryFn: async () => {
      const { data } = await api.get(`/meals/log?date=${todayKey}`);
      return data as DailyMealLog[];
    },
  });

  const { data: recentMeals } = useQuery({
    queryKey: ["meals-library"],
    queryFn: async () => {
      const { data } = await api.get("/meals");
      return data;
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
    const logs = mealLogs || [];

    return logs.reduce(
      (acc, log) => ({
        consumedKcal: acc.consumedKcal + log.kcal,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fat: acc.fat + log.fat,
        sugar: acc.sugar + ((log.food?.sugar || 0) * log.quantity) / 100,
        sodium: acc.sodium + ((log.food?.sodium || 0) * log.quantity) / 100,
      }),
      {
        consumedKcal: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        sugar: 0,
        sodium: 0,
      },
    );
  }, [mealLogs]);

  const calorieGoal = user?.calorieGoal || 2200;
  const proteinGoal = user?.proteinGoal || 160;
  const carbsGoal = user?.carbsGoal || 250;
  const fatGoal = user?.fatGoal || 70;
  const sugarGoal = user?.sugarGoal || 50;
  const sodiumGoal = user?.sodiumGoal || 2300;
  const suggestionCards = useMemo(
    () =>
      (recentMeals || []).slice(0, 6).map((meal: any) => ({
        id: meal.id,
        title: meal.name,
        desc:
          meal.description ||
          meal.items
            ?.slice(0, 2)
            .map((item: any) => item.food?.brName)
            .filter(Boolean)
            .join(" + ") ||
          "Refeicao salva",
        kcal: Math.round(
          (meal.items || []).reduce(
            (acc: number, item: any) =>
              acc + ((item.food?.kcal || 0) * Number(item.quantity || 0)) / 100,
            0,
          ),
        ),
      })),
    [recentMeals],
  );
  const typedSuggestionCards: Array<{
    id: string;
    title: string;
    desc: string;
    kcal: number;
  }> = suggestionCards;

  if (isLoadingMeals) {
    return (
      <AppLoadingScreen
        title="Carregando refeicoes"
        subtitle="Buscando suas refeicoes e macros do dia..."
      />
    );
  }

  const closeTutorial = async () => {
    setShowTutorial(false);

    if (!user?.id || user.tutorialState?.meals) return;

    const { data } = await api.patch(`/users/${user.id}`, {
      tutorialState: {
        ...user.tutorialState,
        meals: true,
      },
    });

    updateProfile(data);
  };

  return (
    <div className="min-h-screen p-4 pb-32">
      <section className="border border-white/5 rounded-[40px] p-6 mb-6 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-1">
              Calorias restantes
            </p>
            <h1 className="text-5xl font-black tracking-tighter">
              {Math.max(calorieGoal - meta.consumedKcal, 0)}
              <span className="text-brand-accent text-lg ml-2 font-bold">
                kcal
              </span>
            </h1>
          </div>
          <div className="h-16 w-16 rounded-3xl bg-brand-accent/10 border border-brand-accent/20 items-center justify-center flex">
            <Flame size={30} className="text-brand-accent" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <MacroBar label="Prot" color="bg-blue-500" current={Number(meta.protein.toFixed(1))} goal={proteinGoal} />
          <MacroBar label="Carb" color="bg-orange-500" current={Number(meta.carbs.toFixed(1))} goal={carbsGoal} />
          <MacroBar label="Gord" color="bg-red-500" current={Number(meta.fat.toFixed(1))} goal={fatGoal} />
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              Acucar
            </p>
            <p className="mt-2 text-2xl font-black text-neutral-900">
              {Math.round(meta.sugar)}g
              <span className="ml-2 text-sm font-bold text-neutral-400">
                / {sugarGoal}g
              </span>
            </p>
            <p className={`mt-2 text-xs font-semibold ${meta.sugar > sugarGoal ? "text-red-500" : "text-emerald-500"}`}>
              {meta.sugar > sugarGoal ? "Acima do recomendado para hoje." : "Dentro do recomendado para hoje."}
            </p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
              Sodio
            </p>
            <p className="mt-2 text-2xl font-black text-neutral-900">
              {Math.round(meta.sodium)}mg
              <span className="ml-2 text-sm font-bold text-neutral-400">
                / {sodiumGoal}mg
              </span>
            </p>
            <p className={`mt-2 text-xs font-semibold ${meta.sodium > sodiumGoal ? "text-red-500" : "text-emerald-500"}`}>
              {meta.sodium > sodiumGoal ? "Acima do recomendado para hoje." : "Dentro do recomendado para hoje."}
            </p>
          </div>
        </div>
      </section>

      <div className="mb-6">
        <h2 className="text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] mb-4 px-2">
          Refeicoes salvas
        </h2>
        <div
          className={`flex gap-4 overflow-x-auto pb-2 ${isMobile && "scrollbar-hide"}`}
        >
          {suggestionCards.length > 0 ? (
            typedSuggestionCards.map((card) => (
              <SuggestionCard
                key={card.id}
                title={card.title}
                desc={card.desc}
                kcal={card.kcal}
                icon={<Sparkles size={18} />}
              />
            ))
          ) : (
            <div className="w-full rounded-4xl border border-dashed border-neutral-200 bg-white/40 p-6 text-sm font-medium text-neutral-500">
              Nenhuma refeicao salva ainda.
            </div>
          )}
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
              isNext={logs.length === 0}
            />
          );
        })}
      </div>

      <button
        onClick={() => setIsAddModalOpen(true)}
        className="fixed cursor-pointer bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 bg-brand-accent rounded-full shadow-[0_0_50px_rgba(170,59,255,0.4)] items-center justify-center flex transition-transform active:scale-90 z-50"
      >
        <Plus size={36} className="text-black" strokeWidth={3} />
      </button>

      {isAddModalOpen && <AddModal onClose={() => setIsAddModalOpen(false)} />}

      {showTutorial && (
        <FeatureTutorialModal
          title={t("tutorials.meals.title")}
          subtitle={t("tutorials.meals.subtitle")}
          closeLabel={t("tutorials.close")}
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
          onClose={closeTutorial}
        />
      )}
    </div>
  );
};

export default MealPage;
