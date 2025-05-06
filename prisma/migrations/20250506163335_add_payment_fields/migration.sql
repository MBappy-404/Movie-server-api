/*
  Warnings:

  - Added the required column `originalAmount` to the `payments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "discountPercentage" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "originalAmount" DOUBLE PRECISION NOT NULL;
