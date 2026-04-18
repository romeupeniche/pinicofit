import React, { useMemo, useState } from "react";
import {
  Flame,
  Utensils,
  Target,
  TrendingUp,
  GlassWater,
  CheckSquare2,
  Dumbbell,
  BedDouble,
  type LucideIcon,
  ChevronRight,
} from "lucide-react";
import { useSettingsStore } from "../../store/settingsStore";
import type { TranslationKeys } from "../../types/i18n";
import { useNavigate } from "react-router-dom";
import { useQueries } from "@tanstack/react-query";
import { api } from "../../services/api";
import AppLoadingScreen from "../../components/AppLoadingScreen";
import { AnimatedFlame } from "../../components/AnimatedFlame";
import { getWorkoutForDateFromState, type WorkoutServerState } from "../../store/goals/workoutStore";
import { useAuthStore } from "../../store/authStore";
import type { TaskItem } from "../../types/tasks";
import type { SleepLog } from "../../types/sleep";
import { getLocalDateKey } from "../../utils/date";
import type { DailyFoodLogEntry, MeResponse } from "../../types/goals";
import FeatureTutorialModal from "../../components/FeatureTutorialModal";

type StreakMeResponse = {
  streak: number;
  livesRemaining: number;
  maxLivesPerMonth: number;
  flameLevel: "low" | "streak" | "max";
};

