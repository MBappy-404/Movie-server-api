/*
  Warnings:

  - You are about to drop the `movieLinks` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "movieLinks" DROP CONSTRAINT "movieLinks_contentId_fkey";

-- DropTable
DROP TABLE "movieLinks";

-- CreateTable
CREATE TABLE "contentLinks" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "movieLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contentLinks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "contentLinks" ADD CONSTRAINT "contentLinks_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
