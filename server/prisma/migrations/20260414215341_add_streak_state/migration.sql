-- CreateEnum
CREATE TYPE "FlameLevel" AS ENUM ('low', 'streak', 'max');

-- CreateTable
CREATE TABLE "UserStreak" (
    "userId" TEXT NOT NULL,
    "streakCount" INTEGER NOT NULL DEFAULT 0,
    "livesRemaining" INTEGER NOT NULL DEFAULT 5,
    "maxLivesPerMonth" INTEGER NOT NULL DEFAULT 5,
    "flameLevel" "FlameLevel" NOT NULL DEFAULT 'low',
    "lastProcessedDate" DATE,
    "livesMonthKey" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStreak_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "UserStreakDay" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "contractMet" BOOLEAN NOT NULL DEFAULT false,
    "missingGoals" JSONB NOT NULL DEFAULT '[]',
    "lifeUsed" BOOLEAN NOT NULL DEFAULT false,
    "streakBefore" INTEGER NOT NULL DEFAULT 0,
    "streakAfter" INTEGER NOT NULL DEFAULT 0,
    "livesBefore" INTEGER NOT NULL DEFAULT 0,
    "livesAfter" INTEGER NOT NULL DEFAULT 0,
    "evaluatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserStreakDay_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserStreak_userId_key" ON "UserStreak"("userId");

-- CreateIndex
CREATE INDEX "UserStreakDay_userId_date_idx" ON "UserStreakDay"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "UserStreakDay_userId_date_key" ON "UserStreakDay"("userId", "date");

-- AddForeignKey
ALTER TABLE "UserStreak" ADD CONSTRAINT "UserStreak_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserStreakDay" ADD CONSTRAINT "UserStreakDay_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserStreak"("userId") ON DELETE CASCADE ON UPDATE CASCADE;
