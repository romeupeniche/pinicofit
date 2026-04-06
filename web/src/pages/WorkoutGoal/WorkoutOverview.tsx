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
import { useWorkoutStore } from "../../store/goals/workoutStore";
import { useAuthStore } from "../../store/authStore";
import WorkoutList from "./WorkoutList";
import { convertFromKg } from "../../utils/weightUnitConverter";
import type { Summary } from "../../utils/processPendingSummaries";
import SummaryModal from "./SummaryModal";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../services/api";

const dateLocales = { en: enUS, br: ptBR, es };

const WorkoutOverview: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [todaySummary, setTodaySummary] = useState<Summary | null>(null);

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
      return response.data;
    },
    enabled: !!user && !isRestDay && !isFutureDay,
  });

  useEffect(() => {
    const hasCompletedExercises =
      Array.isArray(serverLog?.exercises) &&
      serverLog.exercises.some((exercise: { status?: string }) =>
        ["done", "failed", "increased"].includes(exercise.status || ""),
      );

    if (serverLog && hasCompletedExercises) {
      setTodaySummary({
        exercises: serverLog.exercises,
        duration: serverLog.duration,
        tonnage: 0,
        date: serverLog.date,
      } as any);
    } else {
      setTodaySummary(null);
    }
  }, [serverLog]);

  const nextWorkoutInfo = useMemo(() => {
    let nextDate = addDays(selectedDate, 1);
    let nextWorkout = getWorkoutForDate(nextDate);

    while (!nextWorkout || nextWorkout.type === "rest") {
      nextDate = addDays(nextDate, 1);
      nextWorkout = getWorkoutForDate(nextDate);
      if (differenceInDays(nextDate, selectedDate) > 30) break;
    }

    const distance = formatDistanceStrict(nextDate, selectedDate, {
      locale: dateLocales[lang as keyof typeof dateLocales] || enUS,
      unit: "day",
    });

    return t("goals.workout.workout_window.next_round_msg", {
      workout: nextWorkout?.name || nextWorkout?.label || "Próximo",
      distance,
    });
  }, [selectedDate, getWorkoutForDate, lang, t]);

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

  const handleWorkoutFinish = useCallback((summary: Summary | null) => {
    setTodaySummary(summary);
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
    <section className="space-y-8 animate-in fade-in duration-500">
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
                {step?.type === "rest" ? t("goals.workout.workout_window.rest") : step?.name || step?.label || "---"}
              </p>
            </button>
          );
        })}
      </div>

      <div className="bg-neutral-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-neutral-200">
        <CardIcon className="absolute -right-8 -bottom-8 text-white/5 rotate-12" size={180} />

        <div className="relative z-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-neutral-400 text-[10px] uppercase font-black tracking-[0.3em] mb-2">
                {t("goals.workout.workout_window.focus")}
              </p>
              <h3 className="text-3xl font-black leading-none uppercase italic">
                {isRestDay
                  ? t("goals.workout.workout_window.rest_day").split(" - ")[0]
                  : t("goals.workout.workout_label", { letter: activeWorkoutStep.label })}
                <br />
                <span className="text-brand-accent text-xl not-italic font-bold uppercase">
                  {activeWorkoutStep?.name || t("goals.workout.workout_window.rest_day").split(" - ")[1]}
                </span>
              </h3>
            </div>
            <span className="text-brand-accent text-[10px] uppercase font-black tracking-[0.2em] bg-brand-accent/10 px-3 py-1 rounded-full border border-brand-accent/20">
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
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                  <div className="text-right">
                    <span className="block text-[8px] font-black text-brand-accent uppercase tracking-[0.2em]">{t("goals.workout.workout_window.next_round")}</span>
                    <p className="text-[10px] font-bold text-white uppercase">{nextWorkoutInfo}</p>
                  </div>
                  <div className="p-2 bg-white/10 rounded-lg text-white"><Dumbbell size={16} /></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between w-full md:flex-row flex-col gap-6">
                <div className="flex gap-6">
                  <StatItem label={t("goals.workout.workout_window.calories")} value={`${totalStats.calories} kcal`} icon={<Flame size={12} className="text-orange-500" />} />
                  <div className="w-px h-8 bg-white/10 self-center" />
                  <StatItem label={t("goals.workout.workout_window.time")} value={`${totalStats.duration} min`} icon={<Clock size={12} className="text-brand-accent" />} />
                  <div className="w-px h-8 bg-white/10 self-center" />
                  <StatItem
                    label={t("goals.workout.workout_window.total_volume")}
                    value={`${Number(convertFromKg(totalStats.tonnage, weightUnit).toFixed(0)).toLocaleString()} ${weightUnit}`}
                    icon={<Weight size={12} className="text-blue-500" />}
                  />
                </div>

                <button
                  disabled={!todaySummary}
                  onClick={() => setShowSummaryModal(true)}
                  className={`px-6 py-3 rounded-2xl font-black uppercase text-xs flex items-center gap-3 border transition-all duration-300 ${todaySummary
                    ? "bg-brand-accent/15 border-brand-accent/30 text-brand-accent cursor-pointer hover:bg-brand-accent hover:text-white hover:-translate-y-1"
                    : "bg-neutral-800 border-neutral-700 text-neutral-600 opacity-40 cursor-not-allowed"
                    }`}
                >
                  <Trophy size={16} />
                  {todaySummary ? t("goals.workout.workout_window.see_summary") : t("goals.workout.workout_window.locked_summary")}
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

      {showSummaryModal && todaySummary && activeWorkoutStep && (
        <SummaryModal
          summary={todaySummary}
          onClose={() => setShowSummaryModal(false)}
          workoutLength={activeWorkoutStep.exercises.length}
        />
      )}
    </section>
  );
};

const StatItem = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div>
    <span className="flex items-center gap-1 text-[9px] font-black text-neutral-500 uppercase mb-1">
      {icon} {label}
    </span>
    <p className="font-black text-xl whitespace-nowrap">{value}</p>
  </div>
);

export default WorkoutOverview;
