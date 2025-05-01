/*
  Warnings:

  - Added the required column `movieLink` to the `userPurchaseContents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userPurchaseContents" ADD COLUMN     "movieLink" TEXT NOT NULL;
