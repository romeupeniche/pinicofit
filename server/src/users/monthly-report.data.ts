import type { PrismaService } from 'src/prisma/prisma.service';
import type { MonthlyReportData, MailLang } from './monthly-report.builder';

type ProfileRecord = Record<string, unknown>;

interface PerfectMatch {
  key: string;
  isPerfect: boolean;
  totalError: number;
}

const dateKey = (value: unknown) => {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const asString = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(asString)) return asString;
  try {
    return new Date(asString).toISOString().slice(0, 10);
  } catch {
    return '';
  }
};

const previousMonthRange = (reference = new Date()) => {
  const start = new Date(
    reference.getFullYear(),
    reference.getMonth() - 1,
    1,
    0,
    0,
    0,
    0,
  );
  const end = new Date(
    reference.getFullYear(),
    reference.getMonth(),
    0,
    23,
    59,
    59,
    999,
  );

  return {
    start,
    end,
    daysInMonth: end.getDate(),
    monthKey: `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}`,
  };
};

const formatDateLabel = (value: string, lang: MailLang) => {
  try {
    return new Intl.DateTimeFormat(
      lang === 'br' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US',
      { day: '2-digit', month: 'short' },
    ).format(new Date(`${value}T12:00:00`));
  } catch {
    return value;
  }
};

const formatMonthLabel = (date: Date, lang: MailLang) =>
  new Intl.DateTimeFormat(
    lang === 'br' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US',
    { month: 'long', year: 'numeric' },
  ).format(date);

const formatWindowLabel = (startHour: number, lang: MailLang) => {
  const endHour = Math.min(startHour + 3, 23);
  const separator = lang === 'en' ? 'to' : 'e';
  return `${String(startHour).padStart(2, '0')}h ${separator} ${String(endHour).padStart(2, '0')}h`;
};

const weekdayLabel = (index: number, lang: MailLang) =>
  new Intl.DateTimeFormat(
    lang === 'br' ? 'pt-BR' : lang === 'es' ? 'es-ES' : 'en-US',
    { weekday: 'long' },
  ).format(new Date(Date.UTC(2026, 0, 4 + index)));

const localizeMacroName = (
  macro: 'protein' | 'carbs' | 'fat',
  lang: MailLang,
) =>
  ({
    en: { protein: 'protein', carbs: 'carbohydrates', fat: 'fat' },
    br: { protein: 'proteína', carbs: 'carboidratos', fat: 'gordura' },
    es: { protein: 'proteína', carbs: 'carbohidratos', fat: 'grasa' },
  })[lang][macro];

const localizeGroupName = (group: string | undefined, lang: MailLang) => {
  const normalized = String(group || 'default')
    .split('_')[0]
    .toLowerCase();
  const labels = {
    en: {
      chest: 'Chest',
      triceps: 'Triceps',
      back: 'Back',
      biceps: 'Biceps',
      legs: 'Legs',
      shoulders: 'Shoulders',
      glutes: 'Glutes',
      core: 'Core',
      default: 'Training focus',
    },
    br: {
      chest: 'Peito',
      triceps: 'Tríceps',
      back: 'Costas',
      biceps: 'Bíceps',
      legs: 'Perna',
      shoulders: 'Ombros',
      glutes: 'Glúteos',
      core: 'Core',
      default: 'Foco do treino',
    },
    es: {
      chest: 'Pecho',
      triceps: 'Tríceps',
      back: 'Espalda',
      biceps: 'Bíceps',
      legs: 'Pierna',
      shoulders: 'Hombros',
      glutes: 'Glúteos',
      core: 'Core',
      default: 'Foco del entrenamiento',
    },
  } as const;

  return (
    labels[lang][normalized as keyof (typeof labels)['en']] ||
    group ||
    labels[lang].default
  );
};

