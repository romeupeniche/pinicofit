-- Simplify nutrition preferences:
-- - Replace macro/calorie toggles with a single nutritionTolerance
-- - Preserve existing tolerance values by renaming the column

-- Rename existing tolerance column to keep data
ALTER TABLE "UserPreferences" RENAME COLUMN "calorieTolerance" TO "nutritionTolerance";

-- Ensure defaults/constraints match Prisma schema
ALTER TABLE "UserPreferences" ALTER COLUMN "nutritionTolerance" SET DEFAULT 95;
ALTER TABLE "UserPreferences" ALTER COLUMN "nutritionTolerance" SET NOT NULL;

-- Drop macro/calorie enabled toggles (nutritionEnabled remains the master toggle)
ALTER TABLE "UserPreferences"
  DROP COLUMN "calorieEnabled",
  DROP COLUMN "proteinEnabled",
  DROP COLUMN "carbsEnabled",
  DROP COLUMN "fatEnabled";

