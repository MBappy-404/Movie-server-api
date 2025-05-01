-- CreateTable
CREATE TABLE "movieLinks" (
    "id" TEXT NOT NULL,
    "contentId" TEXT NOT NULL,
    "movieLink" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "movieLinks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "movieLinks" ADD CONSTRAINT "movieLinks_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
