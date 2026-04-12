-- CreateTable
CREATE TABLE "ApplicationUsage" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "duration" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplicationUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ApplicationUsage_applicationId_idx" ON "ApplicationUsage"("applicationId");

-- CreateIndex
CREATE UNIQUE INDEX "ApplicationUsage_applicationId_date_key" ON "ApplicationUsage"("applicationId", "date");

-- AddForeignKey
ALTER TABLE "ApplicationUsage" ADD CONSTRAINT "ApplicationUsage_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
