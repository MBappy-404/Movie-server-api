/*
  Warnings:

  - A unique constraint covering the columns `[userId,contentId]` on the table `payments` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,contentId]` on the table `userPurchaseContents` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "payments_userId_contentId_key" ON "payments"("userId", "contentId");

-- CreateIndex
CREATE UNIQUE INDEX "userPurchaseContents_userId_contentId_key" ON "userPurchaseContents"("userId", "contentId");