const extractWorkoutMetadata = (
  state: Record<string, unknown>,
  lang: MailLang,
) => {
  const metadata = new Map<
    string,
    { name: string; group: string; weight: number; sets: number; reps: number }
  >();

  const ingestCycle = (cycle: unknown) => {
    if (!Array.isArray(cycle)) return;
    cycle.forEach((step) => {
      if (!step || typeof step !== 'object') return;
      const exercises = (step as any).exercises;
      if (!Array.isArray(exercises)) return;
      exercises.forEach((exercise) => {
        if (!exercise || typeof exercise !== 'object') return;
        const record = exercise as any;
        const id = String(record.id || '');
        if (!id) return;
        metadata.set(id, {
          name: String(
            record.name || localizeGroupName(String(record.group || ''), lang),
          ),
          group: String(record.group || 'default'),
          weight: Number(record.weight || 0),
          sets: Number(record.sets || 0),
          reps: Number(record.reps || 0),
        });
      });
    });
  };

  ingestCycle(state.cycle);
  if (Array.isArray(state.history)) {
    state.history.forEach((item: any) => ingestCycle(item?.cycle));
  }
  if (Array.isArray(state.summaries)) {
    state.summaries.forEach((summary: any) => {
      const exercises = summary?.exercises;
      if (Array.isArray(exercises)) {
        exercises.forEach((ex: any) => {
          const id = String(ex.id || ex.exerciseId || '');
          if (!id) return;
          metadata.set(id, {
            name: String(ex.name || metadata.get(id)?.name || 'Exercise'),
            group: String(ex.group || metadata.get(id)?.group || 'default'),
            weight: Number(ex.weight || metadata.get(id)?.weight || 0),
            sets: Number(ex.sets || metadata.get(id)?.sets || 0),
            reps: Number(ex.reps || metadata.get(id)?.reps || 0),
          });
        });
      }
    });
  }
  return metadata;
};

