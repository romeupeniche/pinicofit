import { useMemo, useState } from "react";
import {
  Flame,
  Heart,
  Settings,
  CheckCircle2,
  XCircle,
  X,
  Dumbbell,
  Utensils,
  Droplets,
  Moon,
  ClipboardList,
  HelpCircle,
  LifeBuoy,
  RefreshCcw,
  Apple,
  Zap,
  CircleMinus,
  ChevronLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AnimatedFlame } from "../../components/AnimatedFlame";
import { useQuery } from "@tanstack/react-query";
import { useSettingsStore } from "../../store/settingsStore";
import { useAuthStore } from "../../store/authStore";
import { getLocalDateKey } from "../../utils/date";
import AppLoadingScreen from "../../components/AppLoadingScreen";
import { api } from "../../services/api";
import type {
  DailyFoodLogEntry,
  MeResponse,
  SleepTodayResponse,
  WaterTodayResponse,
  WorkoutServerState,
} from "../../types/goals";
import type { TaskItem } from "../../types/tasks";
import { useBodyScrollLock } from "../../hooks/useBodyScrollLock";
import { formatTextWithHighlights } from "../../utils/formatTextWithHighlights";

type HelpKey =
  | "main"
  | "flame"
  | "nutrition"
  | "water"
  | "sleep"
  | "workout"
  | "tasks"
  | "streak_shield";

type StreakMeResponse = {
  streak: number;
  livesRemaining: number;
  maxLivesPerMonth: number;
  flameLevel: "low" | "streak" | "max";
};

type GoalsDailySummaryResponse = {
  me: MeResponse;
  streak: StreakMeResponse;
  water: WaterTodayResponse;
  meals: DailyFoodLogEntry[];
  workoutSettings: WorkoutServerState | null;
  tasks: TaskItem[];
  sleep: SleepTodayResponse | null;
};

const MAX_LIVES_PER_MONTH = 5;

const GoalsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { t } = useSettingsStore();
  const todayKey = getLocalDateKey();
  const [helpOpen, setHelpOpen] = useState<HelpKey | null>(null);

  useBodyScrollLock(!!helpOpen);

  const dailySummaryQuery = useQuery({
    queryKey: ["goals-daily-summary", todayKey],
    queryFn: async () => (await api.get<GoalsDailySummaryResponse>(`/goals/daily-summary?date=${todayKey}`)).data,
    enabled: !!user,
  });

  const profile = dailySummaryQuery.data?.me;
  const p = profile?.preferences;
  const waterToday = dailySummaryQuery.data?.water || { total: 0, target: p?.waterGoal || 2000, logs: [] };
  const meals = dailySummaryQuery.data?.meals || [];
  const tasks = dailySummaryQuery.data?.tasks || [];
  const sleepToday = dailySummaryQuery.data?.sleep;
  const workoutState = dailySummaryQuery.data?.workoutSettings;

  const nutritionEnabled = Boolean(p?.nutritionEnabled && p?.nutritionEnabled);
  const waterEnabled = Boolean(p?.waterEnabled);
  const sleepEnabled = Boolean(p?.sleepEnabled);
  const workoutEnabled = Boolean(p?.workoutEnabled);
  const tasksEnabled = Boolean(p?.tasksEnabled);
  const allGoalsEnabled = nutritionEnabled && waterEnabled && sleepEnabled && workoutEnabled && tasksEnabled;
  const disabledGoalsCount = useMemo(() => {
    if (!workoutState) return 0;
    const goals = [
      nutritionEnabled,
      waterEnabled,
      sleepEnabled,
      tasksEnabled,
      workoutEnabled,
    ];
    return goals.filter((enabled) => enabled === false).length;
  }, [workoutState]);

  const formatMl = (ml: number) => `${Math.round(Number(ml || 0))}ml`;
  const formatKcal = (kcal: number) => `${Math.round(Number(kcal || 0))} kcal`;
  const formatHours = (h: number) => `${Number(h || 0).toFixed(1)}h`;

  const completedTasks = useMemo(() => tasks.filter((task) => Boolean(task.completed)).length, [tasks]);

  const nutritionStats = useMemo(() =>
    meals.reduce((acc, meal) => ({
      kcal: acc.kcal + (meal.kcal || 0),
      protein: acc.protein + (meal.protein || 0),
    }), { kcal: 0, protein: 0 }),
    [meals]);

  const isWorkoutDay = useMemo(() => {
    const activeDays = workoutState?.activeDays || [];
    if (activeDays.length === 0) return false;

    const [y, m, d] = todayKey.split('-').map(Number);
    const dayOfWeek = new Date(y, m - 1, d).getDay();

    return activeDays.includes(dayOfWeek);
  }, [workoutState, todayKey]);

  const workoutDone = useMemo(() => {
    const todayLogs = (workoutState?.logs || []).filter((log: any) => log.date === todayKey);
    return todayLogs.length > 0;
  }, [todayKey, workoutState]);

  const todayWorkout = useMemo(() => {
    if (!workoutState) return null;
    if (!isWorkoutDay) return {
      type: "rest" as const,
      name: "Dia de Descanso",
      exercises: [],
      label: "R"
    };

    const workout = workoutState.cycle.find((step) => step.type === "workout");
    return workout || { type: "rest" as const, name: "Rest", exercises: [] };
  }, [workoutState, isWorkoutDay]);

  const totalExercises = todayWorkout?.type === "workout" ? todayWorkout.exercises.length : 0;

  const completedWorkoutExercises = useMemo(() => {
    if (todayWorkout?.type !== "workout") return 0;

    return (workoutState?.logs || []).filter(
      (log) =>
        log.date === todayKey &&
        log.status !== "failed" &&
        todayWorkout.exercises.some((ex) => ex.id === log.exerciseId)
    ).length;
  }, [todayKey, todayWorkout, workoutState?.logs]);

  const workoutTolerancePct = Number(p?.workoutTolerance ?? 100);
  const minExercisesRequired = Math.ceil(totalExercises * (workoutTolerancePct / 100));

  const waterGoalMl = Number(p?.waterGoal ?? 0);
  const waterTolerancePct = Number(p?.waterTolerance ?? 80);
  const waterToleranceMl = Math.round((waterGoalMl * waterTolerancePct) / 100);
  const waterToleranceMet = !waterEnabled || (waterToday?.total || 0) >= waterToleranceMl;

  const calorieGoal = Number(p?.calorieGoal ?? 0);
  const nutritionTolerancePct = Number(p?.nutritionTolerance ?? 95);
  const nutritionToleranceKcal = Math.round((calorieGoal * nutritionTolerancePct) / 100);
  const nutritionToleranceMet = !nutritionEnabled || calorieGoal <= 0 || nutritionStats.kcal >= nutritionToleranceKcal;

  const sleepGoalHours = Number(p?.sleepGoal ?? 0);
  const sleepTolerancePct = Number(p?.sleepTolerance ?? 85);
  const sleepToleranceHours = Number(((sleepGoalHours * sleepTolerancePct) / 100).toFixed(1));
  const sleepToleranceMet = !sleepEnabled || sleepGoalHours <= 0 || Number(sleepToday?.durationHours || 0) >= sleepToleranceHours;

  const trainingToleranceMet = !workoutEnabled || !isWorkoutDay || totalExercises <= 0 || completedWorkoutExercises >= minExercisesRequired;

  const tasksGoal = Number(p?.tasksGoal ?? 0);
  const tasksMet = !tasksEnabled || tasksGoal <= 0 || completedTasks >= tasksGoal;

  const contract = useMemo(() => ({
    water: waterToleranceMet,
    nutrition: nutritionToleranceMet,
    training: trainingToleranceMet,
    sleep: sleepToleranceMet,
    tasks: tasksMet,
  }), [nutritionToleranceMet, sleepToleranceMet, tasksMet, trainingToleranceMet, waterToleranceMet]);

  const completedCount = Object.values(contract).filter(Boolean).length;
  const totalCount = Object.keys(contract).length;
  const progressPercent = (completedCount / totalCount) * 100;
  const allTolerancesAre100 = useMemo(() => {
    const targets = [
      { enabled: nutritionEnabled, tolerance: nutritionTolerancePct },
      { enabled: waterEnabled, tolerance: waterTolerancePct },
      { enabled: sleepEnabled, tolerance: sleepTolerancePct },
      { enabled: workoutEnabled, tolerance: workoutTolerancePct },
    ];
    return targets.filter((t) => t.enabled).every((t) => t.tolerance >= 100);
  }, [nutritionTolerancePct, nutritionEnabled, sleepEnabled, waterEnabled, workoutEnabled, sleepTolerancePct, waterTolerancePct, workoutTolerancePct]);

  const canMaxFlame = allGoalsEnabled && allTolerancesAre100;
  const allGoalsDisabled = totalCount == disabledGoalsCount
  const localStreakState = useMemo<"low" | "streak" | "max">(() => {
    const allMet = Object.values(contract).every(Boolean);
    if (!allMet) return "low";
    return canMaxFlame ? "max" : "streak";
  }, [canMaxFlame, contract]);

  const streakState = dailySummaryQuery.data?.streak.flameLevel ?? localStreakState;
  const streak = (!(localStreakState === "low") && !allGoalsDisabled) ? (dailySummaryQuery.data?.streak.streak ?? 0) + 1 : (dailySummaryQuery.data?.streak.streak ?? 0);
  const lives = dailySummaryQuery.data?.streak.livesRemaining ?? MAX_LIVES_PER_MONTH;
  const maxLives = dailySummaryQuery.data?.streak.maxLivesPerMonth ?? MAX_LIVES_PER_MONTH;

  if (dailySummaryQuery.isLoading) {
    return <AppLoadingScreen title={t("goals.loading_title")} subtitle={t("goals.loading_subtitle")} darkMode />;
  }

  if (!profile) return null;

  const helpEnabled =
    helpOpen === "nutrition"
      ? nutritionEnabled
      : helpOpen === "water"
        ? waterEnabled
        : helpOpen === "sleep"
          ? sleepEnabled
          : helpOpen === "workout"
            ? workoutEnabled
            : helpOpen === "tasks"
              ? tasksEnabled
              : true;

  const settingsSection =
    helpOpen === "nutrition"
      ? "nutritionGoal"
      : helpOpen === "water"
        ? "waterGoal"
        : helpOpen === "sleep"
          ? "sleepGoal"
          : helpOpen === "workout"
            ? "workoutGoal"
            : helpOpen === "tasks"
              ? "tasksGoal"
              : null;

  return (
    <div className="min-h-screen text-zinc-100 p-4 md:p-8 pb-32">
      <div className="flex md:flex-row flex-col justify-between items-center mb-10 gap-4">
        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-white/10 rounded-xl transition-colors cursor-pointer hover:text-brand-accent"
          >
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase md:text-start text-center">
              {t("goals.title").split(" ")[0]} <span className="text-orange-500">{t("goals.title").split(" ")[1]}</span>
            </h1>
            <p className="text-zinc-500 text-sm mt-1">{t("goals.subtitle")}</p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-inner">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <span className="font-bold text-lg">{lives}</span>
          </div>
          <button
            onClick={() => navigate("/account", { state: { tab: "goals" } })}
            className="cursor-pointer h-12 w-12 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors flex items-center justify-center"
          >
            <Settings className="w-6 h-6 text-zinc-400" />
          </button>
          <button
            type="button"
            onClick={() => setHelpOpen("main")}
            className="cursor-pointer h-12 w-12 bg-zinc-900 border border-zinc-800 rounded-2xl hover:bg-zinc-800 transition-colors flex items-center justify-center"
            aria-label="Contract Help"
          >
            <HelpCircle className="w-6 h-6 text-zinc-400" />
          </button>
        </div>
      </div>

      <section className="relative mb-12 group">
        <div
          className={`absolute -inset-1 rounded-[2.5rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 bg-linear-to-t
          ${streakState === "low"
              ? "from-neutral-600 to-neutral-400"
              : streakState === "streak"
                ? "from-orange-600 to-yellow-500"
                : "from-[#6366f1] from-0% via-[#0ea5e9] via-85% to-[#bae6fd] to-100%"
            }`}
        />

        <div className="relative bg-zinc-900 border border-zinc-800 rounded-4xl p-8 flex flex-col items-center">
          <button
            type="button"
            onClick={() => setHelpOpen("flame")}
            className="cursor-pointer absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            aria-label="Flame Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="relative h-62.5 w-62.5 flex items-end justify-center">
            <AnimatedFlame
              level={streakState}
              size={streakState === "max" ? 250 : streakState === "streak" ? 240 : 220}
            />
          </div>

          <div className="text-center mt-4">
            <span className="text-6xl font-black tracking-tighter">{streak}</span>
            <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs font-bold">
              {t("goals.consistency_days")}
            </p>
          </div>

          <div className="w-full max-w-xs mt-8">
            <div className="flex justify-between text-xs mb-2 px-1">
              <span className="text-zinc-400 font-bold uppercase">{allGoalsDisabled ? t("goals.disabled_streak") : t("goals.today_contract")}</span>
              <span className={`${allGoalsDisabled ? "text-zinc-400" : canMaxFlame ? "text-[#0ea5e9]" : "text-orange-500"} font-bold`}>
                {completedCount - disabledGoalsCount}/{totalCount - disabledGoalsCount}
              </span>
            </div>
            <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden border border-zinc-700">
              <div
                className={`h-full transition-all duration-700 ${allGoalsDisabled ? "text-zinc-400" : canMaxFlame
                  ? "bg-linear-to-r from-[#6366f1] from-0% via-[#0ea5e9] via-85% to-[#bae6fd] to-100%"
                  : "bg-linear-to-r from-orange-600 from-0%via-yellow-500 via-85% to-yellow-300 to-100%"
                  }`}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          tabIndex={nutritionEnabled ? 0 : -1}
          className={`relative border rounded-4xl p-6 ${!nutritionEnabled
            ? "border-zinc-800 bg-zinc-900/40 opacity-60"
            : nutritionStats.kcal >= calorieGoal
              ? "border-green-500 bg-green-950/60"
              : contract.nutrition
                ? "border-orange-500 bg-orange-950/40"
                : "border-red-600 bg-red-950/30"
            }`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHelpOpen("nutrition");
            }}
            className="cursor-pointer absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            aria-label="Ajuda da alimentação"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${!nutritionEnabled ? "text-zinc-400 bg-zinc-800/40" : nutritionStats.kcal >= calorieGoal ? "text-green-500 bg-green-500/10" : contract.nutrition ? "text-orange-500 bg-orange-500/10" : "text-red-600 bg-red-500/10"}`}>
              <Utensils className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-1">{t("goals.cards.nutrition")}</h3>
          <p className="text-zinc-500 text-sm mb-4 italic">{t("goals.cards.nutrition_subtitle")}</p>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 h-2 bg-zinc-800 rounded-full">
              <div
                className={`h-full rounded-full ${!nutritionEnabled ? "bg-zinc-700" : nutritionStats.kcal >= calorieGoal ? "bg-green-500" : contract.nutrition ? "bg-orange-400/60" : "bg-zinc-700"}`}
                style={{
                  width: `${Math.min((nutritionStats.kcal / (p?.calorieGoal || 1)) * 100, 100)}%`,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -mt-0.5"
                style={{ left: `${p?.nutritionTolerance ?? 95}%` }}
              >
                <Flame
                  className={`w-4 h-4 -translate-x-1/2 ${!nutritionEnabled ? "text-zinc-700" : nutritionToleranceMet ? "text-orange-400 fill-orange-500" : "text-zinc-700"}`}
                />
              </div>
            </div>
            <span className="text-sm font-mono font-bold">
              {Math.round((nutritionStats.kcal / (p?.calorieGoal || 1)) * 100)}%
            </span>
          </div>
        </div>
        <div
          tabIndex={tasksEnabled ? 0 : -1}
          className={`relative border rounded-4xl p-6 ${!tasksEnabled ? "border-zinc-800 bg-zinc-900/40 opacity-60" : contract.tasks ? "border-green-500 bg-green-950/60" : "border-red-600 bg-red-950/30"}`}
        >
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setHelpOpen("tasks");
            }}
            className="cursor-pointer absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
            aria-label="Tasks Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <div className="flex justify-between items-start mb-6">
            <div className={`p-4 rounded-2xl ${!tasksEnabled ? "text-zinc-400 bg-zinc-800/40" : contract.tasks ? "text-green-500 bg-green-500/10" : "text-red-600 bg-red-500/10"}`}>
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-xl font-bold mb-1">{t("goals.cards.tasks")}</h3>
          <p className="text-zinc-500 text-sm mb-4 italic">
            {t("goals.cards.tasks_subtitle")}
          </p>

          <div className="flex gap-2 mb-4">
            {Array.from({ length: p?.tasksGoal || 0 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full ${!tasksEnabled ? "bg-zinc-800" : i < tasks.filter((t: any) => t.completed).length ? "bg-green-500" : "bg-zinc-800"}`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 col-span-1 md:col-span-2">
          <div
            tabIndex={waterEnabled ? 0 : -1}
            className={`relative flex-1 border p-6 rounded-4xl flex flex-col ${!waterEnabled ? "border-zinc-800 bg-zinc-900/40 opacity-60" : (waterToday?.total || 0) >= waterGoalMl ? "border-green-500 bg-green-950/60" : contract.water ? "border-orange-500 bg-orange-950/40" : "border-red-600 bg-red-950/30"}`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHelpOpen("water");
              }}
              className="cursor-pointer absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              aria-label="Ajuda da água"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Droplets className={`${!waterEnabled ? "text-zinc-400" : (waterToday?.total || 0) >= waterGoalMl ? "text-green-500" : contract.water ? "text-orange-500" : "text-red-600"} w-6 h-6`} />
              <span className={`text-[10px] ${!waterEnabled ? "text-zinc-400" : (waterToday?.total || 0) >= waterGoalMl ? "text-green-500" : contract.water ? "text-orange-500" : "text-red-600"} uppercase font-bold tracking-widest`}>{t("goals.cards.water")}</span>
            </div>

            <div className="flex items-center justify-between mb-2 text-xs font-mono font-bold">
              <span>{(waterToday?.total / 1000 || 0).toFixed(1)}L</span>
              <span className="text-zinc-500">{((p?.waterGoal || 1) / 1000 || 0).toFixed(1)}L</span>
            </div>

            <div className="relative h-2 w-full bg-zinc-800 rounded-full">
              <div
                className={`h-full rounded-full ${!waterEnabled ? "bg-zinc-700" : (waterToday?.total || 0) >= waterGoalMl ? "bg-green-500" : contract.water ? "bg-orange-400/60" : "bg-zinc-700"}`}
                style={{
                  width: `${Math.min(((waterToday?.total || 0) / (p?.waterGoal || 1)) * 100, 100)}%`,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -mt-0.5"
                style={{ left: `${p?.waterTolerance ?? 80}%` }}
              >
                <Flame
                  className={`w-4 h-4 -translate-x-1/2 ${!waterEnabled ? "text-zinc-700" : waterToleranceMet ? "text-orange-400 fill-orange-500" : "text-zinc-700"}`}
                />
              </div>
            </div>
          </div>

          <div
            tabIndex={sleepEnabled ? 0 : -1}
            className={`relative flex-1 border p-6 rounded-4xl flex flex-col ${!sleepEnabled ? "border-zinc-800 bg-zinc-900/40 opacity-60" : Number(sleepToday?.durationHours || 0) >= sleepGoalHours ? "border-green-500 bg-green-950/60" : contract.sleep ? "border-orange-500 bg-orange-950/40" : "border-red-600 bg-red-950/30"}`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHelpOpen("sleep");
              }}
              className="cursor-pointer absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              aria-label="Sleep Help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Moon className={`${!sleepEnabled ? "text-zinc-400" : Number(sleepToday?.durationHours || 0) >= sleepGoalHours ? "text-green-500" : contract.sleep ? "text-orange-500" : "text-red-600"} w-6 h-6`} />
              <span className={`text-[10px] ${!sleepEnabled ? "text-zinc-400" : Number(sleepToday?.durationHours || 0) >= sleepGoalHours ? "text-green-500" : contract.sleep ? "text-orange-500" : "text-red-600"} uppercase font-bold tracking-widest`}>{t("goals.cards.sleep")}</span>
            </div>

            <div className="flex items-center justify-between mb-2 text-xs font-mono font-bold">
              <span>{(sleepToday?.durationHours || 0).toFixed(1)}h</span>
              <span className="text-zinc-500">{(p?.sleepGoal || 0).toFixed(1)}h</span>
            </div>

            <div className="relative h-2 w-full bg-zinc-800 rounded-full">
              <div
                className={`h-full rounded-full ${!sleepEnabled ? "bg-zinc-700" : Number(sleepToday?.durationHours || 0) >= sleepGoalHours ? "bg-green-500" : contract.sleep ? "bg-orange-400/60" : "bg-zinc-700"}`}
                style={{
                  width: `${Math.min(((sleepToday?.durationHours || 0) / (p?.sleepGoal || 1)) * 100, 100)}%`,
                }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 -mt-0.5"
                style={{ left: `${p?.sleepTolerance ?? 85}%` }}
              >
                <Flame
                  className={`w-4 h-4 -translate-x-1/2 ${!sleepEnabled ? "text-zinc-700" : contract.sleep ? "text-orange-400 fill-orange-500" : "text-zinc-700"}`}
                />
              </div>
            </div>
          </div>

          <div
            tabIndex={workoutEnabled ? 0 : -1}
            className={`relative flex-1 border p-6 rounded-4xl flex flex-col ${!workoutEnabled ? "border-zinc-800 bg-zinc-900/40 opacity-60" : (workoutDone && completedWorkoutExercises === totalExercises) || !isWorkoutDay ? "border-green-500 bg-green-950/60" : contract.training ? "border-orange-500 bg-orange-950/40" : "border-red-600 bg-red-950/30"}`}
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setHelpOpen("workout");
              }}
              className="cursor-pointer absolute top-6 right-6 text-zinc-500 hover:text-white transition-colors"
              aria-label="Workout help"
            >
              <HelpCircle className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Dumbbell className={`${!workoutEnabled ? "text-zinc-400" : (workoutDone && completedWorkoutExercises === totalExercises) || !isWorkoutDay ? "text-green-500" : contract.training ? "text-orange-500" : "text-red-600"} w-6 h-6`} />
              <span className={`text-[10px] ${!workoutEnabled ? "text-zinc-400" : (workoutDone && completedWorkoutExercises === totalExercises) || !isWorkoutDay ? "text-green-500" : contract.training ? "text-orange-500" : "text-red-600"} uppercase font-bold tracking-widest`}>{t("goals.cards.workout")}</span>
            </div>

            <div className="flex items-center justify-between mb-2 text-xs font-mono font-bold">
              <span>{isWorkoutDay ? completedWorkoutExercises : "OFF"}</span>
              <span className="text-zinc-500">{totalExercises}</span>
            </div>

            <div className={`relative h-2 w-full rounded-full ${isWorkoutDay || !workoutEnabled ? "bg-zinc-800" : "bg-green-500"}`}>
              <div
                className={`h-full rounded-full ${!workoutEnabled ? "bg-zinc-700" : workoutDone && completedWorkoutExercises === totalExercises ? "bg-green-500" : contract.training ? "bg-orange-400/60" : "bg-zinc-700"}`}
                style={{
                  width: `${totalExercises > 0 ? ((completedWorkoutExercises / totalExercises) * 100).toFixed() : 0}%`,
                }}
              />
              {isWorkoutDay && (
                <div
                  className="absolute top-1/2 -translate-y-1/2 -mt-0.5"
                  style={{ left: `${p?.workoutTolerance ?? 100}%` }}
                >
                  <Flame
                    className={`w-4 h-4 -translate-x-1/2 ${!workoutEnabled ? "text-zinc-700" : contract.training || !isWorkoutDay ? "text-orange-400 fill-orange-500" : "text-zinc-700"}`}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-12 bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-4 justify-between">
          <div className="flex items-center gap-3">
            <LifeBuoy className="text-zinc-500 w-5 h-5" />
            <h2 className="text-lg font-bold">{t("goals.cards.streak_shield")}</h2>
          </div>
          <button
            type="button"
            onClick={() => setHelpOpen("streak_shield")}
            className="cursor-pointer text-zinc-500 hover:text-white transition-colors"
            aria-label="Streak Shield Help"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: maxLives }).map((_, idx) => {
            const i = idx + 1;
            return (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${i <= lives ? "bg-red-500" : "bg-zinc-800"}`}
              />
            );
          })}
        </div>
        <p className="text-xs text-zinc-500 mt-3 italic">
          {t("goals.cards.left_lives", { lives: String(lives), name: ", " + user?.name || "" })}
        </p>
      </section>

      {helpOpen && (
        <div onClick={(event) => { if (event.target === event.currentTarget) setHelpOpen(null) }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6 text-zinc-100">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md rounded-[2.5rem] p-8">
            <div className="flex items-center justify-between gap-4">
              <span className="flex gap-2 items-center">
                {!helpEnabled && <CircleMinus className="w-5 h-5 text-zinc-400" />}
                <h2 className={`text-2xl font-black italic uppercase leading-none ${helpEnabled ? "text-white" : "text-zinc-400"}`}>{t(`goals.help_modal.${helpOpen}.title`)}</h2>
              </span>
              <div className="flex items-center gap-2">
                {settingsSection && (
                  <button
                    type="button"
                    onClick={() => navigate("/account", { state: { tab: "goals", section: settingsSection } })}
                    className="cursor-pointer h-10 w-10 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center transition-colors"
                    aria-label="Open Settings"
                  >
                    <Settings className="w-5 h-5 text-zinc-200" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setHelpOpen(null)}
                  className="cursor-pointer h-10 w-10 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-zinc-200" />
                </button>
              </div>
            </div>

            {helpOpen === "flame" ? (
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-4 text-xs text-zinc-300 leading-relaxed">
                  {t("goals.help_modal.flame.description")}
                </div>

                <div className="space-y-3">
                  <div className="flex items-start gap-3 border-b border-zinc-800 pb-3">
                    <Flame className="w-4 h-4 text-zinc-600 fill-zinc-600 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-zinc-200">{t("goals.help_modal.flame.off.label")}</div>
                      <div className="text-[11px] text-zinc-500 font-medium">{t("goals.help_modal.flame.off.details")}</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 border-b border-zinc-800 pb-3">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500 mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-zinc-200">{t("goals.help_modal.flame.streak.label")}</div>
                      <div className="text-[11px] text-zinc-500 font-medium">{t("goals.help_modal.flame.streak.details")}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Flame className="w-4 h-4 text-[#0ea5e9] fill-[#0ea5e9] mt-0.5 shrink-0" />
                    <div>
                      <div className="text-sm font-bold text-zinc-200">{t("goals.help_modal.flame.supreme.label")}</div>
                      <div className="text-[11px] text-zinc-500 font-medium">{t("goals.help_modal.flame.supreme.details")}</div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <div className="bg-zinc-800/20 border border-zinc-800 rounded-xl p-3 flex justify-between items-center">
                    <span className="text-[10px] uppercase font-black tracking-widest text-zinc-500">{t("goals.help_modal.flame.potential.label")}</span>
                    <span className={`text-[10px] uppercase font-black tracking-widest ${canMaxFlame ? "text-cyan-500" : "text-orange-500"}`}>
                      {canMaxFlame ? t("goals.help_modal.flame.potential.supreme") : t("goals.help_modal.flame.potential.standard")}
                    </span>
                  </div>
                </div>
              </div>
            ) : helpOpen === "main" ? (
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-4 text-xs text-zinc-300 leading-relaxed">
                  <p className="text-center mb-2">
                    {t("goals.help_modal.main.rules_summary")}
                  </p>
                  <div className="flex justify-center items-center gap-4">
                    {[
                      {
                        label: t("goals.help_modal.main.status_total.label"),
                        details: t("goals.help_modal.main.status_total.details"),
                        icon: <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />,
                        color: "text-emerald-500"
                      },
                      {
                        label: t("goals.help_modal.main.status_guaranteed.label"),
                        details: t("goals.help_modal.main.status_guaranteed.details"),
                        icon: <Flame className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />,
                        color: "text-orange-500"
                      },
                      {
                        label: t("goals.help_modal.main.status_risk.label"),
                        details: t("goals.help_modal.main.status_risk.details"),
                        icon: <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />,
                        color: "text-red-500"
                      }
                    ].map((row, i) => (
                      <div
                        key={i}
                        className="flex flex-col items-start justify-between"
                      >
                        <div className="flex flex-col items-center text-center">
                          {row.icon}
                          <div>
                            <div className="text-[11px] font-bold text-zinc-200">{row.label}</div>
                            <div className="text-[8px] text-zinc-500">{row.details}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <header className="flex items-center justify-between mb-4">
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{t("goals.help_modal.main.headers.min_goal")}</p>
                    <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">{t("goals.help_modal.main.headers.realized")}</p>
                  </header>
                  <div className="space-y-2">
                    {[
                      {
                        key: "nutrition",
                        label: t("goals.help_modal.main.rows.nutrition"),
                        met: contract.nutrition,
                        details: `${formatKcal(nutritionToleranceKcal)} / ${formatKcal(calorieGoal)} (${nutritionTolerancePct}%)`,
                        now: formatKcal(nutritionStats.kcal),
                        nowNumber: nutritionStats.kcal,
                        goalNumber: calorieGoal,
                        enabled: nutritionEnabled
                      },
                      {
                        key: "water",
                        label: t("goals.help_modal.main.rows.water"),
                        met: contract.water,
                        details: `${formatMl(waterToleranceMl)} / ${formatMl(waterGoalMl)} (${waterTolerancePct}%)`,
                        now: formatMl(waterToday?.total || 0),
                        nowNumber: waterToday?.total || 0,
                        goalNumber: waterGoalMl,
                        enabled: waterEnabled
                      },
                      {
                        key: "sleep",
                        label: t("goals.help_modal.main.rows.sleep"),
                        met: contract.sleep,
                        details: `${formatHours(sleepToleranceHours)} / ${formatHours(sleepGoalHours)} (${sleepTolerancePct}%)`,
                        now: formatHours(Number(sleepToday?.durationHours || 0)),
                        nowNumber: Number(sleepToday?.durationHours || 0),
                        goalNumber: sleepGoalHours,
                        enabled: sleepEnabled
                      },
                      {
                        key: "workout",
                        label: t("goals.help_modal.main.rows.workout"),
                        met: contract.training,
                        details: isWorkoutDay
                          ? `${minExercisesRequired}/${totalExercises} (${workoutTolerancePct}%)`
                          : `${t("goals.help_modal.main.rows.rest")} (${workoutTolerancePct}%)`,
                        now: !isWorkoutDay
                          ? "OFF"
                          : `${completedWorkoutExercises}/${totalExercises}`,
                        nowNumber: completedWorkoutExercises,
                        goalNumber: totalExercises,
                        enabled: workoutEnabled
                      },
                      {
                        key: "tasks",
                        label: t("goals.help_modal.main.rows.tasks"),
                        met: contract.tasks,
                        details: `${tasksGoal}/${tasksGoal} (100%)`,
                        now: `${completedTasks}/${Math.max(tasksGoal, tasks.length || 0)}`,
                        nowNumber: completedTasks,
                        goalNumber: tasksGoal,
                        enabled: tasksEnabled
                      },
                    ].map((row, idx, arr) => (
                      <div
                        key={row.key}
                        className={`flex items-start justify-between gap-3 ${idx === arr.length - 1 ? "" : "border-b border-zinc-800 pb-2"}`}
                      >
                        <div className="flex items-start gap-2">
                          {!row.enabled ? (
                            <CircleMinus className="w-4 h-4 text-zinc-500 mt-0.5" />
                          ) :
                            row.met && row.nowNumber >= row.goalNumber ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5" />
                            ) : row.met ? (
                              <Flame className="w-4 h-4 text-orange-500 mt-0.5" />
                            ) :
                              (
                                <XCircle className="w-4 h-4 text-red-500 mt-0.5" />
                              )}
                          <div>
                            <div className={`text-sm font-bold ${row.enabled ? "text-zinc-200" : "text-zinc-500"}`}>{row.label}</div>
                            <div className="text-[11px] text-zinc-500">{row.details}</div>
                          </div>
                        </div>
                        <div className={`text-[11px] font-mono ${!row.enabled ? "text-zinc-500" : row.met && row.nowNumber >= row.goalNumber ? "text-emerald-500 font-black" : row.met ? "text-orange-500 font-black" : "text-zinc-400 font-bold"}`}>{row.enabled ? row.now : t("goals.help_modal.main.rows.disabled")}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-3 rounded-xl border mt-2 ${lives === 0 ? "border-red-500 bg-red-900/30" : "border-zinc-800 bg-zinc-900/50"}`}>
                  <p className={`text-[10px] leading-tight ${lives === 0 ? "text-red-500 font-bold" : "text-zinc-500"}`}>
                    <span className={`${lives === 0 ? "text-red-500 font-black" : "font-bold text-zinc-400 italic"}`}>{lives === 0 ? t("goals.help_modal.main.footer.warning") : t("goals.help_modal.main.footer.note")}</span> {lives === 0 ? t("goals.help_modal.main.footer.no_lives") : t("goals.help_modal.main.footer.with_lives", { lives: String(lives) })}
                  </p>
                </div>
              </div>
            ) : helpOpen === "water" ? (
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-4 text-xs text-zinc-300 leading-relaxed">
                  {t("goals.help_modal.water.description")}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className={!waterEnabled ? "text-zinc-400" : (waterToday?.total || 0) >= waterGoalMl ? "text-green-600" : contract.water ? "text-orange-600" : "text-zinc-400"}>{t("goals.help_modal.water.status.current")}</span>
                    <span className={`font-mono font-bold ${!waterEnabled ? "text-zinc-400" : (waterToday?.total || 0) >= waterGoalMl ? "text-green-500" : contract.water ? "text-orange-500" : "text-white"}`}>
                      {formatMl(waterToday?.total || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2"><span className="text-zinc-400">{t("goals.help_modal.water.status.ideal")}</span><span className="font-mono font-bold">{formatMl(waterGoalMl)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">{t("goals.help_modal.water.status.minimum", { pct: String(waterTolerancePct) })}</span><span className="font-mono font-bold text-orange-500">{formatMl(waterToleranceMl)}</span></div>
                </div>
                <button
                  onClick={() => { setHelpOpen(null); navigate("/goals/water") }}
                  disabled={((waterToday?.total || 0) >= waterGoalMl) || !waterEnabled}
                  className={`enabled:cursor-pointer w-full mt-6 flex items-center justify-center gap-3 py-4 rounded-3xl font-black uppercase tracking-tighter transition-all ${((waterToday?.total || 0) >= waterGoalMl) || !waterEnabled ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700" : "bg-zinc-100 text-zinc-900 active:scale-[0.98]"}`}>
                  {((waterToday?.total || 0) >= waterGoalMl) || !waterEnabled ? (
                    <><span>{!waterEnabled ? t("goals.help_modal.water.button.disabled") : t("goals.help_modal.water.button.completed")}</span>{waterEnabled && <CheckCircle2 className="w-5 h-5" />}</>
                  ) : (
                    <><span>{(waterToday?.total || 0) >= waterToleranceMl ? t("goals.help_modal.water.button.complete_ideal") : t("goals.help_modal.water.button.drink")}</span><Droplets className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            ) : helpOpen === "nutrition" ? (
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-4 text-xs text-zinc-300 leading-relaxed">
                  {t("goals.help_modal.nutrition.description")}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className={!nutritionEnabled ? "text-zinc-400" : nutritionStats.kcal >= calorieGoal ? "text-green-600" : contract.nutrition ? "text-orange-600" : "text-zinc-400"}>{t("goals.help_modal.nutrition.status.current")}</span>
                    <span className={`font-mono font-bold ${!nutritionEnabled ? "text-zinc-400" : nutritionStats.kcal >= calorieGoal ? "text-green-500" : contract.nutrition ? "text-orange-500" : "text-white"}`}>
                      {formatKcal(nutritionStats.kcal)}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2"><span className="text-zinc-400">{t("goals.help_modal.nutrition.status.ideal")}</span><span className="font-mono font-bold">{formatKcal(calorieGoal)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">{t("goals.help_modal.nutrition.status.minimum", { pct: String(nutritionTolerancePct) })}</span><span className="font-mono font-bold text-orange-500">{formatKcal(nutritionToleranceKcal)}</span></div>
                </div>
                <button
                  onClick={() => { setHelpOpen(null); navigate("/meals") }}
                  disabled={(nutritionStats.kcal >= calorieGoal) || !nutritionEnabled}
                  className={`enabled:cursor-pointer w-full mt-6 flex items-center justify-center gap-3 py-4 rounded-3xl font-black uppercase tracking-tighter transition-all ${(nutritionStats.kcal >= calorieGoal) || !nutritionEnabled ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700" : "bg-zinc-100 text-zinc-900 active:scale-[0.98]"}`}>
                  {(nutritionStats.kcal >= calorieGoal) || !nutritionEnabled ? (
                    <><span>{!nutritionEnabled ? t("goals.help_modal.nutrition.button.disabled") : t("goals.help_modal.nutrition.button.completed")}</span>{nutritionEnabled && <CheckCircle2 className="w-5 h-5" />}</>
                  ) : (
                    <><span>{nutritionStats.kcal >= nutritionToleranceKcal ? t("goals.help_modal.nutrition.button.adjust") : t("goals.help_modal.nutrition.button.log")}</span><Apple className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            ) : helpOpen === "sleep" ? (
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-4 text-xs text-zinc-300 leading-relaxed">
                  {t("goals.help_modal.sleep.description")}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className={!sleepEnabled ? "text-zinc-400" : Number(sleepToday?.durationHours || 0) >= sleepGoalHours ? "text-green-600" : contract.sleep ? "text-orange-600" : "text-zinc-400"}>{t("goals.help_modal.sleep.status.current")}</span>
                    <span className={`font-mono font-bold ${!sleepEnabled ? "text-zinc-400" : Number(sleepToday?.durationHours || 0) >= sleepGoalHours ? "text-green-500" : contract.sleep ? "text-orange-500" : "text-white"}`}>
                      {formatHours(Number(sleepToday?.durationHours || 0))}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2"><span className="text-zinc-400">{t("goals.help_modal.sleep.status.ideal")}</span><span className="font-mono font-bold">{formatHours(sleepGoalHours)}</span></div>
                  <div className="flex justify-between"><span className="text-zinc-400">{t("goals.help_modal.sleep.status.minimum", { pct: String(sleepTolerancePct) })}</span><span className="font-mono font-bold text-orange-500">{formatHours(sleepToleranceHours)}</span></div>
                </div>
                <button
                  onClick={() => { setHelpOpen(null); navigate("/goals/sleep") }}
                  disabled={(Number(sleepToday?.durationHours || 0) >= sleepGoalHours) || !sleepEnabled}
                  className={`enabled:cursor-pointer w-full mt-6 flex items-center justify-center gap-3 py-4 rounded-3xl font-black uppercase tracking-tighter transition-all ${(Number(sleepToday?.durationHours || 0) >= sleepGoalHours) || !sleepEnabled ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700" : "bg-zinc-100 text-zinc-900 active:scale-[0.98]"}`}>
                  {(Number(sleepToday?.durationHours || 0) >= sleepGoalHours) || !sleepEnabled ? (
                    <><span>{!sleepEnabled ? t("goals.help_modal.sleep.button.disabled") : t("goals.help_modal.sleep.button.completed")}</span>{sleepEnabled && <CheckCircle2 className="w-5 h-5" />}</>
                  ) : (
                    <><span>{t("goals.help_modal.sleep.button.log")}</span><Moon className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            ) : helpOpen === "workout" ? (
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-4 text-xs text-zinc-300 leading-relaxed">
                  {t("goals.help_modal.workout.description")}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-zinc-800 pb-2"><span className={!workoutEnabled ? "text-zinc-400" : workoutDone && completedWorkoutExercises === totalExercises ? "text-green-600" : workoutDone ? "text-orange-600" : "text-zinc-400"}>{t("goals.help_modal.workout.status.completed_exercises")}</span><span className={`font-mono font-bold ${!workoutEnabled ? "text-zinc-400" : workoutDone && completedWorkoutExercises === totalExercises ? "text-green-500" : workoutDone ? "text-orange-500" : "text-white"}`}>{completedWorkoutExercises} / {totalExercises}</span></div>
                  <div className="flex justify-between border-b border-zinc-800 pb-2"><span className="text-zinc-400">{t("goals.help_modal.workout.status.minimum", { pct: String(workoutTolerancePct) })}</span><span className="font-mono font-bold text-orange-500">{t("goals.help_modal.workout.status.min_exercises", { count: String(minExercisesRequired) })}</span></div>
                  <div className="flex justify-between"><span className={workoutDone && completedWorkoutExercises === totalExercises ? "text-green-600" : workoutDone ? "text-orange-600" : "text-zinc-400"}>{t("goals.help_modal.workout.status.progress")}</span><span className={`font-mono font-bold ${workoutDone && completedWorkoutExercises === totalExercises ? "text-green-500" : workoutDone ? "text-orange-500" : "text-white"}`}>{isWorkoutDay ? (totalExercises > 0 ? ((completedWorkoutExercises / totalExercises) * 100).toFixed() + "%" : "0%") : "OFF"}</span></div>
                </div>
                <button
                  onClick={() => {
                    setHelpOpen(null);
                    navigate("/goals/workout");
                  }}
                  disabled={((workoutDone && completedWorkoutExercises === totalExercises) || !isWorkoutDay) || !workoutEnabled}
                  className={`enabled:cursor-pointer w-full mt-6 flex items-center justify-center gap-3 py-4 rounded-3xl font-black uppercase tracking-tighter transition-all ${((workoutDone && completedWorkoutExercises === totalExercises) || !isWorkoutDay) || !workoutEnabled
                    ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                    : "bg-zinc-100 text-zinc-900 active:scale-[0.98]"
                    }`}
                >
                  {((workoutDone && completedWorkoutExercises === totalExercises) || !isWorkoutDay) || !workoutEnabled ? (
                    <>
                      <span>{!workoutEnabled ? t("goals.help_modal.workout.button.disabled") : isWorkoutDay ? t("goals.help_modal.workout.button.completed") : t("goals.help_modal.workout.button.rest_day")}</span>
                      {workoutEnabled && <CheckCircle2 className="w-5 h-5" />}
                    </>
                  ) : (
                    <>
                      <span>{workoutDone ? t("goals.help_modal.workout.button.complete_remaining") : t("goals.help_modal.workout.button.hit_goal")}</span>
                      <Dumbbell className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            ) : helpOpen === "tasks" ? (
              <div className="mt-6 space-y-4">
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-4 text-xs text-zinc-300 leading-relaxed">
                  {t("goals.help_modal.tasks.description")}
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b border-zinc-800 pb-2">
                    <span className={!tasksEnabled ? "text-zinc-400" : completedTasks >= tasksGoal ? "text-green-600" : "text-zinc-400"}>{t("goals.help_modal.tasks.status.completed")}</span>
                    <span className={`font-mono font-bold ${!tasksEnabled ? "text-zinc-400" : completedTasks >= tasksGoal ? "text-green-500" : "text-white"}`}>{completedTasks} / {tasksGoal}</span>
                  </div>
                  <div className="flex justify-between"><span className="text-zinc-400">{t("goals.help_modal.tasks.status.progress")}</span><span className={`font-mono font-bold ${completedTasks >= tasksGoal ? "text-green-500" : "text-white"}`}>{Math.round((completedTasks / (tasksGoal || 1)) * 100)}%</span></div>
                </div>
                <button
                  onClick={() => { setHelpOpen(null); navigate("/") }}
                  disabled={(completedTasks >= tasksGoal) || !tasksEnabled}
                  className={`w-full mt-6 flex items-center justify-center gap-3 py-4 rounded-3xl font-black uppercase tracking-tighter transition-all ${(completedTasks >= tasksGoal) || !tasksEnabled ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700" : "bg-zinc-100 text-zinc-900 active:scale-[0.98]"}`}>
                  {(completedTasks >= tasksGoal) || !tasksEnabled ? (
                    <><span>{tasksEnabled ? t("goals.help_modal.tasks.button.completed") : t("goals.help_modal.tasks.button.disabled")}</span>{tasksEnabled && <CheckCircle2 className="w-5 h-5" />}</>
                  ) : (
                    <><span>{t("goals.help_modal.tasks.button.finish")}</span><Zap className="w-5 h-5" /></>
                  )}
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-6">
                <div className="bg-zinc-800/40 border border-zinc-700 rounded-2xl p-5 text-xs text-zinc-300 leading-relaxed">
                  <p className="mb-2 font-bold text-zinc-100 uppercase text-[14px] tracking-wider">{t("goals.help_modal.streak_shield.how_it_works.title")}</p>
                  {formatTextWithHighlights(t("goals.help_modal.streak_shield.how_it_works.description"), "text-red-500")}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center">
                      <Heart className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">{t("goals.help_modal.streak_shield.protection.title")}</h4>
                      <p className="text-[11px] text-zinc-500 leading-snug">{t("goals.help_modal.streak_shield.protection.description")}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
                      <Flame className="w-4 h-4 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">{t("goals.help_modal.streak_shield.death.title")}</h4>
                      <p className="text-[11px] text-zinc-500 leading-snug">{formatTextWithHighlights(t("goals.help_modal.streak_shield.death.description"), "text-red-500")}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center">
                      <RefreshCcw className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-100">{t("goals.help_modal.streak_shield.recharge.title")}</h4>
                      <p className="text-[11px] text-zinc-500 leading-snug">{t("goals.help_modal.streak_shield.recharge.description")}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800">
                  <div className="flex justify-between items-center bg-zinc-900/50 p-4 rounded-xl border border-zinc-800">
                    <span className="text-xs text-zinc-400 uppercase font-black">{t("goals.help_modal.streak_shield.status_label")}</span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-4 rounded-sm ${i < lives ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]" : "bg-zinc-800"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalsPage;
