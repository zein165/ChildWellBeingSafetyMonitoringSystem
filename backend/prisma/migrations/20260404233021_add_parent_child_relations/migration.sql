/*
  Warnings:

  - A unique constraint covering the columns `[childId]` on the table `ChildRelation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ChildRelation_childId_key" ON "ChildRelation"("childId");

-- AddForeignKey
ALTER TABLE "ChildRelation" ADD CONSTRAINT "ChildRelation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildRelation" ADD CONSTRAINT "ChildRelation_childId_fkey" FOREIGN KEY ("childId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