export const createMonthlyReportDataset = async ({
  prisma,
  userId,
  profile,
  lang,
}: {
  prisma: PrismaService;
  userId: string;
  profile: ProfileRecord;
  lang: MailLang;
}): Promise<MonthlyReportData> => {
  const { start, end, monthKey, daysInMonth } = previousMonthRange();

  const [workoutSettings, meals, waterLogs, sleepRows] = await Promise.all([
    prisma.workoutSettings.findUnique({ where: { userId } }),
    prisma.dailyFoodLog.findMany({
      where: { userId, date: { gte: start, lte: end } },
      include: { food: true },
      orderBy: { date: 'asc' },
    }),
    prisma.waterLog.findMany({
      where: { userId, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    }),
    prisma.sleepLog.findMany({
      where: { userId, date: { gte: start, lte: end } },
      orderBy: { date: 'asc' },
    }),
  ]);

  const settingsState =
    (workoutSettings?.state as Record<string, unknown> | null) || {};

  const summaries = Array.isArray(settingsState.summaries)
    ? settingsState.summaries.filter((s: any) => {
        const key = dateKey(s?.date);
        return key >= `${monthKey}-01` && key <= dateKey(end);
      })
    : [];

  const logs = Array.isArray(settingsState.logs)
    ? settingsState.logs.filter((l: any) => {
        const key = dateKey(l?.date);
        return key >= `${monthKey}-01` && key <= dateKey(end);
      })
    : [];

  const exerciseMeta = extractWorkoutMetadata(settingsState, lang);
  const allDayKeys = Array.from({ length: daysInMonth }, (_, i) =>
    dateKey(new Date(start.getFullYear(), start.getMonth(), i + 1, 12)),
  );

  const nutritionByDay = new Map<
    string,
    { kcal: number; protein: number; carbs: number; fat: number }
  >();
  const foodTotals = new Map<string, number>();

  meals.forEach((entry) => {
    const key = dateKey(entry.date);
    const bucket = nutritionByDay.get(key) || {
      kcal: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
    };
    bucket.kcal += Number(entry.kcal || 0);
    bucket.protein += Number(entry.protein || 0);
    bucket.carbs += Number(entry.carbs || 0);
    bucket.fat += Number(entry.fat || 0);
    nutritionByDay.set(key, bucket);

    const localizedName =
      lang === 'br'
        ? entry.food.brName
        : lang === 'es'
          ? entry.food.esName
          : entry.food.enName;
    foodTotals.set(
      localizedName,
      (foodTotals.get(localizedName) || 0) + Number(entry.kcal || 0),
    );
  });

  const workoutDayStats = new Map<
    string,
    { done: number; increased: number; failed: number }
  >();
  const progressionGroupCounts = new Map<string, number>();
  const progressionExerciseCounts = new Map<string, number>();
  const failedGroupCounts = new Map<string, number>();
  const failedExerciseCounts = new Map<string, number>();

  let totalCompletedExercises = 0,
    totalIncreasedExercises = 0,
    totalFailedExercises = 0;
  let plannedIncreaseVolume = 0,
    actualIncreaseVolume = 0;

  logs.forEach((log: any) => {
    const key = dateKey(log.date);
    const status = String(log.status || '');
    const meta = exerciseMeta.get(String(log.exerciseId || ''));
    const day = workoutDayStats.get(key) || {
      done: 0,
      increased: 0,
      failed: 0,
    };

    if (status === 'done') {
      day.done += 1;
      totalCompletedExercises += 1;
    } else if (status === 'increased') {
      day.increased += 1;
      totalIncreasedExercises += 1;
      const group = localizeGroupName(meta?.group, lang);
      progressionGroupCounts.set(
        group,
        (progressionGroupCounts.get(group) || 0) + 1,
      );
      progressionExerciseCounts.set(
        meta?.name || 'Exercise',
        (progressionExerciseCounts.get(meta?.name || 'Exercise') || 0) + 1,
      );

      const plannedWeight = meta?.weight || 0;
      const actualWeight = Number(log.actualWeight || plannedWeight);
      plannedIncreaseVolume +=
        plannedWeight * (meta?.sets || 0) * (meta?.reps || 0);
      actualIncreaseVolume +=
        actualWeight * (meta?.sets || 0) * (meta?.reps || 0);
    } else if (status === 'failed') {
      day.failed += 1;
      totalFailedExercises += 1;
      const group = localizeGroupName(meta?.group, lang);
      failedGroupCounts.set(group, (failedGroupCounts.get(group) || 0) + 1);
      failedExerciseCounts.set(
        meta?.name || 'Exercise',
        (failedExerciseCounts.get(meta?.name || 'Exercise') || 0) + 1,
      );
    }
    workoutDayStats.set(key, day);
  });

  const summaryVolumeByGroup = new Map<string, number>();
  let totalWorkoutVolumeKg = 0,
    totalWorkoutCalories = 0,
    totalWorkoutMinutes = 0;

  summaries.forEach((s: any) => {
    totalWorkoutVolumeKg += Number(s.tonnage || 0);
    totalWorkoutCalories += Number(s.calories || 0);
    totalWorkoutMinutes += Number(s.duration || 0);
    (s.exercises || []).forEach((ex: any) => {
      if (ex.status === 'failed') return;
      const group = localizeGroupName(ex.group, lang);
      const weight =
        ex.status === 'increased' ? ex.actualWeight || ex.weight : ex.weight;
      const volume = (ex.sets || 0) * (ex.reps || 0) * (weight || 0);
      summaryVolumeByGroup.set(
        group,
        (summaryVolumeByGroup.get(group) || 0) + volume,
      );
    });
  });

  const getTop = (map: Map<string, number>, fallback: string) => {
    const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]);
    return { label: sorted[0]?.[0] || fallback, count: sorted[0]?.[1] || 0 };
  };

  const waterByDay = new Map<string, number>();
  const waterByHour = new Array(24).fill(0);
  waterLogs.forEach((l) => {
    const key = dateKey(l.date);
    waterByDay.set(key, (waterByDay.get(key) || 0) + Number(l.amount || 0));
    waterByHour[new Date(l.date).getHours()] += Number(l.amount || 0);
  });

  let peakWindowStart = 0,
    peakWindowValue = 0;
  for (let h = 0; h <= 20; h++) {
    const total = waterByHour.slice(h, h + 4).reduce((a, b) => a + b, 0);
    if (total > peakWindowValue) {
      peakWindowValue = total;
      peakWindowStart = h;
    }
  }

  const goalMl = Number(profile.waterGoal || 2000);
  const goalHitDays = allDayKeys.filter(
    (k) => (waterByDay.get(k) || 0) >= goalMl,
  ).length;

  const calorieGoal = Number(profile.calorieGoal || 0);
  const proteinGoal = Number(profile.proteinGoal || 0);
  const carbsGoal = Number(profile.carbsGoal || 0);
  const fatGoal = Number(profile.fatGoal || 0);

  const calorieAdherenceDays = [...nutritionByDay.entries()].filter(([, d]) =>
    calorieGoal > 0
      ? Math.abs(d.kcal - calorieGoal) <= calorieGoal * 0.1
      : false,
  ).length;

  const macroMisses = { protein: 0, carbs: 0, fat: 0 };
  let perfectMatchBest: PerfectMatch | null = null;

  nutritionByDay.forEach((day, key) => {
    const pE =
      proteinGoal > 0 ? Math.abs(day.protein - proteinGoal) / proteinGoal : 0;
    const cE = carbsGoal > 0 ? Math.abs(day.carbs - carbsGoal) / carbsGoal : 0;
    const fE = fatGoal > 0 ? Math.abs(day.fat - fatGoal) / fatGoal : 0;

    if (proteinGoal > 0 && day.protein < proteinGoal) macroMisses.protein++;
    if (carbsGoal > 0 && day.carbs < carbsGoal) macroMisses.carbs++;
    if (fatGoal > 0 && day.fat < fatGoal) macroMisses.fat++;

    const isPerfect = pE <= 0.02 && cE <= 0.02 && fE <= 0.02;
    const totalError = pE + cE + fE;

    if (
      !perfectMatchBest ||
      (isPerfect && !perfectMatchBest.isPerfect) ||
      totalError < perfectMatchBest.totalError
    ) {
      perfectMatchBest = { key, isPerfect, totalError } as PerfectMatch;
    }
  });

  const comboDays = allDayKeys.filter((key) => {
    const waterOk = (waterByDay.get(key) || 0) >= goalMl;
    const calOk =
      calorieGoal > 0
        ? Math.abs((nutritionByDay.get(key)?.kcal || 0) - calorieGoal) <=
          calorieGoal * 0.1
        : false;
    const w = workoutDayStats.get(key);
    const workOk = !!(w && w.failed === 0 && w.done + w.increased > 0);
    return waterOk && calOk && workOk;
  });

  let longestStreak = 0,
    currentStreak = 0;
  allDayKeys.forEach((k) => {
    if (comboDays.includes(k)) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else currentStreak = 0;
  });

  const workoutEfficiency =
    totalCompletedExercises + totalIncreasedExercises + totalFailedExercises > 0
      ? ((totalCompletedExercises + totalIncreasedExercises) /
          (totalCompletedExercises +
            totalIncreasedExercises +
            totalFailedExercises)) *
        100
      : 0;

  return {
    monthLabel: formatMonthLabel(start, lang),
    scoreCards: {
      disciplineScore: Math.round(
        ((goalHitDays / daysInMonth) * 100 +
          (calorieAdherenceDays / daysInMonth) * 100 +
          workoutEfficiency) /
          3,
      ),
      dietAdherence: Math.round((calorieAdherenceDays / daysInMonth) * 100),
      hydrationAverageLiters:
        [...waterByDay.values()].reduce((a, b) => a + b, 0) /
        1000 /
        daysInMonth,
      workoutEfficiency: Math.round(workoutEfficiency),
    },
    workout: {
      totalVolumeTons: totalWorkoutVolumeKg / 1000,
      caloriesBurned: totalWorkoutCalories,
      totalHours: Math.floor(totalWorkoutMinutes / 60),
      totalMinutes: totalWorkoutMinutes % 60,
      trainingDays: workoutDayStats.size,
      restDays: Math.max(0, daysInMonth - workoutDayStats.size),
      completedExercises: totalCompletedExercises,
      loadIncreases: totalIncreasedExercises,
      failedExercises: totalFailedExercises,
      progressionGroupName: getTop(progressionGroupCounts, 'Default').label,
      progressionGroupCount: getTop(progressionGroupCounts, 'Default').count,
      progressionExerciseName: getTop(progressionExerciseCounts, 'Exercise')
        .label,
      progressionExerciseCount: getTop(progressionExerciseCounts, 'Exercise')
        .count,
      volumeIncreasePercent:
        plannedIncreaseVolume > 0
          ? ((actualIncreaseVolume - plannedIncreaseVolume) /
              plannedIncreaseVolume) *
            100
          : 0,
      frictionGroupName: getTop(failedGroupCounts, 'Default').label,
      frictionGroupCount: getTop(failedGroupCounts, 'Default').count,
      frictionExerciseName: getTop(failedExerciseCounts, 'Exercise').label,
      completedDays: Array.from(workoutDayStats.values()).filter(
        (d) => d.failed === 0,
      ).length,
      failedDays: Array.from(workoutDayStats.values()).filter(
        (d) => d.failed > 0,
      ).length,
      focusGroupName: getTop(summaryVolumeByGroup, 'Default').label,
      focusVolumeShare:
        totalWorkoutVolumeKg > 0
          ? (getTop(summaryVolumeByGroup, '').count / totalWorkoutVolumeKg) *
            100
          : 0,
    },
    water: {
      goalLiters: goalMl / 1000,
      goalHitDays,
      adherenceRate: (goalHitDays / daysInMonth) * 100,
      peakWindowLabel: formatWindowLabel(peakWindowStart, lang),
      eveningDropPercent: 0,
      trainingDayHydrationLift: 0,
      peakDateLabel: formatDateLabel(allDayKeys[0], lang),
      peakLiters: 0,
      peakContext: '',
    },
    sleep: {
      averageHours: sleepRows.length
        ? sleepRows.reduce((a, b) => a + Number(b.durationHours || 0), 0) /
          sleepRows.length
        : 0,
      belowSixHoursDays: sleepRows.filter((s) => Number(s.durationHours) < 6)
        .length,
      consistentNights: 0,
      volumeBoostAfterConsistentNights: 0,
      weekendVariationHours: 0,
      topSleepHours: 0,
      topSleepCount: 0,
    },
    nutrition: {
      calorieAdherenceDays,
      topFoods: [...foodTotals.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([n]) => n),
      topFoodsShare: 0,
      hardestMacroName: localizeMacroName(
        Object.entries(macroMisses).sort((a, b) => b[1] - a[1])[0][0] as any,
        lang,
      ),
      hardestMacroMissRate:
        (Math.max(...Object.values(macroMisses)) / (nutritionByDay.size || 1)) *
        100,
      perfectMatchDateLabel: formatDateLabel(
        (perfectMatchBest as unknown as PerfectMatch)?.key || allDayKeys[0],
        lang,
      ),
      perfectMatchAvailable:
        !!(perfectMatchBest as unknown as PerfectMatch)?.isPerfect || false,
      failedWorkoutMacroName: localizeMacroName('carbs', lang),
      failedWorkoutMacroDelta: 0,
    },
    habits: {
      syncDays: comboDays.length,
      longestStreak,
      ruptureWeekdayLabel: weekdayLabel(4, lang),
      restDietConsistency: 0,
    },
  } as MonthlyReportData;
};

export const getMonthlyReportMonthKey = () => previousMonthRange().monthKey;
