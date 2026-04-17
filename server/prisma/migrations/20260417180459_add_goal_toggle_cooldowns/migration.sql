-- AlterTable
ALTER TABLE "UserPreferences" ADD COLUMN     "nutritionCooldownUntil" TIMESTAMP(3),
ADD COLUMN     "nutritionDeactivatedAt" TIMESTAMP(3),
ADD COLUMN     "sleepCooldownUntil" TIMESTAMP(3),
ADD COLUMN     "sleepDeactivatedAt" TIMESTAMP(3),
ADD COLUMN     "tasksCooldownUntil" TIMESTAMP(3),
ADD COLUMN     "tasksDeactivatedAt" TIMESTAMP(3),
ADD COLUMN     "waterCooldownUntil" TIMESTAMP(3),
ADD COLUMN     "waterDeactivatedAt" TIMESTAMP(3),
ADD COLUMN     "workoutCooldownUntil" TIMESTAMP(3),
ADD COLUMN     "workoutDeactivatedAt" TIMESTAMP(3);
