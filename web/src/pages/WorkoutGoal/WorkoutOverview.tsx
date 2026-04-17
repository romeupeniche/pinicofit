import {
  Clock,
  Coffee,
  Dumbbell,
  Flame,
  Moon,
  Trophy,
  Weight,
  Zap,
} from "lucide-react";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import type { ExerciseCategory } from "../../constants/workout-metrics";
import { getExerciseMetrics } from "../../utils/getExerciseMetrics";
import {
  format,
  addDays,
  subDays,
  isSameDay,
  startOfDay,
  formatDistanceStrict,
  differenceInDays,
} from "date-fns";
import { enUS, es, ptBR } from "date-fns/locale";
import { useSettingsStore } from "../../store/settingsStore";
import {
  useWorkoutStore,
  type ICycleStep,
} from "../../store/goals/workoutStore";
import { useAuthStore } from "../../store/authStore";
import WorkoutList from "./WorkoutList";
import { convertFromKg } from "../../utils/weightUnitConverter";
import type { Summary } from "../../utils/processPendingSummaries";
import SummaryModal from "./SummaryModal";
import { localizeWorkoutName } from "../../utils/workoutLocalization";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";
import type { User } from "../../types/auth";
import type { Language } from "../../types/i18n";

const dateLocales = { en: enUS, br: ptBR, es };

type WorkoutLogExercise = {
  exerciseId?: string;
  status?: "done" | "failed" | "increased";
  actualWeight?: string;
};

type WorkoutLogResponse = {
  date?: string;
  duration?: number;
  exercises?: WorkoutLogExercise[];
};

const getWorkoutLetter = (label?: string) => {
  if (!label) return "";
  const match = label.match(/[A-ZÀ-ÿ0-9]+$/i);
  return match?.[0] || label;
};

const buildStableSummary = ({
  step,
  serverLog,
  user,
  lang,
  t,
  dateKey,
}: {
  step?: ICycleStep;
  serverLog?: WorkoutLogResponse | null;
  user?: User | null;
  lang: Language;
  t: ReturnType<typeof useSettingsStore.getState>["t"];
  dateKey: string;
}): Summary | null => {
  if (!step || step.type !== "workout" || !user) return null;

  const logExercises = Array.isArray(serverLog?.exercises) ? serverLog.exercises : [];
  const summaryExercises = step.exercises
    .map((exercise) => {
      const logExercise = logExercises.find(
        (item) => item.exerciseId === exercise.id,
      );

      if (!logExercise?.status) return null;

      return {
        ...exercise,
        exerciseId: exercise.id,
        status: logExercise.status,
        actualWeight: logExercise.actualWeight || exercise.weight,
      };
    })
    .filter(
      (
        exercise,
      ): exercise is NonNullable<typeof exercise> =>
        exercise !== null,
    );

  const hasCompletedExercises = summaryExercises.some((exercise) =>
    ["done", "failed", "increased"].includes(exercise.status),
  );

  if (!hasCompletedExercises) return null;

  const totals = summaryExercises.reduce(
    (acc, exercise) => {
      if (exercise.status === "failed") return acc;

      const loadWeight =
        exercise.status === "increased"
          ? Number(exercise.actualWeight || exercise.weight || 0)
          : Number(exercise.weight || exercise.actualWeight || 0);

      const metrics = getExerciseMetrics({
        category: exercise.group as ExerciseCategory,
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
        restTime: exercise.rest,
        bodyWeight: user.weight || 70,
        loadWeight,
        height: user.height || 170,
        age: user.age || 19,
        gender: user.gender || "male",
      });

      return {
        calories: acc.calories + metrics.calories,
        duration: acc.duration + metrics.duration,
        tonnage: acc.tonnage + metrics.tonnage,
      };
    },
    {
      calories: 0,
      duration: 0,
      tonnage: 0,
    },
  );

  return {
    exercises: summaryExercises,
    duration: serverLog?.duration || totals.duration,
    tonnage: totals.tonnage,
    date: dateKey,
    workoutName:
      localizeWorkoutName(step.name, lang) ||
      t("goals.workout.workout_label", {
        letter: getWorkoutLetter(step.label),
      }),
    calories: totals.calories,
  };
};

