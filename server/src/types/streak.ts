export type FlameLevel = "low" | "streak" | "max";

export type StreakMeResponse = {
  streak: number;
  livesRemaining: number;
  maxLivesPerMonth: number;
  flameLevel: FlameLevel;
};

