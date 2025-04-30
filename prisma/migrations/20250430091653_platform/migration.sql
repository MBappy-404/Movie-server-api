-- CreateTable
CREATE TABLE "Platform" (
    "id" TEXT NOT NULL,
    "platformName" TEXT NOT NULL,
    "platformLogo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);
