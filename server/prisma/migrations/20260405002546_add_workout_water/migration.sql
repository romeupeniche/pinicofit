-- AlterTable
ALTER TABLE "User" ADD COLUMN     "waterGoal" INTEGER NOT NULL DEFAULT 2000;

-- CreateTable
CREATE TABLE "WorkoutPreset" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "exercises" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkoutPreset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkoutSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "state" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WorkoutSettings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkoutSettings_userId_key" ON "WorkoutSettings"("userId");

-- AddForeignKey
ALTER TABLE "WorkoutPreset" ADD CONSTRAINT "WorkoutPreset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkoutSettings" ADD CONSTRAINT "WorkoutSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
