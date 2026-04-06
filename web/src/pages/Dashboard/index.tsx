import React, { useMemo } from "react";
import {
  Flame,
  Utensils,
  Target,
  TrendingUp,
  GlassWater,
  Footprints,
  Dumbbell,
  BedDouble,
  type LucideIcon,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import type { TranslationKeys } from "../../types/i18n";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { api } from "../../services/api";
import AppLoadingScreen from "../../components/AppLoadingScreen";
import type { BackendFood } from "../../types/food";
import { getWorkoutForDateFromState, type WorkoutServerState } from "../../store/goals/workoutStore";
import { useAuthStore } from "../../store/authStore";

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

const Dashboard: React.FC = () => {
  const { t } = useSettingsStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const todayKey = new Date().toISOString().slice(0, 10);

  const [meQuery, waterQuery, mealsQuery, workoutSettingsQuery, workoutLogQuery] =
    useQueries({
      queries: [
        {
          queryKey: ["me"],
          queryFn: async () => {
            const { data } = await api.get("/users/me");
            return data;
          },
          enabled: !!user,
        },
        {
          queryKey: ["water-today"],
          queryFn: async () => {
            const { data } = await api.get("/water/today");
            return data;
          },
          enabled: !!user,
        },
        {
          queryKey: ["meals-log", todayKey],
          queryFn: async () => {
            const { data } = await api.get(`/meals/log?date=${todayKey}`);
            return data as DailyMealLog[];
          },
          enabled: !!user,
        },
        {
          queryKey: ["workoutSettings"],
          queryFn: async () => {
            const { data } = await api.get("/workouts/settings");
            return data as WorkoutServerState | null;
          },
          enabled: !!user,
        },
        {
          queryKey: ["workout-log", todayKey],
          queryFn: async () => {
            const { data } = await api.get(`/workouts/today?date=${todayKey}`);
            return data;
          },
          enabled: !!user,
        },
      ],
    });

  const isLoading = [meQuery, waterQuery, mealsQuery, workoutSettingsQuery, workoutLogQuery].some(
    (query) => query.isLoading,
  );

  const profile = meQuery.data || user;
  const meals = mealsQuery.data || [];
  const waterToday = waterQuery.data;
  const workoutState = workoutSettingsQuery.data;
  const todayWorkout = workoutState
    ? getWorkoutForDateFromState(workoutState, new Date())
    : null;
  const completedExercises = useMemo(() => {
    if (!todayWorkout || todayWorkout.type !== "workout") return 0;

    const todayLogs = (workoutState?.logs || []).filter(
      (log) =>
        log.date === todayKey &&
        todayWorkout.exercises.some((exercise) => exercise.id === log.exerciseId),
    );

    return todayLogs.length;
  }, [todayKey, todayWorkout, workoutState?.logs]);
  const totalWorkoutExercises = todayWorkout?.type === "workout"
    ? todayWorkout.exercises.length
    : 0;

  const nutritionStats = useMemo(
    () =>
      meals.reduce(
        (acc, meal) => ({
          kcal: acc.kcal + meal.kcal,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
        }),
        { kcal: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [meals],
  );

  const macroGoals = {
    protein: profile?.proteinGoal || 160,
    carbs: profile?.carbsGoal || 250,
    fat: profile?.fatGoal || 70,
  };
  const workoutCaloriesBurned = useMemo(() => {
    if (!todayWorkout || todayWorkout.type !== "workout") return 0;

    return Math.round(
      (workoutState?.logs || [])
        .filter(
          (log) =>
            log.date === todayKey &&
            todayWorkout.exercises.some((exercise) => exercise.id === log.exerciseId),
        )
        .reduce((total, log) => {
          const exercise = todayWorkout.exercises.find(
            (item) => item.id === log.exerciseId,
          );
          if (!exercise) return total;

          const reps = Number(exercise.reps || 0);
          const sets = Number(exercise.sets || 0);
          const weight = Number(log.actualWeight || exercise.weight || 0);

          return total + Math.max(6, sets * reps * Math.max(weight, 1) * 0.03);
        }, 0),
    );
  }, [todayKey, todayWorkout, workoutState?.logs]);
  const calorieGoal =
    profile?.calorieGoal || Math.round((profile?.weight || 70) * 30);
  const caloriesLeft = Math.max(calorieGoal - nutritionStats.kcal + workoutCaloriesBurned, 0);
  const progressPercent = calorieGoal
    ? Math.min((nutritionStats.kcal / calorieGoal) * 100, 100)
    : 0;
  const targetWater = waterToday?.target || profile?.waterGoal || 2000;
  const currentWater = waterToday?.total || 0;

  const cardGoals: {
    id: string;
    titleId: TranslationKeys;
    icon: LucideIcon;
    progress: string;
    progressPercentage: number;
    remaining: string;
    postfix: string;
    route: string;
  }[] = [
    {
      id: "water",
      titleId: "dashboard.cards.water",
      icon: GlassWater,
      progress: `${currentWater}ml`,
      progressPercentage: Math.min((currentWater / targetWater) * 100, 100),
      remaining: `${Math.max(targetWater - currentWater, 0)}`,
      postfix: "ml",
      route: "/goals/water",
    },
    {
      id: "workout",
      titleId: "dashboard.cards.workout",
      icon: Dumbbell,
      progress:
        todayWorkout?.type === "workout"
          ? `${completedExercises}/${Math.max(totalWorkoutExercises, 1)}`
          : "OFF",
      progressPercentage:
        todayWorkout?.type === "workout" && totalWorkoutExercises
          ? Math.min((completedExercises / totalWorkoutExercises) * 100, 100)
          : 100,
      remaining:
        todayWorkout?.type === "workout"
          ? `${Math.max(totalWorkoutExercises - completedExercises, 0)}`
          : "0",
      postfix: "dashboard.cards.workout_postfix",
      route: "/goals/workout",
    },
    {
      id: "steps",
      titleId: "dashboard.cards.steps",
      icon: Footprints,
      progress: "--",
      progressPercentage: 0,
      remaining: "--",
      postfix: "dashboard.cards.steps_postfix",
      route: "/goals/steps",
    },
    {
      id: "sleep",
      titleId: "dashboard.cards.sleep",
      icon: BedDouble,
      progress: "--",
      progressPercentage: 0,
      remaining: "--",
      postfix: "h",
      route: "/goals/sleep",
    },
  ];

  if (isLoading) {
    return (
      <AppLoadingScreen
        title="Carregando dashboard"
        subtitle="Buscando seus dados reais do dia..."
      />
    );
  }

  return (
    <div className="min-h-screen px-8 text-neutral-900 relative overflow-hidden">
      <header className="flex justify-between items-center md:items-end mb-12 flex-col md:flex-row gap-4 md:gap-0">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            {t("dashboard.title")}
          </h1>
          <p className="text-neutral-500 font-medium text-lg italic">
            "{t("dashboard.subtitle")}"
          </p>
        </div>
        <div className="flex gap-4 flex-wrap justify-end">
          {cardGoals.map((card) => (
            <div
              key={card.id}
              className={`border ${card.progressPercentage === 100 ? "bg-green-100 border-green-300" : "bg-white/50 border-neutral-200"} p-3 rounded-2xl flex items-center gap-3`}
            >
              <card.icon
                className={`${card.progressPercentage === 100 ? "text-green-500" : "text-brand-accent"}`}
              />
              <div className="hidden lg:block">
                <p className="text-xs text-neutral-500 uppercase font-bold">
                  {t(card.titleId)}
                </p>
                <p className="font-semibold">{card.progress}</p>
              </div>
            </div>
          ))}
          <div className="bg-white/50 border border-neutral-200 p-3 rounded-2xl flex items-center gap-3">
            <Target className="text-brand-accent" />
            <div className="hidden lg:block">
              <p className="text-xs text-neutral-500 uppercase font-bold">
                {t("dashboard.meta_label")}
              </p>
              <p className="font-semibold">{calorieGoal} kcal</p>
            </div>
          </div>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <section className="lg:col-span-2 bg-white/40 border border-white/20 rounded-4xl p-8 shadow-xl flex flex-col md:flex-row md:gap-0 gap-4 items-center justify-around relative overflow-hidden">
          <div className="relative flex items-center justify-center">
            <svg className="w-64 h-64 transform -rotate-90">
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-neutral-200/50"
              />
              <circle
                cx="128"
                cy="128"
                r="110"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={690}
                strokeDashoffset={690 - (690 * progressPercent) / 100}
                className="text-brand-accent transition-all duration-1000 ease-out"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black">{caloriesLeft}</span>
              <span className="text-neutral-500 uppercase text-xs font-bold tracking-widest">
                {t("dashboard.remaining")}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                <Flame />
              </div>
              <div>
                <p className="text-sm text-neutral-500">
                  {t("dashboard.consumed_label")}
                </p>
                <p className="text-2xl font-bold">
                  {Math.round(nutritionStats.kcal)} kcal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-accent/10 rounded-2xl text-brand-accent">
                <Utensils />
              </div>
              <div>
                <p className="text-sm text-neutral-500">
                  {t("dashboard.total_meals")}
                </p>
                <p className="text-2xl font-bold">{meals.length}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                <Dumbbell />
              </div>
              <div>
                <p className="text-sm text-neutral-500">Treino compensado</p>
                <p className="text-2xl font-bold">{workoutCaloriesBurned} kcal</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-neutral-900 text-white rounded-4xl p-8 shadow-2xl flex flex-col justify-between">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <TrendingUp className="text-brand-pink" size={20} />{" "}
            {t("dashboard.macros_title")}
          </h3>

          <div className="space-y-8 mt-6">
            {[
              { key: "protein", current: nutritionStats.protein, goal: macroGoals.protein, color: "bg-brand-accent" },
              { key: "carbs", current: nutritionStats.carbs, goal: macroGoals.carbs, color: "bg-brand-pink" },
              { key: "fats", current: nutritionStats.fat, goal: macroGoals.fat, color: "bg-yellow-400" },
            ].map((macro) => (
              <div key={macro.key}>
                <div className="flex justify-between mb-2">
                  <span className="capitalize font-medium text-neutral-400">
                    {macro.key === "protein"
                      ? t("dashboard.macros.protein")
                      : macro.key === "carbs"
                        ? t("dashboard.macros.carbs")
                        : t("dashboard.macros.fats")}
                  </span>
                  <span className="font-bold">
                    {Math.round(macro.current)}g{" "}
                    <span className="text-neutral-600 text-xs">
                      / {macro.goal}g
                    </span>
                  </span>
                </div>
                <div className="w-full h-2.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${macro.color} transition-all duration-700`}
                    style={{ width: `${Math.min((macro.current / macro.goal) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate("/meals")}
            className="mt-8 w-full py-4 bg-white text-black rounded-2xl font-bold hover:bg-brand-pink transition-colors cursor-pointer"
          >
            {t("dashboard.add_meal")}
          </button>
        </section>
      </main>

      <footer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {cardGoals.map(
          ({
            icon: Icon,
            id,
            titleId,
            progress,
            progressPercentage,
            remaining,
            postfix,
            route,
          }) => {
            return (
              <div
                key={id}
                className="bg-white/60 border border-neutral-200 p-6 rounded-3xl hover:border-brand-accent transition-all cursor-pointer group flex items-center justify-between"
                onClick={() => navigate(route)}
              >
                <div className="flex flex-col">
                  <div className="p-2 w-fit bg-neutral-100 rounded-lg group-hover:bg-brand-accent/10 group-hover:text-brand-accent transition-colors">
                    <Icon size={20} />
                  </div>

                  <div className="mt-4">
                    <h4 className="font-bold text-lg leading-tight">
                      {t(titleId)}
                    </h4>
                    <p className="text-neutral-500 text-xs mt-1">
                      {progressPercentage === 100 ? (
                        t("dashboard.cards.goal_reached")
                      ) : remaining === "--" ? (
                        "Sem dados sincronizados ainda"
                      ) : (
                        <>
                          {t("dashboard.cards.remaining")}
                          <span className="text-brand-accent font-bold">
                            {remaining}
                          </span>{" "}
                          {t(postfix as TranslationKeys)}
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="relative flex items-center justify-center w-20 h-20">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 32 32"
                  >
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      className="text-neutral-100"
                    />
                    <circle
                      cx="16"
                      cy="16"
                      r="14"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="transparent"
                      strokeDasharray="88"
                      strokeDashoffset={88 - (88 * progressPercentage) / 100}
                      strokeLinecap="round"
                      className={`${progressPercentage === 100 ? "text-green-500" : "text-brand-accent"} transition-all duration-700`}
                    />
                  </svg>

                  <span
                    className={`absolute text-[10px] font-black ${progressPercentage === 100 ? "text-green-500" : "text-neutral-800"}`}
                  >
                    {progress}
                  </span>
                </div>
              </div>
            );
          },
        )}
      </footer>
    </div>
  );
};

export default Dashboard;
