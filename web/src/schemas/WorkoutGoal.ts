import { z } from "zod";
import {
  EXERCISE_CATEGORIES,
  type ExerciseCategory,
} from "../constants/workout-metrics";

const exerciseSchema = z.object({
  id: z.string(),
  group: z.enum(
    Object.keys(EXERCISE_CATEGORIES) as [
      ExerciseCategory,
      ...ExerciseCategory[],
    ],
  ),
  category: z.enum(["warmup", "exercise"]),
  name: z.string().min(1),
  weight: z
    .string()
    .min(1)
    .regex(/^\d*([.,]\d+)?$/)
    .default("0"),
  technique: z.enum(["standard", "Bi-set", "Drop-set", "Rest-Pause"]),
  sets: z.string().min(1).regex(/^\d+$/),
  reps: z.string().min(1).regex(/^\d+$/),
  rest: z
    .string()
    .min(3)
    .regex(/^\d{1,2}:[0-5]\d$/),
  obs: z.string().default(""),
});

export const workoutSchema = z.object({
  name: z.string().min(1),
  exercises: z.array(exerciseSchema),
});

export type WorkoutFormValues = z.infer<typeof workoutSchema>;

export type IExercise = z.infer<typeof exerciseSchema>;
