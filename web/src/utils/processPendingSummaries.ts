import type { ExerciseCategory } from "../constants/workout-metrics";
import type { IExercise } from "../schemas/WorkoutGoal";
import type {
  ExerciseStatus,
  ICycleStep,
  IExerciseLog,
} from "../store/goals/workoutStore";
import type { User } from "../types/auth";
import { getExerciseMetrics } from "./getExerciseMetrics";

interface ProcessProps {
  dateToProcess: string;
  logs: IExerciseLog[];
  activeWorkout: ICycleStep;
  userSettings: User;
}

type SummaryExercises = (IExercise & {
  status: ExerciseStatus;
  actualWeight: string;
})[];

export interface Summary {
  date: string;
  calories: number;
  duration: number;
  tonnage: number;
  workoutName: string;
  exercises: SummaryExercises;
}

const processPendingSummaries = ({
  dateToProcess,
  logs,
  activeWorkout,
  userSettings,
}: ProcessProps): Summary | null => {
  const dayLogs = logs.filter((l) => l.date === dateToProcess);

  if (dayLogs.length === 0 || activeWorkout.type !== "workout") return null;

  let dayTotalCalories = 0;
  let dayTotalDuration = 0;
  let dayTotalTonnage = 0;

  const completedExercises: SummaryExercises = [];

  activeWorkout.exercises.forEach((ex) => {
    const log = dayLogs.find((l) => l.exerciseId === ex.id);
    if (log && (log.status === "done" || log.status === "increased")) {
      const metrics = getExerciseMetrics({
        category: ex.group as ExerciseCategory,
        sets: Number(ex.sets),
        reps: Number(ex.reps),
        restTime: ex.rest,
        loadWeight: Number(log.actualWeight || ex.weight || 0),
        bodyWeight: userSettings.weight!,
        height: userSettings.height!,
        age: userSettings.age!,
        gender: userSettings.gender!,
      });

      dayTotalCalories += metrics.calories;
      dayTotalDuration += metrics.duration;
      dayTotalTonnage += metrics.tonnage;

      completedExercises.push({
        ...ex,
        actualWeight: log.actualWeight || ex.weight,
        status: log.status,
      });
    }
  });

  if (completedExercises.length === 0) return null;

  return {
    date: dateToProcess,
    calories: dayTotalCalories,
    duration: dayTotalDuration,
    tonnage: dayTotalTonnage,
    workoutName: activeWorkout.name,
    exercises: completedExercises,
  };
};

export default processPendingSummaries;
