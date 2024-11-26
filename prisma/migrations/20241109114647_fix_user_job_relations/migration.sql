/*
  Warnings:

  - You are about to drop the column `jobId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assignedJobId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_jobId_fkey";

-- DropIndex
DROP INDEX "Job_locationId_key";

-- DropIndex
DROP INDEX "User_jobId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "jobId",
ADD COLUMN     "assignedJobId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_assignedJobId_key" ON "User"("assignedJobId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_assignedJobId_fkey" FOREIGN KEY ("assignedJobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
