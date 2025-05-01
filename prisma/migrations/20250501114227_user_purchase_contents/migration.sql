-- CreateEnum
CREATE TYPE "purchaseStatus" AS ENUM ('RENTED', 'BOUGHT');

-- CreateTable
CREATE TABLE "UserPurchaseContents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "status" "purchaseStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPurchaseContents_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserPurchaseContents" ADD CONSTRAINT "UserPurchaseContents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPurchaseContents" ADD CONSTRAINT "UserPurchaseContents_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
