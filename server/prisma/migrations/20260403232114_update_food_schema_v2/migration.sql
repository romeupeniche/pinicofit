/*
  Warnings:

  - You are about to drop the column `translations` on the `Food` table. All the data in the column will be lost.
  - Added the required column `brName` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enName` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `esName` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sugar` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Made the column `fiber` on table `Food` required. This step will fail if there are existing NULL values in that column.
  - Made the column `sodium` on table `Food` required. This step will fail if there are existing NULL values in that column.
  - Changed the type of `category` on the `Food` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "FoodSource" AS ENUM ('TACO', 'PINICODB', 'USER');

-- CreateEnum
CREATE TYPE "FoodCategory" AS ENUM ('beverage', 'fast_food', 'dessert', 'fruit', 'side_dish', 'protein', 'powders_flours', 'vegetables_greens', 'sauces_condiments', 'dairy', 'snack');

-- AlterTable
ALTER TABLE "Food" DROP COLUMN "translations",
ADD COLUMN     "brName" TEXT NOT NULL,
ADD COLUMN     "enName" TEXT NOT NULL,
ADD COLUMN     "esName" TEXT NOT NULL,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "source" "FoodSource" NOT NULL DEFAULT 'PINICODB',
ADD COLUMN     "sugar" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "useML" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "fiber" SET NOT NULL,
ALTER COLUMN "sodium" SET NOT NULL,
DROP COLUMN "category",
ADD COLUMN     "category" "FoodCategory" NOT NULL,
ALTER COLUMN "density" SET DEFAULT 1.0;
