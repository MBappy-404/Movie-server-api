/*
  Warnings:

  - You are about to drop the column `movieLink` on the `contentLinks` table. All the data in the column will be lost.
  - Added the required column `contentLink` to the `contentLinks` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contentLinks" DROP COLUMN "movieLink",
ADD COLUMN     "contentLink" TEXT NOT NULL;