const WorkoutOverview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [summaryOverride, setSummaryOverride] = useState<Summary | null>(null);

  const { t, lang, weightUnit } = useSettingsStore();
  const { getWorkoutForDate } = useWorkoutStore();
  const user = useAuthStore((state) => state.user)!;

  const today = startOfDay(new Date());
  const dateKey = format(selectedDate, "yyyy-MM-dd");
  const activeWorkoutStep = getWorkoutForDate(selectedDate);
  const isRestDay = !activeWorkoutStep || activeWorkoutStep.type === "rest";
  const isFutureDay = startOfDay(selectedDate) > today;

  const { data: serverLog, refetch: refetchLog } = useQuery({
    queryKey: ["workout-log", dateKey],
    queryFn: async () => {
      const response = await api.get(`/workouts/today?date=${dateKey}`);
      return response.data as WorkoutLogResponse;
    },
    enabled: !!user && !isRestDay && !isFutureDay,
  });

  const totalStats = useMemo(() => {
    const exercises = activeWorkoutStep?.exercises || [];
    return exercises.reduce(
      (acc, ex) => {
        const metrics = getExerciseMetrics({
          category: ex.group as ExerciseCategory,
          sets: Number(ex.sets),
          reps: Number(ex.reps),
          restTime: ex.rest,
          bodyWeight: user?.weight || 70,
          loadWeight: Number(ex.weight),
          height: user?.height || 170,
          age: user?.age || 19,
          gender: user?.gender || "male",
        });

        return {
          calories: acc.calories + metrics.calories,
          duration: acc.duration + metrics.duration,
          tonnage: acc.tonnage + metrics.tonnage,
        };
      },
      { calories: 0, duration: 0, tonnage: 0 }
    );
  }, [activeWorkoutStep, user]);

  useEffect(() => {
    setSummaryOverride(null);
  }, [dateKey]);

  const stableSummary = useMemo(
    () =>
      buildStableSummary({
        step: activeWorkoutStep || undefined,
        serverLog,
        user,
        lang: lang as Language,
        t,
        dateKey,
      }),
    [activeWorkoutStep, dateKey, lang, serverLog, t, user],
  );

  const currentSummary = summaryOverride ?? stableSummary;

  const nextWorkoutInfo = useMemo(() => {
    if (!activeWorkoutStep) return null;

    let nextDate = addDays(selectedDate, 1);
    let nextWorkout = getWorkoutForDate(nextDate);

    while (!nextWorkout || nextWorkout.type === "rest") {
      nextDate = addDays(nextDate, 1);
      nextWorkout = getWorkoutForDate(nextDate);
      if (differenceInDays(nextDate, selectedDate) > 30) break;
    }

    if (!nextWorkout || nextWorkout.type === "rest") {
      return null;
    }

    const distance = formatDistanceStrict(nextDate, selectedDate, {
      locale: dateLocales[lang as keyof typeof dateLocales] || enUS,
      unit: "day",
    });

    return t("goals.workout.workout_window.next_round_msg", {
      workout:
        localizeWorkoutName(nextWorkout?.name, lang) ||
        getWorkoutLetter(nextWorkout?.label) ||
        t("goals.workout.workout_window.next_round"),
      distance,
    });
  }, [activeWorkoutStep, selectedDate, getWorkoutForDate, lang, t]);

  const handleWorkoutFinish = useCallback((summary: Summary | null) => {
    setSummaryOverride(summary);
    refetchLog();
  }, [refetchLog]);

  const dayTimeline = useMemo(() => [
    { label: t("goals.workout.workout_window.yesterday"), date: subDays(today, 1) },
    { label: t("goals.workout.workout_window.today"), date: today },
    { label: t("goals.workout.workout_window.tomorrow"), date: addDays(today, 1) },
  ].map((d) => ({ ...d, workoutStep: getWorkoutForDate(d.date) })), [today, getWorkoutForDate, t]);

  const CardIcon = isRestDay ? Moon : Zap;
  const currentExercises = activeWorkoutStep?.exercises || [];

  return (
    <section className="space-y-8">
      <div className="flex gap-3">
        {dayTimeline.map((d) => {
          const isActive = isSameDay(d.date, selectedDate);
          const step = d.workoutStep;
          return (
            <button
              key={d.label}
              onClick={() => setSelectedDate(new Date(d.date))}
              className={`flex-1 p-4 rounded-4xl border transition-all text-left relative overflow-hidden active:scale-95 ${isActive
                ? "border-brand-accent bg-brand-accent/4 ring-2 ring-brand-accent/10"
                : "border-neutral-100 bg-white hover:border-brand-accent/30 cursor-pointer"
                }`}
            >
              <span className={`block text-[9px] uppercase font-black mb-1 ${isActive ? "text-brand-accent" : "text-neutral-400"}`}>
                {d.label}
              </span>
              <span className={`md:text-lg text-md font-black tracking-tight ${isActive ? "text-neutral-900" : "text-neutral-700"}`}>
                {format(d.date, "dd MMM", { locale: dateLocales[lang as keyof typeof dateLocales] || enUS })}
              </span>
              <p className="text-[8px] font-bold text-neutral-400 mt-1 uppercase truncate leading-none">
                {step?.type === "rest" ? t("goals.workout.workout_window.rest") : localizeWorkoutName(step?.name, lang) || getWorkoutLetter(step?.label) || "---"}
              </p>
            </button>
          );
        })}
      </div>

      <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-neutral-200">
        <CardIcon className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={180} />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div className="md:w-fit w-full md:text-start text-center">
              <p className="text-neutral-400 text-[10px] uppercase font-black tracking-[0.3em] mb-2">
                {t("goals.workout.workout_window.focus")}
                <span className="md:hidden">
                  {" - "}{format(selectedDate, "eeee", { locale: dateLocales[lang as keyof typeof dateLocales] || enUS })}
                </span>
              </p>
              <h3 className="text-3xl font-black leading-none uppercase italic">
                {isRestDay
                  ? t("goals.workout.workout_window.rest_day").split(" - ")[0]
                  : t("goals.workout.workout_label", {
                    letter: getWorkoutLetter(activeWorkoutStep.label),
                  })}
                <br />
                <span className="text-brand-accent text-xl not-italic font-bold uppercase">
                  {localizeWorkoutName(activeWorkoutStep?.name, lang) || t("goals.workout.workout_window.rest_day").split(" - ")[1]}
                </span>
              </h3>
            </div>
            <span className="md:block hidden text-brand-accent text-[10px] uppercase font-black tracking-[0.2em] bg-brand-accent/10 px-3 py-1 rounded-full border border-brand-accent/20">
              {format(selectedDate, "eeee", { locale: dateLocales[lang as keyof typeof dateLocales] || enUS })}
            </span>
          </div>

          <div className="border-t border-white/10 pt-6">
            {isRestDay ? (
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-accent/20 rounded-lg text-brand-accent">
                    <Coffee size={16} />
                  </div>
                  <p className="text-sm font-semibold text-neutral-400">{t("goals.workout.workout_window.rest_msg")}</p>
                </div>
                {nextWorkoutInfo ? (
                  <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                    <div className="text-right">
                      <span className="block text-[8px] font-black text-brand-accent uppercase tracking-[0.2em]">{t("goals.workout.workout_window.next_round")}</span>
                      <p className="text-[10px] font-bold text-white uppercase">{nextWorkoutInfo}</p>
                    </div>
                    <div className="p-2 bg-white/10 rounded-lg text-white"><Dumbbell size={16} /></div>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="flex items-center justify-between w-full md:flex-row flex-col gap-6">
                <div className="flex gap-6">
                  <StatItem label={t("goals.workout.workout_window.calories")} value={`${totalStats.calories} kcal`} icon={<Flame size={12} className="text-orange-500" />} />
                  <div className="w-px h-8 bg-white/10 self-center hidden md:block" />
                  <StatItem label={t("goals.workout.workout_window.time")} value={`${totalStats.duration} min`} icon={<Clock size={12} className="text-brand-accent" />} />
                  <div className="w-px h-8 bg-white/10 self-center hidden md:block" />
                  <StatItem
                    label={t("goals.workout.workout_window.total_volume")}
                    value={`${Number(convertFromKg(totalStats.tonnage, weightUnit).toFixed(0)).toLocaleString()} ${weightUnit}`}
                    icon={<Weight size={12} className="text-blue-500" />}
                  />
                </div>

                <button
                  disabled={!currentSummary}
                  onClick={() => setShowSummaryModal(true)}
                  className={`px-6 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-3 border transition-all duration-300 ${currentSummary
                    ? "bg-brand-accent/15 border-brand-accent/30 text-brand-accent cursor-pointer hover:bg-brand-accent hover:text-white hover:-translate-y-1"
                    : "bg-neutral-800 border-neutral-700 text-neutral-600 opacity-40 cursor-not-allowed"
                    }`}
                >
                  <Trophy size={16} />
                  {currentSummary ? t("goals.workout.workout_window.see_summary") : t("goals.workout.workout_window.locked_summary")}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {!isRestDay && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h4 className="font-black uppercase text-neutral-400 text-[10px] tracking-[0.2em]">
              {t("goals.workout.workout_window.exercise_order")}
            </h4>
            <span className="text-[9px] font-bold bg-neutral-100 text-neutral-500 px-2 py-0.5 rounded-full uppercase">
              {currentExercises.length} {t("goals.workout.workout_window.exercises")}
            </span>
          </div>
          <WorkoutList key={dateKey} step={activeWorkoutStep} date={selectedDate} onFinish={handleWorkoutFinish} />
        </div>
      )}

      {showSummaryModal && currentSummary && activeWorkoutStep && (
        <SummaryModal
          summary={currentSummary}
          onClose={() => setShowSummaryModal(false)}
          workoutLength={activeWorkoutStep.exercises.length}
        />
      )}
    </section>
  );
};

const StatItem = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="flex flex-col md:items-start items-center">
    <span className="flex items-center gap-1 text-[9px] font-black text-neutral-500 uppercase md:mb-1">
      {icon}
      <span className="md:block hidden">{label}</span>
    </span>
    <p className="font-black text-md md:text-xl whitespace-nowrap">{value}</p>
  </div>
);

export default WorkoutOverview;


