/*
  Warnings:

  - You are about to drop the column `versionCode` on the `Application` table. All the data in the column will be lost.
  - You are about to drop the column `versionName` on the `Application` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Application" DROP COLUMN "versionCode",
DROP COLUMN "versionName";
