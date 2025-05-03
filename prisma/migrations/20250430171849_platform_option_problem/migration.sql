/*
  Warnings:

  - Made the column `platformId` on table `contents` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "contents" DROP CONSTRAINT "contents_platformId_fkey";

-- AlterTable
ALTER TABLE "contents" ALTER COLUMN "platformId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "contents" ADD CONSTRAINT "contents_platformId_fkey" FOREIGN KEY ("platformId") REFERENCES "platforms"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