const Dashboard: React.FC = () => {
  const { t } = useSettingsStore();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const todayKey = getLocalDateKey();

  const [meQuery, streakQuery, waterQuery, mealsQuery, workoutSettingsQuery, workoutLogQuery, tasksQuery, sleepQuery] =
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
          queryKey: ["streak-me", todayKey],
          queryFn: async () => {
            const { data } = await api.get(`/streak/me?date=${todayKey}`);
            return data as StreakMeResponse;
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
            return data as DailyFoodLogEntry[];
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
        {
          queryKey: ["tasks", todayKey],
          queryFn: async () => {
            const { data } = await api.get(`/tasks/today?date=${todayKey}`);
            return data as TaskItem[];
          },
          enabled: !!user,
        },
        {
          queryKey: ["sleep-today", todayKey],
          queryFn: async () => {
            const { data } = await api.get(`/sleep/today?date=${todayKey}`);
            return data as SleepLog | null;
          },
          enabled: !!user,
        },
      ],
    });

  const isLoading = [meQuery, streakQuery, waterQuery, mealsQuery, workoutSettingsQuery, workoutLogQuery, tasksQuery, sleepQuery].some(
    (query) => query.isLoading,
  );

  const [showTutorial, setShowTutorial] = useState(
    !user?.tutorialState?.dashboard,
  );
  const closeTutorial = async (dontShowAgain: boolean) => {
    setShowTutorial(false);

    if (!dontShowAgain || !user?.id || user.tutorialState?.dashboard) {
      return;
    }

    const tutorialState = {
      ...user.tutorialState,
      dashboard: true,
    };

    const { data } = await api.patch(`/users/${user.id}`, {
      tutorialState,
    });
    useAuthStore.getState().updateProfile(data);
  };
  const profile: MeResponse = meQuery.data || user;
  if (!profile) return null;
  const streakData = streakQuery.data;
  const meals: DailyFoodLogEntry[] = mealsQuery.data || [];
  const waterToday = waterQuery.data;
  const workoutState = workoutSettingsQuery.data;
  const tasks = tasksQuery.data || [];
  const sleepToday = sleepQuery.data;
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

  const p = profile?.preferences;
  const macroGoals = {
    protein: p?.proteinGoal || 160,
    carbs: p?.carbsGoal || 250,
    fat: p?.fatGoal || 70,
  };
  const workoutCaloriesBurned = useMemo(() => {
    if (!todayWorkout || todayWorkout.type !== "workout") return 0;

    return Math.round(
      (workoutState?.logs || [])
        .filter(
          (log) =>
            log.date === todayKey &&
            log.status !== "failed" &&
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
  const calorieGoal = p?.calorieGoal;
  const caloriesLeft = calorieGoal + workoutCaloriesBurned - nutritionStats.kcal;
  const progressPercent = calorieGoal
    ? Math.min((nutritionStats.kcal / calorieGoal) * 100, 100)
    : 0;
  const targetWater = waterToday?.target || p?.waterGoal || 2000;
  const sleepGoal = p?.sleepGoal || 8;
  const tasksGoal = p?.tasksGoal || 5;
  const currentWater = waterToday?.total || 0;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = Math.max(tasks.length - completedTasks, 0);
  const currentSleepHours = sleepToday?.durationHours || 0;
  const isTodayPerfect = useMemo(() => {
    const goalsMet = [];

    if (p?.nutritionEnabled) {
      const target = (p.calorieGoal * (p.nutritionTolerance ?? 95)) / 100;
      goalsMet.push(nutritionStats.kcal >= target);
    }
    if (p?.waterEnabled) {
      const target = (p.waterGoal * (p.waterTolerance ?? 80)) / 100;
      goalsMet.push(currentWater >= target);
    }
    if (p?.sleepEnabled) {
      const target = (p.sleepGoal * (p.sleepTolerance ?? 85)) / 100;
      goalsMet.push(currentSleepHours >= target);
    }
    if (p?.tasksEnabled && (p.tasksGoal ?? 0) > 0) {
      goalsMet.push(completedTasks >= p.tasksGoal);
    }
    if (p?.workoutEnabled && todayWorkout?.type === "workout") {
      const target = Math.ceil(totalWorkoutExercises * ((p.workoutTolerance ?? 80) / 100));
      goalsMet.push(completedExercises >= target);
    }

    return goalsMet.length > 0 && goalsMet.every(v => v === true);
  }, [p, nutritionStats.kcal, currentWater, currentSleepHours, completedTasks, completedExercises, todayWorkout]);
  const displayStreak = isTodayPerfect ? (streakData?.streak ?? 0) + 1 : (streakData?.streak ?? 0);
  const flameLevel = useMemo(() => {
    const allGoalsEnabled =
      p?.nutritionEnabled &&
      p?.waterEnabled &&
      p?.sleepEnabled &&
      p?.tasksEnabled &&
      p?.workoutEnabled;

    if (!isTodayPerfect) return "low";

    const isMaxLevel =
      allGoalsEnabled &&
      nutritionStats.kcal >= (p?.calorieGoal || 0) &&
      currentWater >= (p?.waterGoal || 0) &&
      currentSleepHours >= (p?.sleepGoal || 0) &&
      completedTasks >= (p?.tasksGoal || 0) &&
      (todayWorkout?.type === "workout" ? completedExercises >= totalWorkoutExercises : true);

    return isMaxLevel ? "max" : "streak";
  }, [isTodayPerfect, p, nutritionStats.kcal, currentWater, currentSleepHours, completedTasks, completedExercises, todayWorkout]);

  const cardGoals: {
    id: string;
    titleId: TranslationKeys;
    icon: LucideIcon;
    progress: string;
    progressPercentage: number;
    remaining: string;
    postfix: string;
    route: string;
    enabled: boolean;
    streakTarget: number;
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
        enabled: p?.waterEnabled ?? true,
        streakTarget: Math.round(targetWater * ((p?.waterTolerance ?? 80) / 100)),
      },
      {
        id: "workout",
        titleId: "dashboard.cards.workout",
        icon: Dumbbell,
        progress: todayWorkout?.type === "workout"
          ? `${completedExercises}/${Math.max(totalWorkoutExercises, 1)}`
          : "OFF",
        progressPercentage: todayWorkout?.type === "workout" && totalWorkoutExercises
          ? Math.min((completedExercises / totalWorkoutExercises) * 100, 100)
          : 100,
        remaining: todayWorkout?.type === "workout"
          ? `${Math.max(totalWorkoutExercises - completedExercises, 0)}`
          : "0",
        postfix: "dashboard.cards.workout_postfix",
        route: "/goals/workout",
        enabled: p?.workoutEnabled ?? true,
        streakTarget: Math.ceil(totalWorkoutExercises * ((p?.workoutTolerance ?? 80) / 100)),
      },
      {
        id: "tasks",
        titleId: "dashboard.cards.tasks",
        icon: CheckSquare2,
        progress: `${completedTasks}/${tasks.length > 0 ? tasks.length : tasksGoal}`,
        progressPercentage: tasks.length > 0
          ? Math.min((completedTasks / tasks.length) * 100, 100)
          : 0,
        remaining: `${tasks.length > 0 ? pendingTasks : tasksGoal}`,
        postfix: "dashboard.cards.tasks_postfix",
        route: "/goals/tasks",
        enabled: p?.tasksEnabled ?? true,
        streakTarget: tasksGoal,
      },
      {
        id: "sleep",
        titleId: "dashboard.cards.sleep",
        icon: BedDouble,
        progress: currentSleepHours ? `${Number(currentSleepHours).toFixed(1)}h` : "--",
        progressPercentage: currentSleepHours
          ? Math.min((Number(currentSleepHours) / sleepGoal) * 100, 100)
          : 0,
        remaining: currentSleepHours ? `${Math.max(sleepGoal - Number(currentSleepHours), 0).toFixed(1)}` : "--",
        postfix: "h",
        route: "/goals/sleep",
        enabled: p?.sleepEnabled ?? true,
        streakTarget: Number((sleepGoal * ((p?.sleepTolerance ?? 85) / 100)).toFixed(1)),
      },
    ];

  if (isLoading) {
    return (
      <AppLoadingScreen
        title={t("dashboard.loading_title")}
        subtitle={t("dashboard.loading_subtitle")}
      />
    );
  }

  const mainRadius = 110;
  const mainCenterX = 128;
  const mainCenterY = 128;

  const nutritionTolerance = p?.nutritionTolerance ?? 95;
  const nutritionStreakPercent = nutritionTolerance;

  const mainAngle = (nutritionStreakPercent / 100) * 360 - 90;
  const mainFlameX = mainCenterX + mainRadius * Math.cos((mainAngle * Math.PI) / 180);
  const mainFlameY = mainCenterY + mainRadius * Math.sin((mainAngle * Math.PI) / 180);

  const isNutritionStreakReached = progressPercent >= nutritionStreakPercent;

  return (
    <div className="min-h-screen text-neutral-900 relative overflow-hidden">
      <header className="flex justify-between items-center md:items-end mb-12 flex-col md:flex-row gap-4 md:gap-0">
        <div className="flex justify-between sm:flex-row flex-col items-center w-full md:w-auto">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">
              {t("dashboard.title")}
            </h1>
            <p className="text-neutral-500 font-medium text-lg italic">
              "{t("dashboard.subtitle")}"
            </p>
          </div>

          <button
            onClick={() => navigate("/goals")}
            className="cursor-pointer group relative flex items-center gap-3 bg-white/40 border border-white/40 p-2 pr-5 rounded-full hover:bg-orange-500 hover:border-orange-400 transition-all duration-300 active:scale-95 md:ml-6"
          >
            <div className="relative bg-orange-500/10 p-2 rounded-full group-hover:bg-white/20 transition-colors">
              <AnimatedFlame
                level={flameLevel}
                size={38}
              />
              <div className="absolute inset-0 bg-orange-500 blur-lg opacity-20 group-hover:opacity-40 transition-opacity" />
            </div>

            <div className="flex-col items-start hidden md:flex">
              <span className="text-xl font-black text-neutral-800 group-hover:text-white leading-none transition-colors">
                {displayStreak}
              </span>
              <span className="text-[10px] font-bold uppercase tracking-tighter text-neutral-500 group-hover:text-orange-100 transition-colors">
                Check-in
              </span>
            </div>

            <div className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all">
              <ChevronRight size={20} className="text-white" />
            </div>
          </button>
        </div>


        <div className="flex gap-4 flex-wrap justify-center lg:justify-end">
          {cardGoals.map((card) => (
            <div
              key={card.id}
              onClick={() => navigate(card.route)}
              className={`cursor-pointer transition-colors border ${card.progressPercentage === 100 ? "bg-green-100 hover:bg-green-50 border-green-300" : "bg-white/50 border-neutral-200 hover:bg-white"} p-3 rounded-2xl flex items-center gap-3`}
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
          <div onClick={() => navigate("/meals")} className="cursor-pointer hover:bg-white transition-colors bg-white/50 border border-neutral-200 p-3 rounded-2xl flex items-center gap-3">
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
                className={`${progressPercent >= 100 ? "text-green-500" : "text-brand-accent"} transition-all duration-1000 ease-out`}
                strokeLinecap="round"
              />
            </svg>

            <div
              className="absolute z-10 transition-all duration-500"
              style={{
                left: `${mainFlameX}px`,
                top: `${mainFlameY}px`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <div className={`p-1 rounded-full border-2 shadow-md transition-colors ${isNutritionStreakReached
                ? "bg-orange-500 border-orange-600 text-white animate-pulse"
                : "bg-white border-neutral-200 text-neutral-400"
                }`}>
                <Flame size={16} fill={isNutritionStreakReached ? "currentColor" : "none"} />
              </div>
            </div>

            <div className="absolute flex flex-col items-center">
              <span className={`text-5xl font-black ${progressPercent === 100 && caloriesLeft < 0 ? "text-red-600" : progressPercent === 100 ? "text-green-500" : isNutritionStreakReached ? "text-orange-500" : "text-black"}`}>{caloriesLeft}</span>
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
                <p className="text-sm text-neutral-500">
                  {t("dashboard.workout_compensated")}
                </p>
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
              {
                key: "protein",
                current: nutritionStats.protein,
                goal: macroGoals.protein,
                color: "bg-brand-accent",
                tolerance: p?.nutritionTolerance
              },
              {
                key: "carbs",
                current: nutritionStats.carbs,
                goal: macroGoals.carbs,
                color: "bg-brand-pink",
                tolerance: p?.nutritionTolerance
              },
              {
                key: "fats",
                current: nutritionStats.fat,
                goal: macroGoals.fat,
                color: "bg-yellow-400",
                tolerance: p?.nutritionTolerance
              },
            ].map((macro) => {
              const progress = Math.min((macro.current / macro.goal) * 100, 100);
              const streakReached = progress >= macro.tolerance;

              return (
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
                      <span className="text-neutral-600 text-xs">/ {macro.goal}g</span>
                    </span>
                  </div>

                  <div className="relative w-full h-2.5 bg-neutral-800 rounded-full">
                    <div
                      className={`h-full ${macro.color} rounded-full transition-all duration-700`}
                      style={{ width: `${progress}%` }}
                    />

                    <div
                      className="absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-500"
                      style={{ left: `${macro.tolerance}%` }}
                    >
                      <div
                        className={`p-0.5 rounded-full border shadow-sm transform -translate-x-1/2 ${streakReached
                          ? "bg-orange-500 border-orange-600 text-white animate-pulse"
                          : "bg-neutral-900 border-neutral-700 text-neutral-500"
                          }`}
                      >
                        <Flame size={8} fill={streakReached ? "currentColor" : "none"} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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
            streakTarget
          }) => {
            const totalForScale = id === "water"
              ? targetWater
              : id === "sleep"
                ? sleepGoal
                : id === "tasks"
                  ? (tasks.length > tasksGoal ? tasks.length : tasksGoal)
                  : (totalWorkoutExercises || 1);

            const streakPercent = (streakTarget / totalForScale) * 100;

            const radius = 35;
            const angle = (streakPercent / 100) * 360 - 90;
            const x = 40 + radius * Math.cos((angle * Math.PI) / 180);
            const y = 40 + radius * Math.sin((angle * Math.PI) / 180);

            const isStreakReached = progressPercentage >= streakPercent;
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
                        t("dashboard.cards.no_synced_data")
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
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 32 32">
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
                  {id !== "tasks" && (
                    <div
                      className="absolute z-10 transition-all duration-300"
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      <div className={`p-0.5 rounded-full border shadow-sm ${isStreakReached
                        ? "bg-orange-500 border-orange-600 text-white"
                        : "bg-white border-neutral-200 text-neutral-400"
                        }`}>
                        <Flame size={10} fill={isStreakReached ? "currentColor" : "none"} />
                      </div>
                    </div>
                  )}
                  <span className={`absolute text-[10px] font-black ${progressPercentage === 100 ? "text-green-500" : "text-neutral-800"}`}>
                    {progress}
                  </span>
                </div>
              </div>
            );
          },
        )}
      </footer>

      {showTutorial && (
        <FeatureTutorialModal
          title={t("tutorials.dashboard.title")}
          subtitle={t("tutorials.dashboard.subtitle")}
          closeLabel={t("tutorials.close")}
          steps={[
            {
              title: t("tutorials.dashboard.steps.streak.title"),
              description: t("tutorials.dashboard.steps.streak.description"),
            },
            {
              title: t("tutorials.dashboard.steps.nutrition.title"),
              description: t("tutorials.dashboard.steps.nutrition.description"),
            },
            {
              title: t("tutorials.dashboard.steps.goals.title"),
              description: t("tutorials.dashboard.steps.goals.description"),
            },
            {
              title: t("tutorials.dashboard.steps.summary.title"),
              description: t("tutorials.dashboard.steps.summary.description"),
            },
          ]}
          dontShowAgainLabel={t("tutorials.do_not_show_again")}
          onContinue={closeTutorial}
        />
      )}
    </div>
  );
};

export default Dashboard;
