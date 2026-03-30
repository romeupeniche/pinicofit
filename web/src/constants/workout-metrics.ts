export const EXERCISE_CATEGORIES = {
  LEGS_COMPOUND: { label: "goals.workout.metrics.legs_compound", met: 7.0 }, // Agachamento, Leg Press
  LEGS_ISOLATED: { label: "goals.workout.metrics.legs_isolated", met: 4.5 }, // Extensora, Flexora
  BACK_COMPOUND: { label: "goals.workout.metrics.back_compound", met: 6.0 }, // Remadas, Puxadas
  CHEST_COMPOUND: { label: "goals.workout.metrics.chest_compound", met: 6.0 }, // Supinos
  SHOULDERS: { label: "goals.workout.metrics.shoulders", met: 5.0 }, // Desenvolvimentos
  BICEPS_ISOLATED: { label: "goals.workout.metrics.biceps_isolated", met: 3.5 }, // Rosca Direta/Halter
  TRICEPS_ISOLATED: {
    label: "goals.workout.metrics.triceps_isolated",
    met: 3.8,
  }, // Pulley, Testa
  ABS_CORE: { label: "goals.workout.metrics.abs_core", met: 3.0 }, // Crunches, Prancha

  CALI_UPPER_COMPOUND: {
    label: "goals.workout.metrics.cali_upper_compound",
    met: 7.5,
  }, // Pull-ups, Dips, Flexão Arqueiro
  CALI_LOWER_COMPOUND: {
    label: "goals.workout.metrics.cali_lower_compound",
    met: 7.5,
  }, // Pistol Squat, Avanço
  CALI_CORE_ADVANCED: {
    label: "goals.workout.metrics.cali_core_advanced",
    met: 5.0,
  }, // L-Sit, Dragon Flag

  CARDIO_HIIT: { label: "goals.workout.metrics.cardio_hiit", met: 10.0 },
  CARDIO_STEADY: { label: "goals.workout.metrics.cardio_steady", met: 7.0 },

  OTHER: { label: "goals.workout.metrics.other", met: 4.0 },
} as const;

export type ExerciseCategory = keyof typeof EXERCISE_CATEGORIES;
