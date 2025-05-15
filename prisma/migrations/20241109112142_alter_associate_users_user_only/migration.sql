/*
  Warnings:

  - You are about to drop the column `serviceId` on the `Job` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[locationId]` on the table `Job` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[jobId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_serviceId_fkey";

-- AlterTable
ALTER TABLE "Job" DROP COLUMN "serviceId",
ADD COLUMN     "categoryId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Job_locationId_key" ON "Job"("locationId");

-- CreateIndex
CREATE UNIQUE INDEX "User_jobId_key" ON "User"("jobId");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
