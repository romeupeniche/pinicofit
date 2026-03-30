import {
  EXERCISE_CATEGORIES,
  type ExerciseCategory,
} from "../constants/workout-metrics";

interface CalculateProps {
  category: ExerciseCategory;
  sets: number;
  reps: number;
  restTime: string;
  loadWeight: number;
  bodyWeight: number;
  height: number;
  age: number;
  gender: "male" | "female" | "other";
}

export const getExerciseMetrics = ({
  category,
  sets,
  reps,
  restTime,
  loadWeight,
  bodyWeight,
  height,
  age,
  gender,
}: CalculateProps) => {
  const [min, sec] = restTime.split(":").map(Number);
  const restInMin = min + sec / 60;
  const executionInMin = (reps * 4) / 60;
  const totalDurationMin = sets * (executionInMin + restInMin);
  const bmr =
    gender === "female"
      ? 10 * bodyWeight + 6.25 * height - 5 * age - 161
      : 10 * bodyWeight + 6.25 * height - 5 * age + 5;

  const bmrPerMin = bmr / 1440;
  const met = EXERCISE_CATEGORIES[category].met;

  const totalKcalPerMinute = (met * 3.5 * bodyWeight) / 200;
  const activeKcalPerMinute = totalKcalPerMinute - bmrPerMin;

  const rawCalories = Math.max(0, activeKcalPerMinute * totalDurationMin);
  const roundedCalories = Math.ceil(rawCalories / 5) * 5;
  const roundedDuration = Math.ceil(totalDurationMin / 5) * 5;

  return {
    calories: roundedCalories,
    duration: roundedDuration,
    tonnage: sets * reps * loadWeight,
  };
};
