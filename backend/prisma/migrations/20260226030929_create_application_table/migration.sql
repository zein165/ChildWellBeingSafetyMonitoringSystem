-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('INSTALLED', 'REMOVED');

-- CreateTable
CREATE TABLE "Application" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "packageName" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "versionName" TEXT NOT NULL,
    "versionCode" INTEGER NOT NULL,
    "status" "ApplicationStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Application_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Application_childId_idx" ON "Application"("childId");

-- CreateIndex
CREATE UNIQUE INDEX "Application_childId_packageName_key" ON "Application"("childId", "packageName");

-- AddForeignKey
ALTER TABLE "Application" ADD CONSTRAINT "Application_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
